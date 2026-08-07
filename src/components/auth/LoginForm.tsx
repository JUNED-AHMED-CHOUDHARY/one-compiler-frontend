import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import axios from 'axios'
import { useForm, type FieldPath } from 'react-hook-form'
import { toast } from 'sonner'
import { type ApiResponse, setAccessToken } from '@/api/apiClient'
import { loginApi } from '@/api/authApi'
import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Password } from '@/components/ui/password'
import { getSafeRedirectPath } from '@/lib/auth'
import { loginSchema, type LoginFormValues } from '@/zodValidations/authSchemas/loginSchema'

type LoginFormProps = {
  redirectTo?: string
}

export function LoginForm({ redirectTo }: LoginFormProps) {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrUserName: '',
      password: '',
    },
  })

  const setBackendErrors = (response?: ApiResponse) => {
    const formValues = getValues()
    response?.additionalInfo?.errors?.forEach(({ path, message }) => {
      if (path in formValues) {
        setError(path as FieldPath<LoginFormValues>, { type: 'server', message })
      }
    })
  }

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await loginApi(data)

      if (!response.success || !response.data?.accessToken) {
        setBackendErrors(response)
        toast.error(response.message || 'Unable to sign in. Please try again.')
        return
      }

      setAccessToken(response.data.accessToken)
      toast.success(response.message || 'Login successful')
      await navigate({ to: getSafeRedirectPath(redirectTo) })
    } catch (error) {
      const errorResponse = axios.isAxiosError<ApiResponse>(error)
        ? error.response?.data
        : undefined
      setBackendErrors(errorResponse)
      toast.error(errorResponse?.message || 'Unable to sign in. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
      <FieldGroup>
        <Field data-invalid={!!errors.emailOrUserName}>
          <FieldLabel htmlFor="emailOrUserName">Email or username</FieldLabel>
          <FieldContent>
            <Input
              id="emailOrUserName"
              autoComplete="username"
              placeholder="you@example.com or username"
              {...register('emailOrUserName')}
            />
            <FieldError errors={[errors.emailOrUserName]} />
          </FieldContent>
        </Field>

        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <FieldContent>
            <Password id="password" autoComplete="current-password" {...register('password')} />
            <FieldError errors={[errors.password]} />
          </FieldContent>
        </Field>
      </FieldGroup>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  )
}
