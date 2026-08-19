import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/latest-updates")({
  component: () => <Outlet />,
});
