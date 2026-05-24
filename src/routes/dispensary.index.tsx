import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHero } from "@/components/PageHero";
import cultureImg from "@/assets/culture.jpeg";
import { getDispensaryData } from "@/funcs/dispensary.server";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import {
  updateContent,
  createPerson,
  updatePerson,
  deletePerson,
  createMeta,
  deleteMeta,
  updateMeta,
  createImage,
  deleteImage,
} from "@/funcs/dispensary.admin.server";
import { 
  Building, 
  User, 
  Activity, 
  Sparkles, 
  Coffee, 
  Phone,
  Camera,
  Trash2,
  Plus,
  X,
  CalendarDays,
  ShieldAlert
} from "lucide-react";
import { LocalSubNav } from "@/components/LocalSubNav";
import {
  AdminModeBanner,
  AdminPanel,
  AdminField,
  AdminInput,
  AdminTextarea,
  AdminSaveButton,
  AdminAddRow,
} from "@/components/AdminEditPanel";

export const Route = createFileRoute("/dispensary/")({
  loader: async () => await getDispensaryData(),
  component: DispensaryPage,
});

function DispensaryPage() {
  const data = Route.useLoaderData() as any;
  const router = useRouter();
  const { isEditMode } = useAdmin();

  const [tab, setTab] = useState<"Doctors" | "Facilities" | "Supporting Staff">("Doctors");

  const doctors = data?.doctors ?? [];
  const facilities = data?.facilities ?? [];
  const medicines = data?.medicines ?? [];
  const staff = data?.staff ?? [];
  const drivers = data?.drivers ?? [];
  const images = data?.images ?? [];

  const getCarouselImages = () => images.map((i: any) => i.url);

  // --- LOCAL CMS EDIT STATES ---
  const [editInfo, setEditInfo] = useState({
    hodName: data?.info?.hodName || "",
    message: data?.info?.message || "",
    img: data?.info?.img || "",
  });

  useEffect(() => {
    if (data?.info) {
      setEditInfo({
        hodName: data.info.hodName || "",
        message: data.info.message || "",
        img: data.info.img || "",
      });
    }
  }, [data?.info]);

  // --- MUTATIONS ---
  async function handleSaveInfo() {
    const tId = toast.loading("Updating dispensary control profile...");
    try {
      await updateContent({
        data: {
          ...editInfo,
        },
      });
      toast.success("Profile synchronized!", { id: tId });
      router.invalidate();
    } catch {
      toast.error("Update fail.", { id: tId });
    }
  }

  async function handleAddImage(url: string) {
    if (!url.trim()) return;
    const tId = toast.loading("Storing slide node...");
    try {
      await createImage({ data: { url } });
      toast.success("Linked!", { id: tId });
      router.invalidate();
    } catch {
      toast.error("Failure.", { id: tId });
    }
  }

  async function handleDeleteImage(id: number) {
    const tId = toast.loading("Purging visual entry...");
    try {
      await deleteImage({ data: { id } });
      toast.success("Deleted!", { id: tId });
      router.invalidate();
    } catch {
      toast.error("Deletion fail.", { id: tId });
    }
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 text-slate-800 pb-24">
      {isEditMode && <AdminModeBanner label="Dispensary Control Panel — Live Edit" />}

      <PageHero
        title="University Dispensary"
        subtitle="Integrated physical healthcare, active emergency networks, and ambulance dispatch schedules."
        image={images[0]?.url || cultureImg}
      />

      <section className="container-narrow py-12 md:py-16 px-4 sm:px-6 max-w-full overflow-x-hidden">
        
        {/* DYNAMIC SYSTEM NAV - Premium consistent tabs */}
        <LocalSubNav
          activeTab={tab}
          setActiveTab={setTab as (tab: string) => void}
          items={[
            { label: "Doctors", icon: User },
            { label: "Facilities", icon: Sparkles },
            { label: "Supporting Staff", icon: Building },
          ]}
        />

        <div className="space-y-10 max-w-5xl mx-auto animate-[fade-in_0.5s_ease-out]">
          
          {/* GALLERY STACK */}
          <div className="relative w-full max-w-full overflow-hidden rounded-[32px] shadow-md border border-slate-200/60 bg-slate-200">
            <ImageCarousel images={getCarouselImages()} fallback={cultureImg} />
            {isEditMode && (
              <div className="bg-amber-50/95 backdrop-blur-md border-t border-amber-200 p-6 sm:p-8 flex flex-col gap-5 animate-[fade-in_0.4s]">
                <div className="flex items-center gap-2 pb-3 border-b border-amber-200/60">
                  <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 grid place-items-center shrink-0 shadow-sm">
                    <Camera className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-amber-950 tracking-tight">Dispensary Slideshow Catalog</h4>
                    <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Manage visual headers</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {images.map((img: any) => (
                    <div key={img.id} className="relative group rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 border-2 border-slate-200/40 shadow-sm hover:shadow duration-300">
                      <img src={img.url} className="w-full h-full object-cover" />
                      <button
                        onClick={() => handleDeleteImage(img.id)}
                        className="absolute inset-0 bg-rose-950/85 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1 font-black text-xs uppercase tracking-widest cursor-pointer"
                      >
                        <Trash2 className="w-4.5 h-4.5" /> Delete
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mt-2">
                  <input
                    placeholder="Drop clinic URL code..."
                    className="flex-1 border border-amber-200 rounded-xl px-4 py-3.5 text-sm font-bold bg-white outline-none shadow-inner"
                    onKeyDown={async (e: any) => {
                      if (e.key === "Enter" && e.target.value.trim()) {
                        await handleAddImage(e.target.value);
                        e.target.value = "";
                      }
                    }}
                  />
                  <span className="text-[10px] text-amber-700 font-bold bg-amber-100 px-3 py-2 rounded-xl self-start sm:self-center shadow-sm">Hit Enter to Stage</span>
                </div>
              </div>
            )}
          </div>

          {/* ==========================================
              🩺 TAB 1: DOCTORS & OFFICERS
             ========================================== */}
          {tab === "Doctors" && (
            <div className="space-y-10 animate-[fade-in_0.5s_ease-out]">
              
              {/* HOD CARD */}
              <Card 
                title="Medical Directorate In-Charge" 
                icon={User}
                className={isEditMode ? "ring-4 ring-amber-500/10 border-amber-200 bg-amber-50/10" : ""}
              >              {isEditMode ? (
                <AdminPanel>
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-24 h-24 bg-slate-100 border-2 border-amber-200 rounded-2xl overflow-hidden relative group shadow-sm shrink-0">
                      <img src={editInfo.img || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250"} className="w-full h-full object-cover" />
                      <input
                        placeholder="Photo URL"
                        value={editInfo.img}
                        onChange={(e) => setEditInfo({...editInfo, img: e.target.value})}
                        className="absolute inset-0 opacity-0 bg-amber-950/80 focus:opacity-100 group-hover:opacity-100 outline-none text-white text-[9px] font-black p-2 text-center cursor-pointer transition"
                      />
                    </div>
                    <div className="flex-1 space-y-3 w-full">
                      <AdminField label="Director Name">
                        <AdminInput value={editInfo.hodName} onChange={(e) => setEditInfo({...editInfo, hodName: e.target.value})} placeholder="e.g. Dr. K. Ramesh" />
                      </AdminField>
                      <AdminField label="Notice / Message">
                        <AdminTextarea value={editInfo.message} onChange={(e) => setEditInfo({...editInfo, message: e.target.value})} rows={3} placeholder="Desk notice message…" />
                      </AdminField>
                      <div className="flex justify-end">
                        <AdminSaveButton onClick={handleSaveInfo} label="Save Profile" />
                      </div>
                    </div>
                  </div>
                </AdminPanel>
              ) : (
                  <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                    <img
                      src={data?.info?.img || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250"}
                      onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250"; }}
                      className="w-28 h-28 rounded-[32px] object-cover border-2 border-slate-100 shadow shrink-0 transition duration-500 hover:scale-[1.03]"
                      alt={data?.info?.hodName || "Medical Officer"}
                    />
                    <div>
                      <h4 className="font-display font-black text-2xl text-slate-900 tracking-tight mb-1 leading-none">{data?.info?.hodName || "Medical Officer"}</h4>
                      <div className="inline-flex bg-indigo-50 border border-indigo-100 text-[oklch(0.42_0.18_265)] font-black text-[10.5px] tracking-widest uppercase px-3.5 py-1 rounded-lg shadow-sm mb-3">Supervising Superintendent</div>
                      <p className="text-[15px] text-slate-600 leading-relaxed font-medium italic bg-slate-50 border p-5 rounded-2xl shadow-inner">
                        "{data?.info?.message || "Advancing immediate clinical alignments and student diagnostics."}"
                      </p>
                    </div>
                  </div>
                )}
              </Card>

              {/* DOCTOR REGISTRY */}
              <Card 
                title="Physician & Medical Officers Desk" 
                subtitle="Authorized clinical care registry"
                icon={User}
                className={isEditMode ? "ring-2 ring-amber-300" : ""}
              >
                <PeopleRegistryEditable 
                  data={doctors} 
                  roleType="doctor" 
                  isEdit={isEditMode} 
                  onRefetch={() => router.invalidate()} 
                />
              </Card>
            </div>
          )}

          {/* ==========================================
              🏥 TAB 2: FACILITIES & MEDICINES
             ========================================== */}
          {tab === "Facilities" && (
            <div className="space-y-10 animate-[fade-in_0.5s_ease-out]">
              
              {/* AVAILABLE FACILITIES */}
              <Card 
                title="Clinical Facilities Stationed" 
                subtitle="Integrated medical assistance suites"
                icon={Sparkles}
                className={isEditMode ? "ring-2 ring-amber-300" : ""}
              >
                <MetaRegistryEditable 
                  data={facilities} 
                  category="facility" 
                  isEdit={isEditMode} 
                  onRefetch={() => router.invalidate()} 
                />
              </Card>

              {/* MEDICINES LIST */}
              <Card 
                title="Core Medicine Inventory Logs" 
                subtitle="Campus dispensary basic stock list"
                icon={Coffee}
                className={isEditMode ? "ring-2 ring-amber-300" : ""}
              >
                <MetaRegistryEditable 
                  data={medicines} 
                  category="medicine" 
                  isEdit={isEditMode} 
                  onRefetch={() => router.invalidate()} 
                />
              </Card>
            </div>
          )}

          {/* ==========================================
              🚑 TAB 3: SUPPORTING STAFF
             ========================================== */}
          {tab === "Supporting Staff" && (
            <div className="space-y-10 animate-[fade-in_0.5s_ease-out]">
              
              {/* MEDICAL SUPPORTING STAFF */}
              <Card 
                title="Para-Clinical Supporting Team" 
                subtitle="Nursing officers and compounder staff desk"
                icon={User}
                className={isEditMode ? "ring-2 ring-amber-300" : ""}
              >
                <PeopleRegistryEditable 
                  data={staff} 
                  roleType="staff" 
                  isEdit={isEditMode} 
                  onRefetch={() => router.invalidate()} 
                />
              </Card>

              {/* AMBULANCE LOGS */}
              <Card 
                title="Emergency Ambulance Grid" 
                subtitle="🚨 On-call 24/7 vehicle drivers dispatch"
                icon={Activity}
                className={isEditMode ? "ring-2 ring-amber-300" : ""}
              >
                <PeopleRegistryEditable 
                  data={drivers} 
                  roleType="driver" 
                  isEdit={isEditMode} 
                  onRefetch={() => router.invalidate()} 
                />
              </Card>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/* ---------- SHARED WIDGET COMPONENTS ---------- */

function Card({ title, subtitle, icon: Icon, children, className = "" }: any) {
  return (
    <div className={`bg-white rounded-[32px] border border-slate-200/60 p-6 md:p-8 hover:shadow-lg transition duration-500 shadow-sm overflow-hidden w-full ${className}`}>
      {title && (
        <div className="flex items-center gap-3.5 mb-6 md:mb-8 pb-5 border-b border-slate-100">
          <div className="w-12 h-12 rounded-[20px] bg-slate-50 border border-slate-200/60 text-[oklch(0.42_0.18_265)] grid place-items-center shrink-0 shadow-sm">
            {Icon && <Icon className="w-5.5 h-5.5" />}
          </div>
          <div>
            <h3 className="font-display font-black text-xl text-slate-900 tracking-tight leading-none">{title}</h3>
            {subtitle && <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-1.5">{subtitle}</p>}
          </div>
        </div>
      )}
      <div className="w-full">{children}</div>
    </div>
  );
}

function ImageCarousel({ images, fallback }: any) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay || !images || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [autoplay, images]);

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-[21/9] md:aspect-[16/6] min-h-[180px] md:min-h-[240px] max-h-[280px] md:max-h-[340px] w-full bg-slate-200 flex items-center justify-center overflow-hidden">
        <img src={fallback} className="w-full h-full object-cover opacity-90" alt="Fallback" />
      </div>
    );
  }

  return (
    <div 
      className="relative aspect-[21/9] md:aspect-[16/6] min-h-[180px] md:min-h-[240px] max-h-[280px] md:max-h-[340px] w-full bg-slate-900 overflow-hidden group"
      onMouseEnter={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
    >
      <div className="w-full h-full relative">
        {images.map((img: string, i: number) => (
          <img
            key={i}
            src={img}
            alt={`Slide view ${i + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${currentIndex === i ? "opacity-100 z-10" : "opacity-0 z-0"}`}
            onError={(e) => { e.currentTarget.src = fallback; }}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent z-20" />
      {images.length > 1 && (
        <>
          <button onClick={() => setCurrentIndex((p) => (p - 1 + images.length) % images.length)} className="absolute left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 text-white hover:bg-white hover:text-black opacity-0 group-hover:opacity-100 backdrop-blur-sm shadow cursor-pointer z-30 text-center grid place-items-center transition">‹</button>
          <button onClick={() => setCurrentIndex((p) => (p + 1) % images.length)} className="absolute right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 text-white hover:bg-white hover:text-black opacity-0 group-hover:opacity-100 backdrop-blur-sm shadow cursor-pointer z-30 text-center grid place-items-center transition">›</button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 bg-black/10 px-3 py-1 rounded-full z-30">
            {images.map((_: any, idx: number)=>(
              <button key={idx} onClick={()=>setCurrentIndex(idx)} className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${currentIndex === idx ? "w-5 bg-white" : "w-1.5 bg-white/40"}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- DYNAMIC DATA RENDERERS ---------- */

function PeopleRegistryEditable({ data, roleType, isEdit, onRefetch }: any) {
  const [form, setForm] = useState({ name: "", qualification: "", workingHours: "", contact: "", img: "" });

  async function handleAdd() {
    if (!form.name.trim()) return;
    const tId = toast.loading("Enrolling medical officer...");
    try {
      await createPerson({ data: { roleType, ...form } });
      toast.success("Officer enrolled!", { id: tId });
      setForm({ name: "", qualification: "", workingHours: "", contact: "", img: "" });
      onRefetch();
    } catch {
      toast.error("Database reject.", { id: tId });
    }
  }

  async function handleDelete(id: number) {
    const tId = toast.loading("Revoking clinical clearing...");
    try {
      await deletePerson({ data: { id } });
      toast.success("Purged!", { id: tId });
      onRefetch();
    } catch {
      toast.error("Failed.", { id: tId });
    }
  }

  return (
    <div className="space-y-6 w-full">
      {isEdit && (
        <div className="bg-amber-50/80 border-2 border-amber-200 p-5 rounded-[24px] shadow-inner animate-[fade-in_0.3s] space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-[9px] font-black uppercase text-amber-800">Officer Name</label>
              <input value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} className="w-full border bg-white p-2 rounded text-xs font-bold" />
            </div>
            <div>
              <label className="text-[9px] font-black uppercase text-amber-800">Qualification Station</label>
              <input value={form.qualification} onChange={(e)=>setForm({...form, qualification:e.target.value})} className="w-full border bg-white p-2 rounded text-xs font-bold" />
            </div>
            <div>
              <label className="text-[9px] font-black uppercase text-amber-800">Active Shift Hours</label>
              <input value={form.workingHours} onChange={(e)=>setForm({...form, workingHours:e.target.value})} className="w-full border bg-white p-2 rounded text-xs font-bold" />
            </div>
            <div>
              <label className="text-[9px] font-black uppercase text-amber-800">Direct Dial No.</label>
              <input value={form.contact} onChange={(e)=>setForm({...form, contact:e.target.value})} className="w-full border bg-white p-2 rounded text-xs font-bold" />
            </div>
          </div>
          <div className="flex justify-end pt-2 border-t border-amber-200/50">
            <button onClick={handleAdd} className="bg-slate-950 hover:bg-amber-600 text-white font-black py-3 px-6 rounded-xl text-xs uppercase shadow flex gap-2 cursor-pointer transition active:scale-95"><Plus className="w-4 h-4"/> Enroll Officer</button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto border border-slate-200/60 rounded-[24px]">
        <table className="w-full border-collapse text-left font-bold text-[14px] text-slate-850">
          <thead>
            <tr className="bg-slate-50 border-b text-slate-400 text-[10px] font-black uppercase tracking-wider">
              <th className="py-3.5 px-4">Medical Officer</th>
              <th className="py-3.5 px-4">Degrees / Ranks</th>
              <th className="py-3.5 px-4">Active Shifts</th>
              <th className="py-3.5 px-4">Contact</th>
              {isEdit && <th className="py-3.5 px-4 text-center w-12">Del</th>}
            </tr>
          </thead>
          <tbody className="divide-y text-slate-800">
            {data.length === 0 ? (
              <tr><td colSpan={5} className="py-8 text-center font-medium italic text-slate-400">No clearing registers logged.</td></tr>
            ) : (
              data.map((p: any, idx: number)=>(
                <tr key={p.id || idx} className="hover:bg-slate-50/40 transition">
                  <td className="py-3.5 px-4 font-extrabold text-slate-950">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                        {p.img ? <img src={p.img} className="w-full h-full object-cover" /> : <div className="text-[11px] font-black text-slate-400 uppercase">{p.name?.[0]}</div>}
                      </div>
                      {isEdit ? <InlineCellEdit val={p.name} onCommit={async (n)=>{ await updatePerson({data:{...p, name:n}}); onRefetch(); }} /> : <span className="truncate">{p.name}</span>}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-600">
                    {isEdit ? <InlineCellEdit val={p.qualification || ""} onCommit={async (n)=>{ await updatePerson({data:{...p, qualification:n}}); onRefetch(); }} /> : <span className="inline-flex bg-slate-100 border px-2 py-0.5 rounded text-[11px] uppercase tracking-wider font-black">{p.qualification || "N/A"}</span>}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {isEdit ? <InlineCellEdit val={p.workingHours || ""} onCommit={async (n)=>{ await updatePerson({data:{...p, workingHours:n}}); onRefetch(); }} /> : <span>{p.workingHours || "General"}</span>}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    {isEdit ? (
                      <InlineCellEdit val={p.contact || ""} onCommit={async (n)=>{ await updatePerson({data:{...p, contact:n}}); onRefetch(); }} />
                    ) : p.contact ? (
                      <a href={`tel:${p.contact}`} className="inline-flex items-center gap-1.5 font-black text-[oklch(0.42_0.18_265)] bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-100 shadow-sm hover:bg-indigo-100 transition text-[12px]">
                        <Phone className="w-3 h-3" /> {p.contact}
                      </a>
                    ) : <span className="text-slate-300 italic font-medium">[Null]</span>}
                  </td>
                  {isEdit && (
                    <td className="py-3.5 px-4 text-center">
                      <button onClick={()=>handleDelete(p.id)} className="w-8 h-8 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl inline-grid place-items-center transition active:scale-90 cursor-pointer"><Trash2 className="w-4 h-4"/></button>
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

function MetaRegistryEditable({ data, category, isEdit, onRefetch }: any) {
  const [newEntry, setNewEntry] = useState("");

  async function handleAdd() {
    if (!newEntry.trim()) return;
    const tId = toast.loading("Logging health ledger node...");
    try {
      await createMeta({ data: { category, name: newEntry.trim() } });
      toast.success("Logged!", { id: tId });
      setNewEntry("");
      onRefetch();
    } catch {
      toast.error("Failed.", { id: tId });
    }
  }

  async function handleDelete(id: number) {
    const tId = toast.loading("Purging clinic records...");
    try {
      await deleteMeta({ data: { id } });
      toast.success("Cleared!", { id: tId });
      onRefetch();
    } catch {
      toast.error("Fail.", { id: tId });
    }
  }

  return (
    <div className="space-y-6 w-full">
      {isEdit && (
        <div className="flex gap-2.5 max-w-lg bg-amber-50/80 border-2 border-amber-200 rounded-[20px] p-3 shadow-inner animate-[fade-in_0.3s]">
          <input type="text" value={newEntry} onChange={(e)=>setNewEntry(e.target.value)} onKeyDown={(e)=>e.key==="Enter" && handleAdd()} placeholder={category === "facility" ? "e.g. First-Aid triage unit..." : "e.g. Ibuprofen basic... "} className="flex-1 border-2 bg-white border-amber-200 px-4 py-2.5 rounded-xl outline-none text-sm font-bold focus:border-amber-500" />
          <button onClick={handleAdd} className="bg-slate-950 hover:bg-amber-600 text-white font-black px-6 py-2.5 rounded-xl text-xs uppercase cursor-pointer transition active:scale-95">Log</button>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
        {data.length === 0 ? (
          <p className="italic text-slate-400 text-sm pt-1 font-medium col-span-3">No registered dispensary specs found.</p>
        ) : (
          data.map((item: any, idx: number)=>(
            <div key={item.id || idx} className={`flex items-center justify-between border rounded-[20px] p-4.5 transition duration-500 ${isEdit ? "bg-amber-50/40 border-amber-200 shadow-sm" : "bg-slate-50/80 border-slate-100 hover:bg-white hover:border-slate-200 hover:shadow group"}`}>
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={`w-9 h-9 rounded-[14px] flex items-center justify-center shadow-sm shrink-0 ${isEdit ? "bg-amber-100 text-amber-700" : category === "facility" ? "bg-white text-emerald-600 border border-slate-200/60" : "bg-white text-[oklch(0.42_0.18_265)] border border-slate-200/60"}`}>
                  {category === "facility" ? <Activity className="w-4.5 h-4.5" /> : <ShieldAlert className="w-4.5 h-4.5" />}
                </div>
                {isEdit ? (
                  <InlineCellEdit val={item.name} onCommit={async (n)=>{ await updateMeta({data:{...item, name:n}}); onRefetch(); }} />
                ) : (
                  <span className="text-[14.5px] font-extrabold text-slate-800 truncate leading-none">{item.name}</span>
                )}
              </div>
              {isEdit && (
                <button onClick={()=>handleDelete(item.id)} className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 hover:bg-rose-600 hover:text-white flex items-center justify-center shrink-0 ml-2 cursor-pointer transition active:scale-90 shadow-sm"><X className="w-3.5 h-3.5"/></button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* --- MICRO INTERACTIVE CELL EDIT TRIGGER --- */

function InlineCellEdit({ val, onCommit }: { val: string; onCommit: (n: string) => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  const [localVal, setLocalVal] = useState(val);

  async function commit() {
    setEditing(false);
    if (localVal.trim() !== val) {
      const tId = toast.loading("Synchronizing clinical registry...");
      try {
        await onCommit(localVal.trim());
        toast.success("Synced!", { id: tId });
      } catch {
        toast.error("Failure.", { id: tId });
      }
    }
  }

  if (editing) {
    return (
      <input
        autoFocus
        value={localVal}
        onChange={(e) => setLocalVal(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => e.key === "Enter" && commit()}
        className="border-2 border-amber-400 bg-white text-xs font-bold px-2 py-1 rounded w-full text-amber-950 outline-none shadow-inner"
      />
    );
  }

  return (
    <span onClick={() => setEditing(true)} className="border-b border-dashed border-amber-400 hover:bg-amber-100/50 px-1 cursor-pointer flex-1 break-words text-left leading-tight">
      {val || <span className="text-slate-300 italic font-medium">[Empty]</span>}
    </span>
  );
}

export default DispensaryPage;
