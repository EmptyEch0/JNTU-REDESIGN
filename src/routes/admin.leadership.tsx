import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import { LeadershipManagementPanel } from "@/components/admin/LeadershipManagementPanel";
import {
  Users,
  Building2,
  ArrowLeft,
  Shield,
  Bot,
  LogOut,
  ExternalLink,
} from "lucide-react";

export const Route = createFileRoute("/admin/leadership")({
  head: () => ({
    meta: [
      { title: "Leadership Management — JNTU-GV Admin Portal" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLeadershipPage,
});

function AdminLeadershipPage() {
  const { isAdmin, logout } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate({ to: "/mgmt-9f3a2b1c" });
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center p-8">
          <Shield className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h2 className="text-base font-bold text-slate-700 dark:text-slate-200">
            Admin Authentication Required
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Redirecting to secure login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            to="/mgmt-9f3a2b1c"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#0F4C81] dark:hover:text-sky-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Admin Dashboard</span>
          </Link>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#0F4C81]/10 dark:bg-sky-500/10 text-[#0F4C81] dark:text-sky-400">
              <Users className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">
              Institutional Leadership
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/chatbot-analytics"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300 transition"
          >
            <Bot className="w-3.5 h-3.5" /> AI Bot Analytics
          </Link>

          <Link
            to="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" /> View Public Site
          </Link>

          <button
            onClick={() => {
              logout();
              navigate({ to: "/mgmt-9f3a2b1c" });
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <LeadershipManagementPanel />
      </main>
    </div>
  );
}

