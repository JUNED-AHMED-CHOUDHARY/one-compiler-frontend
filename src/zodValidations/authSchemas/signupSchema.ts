import * as z from 'zod'

export interface ActionResponse<T = unknown> {
  success: boolean
  message: string
  errors?: {
    [K in keyof T]?: string[]
  }
  inputs?: T
}
export const signupSchema = z.object({
  name: z.string().trim().min(1, { error: 'Name is required' }),
  userName: z.string().trim().min(1, { error: 'Username is required' }),
  email: z
    .string()
    .trim()
    .min(1, { error: 'Email is required' })
    .pipe(z.email({ error: 'Please enter a valid email' })),
  password: z.string().min(1, { error: 'Password is required' }),
  confirmPassword: z.string().min(1, {
    error: 'Confirm password is required',
  }),
  agree: z.boolean().refine((value) => value, {
    error: 'This field is required',
  }),
})

export type SignupFormValues = z.infer<typeof signupSchema>
export type SignupPayload = Omit<SignupFormValues, 'agree'>
