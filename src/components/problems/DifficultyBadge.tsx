import type { ComponentProps } from 'react'
import { Badge } from '@/components/ui/badge'
import { formatDifficulty } from '@/lib/problemFormatters'
import type { ProblemDifficulty } from '@/types/problem.types'

/** Map domain difficulty → shadcn Badge variants only (no custom palette). */
const DIFFICULTY_VARIANT: Record<ProblemDifficulty, ComponentProps<typeof Badge>['variant']> = {
  EASY: 'secondary',
  MEDIUM: 'outline',
  HARD: 'destructive',
}

type DifficultyBadgeProps = {
  difficulty: ProblemDifficulty
  className?: string
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  return (
    <Badge variant={DIFFICULTY_VARIANT[difficulty]} className={className}>
      {formatDifficulty(difficulty)}
    </Badge>
  )
}
