import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  delay?: number;
  hoverEffect?: boolean;
}

export function GlassCard({ children, className = "", delay = 0, hoverEffect = true, ...props }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={`bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-sm ${
        hoverEffect ? "hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300" : ""
      } overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
