import type { ReactNode } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { DifficultyBadge } from '@/components/problems/DifficultyBadge'
import { TopicTagList } from '@/components/problems/TopicTagList'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatAcceptanceRate } from '@/lib/problemFormatters'
import { cn } from '@/lib/utils'
import type { ProblemListItem } from '@/types/problem.types'

type CellContext = {
  problem: ProblemListItem
  index: number
}

type Column = {
  id: string
  header: string
  headerClassName?: string
  cellClassName?: string
  cell: (ctx: CellContext) => ReactNode
}

const COLUMNS: Column[] = [
  {
    id: 'index',
    header: '#',
    headerClassName: 'w-12',
    cellClassName: 'text-muted-foreground',
    cell: ({ index }) => index + 1,
  },
  {
    id: 'title',
    header: 'Title',
    cell: ({ problem }) => (
      <div className="flex flex-col gap-1.5">
        <span className="font-medium">{problem.problem_name}</span>
        <div className="sm:hidden">
          <DifficultyBadge difficulty={problem.difficulty} />
        </div>
      </div>
    ),
  },
  {
    id: 'difficulty',
    header: 'Difficulty',
    headerClassName: 'hidden sm:table-cell',
    cellClassName: 'hidden sm:table-cell',
    cell: ({ problem }) => <DifficultyBadge difficulty={problem.difficulty} />,
  },
  {
    id: 'acceptance',
    header: 'Acceptance',
    cellClassName: 'text-muted-foreground',
    cell: ({ problem }) => formatAcceptanceRate(problem.total_accepted, problem.total_submissions),
  },
  {
    id: 'tags',
    header: 'Tags',
    headerClassName: 'hidden md:table-cell',
    cellClassName: 'hidden md:table-cell',
    cell: ({ problem }) => <TopicTagList tagLinks={problem.tag_links} maxVisible={2} />,
  },
]

const SKELETON_CELLS = [
  { className: 'h-4 w-6 shrink-0' },
  { className: 'h-4 w-44 shrink-0' },
  { className: 'hidden h-4 w-16 shrink-0 sm:block' },
  { className: 'h-4 w-14 shrink-0' },
  { className: 'hidden h-4 w-24 shrink-0 md:block' },
]

type ProblemsTableProps = {
  problems: ProblemListItem[]
}

export function ProblemsTable({ problems }: ProblemsTableProps) {
  const navigate = useNavigate()

  return (
    <Card className="gap-0 py-0">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {COLUMNS.map((column) => (
              <TableHead key={column.id} className={column.headerClassName}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {problems.map((problem, index) => (
            <TableRow
              key={problem.id}
              className="cursor-pointer"
              onClick={() =>
                void navigate({
                  to: '/problems/$slug',
                  params: { slug: problem.problem_slug_name },
                })
              }
            >
              {COLUMNS.map((column) => (
                <TableCell key={column.id} className={column.cellClassName}>
                  {column.cell({ problem, index })}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

export function ProblemsTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <Card className="gap-0 divide-y py-0">
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={rowIndex} className="flex items-center gap-4 px-4 py-3.5">
          {SKELETON_CELLS.map((cell) => (
            <Skeleton key={cell.className} className={cn(cell.className)} />
          ))}
        </div>
      ))}
    </Card>
  )
}
