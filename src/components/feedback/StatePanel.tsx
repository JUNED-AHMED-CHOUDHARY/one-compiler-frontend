import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'

type StatePanelProps = {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
  className?: string
}

/** Shared empty / error presentation using shadcn Empty. */
export function StatePanel({ icon: Icon, title, description, action, className }: StatePanelProps) {
  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {action}
    </Empty>
  )
}
