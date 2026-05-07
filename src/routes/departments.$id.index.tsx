import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { type DepartmentData } from "@/functions/departments";
import { Target, Lightbulb, BookOpenText } from "lucide-react";

export const Route = createFileRoute("/departments/$id/")({
  component: AboutPage,
});

function AboutPage() {
  // 1. Pull data safely from the parent loader
  const data = useLoaderData({ from: "/departments/$id" }) as unknown as DepartmentData;

  // 2. Fallback check
  if (!data) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
          
          {/* About Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <BookOpenText className="text-blue-600 h-6 w-6" />
              <h2 className="text-2xl font-semibold text-gray-900">About the Department</h2>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
              {data.about_details ? (
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {data.about_details}
                </p>
              ) : (
                <p className="text-gray-400 italic">Department details are currently being updated.</p>
              )}
            </div>
          </section>

          {/* Vision & Mission Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Vision Card */}
            <div className="bg-gray-900 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-5">
                <Target className="text-blue-400 h-6 w-6" />
                <h3 className="text-xl font-semibold text-white">Our Vision</h3>
              </div>
              <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                {data.vision || "Our vision is currently being finalized. Check back soon."}
              </div>
            </div>

            {/* Mission Card */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <div className="flex items-center gap-3 mb-5">
                <Lightbulb className="text-blue-600 h-6 w-6" />
                <h3 className="text-xl font-semibold text-gray-900">Our Mission</h3>
              </div>
              <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                {data.mission || "Our mission statement is currently being updated by the department board."}
              </div>
            </div>

          </section>

        </div>
      </div>
    </div>
  );
}