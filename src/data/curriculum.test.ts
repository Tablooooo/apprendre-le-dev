import { describe, expect, it } from 'vitest'
import { concepts, lessons, modules } from './curriculum'

describe('programme pédagogique', () => {
  it('donne une destination à chaque concept', () => {
    const lessonIds = new Set(lessons.map(({ id }) => id))
    expect(concepts).toHaveLength(18)
    expect(concepts.every(({ lessonId }) => lessonIds.has(lessonId))).toBe(true)
  })

  it('référence uniquement des leçons existantes dans les prérequis', () => {
    const lessonIds = new Set(lessons.map(({ id }) => id))
    expect(lessons.every((lesson) => lesson.prerequisites.every((id) => lessonIds.has(id)))).toBe(true)
  })

  it('ordonne les leçons dans un module sans dupliquer leurs identifiants', () => {
    expect(modules.every((module) => new Set(module.lessons.map(({ id }) => id)).size === module.lessons.length)).toBe(true)
  })

  it('contient quatre leçons planifiées dans M0', () => {
    expect(modules.find(({ id }) => id === 'm0')?.lessons.map(({ id }) => id)).toEqual([
      'http-requete-reponse',
      'url-et-adresses',
      'methodes-et-statuts',
      'headers-http',
    ])
  })

  it('décrit les six étapes du parcours de la donnée', () => {
    const m1 = modules.find(({ id }) => id === 'm1')
    expect(m1?.lessons.map(({ id }) => id)).toEqual(['parcours-1', 'parcours-2', 'parcours-3', 'parcours-4', 'parcours-5', 'parcours-6'])
    expect(m1?.lessons.every((lesson) => lesson.conceptIds.length > 0 && lesson.prerequisites.length > 0)).toBe(true)
  })

  it('décrit les neuf étapes du backend avec concepts et prérequis', () => {
    const m2 = modules.find(({ id }) => id === 'm2')
    expect(m2?.lessons.map(({ id }) => id)).toEqual(['backend-1', 'backend-2', 'backend-3', 'backend-4', 'backend-5', 'backend-6', 'backend-7', 'backend-8', 'backend-9'])
    expect(m2?.lessons.every((lesson) => lesson.conceptIds.length > 0 && lesson.prerequisites.length > 0)).toBe(true)
  })

  it('décrit les six étapes frontend avec concepts et prérequis', () => {
    const m3 = modules.find(({ id }) => id === 'm3')
    expect(m3?.lessons.map(({ id }) => id)).toEqual(['frontend-1', 'frontend-2', 'frontend-3', 'frontend-4', 'frontend-5', 'frontend-6'])
    expect(m3?.lessons.every((lesson) => lesson.conceptIds.length > 0 && lesson.prerequisites.length > 0)).toBe(true)
  })

  it('décrit les six étapes de sécurité avec prérequis valides', () => {
    const m4 = modules.find(({ id }) => id === 'm4')
    const lessonIds = new Set(lessons.map(({ id }) => id))
    expect(m4?.lessons.map(({ id }) => id)).toEqual(['securite-1', 'securite-2', 'securite-3', 'securite-4', 'securite-5', 'securite-6'])
    expect(m4?.lessons.every((lesson) => lesson.conceptIds.length > 0 && lesson.prerequisites.every((id) => lessonIds.has(id)))).toBe(true)
  })

  it('décrit les quatre étapes architecture avec prérequis valides', () => {
    const m5 = modules.find(({ id }) => id === 'm5')
    const lessonIds = new Set(lessons.map(({ id }) => id))
    expect(m5?.lessons.map(({ id }) => id)).toEqual(['architecture-1', 'architecture-2', 'architecture-3', 'architecture-4'])
    expect(m5?.lessons.every((lesson) => lesson.conceptIds.length > 0 && lesson.prerequisites.every((id) => lessonIds.has(id)))).toBe(true)
  })
})
