import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  Calendar, 
  FileText, 
  BookOpen, 
  FileSignature, 
  Award, 
  Download, 
  Clock, 
  Briefcase,
  Users2,
  UserCheck
} from "lucide-react";

const SIDEBAR_ITEMS = [
  { name: "Dashboard", to: "/academics", icon: LayoutDashboard },
  { name: "Courses", to: "/academics/programs", icon: GraduationCap },
  { name: "Admissions", to: "/academics/admissions", icon: Users },
  { name: "Academic Calendar", to: "/academics/academic-calendar", icon: Calendar },
  { name: "Regulations", to: "/academics/regulations", icon: FileText },
  { name: "Syllabus", to: "/academics/syllabus", icon: BookOpen },
  { name: "Examinations", to: "/academics/examination", icon: FileSignature },
  { name: "CAC", to: "/academics/cac", icon: Briefcase },
  { name: "Downloads", to: "/academics/downloads", icon: Download },
  { name: "Time Tables", to: "/academics/timetables", icon: Clock },
  { name: "Scholarships", to: "/academics/scholarships", icon: Award },
  { name: "Faculty Directory", to: "/academics/faculty", icon: Users2 },
  { name: "Leadership Desk", to: "/academics/faculty", icon: UserCheck },
];

export function AcademicsSidebar() {
  const location = useLocation();

  return (
    <div className="hidden md:flex flex-col w-72 bg-white/70 dark:bg-[#0F172A]/70 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0 z-40">
      <div className="p-6">
        <Link to="/academics" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#A02021] flex items-center justify-center shadow-lg shadow-[#A02021]/20 group-hover:scale-105 transition-transform duration-300">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">JNTU-GV</h1>
            <p className="text-xs font-semibold text-[#A02021] uppercase tracking-wider">Academics</p>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 custom-scrollbar">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = location.pathname === item.to || (item.to !== "/academics" && location.pathname.startsWith(item.to));
          
          return (
            <Link
              key={item.name}
              to={item.to}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group overflow-hidden ${
                isActive 
                  ? "text-[#A02021] dark:text-red-400" 
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-sidebar-bg"
                  className="absolute inset-0 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <div className="relative z-10 flex items-center gap-3 w-full">
                <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                <span className="truncate">{item.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="active-sidebar-indicator"
                    className="absolute right-0 w-1.5 h-6 rounded-full bg-[#A02021]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
            </Link>
          );
        })}
      </div>
      
      <div className="p-6 border-t border-slate-200 dark:border-slate-800">
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/50 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#A02021]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Academic Year</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">2026 - 2027</p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">Odd Semester (R23)</p>
        </div>
      </div>
    </div>
  );
}
