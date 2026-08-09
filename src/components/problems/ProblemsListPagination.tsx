import { getRouteApi } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { resolveProblemsListSearch } from '@/lib/problemsListSearch'
import type { ProblemsListPagination as ProblemsListPaginationMeta } from '@/types/problem.types'

type ProblemsListPaginationProps = {
  pagination: ProblemsListPaginationMeta
  isFetching?: boolean
}

const routeApi = getRouteApi('/_authenticated/')

export function ProblemsListPagination({ pagination, isFetching }: ProblemsListPaginationProps) {
  const navigate = routeApi.useNavigate()
  const { page, limit, total, totalPages, hasMore } = pagination

  const goToPage = (nextPage: number) => {
    void navigate({
      search: (prev) => ({ ...resolveProblemsListSearch(prev), page: nextPage }),
      replace: true,
    })
  }

  const rangeStart = total === 0 ? 0 : (page - 1) * limit + 1
  const rangeEnd = Math.min(page * limit, total)

  return (
    <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-muted-foreground text-sm">
        {total === 0 ? (
          'No problems'
        ) : (
          <>
            Showing {rangeStart}–{rangeEnd} of {total}
            {totalPages > 1 ? ` · Page ${page} of ${totalPages}` : null}
          </>
        )}
      </p>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page <= 1 || isFetching}
          onClick={() => goToPage(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!hasMore || isFetching}
          onClick={() => goToPage(page + 1)}
          aria-label="Next page"
        >
          Next
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
