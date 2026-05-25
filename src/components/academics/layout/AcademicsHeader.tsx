import { useLocation, Link } from "@tanstack/react-router";
import { ChevronRight, Search, Bell, Menu } from "lucide-react";
import { motion } from "framer-motion";

export function AcademicsHeader() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const formatBreadcrumb = (str: string) => {
    return str.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };

  return (
    <header className="h-20 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button - can wire up state later if needed for a drawer */}
        <button className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <Menu className="w-6 h-6" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-sm font-medium">
          <Link to="/" className="text-slate-500 hover:text-blue-600 transition-colors">
            Home
          </Link>
          {pathnames.length > 0 && (
            <ChevronRight className="w-4 h-4 text-slate-400" />
          )}
          {pathnames.map((value, index) => {
            const isLast = index === pathnames.length - 1;
            const to = `/${pathnames.slice(0, index + 1).join("/")}`;

            return (
              <div key={to} className="flex items-center gap-2">
                {isLast ? (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-slate-900 dark:text-white font-semibold"
                  >
                    {formatBreadcrumb(value)}
                  </motion.span>
                ) : (
                  <>
                    <Link to={to} className="text-slate-500 hover:text-blue-600 transition-colors">
                      {formatBreadcrumb(value)}
                    </Link>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search resources..." 
            className="w-64 pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800/50 border-none rounded-full text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-500"
          />
        </div>
        <button className="relative p-2.5 bg-slate-100 dark:bg-slate-800/50 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>
      </div>
    </header>
  );
}
