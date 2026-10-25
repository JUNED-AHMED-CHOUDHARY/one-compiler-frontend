import axios from 'axios'
import { apiClient, type ApiResponse } from '@/api/apiClient'
import type {
  ProblemDetail,
  ProblemDifficulty,
  ProblemsListResponse,
  ProgrammingLanguage,
} from '@/types/problem.types'

export type FetchProblemsParams = {
  page?: number
  limit?: number
  difficulty?: ProblemDifficulty
  tag?: string
}

export type RunProblemCodeParams = {
  language: ProgrammingLanguage
  source_code: string
  /** Raw input per testcase — one line per param. */
  inputs: string[]
}

export type RunProblemCodeResponse = {
  jobId: string
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

/** GET /problems/get/:slug — published problem detail for the solve workspace. */
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

/** POST /problems/:problemId/run — run samples + custom testcases (poll via GET /code/result/:jobId). */
export async function runProblemCode(
  problemId: string,
  params: RunProblemCodeParams,
): Promise<RunProblemCodeResponse> {
  const response = await apiClient.post<ApiResponse<RunProblemCodeResponse>>(
    `/problems/${problemId}/run`,
    params,
  )

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to start code run')
  }

  return response.data.data
}
