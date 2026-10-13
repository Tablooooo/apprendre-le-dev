export type Zone = 'navigateur' | 'http' | 'serveur' | 'bdd' | 'transversal'
export type LessonStatus = 'a_faire' | 'en_cours' | 'reconnu' | 'maitrise'

export interface Concept {
  id: string
  name: string
  summary: string
  zone: Zone
  lessonId: string
  keywords: string[]
  contrasts?: string[]
}

export interface Lesson {
  id: string
  moduleId: string
  title: string
  order: number
  summary: string
  prerequisites: string[]
  conceptIds: string[]
  zone: Zone
  keywords: string[]
  duration: number
}

export interface Module {
  id: string
  title: string
  description: string
  lessons: Lesson[]
}

export const concepts: Concept[] = [
  { id: 'client-serveur', name: 'Client / serveur', summary: 'Deux rôles qui échangent des messages sur un réseau.', zone: 'navigateur', lessonId: 'http-requete-reponse', keywords: ['web', 'navigateur', 'serveur'] },
  { id: 'url', name: 'URL', summary: 'L’adresse qui identifie une ressource et aide à la localiser.', zone: 'navigateur', lessonId: 'url-et-adresses', keywords: ['adresse', 'lien', 'route'] },
  { id: 'http', name: 'Requête / réponse HTTP', summary: 'Le format d’échange entre un client HTTP et un serveur HTTP.', zone: 'http', lessonId: 'http-requete-reponse', keywords: ['requête', 'response', 'protocole'] },
  { id: 'methodes-statuts', name: 'Méthodes et statuts', summary: 'La méthode décrit l’intention ; le statut résume le résultat HTTP.', zone: 'http', lessonId: 'methodes-et-statuts', keywords: ['GET', 'POST', '200', '404'] },
  { id: 'headers', name: 'Headers', summary: 'Des métadonnées qui accompagnent requêtes et réponses.', zone: 'http', lessonId: 'headers-http', keywords: ['en-têtes', 'content-type'] },
  { id: 'routage-serveur', name: 'Routage serveur', summary: 'Associer une requête entrante à un traitement du serveur.', zone: 'serveur', lessonId: 'backend-1', keywords: ['route', 'endpoint', 'chemin'] },
  { id: 'controleur', name: 'Contrôleur', summary: 'Recevoir une requête et coordonner la réponse HTTP.', zone: 'serveur', lessonId: 'backend-2', keywords: ['handler', 'requête'] },
  { id: 'dto-validation', name: 'DTO et validation', summary: 'Décrire et vérifier les données attendues à une frontière.', zone: 'serveur', lessonId: 'backend-3', keywords: ['entrée', 'schéma', 'validation'] },
  { id: 'service', name: 'Service / logique métier', summary: 'Appliquer les règles propres au domaine de l’application.', zone: 'serveur', lessonId: 'backend-4', keywords: ['règle', 'métier'] },
  { id: 'orm-repository', name: 'Entité, ORM et repository', summary: 'Représenter et retrouver des données persistées.', zone: 'bdd', lessonId: 'backend-5', keywords: ['base', 'données', 'SQL'] },
  { id: 'serialisation', name: 'Sérialisation', summary: 'Transformer une valeur en représentation transmissible.', zone: 'serveur', lessonId: 'backend-7', keywords: ['JSON', 'sortie'] },
  { id: 'evenements-hooks', name: 'Événements / hooks', summary: 'Points d’insertion déclenchés à des moments définis du cycle.', zone: 'transversal', lessonId: 'backend-8', keywords: ['cycle de vie', 'callback'] },
  { id: 'injection-dependances', name: 'Injection de dépendances', summary: 'Fournir à un composant les objets dont il dépend.', zone: 'transversal', lessonId: 'backend-9', keywords: ['DI', 'service', 'câblage'], contrasts: ['Événements/hooks'] },
  { id: 'composants-etat-contexte', name: 'Composants, état et contexte', summary: 'Construire l’interface à partir de morceaux et de données évolutives.', zone: 'navigateur', lessonId: 'frontend-1', keywords: ['React', 'UI', 'state'] },
  { id: 'routage-client', name: 'Routage client', summary: 'Choisir quelle vue afficher selon l’URL dans une application web.', zone: 'navigateur', lessonId: 'frontend-4', keywords: ['page', 'navigation'], contrasts: ['Client HTTP'] },
  { id: 'client-http', name: 'Client HTTP', summary: 'Le code qui envoie une requête HTTP depuis le navigateur.', zone: 'navigateur', lessonId: 'frontend-5', keywords: ['fetch', 'axios', 'API'], contrasts: ['Routage client'] },
  { id: 'intercepteurs', name: 'Intercepteurs', summary: 'Code qui observe ou transforme des échanges dans un client HTTP.', zone: 'http', lessonId: 'frontend-6', keywords: ['middleware', 'requête', 'réponse'] },
  { id: 'auth-securite', name: 'Authentification, jetons et sécurité', summary: 'Identifier une personne et protéger les échanges et ressources.', zone: 'transversal', lessonId: 'securite-1', keywords: ['JWT', 'session', 'XSS'] },
]

const referenceLesson: Lesson = {
  id: 'http-requete-reponse', moduleId: 'm0', title: 'Une requête, une réponse', order: 1,
  summary: 'Suivre le trajet d’une inscription du clic jusqu’au serveur et retour.',
  prerequisites: [], conceptIds: ['client-serveur', 'url', 'http', 'methodes-statuts', 'headers'],
  zone: 'http', keywords: ['HTTP', 'inscription', 'requête', 'réponse', 'client', 'serveur'], duration: 12,
}

export const modules: Module[] = [
  { id: 'm0', title: 'Le web, c’est quoi ?', description: 'Poser les repères avant d’écrire du code.', lessons: [referenceLesson,
    { ...referenceLesson, id: 'url-et-adresses', title: 'Lire une URL sans deviner', order: 2, summary: 'Distinguer domaine, chemin et paramètres.', conceptIds: ['url'], keywords: ['URL', 'adresse'] },
    { ...referenceLesson, id: 'methodes-et-statuts', title: 'Intention et résultat HTTP', order: 3, summary: 'Comprendre méthodes, statuts et leurs limites.', conceptIds: ['methodes-statuts'], keywords: ['GET', 'POST', 'statut'] },
    { ...referenceLesson, id: 'headers-http', title: 'Les informations autour du message', order: 4, summary: 'Lire quelques en-têtes utiles sans apprendre une liste par cœur.', conceptIds: ['headers'], keywords: ['headers', 'content-type'] },
  ] },
  { id: 'm1', title: 'Le parcours de la donnée', description: 'Suivre plusieurs échanges concrets de bout en bout.', lessons: [
    { ...referenceLesson, id: 'parcours-1', moduleId: 'm1', title: 'Inscription : envoyer des données', order: 1, prerequisites: ['http-requete-reponse'], conceptIds: ['http', 'methodes-statuts', 'headers'], summary: 'Observer les données envoyées et la réponse sans supposer le stockage interne.', keywords: ['inscription', 'POST', 'formulaire'], duration: 15 },
    { ...referenceLesson, id: 'parcours-2', moduleId: 'm1', title: 'Connexion : retrouver une identité', order: 2, prerequisites: ['parcours-1'], conceptIds: ['auth-securite', 'http'], summary: 'Distinguer une réponse HTTP du constat fonctionnel d’authentification.', keywords: ['connexion', 'authentification', 'session'], duration: 15 },
    { ...referenceLesson, id: 'parcours-3', moduleId: 'm1', title: 'Lire une liste depuis le serveur', order: 3, prerequisites: ['parcours-1'], conceptIds: ['http', 'headers'], summary: 'Relier une réponse contenant des données à une liste affichée.', keywords: ['GET', 'liste', 'JSON', 'lecture'], duration: 15 },
    { ...referenceLesson, id: 'parcours-4', moduleId: 'm1', title: 'Créer une recette', order: 4, prerequisites: ['parcours-1', 'parcours-3'], conceptIds: ['methodes-statuts', 'http'], summary: 'Suivre une création sans confondre statut et persistance.', keywords: ['création', 'recette', 'POST'], duration: 15 },
    { ...referenceLesson, id: 'parcours-5', moduleId: 'm1', title: 'Comprendre les erreurs 404 et 500', order: 5, prerequisites: ['http-requete-reponse', 'methodes-et-statuts'], conceptIds: ['methodes-statuts', 'http'], summary: 'Utiliser les statuts comme indices, pas comme diagnostic complet.', keywords: ['404', '500', 'erreur'], duration: 15 },
    { ...referenceLesson, id: 'parcours-6', moduleId: 'm1', title: 'Observer une requête dans les DevTools', order: 6, prerequisites: ['parcours-1', 'parcours-3', 'parcours-5'], conceptIds: ['http', 'headers', 'url'], summary: 'Rendre une observation réseau reproductible et distinguer faits et hypothèses.', keywords: ['DevTools', 'Network', 'Fetch', 'XHR'], duration: 15 },
  ] },
  { id: 'm2', title: 'Le backend', description: 'Découvrir les rôles du serveur et le trajet jusqu’aux données.', lessons: [
    { ...referenceLesson, id: 'backend-1', moduleId: 'm2', title: 'Le routage côté serveur', order: 1, prerequisites: ['parcours-6'], conceptIds: ['routage-serveur'], summary: 'Associer une méthode et un chemin à un traitement côté serveur.', keywords: ['route', 'endpoint', 'chemin'], duration: 18 },
    { ...referenceLesson, id: 'backend-2', moduleId: 'm2', title: 'Le contrôleur reçoit la requête', order: 2, prerequisites: ['backend-1'], conceptIds: ['controleur'], summary: 'Repérer le point d’entrée du traitement applicatif après le routage.', keywords: ['handler', 'requête'], duration: 18 },
    { ...referenceLesson, id: 'backend-3', moduleId: 'm2', title: 'Valider ce qui entre avec un DTO', order: 3, prerequisites: ['backend-2'], conceptIds: ['dto-validation'], summary: 'Décrire la forme des entrées et vérifier les contraintes côté serveur.', keywords: ['DTO', 'entrée', 'schéma', 'validation'], duration: 18 },
    { ...referenceLesson, id: 'backend-4', moduleId: 'm2', title: 'Confier les règles à un service', order: 4, prerequisites: ['backend-3'], conceptIds: ['service'], summary: 'Distinguer les règles métier de la réception et réponse HTTP.', keywords: ['règle', 'métier', 'service'], duration: 18 },
    { ...referenceLesson, id: 'backend-5', moduleId: 'm2', title: 'Lire et enregistrer avec un repository', order: 5, prerequisites: ['backend-4'], conceptIds: ['orm-repository'], summary: 'Suivre la couche qui regroupe des opérations d’accès aux données.', keywords: ['repository', 'dépôt', 'lecture', 'écriture'], duration: 18 },
    { ...referenceLesson, id: 'backend-6', moduleId: 'm2', title: 'ORM et entités : représenter les données', order: 6, prerequisites: ['backend-5'], conceptIds: ['orm-repository'], summary: 'Comparer le modèle du code au mapping vers le stockage relationnel.', keywords: ['ORM', 'entité', 'mapping', 'modèle'], duration: 18 },
    { ...referenceLesson, id: 'backend-7', moduleId: 'm2', title: 'Préparer la réponse avec la sérialisation', order: 7, prerequisites: ['backend-4', 'backend-6'], conceptIds: ['serialisation'], summary: 'Transformer une représentation choisie en contenu transmissible.', keywords: ['JSON', 'réponse', 'sortie'], duration: 18 },
    { ...referenceLesson, id: 'backend-8', moduleId: 'm2', title: 'Événements et hooks', order: 8, prerequisites: ['backend-4'], conceptIds: ['evenements-hooks'], summary: 'Distinguer point de réaction et câblage des dépendances.', keywords: ['événement', 'hook', 'cycle de vie'], duration: 18 },
    { ...referenceLesson, id: 'backend-9', moduleId: 'm2', title: 'Injection de dépendances', order: 9, prerequisites: ['backend-4'], conceptIds: ['injection-dependances'], summary: 'Comprendre comment les composants reçoivent leurs dépendances.', keywords: ['injection', 'DI', 'câblage'], duration: 18 },
  ] },
  { id: 'm3', title: 'Le frontend', description: 'Comprendre comment le navigateur présente et demande des données.', lessons: [
    { ...referenceLesson, id: 'frontend-1', moduleId: 'm3', title: 'Composants : construire l’interface', order: 1, prerequisites: ['backend-2'], conceptIds: ['composants-etat-contexte'], summary: 'Découper une interface en motifs réutilisables alimentés par des données.', keywords: ['React', 'composant', 'props', 'interface'], duration: 18 },
    { ...referenceLesson, id: 'frontend-2', moduleId: 'm3', title: 'État : quand l’interface évolue', order: 2, prerequisites: ['frontend-1'], conceptIds: ['composants-etat-contexte'], summary: 'Représenter une valeur changeante et distinguer état local de persistance.', keywords: ['state', 'clic', 'favori', 'rendu'], duration: 18 },
    { ...referenceLesson, id: 'frontend-3', moduleId: 'm3', title: 'Contexte : partager une valeur', order: 3, prerequisites: ['frontend-1', 'frontend-2'], conceptIds: ['composants-etat-contexte'], summary: 'Mettre une valeur à disposition de composants descendants.', keywords: ['Context', 'provider', 'props', 'React'], duration: 18 },
    { ...referenceLesson, id: 'frontend-4', moduleId: 'm3', title: 'Routage client : choisir la page', order: 4, prerequisites: ['frontend-1'], conceptIds: ['routage-client'], summary: 'Relier navigation et URL à la vue présentée, sans la confondre avec une API.', keywords: ['route', 'navigation', 'page', 'URL'], duration: 18 },
    { ...referenceLesson, id: 'frontend-5', moduleId: 'm3', title: 'Client HTTP : demander des données', order: 5, prerequisites: ['frontend-1', 'parcours-3'], conceptIds: ['client-http'], summary: 'Envoyer une requête depuis le navigateur et traiter réponse ou erreur.', keywords: ['fetch', 'Axios', 'API', 'requête'], duration: 18 },
    { ...referenceLesson, id: 'frontend-6', moduleId: 'm3', title: 'Intercepteurs : entourer les échanges', order: 6, prerequisites: ['frontend-5'], conceptIds: ['intercepteurs'], summary: 'Comprendre les traitements transversaux propres à certains clients HTTP.', keywords: ['intercepteur', 'middleware', 'requête', 'réponse'], duration: 18 },
  ] },
  { id: 'm4', title: 'Authentification et sécurité', description: 'Identifier les personnes et réduire les risques courants.', lessons: [
    { ...referenceLesson, id: 'securite-1', moduleId: 'm4', title: 'Session ou jeton ?', order: 1, prerequisites: ['frontend-5'], conceptIds: ['auth-securite'], summary: 'Distinguer état de session et jetons sans les traiter comme synonymes.', keywords: ['session', 'jeton', 'cookie', 'authentification'], duration: 20 },
    { ...referenceLesson, id: 'securite-2', moduleId: 'm4', title: 'Comprendre le rôle d’un JWT', order: 2, prerequisites: ['securite-1'], conceptIds: ['auth-securite'], summary: 'Séparer encodage, signature et chiffrement dans les JWT.', keywords: ['JWT', 'claims', 'signature', 'JWS', 'JWE'], duration: 20 },
    { ...referenceLesson, id: 'securite-3', moduleId: 'm4', title: 'Où garder un jeton ?', order: 3, prerequisites: ['securite-1', 'securite-2'], conceptIds: ['auth-securite'], summary: 'Comparer les risques de stockage navigateur selon la menace.', keywords: ['localStorage', 'cookie', 'HttpOnly', 'CSRF'], duration: 20 },
    { ...referenceLesson, id: 'securite-4', moduleId: 'm4', title: 'XSS : quand du contenu devient du code', order: 4, prerequisites: ['frontend-1', 'frontend-2'], conceptIds: ['auth-securite'], summary: 'Reconnaître le risque de contenu non fiable interprété comme code.', keywords: ['XSS', 'DOM', 'rendu', 'HTML'], duration: 20 },
    { ...referenceLesson, id: 'securite-5', moduleId: 'm4', title: 'Pourquoi valider aussi côté serveur', order: 5, prerequisites: ['backend-3', 'frontend-5'], conceptIds: ['auth-securite', 'dto-validation'], summary: 'Distinguer validation d’entrée et autorisation à la frontière serveur.', keywords: ['validation', 'serveur', 'autorisation', 'entrée'], duration: 20 },
    { ...referenceLesson, id: 'securite-6', moduleId: 'm4', title: 'Réflexes de sécurité web', order: 6, prerequisites: ['securite-1', 'securite-3', 'securite-4', 'securite-5'], conceptIds: ['auth-securite'], summary: 'Examiner plusieurs contrôles défensifs sur un même parcours.', keywords: ['sécurité', 'menace', 'journaux', 'défense'], duration: 20 },
  ] },
  { id: 'm5', title: 'Architecture et bonnes pratiques', description: 'Faire évoluer un projet en gardant le code compréhensible.', lessons: [
    { ...referenceLesson, id: 'architecture-1', moduleId: 'm5', title: 'Séparer les responsabilités', order: 1, prerequisites: ['securite-6'], conceptIds: ['service'], summary: 'Clarifier les rôles du code sans ajouter de couches inutiles.', keywords: ['architecture', 'responsabilité', 'contrôleur', 'service'], duration: 20 },
    { ...referenceLesson, id: 'architecture-2', moduleId: 'm5', title: 'Tester le comportement attendu', order: 2, prerequisites: ['architecture-1'], conceptIds: ['service'], summary: 'Exprimer une attente observable et connaître la portée de sa preuve.', keywords: ['test', 'assertion', 'cas limite'], duration: 20 },
    { ...referenceLesson, id: 'architecture-3', moduleId: 'm5', title: 'Choisir des conventions utiles', order: 3, prerequisites: ['architecture-1'], conceptIds: ['service'], summary: 'Rendre le code plus navigable avec des conventions vérifiables.', keywords: ['convention', 'nommage', 'formatage'], duration: 20 },
    { ...referenceLesson, id: 'architecture-4', moduleId: 'm5', title: 'Garder un codebase sain', order: 4, prerequisites: ['architecture-2', 'architecture-3'], conceptIds: ['service'], summary: 'Vérifier que l’installation et les contrôles documentés fonctionnent réellement.', keywords: ['codebase', 'dépendances', 'README', 'maintenance'], duration: 20 },
  ] },
]

export const lessons = modules.flatMap((module) => module.lessons)
export const zoneLabels: Record<Zone, string> = { navigateur: 'Navigateur', http: 'HTTP', serveur: 'Serveur', bdd: 'Base de données', transversal: 'Transversal' }
