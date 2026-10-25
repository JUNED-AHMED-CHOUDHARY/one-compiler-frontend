import axios from 'axios'
import type { ApiResponse } from '@/api/apiClient'

/** Prefer the first field error, then API `message`, then Error.message, with a 401-friendly default. */
export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong.'): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      return 'Your session expired. Please sign in again.'
    }
    const data = error.response?.data as ApiResponse | undefined
    const apiMessage = data?.additionalInfo?.errors?.[0]?.message ?? data?.message
    if (apiMessage) return apiMessage
  }
  if (error instanceof Error && error.message) return error.message
  return fallback
}
