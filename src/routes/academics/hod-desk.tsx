import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";

export const Route = createFileRoute("/academics/hod-desk")({
  component: HodDeskPage,
});

function HodDeskPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-12 gap-12 items-start">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-4 space-y-6 sticky top-24"
          >
            <div className="rounded-3xl overflow-hidden border border-gray-200 dark:border-zinc-800 shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Head of Department" 
                className="w-full aspect-[4/5] object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
              <div className="bg-white dark:bg-zinc-900 p-6 text-center border-t border-gray-100 dark:border-zinc-800">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Dr. Example Name</h3>
                <p className="text-sm text-red-600 dark:text-red-400 font-medium mt-1">Head of Department, CSE</p>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800 flex flex-col gap-2">
                  <a href="mailto:hod.cse@jntugv.edu.in" className="text-sm text-gray-500 hover:text-red-600 flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" /> hod.cse@jntugv.edu.in
                  </a>
                  <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" /> +91 8922 277 388
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-8 prose prose-lg dark:prose-invert prose-red max-w-none"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Message from the <span className="text-red-600">HOD</span></h1>
            <p className="text-xl text-gray-500 dark:text-gray-400 mb-8 font-light italic">
              "Empowering students to become innovative thinkers and leaders in the ever-evolving landscape of technology."
            </p>
            
            <p>
              Welcome to the Department of Computer Science and Engineering at JNTU-GV. Since its inception, our department has been dedicated to providing quality education and fostering research that makes a tangible impact on society.
            </p>
            
            <p>
              Our comprehensive curriculum is designed to balance theoretical foundations with practical applications. We continually update our syllabus to reflect the latest industry trends, ensuring our graduates are well-prepared for the challenges of the modern tech world. From Artificial Intelligence to Cybersecurity, our students are exposed to cutting-edge technologies.
            </p>
            
            <div className="bg-gray-50 dark:bg-zinc-900 rounded-2xl p-6 border-l-4 border-red-500 my-8">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white m-0">Department Highlights</h4>
              <ul className="mt-4 space-y-2 m-0 p-0 list-inside text-gray-600 dark:text-gray-300">
                <li>State-of-the-art laboratories equipped with modern computing facilities.</li>
                <li>Highly qualified faculty with expertise in diverse research domains.</li>
                <li>Strong industry linkages facilitating internships and placements.</li>
                <li>Active student chapters of professional bodies like IEEE and ACM.</li>
              </ul>
            </div>
            
            <p>
              We believe in holistic development. Beyond academics, we encourage our students to participate in hackathons, coding competitions, and technical symposiums. These platforms not only hone their technical skills but also build teamwork and leadership qualities.
            </p>
            
            <p>
              I invite you to explore our department's offerings and be a part of our vibrant academic community. Together, let's strive for excellence and build a better future.
            </p>
            
            <div className="mt-12">
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Signature_of_John_Hancock.svg" className="h-16 opacity-50 dark:invert" alt="Signature" />
              <p className="font-bold text-gray-900 dark:text-white mt-4">Dr. Example Name</p>
              <p className="text-sm text-gray-500">Head of Department</p>
            </div>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
}
