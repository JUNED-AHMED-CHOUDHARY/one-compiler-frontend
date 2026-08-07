import axios from 'axios'

/** Prefer API `message`, then Error.message, with a 401-friendly default. */
export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong.'): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      return 'Your session expired. Please sign in again.'
    }
    const apiMessage = (error.response?.data as { message?: string } | undefined)?.message
    if (apiMessage) return apiMessage
  }
  if (error instanceof Error && error.message) return error.message
  return fallback
}
