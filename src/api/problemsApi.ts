import { MOCK_PROBLEMS, toListItem } from '@/data/mockProblems'
import type { ProblemDetail, ProblemListItem } from '@/types/problem.types'

/**
 * Learner problems API boundary.
 * Currently mock-backed from production DB snapshot; swap internals to HTTP later
 * without changing hooks/components.
 */
export async function fetchProblems(): Promise<ProblemListItem[]> {
  await simulateLatency()
  return MOCK_PROBLEMS.filter((problem) => problem.status === 'PUBLISHED').map(toListItem)
}

export async function fetchProblemBySlug(slug: string): Promise<ProblemDetail | null> {
  await simulateLatency()
  return (
    MOCK_PROBLEMS.find(
      (problem) => problem.problem_slug_name === slug && problem.status === 'PUBLISHED',
    ) ?? null
  )
}

function simulateLatency() {
  return new Promise((resolve) => setTimeout(resolve, 990))
}
