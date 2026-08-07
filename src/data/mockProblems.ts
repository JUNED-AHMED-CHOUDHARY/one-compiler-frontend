import type { ProblemDetail } from '@/types/problem.types'

/**
 * Temporary detail mock until GET /problems/:slug lands.
 * List data now comes from GET /problems/list.
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
