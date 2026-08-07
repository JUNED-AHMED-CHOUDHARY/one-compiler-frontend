import { Link, createFileRoute, redirect } from '@tanstack/react-router'
import { LoginForm } from '@/components/auth/LoginForm'
import { getSafeRedirectPath, isAuthenticated } from '@/lib/auth'

type LoginSearch = {
  redirect?: string
}

export const Route = createFileRoute('/auth/login')({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  beforeLoad: ({ search }) => {
    if (isAuthenticated()) {
      throw redirect({ to: getSafeRedirectPath(search.redirect) })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  const { redirect: redirectTo } = Route.useSearch()

  return (
    <main className="bg-background min-h-svh px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md flex-col justify-center">
        <div className="bg-card rounded-xl border p-6 sm:p-8">
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Login
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
            <p className="text-muted-foreground text-sm">
              Use your email or username to continue to problems.
            </p>
          </div>

          <LoginForm redirectTo={redirectTo} />

          <p className="text-muted-foreground mt-6 text-center text-sm">
            No account?{' '}
            <Link
              to="/auth/signup"
              className="text-foreground font-medium underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </p>

          <p className="text-muted-foreground mt-3 text-center text-sm">
            Or try the{' '}
            <Link
              to="/playground"
              className="text-foreground font-medium underline-offset-4 hover:underline"
            >
              playground
            </Link>{' '}
            without signing in.
          </p>
        </div>
      </div>
    </main>
  )
}
