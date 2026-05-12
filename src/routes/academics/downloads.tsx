import { createFileRoute } from "@tanstack/react-router";
import { DownloadCard } from "@/components/academics/DownloadCard";
import { DownloadCloud } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/academics/downloads")({
  component: DownloadsPage,
});

const FORMS = [
  { title: "No Dues Certificate Form", category: "General", size: "120 KB", date: "Jan 2024" },
  { title: "Railway Concession Form", category: "Student Services", size: "150 KB", date: "Jan 2024" },
  { title: "Original Degree Application Form", category: "Examination", size: "200 KB", date: "Dec 2023" },
  { title: "Migration Certificate Form", category: "Examination", size: "180 KB", date: "Dec 2023" },
  { title: "Hostel Admission Form", category: "Hostel", size: "250 KB", date: "Jul 2023" },
  { title: "Medical Leave Application", category: "General", size: "100 KB", date: "Jan 2023" },
];

function DownloadsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 mx-auto bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6"
          >
            <DownloadCloud className="w-10 h-10" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Download <span className="text-blue-600">Center</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Access and download all essential forms, documents, and resources in one place.
          </motion.p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200 dark:border-zinc-800">
          <div className="grid md:grid-cols-2 gap-4">
            {FORMS.map((form, idx) => (
              <DownloadCard key={idx} {...form} delay={idx * 0.05} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
