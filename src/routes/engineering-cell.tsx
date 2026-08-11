import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHero } from "@/components/PageHero";
import { getEngineeringData } from "@/funcs/engineer.server";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import {
  updateEngineeringContent,
  updateElectricalInfo,
  createMetaPoint,
  deleteMetaPoint,
  updateMetaPoint,
  createStaffMember,
  deleteStaffMember,
  updateStaffMember,
} from "@/funcs/engineer.admin.server";
import {
  Building,
  Hammer,
  Zap,
  Eye,
  User,
  Sparkles,
  Lock,
  Save,
  Plus,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { LocalSubNav } from "@/components/LocalSubNav";
import { getAssetUrl } from "@/lib/assets";
import { AdminUpload, PersonAvatarUpload } from "@/components/AdminEditPanel";

export const Route = createFileRoute("/engineering-cell")({
  loader: async () => await getEngineeringData(),
  component: EngineeringCellPage,
});

function EngineeringCellPage() {
  const data = Route.useLoaderData() as any;
  const router = useRouter();
  const { isEditMode } = useAdmin();

  const content = data?.content || {};
  const constructionPoints = data?.constructionPoints || [];
  const electrical = data?.electrical || {};
  const civilStaff = data?.civilStaff || [];
  const electricalStaff = data?.electricalStaff || [];

  const [tab, setTab] = useState("Overview");

  // --- LOCAL EDITS ---
  const [editCore, setEditCore] = useState({
    title: content?.title || "",
    description: content?.description || "",
    vision: content?.vision || "",
    mission: content?.mission || "",
  });

  const [editElectrical, setEditElectrical] = useState({
    id: electrical?.id,
    title: electrical?.title || "",
    engineer: electrical?.engineer || "",
    designation: electrical?.designation || "",
    description: electrical?.description || "",
    img: electrical?.img || "",
  });

  useEffect(() => {
    if (content) {
      setEditCore({
        title: content.title || "Engineering Cell",
        description: content.description || "",
        vision: content.vision || "",
        mission: content.mission || "",
      });
    }
    if (electrical) {
      setEditElectrical({
        id: electrical.id,
        title: electrical.title || "PE (Elec) Section",
        engineer: electrical.engineer || "Dr. A. Padmaja",
        designation: electrical.designation || "Project Engineer",
        description: electrical.description || "Ensuring electrical maintenance and system management.",
        img: electrical.img || "",
      });
    }
  }, [content, electrical]);

  // --- MUTATIONS ---
  async function handleSaveCore() {
    const tId = toast.loading("Updating infrastructure specs...");
    try {
      await updateEngineeringContent({
        data: {
          id: content?.id,
          ...editCore,
        },
      });
      toast.success("Core parameters synchronized!", { id: tId });
      router.invalidate();
    } catch {
      toast.error("Save fail.", { id: tId });
    }
  }

  async function handleSaveElectrical() {
    const tId = toast.loading("Updating electrical sections...");
    try {
      await updateElectricalInfo({
        data: {
          ...editElectrical,
        },
      });
      toast.success("Electrical profile aligned!", { id: tId });
      router.invalidate();
    } catch {
      toast.error("Failure.", { id: tId });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-sand/20 text-foreground pb-24 w-full max-w-full overflow-x-hidden relative z-0">
      {/* Premium Ambient Radial Gradients */}
      <div className="absolute top-[20%] -left-48 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[130px] pointer-events-none -z-10 animate-pulse duration-[8s]" />
      <div className="absolute bottom-[25%] -right-48 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[130px] pointer-events-none -z-10 animate-pulse duration-[10s]" />
      {isEditMode && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-white font-black py-3 px-6 sticky top-0 z-[100] shadow-xl flex items-center justify-center gap-2.5 border-b border-amber-700/30 animate-[fade-in_0.15s] backdrop-blur-md text-xs uppercase tracking-widest">
          <Lock className="w-3.5 h-3.5 animate-pulse text-amber-950" />
          <span>Engineering Portal CMS Live</span>
          <div className="hidden md:block h-1 w-1 rounded-full bg-amber-950" />
          <span className="hidden md:block text-amber-100 normal-case italic font-medium">Inline adjustments will align live layout properties.</span>
        </div>
      )}

      <PageHero
        title={content?.title || "Engineering Cell"}
        subtitle="Strategic technical development, campus construction schedules, and reliable utility maintenance."
        image={getAssetUrl(electrical?.img) || "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1000"}
      />

      <section className="container-narrow py-12 md:py-16 px-4 sm:px-6 max-w-full overflow-x-hidden">
        
        {/* SYSTEM NAVIGATION TABS - Sleeker clean UI */}
        <LocalSubNav
          activeTab={tab}
          setActiveTab={setTab}
          items={[
            { label: "Overview", icon: Building },
            { label: "Construction Activities", icon: Hammer },
            { label: "PE (Elec) Section", icon: Zap },
            { label: "Vision & Mission", icon: Eye },
          ]}
        />

        <div className="space-y-10 max-w-5xl mx-auto animate-[fade-in_0.2s_ease-out]">
          
          {/* ==========================================
              🏢 TAB 1: OVERVIEW & SCOPE
             ========================================== */}
          {tab === "Overview" && (
            <div className="animate-[fade-in_0.2s_ease-out]">
              <Card 
                title="Scope and Objectives" 
                icon={Building}
                className={isEditMode ? "ring-4 ring-amber-500/10 bg-amber-50/20 border-amber-200" : ""}
              >
                {isEditMode ? (
                  <div className="space-y-5">
                    <div>
                      <label className="text-[10px] font-black text-amber-800 uppercase">Core Main Title</label>
                      <input value={editCore.title} onChange={(e)=>setEditCore({...editCore, title:e.target.value})} className="w-full border-2 bg-white rounded-xl p-3.5 text-sm font-bold focus:border-amber-400" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-amber-800 uppercase">Infrastructure Description</label>
                      <textarea value={editCore.description} onChange={(e)=>setEditCore({...editCore, description:e.target.value})} className="w-full h-44 border-2 bg-white rounded-xl p-4 text-sm font-medium focus:border-amber-400 outline-none" />
                    </div>
                    <div className="flex justify-end">
                      <button onClick={handleSaveCore} className="bg-amber-500 hover:bg-amber-600 text-amber-950 font-black px-6 py-3 rounded-xl text-xs uppercase shadow cursor-pointer active:scale-95 flex items-center gap-2"><Save className="w-4 h-4"/> Commit Core Metadata</button>
                    </div>
                  </div>
                ) : (
                  <p className="text-[15px] text-slate-600 leading-relaxed font-medium whitespace-pre-line bg-slate-50/50 border rounded-3xl p-6 border-slate-100 shadow-inner">
                    {content?.description || "Central engineering dispatch managing multi-level structures and infrastructure operations."}
                  </p>
                )}
              </Card>
            </div>
          )}

          {/* ==========================================
              🔨 TAB 2: CONSTRUCTION ACTIVITIES
             ========================================== */}
          {tab === "Construction Activities" && (
            <div className="space-y-10 animate-[fade-in_0.2s_ease-out]">
              
              <Card 
                title="Construction & Works Scheduled" 
                subtitle="Physical structure logging systems"
                icon={Hammer}
                className={isEditMode ? "ring-2 ring-amber-300" : ""}
              >
                <MetaRegistryEditable 
                  data={constructionPoints} 
                  category="construction" 
                  isEdit={isEditMode} 
                  onRefetch={() => router.invalidate()} 
                />
              </Card>

              <Card 
                title="Civil Infrastructure Staff Roster" 
                subtitle="Authorized builders and monitoring officials"
                icon={User}
                className={isEditMode ? "ring-2 ring-amber-300" : ""}
              >
                <StaffRegistryEditable 
                  data={civilStaff} 
                  type="civil" 
                  isEdit={isEditMode} 
                  onRefetch={() => router.invalidate()} 
                />
              </Card>
            </div>
          )}

          {/* ==========================================
              ⚡ TAB 3: PE ELECTRICAL SECTION
             ========================================== */}
          {tab === "PE (Elec) Section" && (
            <div className="space-y-10 animate-[fade-in_0.2s_ease-out]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Officer Card */}
                <div className="lg:col-span-4">
                  <Card 
                    title="Section Controller" 
                    icon={User} 
                    className={isEditMode ? "h-full ring-4 ring-amber-500/10 bg-amber-50/10 border-amber-200" : "h-full"}
                  >
                    {isEditMode ? (
                      <div className="space-y-4 animate-[fade-in_0.3s]">
                        <div className="flex justify-center">
                          <PersonAvatarUpload
                            value={editElectrical.img}
                            onChange={(newUrl) => setEditElectrical({ ...editElectrical, img: newUrl })}
                            module="engineering"
                            category="electrical"
                            size={112}
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-black text-amber-800 uppercase">Controller Name</label>
                          <input value={editElectrical.engineer} onChange={(e)=>setEditElectrical({...editElectrical, engineer:e.target.value})} className="w-full border bg-white text-xs font-bold p-2 rounded" />
                        </div>
                        <div>
                          <label className="text-[9px] font-black text-amber-800 uppercase">Designation Station</label>
                          <input value={editElectrical.designation} onChange={(e)=>setEditElectrical({...editElectrical, designation:e.target.value})} className="w-full border bg-white text-xs font-bold p-2 rounded" />
                        </div>
                        <button onClick={handleSaveElectrical} className="w-full bg-amber-500 text-amber-950 font-black text-xs p-2.5 rounded-xl uppercase cursor-pointer shadow hover:bg-amber-600 active:scale-95 transition"><Save className="w-3.5 h-3.5 inline mr-1" /> Synchronize Incharge</button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-center pt-2">
                        <div className="w-28 h-28 rounded-[28px] overflow-hidden bg-slate-50 border-2 border-slate-100 mb-4 shadow-md transition hover:scale-[1.02] duration-200">
                          <img decoding="async" loading="lazy"
                            src={getAssetUrl(electrical?.img) || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250"}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250"; }}
                            alt={electrical?.engineer || "Engineer"}
                          />
                        </div>
                        <h4 className="font-display font-black text-[17px] text-slate-900 mb-1 leading-snug">{electrical?.engineer || "Dr. A. Padmaja"}</h4>
                        <div className="inline-flex bg-indigo-50 border border-indigo-100 text-[oklch(0.42_0.18_265)] text-[10px] font-black tracking-widest uppercase px-3.5 py-1 rounded-lg shadow-sm">{electrical?.designation || "Project Engineer"}</div>
                      </div>
                    )}
                  </Card>
                </div>

                {/* Details Description Card */}
                <div className="lg:col-span-8">
                  <Card 
                    title="Section Dynamics" 
                    icon={Zap} 
                    className={isEditMode ? "h-full ring-4 ring-amber-500/10 bg-amber-50/10 border-amber-200" : "h-full"}
                  >
                    {isEditMode ? (
                      <div className="space-y-4 animate-[fade-in_0.15s]">
                        <div>
                          <label className="text-[9px] font-black text-amber-800 uppercase">Feature Header</label>
                          <input value={editElectrical.title} onChange={(e)=>setEditElectrical({...editElectrical, title:e.target.value})} className="w-full border-2 border-amber-200 bg-white text-sm font-bold p-3 rounded-xl" />
                        </div>
                        <div>
                          <label className="text-[9px] font-black text-amber-800 uppercase">Feature Body</label>
                          <textarea value={editElectrical.description} onChange={(e)=>setEditElectrical({...editElectrical, description:e.target.value})} className="w-full h-24 border-2 border-amber-200 bg-white text-sm font-medium p-3 rounded-xl outline-none" />
                        </div>
                        <div className="flex justify-end">
                          <button onClick={handleSaveElectrical} className="bg-amber-500 text-amber-950 font-black px-5 py-2.5 rounded-xl text-xs uppercase cursor-pointer shadow hover:bg-amber-600"><Save className="w-4 h-4 inline mr-1.5" /> Align Feature Card</button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <h4 className="font-display font-black text-xl text-slate-900 tracking-tight">{electrical?.title || "PE (Elec) Section Operations"}</h4>
                        <p className="text-[15px] text-slate-600 leading-relaxed font-medium bg-slate-50 border rounded-2xl p-5 shadow-inner">{electrical?.description || "Ensures uninterrupted campus utility, smart-grid connectivity grids, and power installations upkeep."}</p>
                      </div>
                    )}
                  </Card>
                </div>
              </div>

              {/* Supporting electrical staff */}
              <Card 
                title="Electrical Grid Staff Roster" 
                subtitle="Operational grid dispatch and logistics linemen"
                icon={User}
                className={isEditMode ? "ring-2 ring-amber-300" : ""}
              >
                <StaffRegistryEditable 
                  data={electricalStaff} 
                  type="electrical" 
                  isEdit={isEditMode} 
                  onRefetch={() => router.invalidate()} 
                />
              </Card>
            </div>
          )}

          {/* ==========================================
              👁️ TAB 4: VISION & MISSION
             ========================================== */}
          {tab === "Vision & Mission" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-[fade-in_0.2s_ease-out]">
              <Card 
                title="System Vision" 
                icon={Eye}
                className={isEditMode ? "ring-4 ring-amber-500/10 bg-amber-50/10 border-amber-200" : ""}
              >
                {isEditMode ? (
                  <div className="space-y-3 animate-[fade-in_0.15s]">
                    <textarea value={editCore.vision} onChange={(e)=>setEditCore({...editCore, vision:e.target.value})} className="w-full h-28 border-2 border-amber-200 bg-white text-sm font-medium rounded-xl p-3" />
                    <button onClick={handleSaveCore} className="w-full bg-amber-500 text-amber-950 font-black text-xs p-3 rounded-xl uppercase cursor-pointer shadow"><Save className="w-4 h-4 inline mr-1.5" /> Save Vision</button>
                  </div>
                ) : (
                  <p className="text-[15px] text-slate-600 leading-relaxed font-medium italic">"{content?.vision || "Maintain physical state-of-the-art architectures allowing curricular outputs to scale seamlessly."}"</p>
                )}
              </Card>

              <Card 
                title="Operational Mission" 
                icon={Sparkles}
                className={isEditMode ? "ring-4 ring-amber-500/10 bg-amber-50/10 border-amber-200" : ""}
              >
                {isEditMode ? (
                  <div className="space-y-3 animate-[fade-in_0.15s]">
                    <textarea value={editCore.mission} onChange={(e)=>setEditCore({...editCore, mission:e.target.value})} className="w-full h-28 border-2 border-amber-200 bg-white text-sm font-medium rounded-xl p-3" />
                    <button onClick={handleSaveCore} className="w-full bg-amber-500 text-amber-950 font-black text-xs p-3 rounded-xl uppercase cursor-pointer shadow"><Save className="w-4 h-4 inline mr-1.5" /> Save Mission</button>
                  </div>
                ) : (
                  <p className="text-[15px] text-slate-600 leading-relaxed font-medium">"{content?.mission || "Executing rapid, highly secure maintenance loops across building frameworks campus wide."}"</p>
                )}
              </Card>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/* ---------- BUTTONS AND LAYOUT WRAPPERS ---------- */

function Card({ title, subtitle, icon: Icon, children, className = "" }: any) {
  return (
    <div className={`glass-panel rounded-3xl p-6 md:p-8 hover-lift overflow-hidden w-full relative z-10 ${className}`}>
      {title && (
        <div className="flex items-center gap-3.5 mb-6 md:mb-8 pb-5 border-b border-border/50">
          <div className="w-12 h-12 rounded-2xl bg-background border border-border/60 text-primary grid place-items-center shrink-0 shadow-sm">
            {Icon && <Icon className="w-5.5 h-5.5" />}
          </div>
          <div>
            <h3 className="font-display font-extrabold text-xl text-foreground tracking-tight leading-none">{title}</h3>
            {subtitle && <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mt-1.5">{subtitle}</p>}
          </div>
        </div>
      )}
      <div className="w-full relative z-10">{children}</div>
    </div>
  );
}

/* ---------- EDITABLE RENDERERS ---------- */

function MetaRegistryEditable({ data, category, isEdit, onRefetch }: any) {
  const [newEntry, setNewEntry] = useState("");

  async function handleAdd() {
    if (!newEntry.trim()) return;
    const tId = toast.loading("Inserting scheduled logistics spec...");
    try {
      await createMetaPoint({ data: { category, content: newEntry.trim() } });
      toast.success("Work logged!", { id: tId });
      setNewEntry("");
      onRefetch();
    } catch {
      toast.error("Failed.", { id: tId });
    }
  }

  async function handleDelete(id: number) {
    const tId = toast.loading("Purging logistics ledger node...");
    try {
      await deleteMetaPoint({ data: { id } });
      toast.success("Logged off!", { id: tId });
      onRefetch();
    } catch {
      toast.error("Wipe fail.", { id: tId });
    }
  }

  return (
    <div className="space-y-6 w-full">
      {isEdit && (
        <div className="flex gap-2.5 max-w-lg bg-amber-50/80 border-2 border-amber-200 rounded-[20px] p-3 shadow-inner animate-[fade-in_0.15s]">
          <input type="text" value={newEntry} onChange={(e)=>setNewEntry(e.target.value)} onKeyDown={(e)=>e.key==="Enter" && handleAdd()} placeholder="Describe work node (e.g. Block-V ceiling overhaul)..." className="flex-1 border-2 bg-white border-amber-200 px-4 py-2.5 rounded-xl outline-none text-sm font-bold focus:border-amber-500" />
          <button onClick={handleAdd} className="bg-slate-950 hover:bg-amber-600 text-white font-black px-6 py-2.5 rounded-xl text-xs uppercase cursor-pointer transition active:scale-95 shadow">Log</button>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {data.length === 0 ? (
          <p className="text-slate-400 italic text-sm pt-1 font-medium col-span-2">No logged scheduled operations.</p>
        ) : (
          data.map((item: any, i: number)=>(
            <div key={item.id || i} className={`flex items-start justify-between border rounded-2xl px-5 py-4.5 transition-all duration-200 ${
              isEdit ? "bg-amber-50/40 border-amber-200 shadow-sm" : "bg-slate-50/80 border-slate-100 hover:bg-white hover:border-slate-200 hover:shadow-md group"
            }`}>
              <div className="flex items-start gap-3 min-w-0 w-full">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5 animate-pulse" />
                {isEdit ? (
                  <InlineCellEdit val={item.content} onCommit={async (n)=>{ await updateMetaPoint({data:{...item, content:n}}); onRefetch(); }} />
                ) : (
                  <span className="text-sm text-slate-700 font-bold leading-snug">{item.content}</span>
                )}
              </div>
              {isEdit && (
                <button onClick={()=>handleDelete(item.id)} className="w-7 h-7 rounded-full bg-amber-100/60 hover:bg-rose-600 text-amber-800 hover:text-white flex items-center justify-center cursor-pointer shrink-0 ml-2 transition"><XIcon className="w-3.5 h-3.5"/></button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StaffRegistryEditable({ data, type, isEdit, onRefetch }: any) {
  const [form, setForm] = useState({ name: "", designation: "" });

  async function handleAdd() {
    if (!form.name.trim()) return;
    const tId = toast.loading("Enrolling tech staff member...");
    try {
      await createStaffMember({ data: { type, name: form.name.trim(), designation: form.designation.trim() } });
      toast.success("Member enrolled!", { id: tId });
      setForm({ name: "", designation: "" });
      onRefetch();
    } catch {
      toast.error("Store fail.", { id: tId });
    }
  }

  async function handleDelete(id: number) {
    const tId = toast.loading("Revoking registry clearance...");
    try {
      await deleteStaffMember({ data: { id } });
      toast.success("Purged!", { id: tId });
      onRefetch();
    } catch {
      toast.error("Failed.", { id: tId });
    }
  }

  return (
    <div className="space-y-6 w-full max-w-full">
      {isEdit && (
        <div className="bg-amber-50/80 border-2 border-amber-200 p-5 rounded-[24px] grid grid-cols-1 sm:grid-cols-3 gap-4 items-end shadow-inner animate-[fade-in_0.15s]">
          <div>
            <label className="text-[10px] font-black uppercase text-amber-800 tracking-widest">Personnel Name</label>
            <input type="text" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} className="w-full border-2 bg-white border-amber-200 px-3.5 py-2.5 rounded-xl text-sm font-bold" />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-amber-800 tracking-widest">Rank / Designation</label>
            <input type="text" value={form.designation} onChange={(e)=>setForm({...form, designation:e.target.value})} className="w-full border-2 bg-white border-amber-200 px-3.5 py-2.5 rounded-xl text-sm font-bold" />
          </div>
          <button onClick={handleAdd} className="bg-slate-950 hover:bg-amber-600 text-white font-black py-4 rounded-[14px] text-xs uppercase shadow flex gap-2 justify-center cursor-pointer transition active:scale-95"><Plus className="w-4 h-4"/> Enroll Official</button>
        </div>
      )}

      <div className="overflow-x-auto no-scrollbar w-full border border-slate-200/60 rounded-[24px]">
        <table className="w-full text-left border-collapse min-w-[550px]">
          <thead>
            <tr className="bg-slate-50 border-b">
              <th className="py-4 px-6 text-[10px] font-black uppercase tracking-wider text-slate-400">Official Full Name</th>
              <th className="py-4 px-6 text-[10px] font-black uppercase tracking-wider text-slate-400">Station Rank</th>
              {isEdit && <th className="py-4 px-6 text-[10px] font-black uppercase tracking-wider text-slate-400">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y text-[14.5px] font-bold text-slate-800">
            {data.length === 0 ? (
              <tr>
                <td colSpan={isEdit ? 3 : 2} className="py-8 text-center italic text-slate-400 font-medium">No registered personnel listed.</td>
              </tr>
            ) : (
              data.map((s: any, i: number)=>(
                <tr key={s.id || i} className="hover:bg-slate-50/40 transition duration-300">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3.5">
                      <div className="w-8.5 h-8.5 rounded-full bg-indigo-50 text-[oklch(0.42_0.18_265)] font-black grid place-items-center shadow-sm shrink-0 text-[11.5px] border border-indigo-100/50">{s.name?.[0]?.toUpperCase()}</div>
                      {isEdit ? (
                        <InlineCellEdit val={s.name} onCommit={async (n)=>{ await updateStaffMember({data:{...s, name:n}}); onRefetch(); }} />
                      ) : (
                        <span className="text-slate-900 font-extrabold tracking-tight">{s.name}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {isEdit ? (
                      <InlineCellEdit val={s.designation} onCommit={async (n)=>{ await updateStaffMember({data:{...s, designation:n}}); onRefetch(); }} />
                    ) : (
                      <span className="inline-flex bg-indigo-50/80 border border-indigo-100 text-[oklch(0.42_0.18_265)] text-[10.5px] font-black uppercase px-3 py-1 rounded shadow-sm">{s.designation}</span>
                    )}
                  </td>
                  {isEdit && (
                    <td className="py-4 px-6">
                      <button onClick={()=>handleDelete(s.id)} className="text-slate-300 hover:text-rose-600 hover:bg-rose-50 w-8.5 h-8.5 rounded-xl grid place-items-center transition cursor-pointer active:scale-90"><Trash2 className="w-4 h-4"/></button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* --- SHARED UTILS & MINI HELPERS --- */

function InlineCellEdit({ val, onCommit }: { val: string; onCommit: (nVal: string) => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  const [localVal, setLocalVal] = useState(val);

  async function handleBlur() {
    setEditing(false);
    if (localVal.trim() !== val) {
      const tId = toast.loading("Modifying station ledger...");
      try {
        await onCommit(localVal.trim());
        toast.success("Saved!", { id: tId });
      } catch {
        toast.error("Fail.", { id: tId });
      }
    }
  }

  if (editing) {
    return (
      <input
        autoFocus
        value={localVal}
        onChange={(e) => setLocalVal(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={(e) => e.key === "Enter" && handleBlur()}
        className="border-2 border-amber-400 bg-white text-xs font-bold px-2 py-1 rounded shadow-inner outline-none text-amber-950 w-full"
      />
    );
  }

  return (
    <span onClick={() => setEditing(true)} className="border-b border-dashed border-amber-400/60 hover:bg-amber-100/40 hover:border-amber-600 px-0.5 py-0.5 cursor-pointer transition duration-300 flex-1 text-left truncate min-w-[40px]">
      {val || <span className="italic text-slate-300">[Null]</span>}
    </span>
  );
}

function XIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}

