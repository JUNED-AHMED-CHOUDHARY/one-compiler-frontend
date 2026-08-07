import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { ProblemCompanyLink, ProblemTagLink } from '@/types/problem.types'

type TopicTagListProps = {
  tagLinks: ProblemTagLink[]
  companyLinks?: ProblemCompanyLink[]
  maxVisible?: number
  className?: string
}

export function TopicTagList({
  tagLinks,
  companyLinks = [],
  maxVisible,
  className,
}: TopicTagListProps) {
  const tags = tagLinks.map(({ tag }) => ({
    id: tag.id,
    label: tag.name,
    variant: 'secondary' as const,
  }))

  const companies = companyLinks.map(({ company }) => ({
    id: company.id,
    label: company.name,
    variant: 'outline' as const,
  }))

  const items = [...tags, ...companies]
  if (items.length === 0) return null

  const visible = typeof maxVisible === 'number' ? items.slice(0, maxVisible) : items
  const remaining = items.length - visible.length

  return (
    <div className={cn('flex flex-wrap items-center gap-1.5', className)}>
      {visible.map((item) => (
        <Badge key={item.id} variant={item.variant} className="font-normal">
          {item.label}
        </Badge>
      ))}
      {remaining > 0 ? (
        <Badge variant="outline" className="text-muted-foreground font-normal">
          +{remaining}
        </Badge>
      ) : null}
    </div>
  )
}
