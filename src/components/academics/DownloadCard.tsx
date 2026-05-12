import { motion } from "framer-motion";
import { Download, FileText, File } from "lucide-react";

interface DownloadCardProps {
  title: string;
  category: string;
  size: string;
  date: string;
  delay?: number;
}

export function DownloadCard({ title, category, size, date, delay = 0 }: DownloadCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
      className="group flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-red-200 dark:hover:border-red-900/50 transition-all"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-gray-400 group-hover:text-red-500 group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-colors">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">{title}</h4>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
            <span className="bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300 font-medium">
              {category}
            </span>
            <span>{size}</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">{date}</span>
          </div>
        </div>
      </div>
      
      <button className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-600/20 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900">
        <Download className="w-5 h-5" />
      </button>
    </motion.div>
  );
}
