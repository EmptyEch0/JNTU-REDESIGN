import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Clock, Users, ArrowRight, BookOpen } from "lucide-react";

interface ProgramCardProps {
  id: string;
  title: string;
  department: string;
  duration: string;
  intake: number;
  type: "UG" | "PG" | "PhD";
  description: string;
  delay?: number;
}

export function ProgramCard({ id, title, department, duration, intake, type, description, delay = 0 }: ProgramCardProps) {
  const typeColors = {
    UG: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50",
    PG: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50",
    PhD: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/50",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className="group flex flex-col bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 overflow-hidden hover:shadow-2xl hover:shadow-red-900/5 hover:-translate-y-1 transition-all duration-300"
    >
      <div className="p-6 flex-grow">
        <div className="flex items-start justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${typeColors[type]}`}>
            {type} Program
          </span>
          <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-gray-400 group-hover:bg-red-50 group-hover:text-red-500 transition-colors">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
          {title}
        </h3>
        <p className="text-sm font-medium text-red-600/80 dark:text-red-400/80 mb-4">
          {department}
        </p>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-6">
          {description}
        </p>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-auto pt-4 border-t border-gray-100 dark:border-zinc-800/50">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>{intake} Seats</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 group-hover:bg-red-600 transition-colors duration-300">
        <Link 
          to={`/departments`}
          className="flex items-center justify-center w-full gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:text-white transition-colors"
        >
          View Curriculum
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
