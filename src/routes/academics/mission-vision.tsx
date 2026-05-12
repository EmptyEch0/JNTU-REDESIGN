import { createFileRoute } from "@tanstack/react-router";
import { MissionVisionCard } from "@/components/academics/MissionVisionCard";
import { motion } from "framer-motion";

export const Route = createFileRoute("/academics/mission-vision")({
  component: MissionVisionPage,
});

function MissionVisionPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-20 overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight"
          >
            Mission & <span className="text-red-600">Vision</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-light"
          >
            The guiding principles that drive our pursuit of academic excellence, innovation, and societal impact.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <MissionVisionCard 
            type="Vision"
            title="To emerge as a premier institution for technical education"
            description="Our vision is to be recognized globally for excellence in education and research, producing globally competent and socially responsible professionals who can contribute significantly to the advancement of society."
            delay={0.2}
          />
          
          <MissionVisionCard 
            type="Mission"
            title="Empowering minds through quality education and innovation"
            description="We are committed to delivering rigorous academic programs, fostering a culture of innovation, and instilling ethical values in our students."
            points={[
              "Provide state-of-the-art infrastructure for effective teaching-learning.",
              "Promote industry-institute interaction to enhance employability.",
              "Encourage faculty and students to engage in cutting-edge research.",
              "Inculcate leadership qualities and a spirit of entrepreneurship."
            ]}
            delay={0.4}
          />
        </div>
      </div>
    </div>
  );
}
