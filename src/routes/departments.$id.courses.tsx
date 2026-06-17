import { createFileRoute, useLoaderData, useParams } from "@tanstack/react-router";
import { type DepartmentData } from "@/functions/departments";
import {
  BookOpen,
  GraduationCap,
  FileText,
  ArrowRight,
  ShieldCheck,
  Plus,
  Trash2,
  Save,
  Link as LinkIcon
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { syncCourses } from "@/lib/departments";
import { toast } from "sonner";
import { assetUrl } from "@/lib/assets";

export const Route = createFileRoute("/departments/$id/courses")({
  component: ProgrammesPage,
});

function ProgrammesPage() {
  const data = useLoaderData({ from: "/departments/$id" }) as unknown as DepartmentData;
  const queryClient = useQueryClient();
  // 1. Fetch the active dynamic route parameters matching this branch slug context
  const { id: routeSlug } = useParams({ from: "/departments/$id/courses" });

  // 2. Consume specialized department tracking state maps from Admin Context
  const { isDeptEditing } = useAdmin();

  // 3. Evaluate edit permissions using the active branch slug (e.g., "cse", "it")
  const isEditMode = isDeptEditing(routeSlug || "");

  const [courseList, setCourseList] = useState<any[]>(data?.courses || []);

  useEffect(() => {
    if (data?.courses) setCourseList(data.courses);
  }, [data]);

  const mutation = useMutation({
    mutationFn: (payload: any[]) => syncCourses({ data: { deptId: data.id, courseList: payload } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Academic programs updated successfully!");
    }
  });

  const updateCourse = (id: string | number, field: string, value: string) => {
    setCourseList(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  // Improved addCourse: accepts level to prevent everything jumping to UG
  const addCourse = (level: string) => {
    const newCourse = {
      id: crypto.randomUUID(),
      name: "New Program Name",
      level: level,
      regulation: "R23",
      syllabus_url: ""
    };
    setCourseList([newCourse, ...courseList]);
  };

  const removeCourse = (id: string | number) => {
    setCourseList(courseList.filter(c => c.id !== id));
  };

  const groupedCourses = courseList.reduce((acc: any, course) => {
    const level = course.level || "Other Programs";
    if (!acc[level]) acc[level] = [];
    acc[level].push(course);
    return acc;
  }, {});

  if (!data) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 animate-in fade-in slide-in-from-bottom-6 duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
              <div className="flex items-center gap-2 text-blue-600">
                <GraduationCap size={18} className="opacity-80" />
                <span className="uppercase tracking-wider text-xs font-semibold">Academic Excellence</span>
              </div>
            </div>
            <h2 className="text-5xl font-bold text-slate-900 tracking-tight mb-4">
              Our <span className="text-blue-600">Programmes</span>
            </h2>
          </div>

          {isEditMode && (
            <div className="flex gap-3">
              {/* Global "Add New Level" button if needed, or just Save */}
              <button
                onClick={() => mutation.mutate(courseList)}
                className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold text-sm hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95"
              >
                <Save size={18} /> Save All Changes
              </button>
            </div>
          )}
        </div>

        <div className="space-y-20">
          {/* We ensure UG and PG sections always show up in Admin mode even if empty */}
          {["UG", "PG", ...Object.keys(groupedCourses).filter(k => k !== "UG" && k !== "PG")].map((level) => {
            const programs = groupedCourses[level] || [];
            if (programs.length === 0 && !isEditMode) return null;

            return (
              <div key={level} className="group/section">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
                      {level === "UG" ? "Undergraduate" : level === "PG" ? "Postgraduate" : level}
                    </h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent ml-4"></div>
                  </div>

                  {isEditMode && (
                    <button
                      onClick={() => addCourse(level)}
                      className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                    >
                      <Plus size={14} /> Add {level} Program
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {programs.map((course: any) => (
                    <div key={course.id} className={`group bg-white rounded-[2.5rem] border overflow-hidden transition-all duration-200 relative ${isEditMode ? 'border-blue-300 ring-4 ring-blue-50/50' : 'border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-200'}`}>

                      {isEditMode && (
                        <button onClick={() => removeCourse(course.id)} className="absolute top-4 right-4 p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all z-10 shadow-sm">
                          <Trash2 size={16} />
                        </button>
                      )}

                      <div className="p-8">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl">
                            <ShieldCheck size={14} className="text-blue-600" />
                            {isEditMode ? (
                              <input
                                className="text-xs font-bold text-slate-700 bg-transparent outline-none w-20"
                                value={course.regulation || ""}
                                placeholder="Regulation"
                                onChange={(e) => updateCourse(course.id, "regulation", e.target.value)}
                              />
                            ) : (
                              <span className="text-xs font-bold text-slate-700">
                                Regulation {course.regulation || "N/A"}
                              </span>
                            )}
                          </div>
                          <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <BookOpen size={24} />
                          </div>
                        </div>

                        {isEditMode ? (
                          <div className="space-y-5">
                            <div>
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Course Name</label>
                              <input
                                className="text-xl font-bold text-slate-900 w-full border-b-2 border-slate-100 focus:border-blue-500 outline-none pb-2 transition-colors"
                                value={course.name}
                                onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Syllabus Link (URL)</label>
                              <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <LinkIcon size={14} className="text-slate-400" />
                                <input
                                  className="w-full bg-transparent text-xs text-blue-600 font-medium outline-none"
                                  value={assetUrl(course.syllabus_url) || ""}
                                  onChange={(e) => updateCourse(course.id, "syllabus_url", e.target.value)}
                                  placeholder="https://example.com/syllabus.pdf"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <h4 className="text-2xl font-extrabold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight">{course.name}</h4>
                            <p className="text-slate-500 text-sm leading-relaxed mb-8 italic">
                              Comprehensive curriculum adhering to the latest university standards for {course.name} under the {course.regulation} academic framework.
                            </p>
                            <div>
                              {course.syllabus_url ? (
                                <a href={course.syllabus_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 px-7 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all hover:shadow-xl hover:shadow-blue-200 active:scale-95">
                                  <FileText size={18} /> View Syllabus <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </a>
                              ) : (
                                <div className="text-slate-400 font-medium text-sm flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-slate-200"></div> Syllabus update in progress
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}