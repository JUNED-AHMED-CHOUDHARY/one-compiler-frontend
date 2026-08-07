import { createFileRoute } from '@tanstack/react-router'
import { AlertCircle, Inbox } from 'lucide-react'
import { StatePanel } from '@/components/feedback/StatePanel'
import { AppShell } from '@/components/layout/AppShell'
import { ProblemsTable, ProblemsTableSkeleton } from '@/components/problems/ProblemsTable'
import { useProblems } from '@/hooks/useProblems'
import { getApiErrorMessage } from '@/lib/getApiErrorMessage'

export const Route = createFileRoute('/_authenticated/')({
  component: ProblemsHome,
})

function ProblemsHome() {
  const { data, isLoading, isError, error } = useProblems()
  const problems = data?.problems ?? []

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Problems</h1>
          <p className="text-muted-foreground text-sm">
            Browse published problems and open a workspace.
          </p>
        </div>

        {isLoading ? <ProblemsTableSkeleton /> : null}

        {isError ? (
          <StatePanel
            icon={AlertCircle}
            title="Could not load problems"
            description={getApiErrorMessage(error)}
            className="border"
          />
        ) : null}

        {!isLoading && !isError && problems.length === 0 ? (
          <StatePanel
            icon={Inbox}
            title="No published problems"
            description="Publish a problem from the setter APIs to see it here."
            className="border"
          />
        ) : null}

        {!isLoading && !isError && problems.length > 0 ? (
          <ProblemsTable problems={problems} />
        ) : null}
      </main>
    </AppShell>
  )
}
