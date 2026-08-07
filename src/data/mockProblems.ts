import type { ProblemDetail, ProblemListItem } from '@/types/problem.types'

/**
 * Seeded from production Postgres via Mushroom MCP (environment: production).
 * Source row: Problems.id = prb_ht1JBOeXf
 * TopicTags / junctions were empty at sync time.
 */
export const MOCK_PROBLEMS: ProblemDetail[] = [
  {
    id: 'prb_ht1JBOeXf',
    problem_name: 'testing',
    problem_slug_name: 'testing',
    problem_description: 'asfsf',
    difficulty: 'EASY',
    status: 'PUBLISHED',
    time_limit_ms: 5000,
    memory_limit_kb: 256000,
    total_submissions: 0,
    total_accepted: 0,
    evaluation_type: 'EXACT_MATCH',
    tag_links: [],
    company_links: [],
    code_templates: [
      {
        id: 'pct_mrf6eIAID',
        language: 'CPP',
        user_visible_code: "console.log('nahiiii')",
      },
      {
        id: 'pct_wFNVTNiFx',
        language: 'JAVASCRIPT',
        user_visible_code: "console.log('nahiiii')",
      },
    ],
  },
]

export function toListItem(problem: ProblemDetail): ProblemListItem {
  return {
    id: problem.id,
    problem_name: problem.problem_name,
    problem_slug_name: problem.problem_slug_name,
    difficulty: problem.difficulty,
    status: problem.status,
    time_limit_ms: problem.time_limit_ms,
    memory_limit_kb: problem.memory_limit_kb,
    total_submissions: problem.total_submissions,
    total_accepted: problem.total_accepted,
    evaluation_type: problem.evaluation_type,
    tag_links: problem.tag_links,
  }
}
