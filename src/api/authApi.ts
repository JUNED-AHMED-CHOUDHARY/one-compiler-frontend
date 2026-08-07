import { apiClient, type ApiResponse } from '@/api/apiClient'
import type { LoginPayload } from '@/zodValidations/authSchemas/loginSchema'
import type { SignupPayload } from '@/zodValidations/authSchemas/signupSchema'

export type AuthUser = {
  id: string
  email: string
  username: string
  name: string
  role: string
  accessToken: string
}

export const signupApi = async (data: SignupPayload) => {
  const response = await apiClient.post<ApiResponse>('/auth/sign-up', data)
  return response.data
}

export const loginApi = async (data: LoginPayload) => {
  const response = await apiClient.post<ApiResponse<AuthUser>>('/auth/login', data)
  return response.data
}
