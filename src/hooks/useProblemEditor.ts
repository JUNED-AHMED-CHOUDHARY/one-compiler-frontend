import { useState } from 'react'
import type { ProblemCodeTemplate, ProgrammingLanguage } from '@/types/problem.types'

type CodeByLanguage = Partial<Record<ProgrammingLanguage, string>>

function buildInitialCode(templates: ProblemCodeTemplate[]): CodeByLanguage {
  return Object.fromEntries(
    templates.map((template) => [template.language, template.user_visible_code]),
  ) as CodeByLanguage
}

/**
 * Editor state for one problem.
 * Remount via `key={problem.id}` on the consumer when the problem changes.
 */
export function useProblemEditor(templates: ProblemCodeTemplate[]) {
  const [language, setLanguage] = useState<ProgrammingLanguage | null>(
    () => templates[0]?.language ?? null,
  )
  const [codeByLanguage, setCodeByLanguage] = useState<CodeByLanguage>(() =>
    buildInitialCode(templates),
  )

  const code = language ? (codeByLanguage[language] ?? '') : ''

  const setCode = (value: string) => {
    if (!language) return
    setCodeByLanguage((prev) => ({ ...prev, [language]: value }))
  }

  const selectLanguage = (next: ProgrammingLanguage) => {
    if (!(next in codeByLanguage)) return
    setLanguage(next)
  }

  return {
    language,
    code,
    setCode,
    selectLanguage,
    hasTemplates: templates.length > 0,
    templates,
  }
}
