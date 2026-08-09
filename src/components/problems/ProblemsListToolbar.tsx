import { getRouteApi } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  PROBLEMS_LIST_DEFAULT_LIMIT,
  PROBLEMS_LIST_DEFAULT_PAGE,
  PROBLEMS_LIST_PAGE_SIZE_OPTIONS,
  resolveProblemsListSearch,
  type ProblemsListSearch,
} from '@/lib/problemsListSearch'
import type { ProblemDifficulty } from '@/types/problem.types'

const DIFFICULTY_OPTIONS = [
  { value: 'ALL', label: 'All difficulties' },
  { value: 'EASY', label: 'Easy' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HARD', label: 'Hard' },
] as const

type ProblemsListToolbarProps = {
  isFetching?: boolean
}

const routeApi = getRouteApi('/_authenticated/')

export function ProblemsListToolbar({ isFetching }: ProblemsListToolbarProps) {
  const rawSearch = routeApi.useSearch()
  const search = resolveProblemsListSearch(rawSearch)
  const navigate = routeApi.useNavigate()

  const patchSearch = (patch: Partial<ProblemsListSearch>) => {
    void navigate({
      search: (prev) => ({
        ...resolveProblemsListSearch(prev),
        ...patch,
        page: patch.page ?? PROBLEMS_LIST_DEFAULT_PAGE,
      }),
      replace: true,
    })
  }

  const difficultyValue = search.difficulty ?? 'ALL'

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={difficultyValue}
          onValueChange={(value) =>
            patchSearch({
              difficulty: value === 'ALL' ? undefined : (value as ProblemDifficulty),
              page: 1,
            })
          }
        >
          <SelectTrigger size="sm" className="w-[160px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            {DIFFICULTY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={String(search.limit)}
          onValueChange={(value) => patchSearch({ limit: Number(value), page: 1 })}
        >
          <SelectTrigger size="sm" className="w-[120px]">
            <SelectValue placeholder="Per page" />
          </SelectTrigger>
          <SelectContent>
            {PROBLEMS_LIST_PAGE_SIZE_OPTIONS.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size} / page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isFetching ? (
        <p className="text-muted-foreground text-xs" aria-live="polite">
          Updating…
        </p>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-muted-foreground self-start sm:self-auto"
          onClick={() =>
            void navigate({
              search: { page: 1, limit: PROBLEMS_LIST_DEFAULT_LIMIT },
              replace: true,
            })
          }
        >
          Reset filters
        </Button>
      )}
    </div>
  )
}
