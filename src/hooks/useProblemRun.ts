import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { checkJobStatus } from '@/api/compilerApi'
import { runProblemCode } from '@/api/problemsApi'
import { getApiErrorMessage } from '@/lib/getApiErrorMessage'
import type { ProblemDetail, ProblemRunResult, ProgrammingLanguage } from '@/types/problem.types'

/** Mirrors backend MAX_RUN_TESTCASES. */
export const MAX_RUN_TESTCASES = 10

export type RunPanelTab = 'testcases' | 'result'

/**
 * Run state for one problem: editable testcases (seeded from the samples) + the polled run job.
 * Remount via `key={problem.id}` on the consumer when the problem changes.
 */
export function useProblemRun(problem: Pick<ProblemDetail, 'id' | 'meta_data'>) {
  const [testcases, setTestcases] = useState<string[]>(() => {
    const samples = problem.meta_data.sample_testcases ?? []
    return samples.length > 0 ? samples.map((sample) => sample.input) : ['']
  })
  const [activeTab, setActiveTab] = useState<RunPanelTab>('testcases')
  const [currentJobId, setCurrentJobId] = useState<string | null>(null)

  const runMutation = useMutation({
    mutationFn: (params: {
      language: ProgrammingLanguage
      source_code: string
      inputs: string[]
    }) => runProblemCode(problem.id, params),
    onSuccess: (data) => setCurrentJobId(data.jobId),
  })

  const jobQuery = useQuery({
    queryKey: ['codeRunResult', currentJobId],
    queryFn: () => checkJobStatus<ProblemRunResult>(currentJobId!),
    enabled: !!currentJobId,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      if (status === 'completed' || status === 'failed') return false
      return 500
    },
  })

  const run = (language: ProgrammingLanguage, source_code: string) => {
    setCurrentJobId(null)
    setActiveTab('result')
    runMutation.mutate({ language, source_code, inputs: testcases })
  }

  const updateTestcase = (index: number, input: string) =>
    setTestcases((prev) => prev.map((testcase, i) => (i === index ? input : testcase)))

  /** New case starts as a copy of `copyFrom`, like LeetCode's "+". */
  const addTestcase = (copyFrom: number) =>
    setTestcases((prev) =>
      prev.length >= MAX_RUN_TESTCASES ? prev : [...prev, prev[copyFrom] ?? ''],
    )

  const removeTestcase = (index: number) =>
    setTestcases((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)))

  const job = jobQuery.data
  const isFinished = job?.status === 'completed' || job?.status === 'failed'
  const isJobInProgress = Boolean(currentJobId) && !isFinished
  const isRunning = runMutation.isPending || isJobInProgress
  const pendingPhase: 'running' | 'queued' = job?.status === 'active' ? 'running' : 'queued'

  let status: 'idle' | 'pending' | 'completed' | 'failed' = 'idle'
  if (isRunning) {
    status = 'pending'
  } else if (job?.status === 'completed') {
    status = 'completed'
  } else if (job?.status === 'failed' || runMutation.isError || jobQuery.isError) {
    status = 'failed'
  }

  const result: ProblemRunResult | undefined =
    status === 'completed' && job?.verdict
      ? { verdict: job.verdict, error: job.error, cases: job.cases }
      : undefined

  // infrastructure failures only — compile / runtime errors arrive inside `result`
  const error = runMutation.isError
    ? getApiErrorMessage(runMutation.error)
    : jobQuery.isError
      ? getApiErrorMessage(jobQuery.error)
      : job?.status === 'failed'
        ? job.error
        : undefined

  return {
    testcases,
    updateTestcase,
    addTestcase,
    removeTestcase,
    activeTab,
    setActiveTab,
    run,
    isRunning,
    status,
    pendingPhase,
    result,
    error,
  }
}

export type ProblemRunState = ReturnType<typeof useProblemRun>
