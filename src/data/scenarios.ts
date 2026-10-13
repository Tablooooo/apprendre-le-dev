import { z } from 'zod'
import { concepts, lessons, type Zone } from './curriculum'

export type ScenarioDirection = 'aller' | 'retour' | 'interne'

export interface ScenarioNode {
  id: string
  label: string
  zone: Zone
  conceptId: string
  lessonId: string
  position: { x: number; y: number }
  observableFromBrowser: boolean
  visibilityNote: string
}

export interface ScenarioStep {
  from: string
  to: string
  label: string
  payload: string
  direction: ScenarioDirection
  observableFromBrowser: boolean
  visibilityNote: string
  status?: string
}

export interface Scenario {
  id: string
  title: string
  description: string
  method: string
  observableResult: string
  nodes: ScenarioNode[]
  steps: ScenarioStep[]
}

const nodes: ScenarioNode[] = [
  { id: 'browser', label: 'Navigateur', zone: 'navigateur', conceptId: 'client-serveur', lessonId: 'http-requete-reponse', position: { x: 40, y: 190 }, observableFromBrowser: true, visibilityNote: 'Action et échanges visibles dans les outils du navigateur.' },
  { id: 'http-request', label: 'Requête HTTP', zone: 'http', conceptId: 'http', lessonId: 'http-requete-reponse', position: { x: 280, y: 190 }, observableFromBrowser: true, visibilityNote: 'Méthode, URL, en-têtes et corps éventuel peuvent être observés dans Réseau.' },
  { id: 'route', label: 'Routage serveur', zone: 'serveur', conceptId: 'routage-serveur', lessonId: 'backend-1', position: { x: 540, y: 70 }, observableFromBrowser: false, visibilityNote: 'Traitement interne explicatif. Le navigateur ne révèle pas quelle route ou quel handler a été exécuté.' },
  { id: 'controller', label: 'Contrôleur', zone: 'serveur', conceptId: 'controleur', lessonId: 'backend-2', position: { x: 540, y: 190 }, observableFromBrowser: false, visibilityNote: 'Étape interne illustrative, pas directement observable depuis la réponse HTTP.' },
  { id: 'service', label: 'Service / règles', zone: 'serveur', conceptId: 'service', lessonId: 'backend-4', position: { x: 540, y: 310 }, observableFromBrowser: false, visibilityNote: 'Logique métier interne. Le détail dépend de l’implémentation du serveur.' },
  { id: 'repository', label: 'Accès aux données', zone: 'bdd', conceptId: 'orm-repository', lessonId: 'backend-5', position: { x: 790, y: 190 }, observableFromBrowser: false, visibilityNote: 'Appel interne à une source de données, non visible dans les DevTools du navigateur.' },
  { id: 'database', label: 'Base de données', zone: 'bdd', conceptId: 'orm-repository', lessonId: 'backend-6', position: { x: 1020, y: 190 }, observableFromBrowser: false, visibilityNote: 'Requêtes SQL, stockage et résultat interne ne sont pas observables depuis le navigateur.' },
  { id: 'http-response', label: 'Réponse HTTP', zone: 'http', conceptId: 'methodes-statuts', lessonId: 'methodes-et-statuts', position: { x: 790, y: 390 }, observableFromBrowser: true, visibilityNote: 'Statut, en-têtes et corps éventuellement reçus sont observables dans Réseau.' },
]

function step(input: ScenarioStep): ScenarioStep {
  return input
}

const scenarioSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  method: z.string().min(1),
  observableResult: z.string().min(1),
  nodes: z.array(z.object({
    id: z.string().min(1),
    label: z.string().min(1),
    zone: z.enum(['navigateur', 'http', 'serveur', 'bdd', 'transversal']),
    conceptId: z.string().min(1),
    lessonId: z.string().min(1),
    position: z.object({ x: z.number(), y: z.number() }),
    observableFromBrowser: z.boolean(),
    visibilityNote: z.string().min(1),
  })).min(2),
  steps: z.array(z.object({
    from: z.string().min(1),
    to: z.string().min(1),
    label: z.string().min(1),
    payload: z.string().min(1),
    direction: z.enum(['aller', 'retour', 'interne']),
    observableFromBrowser: z.boolean(),
    visibilityNote: z.string().min(1),
    status: z.string().optional(),
  })).min(1),
}).superRefine((scenario, context) => {
  const nodeIds = new Set(scenario.nodes.map((node) => node.id))
  const conceptIds = new Set(concepts.map((concept) => concept.id))
  const lessonIds = new Set(lessons.map((lesson) => lesson.id))
  if (nodeIds.size !== scenario.nodes.length) context.addIssue({ code: 'custom', message: `Nœuds dupliqués dans ${scenario.id}` })
  scenario.nodes.forEach((node, index) => {
    if (!conceptIds.has(node.conceptId)) context.addIssue({ code: 'custom', path: ['nodes', index, 'conceptId'], message: `Concept inconnu: ${node.conceptId}` })
    if (!lessonIds.has(node.lessonId)) context.addIssue({ code: 'custom', path: ['nodes', index, 'lessonId'], message: `Leçon inconnue: ${node.lessonId}` })
  })
  scenario.steps.forEach((step, index) => {
    if (!nodeIds.has(step.from) || !nodeIds.has(step.to)) context.addIssue({ code: 'custom', path: ['steps', index], message: 'Une étape doit référencer deux nœuds existants' })
    if (step.direction === 'interne' && step.observableFromBrowser) context.addIssue({ code: 'custom', path: ['steps', index, 'observableFromBrowser'], message: 'Une étape interne ne peut pas être marquée observable depuis le navigateur' })
    if (step.direction !== 'interne' && !step.observableFromBrowser) context.addIssue({ code: 'custom', path: ['steps', index, 'observableFromBrowser'], message: 'Une étape réseau doit décrire un échange observable côté navigateur' })
  })
})

const scenarioDefinitions: Scenario[] = [
  {
    id: 'inscription', title: 'Inscription', description: 'Camille envoie les champs fictifs de son formulaire.', method: 'POST', observableResult: 'Le navigateur peut observer le statut et le corps de réponse effectivement reçus.', nodes,
    steps: [
      step({ from: 'browser', to: 'http-request', label: 'Le navigateur envoie le formulaire', payload: 'POST /api/inscription · champs de test', direction: 'aller', observableFromBrowser: true, visibilityNote: 'La requête, sa méthode et son corps peuvent être inspectés côté navigateur.' }),
      step({ from: 'http-request', to: 'route', label: 'La requête atteint le serveur', payload: 'Chemin + méthode', direction: 'aller', observableFromBrowser: true, visibilityNote: 'Le navigateur peut observer l’échange, mais pas confirmer quel code serveur le reçoit.' }),
      step({ from: 'route', to: 'controller', label: 'La route délègue au traitement', payload: 'Sélection d’un handler (modèle explicatif)', direction: 'interne', observableFromBrowser: false, visibilityNote: 'Le routage et le handler réellement exécutés sont internes au serveur.' }),
      step({ from: 'controller', to: 'service', label: 'Les règles d’inscription sont appliquées', payload: 'Validation et règles métier (exemple)', direction: 'interne', observableFromBrowser: false, visibilityNote: 'Ces étapes sont explicatives; leur présence et leur ordre ne sont pas déductibles des DevTools.' }),
      step({ from: 'service', to: 'repository', label: 'Le serveur peut demander une écriture', payload: 'Opération de persistance (hypothèse pédagogique)', direction: 'interne', observableFromBrowser: false, visibilityNote: 'Le navigateur ne montre pas si une écriture a eu lieu ni par quel composant.' }),
      step({ from: 'repository', to: 'database', label: 'Le stockage traite l’opération', payload: 'Détail de stockage non observé', direction: 'interne', observableFromBrowser: false, visibilityNote: 'SQL et stockage sont invisibles depuis le navigateur.' }),
      step({ from: 'http-response', to: 'browser', label: 'Une réponse revient', payload: 'Statut et corps selon le serveur', direction: 'retour', observableFromBrowser: true, visibilityNote: 'La réponse reçue est observable; elle ne prouve pas à elle seule le stockage interne.' }),
    ],
  },
  {
    id: 'connexion', title: 'Connexion', description: 'Mehdi observe une tentative de connexion avec des identifiants de test, sans exposer de secret.', method: 'POST', observableResult: 'Le navigateur voit la réponse HTTP, mais son statut seul ne prouve pas une authentification réussie.', nodes,
    steps: [
      step({ from: 'browser', to: 'http-request', label: 'Le formulaire envoie une tentative', payload: 'POST /api/connexion · identifiants fictifs', direction: 'aller', observableFromBrowser: true, visibilityNote: 'Méthode, URL et réponse sont observables; ne pas copier ni partager le corps secret.' }),
      step({ from: 'http-request', to: 'route', label: 'Le serveur reçoit la requête', payload: 'Requête de connexion', direction: 'aller', observableFromBrowser: true, visibilityNote: 'Le navigateur observe la requête, pas la vérification interne des identifiants.' }),
      step({ from: 'route', to: 'controller', label: 'Le traitement de connexion est sélectionné', payload: 'Handler (modèle explicatif)', direction: 'interne', observableFromBrowser: false, visibilityNote: 'Le handler exécuté est une étape interne non confirmable depuis le navigateur.' }),
      step({ from: 'controller', to: 'service', label: 'L’application tente d’authentifier', payload: 'Vérification côté serveur (exemple)', direction: 'interne', observableFromBrowser: false, visibilityNote: 'Les règles et vérifications précises sont internes et dépendent du système.' }),
      step({ from: 'service', to: 'repository', label: 'Le système peut retrouver un compte', payload: 'Accès à une source d’identité (hypothèse)', direction: 'interne', observableFromBrowser: false, visibilityNote: 'Le navigateur ne voit pas si une base, un fournisseur externe ou un autre mécanisme est consulté.' }),
      step({ from: 'repository', to: 'database', label: 'Une source interne peut être consultée', payload: 'Stockage non observable', direction: 'interne', observableFromBrowser: false, visibilityNote: 'Le stockage réel n’est pas observable depuis les outils du navigateur.' }),
      step({ from: 'http-response', to: 'browser', label: 'L’application reçoit le résultat HTTP', payload: 'Statut + réponse fonctionnelle éventuelle', direction: 'retour', observableFromBrowser: true, visibilityNote: 'Un statut HTTP seul ne prouve pas que l’authentification a réussi.' }),
    ],
  },
  {
    id: 'lecture-liste', title: 'Lecture d’une liste', description: 'Inès demande une liste et compare la réponse aux éléments affichés.', method: 'GET', observableResult: 'Le statut et le corps de réponse peuvent être observés; la source des données reste inconnue.', nodes,
    steps: [
      step({ from: 'browser', to: 'http-request', label: 'La page demande les recettes', payload: 'GET /api/recettes', direction: 'aller', observableFromBrowser: true, visibilityNote: 'La requête GET et son URL sont observables dans Réseau.' }),
      step({ from: 'http-request', to: 'route', label: 'La requête atteint le serveur', payload: 'GET + chemin', direction: 'aller', observableFromBrowser: true, visibilityNote: 'L’échange est observable, pas le routage interne.' }),
      step({ from: 'route', to: 'controller', label: 'Le traitement de lecture est appelé', payload: 'Route / handler (exemple)', direction: 'interne', observableFromBrowser: false, visibilityNote: 'Le navigateur ne peut pas confirmer la structure du code serveur.' }),
      step({ from: 'controller', to: 'service', label: 'La demande de liste est traitée', payload: 'Logique applicative (exemple)', direction: 'interne', observableFromBrowser: false, visibilityNote: 'Le traitement interne est illustratif et non observable côté navigateur.' }),
      step({ from: 'service', to: 'repository', label: 'Le système peut récupérer des éléments', payload: 'Lecture (hypothèse de modèle)', direction: 'interne', observableFromBrowser: false, visibilityNote: 'Les DevTools ne montrent pas la source réelle ni le nombre de lectures internes.' }),
      step({ from: 'repository', to: 'database', label: 'La source interne fournit des données', payload: 'Détail SQL non observé', direction: 'interne', observableFromBrowser: false, visibilityNote: 'Une requête SQL éventuelle n’est pas visible depuis le navigateur.' }),
      step({ from: 'http-response', to: 'browser', label: 'Le navigateur reçoit une représentation', payload: '200 · corps JSON possible', direction: 'retour', observableFromBrowser: true, visibilityNote: 'Le statut et le corps effectivement reçus peuvent être observés; le stockage ne peut pas être déduit.' }),
    ],
  },
  {
    id: 'creation-recette', title: 'Création d’une recette', description: 'Sofia suit une création fictive et distingue confirmation HTTP et persistance réelle.', method: 'POST', observableResult: '201 Created · statut observable, stockage interne non vérifié par cette seule réponse.', nodes,
    steps: [
      step({ from: 'browser', to: 'http-request', label: 'La recette de test est envoyée', payload: 'POST /api/recettes · titre et ingrédients fictifs', direction: 'aller', observableFromBrowser: true, visibilityNote: 'La requête et les valeurs envoyées sont observables dans Réseau.' }),
      step({ from: 'http-request', to: 'route', label: 'Le serveur reçoit la demande de création', payload: 'POST + corps de requête', direction: 'aller', observableFromBrowser: true, visibilityNote: 'La demande est observable; le traitement qui suit ne l’est pas.' }),
      step({ from: 'route', to: 'controller', label: 'Le serveur choisit un traitement', payload: 'Routage (modèle explicatif)', direction: 'interne', observableFromBrowser: false, visibilityNote: 'Le routage interne n’est pas visible depuis le navigateur.' }),
      step({ from: 'controller', to: 'service', label: 'Les règles de création s’appliquent', payload: 'Validation et règles (exemple)', direction: 'interne', observableFromBrowser: false, visibilityNote: 'Ces détails sont illustratifs; seule l’implémentation permet de les confirmer.' }),
      step({ from: 'service', to: 'repository', label: 'Le système peut persister la recette', payload: 'Opération de création (hypothèse)', direction: 'interne', observableFromBrowser: false, visibilityNote: 'Le statut 201 ne permet pas de vérifier directement la base ou le stockage.' }),
      step({ from: 'repository', to: 'database', label: 'La source de données traite la demande', payload: 'Écriture interne non observée', direction: 'interne', observableFromBrowser: false, visibilityNote: 'Les écritures et requêtes SQL ne sont pas visibles côté navigateur.' }),
      step({ from: 'http-response', to: 'browser', label: 'Le serveur répond', payload: '201 Created · corps selon l’API', direction: 'retour', observableFromBrowser: true, visibilityNote: 'Un statut 201 est observable et a une sémantique HTTP de création; il ne prouve pas le stockage interne.' , status: '201 Created' }),
    ],
  },
  {
    id: 'erreur-404', title: 'Réponse 404', description: 'Une ressource cible n’est pas trouvée ou le serveur choisit de ne pas révéler son existence.', method: 'GET', observableResult: '404 Not Found · réponse visible, cause exacte non déductible du statut seul.', nodes,
    steps: [
      step({ from: 'browser', to: 'http-request', label: 'Le navigateur demande une ressource', payload: 'GET /recettes/inconnue', direction: 'aller', observableFromBrowser: true, visibilityNote: 'URL et méthode de la demande sont visibles.' }),
      step({ from: 'http-request', to: 'route', label: 'La requête est reçue', payload: 'GET + chemin demandé', direction: 'aller', observableFromBrowser: true, visibilityNote: 'La requête est observable; la raison interne de la réponse ne l’est pas.' }),
      step({ from: 'route', to: 'controller', label: 'Le serveur décide de la réponse', payload: 'Cause non inférable depuis le navigateur', direction: 'interne', observableFromBrowser: false, visibilityNote: 'Le statut seul ne révèle ni la route ni la cause exacte; RFC 9110 autorise aussi à ne pas révéler l’existence d’une cible interdite.' }),
      step({ from: 'http-response', to: 'browser', label: 'Le navigateur reçoit 404', payload: '404 Not Found · corps éventuel', direction: 'retour', observableFromBrowser: true, visibilityNote: 'Le statut et le corps éventuel sont observables; la cause précise reste à vérifier.', status: '404 Not Found' }),
    ],
  },
  {
    id: 'erreur-500', title: 'Réponse 500', description: 'Une erreur interne générique est signalée, mais le statut ne révèle pas l’exception précise.', method: 'GET', observableResult: '500 Internal Server Error · statut visible, exception interne invisible.', nodes,
    steps: [
      step({ from: 'browser', to: 'http-request', label: 'Le navigateur envoie une demande', payload: 'GET /api/recettes', direction: 'aller', observableFromBrowser: true, visibilityNote: 'La requête et la réponse reçue sont observables.' }),
      step({ from: 'http-request', to: 'route', label: 'Le serveur reçoit la requête', payload: 'GET + chemin', direction: 'aller', observableFromBrowser: true, visibilityNote: 'L’échange est observable, pas l’exception interne.' }),
      step({ from: 'route', to: 'controller', label: 'Une erreur survient pendant le traitement', payload: 'Cause inconnue pour le navigateur', direction: 'interne', observableFromBrowser: false, visibilityNote: 'Le statut 500 ne nomme ni l’exception, ni la ligne fautive, ni l’état de la base.' }),
      step({ from: 'http-response', to: 'browser', label: 'Le navigateur reçoit une erreur serveur', payload: '500 Internal Server Error · corps éventuel', direction: 'retour', observableFromBrowser: true, visibilityNote: 'Le statut est observable; consulter les journaux serveur autorisés peut être nécessaire pour diagnostiquer la cause.', status: '500 Internal Server Error' }),
    ],
  },
]

export function parseScenarios(input: unknown): Scenario[] {
  return z.array(scenarioSchema).parse(input) as Scenario[]
}

export const scenarios = parseScenarios(scenarioDefinitions)
