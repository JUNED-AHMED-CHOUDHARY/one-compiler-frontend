import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    alert('Dummy login submitted. Connect this form to your API when ready.')
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-blue-950/20 md:grid-cols-2">
          <div className="hidden flex-col justify-between bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-10 md:flex">
            <Link to="/" className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">
              JJ Compiler
            </Link>
            <div>
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-blue-100">
                Welcome back
              </p>
              <h1 className="text-4xl font-bold leading-tight text-white">
                Continue building and running code in your browser.
              </h1>
              <p className="mt-5 text-sm leading-6 text-blue-50/90">
                This is a placeholder login screen for your One Compiler app.
              </p>
            </div>
            <p className="text-sm text-blue-100">No real authentication is connected yet.</p>
          </div>

          <div className="p-6 sm:p-10">
            <Link to="/" className="text-sm font-medium text-zinc-400 hover:text-white">
              Back to compiler
            </Link>

            <div className="mt-10">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-blue-400">Login</p>
              <h2 className="mt-3 text-3xl font-bold text-white">Sign in to your account</h2>
              <p className="mt-3 text-sm text-zinc-400">
                Enter your details below. You can replace this dummy form with your auth flow.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-300">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-zinc-300">
                    Password
                  </label>
                  <button type="button" className="text-sm text-blue-400 hover:text-blue-300">
                    Forgot password?
                  </button>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
              >
                Login
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-zinc-400">
              Do not have an account?{' '}
              <Link to="/signup" className="font-semibold text-blue-400 hover:text-blue-300">
                Create one
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
