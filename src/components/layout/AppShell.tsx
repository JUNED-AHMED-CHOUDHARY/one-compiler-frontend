import type { ReactNode } from 'react'
import { AppHeader } from '@/components/layout/AppHeader'
import { cn } from '@/lib/utils'

type AppShellProps = {
  children: ReactNode
  subtitle?: string
  variant?: 'page' | 'workspace'
  className?: string
}

export function AppShell({ children, subtitle, variant = 'page', className }: AppShellProps) {
  return (
    <div
      className={cn(
        variant === 'workspace' ? 'flex h-svh flex-col overflow-hidden' : 'min-h-svh',
        className,
      )}
    >
      <AppHeader subtitle={subtitle} />
      <div className={cn(variant === 'workspace' && 'flex min-h-0 flex-1 flex-col')}>
        {children}
      </div>
    </div>
  )
}
