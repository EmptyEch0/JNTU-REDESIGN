import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/academics/HeroSection";
import { AcademicCard } from "@/components/academics/AcademicCard";
import { AnnouncementTicker } from "@/components/academics/AnnouncementTicker";
import { GraduationCap, Users, Calendar, BookOpen, Award, FileText, Download } from "lucide-react";

export const Route = createFileRoute("/academics/")({
  component: AcademicsIndex,
});

const ACADEMIC_FEATURES = [
  {
    title: "Programs Offered",
    description: "Explore our comprehensive range of UG, PG, and Ph.D. programs designed for future innovators.",
    icon: <GraduationCap className="w-6 h-6" />,
    linkTo: "/academics/programs"
  },
  {
    title: "Admissions",
    description: "Learn about the admission procedure, eligibility criteria, and fee structures for various courses.",
    icon: <Users className="w-6 h-6" />,
    linkTo: "/academics/admissions"
  },
  {
    title: "Syllabus",
    description: "Access the updated curriculum and detailed course structures for all academic departments.",
    icon: <BookOpen className="w-6 h-6" />,
    linkTo: "/academics/syllabus"
  },
  {
    title: "Academic Calendar",
    description: "Stay updated with important dates, exam schedules, and holiday lists for the academic year.",
    icon: <Calendar className="w-6 h-6" />,
    linkTo: "/academics/academic-calendar"
  },
  {
    title: "Regulations",
    description: "Read through the academic rules, grading systems, and university guidelines.",
    icon: <FileText className="w-6 h-6" />,
    linkTo: "/academics/regulations"
  },
  {
    title: "Scholarships",
    description: "Find information about merit-based and community scholarships available for students.",
    icon: <Award className="w-6 h-6" />,
    linkTo: "/academics/scholarships"
  }
];

const LATEST_ANNOUNCEMENTS = [
  { id: "1", text: "B.Tech II Semester Regular Examinations Time Table Released", isNew: true, link: "/academics/examination" },
  { id: "2", text: "Academic Calendar for 2026-27 updated.", link: "/academics/academic-calendar" },
  { id: "3", text: "Ph.D Admission Notification 2026", link: "/academics/admissions" },
];

function AcademicsIndex() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 pb-20">
      <AnnouncementTicker announcements={LATEST_ANNOUNCEMENTS} />
      
      <div className="container mx-auto px-4 pt-8">
        <HeroSection 
          title="Shape Your Future with Excellence" 
          subtitle="Discover cutting-edge programs, world-class faculty, and a vibrant learning ecosystem at JNTU-GV."
          image="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        />
        
        <div className="mt-16 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Academic Resources</h2>
          <p className="text-gray-600 dark:text-gray-400">Everything you need to navigate your academic journey.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ACADEMIC_FEATURES.map((feature, idx) => (
            <AcademicCard 
              key={idx}
              {...feature}
              delay={idx * 0.1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
