import type { MDXComponents } from 'mdx/types'
import { DataPathMini } from './data-path-mini'

function Why({ children, id }: { children: React.ReactNode; id?: string }) {
  return <section id={id} className="lesson-block why-block"><div className="block-heading"><span className="block-icon">01</span><div><span className="micro-label">POURQUOI</span><h2>Une situation réelle</h2></div></div><div className="block-content">{children}</div></section>
}

function Instructions({ children, id }: { children: React.ReactNode; id?: string }) {
  return <section id={id} className="lesson-block instructions-block"><div className="block-heading"><span className="block-icon">02</span><div><span className="micro-label">INSTRUCTIONS</span><h2>À toi d’observer</h2></div></div><div className="block-content">{children}</div></section>
}

function Hint({ children, titre, niveau }: { children: React.ReactNode; titre?: string; niveau: number }) {
  return <details className="hint-item"><summary><span className="hint-number">{String(niveau).padStart(2, '0')}</span><span>{titre ?? `Indice ${niveau}`}</span><span className="hint-chevron" aria-hidden="true">⌄</span></summary><div className="hint-content">{children}</div></details>
}

function Exercise({ children, titre, id }: { children: React.ReactNode; titre?: string; id?: string }) {
  return <section id={id} className="exercise-block"><div className="exercise-heading"><span className="exercise-icon">✳</span><div><span className="micro-label">PETIT EXERCICE</span><h2>{titre ?? 'À toi de jouer'}</h2></div></div><div className="exercise-content">{children}</div></section>
}

function LessonPath({ zone, etape }: { zone: 'navigateur' | 'http' | 'serveur' | 'bdd' | 'transversal'; etape?: string }) {
  return <DataPathMini zone={zone} step={etape} />
}

function Uncertain({ children }: { children: React.ReactNode }) {
  return <aside className="uncertain-note"><strong>Point à vérifier</strong><div>{children}</div></aside>
}

export const mdxComponents: MDXComponents = {
  Pourquoi: Why,
  Instructions,
  Indice: Hint,
  Exercice: Exercise,
  Indices: ({ children }: { children: React.ReactNode }) => <div className="hint-stack"><h2 className="hints-title">Si tu bloques <span>· ouvre un indice à la fois</span></h2>{children}</div>,
  ParcoursMini: LessonPath,
  Incertain: Uncertain,
  h1: (props) => <h1 className="mdx-title" {...props} />,
  p: (props) => <p className="mdx-paragraph" {...props} />,
  strong: (props) => <strong {...props} />,
  code: (props) => <code className="inline-code" {...props} />,
  pre: (props) => <pre className="code-block" {...props} />,
  ol: (props) => <ol className="instruction-list" {...props} />,
  li: (props) => <li {...props} />,
}
