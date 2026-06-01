import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, Calendar, FileSignature, Menu, Search } from "lucide-react";

export function AcademicsMobileNav() {
  const location = useLocation();

  const NAV_ITEMS = [
    { name: "Home", to: "/academics", icon: LayoutDashboard },
    { name: "Calendar", to: "/academics/academic-calendar", icon: Calendar },
    { name: "Exams", to: "/academics/examination", icon: FileSignature },
    { name: "More", to: "/academics/more", icon: Menu }, // To trigger full menu
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 px-6 py-3 z-50 flex items-center justify-between pb-safe">
      {NAV_ITEMS.map((item) => {
        const isActive = location.pathname === item.to;
        return (
          <Link
            key={item.name}
            to={item.to}
            className={`flex flex-col items-center gap-1 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"}`}
          >
            <div className={`p-2 rounded-xl transition-colors ${isActive ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
