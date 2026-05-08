import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/professional-bodies')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/professional-bodies"!</div>
}
