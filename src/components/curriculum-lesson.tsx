'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { contentByLesson } from './content-by-lesson'
import { lessons, modules, type Lesson } from '../data/curriculum'
import { emptyProgress, persistProgress, readProgress, saveLessonDetail, saveLessonStatus, type Progress } from '../lib/progress'
import { mdxComponents } from './mdx-components'

export function CurriculumLesson({ lesson }: { lesson: Lesson }) {
  const Content = contentByLesson[lesson.id]
  const moduleIndex = modules.findIndex((module) => module.id === lesson.moduleId)
  const moduleLessons = modules[moduleIndex]?.lessons ?? []
  const nextLesson = moduleLessons.find((item) => item.order === lesson.order + 1) ?? modules[moduleIndex + 1]?.lessons[0] ?? lessons.find((item) => item.id === lesson.id)
  const [progress, setProgress] = useState<Progress>(emptyProgress)
  const [progressReady, setProgressReady] = useState(false)
  const [selfAssessment, setSelfAssessment] = useState<'reconnu' | 'maitrise' | ''>('')
  useEffect(() => {
    const current = readProgress()
    setProgress(current.lessons[lesson.id] ? current : saveLessonStatus(current, lesson.id, 'en_cours'))
    setProgressReady(true)
  }, [lesson.id])
  useEffect(() => { if (progressReady) persistProgress(progress) }, [progress, progressReady])
  useEffect(() => {
    const details = Array.from(document.querySelectorAll('details'))
    const updateHints = () => setProgress((current) => saveLessonDetail(current, lesson.id, { hintsSeen: Math.max(current.lessons[lesson.id]?.hintsSeen ?? 0, details.filter((element) => element.open).length) }))
    details.forEach((element) => element.addEventListener('toggle', updateHints))
    return () => details.forEach((element) => element.removeEventListener('toggle', updateHints))
  }, [lesson.id])

  const submitAssessment = () => {
    if (selfAssessment) setProgress((current) => saveLessonStatus(current, lesson.id, selfAssessment))
  }
  const exerciseDone = progress.lessons[lesson.id]?.exerciseDone ?? false
  const currentStatus = progress.lessons[lesson.id]?.status
  const markExerciseDone = () => setProgress((current) => saveLessonDetail(current, lesson.id, { exerciseDone: true }))

  return <article className="lesson-page">
    <div className="lesson-breadcrumb"><Link href="/">Mon parcours</Link><span>/</span><span>Module {String(moduleIndex).padStart(2, '0')}</span><span>/</span><span>{lesson.title}</span></div>
    <div className="lesson-layout"><div className="lesson-main">
      <div className="lesson-meta"><span className="lesson-module-tag">MODULE {String(moduleIndex).padStart(2, '0')}</span><span>{lesson.duration} min</span><span>{modules[moduleIndex]?.title}</span></div>
      <Content components={mdxComponents} />
      <button className={`exercise-complete ${exerciseDone ? 'is-complete' : ''}`} type="button" aria-pressed={exerciseDone} onClick={markExerciseDone}>{exerciseDone ? '✓ Exercice réalisé' : 'Marquer l’exercice comme réalisé'}</button>
      <section className="recognition-panel" aria-labelledby="recognition-title"><span className="recognition-flower">✳</span><div><span className="micro-label">RECONNAÎTRE, C’EST DÉJÀ APPRENDRE</span><h2 id="recognition-title">Tu n’as pas à tout maîtriser aujourd’hui.</h2><p>Dis-nous où tu en es. Tu pourras toujours changer ce statut plus tard.</p><div className="self-assess" role="group" aria-label="Autoévaluation de la leçon"><button type="button" className={`assessment-button ${selfAssessment === 'reconnu' ? 'chosen' : ''}`} aria-pressed={selfAssessment === 'reconnu'} onClick={() => setSelfAssessment('reconnu')}>Je reconnais ces idées</button><button type="button" className={`assessment-button ${selfAssessment === 'maitrise' ? 'chosen' : ''}`} aria-pressed={selfAssessment === 'maitrise'} onClick={() => setSelfAssessment('maitrise')}>Je peux les expliquer</button><button type="button" className="button button-dark assessment-save" onClick={submitAssessment} disabled={!selfAssessment}>Enregistrer</button></div>{currentStatus && currentStatus !== 'a_faire' && <p className="saved-note" role="status">Progression enregistrée sur cet appareil.</p>}</div></section>
      <nav className="lesson-pagination" aria-label="Navigation des leçons"><Link href="/#roadmap">← Retour à la roadmap</Link><Link href={`/lecons/${nextLesson?.id ?? lesson.id}`}>Leçon suivante <span aria-hidden="true">→</span></Link></nav>
    </div><aside className="lesson-aside"><div className="aside-sticky"><span className="micro-label">DANS CETTE LEÇON</span><a href="#pourquoi">01 <span>Pourquoi</span></a><a href="#instructions">02 <span>Instructions</span></a><a href="#exercice">03 <span>Exercice</span></a><div className="aside-separator"/><span className="micro-label">AVANT DE COMMENCER</span><p>{lesson.prerequisites.length ? `Prérequis : ${lesson.prerequisites.join(', ')}` : 'Aucun prérequis. On part d’un exemple concret.'}</p><div className="aside-callout"><span>✳</span> Vise la reconnaissance avant la maîtrise.</div></div></aside></div>
  </article>
}
