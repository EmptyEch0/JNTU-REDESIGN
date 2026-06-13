import { createFileRoute, useLoaderData, Link } from "@tanstack/react-router";
import { type DepartmentData } from "@/functions/departments";
import { useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFacultyProfile } from "@/lib/departments";
import { toast } from "sonner";
import { 
  ArrowLeft, GraduationCap, Trophy, Globe, 
  Briefcase, BookOpen, Save, Plus, Trash2, Camera, Type, IdCard
} from "lucide-react";
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


export const Route = createFileRoute("/departments/$id/faculty/$facultyId")({
  component: FacultyDetailProfilePage,
});

interface ConsultancyProject {
  title: string;
  client: string;
  status: string;
}

function FacultyDetailProfilePage() {
  const { id: deptId, facultyId } = Route.useParams();
  const data = useLoaderData({ from: "/departments/$id" }) as unknown as DepartmentData;
  const { isEditMode } = useAdmin();
  const queryClient = useQueryClient();

  const facultyRaw = data?.faculty?.find((f: any) => String(f.id) === String(facultyId));
  const [activeTab, setActiveTab] = useState<string>("profile");
  
  // Local reactive edit state mapping
  const [editState, setEditState] = useState<any>(null);

  useEffect(() => {
    if (facultyRaw) {
      setEditState({
        name: facultyRaw.name || "",
        designation: facultyRaw.designation || "",
        photo_url: facultyRaw.photo_url || "",
        qualifications: facultyRaw.qualifications || ["M.Tech", "Ph.D"],
        specialization: facultyRaw.specialization || "Advanced Systems Architectures",
        experience_years: facultyRaw.experience_years ?? 10,
        awards: facultyRaw.awards || ["Best Faculty Achievement Award"],
        fellowships: facultyRaw.fellowships || ["Institutional Research Fellow"],
        professional_memberships: facultyRaw.professional_memberships || ["IEEE Member", "ISTE Life Member"],
        international_exchanges: facultyRaw.international_exchanges || ["Visiting Professor Scheme"],
        sabbaticals: facultyRaw.sabbaticals || ["Research Sabbatical Leave Program"],
        consultancy_projects: facultyRaw.consultancy_projects || [
          { title: "Industrial Optimization Framework", client: "Local Technical Agency", status: "Completed" }
        ],
        fdps_attended: facultyRaw.fdps_attended || ["National Faculty Development Initiative"],
        conferences_attended: facultyRaw.conferences_attended || ["International Research Symposium Presentation"]
      });
    }
  }, [facultyRaw]);

  const mutation = useMutation({
    mutationFn: (payload: any) => updateFacultyProfile({ data: { facultyId, profileData: payload } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Faculty profile modifications updated successfully!");
    },
    onError: () => {
      toast.error("Failed to commit database changes execution.");
    }
  });

  if (!facultyRaw || !editState) {
    return (
      <div className="py-12 text-center">
        <h3 className="text-lg font-bold text-slate-800">Faculty member record not found.</h3>
        <Link to="/departments/$id/faculty" params={{ id: deptId }} className="text-blue-600 text-sm underline mt-2 inline-block">
          Return back to roster
        </Link>
      </div>
    );
  }

  // --- Core Utility State Manipulators for Array/JSON Collections ---
  const handleArrayElementChange = (field: string, index: number, value: string) => {
    const updatedArr = [...editState[field]];
    updatedArr[index] = value;
    setEditState({ ...editState, [field]: updatedArr });
  };

  const addArrayElement = (field: string, defaultValue = "New Entry Item") => {
    setEditState({ ...editState, [field]: [...editState[field], defaultValue] });
  };

  const removeArrayElement = (field: string, index: number) => {
    setEditState({ ...editState, [field]: editState[field].filter((_: any, i: number) => i !== index) });
  };

  const handleConsultancyChange = (index: number, key: keyof ConsultancyProject, value: string) => {
    const updatedProjects = [...editState.consultancy_projects];
    updatedProjects[index] = { ...updatedProjects[index], [key]: value };
    setEditState({ ...editState, consultancy_projects: updatedProjects });
  };

  const addConsultancyProject = () => {
    const newProj: ConsultancyProject = { title: "New Enterprise Project", client: "Agency Partner", status: "Active" };
    setEditState({ ...editState, consultancy_projects: [...editState.consultancy_projects, newProj] });
  };

  const tabs = [
    { id: "profile", label: "1. Profile Overview", icon: GraduationCap },
    { id: "achievements", label: "2. Achievements", icon: Trophy },
    { id: "exchanges", label: "3. Exchanges & Sabbaticals", icon: Globe },
    { id: "consultancy", label: "4. Consultancy Projects", icon: Briefcase },
    { id: "development", label: "5. Professional Dev", icon: BookOpen },
  ];

  return (
    <div className="animate-in fade-in duration-300 space-y-8 max-w-5xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Link 
          to="/departments/$id/faculty"
          params={{ id: deptId }}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Faculty List
        </Link>

        {isEditMode && (
          <button 
            onClick={() => mutation.mutate(editState)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-full font-bold text-xs hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
          >
            <Save size={14} /> Save Profile Changes
          </button>
        )}
      </div>

      {/* Profile Header Block */}
      <div className={`relative bg-gradient-to-br from-slate-900 to-blue-950 rounded-[2.5rem] p-8 text-white shadow-xl flex flex-col md:flex-row gap-8 items-center border transition-all ${isEditMode ? 'border-amber-400 ring-4 ring-amber-400/10' : 'border-transparent'}`}>
        <div className="h-32 w-32 md:h-40 md:w-40 rounded-full overflow-hidden border-4 border-white/10 shrink-0 bg-white/5 relative group">
          <img 
            src={getAssetUrl(editState.photo_url) || ""} 
            alt={editState.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(editState.name)}&size=150&background=0D8ABC&color=fff`; }}
          />
        </div>

        <div className="text-center md:text-left flex-grow space-y-4 w-full">
          {!isEditMode ? (
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-blue-500/20 border border-blue-400/20 text-blue-300">
                Faculty Profile Record
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight pt-1">{editState.name}</h1>
              <p className="text-lg text-slate-300 font-medium">{editState.designation}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left bg-white/5 p-5 rounded-2xl border border-white/10">
              <div className="space-y-1">
                <label className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1"><Type size={12}/> Faculty Name</label>
                <input className="w-full bg-slate-800 border border-slate-700 p-2 rounded-xl text-sm outline-none font-bold text-white" value={editState.name} onChange={(e) => setEditState({ ...editState, name: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1"><IdCard size={12}/> Designation</label>
                <input className="w-full bg-slate-800 border border-slate-700 p-2 rounded-xl text-sm outline-none text-white" value={editState.designation} onChange={(e) => setEditState({ ...editState, designation: e.target.value })} />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1"><Camera size={12}/> Profile Photo URL</label>
                <input className="w-full bg-slate-800 border border-slate-700 p-2 rounded-xl text-xs outline-none text-slate-300 font-mono" value={editState.photo_url} onChange={(e) => setEditState({ ...editState, photo_url: e.target.value })} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm tracking-tight transition-all ${
                isActive ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Core Dynamic Content Body Panel */}
      <div className={`bg-white border rounded-[2rem] p-6 md:p-8 shadow-sm transition-all ${isEditMode ? 'border-amber-300 bg-amber-50/10' : 'border-slate-100'}`}>
        
        {/* --- Tab 1: Profile --- */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 border-b pb-2 border-slate-100">1. Faculty Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block mb-2">Educational Qualifications</span>
                <div className="space-y-2">
                  {editState.qualifications.map((q: string, idx: number) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input 
                        disabled={!isEditMode}
                        className="bg-slate-100 text-slate-800 text-xs font-bold px-3 py-2 rounded-lg w-full outline-none disabled:opacity-100 border border-transparent focus:border-slate-300"
                        value={q} 
                        onChange={(e) => handleArrayElementChange("qualifications", idx, e.target.value)}
                      />
                      {isEditMode && (
                        <button onClick={() => removeArrayElement("qualifications", idx)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg"><Trash2 size={14}/></button>
                      )}
                    </div>
                  ))}
                  {isEditMode && (
                    <button onClick={() => addArrayElement("qualifications", "M.Tech")} className="flex items-center gap-1 text-[11px] text-indigo-600 font-bold border border-dashed border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50/50"><Plus size={12}/> Add Degree</button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block mb-1">Area of Specialization</span>
                  <input 
                    disabled={!isEditMode} 
                    className="text-slate-800 border bg-transparent border-slate-200 disabled:border-transparent p-2 rounded-xl text-sm font-semibold w-full outline-none focus:bg-white" 
                    value={editState.specialization} 
                    onChange={(e) => setEditState({ ...editState, specialization: e.target.value })}
                  />
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block mb-1">Experience (Years)</span>
                  <input 
                    type="number"
                    disabled={!isEditMode} 
                    className="text-slate-800 border bg-transparent border-slate-200 disabled:border-transparent p-2 rounded-xl text-sm font-semibold w-full outline-none focus:bg-white" 
                    value={editState.experience_years} 
                    onChange={(e) => setEditState({ ...editState, experience_years: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- Tab 2: Achievements --- */}
        {activeTab === "achievements" && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 border-b pb-2 border-slate-100">2. Faculty Achievements</h3>
            <div className="grid grid-cols-1 gap-6">
              {/* Awards Row */}
              <div>
                <h4 className="text-sm font-bold text-blue-900 uppercase tracking-wide mb-2">Awards Received</h4>
                <div className="space-y-2">
                  {editState.awards.map((item: string, idx: number) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      <input 
                        disabled={!isEditMode}
                        className="w-full text-sm text-slate-700 bg-transparent outline-none border-b border-transparent focus:border-slate-200 disabled:opacity-100 py-1"
                        value={item}
                        onChange={(e) => handleArrayElementChange("awards", idx, e.target.value)}
                      />
                      {isEditMode && (
                        <button onClick={() => removeArrayElement("awards", idx)} className="text-red-500"><Trash2 size={14}/></button>
                      )}
                    </div>
                  ))}
                  {isEditMode && (
                    <button onClick={() => addArrayElement("awards", "National/Institutional Research Honor")} className="flex items-center gap-1 text-[11px] text-blue-700 font-bold pt-1"><Plus size={12}/> Add Award Item</button>
                  )}
                </div>
              </div>

              {/* Fellowships Row */}
              <div className="border-t pt-4 border-slate-100">
                <h4 className="text-sm font-bold text-blue-900 uppercase tracking-wide mb-2">Fellowships</h4>
                <div className="space-y-2">
                  {editState.fellowships.map((item: string, idx: number) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                      <input 
                        disabled={!isEditMode}
                        className="w-full text-sm text-slate-700 bg-transparent outline-none border-b border-transparent focus:border-slate-200 disabled:opacity-100 py-1"
                        value={item}
                        onChange={(e) => handleArrayElementChange("fellowships", idx, e.target.value)}
                      />
                      {isEditMode && (
                        <button onClick={() => removeArrayElement("fellowships", idx)} className="text-red-500"><Trash2 size={14}/></button>
                      )}
                    </div>
                  ))}
                  {isEditMode && (
                    <button onClick={() => addArrayElement("fellowships", "Honorary Research Fellow Group")} className="flex items-center gap-1 text-[11px] text-indigo-700 font-bold pt-1"><Plus size={12}/> Add Fellowship Item</button>
                  )}
                </div>
              </div>

              {/* Memberships Row */}
              <div className="border-t pt-4 border-slate-100">
                <h4 className="text-sm font-bold text-blue-900 uppercase tracking-wide mb-2">Professional Memberships</h4>
                <div className="flex flex-wrap gap-2">
                  {editState.professional_memberships.map((m: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-1 bg-blue-50 border border-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-lg">
                      <input 
                        disabled={!isEditMode}
                        className="bg-transparent outline-none w-28 text-center disabled:w-auto"
                        value={m}
                        onChange={(e) => handleArrayElementChange("professional_memberships", idx, e.target.value)}
                      />
                      {isEditMode && (
                        <button onClick={() => removeArrayElement("professional_memberships", idx)} className="text-red-500 ml-1 hover:bg-white rounded-md p-0.5"><Trash2 size={10}/></button>
                      )}
                    </div>
                  ))}
                  {isEditMode && (
                    <button onClick={() => addArrayElement("professional_memberships", "IEEE Member")} className="bg-white border border-dashed border-slate-300 text-slate-500 text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1"><Plus size={12}/> Add</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- Tab 3: Exchanges & Sabbaticals --- */}
        {activeTab === "exchanges" && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 border-b pb-2 border-slate-100">3. Faculty Exchange and Sabbaticals</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2">Faculty Exchanges</h4>
                  <div className="space-y-2">
                    {editState.international_exchanges.map((item: string, idx: number) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input 
                          disabled={!isEditMode}
                          className="w-full text-sm text-slate-600 bg-white border border-transparent disabled:border-transparent disabled:bg-transparent rounded-lg p-1.5 outline-none font-medium"
                          value={item}
                          onChange={(e) => handleArrayElementChange("international_exchanges", idx, e.target.value)}
                        />
                        {isEditMode && (
                          <button onClick={() => removeArrayElement("international_exchanges", idx)} className="text-red-500"><Trash2 size={14}/></button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                {isEditMode && (
                  <button onClick={() => addArrayElement("international_exchanges", "Exchanged Faculty Delegate")} className="flex items-center gap-1 text-xs text-indigo-600 font-bold mt-4"><Plus size={12}/> Add Record</button>
                )}
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2">Sabbaticals (Academic Leaves)</h4>
                  <div className="space-y-2">
                    {editState.sabbaticals.map((item: string, idx: number) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input 
                          disabled={!isEditMode}
                          className="w-full text-sm text-slate-600 bg-white border border-transparent disabled:border-transparent disabled:bg-transparent rounded-lg p-1.5 outline-none font-medium"
                          value={item}
                          onChange={(e) => handleArrayElementChange("sabbaticals", idx, e.target.value)}
                        />
                        {isEditMode && (
                          <button onClick={() => removeArrayElement("sabbaticals", idx)} className="text-red-500"><Trash2 size={14}/></button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                {isEditMode && (
                  <button onClick={() => addArrayElement("sabbaticals", "Research Leave Assignment")} className="flex items-center gap-1 text-xs text-indigo-600 font-bold mt-4"><Plus size={12}/> Add Sabbatical Leave</button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- Tab 4: Consultancy --- */}
        {activeTab === "consultancy" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-2 border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">4. Consultancy Assignments</h3>
              {isEditMode && (
                <button onClick={addConsultancyProject} className="flex items-center gap-1 text-xs bg-slate-900 text-white px-3 py-1.5 rounded-xl font-bold"><Plus size={12}/> Add Row</button>
              )}
            </div>
            <div className="overflow-hidden border border-slate-100 rounded-xl">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-100">
                    <th className="p-4">Project Title</th>
                    <th className="p-4">Organization Partner</th>
                    <th className="p-4">Status</th>
                    {isEditMode && <th className="p-4 text-center">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {editState.consultancy_projects.map((proj: ConsultancyProject, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="p-4">
                        <input 
                          disabled={!isEditMode} 
                          className="bg-transparent font-semibold text-slate-900 outline-none w-full border-b border-transparent focus:border-slate-200" 
                          value={proj.title}
                          onChange={(e) => handleConsultancyChange(idx, "title", e.target.value)}
                        />
                      </td>
                      <td className="p-4">
                        <input 
                          disabled={!isEditMode} 
                          className="bg-transparent outline-none w-full border-b border-transparent focus:border-slate-200" 
                          value={proj.client}
                          onChange={(e) => handleConsultancyChange(idx, "client", e.target.value)}
                        />
                      </td>
                      <td className="p-4">
                        {isEditMode ? (
                          <select 
                            className="bg-slate-50 border border-slate-200 rounded p-1 text-xs font-bold outline-none"
                            value={proj.status}
                            onChange={(e) => handleConsultancyChange(idx, "status", e.target.value)}
                          >
                            <option value="Active">Active</option>
                            <option value="Completed">Completed</option>
                          </select>
                        ) : (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            proj.status === "Completed" ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>{proj.status}</span>
                        )}
                      </td>
                      {isEditMode && (
                        <td className="p-4 text-center">
                          <button onClick={() => {
                            const updated = editState.consultancy_projects.filter((_: any, i: number) => i !== idx);
                            setEditState({ ...editState, consultancy_projects: updated });
                          }} className="text-red-500 hover:bg-red-50 p-1 rounded-lg"><Trash2 size={14}/></button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- Tab 5: Professional Development --- */}
        {activeTab === "development" && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 border-b pb-2 border-slate-100">5. Professional Development</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-2">FDPs & Workshops Completed</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {editState.fdps_attended.map((f: string, i: number) => (
                    <div key={i} className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-700 flex items-center justify-between gap-2">
                      <input 
                        disabled={!isEditMode}
                        className="bg-transparent outline-none w-full"
                        value={f}
                        onChange={(e) => handleArrayElementChange("fdps_attended", i, e.target.value)}
                      />
                      {isEditMode && (
                        <button onClick={() => removeArrayElement("fdps_attended", i)} className="text-red-500"><Trash2 size={12}/></button>
                      )}
                    </div>
                  ))}
                </div>
                {isEditMode && (
                  <button onClick={() => addArrayElement("fdps_attended", "Advanced Research Workshop Focus")} className="flex items-center gap-1 text-[11px] text-slate-700 font-bold mt-2"><Plus size={12}/> Add FDP/Workshop Program</button>
                )}
              </div>

              <div className="border-t pt-4 border-slate-100">
                <h4 className="text-sm font-bold text-slate-800 mb-2">Conferences Attended</h4>
                <div className="space-y-2">
                  {editState.conferences_attended.map((c: string, i: number) => (
                    <div key={i} className="flex gap-2 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                      <input 
                        disabled={!isEditMode}
                        className="w-full text-sm text-slate-600 bg-transparent outline-none border-b border-transparent focus:border-slate-200 py-0.5"
                        value={c}
                        onChange={(e) => handleArrayElementChange("conferences_attended", i, e.target.value)}
                      />
                      {isEditMode && (
                        <button onClick={() => removeArrayElement("conferences_attended", i)} className="text-red-500"><Trash2 size={14}/></button>
                      )}
                    </div>
                  ))}
                  {isEditMode && (
                    <button onClick={() => addArrayElement("conferences_attended", "IEEE Academic Track Symposium Convention")} className="flex items-center gap-1 text-[11px] text-slate-700 font-bold pt-1"><Plus size={12}/> Add Conference Entry</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}