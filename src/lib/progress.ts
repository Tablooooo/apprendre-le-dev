import { z } from 'zod'
import type { LessonStatus } from '../data/curriculum'

const lessonProgressSchema = z.object({
  status: z.enum(['a_faire', 'en_cours', 'reconnu', 'maitrise']),
  hintsSeen: z.number().int().min(0).default(0),
  exerciseDone: z.boolean().default(false),
  updatedAt: z.string(),
})

const progressSchema = z.object({
  version: z.literal(1),
  lessons: z.record(z.string(), lessonProgressSchema),
  lastLesson: z.string().optional(),
})

export type Progress = z.infer<typeof progressSchema>
export const emptyProgress: Progress = { version: 1, lessons: {} }
const STORAGE_KEY = 'apprendre-dev-progress-v1'

export function readProgress(): Progress {
  if (typeof window === 'undefined') return emptyProgress
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? 'null')
    return progressSchema.parse(value)
  } catch {
    return emptyProgress
  }
}

export function saveLessonStatus(progress: Progress, lessonId: string, status: LessonStatus): Progress {
  const previous = progress.lessons[lessonId]
  return {
    version: 1,
    lastLesson: lessonId,
    lessons: {
      ...progress.lessons,
      [lessonId]: {
        status,
        hintsSeen: previous?.hintsSeen ?? 0,
        exerciseDone: previous?.exerciseDone ?? false,
        updatedAt: new Date().toISOString(),
      },
    },
  }
}

export function saveLessonDetail(progress: Progress, lessonId: string, update: { hintsSeen?: number; exerciseDone?: boolean }): Progress {
  const previous = progress.lessons[lessonId]
  return {
    version: 1,
    lastLesson: lessonId,
    lessons: {
      ...progress.lessons,
      [lessonId]: {
        status: previous?.status ?? 'en_cours',
        hintsSeen: update.hintsSeen ?? previous?.hintsSeen ?? 0,
        exerciseDone: update.exerciseDone ?? previous?.exerciseDone ?? false,
        updatedAt: new Date().toISOString(),
      },
    },
  }
}

export function persistProgress(progress: Progress): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progressSchema.parse(progress)))
}
