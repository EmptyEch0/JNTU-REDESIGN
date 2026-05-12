import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Award, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/academics/scholarships")({
  component: ScholarshipsPage,
});

function ScholarshipsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 mx-auto bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mb-6"
          >
            <Award className="w-10 h-10" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Financial Assistance & <span className="text-amber-500">Scholarships</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
          >
            JNTU-GV is committed to ensuring that financial constraints do not hinder deserving students from pursuing quality higher education.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              title: "Jagananna Vidya Deevena (RTF)",
              desc: "Government scholarship providing full fee reimbursement to eligible students from SC, ST, BC, EBC, Kapu, Minority, and Differently Abled categories.",
              eligibility: ["Income limit applicable", "75% attendance mandatory", "Must be admitted through convenor quota"]
            },
            {
              title: "Jagananna Vasathi Deevena (MTF)",
              desc: "Financial assistance to students for hostel and mess charges.",
              eligibility: ["Applicable to RTF eligible students", "Disbursed directly to mother's account in two installments"]
            },
            {
              title: "Merit Scholarships",
              desc: "Awarded to university toppers and exceptional academic performers.",
              eligibility: ["Top 3 rankers in each branch", "No backlogs", "Maintained discipline record"]
            },
            {
              title: "GATE/GPAT Stipend",
              desc: "AICTE scholarship for PG students admitted with valid GATE/GPAT scores.",
              eligibility: ["Valid GATE/GPAT score", "Admitted through counseling", "Monthly biometric attendance"]
            }
          ].map((scholarship, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-lg transition-shadow"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{scholarship.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{scholarship.desc}</p>
              
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-200 uppercase tracking-wider">Eligibility Criteria:</h4>
                <ul className="space-y-2">
                  {scholarship.eligibility.map((criteria, cIdx) => (
                    <li key={cIdx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{criteria}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
