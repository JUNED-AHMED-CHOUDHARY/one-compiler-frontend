import { ListChecks, SquareTerminal, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { ProblemRunResult } from '@/components/problems/ProblemRunResult'
import { ProblemTestcaseEditor } from '@/components/problems/ProblemTestcaseEditor'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { ProblemRunState, RunPanelTab } from '@/hooks/useProblemRun'
import { cn } from '@/lib/utils'

type ProblemRunPanelProps = {
  params: string[]
  run: ProblemRunState
}

const TABS: { value: RunPanelTab; label: string; icon: LucideIcon }[] = [
  { value: 'testcases', label: 'Testcase', icon: ListChecks },
  { value: 'result', label: 'Test Result', icon: SquareTerminal },
]

/** LeetCode-style bottom panel: editable testcases + per-case run results. */
export function ProblemRunPanel({ params, run }: ProblemRunPanelProps) {
  // both tabs stay mounted so the selected case survives switching
  const panels: Record<RunPanelTab, ReactNode> = {
    testcases: <ProblemTestcaseEditor params={params} run={run} />,
    result: <ProblemRunResult params={params} run={run} />,
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="bg-muted/40 flex items-center gap-1 border-b px-2 py-1.5">
        {TABS.map(({ value, label, icon: Icon }) => (
          <Button
            key={value}
            type="button"
            size="sm"
            variant={run.activeTab === value ? 'secondary' : 'ghost'}
            onClick={() => run.setActiveTab(value)}
          >
            <Icon data-icon="inline-start" />
            {label}
          </Button>
        ))}
      </div>

      <ScrollArea className="min-h-0 flex-1">
        {TABS.map(({ value }) => (
          <div key={value} className={cn('p-3', run.activeTab !== value && 'hidden')}>
            {panels[value]}
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}
