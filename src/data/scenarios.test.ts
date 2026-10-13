import { describe, expect, it } from 'vitest'
import { concepts, lessons } from './curriculum'
import { parseScenarios, scenarios } from './scenarios'

describe('parcours de la donnée', () => {
  it('propose les flux requis et distingue les erreurs 404 et 500', () => {
    expect(scenarios.map(({ id }) => id)).toEqual(['inscription', 'connexion', 'lecture-liste', 'creation-recette', 'erreur-404', 'erreur-500'])
    expect(scenarios.find(({ id }) => id === 'creation-recette')?.steps.some(({ status }) => status === '201 Created')).toBe(true)
    expect(scenarios.find(({ id }) => id === 'erreur-404')?.steps.some(({ status }) => status?.startsWith('404'))).toBe(true)
    expect(scenarios.find(({ id }) => id === 'erreur-500')?.steps.some(({ status }) => status?.startsWith('500'))).toBe(true)
    expect(scenarios.map(({ observableResult }) => observableResult).join(' ')).toContain('201 Created')
    expect(scenarios.map(({ observableResult }) => observableResult).join(' ')).toContain('404 Not Found')
    expect(scenarios.map(({ observableResult }) => observableResult).join(' ')).toContain('500 Internal Server Error')
  })

  it('référence des zones, concepts, leçons et nœuds valides', () => {
    const zones = new Set(['navigateur', 'http', 'serveur', 'bdd', 'transversal'])
    const conceptIds = new Set(concepts.map(({ id }) => id))
    const lessonIds = new Set(lessons.map(({ id }) => id))

    for (const scenario of scenarios) {
      const nodeIds = new Set(scenario.nodes.map(({ id }) => id))
      expect(nodeIds.size).toBe(scenario.nodes.length)
      for (const node of scenario.nodes) {
        expect(zones.has(node.zone)).toBe(true)
        expect(conceptIds.has(node.conceptId)).toBe(true)
        expect(lessonIds.has(node.lessonId)).toBe(true)
      }
      for (const step of scenario.steps) {
        expect(nodeIds.has(step.from)).toBe(true)
        expect(nodeIds.has(step.to)).toBe(true)
        expect(step.visibilityNote.length).toBeGreaterThan(0)
      }
    }
  })

  it('marque explicitement les opérations serveur et base comme non observables', () => {
    for (const scenario of scenarios) {
      const internalSteps = scenario.steps.filter(({ direction }) => direction === 'interne')
      expect(internalSteps.length).toBeGreaterThan(0)
      expect(internalSteps.every(({ observableFromBrowser }) => !observableFromBrowser)).toBe(true)
    }
  })

  it('rejette les étapes qui référencent un nœud absent', () => {
    expect(() => parseScenarios([{ ...scenarios[0], steps: [{ ...scenarios[0].steps[0], to: 'missing-node' }] }])).toThrow()
  })
})
