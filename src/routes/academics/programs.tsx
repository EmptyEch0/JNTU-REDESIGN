import { createFileRoute } from "@tanstack/react-router";
import { ProgramCard } from "@/components/academics/ProgramCard";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export const Route = createFileRoute("/academics/programs")({
  component: ProgramsPage,
});

// Dummy API data
const DUMMY_PROGRAMS = [
  { id: "ug1", title: "Computer Science and Engineering", department: "Department of CSE", duration: "4 Years", intake: 120, type: "UG" as const, description: "Focuses on computing theory, programming, systems, and software development methodologies." },
  { id: "ug2", title: "Information Technology", department: "Department of IT", duration: "4 Years", intake: 60, type: "UG" as const, description: "Covers network administration, software development, and information management systems." },
  { id: "ug3", title: "Electronics and Communication", department: "Department of ECE", duration: "4 Years", intake: 120, type: "UG" as const, description: "Study of electronic devices, circuits, communication equipment like transmitter, receiver, integrated circuits (IC)." },
  { id: "pg1", title: "M.Tech in Computer Science", department: "Department of CSE", duration: "2 Years", intake: 18, type: "PG" as const, description: "Advanced studies in AI, Machine Learning, Data Science, and Cloud Computing architectures." },
  { id: "phd1", title: "Ph.D in Engineering", department: "All Engineering Departments", duration: "3-5 Years", intake: 10, type: "PhD" as const, description: "Advanced research programs in various disciplines of engineering and technology." },
];

function ProgramsPage() {
  const [filter, setFilter] = useState<"All" | "UG" | "PG" | "PhD">("All");
  const [programs, setPrograms] = useState(DUMMY_PROGRAMS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Example Axios API integration for future use
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        // const response = await axios.get('/api/programs');
        // setPrograms(response.data);
        setTimeout(() => setLoading(false), 500); // Simulate network
      } catch (error) {
        console.error("Error fetching programs", error);
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  const filteredPrograms = filter === "All" ? programs : programs.filter(p => p.type === filter);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Programs <span className="text-red-600">Offered</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Discover academic excellence through our rigorous programs designed to foster innovation, research, and technical mastery.
          </motion.p>
        </div>

        <div className="flex justify-center gap-2 md:gap-4 mb-12 flex-wrap">
          {["All", "UG", "PG", "PhD"].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t as any)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                filter === t 
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/30 scale-105" 
                  : "bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-zinc-800 hover:border-red-300 hover:text-red-600"
              }`}
            >
              {t === "All" ? "All Programs" : `${t} Programs`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((program, idx) => (
              <ProgramCard key={program.id} {...program} delay={idx * 0.1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
