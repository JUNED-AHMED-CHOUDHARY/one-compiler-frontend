import axios from 'axios'
import type { SignupPayload } from '@/zodValidations/authSchemas/signupSchema'

export type AuthApiResponse<T = unknown> = {
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

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/auth`

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const signupApi = async (data: SignupPayload) => {
  const response = await apiClient.post<AuthApiResponse>('/sign-up', data)
  return response.data
}
