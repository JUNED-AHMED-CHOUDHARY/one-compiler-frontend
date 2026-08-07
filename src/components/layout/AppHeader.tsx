import { Link, useNavigate } from '@tanstack/react-router'
import { Code2, LogOut } from 'lucide-react'
import { ModeToggle } from '@/components/theme/mode-toggle'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { NAV_ITEMS } from '@/config/navigation'
import { isAuthenticated, logout } from '@/lib/auth'
import { cn } from '@/lib/utils'

type AppHeaderProps = {
  subtitle?: string
  /** Workspace pages use the full viewport width (no max-w-6xl). */
  fullWidth?: boolean
}

export function AppHeader({ subtitle, fullWidth = false }: AppHeaderProps) {
  const navigate = useNavigate()
  const authed = isAuthenticated()

  const handleLogout = () => {
    logout()
    void navigate({ to: '/auth/login' })
  }

  return (
    <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur-md">
      <div
        className={cn(
          'flex h-14 items-center justify-between gap-4 px-4 sm:px-6',
          fullWidth ? 'w-full' : 'mx-auto max-w-6xl',
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
              <Code2 className="size-4" />
            </span>
            <span className="text-sm font-semibold tracking-tight">JJ Code</span>
          </Link>

          <Separator orientation="vertical" className="hidden h-5 sm:block" />

          <nav className="flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => (
              <Button
                key={item.to}
                asChild
                variant="ghost"
                size="sm"
                className="text-muted-foreground data-[status=active]:bg-muted data-[status=active]:text-foreground"
              >
                <Link to={item.to} activeOptions={{ exact: item.exact }}>
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {subtitle ? (
            <p className="text-muted-foreground hidden max-w-[220px] truncate text-sm lg:block">
              {subtitle}
            </p>
          ) : null}
          <ModeToggle />
          {authed ? (
            <Button type="button" variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut data-icon="inline-start" />
              Logout
            </Button>
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link to="/auth/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
