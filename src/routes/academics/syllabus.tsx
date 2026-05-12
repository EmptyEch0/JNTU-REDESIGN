import { createFileRoute } from "@tanstack/react-router";
import { DownloadCard } from "@/components/academics/DownloadCard";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/academics/syllabus")({
  component: SyllabusPage,
});

const SYLLABUS_DATA = [
  { title: "B.Tech CSE R20 Syllabus", category: "CSE", size: "4.2 MB", date: "Updated 2023" },
  { title: "B.Tech ECE R20 Syllabus", category: "ECE", size: "3.8 MB", date: "Updated 2023" },
  { title: "B.Tech EEE R20 Syllabus", category: "EEE", size: "3.5 MB", date: "Updated 2023" },
  { title: "B.Tech MECH R20 Syllabus", category: "MECH", size: "4.0 MB", date: "Updated 2023" },
  { title: "B.Tech CIVIL R20 Syllabus", category: "CIVIL", size: "4.5 MB", date: "Updated 2023" },
  { title: "B.Tech IT R20 Syllabus", category: "IT", size: "3.9 MB", date: "Updated 2023" },
  { title: "B.Tech CSE R23 Syllabus", category: "CSE", size: "2.1 MB", date: "New 2023" },
];

function SyllabusPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredData = SYLLABUS_DATA.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "All" || item.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Course <span className="text-red-600">Syllabus</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-400"
          >
            Detailed curriculum and syllabus for all departments and regulations.
          </motion.p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200 dark:border-zinc-800 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search syllabus by branch or regulation..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 dark:bg-zinc-800 border-none text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-6 py-4 rounded-xl bg-gray-50 dark:bg-zinc-800 border-none text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-red-500 outline-none"
            >
              <option value="All">All Branches</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="MECH">MECH</option>
              <option value="CIVIL">CIVIL</option>
              <option value="IT">IT</option>
            </select>
          </div>
        </div>

        {filteredData.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredData.map((item, idx) => (
              <DownloadCard key={idx} {...item} delay={idx * 0.05} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800">
            <p className="text-gray-500 dark:text-gray-400">No syllabus found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
