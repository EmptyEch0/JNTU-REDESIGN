import { motion } from "framer-motion";

interface MissionVisionCardProps {
  type: "Mission" | "Vision";
  title: string;
  description: string;
  points?: string[];
  delay?: number;
}

export function MissionVisionCard({ type, title, description, points, delay = 0 }: MissionVisionCardProps) {
  const isMission = type === "Mission";
  
  return (
    <motion.div
      initial={{ opacity: 0, x: isMission ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={`relative rounded-3xl p-8 sm:p-12 overflow-hidden ${
        isMission 
          ? "bg-gradient-to-br from-red-900 to-red-950 text-white shadow-2xl shadow-red-900/20" 
          : "bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-xl"
      }`}
    >
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none -translate-y-1/2 translate-x-1/3 ${
        isMission ? "bg-red-500" : "bg-gray-300 dark:bg-red-900"
      }`}></div>
      
      <div className="relative z-10">
        <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold tracking-wider uppercase mb-6 ${
          isMission ? "bg-red-500/20 text-red-200" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
        }`}>
          Our {type}
        </span>
        
        <h2 className={`text-3xl sm:text-4xl font-bold mb-6 leading-tight ${
          !isMission && "text-gray-900 dark:text-white"
        }`}>
          {title}
        </h2>
        
        <p className={`text-lg leading-relaxed mb-8 ${
          isMission ? "text-red-100/80" : "text-gray-600 dark:text-gray-400"
        }`}>
          {description}
        </p>
        
        {points && points.length > 0 && (
          <ul className="space-y-4">
            {points.map((point, idx) => (
              <motion.li 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: delay + 0.3 + (idx * 0.1) }}
                className="flex items-start gap-3"
              >
                <div className={`mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full ${
                  isMission ? "bg-red-400" : "bg-red-500"
                }`}></div>
                <span className={isMission ? "text-red-50" : "text-gray-700 dark:text-gray-300"}>
                  {point}
                </span>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}
