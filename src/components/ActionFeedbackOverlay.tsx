import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Trash2,
  Sparkles,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";
import {
  type ActionFeedbackEvent,
  subscribeActionFeedback,
  dismissActionFeedback,
  initToastFeedbackInterceptor,
} from "@/lib/feedback";

export function ActionFeedbackOverlay() {
  const [feedback, setFeedback] = useState<ActionFeedbackEvent | null>(null);

  useEffect(() => {
    initToastFeedbackInterceptor();
    const unsubscribe = subscribeActionFeedback((event) => {
      setFeedback(event);
    });
    return unsubscribe;
  }, []);

  if (!feedback) return null;

  const config = {
    saved: {
      badge: "SAVED",
      badgeClass: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
      iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/30",
      ringGlow: "ring-emerald-500/20",
      progressBg: "bg-gradient-to-r from-emerald-500 to-teal-400",
      borderGlow: "border-emerald-500/30 shadow-emerald-500/10",
      Icon: CheckCircle2,
    },
    updated: {
      badge: "UPDATED",
      badgeClass: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30",
      iconBg: "bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-indigo-500/30",
      ringGlow: "ring-indigo-500/20",
      progressBg: "bg-gradient-to-r from-indigo-500 to-blue-400",
      borderGlow: "border-indigo-500/30 shadow-indigo-500/10",
      Icon: Sparkles,
    },
    deleted: {
      badge: "DELETED",
      badgeClass: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
      iconBg: "bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-rose-500/30",
      ringGlow: "ring-rose-500/20",
      progressBg: "bg-gradient-to-r from-rose-500 to-red-400",
      borderGlow: "border-rose-500/30 shadow-rose-500/10",
      Icon: Trash2,
    },
    error: {
      badge: "FAILED",
      badgeClass: "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30",
      iconBg: "bg-gradient-to-br from-rose-600 to-amber-600 text-white shadow-rose-500/30",
      ringGlow: "ring-rose-500/20",
      progressBg: "bg-gradient-to-r from-rose-500 to-amber-500",
      borderGlow: "border-rose-500/30 shadow-rose-500/10",
      Icon: AlertTriangle,
    },
    info: {
      badge: "INFO",
      badgeClass: "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30",
      iconBg: "bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-sky-500/30",
      ringGlow: "ring-sky-500/20",
      progressBg: "bg-gradient-to-r from-sky-500 to-blue-400",
      borderGlow: "border-sky-500/30 shadow-sky-500/10",
      Icon: Info,
    },
  }[feedback.type];

  const CurrentIcon = config.Icon;

  return (
    <div className="fixed inset-0 z-[99999] pointer-events-none flex items-center justify-center p-4">
      {/* Subtle backdrop overlay with gentle blur */}
      <AnimatePresence>
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px] pointer-events-auto"
          onClick={dismissActionFeedback}
        />
      </AnimatePresence>

      {/* Centered Animated Modal Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={feedback.id}
          initial={{ opacity: 0, scale: 0.82, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -12 }}
          transition={{
            type: "spring",
            stiffness: 420,
            damping: 28,
            mass: 0.8,
          }}
          onClick={dismissActionFeedback}
          className={`relative pointer-events-auto cursor-pointer select-none
            w-full max-w-sm sm:max-w-md
            bg-white/95 dark:bg-slate-900/95
            backdrop-blur-2xl
            border ${config.borderGlow}
            rounded-3xl p-6 sm:p-7
            shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)]
            flex flex-col items-center text-center gap-4
            overflow-hidden
          `}
        >
          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              dismissActionFeedback();
            }}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>

          {/* Animated Icon Badge */}
          <div className="relative">
            <motion.div
              initial={{ scale: 0.5, rotate: -25 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 450,
                damping: 20,
                delay: 0.05,
              }}
              className={`w-16 h-16 rounded-2xl ${config.iconBg} flex items-center justify-center shadow-xl ring-8 ${config.ringGlow}`}
            >
              <CurrentIcon size={32} className="stroke-[2.5]" />
            </motion.div>

            {/* Subtle floating pulse indicator */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-white/90" />
            </span>
          </div>

          {/* Type Badge */}
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase border ${config.badgeClass}`}
          >
            {config.badge}
          </span>

          {/* Title & Message Description */}
          <div className="space-y-1 px-2">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {feedback.title}
            </h3>
            {feedback.message && (
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs">
                {feedback.message}
              </p>
            )}
          </div>

          {/* Animated Duration Progress Bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: (feedback.duration || 2400) / 1000, ease: "linear" }}
              className={`h-full ${config.progressBg} rounded-full`}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
