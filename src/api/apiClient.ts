import axios from 'axios'

const ACCESS_TOKEN_KEY = 'accessToken'

const PUBLIC_PATH_PREFIXES = ['/auth/login', '/auth/signup', '/playground']

export type ApiResponse<T = unknown> = {
  success: boolean
  message: string
  data?: T
  additionalInfo?: {
    errors?: Array<{
      path: string
      message: string
    }>
  }
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(ACCESS_TOKEN_KEY) ?? null
}

export function setAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      typeof window !== 'undefined'
    ) {
      clearAccessToken()
      const { pathname, search } = window.location
      const isPublic = PUBLIC_PATH_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
      )
      if (!isPublic) {
        const redirect = encodeURIComponent(`${pathname}${search}`)
        window.location.assign(`/auth/login?redirect=${redirect}`)
      }
    }
    return Promise.reject(error)
  },
)
