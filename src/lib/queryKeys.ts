import type { FetchProblemsParams } from '@/api/problemsApi'

export const problemKeys = {
  all: ['problems'] as const,
  lists: () => [...problemKeys.all, 'list'] as const,
  list: (params: FetchProblemsParams = {}) => [...problemKeys.lists(), params] as const,
  details: () => [...problemKeys.all, 'detail'] as const,
  detail: (slug: string) => [...problemKeys.details(), slug] as const,
}
