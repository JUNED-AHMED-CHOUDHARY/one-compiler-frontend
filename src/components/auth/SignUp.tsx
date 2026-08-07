import axios from 'axios'
import { signupSchema, type SignupFormValues } from '@/zodValidations/authSchemas/signupSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, type FieldPath } from 'react-hook-form'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import {
  Field,
  FieldGroup,
  FieldContent,
  FieldLabel,
  FieldDescription,
  FieldError,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Password } from '@/components/ui/password'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import type { ApiResponse } from '@/api/apiClient'
import { signupApi } from '@/api/authApi'

export function SignUpForm() {
  const navigate = useNavigate()

  const {
    register,
    control,
    handleSubmit,
    setError,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agree: false,
    },
  })

  const setBackendErrors = (response?: ApiResponse) => {
    const formValues = getValues()

    response?.additionalInfo?.errors?.forEach(({ path, message }) => {
      if (path in formValues) {
        setError(path as FieldPath<SignupFormValues>, {
          type: 'server',
          message,
        })
      }
    })
  }

  const onSubmit = async (data: SignupFormValues) => {
    try {
      const response = await signupApi({
        name: data.name,
        userName: data.userName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      })

      if (!response.success) {
        setBackendErrors(response)
        toast.error(response.message || 'Unable to create account. Please try again.')
        return
      }

      toast.success(response.message || 'Account created successfully')
      reset()
      await navigate({ to: '/auth/login' })
    } catch (error) {
      const errorResponse = axios.isAxiosError<ApiResponse>(error)
        ? error.response?.data
        : undefined

      setBackendErrors(errorResponse)
      toast.error(errorResponse?.message || 'Unable to create account. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
      <FieldGroup className="grid gap-3 md:grid-cols-6">
        <Field data-invalid={!!errors.name} className="col-span-full gap-2 md:col-span-3">
          <FieldLabel htmlFor="name" className="text-sm font-medium text-zinc-200">
            Your Name *
          </FieldLabel>
          <Input
            id="name"
            type="text"
            aria-invalid={!!errors.name}
            placeholder="Enter your Name"
            {...register('name')}
          />
          {errors.name && <FieldError errors={[errors.name]} />}
        </Field>

        <Field data-invalid={!!errors.userName} className="col-span-full gap-2 md:col-span-3">
          <FieldLabel htmlFor="userName" className="text-sm font-medium text-zinc-200">
            Your Username *
          </FieldLabel>
          <Input
            id="userName"
            type="text"
            aria-invalid={!!errors.userName}
            placeholder="Enter your userName"
            {...register('userName')}
          />
          {errors.userName && <FieldError errors={[errors.userName]} />}
        </Field>

        <Field data-invalid={!!errors.email} className="col-span-full gap-2">
          <FieldLabel htmlFor="email" className="text-sm font-medium text-zinc-200">
            Email *
          </FieldLabel>
          <Input
            id="email"
            type="email"
            aria-invalid={!!errors.email}
            placeholder="Enter your Email"
            {...register('email')}
          />
          {errors.email && <FieldError errors={[errors.email]} />}
        </Field>

        <Field data-invalid={!!errors.password} className="col-span-full gap-2 md:col-span-3">
          <FieldContent>
            <FieldLabel htmlFor="password" className="text-sm font-medium text-zinc-200">
              Password *
            </FieldLabel>
          </FieldContent>
          <Password
            id="password"
            aria-invalid={!!errors.password}
            placeholder="Password"
            {...register('password')}
          />
          {errors.password && <FieldError errors={[errors.password]} />}
        </Field>

        <Field
          data-invalid={!!errors.confirmPassword}
          className="col-span-full gap-2 md:col-span-3"
        >
          <FieldContent>
            <FieldLabel htmlFor="confirm-password" className="text-sm font-medium text-zinc-200">
              Confirm Password *
            </FieldLabel>
          </FieldContent>
          <Password
            id="confirm-password"
            aria-invalid={!!errors.confirmPassword}
            placeholder="Confirm Password"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && <FieldError errors={[errors.confirmPassword]} />}
        </Field>

        <Controller
          name="agree"
          control={control}
          render={({ field, fieldState }) => (
            <Field
              orientation="horizontal"
              data-invalid={fieldState.invalid}
              className="col-span-full items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-950/40 p-4"
            >
              <Checkbox
                id="agree"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                aria-invalid={fieldState.invalid}
                className="mt-0.5 border-zinc-600 data-checked:border-emerald-500 data-checked:bg-emerald-500"
              />
              <FieldContent className="gap-1">
                <FieldLabel htmlFor="agree" className="text-sm font-medium text-zinc-200">
                  I agree to the terms and privacy policy *
                </FieldLabel>
                <FieldDescription className="text-xs text-zinc-500">
                  Required for now; replace this copy when you add real terms.
                </FieldDescription>
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </FieldContent>
            </Field>
          )}
        />
      </FieldGroup>
      <div className="mt-6 flex w-full justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-auto w-full rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500 sm:w-auto"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </form>
  )
}

export default SignUpForm
