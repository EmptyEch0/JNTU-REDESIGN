import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/engineersday2026/certifications/$id")({
  loader: async ({ params }) => {
    // Redirect to the main verification page with id query param
    throw redirect({
      to: "/engineersday2026/certifications",
      search: { id: params.id, scan: "true" },
    });
  },
  component: () => null,
});
