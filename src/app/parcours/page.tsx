import type { Metadata } from 'next'
import { DataPathExplorer } from '../../components/data-path-explorer'

export const metadata: Metadata = {
  title: 'Parcours de la donnée · Apprendre le dev de A à Z',
  description: 'Explore des scénarios Web et distingue les échanges observables du traitement interne.',
}

export default function ParcoursPage() {
  return <DataPathExplorer />
}
