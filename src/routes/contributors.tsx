import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contributors")({
  loader: async () => {
    if (typeof window !== "undefined") {
      window.location.replace("https://cap.jntugv.edu.in/contributors");
    } else {
      throw new Response(null, {
        status: 302,
        headers: { Location: "https://cap.jntugv.edu.in/contributors" },
      });
    }
  },
  component: () => {
    if (typeof window !== "undefined") {
      window.location.replace("https://cap.jntugv.edu.in/contributors");
    }
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-6 text-center">
        <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-wide text-slate-200">
          Redirecting to CAP JNTUGV Contributors Portal...
        </p>
        <a
          href="https://cap.jntugv.edu.in/contributors"
          className="mt-3 text-xs text-emerald-400 underline hover:text-emerald-300"
        >
          Click here if not redirected automatically
        </a>
      </div>
    );
  },
});
