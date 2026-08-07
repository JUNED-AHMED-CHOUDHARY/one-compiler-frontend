import { apiClient } from '@/api/apiClient'
import type { JobState } from '@/types/bull.types'

export interface RunResponse {
  jobId: string
}

export interface StatusResponse {
  jobId: string
  status: JobState
  output?: string
  error?: string
}

export const submitCode = async (
  language: string,
  code: string,
  stdin: string = '',
): Promise<RunResponse> => {
  const response = await apiClient.post<RunResponse>('/code/run', { language, code, stdin })
  return response.data
}

export const checkJobStatus = async (jobId: string): Promise<StatusResponse> => {
  const response = await apiClient.get<StatusResponse>(`/code/result/${jobId}`)
  return response.data
}
