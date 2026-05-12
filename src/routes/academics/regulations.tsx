import { createFileRoute } from "@tanstack/react-router";
import { DownloadCard } from "@/components/academics/DownloadCard";
import { motion } from "framer-motion";

export const Route = createFileRoute("/academics/regulations")({
  component: RegulationsPage,
});

const REGS_BTECH = [
  { title: "R23 Academic Regulations (B.Tech)", category: "B.Tech", size: "1.2 MB", date: "Sep 2023" },
  { title: "R20 Academic Regulations (B.Tech)", category: "B.Tech", size: "1.5 MB", date: "Aug 2020" },
  { title: "R19 Academic Regulations (B.Tech)", category: "B.Tech", size: "2.1 MB", date: "Jul 2019" },
];

const REGS_MTECH = [
  { title: "R23 Academic Regulations (M.Tech)", category: "M.Tech", size: "900 KB", date: "Sep 2023" },
  { title: "R20 Academic Regulations (M.Tech)", category: "M.Tech", size: "1.1 MB", date: "Aug 2020" },
];

function RegulationsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Academic <span className="text-red-600">Regulations</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-400"
          >
            Rules, guidelines, and procedures governing academic programs.
          </motion.p>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-sm">UG</span>
              B.Tech Regulations
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {REGS_BTECH.map((reg, idx) => (
                <DownloadCard key={idx} {...reg} delay={idx * 0.1} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm">PG</span>
              M.Tech & MBA Regulations
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {REGS_MTECH.map((reg, idx) => (
                <DownloadCard key={idx} {...reg} delay={idx * 0.1} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
