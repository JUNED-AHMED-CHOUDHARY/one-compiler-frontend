import * as z from 'zod'

export const loginSchema = z.object({
  emailOrUserName: z.string().trim().min(1, { error: 'Email or username is required' }),
  password: z.string().min(1, { error: 'Password is required' }),
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type LoginPayload = LoginFormValues
