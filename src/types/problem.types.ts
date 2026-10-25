/** Mirrors Postgres / Prisma enums from production DB. */
export type ProblemDifficulty = 'EASY' | 'MEDIUM' | 'HARD'

export type ProblemStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export type ProgrammingLanguage = 'CPP' | 'JAVASCRIPT' | 'PYTHON'

export type EvaluationType = 'EXACT_MATCH' | 'CUSTOM_CHECKER'

/** TopicTags table (public columns used by FE). */
export type TopicTag = {
  id: string
  name: string
  slug_name: string
  description?: string | null
}

/** Companies table (public columns used by FE). */
export type Company = {
  id: string
  name: string
  slug_name: string
  image?: string | null
}

/**
 * problem_tag_junction + nested TopicTags — matches Prisma include:
 * tag_links: { include: { tag: true } }
 */
export type ProblemTagLink = {
  tag: Pick<TopicTag, 'id' | 'name' | 'slug_name'>
}

/**
 * problem_company_junction + nested Companies — matches Prisma include:
 * company_links: { include: { company: true } }
 */
export type ProblemCompanyLink = {
  company: Pick<Company, 'id' | 'name' | 'slug_name' | 'image'>
  frequency_score?: number
  time_period?: string | null
}

/**
 * ProblemCodeTemplates — learner-safe fields only.
 * Never expose hidden_stub_code / reference solution to the client.
 */
export type ProblemCodeTemplate = {
  id: string
  language: ProgrammingLanguage
  user_visible_code: string
}

/** Lean list DTO — matches GET /problems `problems[]` (table + filters only). */
export type ProblemListItem = {
  id: string
  problem_name: string
  problem_slug_name: string
  difficulty: ProblemDifficulty
  total_submissions: number
  total_accepted: number
  tag_links: ProblemTagLink[]
}

export type ProblemsListPagination = {
  page: number
  limit: number
  total: number
  totalPages: number
  hasMore: boolean
}

export type ProblemsListResponse = {
  problems: ProblemListItem[]
  pagination: ProblemsListPagination
}

/** Raw stdin input (one line per param) + its expected output. */
export type SampleTestcase = {
  input: string
  expected: string
}

/** Problems.meta_data — `params` labels the testcase boxes, one stdin line each. */
export type ProblemMetaData = {
  params?: string[]
  sample_testcases?: SampleTestcase[]
}

export type RunVerdict =
  | 'ACCEPTED'
  | 'WRONG_ANSWER'
  | 'COMPILATION_ERROR'
  | 'RUNTIME_ERROR'
  | 'TIME_LIMIT_EXCEEDED'
  | 'INVALID_TESTCASE'

export type RunCaseResult = {
  input: string
  /** Whatever the solution printed while running this case. */
  stdout: string
  /** null when the case crashed / timed out / never ran. */
  output: string | null
  expected: string | null
  passed: boolean
}

/** Result of a POST /problems/:problemId/run job, read via GET /code/result/:jobId. */
export type ProblemRunResult = {
  verdict: RunVerdict
  error?: string
  cases?: RunCaseResult[]
}

/** Detail DTO for solve page (future GET /problems/:slug). */
export type ProblemDetail = {
  id: string
  problem_name: string
  problem_slug_name: string
  problem_description: string | null
  difficulty: ProblemDifficulty
  status: ProblemStatus
  time_limit_ms: number
  memory_limit_kb: number
  total_submissions: number
  total_accepted: number
  evaluation_type: EvaluationType
  tag_links: ProblemTagLink[]
  company_links: ProblemCompanyLink[]
  code_templates: ProblemCodeTemplate[]
  meta_data: ProblemMetaData
}
