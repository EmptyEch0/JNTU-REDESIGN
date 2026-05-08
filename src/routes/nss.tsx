import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/nss')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/nss"!</div>
}
