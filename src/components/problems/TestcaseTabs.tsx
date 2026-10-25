import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type TestcaseTabsProps = {
  count: number
  activeIndex: number
  onSelect: (index: number) => void
  /** Result view only — colors each case's dot by pass / fail. */
  passed?: boolean[]
  onRemove?: (index: number) => void
  onAdd?: () => void
}

export function TestcaseTabs({
  count,
  activeIndex,
  onSelect,
  passed,
  onRemove,
  onAdd,
}: TestcaseTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="group/case relative">
          <Button
            type="button"
            size="xs"
            variant={index === activeIndex ? 'secondary' : 'ghost'}
            onClick={() => onSelect(index)}
          >
            {passed && (
              <span
                className={cn(
                  'size-1.5 rounded-full',
                  passed[index] ? 'bg-emerald-500' : 'bg-destructive',
                )}
              />
            )}
            Case {index + 1}
          </Button>
          {onRemove && count > 1 && (
            <button
              type="button"
              aria-label={`Remove case ${index + 1}`}
              onClick={() => onRemove(index)}
              className="bg-muted text-muted-foreground hover:text-foreground absolute -top-1.5 -right-1.5 hidden size-4 items-center justify-center rounded-full group-focus-within/case:flex group-hover/case:flex"
            >
              <X className="size-3" />
            </button>
          )}
        </div>
      ))}
      {onAdd && (
        <Button
          type="button"
          size="icon-xs"
          variant="ghost"
          aria-label="Add testcase"
          onClick={onAdd}
        >
          <Plus />
        </Button>
      )}
    </div>
  )
}
