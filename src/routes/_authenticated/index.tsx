import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { AlertCircle, Inbox } from 'lucide-react'
import { StatePanel } from '@/components/feedback/StatePanel'
import { AppShell } from '@/components/layout/AppShell'
import { ProblemsListPagination } from '@/components/problems/ProblemsListPagination'
import { ProblemsListToolbar } from '@/components/problems/ProblemsListToolbar'
import { ProblemsTable, ProblemsTableSkeleton } from '@/components/problems/ProblemsTable'
import { useProblems } from '@/hooks/useProblems'
import { getApiErrorMessage } from '@/lib/getApiErrorMessage'
import {
  parseProblemsListSearch,
  resolveProblemsListSearch,
  toFetchProblemsParams,
} from '@/lib/problemsListSearch'

export const Route = createFileRoute('/_authenticated/')({
  validateSearch: parseProblemsListSearch,
  component: ProblemsHome,
})

function ProblemsHome() {
  const rawSearch = Route.useSearch()
  const search = resolveProblemsListSearch(rawSearch)
  const navigate = Route.useNavigate()
  const fetchParams = toFetchProblemsParams(search)

  const { data, isLoading, isError, error, isFetching } = useProblems(fetchParams)

  const problems = data?.problems ?? []
  const pagination = data?.pagination
  const showInitialSkeleton = isLoading && !data
  const rowOffset = (search.page - 1) * search.limit

  useEffect(() => {
    if (!pagination) return
    const { page, totalPages, total } = pagination
    if (total > 0 && page > totalPages) {
      void navigate({
        search: (prev) => ({ ...prev, page: totalPages }),
        replace: true,
      })
    }
  }, [navigate, pagination])

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Problems</h1>
          <p className="text-muted-foreground text-sm">
            Browse published problems and open a workspace.
          </p>
        </div>

        <div className="space-y-4">
          <ProblemsListToolbar isFetching={isFetching && !showInitialSkeleton} />

          {showInitialSkeleton ? <ProblemsTableSkeleton rows={search.limit} /> : null}

          {isError ? (
            <StatePanel
              icon={AlertCircle}
              title="Could not load problems"
              description={getApiErrorMessage(error)}
              className="border"
            />
          ) : null}

          {!showInitialSkeleton && !isError && problems.length === 0 ? (
            <StatePanel
              icon={Inbox}
              title="No published problems"
              description={
                search.difficulty || search.tag
                  ? 'No problems match your filters. Try resetting filters or changing difficulty.'
                  : 'Publish a problem from the setter APIs to see it here.'
              }
              className="border"
            />
          ) : null}

          {!showInitialSkeleton && !isError && problems.length > 0 ? (
            <div className="overflow-hidden rounded-xl border">
              <ProblemsTable problems={problems} rowOffset={rowOffset} />
              {pagination ? (
                <ProblemsListPagination pagination={pagination} isFetching={isFetching} />
              ) : null}
            </div>
          ) : null}
        </div>
      </main>
    </AppShell>
  )
}
