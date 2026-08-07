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

/** Shape expected from future GET /problems (PUBLISHED rows). */
export type ProblemListItem = {
  id: string
  problem_name: string
  problem_slug_name: string
  difficulty: ProblemDifficulty
  status: ProblemStatus
  time_limit_ms: number
  memory_limit_kb: number
  total_submissions: number
  total_accepted: number
  evaluation_type: EvaluationType
  tag_links: ProblemTagLink[]
}

/** Shape expected from future GET /problems/:slug. */
export type ProblemDetail = ProblemListItem & {
  problem_description: string | null
  code_templates: ProblemCodeTemplate[]
  company_links: ProblemCompanyLink[]
}
