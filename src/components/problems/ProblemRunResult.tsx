import { Loader2 } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { TestcaseTabs } from '@/components/problems/TestcaseTabs'
import type { ProblemRunState } from '@/hooks/useProblemRun'
import { formatRunVerdict } from '@/lib/problemFormatters'
import { splitTestcaseInput } from '@/lib/testcaseInput'
import { cn } from '@/lib/utils'
import type { RunCaseResult } from '@/types/problem.types'

type ProblemRunResultProps = {
  params: string[]
  run: ProblemRunState
}

export function ProblemRunResult({ params, run }: ProblemRunResultProps) {
  const { status, pendingPhase, result, error } = run
  const [selected, setSelected] = useState(0)

  if (status === 'idle') {
    return <p className="text-muted-foreground text-sm">Run your code to see results here.</p>
  }

  if (status === 'pending') {
    return (
      <p className="text-muted-foreground flex items-center gap-2 text-sm">
        <Loader2 className="size-4 animate-spin" />
        {pendingPhase === 'running' ? 'Running your code…' : 'Queued…'}
      </p>
    )
  }

  if (!result) return <OutputBlock tone="error">{error ?? 'Run failed'}</OutputBlock>

  const cases = result.cases ?? []
  const activeIndex = Math.min(selected, cases.length - 1)
  const activeCase = cases[activeIndex]
  const passedCount = cases.filter((runCase) => runCase.passed).length

  return (
    <div className="space-y-3">
      <div className="flex items-baseline gap-3">
        <h3
          className={cn(
            'text-lg font-semibold',
            result.verdict === 'ACCEPTED'
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-destructive',
          )}
        >
          {formatRunVerdict(result.verdict)}
        </h3>
        {cases.length > 0 && (
          <span className="text-muted-foreground text-xs">
            {passedCount}/{cases.length} testcases passed
          </span>
        )}
      </div>

      {result.error && <OutputBlock tone="error">{result.error}</OutputBlock>}

      {activeCase && (
        <>
          <TestcaseTabs
            count={cases.length}
            activeIndex={activeIndex}
            onSelect={setSelected}
            passed={cases.map((runCase) => runCase.passed)}
          />
          <CaseDetails params={params} runCase={activeCase} />
        </>
      )}
    </div>
  )
}

function CaseDetails({ params, runCase }: { params: string[]; runCase: RunCaseResult }) {
  const inputLines =
    params.length > 0
      ? splitTestcaseInput(runCase.input, params.length).map(
          (value, i) => `${params[i]} = ${value}`,
        )
      : [runCase.input]

  return (
    <div className="space-y-3">
      <CaseField label="Input">{inputLines.join('\n')}</CaseField>
      {runCase.stdout && <CaseField label="Stdout">{runCase.stdout}</CaseField>}
      <CaseField label="Output">{runCase.output ?? '—'}</CaseField>
      <CaseField label="Expected">{runCase.expected ?? '—'}</CaseField>
    </div>
  )
}

function CaseField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-muted-foreground text-xs font-medium">{label}</p>
      <OutputBlock>{children}</OutputBlock>
    </div>
  )
}

function OutputBlock({ tone, children }: { tone?: 'error'; children: ReactNode }) {
  return (
    <pre
      className={cn(
        'rounded-lg px-3 py-2 font-mono text-sm wrap-anywhere whitespace-pre-wrap',
        tone === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-muted/60',
      )}
    >
      {children}
    </pre>
  )
}
