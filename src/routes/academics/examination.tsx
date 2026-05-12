import { createFileRoute } from "@tanstack/react-router";
import { ExaminationPanel } from "@/components/academics/ExaminationPanel";
import { BellRing, FileSignature, GraduationCap, Laptop } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/academics/examination")({
  component: ExaminationPage,
});

function ExaminationPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 mx-auto bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mb-6 rotate-3"
          >
            <FileSignature className="w-10 h-10 -rotate-3" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Examination <span className="text-red-600">Cell</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Central hub for all examination related notifications, time tables, results, and academic services.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <ExaminationPanel 
            title="Notifications" 
            description="Latest updates from the examination branch"
            icon={<BellRing className="w-6 h-6" />}
            links={[
              { label: "B.Tech II Sem Regular Exam Fee Notification", href: "#" },
              { label: "Postponement of M.Tech Exams", href: "#" },
              { label: "Revaluation Results Notification", href: "#" },
            ]}
            delay={0.1}
          />
          
          <ExaminationPanel 
            title="Time Tables" 
            description="Schedules for upcoming internal and external exams"
            icon={<FileSignature className="w-6 h-6" />}
            links={[
              { label: "B.Tech I Year II Sem Time Table", href: "#" },
              { label: "B.Tech IV Year II Sem Advanced Supply Time Table", href: "#" },
              { label: "M.Tech I Sem Regular Time Table", href: "#" },
            ]}
            delay={0.2}
          />
          
          <ExaminationPanel 
            title="Results Dashboard" 
            description="Access your semester and revaluation results"
            icon={<GraduationCap className="w-6 h-6" />}
            links={[
              { label: "B.Tech Regular Results Portal", href: "#" },
              { label: "M.Tech Results Portal", href: "#" },
              { label: "Revaluation/Recounting Results", href: "#" },
            ]}
            delay={0.3}
          />
          
          <ExaminationPanel 
            title="Student Services" 
            description="Online applications for certificates and transcripts"
            icon={<Laptop className="w-6 h-6" />}
            links={[
              { label: "Apply for Original Degree (OD)", href: "#" },
              { label: "Transcripts Online Portal", href: "#" },
              { label: "Duplicate Marks Memo Request", href: "#" },
            ]}
            delay={0.4}
          />
        </div>
      </div>
    </div>
  );
}
