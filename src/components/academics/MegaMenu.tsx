import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ChevronDown, GraduationCap, Calendar, BookOpen, FileText, Award, Users } from "lucide-react";
import { useState } from "react";

const MENU_ITEMS = [
  { name: "Programs", to: "/academics/programs", icon: GraduationCap, desc: "UG, PG & Ph.D details" },
  { name: "Admissions", to: "/academics/admissions", icon: Users, desc: "Process & Fee structure" },
  { name: "Syllabus", to: "/academics/syllabus", icon: BookOpen, desc: "Curriculum & courses" },
  { name: "Regulations", to: "/academics/regulations", icon: FileText, desc: "Academic guidelines" },
  { name: "Calendar", to: "/academics/academic-calendar", icon: Calendar, desc: "Schedules & events" },
  { name: "Scholarships", to: "/academics/scholarships", icon: Award, desc: "Financial assistance" },
];

export function MegaMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-50">
      <button 
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 transition-colors"
      >
        Academics Portal
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          className="absolute left-0 mt-2 w-[600px] rounded-2xl bg-white/80 dark:bg-zinc-900/90 backdrop-blur-xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden p-6"
        >
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            {MENU_ITEMS.map((item) => (
              <Link 
                key={item.name}
                to={item.to}
                className="group flex gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                    <item.icon className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    {item.name}
                  </h4>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {item.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-zinc-800 grid grid-cols-2 gap-4">
            <Link to="/academics/examination" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400">
              Examination Cell →
            </Link>
            <Link to="/academics/downloads" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 text-right">
              Download Center →
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}
