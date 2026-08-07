import { apiClient, type ApiResponse } from '@/api/apiClient'
import type { ProblemDetail, ProblemDifficulty, ProblemsListResponse } from '@/types/problem.types'

export type FetchProblemsParams = {
  page?: number
  limit?: number
  difficulty?: ProblemDifficulty
  tag?: string
}

/** GET /problems/list — published problems for the home table. */
export async function fetchProblems(
  params: FetchProblemsParams = {},
): Promise<ProblemsListResponse> {
  const response = await apiClient.get<ApiResponse<ProblemsListResponse>>('/problems/list', {
    params,
  })

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to fetch problems')
  }

  return response.data.data
}

/** Temporary mock until GET /problems/:slug (or similar) exists. */
export async function fetchProblemBySlug(slug: string): Promise<ProblemDetail | null> {
  const { MOCK_PROBLEMS } = await import('@/data/mockProblems')
  return (
    MOCK_PROBLEMS.find(
      (problem) => problem.problem_slug_name === slug && problem.status === 'PUBLISHED',
    ) ?? null
  )
}
