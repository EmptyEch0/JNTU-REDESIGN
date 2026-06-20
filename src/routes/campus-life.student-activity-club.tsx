import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { CAMPUS_LIFE_SUBNAV } from "@/lib/site";
import { getStudentActivityData } from "@/funcs/studentactivity.server";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import {
  updateStudentClub,
  deleteStudentClub,
  createClubContent,
  updateClubContent,
  deleteClubContent,
  createClubImage,
  deleteClubImage,
} from "@/funcs/studentactivity.admin.server";
import cultureImg from "@/assets/culture.jpg";
import { 
  Building, 
  Sparkles, 
  User, 
  Trophy, 
  Activity, 
  ArrowRight,
  Music,
  Lock,
  Save,
  Camera,
  Trash2,
  Plus,
  X,
  ExternalLink,
  Settings
} from "lucide-react";
import { LocalSubNav } from "@/components/LocalSubNav";
import { getAssetUrl } from "@/lib/assets";
import { AdminUpload, AdminMultiUpload } from "@/components/AdminEditPanel";

export const Route = createFileRoute("/campus-life/student-activity-club")({
  loader: async () => await getStudentActivityData(),
  component: StudentActivityClubPage,
});

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200";

function StudentActivityClubPage() {
  const data = Route.useLoaderData() as any;
  const router = useRouter();
  const { isEditMode } = useAdmin();

  const [tab, setTab] = useState("Overview");
  const clubs = Array.isArray(data?.clubs) ? data.clubs : [];

  // Tab mappings
  const TABS = ["Overview", ...clubs.map((c: any) => c.name)];

  const getTabIcon = (t: string) => {
    if (t === "Overview") return Sparkles;
    if (t.toLowerCase().includes("music")) return Music;
    if (t.toLowerCase().includes("vykya")) return User;
    if (t.toLowerCase().includes("constelle")) return Trophy;
    return Activity;
  };

  const getCarouselImages = () => {
    if (tab === "Overview") {
      const heroImgs = clubs.map((c: any) => getAssetUrl(c.heroImage)).filter(Boolean);
      return heroImgs.length > 0 ? heroImgs : [DEFAULT_IMAGE];
    }
    const activeClub = clubs.find((c: any) => c.name === tab);
    const clubImgs = activeClub?.images?.map((img: any) => getAssetUrl(img.url)) || [];
    return clubImgs.length > 0 ? clubImgs : (activeClub?.heroImage ? [getAssetUrl(activeClub.heroImage)] : [DEFAULT_IMAGE]);
  };

  // --- ADDING A NEW CLUB TRIGGER ---
  const [newClubForm, setNewClubForm] = useState({ name: "", title: "", description: "", badge: "", heroImage: "" });
  async function handleCreateClub() {
    if (!newClubForm.name.trim() || !newClubForm.description.trim()) {
      return toast.error("Input Club Name and Base Description!");
    }
    const tId = toast.loading("Synthesizing active student club registry...");
    try {
      const generatedSlug = newClubForm.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      await updateStudentClub({ 
        data: { 
          ...newClubForm, 
          slug: generatedSlug || "new-club",
          category: "Student Club" 
        } 
      });
      toast.success("Student Club Launched!", { id: tId });
      setNewClubForm({ name: "", title: "", description: "", badge: "", heroImage: "" });
      router.invalidate();
    } catch {
      toast.error("Failure.", { id: tId });
    }
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 text-slate-800 pb-24">
      {isEditMode && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-white font-black py-3 px-6 sticky top-0 z-[100] shadow-xl flex items-center justify-center gap-2.5 border-b border-amber-700/30 animate-[fade-in_0.3s] backdrop-blur-md text-xs uppercase tracking-widest">
          <Lock className="w-3.5 h-3.5 animate-pulse text-amber-950" />
          <span>Student Activity Directorate CMS Live</span>
          <div className="hidden md:block h-1 w-1 rounded-full bg-amber-950" />
          <span className="hidden md:block text-amber-100 normal-case italic font-medium">Dynamic Club synthesis enabled. Adjust properties directly on screen.</span>
        </div>
      )}

      <PageHero 
        eyebrow="Student Directorate"
        title="Activity Clubs" 
        subtitle="Advancing leadership traits, campus tech networks, and extracurricular legacy rosters." 
        image={getAssetUrl(clubs?.[0]?.heroImage) || DEFAULT_IMAGE}
      />
      <SubNav items={CAMPUS_LIFE_SUBNAV} />

      <section className="container-narrow py-12 md:py-16 px-4 sm:px-6 max-w-full overflow-x-hidden">
        
        {/* DYNAMIC SYSTEM NAV - Premium consistent tabs */}
        <LocalSubNav
          activeTab={tab}
          setActiveTab={setTab}
          items={TABS.map((t) => ({ label: t, icon: getTabIcon(t) }))}
        />

        <div className="space-y-10 max-w-5xl mx-auto animate-[fade-in_0.5s_ease-out]">
          
          <div className="relative w-full max-w-full overflow-hidden rounded-[32px] shadow-md border border-slate-200/60 bg-slate-200">
            <ImageCarousel images={getCarouselImages()} fallback={DEFAULT_IMAGE} />
          </div>

          {/* ==========================================
              💡 TAB 1: OVERVIEW
             ========================================== */}
          {tab === "Overview" && (
            <div className="space-y-10 animate-[fade-in_0.5s_ease-out]">
              
              <Card title="Student Activity Clubs Overview" icon={Sparkles}>
                <p className="text-[15px] text-slate-600 font-medium leading-relaxed bg-slate-50/50 border p-6 rounded-3xl shadow-inner whitespace-pre-line">
                  Welcome to the central University Student Activity Portal. Our vibrant ecosystem of active, student-led initiatives supports continuous collaboration across departments.
                  
                  By staging large-scale tech meets, orchestral assemblies, and community leadership events, students establish deep professional networks and creative proficiency grids. Explore specific active rosters to find your community segment!
                </p>
              </Card>

              {/* DYNAMIC CLUB ROSTER GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {clubs.map((club: any) => (
                  <div 
                    key={club.id} 
                    onClick={() => setTab(club.name)} 
                    className="bg-white rounded-[32px] border border-slate-200/60 p-6 md:p-8 shadow-sm hover:shadow-lg transition duration-500 cursor-pointer group overflow-hidden relative"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full translate-x-8 -translate-y-8 transition duration-500 group-hover:scale-110 group-hover:bg-indigo-50/40" />
                    
                    <div className="relative z-10">
                      <span className="inline-flex items-center px-3 py-1 rounded-xl text-[9.5px] font-black tracking-widest uppercase bg-indigo-50 border border-indigo-100 text-indigo-700 mb-5 shadow-sm">
                        {club.category || "Student Club"}
                      </span>
                      <h4 className="font-display font-black text-xl text-slate-950 group-hover:text-[oklch(0.42_0.18_265)] transition-colors mb-3 tracking-tight leading-none">
                        {club.name}
                      </h4>
                      <p className="text-slate-500 text-[13px] font-medium leading-relaxed mb-6 line-clamp-3">
                        {club.description}
                      </p>
                      <div className="flex items-center gap-2 text-[oklch(0.42_0.18_265)] font-black text-xs uppercase tracking-wider">
                        <span>Explore Portal</span> 
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CMS: ADD A CLUB PORTAL */}
              {isEditMode && (
                <Card title="Launch A New Activity Club" icon={Plus} className="ring-4 ring-amber-500/10 border-amber-200 bg-amber-50/10">
                  <div className="space-y-4 animate-[fade-in_0.3s]">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[9px] font-black text-amber-800 uppercase">Club Badge Title</label>
                        <input value={newClubForm.name} onChange={(e)=>setNewClubForm({...newClubForm, name:e.target.value})} className="w-full border-2 border-amber-200 bg-white p-2.5 rounded-xl text-xs font-bold" placeholder="e.g. Constelle Club" />
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-amber-800 uppercase">Featured Display Subtitle</label>
                        <input value={newClubForm.title} onChange={(e)=>setNewClubForm({...newClubForm, title:e.target.value})} className="w-full border-2 border-amber-200 bg-white p-2.5 rounded-xl text-xs font-bold" placeholder="e.g. Astro & Science Network" />
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-amber-800 uppercase">Highlight Badge</label>
                        <input value={newClubForm.badge} onChange={(e)=>setNewClubForm({...newClubForm, badge:e.target.value})} className="w-full border-2 border-amber-200 bg-white p-2.5 rounded-xl text-xs font-bold" placeholder="e.g. Established 2024" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-amber-800 uppercase">Primary Descriptive Catalog</label>
                      <textarea value={newClubForm.description} onChange={(e)=>setNewClubForm({...newClubForm, description:e.target.value})} className="w-full border-2 border-amber-200 bg-white h-20 p-2.5 rounded-xl text-xs font-medium outline-none" placeholder="Summarize club objective goals..." />
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-amber-800 uppercase">Primary Slide Photo</label>
                      <AdminUpload
                        value={newClubForm.heroImage}
                        onChange={(newUrl) => setNewClubForm({ ...newClubForm, heroImage: newUrl })}
                        module="clubs"
                        category="student-activities"
                        placeholder="Upload slide image"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button onClick={handleCreateClub} className="bg-slate-950 text-white hover:bg-amber-600 font-black px-6 py-3.5 rounded-xl text-xs uppercase shadow transition active:scale-95 flex gap-2 cursor-pointer"><Plus className="w-4 h-4"/> Authorize & Synthesize</button>
                    </div>
                  </div>
                </Card>
              )}

              {clubs.length === 0 && !isEditMode && (
                <div className="text-center py-16 text-slate-400 font-medium bg-white rounded-[32px] border border-dashed max-w-lg mx-auto shadow-sm flex flex-col items-center justify-center gap-3">
                  <Activity className="w-8 h-8 animate-pulse text-slate-300"/>
                  <p className="text-sm">No operational activity rosters active in repo.</p>
                </div>
              )}
            </div>
          )}

          {/* ==========================================
              🎯 DYNAMIC SUB-CLUB TAB SHOWCASE
             ========================================== */}
          {tab !== "Overview" && (() => {
            const activeClub = clubs.find((c: any) => c.name === tab);
            if (!activeClub) return null;

            return (
              <div className="space-y-10 animate-[fade-in_0.5s_ease-out] w-full">
                <ClubLayoutEditor 
                  club={activeClub} 
                  isEdit={isEditMode} 
                  onRefetch={()=>router.invalidate()} 
                  onNavigateBack={()=>setTab("Overview")} 
                />
              </div>
            );
          })()}

        </div>
      </section>
    </div>
  );
}

/* ---------- WRAPPERS AND TABS ---------- */

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
            src={getAssetUrl(img)}
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

/* ---------- CLUB VIEW / EDIT SUB-COMPONENT ---------- */

function ClubLayoutEditor({ club, isEdit, onRefetch, onNavigateBack }: any) {
  // Form alignment
  const [cData, setCData] = useState({
    id: club.id, name: club.name, title: club.title || "", description: club.description || "", badge: club.badge || "", heroImage: club.heroImage || "", category: club.category || ""
  });

  useEffect(() => {
    setCData({
      id: club.id, name: club.name, title: club.title || "", description: club.description || "", badge: club.badge || "", heroImage: club.heroImage || "", category: club.category || ""
    });
  }, [club]);

  async function handleSaveCore() {
    const tId = toast.loading("Updating core club properties...");
    try {
      await updateStudentClub({ data: cData });
      toast.success("Aligned!", { id: tId });
      onRefetch();
    } catch {
      toast.error("Fail.", { id: tId });
    }
  }

  async function handleDeleteWholeClub() {
    if (!confirm("Are you extremely sure? This will wipe all associated images and descriptive sections.")) return;
    const tId = toast.loading("Decommissioning entire club...");
    try {
      await deleteStudentClub({ data: { id: club.id } });
      toast.success("Purged!", { id: tId });
      onNavigateBack();
      onRefetch();
    } catch {
      toast.error("Decommission fail.", { id: tId });
    }
  }

  // Image CMS
  async function handleAddImage(url: string) {
    if (!url.trim()) return;
    const tId = toast.loading("Adding local picture...");
    try {
      await createClubImage({ data: { clubId: club.id, url } });
      toast.success("Photo staged!", { id: tId });
      onRefetch();
    } catch {
      toast.error("Failed.", { id: tId });
    }
  }

  async function handleDeleteImage(id: number) {
    const tId = toast.loading("Purging photo...");
    try {
      await deleteClubImage({ data: { id } });
      toast.success("Removed!", { id: tId });
      onRefetch();
    } catch {
      toast.error("Failed.", { id: tId });
    }
  }

  // Subsections CMS
  const [secForm, setSecForm] = useState({ heading: "", content: "", image: "" });
  async function handleAddSection() {
    if (!secForm.heading.trim()) return;
    const tId = toast.loading("Synthesizing content block...");
    try {
      await createClubContent({ data: { clubId: club.id, sectionType: "detail", ...secForm } });
      toast.success("Block appended!", { id: tId });
      setSecForm({ heading: "", content: "", image: "" });
      onRefetch();
    } catch {
      toast.error("Reject.", { id: tId });
    }
  }

  async function handleDeleteSection(id: number) {
    const tId = toast.loading("Wiping content section...");
    try {
      await deleteClubContent({ data: { id } });
      toast.success("Erased!", { id: tId });
      onRefetch();
    } catch {
      toast.error("Failed.", { id: tId });
    }
  }

  return (
    <div className="space-y-10 w-full max-w-full">
      
      {/* MAIN HEADER DISPLAY */}
      <Card title={club.name} subtitle={club.category} icon={Activity} className={isEdit ? "ring-4 ring-amber-500/10 bg-amber-50/10 border-amber-200" : ""}>
        {isEdit ? (
          <div className="space-y-5 animate-[fade-in_0.3s]">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[9px] font-black text-amber-800 uppercase">Badge Short Label</label>
                <input value={cData.badge} onChange={(e)=>setCData({...cData, badge:e.target.value})} className="w-full border bg-white p-2.5 rounded-xl text-xs font-bold" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[9px] font-black text-amber-800 uppercase">Featured Banner Header</label>
                <input value={cData.title} onChange={(e)=>setCData({...cData, title:e.target.value})} className="w-full border bg-white p-2.5 rounded-xl text-xs font-bold" />
              </div>
            </div>
            <div>
              <label className="text-[9px] font-black text-amber-800 uppercase">Global Narrative Body</label>
              <textarea value={cData.description} onChange={(e)=>setCData({...cData, description:e.target.value})} className="w-full h-24 border bg-white p-2.5 rounded-xl text-xs font-medium" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] font-black text-amber-800 uppercase">Featured Right Side Image</label>
                <AdminUpload
                  value={cData.heroImage}
                  onChange={(newUrl) => setCData({ ...cData, heroImage: newUrl })}
                  module="clubs"
                  category="student-activities"
                  placeholder="Upload Right Side Image"
                />
              </div>
              <div>
                <label className="text-[9px] font-black text-amber-800 uppercase">Menu Display Trigger Label</label>
                <input value={cData.name} onChange={(e)=>setCData({...cData, name:e.target.value})} className="w-full border bg-white p-2.5 rounded-xl text-xs font-bold" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-amber-200/40">
              <button onClick={handleDeleteWholeClub} className="bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 font-black px-5 py-2.5 rounded-xl text-xs uppercase transition flex items-center gap-2 cursor-pointer shadow-sm border border-rose-200"><Trash2 className="w-4 h-4" /> Decommission Club</button>
              <button onClick={handleSaveCore} className="bg-amber-500 hover:bg-amber-600 text-amber-950 font-black px-6 py-3 rounded-xl text-xs uppercase transition flex items-center gap-2 cursor-pointer shadow"><Save className="w-4 h-4" /> Commit Changes</button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/2 space-y-5">
              {club.badge && (
                <span className="inline-flex items-center px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-xl font-black text-[oklch(0.42_0.18_265)] uppercase tracking-widest text-[10px] shadow-sm">
                  {club.badge}
                </span>
              )}
              <h3 className="font-display font-black text-3xl text-slate-950 leading-none tracking-tight">
                {club.title || "Club Mission Overview"}
              </h3>
              <p className="text-[15px] text-slate-600 font-medium leading-relaxed">
                {club.description}
              </p>
            </div>
            {club.heroImage && (
              <div className="w-full md:w-1/2 aspect-[16/10] rounded-[28px] overflow-hidden border-2 border-slate-100 shadow transition duration-500 hover:scale-[1.02]">
                <img 
                  src={getAssetUrl(club.heroImage)} 
                  className="w-full h-full object-cover" 
                  alt={`${club.name} Frame`} 
                  onError={(e) => { e.currentTarget.src = DEFAULT_IMAGE; }}
                />
              </div>
            )}
          </div>
        )}
      </Card>

      {/* CLUB LOCAL VAULT */}
      {isEdit && (
        <Card title={`${club.name} Activity Log Vault`} subtitle="Stage imagery from specific meets" icon={Camera} className="ring-2 ring-amber-300">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
            {(club.images || []).map((img: any) => (
              <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-[4/3] border bg-slate-100">
                <img src={getAssetUrl(img.url)} className="w-full h-full object-cover" />
                <button onClick={()=>handleDeleteImage(img.id)} className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-rose-950/80 text-white font-black text-xs uppercase tracking-wider transition flex flex-col items-center justify-center cursor-pointer"><Trash2 className="w-4 h-4 mb-1"/> Erase</button>
              </div>
            ))}
          </div>
          <div className="flex gap-3 border-t pt-4 items-center">
            <AdminMultiUpload
              onAdd={async (newUrl) => {
                if (newUrl) await handleAddImage(newUrl);
              }}
              module="clubs"
              category="student-activities"
              className="flex-1 w-full"
            />
          </div>
        </Card>
      )}

      {/* DYNAMIC SUBSECTIONS */}
      <div className="space-y-8">
        <div className="flex items-center gap-3 pb-2 border-b">
          <div className="w-1 h-6 bg-[oklch(0.42_0.18_265)] rounded-full" />
          <h3 className="font-display font-black text-2xl text-slate-900 tracking-tight">Interactive Spotlights & Activity Tracks</h3>
        </div>

        {/* CREATOR FOR SECTION */}
        {isEdit && (
          <div className="bg-amber-50/80 border-2 border-amber-200 p-5 rounded-[24px] space-y-4 shadow-inner animate-[fade-in_0.3s]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] font-black text-amber-800 uppercase">Spotlight Header</label>
                <input value={secForm.heading} onChange={(e)=>setSecForm({...secForm, heading:e.target.value})} className="w-full border bg-white p-2 rounded text-xs font-bold" />
              </div>
              <div>
                <label className="text-[9px] font-black text-amber-800 uppercase">Spotlight Graphics (Optional)</label>
                <AdminUpload
                  value={secForm.image}
                  onChange={(newUrl) => setSecForm({ ...secForm, image: newUrl })}
                  module="clubs"
                  category="student-activities"
                  placeholder="Upload Spotlight Graphics"
                />
              </div>
            </div>
            <div>
              <label className="text-[9px] font-black text-amber-800 uppercase">Objective Content Body</label>
              <textarea value={secForm.content} onChange={(e)=>setSecForm({...secForm, content:e.target.value})} className="w-full h-20 border bg-white p-2 rounded text-xs font-medium" />
            </div>
            <div className="flex justify-end">
              <button onClick={handleAddSection} className="bg-slate-950 text-white hover:bg-amber-600 font-black px-5 py-2.5 rounded-xl text-xs uppercase shadow flex gap-1 items-center active:scale-95 transition cursor-pointer"><Plus className="w-4 h-4"/> Log Spotlight Track</button>
            </div>
          </div>
        )}

        <div className="space-y-10">
          {(club.sections || []).map((sec: any, idx: number) => (
            <div key={sec.id} className={`flex flex-col md:flex-row items-center gap-8 border bg-white rounded-[32px] p-6 md:p-8 shadow-sm hover:shadow-md transition duration-500 relative group ${isEdit ? "ring-2 ring-amber-300" : ""}`}>
              
              {isEdit && (
                <button 
                  onClick={()=>handleDeleteSection(sec.id)}
                  className="absolute top-4 right-4 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white px-3 py-1.5 rounded-xl text-[10px] uppercase font-black transition tracking-wider shadow cursor-pointer"
                >
                  Delete Block
                </button>
              )}

              <div className={`flex-1 space-y-3 ${sec.image ? "" : "w-full"} ${idx % 2 === 1 && sec.image ? "md:order-2" : ""}`}>
                {isEdit ? (
                  <div className="space-y-3">
                    <div className="font-display font-black text-xl text-slate-950"><InlineCellEdit val={sec.heading} onCommit={async (n)=>{ await updateClubContent({data:{...sec, heading:n}}); onRefetch(); }} /></div>
                    <div className="text-[14px] text-slate-600 font-medium leading-relaxed"><InlineCellEdit val={sec.content} onCommit={async (n)=>{ await updateClubContent({data:{...sec, content:n}}); onRefetch(); }} /></div>
                  </div>
                ) : (
                  <>
                    <h4 className="font-display font-black text-2xl text-slate-950 tracking-tight leading-none">{sec.heading}</h4>
                    <p className="text-[15px] text-slate-600 font-medium leading-relaxed">{sec.content}</p>
                  </>
                )}
              </div>

              {sec.image && (
                <div className={`w-full md:w-1/2 aspect-[16/10] rounded-[24px] border border-slate-100 overflow-hidden shadow-sm duration-500 hover:scale-[1.01] shrink-0 relative ${idx % 2 === 1 ? "md:order-1" : ""}`}>
                  {isEdit ? (
                    <AdminUpload
                      value={sec.image}
                      onChange={async (newUrl) => {
                        await updateClubContent({ data: { ...sec, image: newUrl } });
                        onRefetch();
                      }}
                      module="clubs"
                      category="student-activities"
                      className="w-full h-full"
                    />
                  ) : (
                    <img src={getAssetUrl(sec.image)} className="w-full h-full object-cover" alt={sec.heading} onError={(e) => { e.currentTarget.src = DEFAULT_IMAGE; }} />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {(club.sections || []).length === 0 && (
          <p className="text-center italic text-slate-400 py-10 font-medium">No spotlit activity tracks registered in catalog.</p>
        )}
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
      const tId = toast.loading("Synthesizing objective parameters...");
      try {
        await onCommit(localVal.trim());
        toast.success("Synced!", { id: tId });
      } catch {
        toast.error("Error.", { id: tId });
      }
    }
  }

  if (editing) {
    return (
      <textarea
        autoFocus
        value={localVal}
        onChange={(e) => setLocalVal(e.target.value)}
        onBlur={commit}
        className="border-2 border-amber-400 bg-white text-xs font-bold px-2 py-1 rounded w-full text-amber-950 outline-none shadow-inner h-20"
      />
    );
  }

  return (
    <span onClick={() => setEditing(true)} className="border-b border-dashed border-amber-400 hover:bg-amber-100/50 px-1 cursor-pointer block leading-tight text-left">
      {val || <span className="text-slate-300 italic font-medium">[Null Body]</span>}
    </span>
  );
}

export default StudentActivityClubPage;
