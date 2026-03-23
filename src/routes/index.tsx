import { createFileRoute } from '@tanstack/react-router'
import Editor from '@monaco-editor/react'
import { useState } from 'react'

export const Route = createFileRoute('/')({
  component: Index,
})

// Default snippets for our supported languages
const CODE_SNIPPETS: Record<string, string> = {
  javascript: 'console.log("Hello, World!");\n',
  python: 'print("Hello, World!")\n',
  cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!\\n";\n    return 0;\n}\n',
}

function Index() {
  const [language, setLanguage] = useState<string>('javascript')
  const [code, setCode] = useState<string>(CODE_SNIPPETS['javascript'])

  // Handle code changes in the editor
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value)
    }
  }

  // Handle language switching
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value
    setLanguage(newLang)
    setCode(CODE_SNIPPETS[newLang]) // Auto-fill with the default snippet
  }

  const handleRunClick = () => {
    console.log(`Running ${language} code:`, code)
    alert('Check browser console. Output pane coming next!')
  }

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* Header / Navbar */}
      <header className="flex items-center justify-between px-6 py-3 bg-zinc-900 border-b border-zinc-800 shadow-sm">
        <div className="flex items-center gap-3">
          {/* You can replace this div with your actual logo later */}
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center font-bold text-xl">
            /
          </div>
          <h1 className="text-xl font-semibold tracking-tight">OneCompiler</h1>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer hover:bg-zinc-700"
          >
            <option value="javascript">JavaScript (Node.js)</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
          </select>

          <button
            onClick={handleRunClick}
            className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-md transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
          >
            {/* Play Icon SVG */}
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
            Run
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-grow flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Code Editor */}
        <section className="flex-grow h-full lg:w-2/3 border-r border-zinc-800">
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              fontSize: 15,
              wordWrap: 'on',
              padding: { top: 16 },
              scrollBeyondLastLine: false,
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
            }}
            loading={
              <div className="flex items-center justify-center h-full text-zinc-500">
                Loading Editor...
              </div>
            }
          />
        </section>

        {/* Right Side: Output/Console Placeholder */}
        <section className="h-1/3 lg:h-full lg:w-1/3 bg-zinc-950 flex flex-col">
          <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800 flex items-center">
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Output / Console
            </h2>
          </div>
          <div className="flex-grow p-4 font-mono text-sm text-zinc-300 overflow-y-auto">
            {/* This is where the actual output will go later */}
            <p className="text-zinc-500 italic">Click "Run" to see the output here...</p>
          </div>
        </section>
      </main>
    </div>
  )
}
