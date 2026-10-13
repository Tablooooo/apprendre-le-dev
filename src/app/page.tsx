import { concepts, lessons, modules, zoneLabels } from '../data/curriculum'
import { Dashboard } from '../components/dashboard'

export default function HomePage() {
  return <Dashboard modules={modules} concepts={concepts} lessons={lessons} zoneLabels={zoneLabels} />
}
