import { createFileRoute } from '@tanstack/react-router'
import Editor from '@monaco-editor/react'
import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { submitCode, checkJobStatus } from '../api/compilerApi'

export const Route = createFileRoute('/')({
  component: Index,
})

const CODE_SNIPPETS: Record<string, string> = {
  javascript: 'console.log("Hello, World!");\n',
  python: 'print("Hello, World!")\n',
  cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!\\n";\n    return 0;\n}\n',
}

function Index() {
  const [language, setLanguage] = useState<string>('javascript')
  const [code, setCode] = useState<string>(CODE_SNIPPETS['javascript'])
  const [currentJobId, setCurrentJobId] = useState<string | null>(null)

  // 1. Mutation to submit code to the backend
  const runCodeMutation = useMutation({
    mutationFn: () => submitCode(language, code),
    onSuccess: (data) => {
      setCurrentJobId(data.jobId) // Save the jobId to trigger polling
    },
    onError: (error) => {
      console.error('Failed to submit code:', error)
    },
  })

  // 2. Query to poll the job status
  const { data: jobStatus, isError } = useQuery({
    queryKey: ['jobStatus', currentJobId],
    queryFn: () => checkJobStatus(currentJobId!),
    // Only run this query if we have a jobId
    enabled: !!currentJobId,
    // Poll every 1 second UNTIL the status is 'completed' or 'failed'
    refetchInterval: (query) => {
      const status = query.state.data?.status
      if (status === 'completed' || status === 'failed') {
        return false // Stop polling
      }
      return 1000 // Poll every 1s
    },
  })

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) setCode(value)
  }

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value
    setLanguage(newLang)
    setCode(CODE_SNIPPETS[newLang])
    setCurrentJobId(null) // Reset output when language changes
  }

  const handleRunClick = () => {
    setCurrentJobId(null) // Clear previous runs
    runCodeMutation.mutate()
  }

  // Determine what to show in the output console
  const renderOutput = () => {
    if (runCodeMutation.isPending) {
      return <p className="text-blue-400">Submitting code to server...</p>
    }
    if (!currentJobId) {
      return <p className="text-zinc-500 italic">Click "Run" to see the output here...</p>
    }
    if (jobStatus?.status === 'completed') {
      return <pre className="text-emerald-400 whitespace-pre-wrap">{jobStatus.output}</pre>
    }
    if (jobStatus?.status === 'failed' || isError) {
      return (
        <pre className="text-red-400 whitespace-pre-wrap">
          {jobStatus?.error || 'Execution failed'}
        </pre>
      )
    }
    if (jobStatus?.status === 'active') {
      return <p className="text-yellow-400 animate-pulse">Executing in secure container...</p>
    } else {
      return <p className="text-yellow-400 animate-pulse">Execution Queued...</p>
    }
  }

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 font-sans">
      <header className="flex items-center justify-between px-6 py-3 bg-zinc-900 border-b border-zinc-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center font-bold text-xl">
            /
          </div>
          <h1 className="text-xl font-semibold tracking-tight">OneCompiler</h1>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-zinc-700"
          >
            <option value="javascript">JavaScript (Node.js)</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
          </select>

          <button
            onClick={handleRunClick}
            disabled={runCodeMutation.isPending || !!jobStatus?.status}
            className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                clipRule="evenodd"
              />
            </svg>
            {runCodeMutation.isPending || !!jobStatus?.status ? 'Running...' : 'Run'}
          </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col lg:flex-row overflow-hidden">
        <section className="flex-grow h-full lg:w-2/3 border-r border-zinc-800">
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={handleEditorChange}
            options={{ minimap: { enabled: false }, fontSize: 15, padding: { top: 16 } }}
          />
        </section>

        <section className="h-1/3 lg:h-full lg:w-1/3 bg-zinc-950 flex flex-col">
          <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800 flex items-center">
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Output / Console
            </h2>
          </div>
          <div className="flex-grow p-4 font-mono text-sm overflow-y-auto">{renderOutput()}</div>
        </section>
      </main>
    </div>
  )
}
