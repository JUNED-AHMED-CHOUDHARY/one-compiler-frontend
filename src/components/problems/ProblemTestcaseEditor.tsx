import { useState } from 'react'
import { TestcaseTabs } from '@/components/problems/TestcaseTabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { MAX_RUN_TESTCASES, type ProblemRunState } from '@/hooks/useProblemRun'
import { setTestcaseParam, splitTestcaseInput } from '@/lib/testcaseInput'

type ProblemTestcaseEditorProps = {
  params: string[]
  run: ProblemRunState
}

/** One box per param (LeetCode-style); a raw textarea when the problem has no params set. */
export function ProblemTestcaseEditor({ params, run }: ProblemTestcaseEditorProps) {
  const { testcases, updateTestcase, addTestcase, removeTestcase, isRunning } = run
  const [selected, setSelected] = useState(0)

  const activeIndex = Math.min(selected, testcases.length - 1)
  const input = testcases[activeIndex]
  const canAdd = !isRunning && testcases.length < MAX_RUN_TESTCASES

  const handleRemove = (index: number) => {
    removeTestcase(index)
    if (index < selected) setSelected(selected - 1)
  }

  const handleAdd = () => {
    addTestcase(activeIndex)
    setSelected(testcases.length)
  }

  return (
    <div className="space-y-3">
      <TestcaseTabs
        count={testcases.length}
        activeIndex={activeIndex}
        onSelect={setSelected}
        onRemove={isRunning ? undefined : handleRemove}
        onAdd={canAdd ? handleAdd : undefined}
      />

      {params.length > 0 ? (
        splitTestcaseInput(input, params.length).map((value, paramIndex) => (
          <label key={params[paramIndex]} className="block space-y-1.5">
            <span className="text-muted-foreground font-mono text-xs">{params[paramIndex]} =</span>
            <Input
              value={value}
              disabled={isRunning}
              spellCheck={false}
              className="font-mono"
              onChange={(event) =>
                updateTestcase(
                  activeIndex,
                  setTestcaseParam(input, params.length, paramIndex, event.target.value),
                )
              }
            />
          </label>
        ))
      ) : (
        <Textarea
          value={input}
          disabled={isRunning}
          spellCheck={false}
          placeholder="Testcase input…"
          className="min-h-24 font-mono"
          onChange={(event) => updateTestcase(activeIndex, event.target.value)}
        />
      )}
    </div>
  )
}
