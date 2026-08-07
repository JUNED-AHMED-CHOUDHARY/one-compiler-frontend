import { createFileRoute, Link } from '@tanstack/react-router'
import SignUpForm from '@/components/auth/SignUp'

export const Route = createFileRoute('/signup')({
  component: SignupPage,
})

function SignupPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-emerald-950/20 md:grid-cols-2">
          <div className="hidden flex-col justify-between bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-500 p-10 md:flex">
            <Link
              to="/"
              className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-50"
            >
              JJ Compiler
            </Link>
            <div>
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-emerald-50">
                Get started
              </p>
              <h1 className="text-4xl font-bold leading-tight text-white">
                DSA / Problem Solving.
              </h1>
              <p className="mt-5 text-sm leading-6 text-emerald-50/90">
                Create your account to master your problem solving skills.
              </p>
            </div>
            <p className="text-sm text-emerald-50">Master your problem solving skills.</p>
          </div>

          <div className="p-6 sm:p-10">
            <Link to="/" className="text-sm font-medium text-zinc-400 hover:text-white">
              Back to compiler
            </Link>

            <div className="mt-10">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-emerald-400">
                Sign up
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white">Create your account</h2>
              <p className="mt-3 text-sm text-zinc-400">
                Create your account to master your problem solving skills.
              </p>
            </div>
            <SignUpForm />

            <p className="mt-8 text-center text-sm text-zinc-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-emerald-400 hover:text-emerald-300">
                Login
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
