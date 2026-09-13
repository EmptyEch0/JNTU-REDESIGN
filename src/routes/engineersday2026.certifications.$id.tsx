import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/engineersday2026/certifications/$id")({
  loader: async ({ params }) => {
    const rawId = (params.id || "").toLowerCase();
    const isTeam47_49 = [
      "047", "048", "049",
      "jntugv-ed26-047", "jntugv-ed26-048", "jntugv-ed26-049",
      "prem", "sagar", "avinash", "leela-avinash", "charan", "gowri-charan",
    ].some((k) => rawId === k || rawId.includes(k));

    if (isTeam47_49) {
      if (typeof window !== "undefined") {
        window.location.replace("https://cap.jntugv.edu.in/about/team");
      } else {
        throw new Response(null, {
          status: 302,
          headers: { Location: "https://cap.jntugv.edu.in/about/team" },
        });
      }
    }

    const isContrib50_55 = [
      "050", "051", "052", "053", "054", "055",
      "jntugv-ed26-050", "jntugv-ed26-051", "jntugv-ed26-052", "jntugv-ed26-053", "jntugv-ed26-054", "jntugv-ed26-055",
      "vinay", "siringi", "durga", "srinivasa", "narendra", "sravya", "srujana", "bhargavi", "sneha", "swaroop",
    ].some((k) => rawId === k || rawId.includes(k));

    if (isContrib50_55) {
      if (typeof window !== "undefined") {
        window.location.replace("https://cap.jntugv.edu.in/contributors");
      } else {
        throw new Response(null, {
          status: 302,
          headers: { Location: "https://cap.jntugv.edu.in/contributors" },
        });
      }
    }

    // Redirect to the main verification page with id query param
    throw redirect({
      to: "/engineersday2026/certifications",
      search: { id: params.id, scan: "true" },
    });
  },
  component: () => null,
});

