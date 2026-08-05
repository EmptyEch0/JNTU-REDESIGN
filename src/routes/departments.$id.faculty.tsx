import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { type DepartmentData } from "@/functions/departments";
import { updateDepartment, syncFaculty } from "@/lib/departments";
import { useAdmin } from "@/context/AdminContext"; // Ensure this context exists
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, UserPlus, Trash2, Save, ImageIcon, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { getAssetUrl } from "@/lib/assets";
import { SafeImage } from "@/components/SafeImage";
import { AdminUpload } from "@/components/AdminEditPanel";

export const Route = createFileRoute("/departments/$id/faculty")({
  component: FacultyPage,
});

function FacultyPage() {
  const data = useLoaderData({ from: "/departments/$id" }) as unknown as DepartmentData;
  const { isEditMode } = useAdmin();
  const queryClient = useQueryClient();

  // Local state to manage edits before saving
  const [facultyList, setFacultyList] = useState(data?.faculty || []);

  useEffect(() => {
    if (data?.faculty) setFacultyList(data.faculty);
  }, [data]);

  const mutation = useMutation({
    mutationFn: (newList: any[]) => 
      syncFaculty({ data: { deptId: data.id, facultyList: newList } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Faculty roster saved successfully!");
    },
    onError: () => toast.error("Failed to save changes.")
  });

  const handleUpdate = (id: string, field: string, value: string) => {
    setFacultyList(prev => prev.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  const addFaculty = () => {
    const newMember = { id: Math.random().toString(), name: "New Member", designation: "Assistant Professor", photo_url: "" };
    setFacultyList([...facultyList, newMember]);
  };

  const removeFaculty = (id: string) => {
    setFacultyList(facultyList.filter(f => f.id !== id));
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Faculty Members</h2>
        {isEditMode && (
          <div className="flex gap-2">
            <button onClick={addFaculty} className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl font-bold text-sm hover:bg-slate-200">
              <UserPlus size={18} /> Add
            </button>
            <button onClick={() => mutation.mutate(facultyList)} className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-xl font-bold text-sm">
              <Save size={18} /> Save Roster
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {facultyList.map((f) => (
          <div key={f.id} className={`p-6 border rounded-3xl bg-white flex gap-6 items-center relative transition-all ${isEditMode ? 'border-amber-200 ring-2 ring-amber-50' : 'border-slate-100'}`}>
            {isEditMode && (
              <button onClick={() => removeFaculty(f.id)} className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded-full">
                <Trash2 size={16} />
              </button>
            )}

            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-full border-2 border-slate-50 bg-slate-100">
              <SafeImage src={f.photo_url} alt={f.name} fallbackName={f.name} className="h-full w-full object-cover" />
            </div>

            <div className="flex-grow space-y-2">
              {isEditMode ? (
                <>
                  <input 
                    className="w-full font-bold text-blue-900 border-b border-amber-100 focus:border-amber-500 outline-none" 
                    value={f.name} 
                    onChange={(e) => handleUpdate(f.id, "name", e.target.value)} 
                  />
                  <input 
                    className="w-full text-sm text-slate-600 border-b border-amber-100 focus:border-amber-500 outline-none" 
                    value={f.designation} 
                    onChange={(e) => handleUpdate(f.id, "designation", e.target.value)} 
                  />
                  <AdminUpload
                    value={f.photo_url}
                    onChange={(newUrl) => handleUpdate(f.id, "photo_url", newUrl)}
                    module="departments"
                    category="faculty"
                    placeholder="Upload photo..."
                  />
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-blue-900">{f.name}</h3>
                  <p className="text-slate-600 font-medium">{f.designation}</p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}