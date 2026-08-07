import { useQuery } from '@tanstack/react-query'
import { fetchProblems } from '@/api/problemsApi'
import { problemKeys } from '@/lib/queryKeys'

export function useProblems() {
  return useQuery({
    queryKey: problemKeys.list(),
    queryFn: fetchProblems,
  })
}
