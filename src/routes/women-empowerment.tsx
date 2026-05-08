import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/women-empowerment')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/women-empowerment"!</div>
}
