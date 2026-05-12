import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Clock, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/academics/academic-calendar")({
  component: AcademicCalendarPage,
});

const EVENTS = [
  { date: "15 Jun, 2026", title: "Commencement of Class Work", type: "academic" },
  { date: "12 Aug, 2026", title: "I Mid Examinations", type: "exam" },
  { date: "05 Oct, 2026", title: "II Mid Examinations", type: "exam" },
  { date: "20 Oct, 2026", title: "Preparation & Practicals", type: "academic" },
  { date: "02 Nov, 2026", title: "End Semester Examinations", type: "exam" },
  { date: "25 Nov, 2026", title: "Semester Break", type: "holiday" },
];

function AcademicCalendarPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 mx-auto bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-6"
          >
            <CalendarIcon className="w-10 h-10" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Academic <span className="text-red-600">Calendar</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-400"
          >
            Key dates and schedules for the 2026-27 Academic Year.
          </motion.p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
          <div className="bg-zinc-900 p-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-400" />
              Odd Semester Timeline
            </h2>
            <select className="bg-zinc-800 text-white border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none">
              <option>B.Tech II Year (2026-27)</option>
              <option>B.Tech III Year (2026-27)</option>
              <option>B.Tech IV Year (2026-27)</option>
            </select>
          </div>
          
          <div className="p-8">
            <div className="relative border-l-2 border-gray-200 dark:border-zinc-800 ml-3 md:ml-6 space-y-8">
              {EVENTS.map((event, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative pl-8 md:pl-12"
                >
                  <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-zinc-900 ${
                    event.type === 'exam' ? 'bg-red-500' : event.type === 'holiday' ? 'bg-emerald-500' : 'bg-blue-500'
                  }`}></div>
                  
                  <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-2xl p-6 border border-gray-100 dark:border-zinc-800/80 hover:shadow-md transition-shadow">
                    <span className="text-sm font-bold text-red-600 dark:text-red-400 mb-1 block">
                      {event.date}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {event.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/10 p-6 border-t border-blue-100 dark:border-blue-900/20 flex gap-4">
            <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0" />
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Note: The academic calendar is subject to change based on university directives or unforeseen circumstances.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
