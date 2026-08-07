import type { ProblemDifficulty, ProgrammingLanguage } from '@/types/problem.types'

const DIFFICULTY_LABELS: Record<ProblemDifficulty, string> = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
}

const LANGUAGE_LABELS: Record<ProgrammingLanguage, string> = {
  JAVASCRIPT: 'JavaScript',
  PYTHON: 'Python',
  CPP: 'C++',
}

const MONACO_LANGUAGES: Record<ProgrammingLanguage, string> = {
  JAVASCRIPT: 'javascript',
  PYTHON: 'python',
  CPP: 'cpp',
}

const EVALUATION_LABELS = {
  EXACT_MATCH: 'Exact match',
  CUSTOM_CHECKER: 'Custom checker',
} as const

export function formatDifficulty(difficulty: ProblemDifficulty) {
  return DIFFICULTY_LABELS[difficulty]
}

export function formatLanguageLabel(language: ProgrammingLanguage) {
  return LANGUAGE_LABELS[language]
}

export function toMonacoLanguage(language: ProgrammingLanguage) {
  return MONACO_LANGUAGES[language]
}

export function formatAcceptanceRate(accepted: number, submissions: number) {
  if (submissions <= 0) return '—'
  return `${((accepted / submissions) * 100).toFixed(1)}%`
}

export function formatMemoryLimit(memoryLimitKb: number) {
  if (memoryLimitKb >= 1024) return `${Math.round(memoryLimitKb / 1024)} MB`
  return `${memoryLimitKb} KB`
}

export function formatTimeLimit(timeLimitMs: number) {
  return `${timeLimitMs} ms`
}

export function formatEvaluationType(evaluationType: keyof typeof EVALUATION_LABELS) {
  return EVALUATION_LABELS[evaluationType]
}
