import { useEffect, useRef } from 'react'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import '@xterm/xterm/css/xterm.css' // Updated CSS import path

interface TerminalOutputProps {
  status: 'idle' | 'pending' | 'completed' | 'failed'
  pendingPhase?: 'running' | 'queued'
  output?: string
  error?: string
}

export function TerminalOutput({
  status,
  pendingPhase = 'queued',
  output,
  error,
}: TerminalOutputProps) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const xtermInstance = useRef<Terminal | null>(null)
  const fitAddon = useRef<FitAddon | null>(null)

  useEffect(() => {
    if (!terminalRef.current) return

    // Initialize xterm.js
    const term = new Terminal({
      theme: {
        background: '#09090b', // Matches Tailwind zinc-950
        foreground: '#d4d4d8', // Matches Tailwind zinc-300
        cursor: '#10b981', // Emerald cursor
      },
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      fontSize: 14,
      scrollback: 200_000,
      disableStdin: true, // Read-only for now
      convertEol: true, // Treat \n as new lines properly
    })

    const fit = new FitAddon()
    term.loadAddon(fit)

    term.open(terminalRef.current)
    fit.fit() // Initial fit

    xtermInstance.current = term
    fitAddon.current = fit

    // Handle window resize events to keep the terminal fitting perfectly
    const handleResize = () => fit.fit()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      term.dispose()
    }
  }, [])

  // Watch for status/output changes and write to the terminal
  useEffect(() => {
    const term = xtermInstance.current
    if (!term) return

    term.clear() // Clear previous output

    if (status === 'idle') {
      term.writeln('\x1b[3m\x1b[90mClick "Run" to see the output here...\x1b[0m') // Italic grey
    } else if (status === 'pending') {
      if (pendingPhase === 'running') {
        term.writeln('\x1b[33m\u231B Executing in secure container...\x1b[0m') // Yellow
      } else {
        term.writeln('\x1b[33m\u23F3 Execution queued...\x1b[0m') // Yellow
      }
    } else if (status === 'completed' && output) {
      term.write(output, () => {
        term.writeln('\n\x1b[32m\n\u2714 Execution finished.\x1b[0m') // Green success
        term.scrollToTop()
      })
    } else if (status === 'completed') {
      term.writeln('\x1b[32m\u2714 Execution finished.\x1b[0m')
    } else if (status === 'failed') {
      term.write(`\x1b[31m${error || 'Execution failed'}\x1b[0m`) // Red error
      term.scrollToTop()
    }
  }, [status, pendingPhase, output, error])

  return <div ref={terminalRef} className="h-full w-full overflow-hidden" />
}
