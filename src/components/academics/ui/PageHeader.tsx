import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
}

export function PageHeader({ title, subtitle, icon: Icon }: PageHeaderProps) {
  return (
    <div className="mb-8 md:mb-12">
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
        {Icon && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#A02021] to-red-800 flex flex-shrink-0 items-center justify-center text-white shadow-lg shadow-[#A02021]/20"
          >
            <Icon className="w-7 h-7" />
          </motion.div>
        )}
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-slate-500 dark:text-slate-400 text-lg mt-1"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}
