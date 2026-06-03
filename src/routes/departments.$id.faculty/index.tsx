import { createFileRoute, useLoaderData, Link, useParams } from "@tanstack/react-router";
import { type DepartmentData } from "@/functions/departments";
import { syncFaculty } from "@/lib/departments";
import { useAdmin } from "@/context/AdminContext";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserPlus, Trash2, Save, Eye, Camera } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/departments/$id/faculty/")({
  component: FacultyPage,
});

function FacultyPage() {
  const data = useLoaderData({ from: "/departments/$id" }) as unknown as DepartmentData;
  const queryClient = useQueryClient();
  // 1. Fetch the active dynamic route parameters matching this branch slug context
  const { id: routeSlug } = useParams({ from: "/departments/$id/faculty/" });
  
  // 2. Consume specialized department tracking state maps from Admin Context
  const { isDeptEditing } = useAdmin();
  
  // 3. Evaluate edit permissions using the active branch slug (e.g., "cse", "it")
  const isEditMode = isDeptEditing(routeSlug || "");
  const { id: currentDeptParam } = Route.useParams();
  
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
    const newMember = { 
      id: Math.random().toString(36).substr(2, 9), 
      name: "New Professor", 
      designation: "Assistant Professor", 
      photo_url: "" 
    };
    setFacultyList([...facultyList, newMember]);
  };

  const removeFaculty = (id: string) => {
    setFacultyList(facultyList.filter(f => f.id !== id));
  };

  return (
    <div className="animate-in fade-in duration-200">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Faculty Members</h2>
          <p className="text-sm text-slate-500 mt-1">
            {isEditMode 
              ? "Modify high-level info here, or click 'Edit Details' to update deep profiles and achievements."
              : "Select a faculty member's card to view or manage their accomplishments."}
          </p>
        </div>
        {isEditMode && (
          <div className="flex gap-2">
            <button onClick={addFaculty} className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">
              <UserPlus size={18} /> Add
            </button>
            <button onClick={() => mutation.mutate(facultyList)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-blue-700 shadow-md">
              <Save size={18} /> Save Roster
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {facultyList.map((f: any) => (
          <div 
            key={f.id} 
            className={`p-6 border rounded-[2rem] bg-white flex gap-6 items-center relative transition-all ${
              isEditMode ? 'border-amber-300 ring-4 ring-amber-400/5 bg-amber-50/5' : 'border-slate-100 shadow-sm'
            }`}
          >
            {isEditMode && (
              <button 
                onClick={() => removeFaculty(f.id)} 
                className="absolute top-4 right-4 p-1.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                title="Remove Faculty Member"
              >
                <Trash2 size={16} />
              </button>
            )}

            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-full border-2 border-slate-50 bg-slate-100 relative group">
              <img 
                src={f.photo_url || ""} 
                alt={f.name} 
                className="h-full w-full object-cover" 
                onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(f.name)}&background=0D8ABC&color=fff`; }} 
              />
            </div>

            <div className="flex-grow space-y-3">
              {isEditMode ? (
                /* Admin Fields Configuration */
                <div className="space-y-2 pr-6">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-amber-600 font-bold uppercase tracking-wider">Name</span>
                    <input 
                      className="w-full font-bold text-blue-900 border-b border-slate-200 focus:border-amber-500 bg-transparent outline-none pb-0.5 text-base" 
                      value={f.name} 
                      onChange={(e) => handleUpdate(f.id, "name", e.target.value)} 
                    />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-amber-600 font-bold uppercase tracking-wider">Designation</span>
                    <input 
                      className="w-full text-sm text-slate-600 border-b border-slate-200 focus:border-amber-500 bg-transparent outline-none pb-0.5" 
                      value={f.designation} 
                      onChange={(e) => handleUpdate(f.id, "designation", e.target.value)} 
                    />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-amber-600 font-bold uppercase tracking-wider flex items-center gap-1"><Camera size={10}/> Photo URL</span>
                    <input 
                      className="w-full text-xs text-slate-400 font-mono border-b border-slate-200 focus:border-amber-500 bg-transparent outline-none pb-0.5" 
                      placeholder="Optional layout avatar image link"
                      value={f.photo_url || ""} 
                      onChange={(e) => handleUpdate(f.id, "photo_url", e.target.value)} 
                    />
                  </div>
                  
                  {/* Persistent View/Edit Details Link for Administrators */}
                  <div className="pt-2">
                    <Link 
                      to="/departments/$id/faculty/$facultyId"
                      params={{ id: currentDeptParam, facultyId: String(f.id) }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl transition-all border border-amber-200/50"
                    >
                      <Eye size={12} /> Edit Detailed Sections
                    </Link>
                  </div>
                </div>
              ) : (
                /* Public Standard View Configuration */
                <>
                  <div>
                    <h3 className="text-xl font-bold text-blue-900 leading-tight">{f.name}</h3>
                    <p className="text-slate-600 font-medium text-sm mt-0.5">{f.designation}</p>
                  </div>
                  <div className="pt-1">
                    <Link 
                      to="/departments/$id/faculty/$facultyId"
                      params={{ id: currentDeptParam, facultyId: String(f.id) }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors"
                    >
                      <Eye size={12} /> View Details
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}