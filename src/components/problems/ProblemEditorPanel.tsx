import Editor from '@monaco-editor/react'
import { Play, Send } from 'lucide-react'
import { useTheme } from 'next-themes'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatLanguageLabel, toMonacoLanguage } from '@/lib/problemFormatters'
import type { ProblemCodeTemplate, ProgrammingLanguage } from '@/types/problem.types'

type ProblemEditorPanelProps = {
  templates: ProblemCodeTemplate[]
  language: ProgrammingLanguage | null
  code: string
  onLanguageChange: (language: ProgrammingLanguage) => void
  onCodeChange: (code: string) => void
  onRun: () => void
  isRunning: boolean
  canRun: boolean
  /** Testcases + results panel under the editor. */
  runPanel: ReactNode
}

export function ProblemEditorPanel({
  templates,
  language,
  code,
  onLanguageChange,
  onCodeChange,
  onRun,
  isRunning,
  canRun,
  runPanel,
}: ProblemEditorPanelProps) {
  const { resolvedTheme } = useTheme()
  const hasTemplates = templates.length > 0
  const monacoLang = language ? toMonacoLanguage(language) : 'plaintext'
  const monacoTheme = resolvedTheme === 'light' ? 'light' : 'vs-dark'

  return (
    <section className="flex min-h-0 w-full flex-1 flex-col">
      <div className="bg-muted/40 flex items-center justify-between gap-3 border-b px-3 py-2">
        <Select
          value={language ?? undefined}
          onValueChange={(value) => onLanguageChange(value as ProgrammingLanguage)}
          disabled={!hasTemplates || isRunning}
        >
          <SelectTrigger size="sm" className="w-40">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            {templates.map((template) => (
              <SelectItem key={template.id} value={template.language}>
                {formatLanguageLabel(template.language)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <RunButton disabled={!canRun || isRunning} isRunning={isRunning} onClick={onRun} />
          <SubmitButton />
        </div>
      </div>

      <div className="bg-background min-h-0 flex-1">
        {hasTemplates ? (
          <Editor
            height="100%"
            language={monacoLang}
            theme={monacoTheme}
            value={code}
            onChange={(value) => onCodeChange(value ?? '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              padding: { top: 16 },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              readOnly: isRunning,
            }}
          />
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
            No code templates available for this problem.
          </div>
        )}
      </div>

      <div className="h-72 shrink-0 border-t lg:h-80">{runPanel}</div>
    </section>
  )
}

function RunButton({
  disabled,
  isRunning,
  onClick,
}: {
  disabled: boolean
  isRunning: boolean
  onClick: () => void
}) {
  return (
    <Button type="button" variant="outline" size="sm" disabled={disabled} onClick={onClick}>
      <Play data-icon="inline-start" />
      {isRunning ? 'Running…' : 'Run'}
    </Button>
  )
}

function SubmitButton() {
  return (
    <Button type="button" variant="default" size="sm" disabled title="Coming next">
      <Send data-icon="inline-start" />
      Submit
    </Button>
  )
}
