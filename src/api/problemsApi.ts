import axios from 'axios'
import { apiClient, type ApiResponse } from '@/api/apiClient'
import type { ProblemDetail, ProblemDifficulty, ProblemsListResponse } from '@/types/problem.types'

export type FetchProblemsParams = {
  page?: number
  limit?: number
  difficulty?: ProblemDifficulty
  tag?: string
}

/** GET /problems — published problems for the home table. */
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

/** GET /problems/:slug — published problem detail for the solve workspace. */
export async function fetchProblemBySlug(slug: string): Promise<ProblemDetail | null> {
  try {
    const response = await apiClient.get<ApiResponse<ProblemDetail>>(`/problems/get/${slug}`)

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch problem')
    }

    return response.data.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null
    }
    throw error
  }
}
