import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { type DepartmentData } from "@/functions/departments";
import { BookOpen, GraduationCap, FileText, ArrowRight, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/departments/$id/courses")({
  component: ProgrammesPage,
});

function ProgrammesPage() {
  const data = useLoaderData({ from: "/departments/$id" }) as unknown as DepartmentData;

  if (!data) return <div>Loading...</div>;

  const groupedCourses = data.courses?.reduce((acc: any, course) => {
    const level = course.level || "Other Programs";
    if (!acc[level]) acc[level] = [];
    acc[level].push(course);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
            <div className="flex items-center gap-2 text-blue-600">
              <GraduationCap size={18} className="opacity-80" />
              <span className="uppercase tracking-wider text-xs font-semibold">
                Academic Excellence
              </span>
            </div>
          </div>
          
          <h2 className="text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Our <span className="text-blue-600">Programmes</span>
          </h2>
          
          <p className="text-slate-500 max-w-2xl text-base leading-relaxed">
            Explore our curriculum designed to meet industry standards and academic rigor. 
            Select a program below to view the detailed regulation and syllabus.
          </p>
        </div>

        {Object.keys(groupedCourses).length > 0 ? (
          <div className="space-y-20">
            {Object.entries(groupedCourses).map(([level, programs]: [string, any]) => (
              <div key={level} className="group/section">
                {/* Category Title */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <h3 className="text-2xl font-semibold text-slate-800">
                    {level === 'UG' ? 'Undergraduate' : level === 'PG' ? 'Postgraduate' : level}
                  </h3>
                  <div className="flex-1">
                    <div className="h-px bg-gradient-to-r from-slate-200 to-transparent"></div>
                  </div>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {programs.map((course: any) => (
                    <div 
                      key={course.id} 
                      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300"
                    >
                      <div className="p-6">
                        {/* Header with Regulation */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-xl">
                            <ShieldCheck size={14} className="text-blue-600" />
                            <span className="text-xs font-semibold text-blue-700">
                              Regulation {course.regulation || 'N/A'}
                            </span>
                          </div>
                          <div className="text-slate-300 group-hover:text-blue-500 transition-colors">
                            <BookOpen size={20} />
                          </div>
                        </div>
                        
                        {/* Course Name */}
                        <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                          {course.name}
                        </h4>
                        
                        {/* Description */}
                        <p className="text-slate-500 text-sm leading-relaxed mb-5">
                          Comprehensive curriculum adhering to the latest university standards for {course.name} under the {course.regulation} academic framework.
                        </p>

                        {/* Action Button */}
                        <div>
                          {course.syllabus_url ? (
                            <a 
                              href={course.syllabus_url} 
                              target="_blank" 
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-medium text-sm hover:bg-blue-600 transition-all hover:shadow-md active:scale-95"
                            >
                              <FileText size={16} />
                              View Syllabus
                              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                            </a>
                          ) : (
                            <div className="text-slate-400 italic text-sm flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                              Syllabus update in progress
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-20 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">No academic programs are currently listed.</p>
          </div>
        )}
      </div>
    </div>
  );
}