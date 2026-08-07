import { useQuery } from '@tanstack/react-query'
import { fetchProblemBySlug } from '@/api/problemsApi'
import { problemKeys } from '@/lib/queryKeys'

export function useProblemBySlug(slug: string) {
  return useQuery({
    queryKey: problemKeys.detail(slug),
    queryFn: () => fetchProblemBySlug(slug),
    enabled: Boolean(slug),
  })
}
