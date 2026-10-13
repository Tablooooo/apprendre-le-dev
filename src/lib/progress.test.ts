import { describe, expect, it } from 'vitest'
import { emptyProgress, saveLessonDetail, saveLessonStatus } from './progress'

describe('progression de la leçon', () => {
  it('marque une leçon reconnue sans perdre son état précédent', () => {
    const withHints = saveLessonDetail(emptyProgress, 'http', { hintsSeen: 2, exerciseDone: true })
    const recognized = saveLessonStatus(withHints, 'http', 'reconnu')

    expect(recognized.lastLesson).toBe('http')
    expect(recognized.lessons.http).toMatchObject({ status: 'reconnu', hintsSeen: 2, exerciseDone: true })
  })

  it('enregistre une autoévaluation comme maîtrise sans inventer une réussite d’exercice', () => {
    const mastered = saveLessonStatus(emptyProgress, 'http', 'maitrise')

    expect(mastered.lessons.http).toMatchObject({ status: 'maitrise', hintsSeen: 0, exerciseDone: false })
  })
})
