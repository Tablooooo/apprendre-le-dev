import { notFound } from 'next/navigation'
import { concepts, lessons, modules, zoneLabels } from '../../../data/curriculum'
import { PlannedLesson } from '../../../components/planned-lesson'
import { ReferenceLesson } from '../../../components/reference-lesson'
import { CurriculumLesson } from '../../../components/curriculum-lesson'
import { contentByLesson } from '../../../components/content-by-lesson'

export const dynamicParams = false

export function generateStaticParams() {
  return lessons.map(({ id }) => ({ lessonId: id }))
}

export default async function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params
  const lesson = lessons.find(({ id }) => id === lessonId)
  if (!lesson) notFound()
  if (lesson.id === 'http-requete-reponse') return <ReferenceLesson lesson={lesson} />
  if (contentByLesson[lesson.id]) return <CurriculumLesson lesson={lesson} />
  const module = modules.find(({ id }) => id === lesson.moduleId)
  const prereqs = lessons.filter(({ id }) => lesson.prerequisites.includes(id))
  const concept = concepts.find(({ id }) => lesson.conceptIds.includes(id))
  return <PlannedLesson lesson={lesson} moduleTitle={module?.title ?? ''} prerequisiteTitles={prereqs.map(({ title }) => title)} zone={concept ? zoneLabels[concept.zone] : ''} />
}

