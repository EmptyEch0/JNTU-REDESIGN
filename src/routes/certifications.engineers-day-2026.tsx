import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/certifications/engineers-day-2026")({
  loader: async ({ location }) => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("id") || "JNTUGV-ED26-001";
    throw redirect({
      to: "/engineersday2026/certifications",
      search: { id, scan: "true" },
    });
  },
  component: () => null,
});
