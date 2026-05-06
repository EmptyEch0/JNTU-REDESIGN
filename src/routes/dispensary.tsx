import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dispensary")({
  head: () => ({
    meta: [
      { title: "Dispensary — JNTU-GV CEV" },
      { name: "description", content: "On-campus medical care, first aid and student wellness." },
      { property: "og:title", content: "Dispensary at JNTU-GV CEV" },
      { property: "og:description", content: "Doctor visits, common medicines and emergency response on campus." },
    ],
  }),
  component: () => <Outlet />,
});
