import { motion } from "framer-motion";
import { Bell, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface Announcement {
  id: string;
  text: string;
  isNew?: boolean;
  link?: string;
}

interface AnnouncementTickerProps {
  announcements: Announcement[];
}

export function AnnouncementTicker({ announcements }: AnnouncementTickerProps) {
  if (!announcements.length) return null;

  return (
    <div className="w-full bg-red-600/5 dark:bg-red-900/10 border-y border-red-100 dark:border-red-900/30 overflow-hidden flex items-center h-12">
      <div className="flex-shrink-0 bg-red-600 dark:bg-red-700 text-white px-4 h-full flex items-center justify-center font-semibold text-sm gap-2 z-10 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
        <Bell className="w-4 h-4 animate-swing" />
        <span>Latest Updates</span>
      </div>
      
      <div className="flex-grow overflow-hidden relative h-full">
        <motion.div 
          className="flex whitespace-nowrap h-full items-center"
          animate={{ x: [0, -1000] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {/* Duplicate for infinite seamless scrolling */}
          {[...announcements, ...announcements].map((item, index) => (
            <div key={`${item.id}-${index}`} className="flex items-center px-8">
              {item.isNew && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider mr-3 animate-pulse">
                  New
                </span>
              )}
              {item.link ? (
                <Link to={item.link} className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1 transition-colors">
                  {item.text}
                  <ArrowRight className="w-3 h-3" />
                </Link>
              ) : (
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {item.text}
                </span>
              )}
              <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 mx-8"></div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
