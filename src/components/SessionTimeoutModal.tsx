import { useAdmin } from "@/context/AdminContext";
import { useFaculty } from "@/context/FacultyContext";
import { useNavigate } from "@tanstack/react-router";
import { Clock, ShieldAlert, LogIn, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function SessionTimeoutModal() {
  const { timedOutRole, dismissTimeoutModal } = useAdmin();
  const { timedOutFaculty, dismissFacultyTimeout } = useFaculty();
  const navigate = useNavigate();

  const isVisible = Boolean(timedOutRole || timedOutFaculty);

  if (!isVisible) return null;

  const roleTitle = timedOutRole === "admin"
    ? "Administrator Portal"
    : timedOutRole === "hod"
    ? "Department HOD Portal"
    : "Faculty Profile Portal";

  const roleDesc = timedOutRole === "admin"
    ? "Your central administrator session has automatically expired after 1 hour of activity for security protection. Please log in again to continue managing college content."
    : timedOutRole === "hod"
    ? "Your Department HOD editing session has expired after 1 hour of activity. Please log in again to continue updating departmental faculty, labs, and syllabus."
    : "Your faculty profile session has expired after 1 hour of activity. Please log in again with your faculty email and password to edit profile credentials.";

  const handleRelogin = () => {
    if (timedOutRole === "admin") {
      dismissTimeoutModal();
      navigate({ to: "/mgmt-9f3a2b1c" });
    } else if (timedOutRole === "hod") {
      dismissTimeoutModal();
      navigate({ to: "/dept-7e1c4d8a" });
    } else if (timedOutFaculty) {
      dismissFacultyTimeout();
      navigate({ to: "/staff-2b9f6e3d" });
    }
  };

  const handleDismiss = () => {
    if (timedOutRole) dismissTimeoutModal();
    if (timedOutFaculty) dismissFacultyTimeout();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ type: "spring", stiffness: 360, damping: 26 }}
          className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-amber-200/80 relative overflow-hidden"
        >
          {/* Subtle decorative glow */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center flex-shrink-0 shadow-xs">
              <Clock size={24} className="animate-pulse" />
            </div>

            <button
              onClick={handleDismiss}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              title="Close notification"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-2 mt-4 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
              <ShieldAlert size={12} />
              <span>{roleTitle}</span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Session Timed Out
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed">
              {roleDesc}
            </p>
          </div>

          <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 font-medium">
            🔒 Sessions are capped at <strong>1 hour</strong> to safeguard administrative credentials and prevent unauthorized edits.
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 mt-6 relative z-10">
            <button
              type="button"
              onClick={handleDismiss}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer text-center"
            >
              Continue as Visitor
            </button>

            <button
              type="button"
              onClick={handleRelogin}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 transition-colors shadow-sm cursor-pointer"
            >
              <LogIn size={15} />
              <span>Log In Again</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
