import { Outlet, createRootRoute } from '@tanstack/react-router'
import { AppToaster } from '@/components/theme/app-toaster'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <Outlet />
      <AppToaster />
    </>
  )
}
