'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { Lesson } from '../data/curriculum'
import { emptyProgress, persistProgress, readProgress, saveLessonDetail, saveLessonStatus, type Progress } from '../lib/progress'
import { mdxComponents } from './mdx-components'
import LessonContent from '../../content/m0-http-requete-reponse.mdx'

export function ReferenceLesson({ lesson }: { lesson: Lesson }) {
  const [progress, setProgress] = useState<Progress>(emptyProgress)
  const [progressReady, setProgressReady] = useState(false)
  const [selfAssessment, setSelfAssessment] = useState<'reconnu' | 'maitrise' | ''>('')
  useEffect(() => {
    const current = readProgress()
    const status = current.lessons[lesson.id]?.status
    setProgress(status ? current : saveLessonStatus(current, lesson.id, 'en_cours'))
    setProgressReady(true)
  }, [lesson.id])
  useEffect(() => { if (progressReady) persistProgress(progress) }, [progress, progressReady])
  useEffect(() => {
    const details = Array.from(document.querySelectorAll('details'))
    const updateHints = () => {
      const count = details.filter((element) => element.open).length
      setProgress((current) => saveLessonDetail(current, lesson.id, { hintsSeen: count }))
    }
    details.forEach((element) => element.addEventListener('toggle', updateHints))
    return () => details.forEach((element) => element.removeEventListener('toggle', updateHints))
  }, [lesson.id])

  const submitAssessment = () => {
    if (!selfAssessment) return
    setProgress((current) => saveLessonStatus(current, lesson.id, selfAssessment))
  }

  const markExerciseDone = () => setProgress((current) => saveLessonDetail(current, lesson.id, { exerciseDone: true }))
  const exerciseDone = progress.lessons[lesson.id]?.exerciseDone ?? false
  const currentStatus = progress.lessons[lesson.id]?.status
  return <article className="lesson-page">
    <div className="lesson-breadcrumb"><Link href="/">Mon parcours</Link><span>/</span><span>Module 00</span><span>/</span><span>Le web, c’est quoi ?</span></div>
    <div className="lesson-layout">
      <div className="lesson-main"><div className="lesson-meta"><span className="lesson-module-tag">MODULE 00</span><span>12 min</span><span>HTTP · fondations</span></div>
        <LessonContent components={mdxComponents} />
        <button className={`exercise-complete ${exerciseDone ? 'is-complete' : ''}`} type="button" aria-pressed={exerciseDone} onClick={markExerciseDone}>{exerciseDone ? '✓ Exercice réalisé' : 'Marquer l’exercice comme réalisé'}</button>
        <section className="recognition-panel" aria-labelledby="recognition-title"><span className="recognition-flower">✳</span><div><span className="micro-label">RECONNAÎTRE, C’EST DÉJÀ APPRENDRE</span><h2 id="recognition-title">Tu n’as pas à tout maîtriser aujourd’hui.</h2><p>Dis-nous où tu en es. Tu pourras toujours changer ce statut plus tard.</p><div className="self-assess" role="group" aria-label="Autoévaluation de la leçon"><button type="button" className={`assessment-button ${selfAssessment === 'reconnu' ? 'chosen' : ''}`} aria-pressed={selfAssessment === 'reconnu'} onClick={() => setSelfAssessment('reconnu')}>Je reconnais ces idées</button><button type="button" className={`assessment-button ${selfAssessment === 'maitrise' ? 'chosen' : ''}`} aria-pressed={selfAssessment === 'maitrise'} onClick={() => setSelfAssessment('maitrise')}>Je peux les expliquer</button><button type="button" className="button button-dark assessment-save" onClick={submitAssessment} disabled={!selfAssessment}>Enregistrer</button></div>{currentStatus && currentStatus !== 'a_faire' && <p className="saved-note" role="status">Progression enregistrée sur cet appareil.</p>}</div></section>
        <nav className="lesson-pagination" aria-label="Navigation des leçons"><Link href="/#roadmap">← Retour à la roadmap</Link><Link href="/#roadmap">Leçon suivante <span aria-hidden="true">→</span></Link></nav>
      </div>
      <aside className="lesson-aside"><div className="aside-sticky"><span className="micro-label">DANS CETTE LEÇON</span><a href="#pourquoi">01 <span>Pourquoi</span></a><a href="#instructions">02 <span>Instructions</span></a><a href="#exercice">03 <span>Exercice</span></a><div className="aside-separator"/><span className="micro-label">AVANT DE COMMENCER</span><p>Aucun prérequis. On part de ce que tu connais déjà : un navigateur et une page web.</p><div className="aside-callout"><span>✳</span> Première lecture : vise la reconnaissance, pas la perfection.</div></div></aside>
    </div>
  </article>
}
