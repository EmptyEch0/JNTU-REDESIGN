import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  image?: string;
}

export function HeroSection({ title, subtitle, image }: HeroSectionProps) {
  return (
    <div className="relative w-full overflow-hidden bg-black py-24 sm:py-32 rounded-3xl mb-12 shadow-2xl border border-red-900/30">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950 to-red-950/20 z-10"></div>
        {image && (
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ duration: 1.5 }}
            src={image} 
            alt="Hero Background" 
            className="w-full h-full object-cover mix-blend-overlay"
          />
        )}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-900/20 blur-[100px] rounded-full mix-blend-screen pointer-events-none"></div>
      </div>

      {/* Content */}
      <div className="relative z-20 mx-auto max-w-7xl px-6 lg:px-8 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="inline-flex items-center rounded-full bg-red-500/10 px-3 py-1 text-sm font-semibold text-red-400 ring-1 ring-inset ring-red-500/20 mb-6 backdrop-blur-sm">
            Academics at JNTU-GV
          </span>
        </motion.div>
        
        <motion.h1 
          className="text-4xl font-bold tracking-tight text-white sm:text-6xl max-w-4xl bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {title}
        </motion.h1>
        
        <motion.p 
          className="mt-6 text-lg leading-8 text-gray-300 max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {subtitle}
        </motion.p>
        
        <motion.div 
          className="mt-10 flex items-center justify-center gap-x-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link
            to="/academics/programs"
            className="group rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/30 hover:bg-red-500 hover:shadow-red-500/50 transition-all duration-300 flex items-center gap-2"
          >
            Explore Programs
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/academics/admissions"
            className="text-sm font-semibold leading-6 text-white hover:text-red-400 transition-colors"
          >
            Admissions <span aria-hidden="true">→</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
