import UrlLesson from '../../content/m0-url-et-adresses.mdx'
import MethodLesson from '../../content/m0-methodes-et-statuts.mdx'
import HeadersLesson from '../../content/m0-headers-http.mdx'
import SignupLesson from '../../content/m1-inscription.mdx'
import LoginLesson from '../../content/m1-connexion.mdx'
import ListLesson from '../../content/m1-lire-une-liste.mdx'
import CreateLesson from '../../content/m1-creer-une-entite.mdx'
import ErrorsLesson from '../../content/m1-erreurs-http.mdx'
import DevToolsLesson from '../../content/m1-devtools.mdx'
import RoutingLesson from '../../content/m2-routage-serveur.mdx'
import ControllerLesson from '../../content/m2-controleur.mdx'
import DtoLesson from '../../content/m2-dto-validation.mdx'
import ServiceLesson from '../../content/m2-service.mdx'
import RepositoryLesson from '../../content/m2-repository.mdx'
import OrmLesson from '../../content/m2-orm-entite.mdx'
import SerializationLesson from '../../content/m2-serialisation.mdx'
import EventsLesson from '../../content/m2-evenements-hooks.mdx'
import DependencyInjectionLesson from '../../content/m2-injection-dependances.mdx'
import ComponentsLesson from '../../content/m3-composants.mdx'
import StateLesson from '../../content/m3-etat.mdx'
import ContextLesson from '../../content/m3-contexte.mdx'
import ClientRoutingLesson from '../../content/m3-routage-client.mdx'
import HttpClientLesson from '../../content/m3-client-http.mdx'
import InterceptorsLesson from '../../content/m3-intercepteurs.mdx'
import SessionTokenLesson from '../../content/m4-session-ou-jeton.mdx'
import JwtLesson from '../../content/m4-jwt.mdx'
import TokenStorageLesson from '../../content/m4-stockage-jeton.mdx'
import XssLesson from '../../content/m4-xss.mdx'
import ServerValidationLesson from '../../content/m4-validation-serveur.mdx'
import SecurityPracticeLesson from '../../content/m4-reflexes-securite.mdx'
import SeparationLesson from '../../content/m5-separation-responsabilites.mdx'
import TestingLesson from '../../content/m5-tests.mdx'
import ConventionsLesson from '../../content/m5-conventions.mdx'
import CodebaseHygieneLesson from '../../content/m5-hygiene-codebase.mdx'

export const contentByLesson: Record<string, typeof UrlLesson> = {
  'url-et-adresses': UrlLesson,
  'methodes-et-statuts': MethodLesson,
  'headers-http': HeadersLesson,
  'parcours-1': SignupLesson,
  'parcours-2': LoginLesson,
  'parcours-3': ListLesson,
  'parcours-4': CreateLesson,
  'parcours-5': ErrorsLesson,
  'parcours-6': DevToolsLesson,
  'backend-1': RoutingLesson,
  'backend-2': ControllerLesson,
  'backend-3': DtoLesson,
  'backend-4': ServiceLesson,
  'backend-5': RepositoryLesson,
  'backend-6': OrmLesson,
  'backend-7': SerializationLesson,
  'backend-8': EventsLesson,
  'backend-9': DependencyInjectionLesson,
  'frontend-1': ComponentsLesson,
  'frontend-2': StateLesson,
  'frontend-3': ContextLesson,
  'frontend-4': ClientRoutingLesson,
  'frontend-5': HttpClientLesson,
  'frontend-6': InterceptorsLesson,
  'securite-1': SessionTokenLesson,
  'securite-2': JwtLesson,
  'securite-3': TokenStorageLesson,
  'securite-4': XssLesson,
  'securite-5': ServerValidationLesson,
  'securite-6': SecurityPracticeLesson,
  'architecture-1': SeparationLesson,
  'architecture-2': TestingLesson,
  'architecture-3': ConventionsLesson,
  'architecture-4': CodebaseHygieneLesson,
}
