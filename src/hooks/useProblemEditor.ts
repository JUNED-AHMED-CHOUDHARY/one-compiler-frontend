import { useEffect, useMemo, useState } from 'react'
import type { ProblemCodeTemplate, ProgrammingLanguage } from '@/types/problem.types'

type CodeByLanguage = Partial<Record<ProgrammingLanguage, string>>

/**
 * Keeps per-language editor buffers in sync with server templates.
 * Switching language preserves in-progress edits for that language.
 */
export function useProblemEditor(templates: ProblemCodeTemplate[] | undefined, problemId?: string) {
  const [language, setLanguage] = useState<ProgrammingLanguage | null>(null)
  const [codeByLanguage, setCodeByLanguage] = useState<CodeByLanguage>({})

  const templateSignature = useMemo(() => {
    if (!templates?.length) return `${problemId ?? ''}:empty`
    return `${problemId ?? ''}:${templates.map((t) => `${t.id}:${t.language}`).join('|')}`
  }, [problemId, templates])

  useEffect(() => {
    if (!templates?.length) {
      setLanguage(null)
      setCodeByLanguage({})
      return
    }

    const nextCode: CodeByLanguage = {}
    for (const template of templates) {
      nextCode[template.language] = template.user_visible_code
    }

    setCodeByLanguage(nextCode)
    setLanguage((current) => {
      if (current && nextCode[current] !== undefined) return current
      return templates[0].language
    })
    // Reset buffers only when problem/template identity changes, not on referential rerenders.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- templateSignature is the intentional dependency
  }, [templateSignature])

  const code = language ? (codeByLanguage[language] ?? '') : ''

  const setCode = (value: string) => {
    if (!language) return
    setCodeByLanguage((prev) => ({ ...prev, [language]: value }))
  }

  const selectLanguage = (next: ProgrammingLanguage) => {
    if (!templates?.some((t) => t.language === next)) return
    setLanguage(next)
  }

  return {
    language,
    code,
    setCode,
    selectLanguage,
    hasTemplates: Boolean(templates?.length),
    templates: templates ?? [],
  }
}
