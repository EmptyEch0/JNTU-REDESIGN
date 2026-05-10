import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/campus-life")({
  component: () => <Outlet />,
});
