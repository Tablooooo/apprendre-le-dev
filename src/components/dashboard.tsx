'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { Concept, Lesson, Module, Zone } from '../data/curriculum'
import { emptyProgress, persistProgress, readProgress, saveLessonStatus, type Progress } from '../lib/progress'

const iconFor: Record<Zone, string> = { navigateur: '◉', http: '↔', serveur: '▤', bdd: '▦', transversal: '✳' }

export function Dashboard({ modules, concepts, lessons, zoneLabels }: { modules: Module[]; concepts: Concept[]; lessons: Lesson[]; zoneLabels: Record<Zone, string> }) {
  const [progress, setProgress] = useState<Progress>(emptyProgress)
  const [progressReady, setProgressReady] = useState(false)
  const [filter, setFilter] = useState('Tous')
  const [expandedModule, setExpandedModule] = useState('m0')
  useEffect(() => { setProgress(readProgress()); setProgressReady(true) }, [])
  useEffect(() => { if (progressReady) persistProgress(progress) }, [progress, progressReady])

  const done = Object.values(progress.lessons).filter((item) => ['reconnu', 'maitrise'].includes(item.status)).length
  const total = lessons.length
  const lastLesson = lessons.find((lesson) => lesson.id === progress.lastLesson)
  const continueLesson = lastLesson ? `/lecons/${lastLesson.id}` : '/lecons/http-requete-reponse'
  const filteredConcepts = filter === 'Tous' ? concepts : concepts.filter((concept) => zoneLabels[concept.zone] === filter)
  const setLessonStarted = (lessonId: string) => setProgress((current) => saveLessonStatus(current, lessonId, 'en_cours'))

  return <>
    <section className="welcome-row" aria-labelledby="welcome-title">
      <div><div className="eyebrow"><span className="eyebrow-dot" /> TON ESPACE D’APPRENTISSAGE</div><h1 id="welcome-title">Le web, <em>sans zone floue.</em></h1><p className="welcome-copy">On va suivre les données, du clic jusqu’à la réponse. Un concept à la fois, et toujours avec un vrai exemple.</p><div className="welcome-note"><span>✳</span> Pour la première lecture, le but est de reconnaître les idées. La maîtrise vient avec la pratique.</div></div>
      <div className="welcome-art" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="orbit-core">&lt; / &gt;</div><span className="orbit-node node-browser">navigateur</span><span className="orbit-node node-http">HTTP</span><span className="orbit-node node-server">serveur</span><span className="orbit-node node-data">données</span><span className="orbit-spark spark-a">✳</span><span className="orbit-spark spark-b">·</span></div>
    </section>

    <section className="resume-panel" aria-label="Reprendre ton apprentissage">
      <div className="resume-label"><span className="resume-icon">↗</span><div><span className="micro-label">LÀ OÙ TU EN ES</span><strong>{done ? `${done} leçon${done > 1 ? 's' : ''} reconnue${done > 1 ? 's' : ''}` : 'Tout commence par un premier échange'}</strong></div></div>
      <div className="progress-track" role="progressbar" aria-label="Progression des leçons" aria-valuenow={done} aria-valuemin={0} aria-valuemax={total}><span style={{ width: `${total ? (done / total) * 100 : 0}%` }} /></div>
      <span className="progress-numbers">{done}<span> / {total}</span></span>
      <Link href={continueLesson} onClick={() => setLessonStarted(lastLesson?.id ?? 'http-requete-reponse')} className="button button-dark">{progress.lastLesson ? 'Continuer' : 'Commencer'} <span aria-hidden="true">→</span></Link>
    </section>

    <section className="path-launch section-block" aria-labelledby="path-launch-title"><div><div className="eyebrow section-eyebrow">EXPLORATION INTERACTIVE</div><h2 id="path-launch-title">Suis une requête jusqu’à sa réponse</h2><p>Compare inscription, connexion, lecture et erreurs. Distingue ce que le navigateur observe de ce qui reste interne au serveur.</p></div><Link className="button button-dark" href="/parcours">Explorer les parcours <span aria-hidden="true">→</span></Link></section>

    <section className="section-block" id="roadmap" aria-labelledby="roadmap-title">
      <div className="section-heading"><div><div className="eyebrow section-eyebrow">LE CHEMIN, PAS À PAS</div><h2 id="roadmap-title">La roadmap</h2><p>Chaque étape s’appuie sur celles déjà vues. Tu peux suivre l’ordre ou explorer.</p></div><span className="section-count">{modules.length} modules <i>·</i> {total} leçons</span></div>
      <div className="roadmap-list">{modules.map((module, index) => {
        const moduleDone = module.lessons.filter((lesson) => ['reconnu', 'maitrise'].includes(progress.lessons[lesson.id]?.status ?? '')).length
        const isExpanded = expandedModule === module.id
        return <article className={`roadmap-module ${isExpanded ? 'module-expanded' : ''}`} id={module.id} key={module.id}>
          <div className="roadmap-marker"><span>{isExpanded ? '●' : String(index).padStart(2, '0')}</span></div>
          <div className="module-body"><button className="module-toggle" type="button" aria-expanded={isExpanded} aria-controls={`lessons-${module.id}`} onClick={() => setExpandedModule(isExpanded ? '' : module.id)}><span className="module-toggle-copy"><span className="module-kicker">MODULE {String(index).padStart(2, '0')}</span><strong>{module.title}</strong></span><span className="module-toggle-meta"><span className="module-progress">{moduleDone}/{module.lessons.length} reconnues</span><span className="module-chevron" aria-hidden="true">⌄</span></span></button><p>{module.description}</p>
            <ol className="lesson-list" id={`lessons-${module.id}`} hidden={!isExpanded}>{module.lessons.map((lesson, lessonIndex) => {
              const status = progress.lessons[lesson.id]?.status ?? 'a_faire'
              const available = lessonIndex === 0 || Boolean(progress.lessons[lesson.prerequisites[0]]?.status && progress.lessons[lesson.prerequisites[0]]?.status !== 'a_faire')
              return <li className="lesson-row" key={lesson.id}><span className={`lesson-status status-${status}`} aria-label={status === 'reconnu' ? 'Leçon reconnue' : available ? 'Leçon disponible' : 'Prérequis à voir'}>{status === 'reconnu' ? '✓' : available ? '○' : '·'}</span><div className="lesson-row-copy"><Link href={`/lecons/${lesson.id}`} onClick={() => setLessonStarted(lesson.id)}>{lesson.title}</Link><small>{lesson.duration} min <span>·</span> {lesson.summary}</small>{lesson.prerequisites.length > 0 && <small className="prerequisite">Prérequis : {lessons.find((item) => item.id === lesson.prerequisites[0])?.title ?? 'étape précédente'}</small>}</div><Link className="lesson-arrow" aria-label={`Ouvrir ${lesson.title}`} href={`/lecons/${lesson.id}`} onClick={() => setLessonStarted(lesson.id)}>{lesson.id === 'http-requete-reponse' ? '↗' : '·'}</Link></li>
            })}</ol>
          </div>
        </article>
      })}</div>
    </section>

    <section className="section-block concept-section" id="concepts" aria-labelledby="concept-title">
      <div className="section-heading"><div><div className="eyebrow section-eyebrow">TON VOCABULAIRE DU WEB</div><h2 id="concept-title">Carte des concepts</h2><p>Les outils changent. Les idées qu’ils incarnent restent.</p></div><span className="section-count">{concepts.length} concepts</span></div>
      <div className="concept-filters" role="group" aria-label="Filtrer les concepts par zone">{['Tous', ...Object.values(zoneLabels)].map((label) => <button key={label} type="button" className={`filter-button ${filter === label ? 'selected' : ''}`} aria-pressed={filter === label} onClick={() => setFilter(label)}>{label}</button>)}</div>
      <div className="concept-table-wrap"><table className="concept-table"><thead><tr><th scope="col">Concept</th><th scope="col">Dans le parcours</th><th scope="col">Statut</th><th scope="col"><span className="sr-only">Leçon</span></th></tr></thead><tbody>{filteredConcepts.map((concept) => { const status = progress.lessons[concept.lessonId]?.status; return <tr key={concept.id}><td><span className="concept-glyph">{iconFor[concept.zone]}</span><span><strong>{concept.name}</strong><small>{concept.summary}</small>{concept.contrasts?.map((contrast) => <small className="contrast-note" key={contrast}>À distinguer de {contrast}</small>)}</span></td><td><span className={`zone-tag zone-${concept.zone}`}>{zoneLabels[concept.zone]}</span></td><td><span className={`recognition-status ${status === 'reconnu' || status === 'maitrise' ? 'recognized' : ''}`}>{status === 'reconnu' || status === 'maitrise' ? '✓ Reconnu' : 'À découvrir'}</span></td><td><Link className="table-link" href={`/lecons/${concept.lessonId}`}>Voir <span aria-hidden="true">↗</span></Link></td></tr> })}</tbody></table></div>
      <div className="concept-footnote"><span>✳</span> Chaque concept s’ancre à un endroit du trajet de la donnée. Clique pour le retrouver dans une leçon.</div>
    </section>
  </>
}
