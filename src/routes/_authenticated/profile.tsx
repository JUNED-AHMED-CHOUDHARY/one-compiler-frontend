import { createFileRoute, Link } from '@tanstack/react-router'
import { UserRound } from 'lucide-react'
import { StatePanel } from '@/components/feedback/StatePanel'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_authenticated/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  return (
    <AppShell>
      <main className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-8 sm:px-6">
        <StatePanel
          icon={UserRound}
          title="Profile coming soon"
          description="Account settings and submission history will live here."
          className="border"
          action={
            <Button asChild variant="outline" size="sm">
              <Link to="/">Back to problems</Link>
            </Button>
          }
        />
      </main>
    </AppShell>
  )
}
