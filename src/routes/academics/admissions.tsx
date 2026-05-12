import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, FileText, Landmark } from "lucide-react";

export const Route = createFileRoute("/academics/admissions")({
  component: AdmissionsPage,
});

function AdmissionsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="bg-zinc-900 dark:bg-black py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-black/80"></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Admissions <span className="text-red-500">2026-27</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-300"
          >
            Join a legacy of excellence. Follow our transparent, merit-based admission procedure to become part of JNTU-GV.
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4 border-b border-gray-200 dark:border-zinc-800 pb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Procedure</h2>
            </div>
            
            <div className="space-y-6">
              {[
                { title: "Undergraduate (B.Tech)", desc: "Admissions are made based on the rank obtained in AP EAPCET conducted by APSCHE." },
                { title: "Postgraduate (M.Tech)", desc: "Based on GATE scores or AP PGECET rank followed by counseling." },
                { title: "Ph.D Programs", desc: "Based on APRCET scores and subsequent interviews by the university." }
              ].map((item, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4 border-b border-gray-200 dark:border-zinc-800 pb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center">
                <Landmark className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Fee Structure</h2>
            </div>
            
            <div className="bg-gray-50 dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-100 dark:bg-zinc-800/80">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Program</th>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Category</th>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Fee (Per Annum)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                  <tr>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">B.Tech</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">Regular</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">₹ 10,000</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">B.Tech</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">Self-Finance</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">₹ 35,000</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">M.Tech</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">Regular</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">₹ 30,000</td>
                  </tr>
                </tbody>
              </table>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 text-xs text-yellow-800 dark:text-yellow-500 border-t border-yellow-100 dark:border-yellow-900/20">
                * Note: Fee structures are subject to change as per university guidelines.
              </div>
            </div>
            
            <button className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold transition-colors shadow-lg shadow-red-600/20">
              <FileText className="w-5 h-5" />
              Download Full Admission Brochure
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
