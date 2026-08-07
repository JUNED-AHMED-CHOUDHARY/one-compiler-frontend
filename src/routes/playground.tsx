import { createFileRoute, Link } from '@tanstack/react-router'
import Editor from '@monaco-editor/react'
import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { submitCode, checkJobStatus } from '../api/compilerApi'
import { TerminalOutput } from '../components/programming/TerminalOutput'

export const Route = createFileRoute('/playground')({
  component: Playground,
})

const CODE_SNIPPETS: Record<string, string> = {
  javascript: 'console.log("Hello, World!");\n',
  python: 'print("Hello, World!")\n',
  cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!\\n";\n    return 0;\n}\n',
}

function Playground() {
  const [language, setLanguage] = useState<string>('javascript')
  const [code, setCode] = useState<string>(CODE_SNIPPETS['javascript'])
  const [customInput, setCustomInput] = useState<string>('')
  const [currentJobId, setCurrentJobId] = useState<string | null>(null)

  const runCodeMutation = useMutation({
    mutationFn: () => submitCode(language, code, customInput),
    onSuccess: (data) => {
      setCurrentJobId(data.jobId)
    },
    onError: (error) => {
      console.error('Failed to submit code:', error)
    },
  })

  const { data: jobStatus, isError } = useQuery({
    queryKey: ['jobStatus', currentJobId],
    queryFn: () => checkJobStatus(currentJobId!),
    enabled: !!currentJobId,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      if (status === 'completed' || status === 'failed') {
        return false
      }
      return 500
    },
  })

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) setCode(value)
  }

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value
    setLanguage(newLang)
    setCode(CODE_SNIPPETS[newLang])
    setCurrentJobId(null)
  }

  const handleRunClick = () => {
    setCurrentJobId(null)
    runCodeMutation.mutate()
  }

  const isFinished = jobStatus?.status === 'completed' || jobStatus?.status === 'failed'
  const isJobInProgress = Boolean(currentJobId) && !isFinished
  const pendingPhase: 'running' | 'queued' = jobStatus?.status === 'active' ? 'running' : 'queued'

  let terminalStatus: 'idle' | 'pending' | 'completed' | 'failed' = 'idle'
  if (runCodeMutation.isPending || isJobInProgress) {
    terminalStatus = 'pending'
  } else if (jobStatus?.status === 'completed') {
    terminalStatus = 'completed'
  } else if (jobStatus?.status === 'failed' || runCodeMutation.isError || isError) {
    terminalStatus = 'failed'
  }

  return (
    <div className="flex h-screen flex-col bg-zinc-950 font-sans text-zinc-100">
      <header className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-6 py-3 shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-xl font-bold">
              /
            </div>
            <h1 className="text-xl font-semibold tracking-tight">JJ Compiler</h1>
          </Link>
          <Link to="/" className="text-sm text-zinc-400 transition-colors hover:text-zinc-200">
            ← Problems
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="cursor-pointer rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 outline-none hover:bg-zinc-700 focus:ring-2 focus:ring-blue-500"
          >
            <option value="javascript">JavaScript (Node.js)</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
          </select>

          <button
            onClick={handleRunClick}
            disabled={runCodeMutation.isPending || isJobInProgress}
            className="flex items-center gap-2 rounded-md bg-emerald-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path
                fillRule="evenodd"
                d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                clipRule="evenodd"
              />
            </svg>
            {runCodeMutation.isPending || isJobInProgress ? 'Running...' : 'Run'}
          </button>
        </div>
      </header>

      <main className="flex flex-grow flex-col overflow-hidden lg:flex-row">
        <section className="h-1/2 flex-grow border-r border-zinc-800 lg:h-full lg:w-2/3">
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={handleEditorChange}
            options={{ minimap: { enabled: false }, fontSize: 15, padding: { top: 16 } }}
          />
        </section>

        <section className="flex h-1/2 flex-col bg-zinc-950 lg:h-full lg:w-1/3">
          <div className="flex h-1/3 flex-col border-b border-zinc-800">
            <div className="flex items-center border-b border-zinc-800 bg-zinc-900 px-4 py-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Standard Input (stdin)
              </h2>
            </div>
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Enter inputs here (one per line)..."
              className="flex-grow resize-none bg-zinc-950 p-4 font-mono text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-zinc-700"
              spellCheck={false}
            />
          </div>

          <div className="relative flex flex-grow flex-col">
            <div className="flex items-center border-b border-zinc-800 bg-zinc-900 px-4 py-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Output / Console
              </h2>
            </div>
            <div className="relative flex-grow overflow-hidden p-4">
              <TerminalOutput
                status={terminalStatus}
                pendingPhase={pendingPhase}
                output={jobStatus?.output}
                error={jobStatus?.error}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
