import { clearAccessToken, getAccessToken } from '@/api/apiClient'

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken())
}

/** Prevent open redirects — only same-app relative paths. */
export function getSafeRedirectPath(redirect: string | undefined, fallback = '/'): string {
  if (!redirect) return fallback
  if (!redirect.startsWith('/') || redirect.startsWith('//')) return fallback
  return redirect
}

export function logout() {
  clearAccessToken()
}
