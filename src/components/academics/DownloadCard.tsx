import { motion } from "framer-motion";
import { Download, Eye, FileText } from "lucide-react";
import { downloadFile, previewFile } from "@/lib/download";

interface DownloadCardProps {
  title: string;
  category: string;
  size?: string;
  date?: string;
  link?: string;
  pdf_url?: string;
  file_url?: string;
  delay?: number;
}

export function DownloadCard({
  title,
  category,
  size,
  date,
  link,
  pdf_url,
  file_url,
  delay = 0,
}: DownloadCardProps) {
  const targetUrl = link || pdf_url || file_url || "";

  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    previewFile(targetUrl);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadFile(targetUrl, `${title}.pdf`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
      className="group flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-red-200 dark:hover:border-red-900/50 transition-all"
    >
      <div className="flex items-center gap-4 min-w-0 flex-1 pr-3">
        <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-zinc-800 flex-shrink-0 flex items-center justify-center text-gray-400 group-hover:text-red-500 group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-colors">
          <FileText className="w-6 h-6" />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-red-600 transition-colors">
            {title}
          </h4>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
            <span className="bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300 font-medium text-[11px]">
              {category}
            </span>
            {size && <span>{size}</span>}
            {date && <span className="hidden sm:inline">•</span>}
            {date && <span className="hidden sm:inline">{date}</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={handlePreview}
          title="Preview Regulation Online"
          className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300 transition-all focus:outline-none cursor-pointer"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleDownload}
          title="Download Regulation PDF to Device"
          className="w-9 h-9 rounded-full flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-600/20 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 cursor-pointer"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
