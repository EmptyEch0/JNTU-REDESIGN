import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";

interface AcademicCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  linkTo: string;
  delay?: number;
}

export function AcademicCard({ title, description, icon, linkTo, delay = 0 }: AcademicCardProps) {
  return (
    <Link to={linkTo} className="block w-full h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        whileHover={{ y: -5, scale: 1.02 }}
        className="group relative h-full rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-8 shadow-sm hover:shadow-xl hover:shadow-red-900/10 dark:hover:shadow-red-900/20 transition-all duration-300 overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform translate-x-4 -translate-y-4 group-hover:scale-110 duration-200 pointer-events-none">
          <div className="w-24 h-24 text-red-600">
            {icon}
          </div>
        </div>
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center text-red-600 mb-6 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
            {icon}
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
            {title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed flex-grow">
            {description}
          </p>
          
          <div className="mt-6 flex items-center text-sm font-semibold text-red-600 dark:text-red-400 group-hover:translate-x-1 transition-transform">
            Learn more
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
