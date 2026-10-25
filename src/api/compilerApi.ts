import { apiClient } from '@/api/apiClient'
import type { JobState } from '@/types/bull.types'

export interface RunResponse {
  jobId: string
}

/** The job's return value is spread onto the response — `{ output }` for playground runs. */
export type StatusResponse<TResult = { output?: string }> = {
  jobId: string
  status: JobState
  error?: string
} & Partial<TResult>

export const submitCode = async (
  language: string,
  code: string,
  stdin: string = '',
): Promise<RunResponse> => {
  const response = await apiClient.post<RunResponse>('/code/run', { language, code, stdin })
  return response.data
}

export const checkJobStatus = async <TResult = { output?: string }>(
  jobId: string,
): Promise<StatusResponse<TResult>> => {
  const response = await apiClient.get<StatusResponse<TResult>>(`/code/result/${jobId}`)
  return response.data
}
