import { Link } from '@tanstack/react-router'
import { DifficultyBadge } from '@/components/problems/DifficultyBadge'
import { ProblemDescription } from '@/components/problems/ProblemDescription'
import { TopicTagList } from '@/components/problems/TopicTagList'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { formatEvaluationType, formatMemoryLimit, formatTimeLimit } from '@/lib/problemFormatters'
import type { ProblemDetail } from '@/types/problem.types'

type ProblemStatementPanelProps = {
  problem: ProblemDetail
}

export function ProblemStatementPanel({ problem }: ProblemStatementPanelProps) {
  const metaItems = [
    { label: 'Time', value: formatTimeLimit(problem.time_limit_ms) },
    { label: 'Memory', value: formatMemoryLimit(problem.memory_limit_kb) },
    { label: 'Eval', value: formatEvaluationType(problem.evaluation_type) },
  ]

  return (
    <aside className="bg-card/30 flex min-h-0 w-full flex-col border-b lg:w-[44%] lg:border-r lg:border-b-0">
      <div className="space-y-3 border-b px-4 py-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Problems</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{problem.problem_name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-wrap items-center gap-2">
          <DifficultyBadge difficulty={problem.difficulty} />
          <TopicTagList tagLinks={problem.tag_links} companyLinks={problem.company_links} />
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-6 px-5 py-5">
          <ProblemDescription markdown={problem.problem_description} />
          <Separator />
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {metaItems.map((item) => (
              <div key={item.label} className="space-y-1">
                <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  {item.label}
                </dt>
                <dd className="text-sm">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </ScrollArea>
    </aside>
  )
}
