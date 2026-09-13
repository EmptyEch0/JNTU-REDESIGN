import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/team")({
  loader: async () => {
    if (typeof window !== "undefined") {
      window.location.replace("https://cap.jntugv.edu.in/about/team");
    } else {
      throw new Response(null, {
        status: 302,
        headers: { Location: "https://cap.jntugv.edu.in/about/team" },
      });
    }
  },
  component: () => {
    if (typeof window !== "undefined") {
      window.location.replace("https://cap.jntugv.edu.in/about/team");
    }
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-6 text-center">
        <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-wide text-slate-200">
          Redirecting to CAP JNTUGV Team Portal...
        </p>
        <a
          href="https://cap.jntugv.edu.in/about/team"
          className="mt-3 text-xs text-amber-400 underline hover:text-amber-300"
        >
          Click here if not redirected automatically
        </a>
      </div>
    );
  },
});
