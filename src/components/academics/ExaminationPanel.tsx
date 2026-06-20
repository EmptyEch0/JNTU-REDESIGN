import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { FileText, Calendar, Bell, ShieldCheck } from "lucide-react";

interface PanelProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  links: { label: string; href: string }[];
  delay?: number;
}

export function ExaminationPanel({ title, description, icon, links, delay = 0 }: PanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-gray-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-red-500/10 transition-colors duration-200 pointer-events-none"></div>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 text-white flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        </div>
      </div>
      
      <div className="space-y-3 mt-8">
        {links.map((link, idx) => (
          <Link
            key={idx}
            to={link.href}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 group/link transition-colors"
          >
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover/link:text-red-600 dark:group-hover/link:text-red-400 transition-colors">
              {link.label}
            </span>
            <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center text-gray-400 group-hover/link:text-red-500 group-hover/link:shadow-md transition-all">
              <svg className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
