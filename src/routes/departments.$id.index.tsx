import { createFileRoute, useLoaderData, useParams } from "@tanstack/react-router";
import { updateDepartment } from "@/lib/departments";
import { type DepartmentData } from "@/functions/departments";
import { Target, Lightbulb, BookOpenText, Save } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const Route = createFileRoute("/departments/$id/")({
  component: AboutPage,
});

function AboutPage() {
  const data = useLoaderData({ from: "/departments/$id" }) as unknown as DepartmentData;
  const queryClient = useQueryClient();
  // 1. Fetch the active dynamic route parameters matching this branch slug context
  const { id: routeSlug } = useParams({ from: "/departments/$id" });

  // 2. Consume specialized department tracking state maps from Admin Context
  const { isDeptEditing } = useAdmin();

  // 3. Evaluate edit permissions using the active branch slug (e.g., "cse", "it")
  const isEditMode = isDeptEditing(routeSlug || "");

  // Local state to track edits before saving
  const [editData, setEditData] = useState<Partial<DepartmentData>>({});

  // Sync local state when data changes or edit mode is toggled
  useEffect(() => {
    if (data) setEditData(data);
  }, [data]);

  const mutation = useMutation({
    mutationFn: (updatedFields: any) =>
      updateDepartment({ data: { id: data.id, ...updatedFields } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["department", data.slug] });
      toast.success("Department details updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update department details.");
    }
  });

  if (!data) return <div>Loading...</div>;

  const handleSave = (field: keyof DepartmentData, value: string) => {
    const updated = { ...editData, [field]: value };
    setEditData(updated);
    mutation.mutate({ [field]: value });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">

          {/* About Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <BookOpenText className="text-blue-600 h-6 w-6" />
                <h2 className="text-2xl font-semibold text-gray-900">About the Department</h2>
              </div>
              {isEditMode && <span className="text-xs font-bold text-amber-600 uppercase tracking-widest px-2 py-1 bg-amber-100 rounded">Editing Mode</span>}
            </div>

            <div className={`rounded-xl p-8 border transition-all ${isEditMode ? "bg-amber-50/50 border-amber-200 shadow-inner" : "bg-gray-50 border-gray-200"
              }`}>
              {isEditMode ? (
                <div className="space-y-4">
                  <textarea
                    className="w-full h-64 p-4 rounded-lg border border-amber-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 leading-relaxed"
                    value={editData.about_details ?? ""}
                    onChange={(e) => setEditData({ ...editData, about_details: e.target.value })}
                  />
                  <button
                    onClick={() => handleSave("about_details", editData.about_details ?? "")}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Save size={16} /> Save Description
                  </button>
                </div>
              ) : (
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {data.about_details || "Department details are currently being updated."}
                </p>
              )}
            </div>
          </section>

          {/* Vision & Mission Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vision Card */}
            <div className={`rounded-xl p-8 transition-all ${isEditMode ? "ring-2 ring-amber-400 ring-offset-2" : ""} bg-gray-900`}>
              <div className="flex items-center gap-3 mb-5">
                <Target className="text-blue-400 h-6 w-6" />
                <h3 className="text-xl font-semibold text-white">Our Vision</h3>
              </div>
              {isEditMode ? (
                <div className="space-y-4">
                  <textarea
                    className="w-full h-32 p-3 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:ring-1 focus:ring-blue-400 outline-none"
                    value={editData.vision ?? ""}
                    onChange={(e) => setEditData({ ...editData, vision: e.target.value })}
                  />
                  <button
                    onClick={() => handleSave("vision", editData.vision ?? "")}
                    className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider"
                  >
                    Update Vision
                  </button>
                </div>
              ) : (
                <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {data.vision || "Our vision is currently being finalized."}
                </div>
              )}
            </div>

            {/* Mission Card */}
            <div className={`rounded-xl p-8 border transition-all ${isEditMode ? "bg-amber-50 border-amber-300 shadow-inner" : "bg-white border-gray-200"}`}>
              <div className="flex items-center gap-3 mb-5">
                <Lightbulb className="text-blue-600 h-6 w-6" />
                <h3 className="text-xl font-semibold text-gray-900">Our Mission</h3>
              </div>
              {isEditMode ? (
                <div className="space-y-4">
                  <textarea
                    className="w-full h-32 p-3 rounded-lg bg-white text-gray-700 border border-amber-200 focus:ring-1 focus:ring-blue-500 outline-none"
                    value={editData.mission ?? ""}
                    onChange={(e) => setEditData({ ...editData, mission: e.target.value })}
                  />
                  <button
                    onClick={() => handleSave("mission", editData.mission ?? "")}
                    className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider"
                  >
                    Update Mission
                  </button>
                </div>
              ) : (
                <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {data.mission || "Our mission statement is currently being updated."}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}