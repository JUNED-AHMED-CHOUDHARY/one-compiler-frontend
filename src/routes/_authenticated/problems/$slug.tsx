import { createFileRoute, Link } from '@tanstack/react-router'
import { AlertCircle, FileQuestion } from 'lucide-react'
import { StatePanel } from '@/components/feedback/StatePanel'
import { AppShell } from '@/components/layout/AppShell'
import { ProblemEditorPanel } from '@/components/problems/ProblemEditorPanel'
import { ProblemStatementPanel } from '@/components/problems/ProblemStatementPanel'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useProblemBySlug } from '@/hooks/useProblemBySlug'
import { useProblemEditor } from '@/hooks/useProblemEditor'
import { getApiErrorMessage } from '@/lib/getApiErrorMessage'
import type { ProblemDetail } from '@/types/problem.types'

export const Route = createFileRoute('/_authenticated/problems/$slug')({
  component: ProblemSolvePage,
})

function ProblemSolvePage() {
  const { slug } = Route.useParams()
  const { data: problem, isLoading, isError, error, isFetched } = useProblemBySlug(slug)

  if (isLoading) {
    return (
      <AppShell variant="workspace">
        <div className="flex min-h-0 flex-1 flex-col gap-3 p-3 lg:flex-row">
          <Skeleton className="h-56 w-full rounded-xl lg:h-auto lg:w-[44%]" />
          <Skeleton className="h-56 w-full flex-1 rounded-xl lg:h-auto" />
        </div>
      </AppShell>
    )
  }

  if (isError) {
    return (
      <AppShell variant="workspace">
        <div className="flex flex-1 items-center justify-center p-6">
          <StatePanel
            icon={AlertCircle}
            title="Failed to load problem"
            description={getApiErrorMessage(error)}
            action={
              <Button asChild variant="outline" size="sm">
                <Link to="/">Back to problems</Link>
              </Button>
            }
          />
        </div>
      </AppShell>
    )
  }

  if (isFetched && !problem) {
    return (
      <AppShell variant="workspace">
        <div className="flex flex-1 items-center justify-center p-6">
          <StatePanel
            icon={FileQuestion}
            title="Problem not found"
            description="This slug is not a published problem."
            action={
              <Button asChild variant="outline" size="sm">
                <Link to="/">Back to problems</Link>
              </Button>
            }
          />
        </div>
      </AppShell>
    )
  }

  if (!problem) return null

  return <ProblemWorkspace key={problem.id} problem={problem} />
}

function ProblemWorkspace({ problem }: { problem: ProblemDetail }) {
  const editor = useProblemEditor(problem.code_templates)

  return (
    <AppShell variant="workspace" subtitle={problem.problem_name}>
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <ProblemStatementPanel problem={problem} />
        <ProblemEditorPanel
          templates={editor.templates}
          language={editor.language}
          code={editor.code}
          onLanguageChange={editor.selectLanguage}
          onCodeChange={editor.setCode}
        />
      </div>
    </AppShell>
  )
}
