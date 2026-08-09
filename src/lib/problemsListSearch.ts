import { z } from 'zod'

import type { FetchProblemsParams } from '@/api/problemsApi'
import type { ProblemDifficulty } from '@/types/problem.types'

/** Align with backend `listProblemsQuerySchema` defaults. */
export const PROBLEMS_LIST_DEFAULT_PAGE = 1
export const PROBLEMS_LIST_DEFAULT_LIMIT = 20
export const PROBLEMS_LIST_MAX_LIMIT = 100

export const PROBLEMS_LIST_PAGE_SIZE_OPTIONS = [10, 20, 50] as const

const difficultySchema = z.enum(['EASY', 'MEDIUM', 'HARD'])

export const problemsListSearchSchema = z.object({
  page: z.coerce.number().int().min(1).catch(PROBLEMS_LIST_DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(PROBLEMS_LIST_MAX_LIMIT)
    .catch(PROBLEMS_LIST_DEFAULT_LIMIT),
  difficulty: z.preprocess(
    (value) => (value === '' || value === null || value === undefined ? undefined : value),
    difficultySchema.optional(),
  ),
  tag: z.preprocess(
    (value) => (typeof value === 'string' && value.trim() ? value.trim() : undefined),
    z.string().min(1).optional(),
  ),
})

export type ProblemsListSearch = {
  page?: number
  limit?: number
  difficulty?: ProblemDifficulty
  tag?: string
}

export function parseProblemsListSearch(search: Record<string, unknown>): ProblemsListSearch {
  return problemsListSearchSchema.parse(search)
}

export function resolveProblemsListSearch(
  search: ProblemsListSearch,
): Required<Pick<ProblemsListSearch, 'page' | 'limit'>> & ProblemsListSearch {
  return {
    page: search.page ?? PROBLEMS_LIST_DEFAULT_PAGE,
    limit: search.limit ?? PROBLEMS_LIST_DEFAULT_LIMIT,
    difficulty: search.difficulty,
    tag: search.tag,
  }
}

export function toFetchProblemsParams(search: ProblemsListSearch): FetchProblemsParams {
  const resolved = resolveProblemsListSearch(search)
  return {
    page: resolved.page,
    limit: resolved.limit,
    ...(resolved.difficulty ? { difficulty: resolved.difficulty } : {}),
    ...(resolved.tag ? { tag: resolved.tag } : {}),
  }
}
