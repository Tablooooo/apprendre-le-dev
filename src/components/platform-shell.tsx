'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { concepts, lessons, modules } from '../data/curriculum'
import { emptyProgress, persistProgress, readProgress, type Progress } from '../lib/progress'

export function PlatformShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [progress, setProgress] = useState<Progress>(emptyProgress)
  const [progressReady, setProgressReady] = useState(false)
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => { setProgress(readProgress()); setProgressReady(true) }, [])
  useEffect(() => { if (progressReady) persistProgress(progress) }, [progress, progressReady])

  const results = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('fr')
    if (!query) return []
    const matchingConcepts = concepts.filter((concept) => `${concept.name} ${concept.summary} ${concept.keywords.join(' ')}`.toLocaleLowerCase('fr').includes(query))
    const matchingLessons = lessons.filter((lesson) => {
      const conceptNames = concepts.filter((concept) => lesson.conceptIds.includes(concept.id)).map((concept) => concept.name)
      return `${lesson.title} ${lesson.summary} ${lesson.keywords.join(' ')} ${conceptNames.join(' ')}`.toLocaleLowerCase('fr').includes(query)
    })
    return [
      ...matchingConcepts.map((concept) => ({ id: concept.id, label: concept.name, kind: 'Concept', href: `/lecons/${concept.lessonId}` })),
      ...matchingLessons.map((lesson) => ({ id: lesson.id, label: lesson.title, kind: 'Leçon', href: `/lecons/${lesson.id}` })),
    ].slice(0, 7)
  }, [search])

  const completedCount = Object.values(progress.lessons).filter((item) => item.status === 'reconnu' || item.status === 'maitrise').length
  const currentLesson = progress.lastLesson ? lessons.find((lesson) => lesson.id === progress.lastLesson) : undefined

  return <div className="app-frame">
    <a className="skip-link" href="#contenu">Aller au contenu</a>
    <aside className="sidebar" aria-label="Navigation principale">
      <Link className="brand" href="/" aria-label="Apprendre le dev de A à Z, accueil"><span className="brand-mark">&lt;/&gt;</span><span>apprendre<span className="brand-light">le dev</span></span></Link>
      <p className="sidebar-label">APPRENDRE</p>
      <nav className="main-nav">
        <Link className={`nav-link ${pathname === '/' ? 'is-active' : ''}`} href="/"><span className="nav-glyph">⌂</span> Mon parcours</Link>
        <a className="nav-link" href="/#roadmap"><span className="nav-glyph">☷</span> Roadmap</a>
        <a className="nav-link" href="/#concepts"><span className="nav-glyph">⌘</span> Carte des concepts</a>
        <Link className={`nav-link ${pathname === '/parcours' ? 'is-active' : ''}`} href="/parcours"><span className="nav-glyph">↔</span> Parcours de la donnée</Link>
      </nav>
      <div className="sidebar-rule" />
      <p className="sidebar-label">LES MODULES</p>
      <nav className="module-nav" aria-label="Modules de formation">
        {modules.map((module, index) => <a className="module-link" href={`/#${module.id}`} key={module.id}><span className={`module-index ${index === 0 ? 'module-current' : ''}`}>{String(index).padStart(2, '0')}</span><span>{module.title}</span></a>)}
      </nav>
      <div className="sidebar-bottom"><div className="learner-mark">✳</div><p>Tu apprends à comprendre,<br />pas à tout retenir.</p></div>
    </aside>

    <div className="main-column">
      <header className="topbar">
        <div className="breadcrumbs"><span>Ton espace</span><span className="crumb-separator">/</span><strong>{pathname.startsWith('/lecons') ? 'Leçon' : 'Mon parcours'}</strong></div>
        <div className="topbar-actions">
          <div className="search-wrap">
            <label className="sr-only" htmlFor="site-search">Rechercher un concept ou une leçon</label>
            <span className="search-icon" aria-hidden="true">⌕</span>
            <input id="site-search" type="search" value={search} onChange={(event) => { setSearch(event.target.value); setSearchOpen(true) }} onFocus={() => setSearchOpen(true)} onKeyDown={(event) => { if (event.key === 'Escape') setSearchOpen(false) }} placeholder="Chercher un concept…" />
            <kbd>⌘ K</kbd>
            {searchOpen && search.trim() && <div className="search-results" role="listbox" aria-label="Résultats de recherche">{results.length ? results.map((result) => <Link role="option" aria-selected="false" href={result.href} key={`${result.kind}-${result.id}`} onClick={() => { setSearch(''); setSearchOpen(false) }}><span>{result.label}</span><small>{result.kind}</small></Link>) : <p>Aucun résultat. Essaie un autre mot.</p>}</div>}
          </div>
          <button className="avatar" type="button" aria-label="Profil d’apprentissage">A</button>
        </div>
      </header>

      <main id="contenu" className="main-content" onClick={() => searchOpen && setSearchOpen(false)}>
        {children}
      </main>
      <footer className="site-footer"><span>Apprendre le dev de A à Z</span><span>Comprendre avant de mémoriser.</span></footer>
    </div>

    <output className="sr-only" aria-live="polite">{completedCount} leçons reconnues. {currentLesson ? `Dernière leçon : ${currentLesson.title}.` : ''}</output>
  </div>
}
