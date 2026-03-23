import axios from 'axios'
import type { JobState } from '../types/bull.types'

// Update this if your backend runs on a different port
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface RunResponse {
  jobId: string
}

export interface StatusResponse {
  jobId: string
  status: JobState
  output?: string
  error?: string
}

export const submitCode = async (language: string, code: string): Promise<RunResponse> => {
  // Assuming your backend expects { language, code }
  const response = await apiClient.post('/code/run', { language, code })
  return response.data
}

export const checkJobStatus = async (jobId: string): Promise<StatusResponse> => {
  const response = await apiClient.get(`/code/result/${jobId}`)
  return response.data
}
