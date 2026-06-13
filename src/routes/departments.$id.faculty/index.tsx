import { createFileRoute, useLoaderData, Link, useParams } from "@tanstack/react-router";
import { type DepartmentData } from "@/functions/departments";
import { updateDepartment, syncFaculty } from "@/lib/departments";
import { useAdmin } from "@/context/AdminContext"; 
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, UserPlus, Trash2, Save, ImageIcon, Briefcase, Eye, UserCheck } from "lucide-react";
import { toast } from "sonner";

const ASSETS_BASE_URL = import.meta.env.VITE_ASSETS_URL || ""; 

const getAssetUrl = (urlPath: string | null | undefined): string => {
  if (!urlPath) return "/fallback-banner.jpg";
  if (urlPath.startsWith("http://") || urlPath.startsWith("https://")) {
    return urlPath;
  }
  
  let cleanPath = urlPath.startsWith("/") ? urlPath.slice(1) : urlPath;
  
  // Replace backslashes from database rows to forward slashes for the browser
  cleanPath = cleanPath.replace(/\\/g, "/");
  
  if (!cleanPath.startsWith("local-assets/")) {
    cleanPath = `local-assets/${cleanPath}`;
  }
  
  return `${ASSETS_BASE_URL}/${cleanPath}`;
};

export const Route = createFileRoute("/departments/$id/faculty/")({
  component: FacultyPage,
});

function FacultyPage() {
  const data = useLoaderData({ from: "/departments/$id" }) as unknown as DepartmentData;
  const { isEditMode } = useAdmin();
  const queryClient = useQueryClient();
  
  // Extract the parent route parameter ($id) cleanly
  const { id: deptId } = useParams({ from: "/departments/$id/faculty/" });

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
    <div className="animate-in fade-in duration-200">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Faculty Members</h2>
        {isEditMode && (
          <div className="flex gap-2">
            <button onClick={addFaculty} className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">
              <UserPlus size={18} /> Add
            </button>
            <button onClick={() => mutation.mutate(facultyList)} className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-amber-700 transition-colors shadow-sm">
              <Save size={18} /> Save Roster
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {facultyList.map((f) => (
          <div key={f.id} className={`p-6 border rounded-3xl bg-white flex gap-6 items-center relative transition-all ${isEditMode ? 'border-amber-200 ring-2 ring-amber-50' : 'border-slate-100 shadow-sm'}`}>
            {isEditMode && (
              <button onClick={() => removeFaculty(f.id)} className="absolute top-3 right-3 p-1.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                <Trash2 size={16} />
              </button>
            )}

            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-full border-2 border-slate-50 bg-slate-100">
              <img 
                src={getAssetUrl(f.photo_url) || ""} 
                alt={f.name} 
                className="h-full w-full object-cover" 
                onError={(e) => e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(f.name)}&background=0D8ABC&color=fff`} 
              />
            </div>

            <div className="flex-grow space-y-2">
              {isEditMode ? (
                <div className="space-y-2 pr-4">
                  <input 
                    className="w-full font-bold text-blue-900 border-b border-amber-100 focus:border-amber-500 outline-none text-base" 
                    value={f.name} 
                    onChange={(e) => handleUpdate(f.id, "name", e.target.value)} 
                  />
                  <input 
                    className="w-full text-sm text-slate-600 border-b border-amber-100 focus:border-amber-500 outline-none" 
                    value={f.designation} 
                    onChange={(e) => handleUpdate(f.id, "designation", e.target.value)} 
                  />
                  <input 
                    className="w-full text-[10px] text-amber-600 bg-amber-50 rounded p-1 font-mono" 
                    value={f.photo_url || ""} 
                    placeholder="Photo URL" 
                    onChange={(e) => handleUpdate(f.id, "photo_url", e.target.value)} 
                  />
                  
                  {/* Admin Direct Deep Link Edit Button */}
                  <div className="pt-1">
                    <Link
                      to="/departments/$id/faculty/$facultyId"
                      params={{ id: deptId, facultyId: String(f.id) }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl transition-colors border border-amber-200/40"
                    >
                      <UserCheck size={14} /> Edit Profile Details
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-blue-900 leading-snug">{f.name}</h3>
                    <p className="text-slate-600 font-medium text-sm">{f.designation}</p>
                  </div>
                  
                  {/* Public View Profile Button */}
                  <div className="pt-2">
                    <Link
                      to="/departments/$id/faculty/$facultyId"
                      params={{ id: deptId, facultyId: String(f.id) }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors"
                    >
                      <Eye size={14} /> View Profile
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}