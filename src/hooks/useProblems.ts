import { useQuery } from '@tanstack/react-query'
import { fetchProblems, type FetchProblemsParams } from '@/api/problemsApi'
import { problemKeys } from '@/lib/queryKeys'

export function useProblems(params: FetchProblemsParams = {}) {
  return useQuery({
    queryKey: problemKeys.list(params),
    queryFn: () => fetchProblems(params),
  })
}
