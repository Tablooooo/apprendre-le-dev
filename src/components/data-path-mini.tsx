import Link from 'next/link'
import type { Zone } from '../data/curriculum'

const nodes: { zone: Zone; label: string; x: number }[] = [
  { zone: 'navigateur', label: 'Navigateur', x: 8 },
  { zone: 'http', label: 'HTTP', x: 132 },
  { zone: 'serveur', label: 'Serveur', x: 256 },
  { zone: 'bdd', label: 'Base de données', x: 380 },
]

export function DataPathMini({ zone, step = 'Échange HTTP' }: { zone: Zone; step?: string }) {
  return <figure className="path-mini"><figcaption><span>LE PARCOURS DE LA DONNÉE</span><strong>{step}</strong></figcaption><svg viewBox="0 0 500 94" role="img" aria-labelledby="path-title path-desc"><title id="path-title">Parcours de la donnée</title><desc id="path-desc">Le navigateur envoie une requête au serveur via HTTP. Le serveur peut lire ou écrire dans la base, puis renvoyer une réponse.</desc><defs><marker id="arrow-mini" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7 Z" fill="currentColor" /></marker></defs><path className="path-request" d="M120 34 H130 M244 34 H254 M368 34 H378" markerEnd="url(#arrow-mini)"/><path className="path-response" d="M380 62 H370 M256 62 H246 M132 62 H122" markerEnd="url(#arrow-mini)"/>{nodes.map(({ zone: nodeZone, label, x }) => <g className={`path-node ${zone === nodeZone ? 'path-node-active' : ''}`} key={nodeZone}><rect x={x} y="20" width="112" height="25" rx="5"/><text x={x + 56} y="36" textAnchor="middle">{label}</text></g>)}<text className="path-label" x="250" y="13" textAnchor="middle">requête →</text><text className="path-label" x="250" y="82" textAnchor="middle">← réponse</text></svg><p>Cette leçon zoome sur <strong>{zone}</strong>. Le schéma complet distingue aussi ce qui n’est pas visible côté navigateur.</p><Link className="mini-path-link" href="/parcours">Explorer les scénarios interactifs <span aria-hidden="true">→</span></Link></figure>
}
