import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { CAMPUS_LIFE_SUBNAV } from "@/lib/site";
import { getMusicClubData } from "@/funcs/music.server";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import {
  updateMusicContent,
  createMusicPerson,
  updateMusicPerson,
  deleteMusicPerson,
  createMusicEquipment,
  updateMusicEquipment,
  deleteMusicEquipment,
  createMusicMember,
  updateMusicMember,
  deleteMusicMember,
  createMusicImage,
  deleteMusicImage,
} from "@/funcs/music.admin.server";
import cultureImg from "@/assets/culture.jpeg";
import { 
  Building, 
  Sparkles, 
  User, 
  Activity, 
  Music,
  Lock,
  Save,
  Camera,
  Trash2,
  Plus,
  X,
  CheckCircle2,
  HelpCircle,
  Coins
} from "lucide-react";

export const Route = createFileRoute("/campus-life/music-club")({
  loader: async () => await getMusicClubData(),
  component: MusicClubPage,
});

function MusicClubPage() {
  const data = Route.useLoaderData() as any;
  const router = useRouter();
  const { isEditMode } = useAdmin();

  const [tab, setTab] = useState("Overview");

  const content = data?.content || {};
  const faculty = data?.facultyCoordinator || {};
  const students = data?.studentCoordinators || [];
  const equipment = data?.equipment || [];
  const members = data?.members || [];
  const images = data?.images || [];

  const getCarouselImages = () => images.map((i: any) => i.url);

  // --- CMS CORE STATE ---
  const [editCore, setEditCore] = useState({
    id: content?.id,
    title: content?.title || "",
    subtitle: content?.subtitle || "",
    message: content?.message || "",
    objectives: content?.objectives || "",
    process: content?.process || "",
  });

  const [editFaculty, setEditFaculty] = useState({
    id: faculty?.id,
    name: faculty?.name || "",
    designation: faculty?.designation || "",
    img: faculty?.img || "",
  });

  useEffect(() => {
    if (content) {
      setEditCore({
        id: content.id,
        title: content.title || "Music Club",
        subtitle: content.subtitle || "Campus music activities and cultural performances",
        message: content.message || "",
        objectives: content.objectives || "",
        process: content.process || "",
      });
    }
    if (faculty) {
      setEditFaculty({
        id: faculty.id,
        name: faculty.name || "",
        designation: faculty.designation || "Club Coordinator",
        img: faculty.img || "",
      });
    }
  }, [content, faculty]);

  // --- CMS CORE HANDLERS ---
  async function handleSaveCore() {
    const tId = toast.loading("Syncing core performance parameters...");
    try {
      await updateMusicContent({ data: editCore });
      toast.success("Metadata synchronized!", { id: tId });
      router.invalidate();
    } catch {
      toast.error("Failed.", { id: tId });
    }
  }

  async function handleSaveFaculty() {
    const tId = toast.loading("Updating coordinator profile...");
    try {
      if (faculty?.id) {
        await updateMusicPerson({ data: { ...editFaculty, roleType: "faculty" } });
      } else {
        await createMusicPerson({ data: { ...editFaculty, roleType: "faculty" } });
      }
      toast.success("Coordinator aligned!", { id: tId });
      router.invalidate();
    } catch {
      toast.error("Sync fail.", { id: tId });
    }
  }

  async function handleAddImage(url: string) {
    if (!url.trim()) return;
    const tId = toast.loading("Linking picture...");
    try {
      await createMusicImage({ data: { url } });
      toast.success("Slide enrolled!", { id: tId });
      router.invalidate();
    } catch {
      toast.error("Fail.", { id: tId });
    }
  }

  async function handleDeleteImage(id: number) {
    const tId = toast.loading("Purging slide...");
    try {
      await deleteMusicImage({ data: { id } });
      toast.success("Erased!", { id: tId });
      router.invalidate();
    } catch {
      toast.error("Fail.", { id: tId });
    }
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 text-slate-800 pb-24">
      {isEditMode && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-white font-black py-3 px-6 sticky top-0 z-[100] shadow-xl flex items-center justify-center gap-2.5 border-b border-amber-700/30 animate-[fade-in_0.3s] backdrop-blur-md text-xs uppercase tracking-widest">
          <Lock className="w-3.5 h-3.5 animate-pulse text-amber-950" />
          <span>Music Club Directorate Live CMS</span>
          <div className="hidden md:block h-1 w-1 rounded-full bg-amber-950" />
          <span className="hidden md:block text-amber-100 normal-case italic font-medium">Direct inline updates synchronized safely to repository tables.</span>
        </div>
      )}

      <PageHero
        title={content?.title || "Music Club"}
        subtitle={content?.subtitle || "Developing exceptional rhythmic coordination and active orchestration legacy."}
        image={images[0]?.url || cultureImg}
      />
      <SubNav items={CAMPUS_LIFE_SUBNAV} />

      <section className="container-narrow py-12 md:py-16 px-4 sm:px-6 max-w-full overflow-x-hidden">
        
        {/* NAVIGATION SWITCHER */}
        <div className="w-full flex justify-center mb-12 md:mb-16">
          <div className="flex items-center gap-2 p-1.5 bg-slate-200/60 backdrop-blur-sm rounded-[24px] overflow-x-auto no-scrollbar max-w-full pb-1.5 md:pb-1.5">
            <TabBtn label="Overview" active={tab === "Overview"} onClick={() => setTab("Overview")} icon={Sparkles} />
            <TabBtn label="Equipment Available" active={tab === "Equipment Available"} onClick={() => setTab("Equipment Available")} icon={Music} />
            <TabBtn label="Active Club Members" active={tab === "Club Members"} onClick={() => setTab("Club Members")} icon={User} />
          </div>
        </div>

        <div className="space-y-10 max-w-5xl mx-auto animate-[fade-in_0.5s_ease-out]">
          
          {/* IMAGES LEDGER CAROUSEL */}
          <div className="relative w-full max-w-full overflow-hidden rounded-[32px] shadow-md border border-slate-200/60 bg-slate-200">
            <ImageCarousel images={getCarouselImages()} fallback={cultureImg} />
            {isEditMode && (
              <div className="bg-amber-50/95 backdrop-blur-md border-t border-amber-200 p-6 sm:p-8 flex flex-col gap-5 animate-[fade-in_0.4s]">
                <div className="flex items-center gap-2 pb-3 border-b border-amber-200/60">
                  <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 grid place-items-center shrink-0 shadow-sm">
                    <Camera className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-amber-950 tracking-tight">Music Club Visual Vault</h4>
                    <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Manage carousel slides</p>
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
                        <Trash2 className="w-4.5 h-4.5" /> Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mt-2">
                  <input
                    placeholder="Drop performance picture URL..."
                    className="flex-1 border border-amber-200 rounded-xl px-4 py-3.5 text-sm font-bold bg-white outline-none shadow-inner"
                    onKeyDown={async (e: any) => {
                      if (e.key === "Enter" && e.target.value.trim()) {
                        await handleAddImage(e.target.value);
                        e.target.value = "";
                      }
                    }}
                  />
                  <span className="text-[10px] text-amber-700 font-bold bg-amber-100 px-3 py-2 rounded-xl self-start sm:self-center shadow-sm">Enter to Slide</span>
                </div>
              </div>
            )}
          </div>

          {/* ==========================================
              💡 TAB 1: OVERVIEW
             ========================================== */}
          {tab === "Overview" && (
            <div className="space-y-10 animate-[fade-in_0.5s_ease-out]">
              
              {/* FACULTY COORDINATOR */}
              <Card 
                title="Club In-Charge Desk" 
                icon={User}
                className={isEditMode ? "ring-4 ring-amber-500/10 border-amber-200 bg-amber-50/10" : ""}
              >
                {isEditMode ? (
                  <div className="flex flex-col sm:flex-row gap-8 items-start animate-[fade-in_0.3s]">
                    <div className="w-28 h-28 bg-slate-100 border-2 border-amber-200 rounded-[28px] overflow-hidden relative group shadow-sm">
                      <img src={editFaculty.img || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=250"} className="w-full h-full object-cover" />
                      <input 
                        placeholder="URL"
                        value={editFaculty.img}
                        onChange={(e)=>setEditFaculty({...editFaculty, img:e.target.value})}
                        className="absolute inset-0 opacity-0 bg-amber-950/80 focus:opacity-100 group-hover:opacity-100 text-white text-[9px] font-black p-2 text-center cursor-pointer transition"
                      />
                    </div>
                    <div className="flex-1 space-y-4 w-full">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[9px] font-black text-amber-800 uppercase">Faculty Name</label>
                          <input value={editFaculty.name} onChange={(e)=>setEditFaculty({...editFaculty, name:e.target.value})} className="w-full border bg-white text-xs font-bold p-2.5 rounded-xl" />
                        </div>
                        <div>
                          <label className="text-[9px] font-black text-amber-800 uppercase">Designation Ranks</label>
                          <input value={editFaculty.designation} onChange={(e)=>setEditFaculty({...editFaculty, designation:e.target.value})} className="w-full border bg-white text-xs font-bold p-2.5 rounded-xl" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-amber-800 uppercase">Inspirational Quote Header</label>
                        <input value={editCore.message} onChange={(e)=>setEditCore({...editCore, message:e.target.value})} className="w-full border bg-white text-xs font-bold p-2.5 rounded-xl" placeholder="Music gives soul to universe..." />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button onClick={handleSaveFaculty} className="bg-amber-500 text-amber-950 font-black px-5 py-2.5 rounded-xl text-xs uppercase active:scale-95 cursor-pointer shadow transition flex gap-2 items-center"><Save className="w-4 h-4"/> Align Incharge</button>
                        <button onClick={handleSaveCore} className="bg-slate-950 text-white font-black px-5 py-2.5 rounded-xl text-xs uppercase active:scale-95 cursor-pointer shadow transition flex gap-2 items-center"><Save className="w-4 h-4"/> Save Quote</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                    <img
                      src={faculty?.img || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=250"}
                      onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=250"; }}
                      className="w-24 h-24 md:w-28 md:h-28 rounded-[28px] object-cover border-2 border-slate-100 shadow shrink-0 duration-500 hover:scale-105"
                      alt={faculty?.name || "Coordinator"}
                    />
                    <div>
                      <h4 className="font-display font-black text-2xl text-slate-900 tracking-tight mb-1 leading-none">{faculty?.name || "Music Coordinator"}</h4>
                      <div className="inline-flex bg-indigo-50 border border-indigo-100 text-[oklch(0.42_0.18_265)] font-black text-[10.5px] tracking-widest uppercase px-3.5 py-1 rounded-lg shadow-sm mb-3">Club Faculty Director</div>
                      <p className="text-[15px] text-slate-600 leading-relaxed font-medium italic bg-slate-50 border p-5 rounded-2xl shadow-inner">
                        "{content?.message || "Music aligns structural coordination and allows collaborative acoustics to scale."}"
                      </p>
                    </div>
                  </div>
                )}
              </Card>

              {/* OBJECTIVES & JOINING */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card 
                  title="Core Objectives" 
                  icon={Sparkles}
                  className={isEditMode ? "ring-4 ring-amber-500/10 border-amber-200 bg-amber-50/10" : ""}
                >
                  {isEditMode ? (
                    <div className="space-y-3 animate-[fade-in_0.3s]">
                      <textarea value={editCore.objectives} onChange={(e)=>setEditCore({...editCore, objectives:e.target.value})} className="w-full h-28 border rounded-xl p-3 text-xs font-medium bg-white" />
                      <button onClick={handleSaveCore} className="w-full bg-amber-500 text-amber-950 font-black text-xs py-2.5 rounded-xl uppercase cursor-pointer transition"><Save className="w-3.5 h-3.5 inline mr-1"/> Sync Objectives</button>
                    </div>
                  ) : (
                    <p className="text-[15px] text-slate-600 font-medium leading-relaxed italic">"{content?.objectives || "Delivering dynamic platforms for active acoustic practice sessions."}"</p>
                  )}
                </Card>

                <Card 
                  title="How to Enroll" 
                  icon={HelpCircle}
                  className={isEditMode ? "ring-4 ring-amber-500/10 border-amber-200 bg-amber-50/10" : ""}
                >
                  {isEditMode ? (
                    <div className="space-y-3 animate-[fade-in_0.3s]">
                      <textarea value={editCore.process} onChange={(e)=>setEditCore({...editCore, process:e.target.value})} className="w-full h-28 border rounded-xl p-3 text-xs font-medium bg-white" />
                      <button onClick={handleSaveCore} className="w-full bg-amber-500 text-amber-950 font-black text-xs py-2.5 rounded-xl uppercase cursor-pointer transition"><Save className="w-3.5 h-3.5 inline mr-1"/> Sync Process</button>
                    </div>
                  ) : (
                    <p className="text-[15px] text-slate-600 font-medium leading-relaxed">"{content?.process || "Contact authorized student representatives during orientation cycles."}"</p>
                  )}
                </Card>
              </div>

              {/* STUDENT COORDINATORS */}
              <Card 
                title="Student Orchestrators" 
                subtitle="Active student operational lead representatives"
                icon={User}
                className={isEditMode ? "ring-2 ring-amber-300" : ""}
              >
                <StudentRosterEditable 
                  data={students} 
                  isEdit={isEditMode} 
                  onRefetch={()=>router.invalidate()} 
                />
              </Card>
            </div>
          )}

          {/* ==========================================
              🎵 TAB 2: EQUIPMENT AVAILABLE
             ========================================== */}
          {tab === "Equipment Available" && (
            <div className="animate-[fade-in_0.5s_ease-out]">
              <Card 
                title="Instruments & Amplification Tech" 
                subtitle="Current dynamic studio gear records"
                icon={Music}
                className={isEditMode ? "ring-2 ring-amber-300" : ""}
              >
                <EquipmentRegistryEditable 
                  data={equipment} 
                  isEdit={isEditMode} 
                  onRefetch={()=>router.invalidate()} 
                />
              </Card>
            </div>
          )}

          {/* ==========================================
              🎤 TAB 3: ACTIVE MEMBERS
             ========================================== */}
          {tab === "Club Members" && (
            <div className="animate-[fade-in_0.5s_ease-out]">
              <Card 
                title="Registered Musicians Registry" 
                subtitle="Authorized instrument and vocalist line-up"
                icon={User}
                className={isEditMode ? "ring-2 ring-amber-300" : ""}
              >
                <MembersRegistryEditable 
                  data={members} 
                  isEdit={isEditMode} 
                  onRefetch={()=>router.invalidate()} 
                />
              </Card>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/* ---------- COMMON WIDGET HELPERS ---------- */

function TabBtn({ label, active, onClick, icon: Icon }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 px-6 py-3.5 rounded-[18px] font-bold text-sm transition duration-500 shrink-0 active:scale-95 border shadow-sm cursor-pointer ${
        active
          ? "bg-[oklch(0.42_0.18_265)] text-white border-transparent shadow-md"
          : "bg-white border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50"
      }`}
    >
      {Icon && <Icon className="w-4.5 h-4.5 shrink-0" />}
      <span>{label}</span>
    </button>
  );
}

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

/* ---------- EDITABLE DATABOUND VIEWS ---------- */

function StudentRosterEditable({ data, isEdit, onRefetch }: any) {
  const [form, setForm] = useState({ name: "", gender: "", branch: "" });

  async function handleAdd() {
    if (!form.name.trim()) return;
    const tId = toast.loading("Enrolling orchestrator lead...");
    try {
      await createMusicPerson({ data: { roleType: "student", ...form } });
      toast.success("Orchestrator loaded!", { id: tId });
      setForm({ name: "", gender: "", branch: "" });
      onRefetch();
    } catch {
      toast.error("Fail.", { id: tId });
    }
  }

  async function handleDelete(id: number) {
    const tId = toast.loading("Purging orchestrator profile...");
    try {
      await deleteMusicPerson({ data: { id } });
      toast.success("Purged!", { id: tId });
      onRefetch();
    } catch {
      toast.error("Failed.", { id: tId });
    }
  }

  return (
    <div className="space-y-6 w-full">
      {isEdit && (
        <div className="bg-amber-50/80 border-2 border-amber-200 p-5 rounded-[24px] grid grid-cols-1 sm:grid-cols-4 gap-4 items-end shadow-inner animate-[fade-in_0.3s]">
          <div>
            <label className="text-[9px] font-black text-amber-800 uppercase">Lead Full Name</label>
            <input value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} className="w-full border bg-white p-2 text-xs font-bold rounded" />
          </div>
          <div>
            <label className="text-[9px] font-black text-amber-800 uppercase">Lead Gender</label>
            <input value={form.gender} onChange={(e)=>setForm({...form, gender:e.target.value})} className="w-full border bg-white p-2 text-xs font-bold rounded" placeholder="e.g. Male" />
          </div>
          <div>
            <label className="text-[9px] font-black text-amber-800 uppercase">Lead Branch / Stream</label>
            <input value={form.branch} onChange={(e)=>setForm({...form, branch:e.target.value})} className="w-full border bg-white p-2 text-xs font-bold rounded" placeholder="e.g. ECE" />
          </div>
          <button onClick={handleAdd} className="bg-slate-950 hover:bg-amber-600 text-white font-black py-3 rounded-lg text-xs uppercase cursor-pointer active:scale-95 transition flex gap-1 justify-center"><Plus className="w-3.5 h-3.5"/> Add Lead</button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {data.length === 0 ? (
          <p className="italic text-slate-400 text-sm col-span-2 font-medium">No registered student coordinators listed.</p>
        ) : (
          data.map((s: any, idx: number)=>(
            <div key={s.id || idx} className={`flex items-center justify-between border rounded-[24px] p-5 transition duration-500 ${isEdit ? "bg-amber-50/40 border-amber-200 shadow-sm" : "bg-slate-50/80 border-slate-100 hover:bg-white hover:border-slate-200 hover:shadow group"}`}>
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-[14px] bg-slate-100 border grid place-items-center font-black text-slate-500 uppercase text-xs shadow-sm group-hover:scale-105 transition duration-300 shrink-0">{s.name?.[0]}</div>
                <div className="flex flex-col min-w-0">
                  {isEdit ? <InlineCellEdit val={s.name} onCommit={async (n)=>{ await updateMusicPerson({data:{...s, name:n}}); onRefetch(); }} /> : <span className="text-[15px] font-black text-slate-900 truncate">{s.name}</span>}
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <span>{s.gender}</span> • {isEdit ? <InlineCellEdit val={s.branch} onCommit={async (n)=>{ await updateMusicPerson({data:{...s, branch:n}}); onRefetch(); }} /> : <span>{s.branch}</span>}
                  </div>
                </div>
              </div>
              {isEdit && (
                <button onClick={()=>handleDelete(s.id)} className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 hover:bg-rose-600 hover:text-white flex items-center justify-center shrink-0 transition active:scale-90 cursor-pointer"><X className="w-3.5 h-3.5"/></button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function EquipmentRegistryEditable({ data, isEdit, onRefetch }: any) {
  const [form, setForm] = useState({ item: "", cost: "" });

  async function handleAdd() {
    if (!form.item.trim()) return;
    const tId = toast.loading("Enrolling instrument...");
    try {
      await createMusicEquipment({ data: { ...form } });
      toast.success("Specs updated!", { id: tId });
      setForm({ item: "", cost: "" });
      onRefetch();
    } catch {
      toast.error("Fail.", { id: tId });
    }
  }

  async function handleDelete(id: number) {
    const tId = toast.loading("Removing entry...");
    try {
      await deleteMusicEquipment({ data: { id } });
      toast.success("Erased!", { id: tId });
      onRefetch();
    } catch {
      toast.error("Failed.", { id: tId });
    }
  }

  return (
    <div className="space-y-6 w-full">
      {isEdit && (
        <div className="bg-amber-50/80 border-2 border-amber-200 p-5 rounded-[24px] flex flex-col sm:flex-row gap-4 items-end shadow-inner animate-[fade-in_0.3s]">
          <div className="flex-1 w-full">
            <label className="text-[9px] font-black text-amber-800 uppercase">Instrument Specification</label>
            <input value={form.item} onChange={(e)=>setForm({...form, item:e.target.value})} className="w-full border bg-white p-2 text-xs font-bold rounded" placeholder="e.g. Electric Synthesizer Station..." />
          </div>
          <div className="w-full sm:w-44">
            <label className="text-[9px] font-black text-amber-800 uppercase">Resource Costing</label>
            <input value={form.cost} onChange={(e)=>setForm({...form, cost:e.target.value})} className="w-full border bg-white p-2 text-xs font-bold rounded" placeholder="e.g. Rs. 25,000" />
          </div>
          <button onClick={handleAdd} className="bg-slate-950 hover:bg-amber-600 text-white font-black py-3.5 px-6 rounded-xl text-xs uppercase cursor-pointer active:scale-95 transition shrink-0 flex gap-1 items-center justify-center w-full sm:w-auto"><Plus className="w-4 h-4"/> Log Asset</button>
        </div>
      )}

      <div className="overflow-x-auto no-scrollbar border border-slate-200/60 rounded-[24px]">
        <table className="w-full border-collapse text-left font-bold text-[14px] text-slate-850 min-w-[600px]">
          <thead>
            <tr className="bg-slate-50 border-b text-slate-400 text-[10px] font-black uppercase tracking-wider">
              <th className="py-4 px-6 w-16 text-center">Index</th>
              <th className="py-4 px-6">Instrument Unit Hardware</th>
              <th className="py-4 px-6">Ledger Value / Cost</th>
              {isEdit && <th className="py-4 px-6 text-center w-16">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y text-slate-800">
            {data.length === 0 ? (
              <tr><td colSpan={4} className="py-8 text-center font-medium italic text-slate-400">No instrument asset registers found.</td></tr>
            ) : (
              data.map((e: any, idx: number)=>(
                <tr key={e.id || idx} className="hover:bg-slate-50/40 transition duration-200">
                  <td className="py-4 px-6 text-center text-slate-400 font-black">{idx + 1}</td>
                  <td className="py-4 px-6 font-extrabold text-slate-900">
                    {isEdit ? <InlineCellEdit val={e.item} onCommit={async (n)=>{ await updateMusicEquipment({data:{...e, item:n}}); onRefetch(); }} /> : e.item}
                  </td>
                  <td className="py-4 px-6">
                    {isEdit ? (
                      <InlineCellEdit val={e.cost || ""} onCommit={async (n)=>{ await updateMusicEquipment({data:{...e, cost:n}}); onRefetch(); }} />
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-xl font-black text-[oklch(0.42_0.18_265)] text-xs shadow-sm">
                        <Coins className="w-3.5 h-3.5 text-[oklch(0.42_0.18_265)]/70"/>
                        <span>{e.cost || "Contributed"}</span>
                      </div>
                    )}
                  </td>
                  {isEdit && (
                    <td className="py-4 px-6 text-center">
                      <button onClick={()=>handleDelete(e.id)} className="w-8 h-8 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl inline-grid place-items-center transition cursor-pointer active:scale-90"><Trash2 className="w-4 h-4"/></button>
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

function MembersRegistryEditable({ data, isEdit, onRefetch }: any) {
  const [form, setForm] = useState({ name: "", instrument: "", branch: "", year: "" });

  async function handleAdd() {
    if (!form.name.trim()) return;
    const tId = toast.loading("Enrolling member registry...");
    try {
      await createMusicMember({ data: { ...form } });
      toast.success("Member cataloged!", { id: tId });
      setForm({ name: "", instrument: "", branch: "", year: "" });
      onRefetch();
    } catch {
      toast.error("Database error.", { id: tId });
    }
  }

  async function handleDelete(id: number) {
    const tId = toast.loading("Wiping member record...");
    try {
      await deleteMusicMember({ data: { id } });
      toast.success("Cleared!", { id: tId });
      onRefetch();
    } catch {
      toast.error("Failed.", { id: tId });
    }
  }

  return (
    <div className="space-y-6 w-full">
      {isEdit && (
        <div className="bg-amber-50/80 border-2 border-amber-200 p-5 rounded-[24px] shadow-inner animate-[fade-in_0.3s] space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-[9px] font-black text-amber-800 uppercase">Musician Name</label>
              <input value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} className="w-full border bg-white p-2 text-xs font-bold rounded" />
            </div>
            <div>
              <label className="text-[9px] font-black text-amber-800 uppercase">Performance Role / Gear</label>
              <input value={form.instrument} onChange={(e)=>setForm({...form, instrument:e.target.value})} className="w-full border bg-white p-2 text-xs font-bold rounded" placeholder="e.g. Vocalist / Violin" />
            </div>
            <div>
              <label className="text-[9px] font-black text-amber-800 uppercase">Academic Branch</label>
              <input value={form.branch} onChange={(e)=>setForm({...form, branch:e.target.value})} className="w-full border bg-white p-2 text-xs font-bold rounded" placeholder="e.g. CSE" />
            </div>
            <div>
              <label className="text-[9px] font-black text-amber-800 uppercase">Year Code</label>
              <input value={form.year} onChange={(e)=>setForm({...form, year:e.target.value})} className="w-full border bg-white p-2 text-xs font-bold rounded" placeholder="e.g. 3rd" />
            </div>
          </div>
          <div className="flex justify-end pt-2 border-t border-amber-200/50">
            <button onClick={handleAdd} className="bg-slate-950 hover:bg-amber-600 text-white font-black py-3 px-6 rounded-xl text-xs uppercase shadow flex gap-2 active:scale-95 cursor-pointer transition"><Plus className="w-4 h-4"/> Enroll Musician</button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto no-scrollbar border border-slate-200/60 rounded-[24px]">
        <table className="w-full border-collapse text-left font-bold text-[14px] text-slate-850 min-w-[750px]">
          <thead>
            <tr className="bg-slate-50 border-b text-slate-400 text-[10px] font-black uppercase tracking-wider">
              <th className="py-4 px-6 w-16 text-center">Index</th>
              <th className="py-4 px-6">Registered Student Name</th>
              <th className="py-4 px-6">Musical Profile / Spec</th>
              <th className="py-4 px-6">Academic Year & Branch</th>
              {isEdit && <th className="py-4 px-6 text-center w-16">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y text-slate-800">
            {data.length === 0 ? (
              <tr><td colSpan={5} className="py-8 text-center font-medium italic text-slate-400">No registered musicians logged in roster.</td></tr>
            ) : (
              data.map((m: any, idx: number)=>(
                <tr key={m.id || idx} className="hover:bg-slate-50/40 transition duration-200">
                  <td className="py-4 px-6 text-center text-slate-400 font-black">{idx + 1}</td>
                  <td className="py-4 px-6 font-extrabold text-slate-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-[oklch(0.42_0.18_265)] grid place-items-center font-black text-[10.5px] border border-indigo-100/40 uppercase shrink-0 shadow-sm">{m.name?.[0]}</div>
                    {isEdit ? <InlineCellEdit val={m.name} onCommit={async (n)=>{ await updateMusicMember({data:{...m, name:n}}); onRefetch(); }} /> : m.name}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    {isEdit ? <InlineCellEdit val={m.instrument || ""} onCommit={async (n)=>{ await updateMusicMember({data:{...m, instrument:n}}); onRefetch(); }} /> : <span className="inline-flex bg-slate-100 border px-2.5 py-0.5 rounded text-[11px] uppercase tracking-widest font-black">{m.instrument || "Band Member"}</span>}
                  </td>
                  <td className="py-4 px-6 text-slate-500 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    {isEdit ? <InlineCellEdit val={m.branch || ""} onCommit={async (n)=>{ await updateMusicMember({data:{...m, branch:n}}); onRefetch(); }} /> : <span>{m.branch}</span>}
                    <span>•</span>
                    {isEdit ? <InlineCellEdit val={m.year || ""} onCommit={async (n)=>{ await updateMusicMember({data:{...m, year:n}}); onRefetch(); }} /> : <span>{m.year} Year</span>}
                  </td>
                  {isEdit && (
                    <td className="py-4 px-6 text-center">
                      <button onClick={()=>handleDelete(m.id)} className="w-8 h-8 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl inline-grid place-items-center transition active:scale-90 cursor-pointer"><Trash2 className="w-4 h-4"/></button>
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

/* --- MICRO INLINE CELL EDIT COMPONENT --- */

function InlineCellEdit({ val, onCommit }: { val: string; onCommit: (n: string) => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  const [localVal, setLocalVal] = useState(val);

  async function commit() {
    setEditing(false);
    if (localVal.trim() !== val) {
      const tId = toast.loading("Synchronizing audio registers...");
      try {
        await onCommit(localVal.trim());
        toast.success("Synced!", { id: tId });
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
        onBlur={commit}
        onKeyDown={(e) => e.key === "Enter" && commit()}
        className="border-2 border-amber-400 bg-white text-xs font-bold px-2 py-1 rounded w-full text-amber-950 outline-none shadow-inner"
      />
    );
  }

  return (
    <span onClick={() => setEditing(true)} className="border-b border-dashed border-amber-400 hover:bg-amber-100/50 px-1 cursor-pointer leading-tight">
      {val || <span className="text-slate-300 italic font-medium">[Empty]</span>}
    </span>
  );
}

export default MusicClubPage;