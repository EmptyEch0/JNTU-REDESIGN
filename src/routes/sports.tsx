import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getSportsData } from "@/funcs/sports.server";
import { PageHero } from "@/components/PageHero";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import sportsImg from "@/assets/sports.jpg";
import {
  updateSportsContent,
  createPerson,
  updatePerson,
  deletePerson,
  createInfra,
  updateInfra,
  deleteInfra,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  createImage,
  deleteImage,
} from "@/funcs/sports.admin.ts";
import {
  Trophy,
  Users,
  User,
  Map,
  Dumbbell,
  Info,
  Building,
  Phone,
  Mail,
  Award,
  Flame,
  BookOpen,
  Lock,
  Save,
  Camera,
  Trash2,
  Plus,
  RefreshCw,
} from "lucide-react";
import { LocalSubNav } from "@/components/LocalSubNav";
import { getAssetUrl } from "@/lib/assets";
import { AdminUpload, PersonAvatarUpload } from "@/components/AdminEditPanel";

export const Route = createFileRoute("/sports")({
  loader: async () => await getSportsData(),
  component: SportsPage,
});

const DEFAULT_QUAL = "The Department of Physical Education provides high-tier training facilities for all students and staff at this Institute. Excellent infrastructural systems cover both outdoor fields and indoor sports complexes.";
const DEFAULT_ADDR = "The major outdoor setups include Badminton courts, Basketball fields, Cricket pitches, Football turfs, and standard Kabaddi & Volley Ball complexes. A 200mts standard athletics ring accommodates speed and distance tracks. Indoor infrastructures support integrated Chess hubs, Table Tennis stacks, Gymnastic zones, and high-station multi-Gyms.";

const DEFAULT_BULLETS = [
  "Intramural championships and Extramural inter-varsity streams",
  "Advanced coaching regimes & seasonal campus training camps",
  "All-India University tournament preparations and logistics",
  "University personnel fitness meets and conditioning workshops"
].join("\n");

function parseCompoundAddress(addrStr: string | null) {
  const s = addrStr || "";
  if (s.includes("||||")) {
    const parts = s.split("||||");
    return {
      infra: parts[0] || DEFAULT_ADDR,
      title: parts[1] || "Core Institutional Activities",
      bullets: parts[2] || DEFAULT_BULLETS,
    };
  }
  return {
    infra: s || DEFAULT_ADDR,
    title: "Core Institutional Activities",
    bullets: DEFAULT_BULLETS,
  };
}

function SportsPage() {
  const data: any = Route.useLoaderData();
  const router = useRouter();
  const { isEditMode } = useAdmin();

  const [tab, setTab] = useState("Overview");
  
  const availableYears = Array.from(
    new Set(
      (data?.achievements || [])
        .map((a: any) => a.yearLabel)
        .filter(Boolean)
    )
  ).sort().reverse();

  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    if (availableYears.length > 0 && !selectedYear) {
      setSelectedYear(availableYears[0] as string);
    }
  }, [availableYears, selectedYear]);

  const images = data?.images || [];
  const getCarouselImages = () => images.map((i: any) => getAssetUrl(i.url));

  const filteredAchievements = (data?.achievements || []).filter(
    (a: any) => a.yearLabel === selectedYear
  );

  const parsedAddr = parseCompoundAddress(data?.info?.address);

  // --- LOCAL CMS EDIT STATES ---
  const [editInfo, setEditInfo] = useState({
    id: data?.info?.id,
    name: data?.info?.name || "",
    designation: data?.info?.designation || "",
    message: data?.info?.message || "",
    phone: data?.info?.phone || "",
    email: data?.info?.email || "",
    img: data?.info?.img || "",
    qualification: data?.info?.qualification || DEFAULT_QUAL,
    
    // Compound Overview States
    overviewInfra: parsedAddr.infra,
    overviewBulletsTitle: parsedAddr.title,
    overviewBullets: parsedAddr.bullets,
  });

  useEffect(() => {
    if (data?.info) {
      const res = parseCompoundAddress(data.info.address);
      setEditInfo({
        id: data.info.id,
        name: data.info.name || "",
        designation: data.info.designation || "",
        message: data.info.message || "",
        phone: data.info.phone || "",
        email: data.info.email || "",
        img: data.info.img || "",
        qualification: data.info.qualification || DEFAULT_QUAL,
        
        overviewInfra: res.infra,
        overviewBulletsTitle: res.title,
        overviewBullets: res.bullets,
      });
    }
  }, [data?.info]);

  // --- MUTATIONS ---
  async function handleSaveInfo() {
    const tId = toast.loading("Saving changes...");
    try {
      const compoundAddress = `${(editInfo.overviewInfra || "").trim()}||||${(editInfo.overviewBulletsTitle || "").trim()}||||${(editInfo.overviewBullets || "").trim()}`;
      const { overviewInfra, overviewBulletsTitle, overviewBullets, ...rest }: any = editInfo;

      await updateSportsContent({
        data: {
          ...rest,
          address: compoundAddress,
        },
      });
      toast.success("Changes saved successfully!", { id: tId });
      router.invalidate();
    } catch {
      toast.error("Failed to save.", { id: tId });
    }
  }

  async function handleAddImage(url: string) {
    if (!url.trim()) return;
    const tId = toast.loading("Adding picture node...");
    try {
      await createImage({ data: { url } });
      toast.success("Added successfully!", { id: tId });
      router.invalidate();
    } catch {
      toast.error("Store fail.", { id: tId });
    }
  }

  async function handleDeleteImage(id: number) {
    const tId = toast.loading("Purging slide...");
    try {
      await deleteImage({ data: { id } });
      toast.success("Wiped!", { id: tId });
      router.invalidate();
    } catch {
      toast.error("Failed.", { id: tId });
    }
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-gradient-to-b from-background via-background to-sand/20 text-foreground pb-24 relative z-0">
      {/* Premium Ambient Decorative Glows */}
      <div className="absolute top-[25%] -left-48 w-[650px] h-[650px] rounded-full bg-primary/5 blur-[140px] pointer-events-none -z-10 animate-pulse duration-[9s]" />
      <div className="absolute bottom-[30%] -right-48 w-[650px] h-[650px] rounded-full bg-accent/5 blur-[140px] pointer-events-none -z-10 animate-pulse duration-[11s]" />
      {isEditMode && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-white font-black py-3 px-6 sticky top-0 z-[100] shadow-xl flex items-center justify-center gap-2.5 border-b border-amber-700/30 animate-[fade-in_0.3s] backdrop-blur-md text-xs uppercase tracking-widest">
          <Lock className="w-3.5 h-3.5 animate-pulse text-amber-950" />
          <span>Sports Portal Administration Live</span>
          <div className="hidden md:block h-1 w-1 rounded-full bg-amber-950" />
          <span className="hidden md:block text-amber-100 normal-case italic font-medium">Review and save directly using the inline controls.</span>
        </div>
      )}

      <PageHero
        title="Sports & Athletics"
        subtitle="Advancing team discipline, campus endurance, and state-level competition legacy."
        image={getAssetUrl(images[0]?.url) || sportsImg}
      />

      <section className="container-narrow py-12 md:py-16 px-4 sm:px-6 max-w-full overflow-x-hidden">
        
        {/* DYNAMIC SYSTEM NAV - Sleeker clean UI */}
        <LocalSubNav
          activeTab={tab}
          setActiveTab={setTab}
          items={[
            { label: "Overview", icon: Info },
            { label: "Staff", icon: Users },
            { label: "Achievements", icon: Trophy },
            { label: "Play Fields", icon: Map },
            { label: "Gymnasium", icon: Dumbbell },
          ]}
        />

        <div className="space-y-10 md:space-y-12 max-w-5xl mx-auto animate-[fade-in_0.5s_ease-out]">
          
          {/* IMAGE LEDGER & CAROUSEL - Bounded container */}
          <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-3xl shadow-lg border border-slate-200/60 bg-slate-100 transition-all duration-300">
            <ImageCarousel images={getCarouselImages()} fallback={sportsImg} />
            {isEditMode && (
              <div className="bg-amber-50/95 backdrop-blur-md border-t border-amber-200 p-6 sm:p-8 flex flex-col gap-5 animate-[fade-in_0.4s]">
                <div className="flex items-center gap-2 pb-3 border-b border-amber-200/60">
                  <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 grid place-items-center shrink-0 shadow-sm">
                    <Camera className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-amber-950 tracking-tight">Sports Gallery Vault</h4>
                    <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Manage active visual logs</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {images.map((img: any) => (
                    <div key={img.id} className="relative group rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 border-2 border-slate-200/40 shadow-sm hover:shadow duration-300">
                      <img src={getAssetUrl(img.url)} className="w-full h-full object-cover" />
                      <button
                        onClick={() => handleDeleteImage(img.id)}
                        className="absolute inset-0 bg-rose-950/85 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1 font-black text-xs uppercase tracking-widest cursor-pointer"
                      >
                        <Trash2 className="w-4.5 h-4.5" /> Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mt-2 items-center">
                  <AdminUpload
                    value=""
                    onChange={async (newUrl) => {
                      if (newUrl) {
                        await handleAddImage(newUrl);
                      }
                    }}
                    module="facilities"
                    category="sports"
                    placeholder="Drag & drop or click to add a new slide image..."
                    className="flex-1 w-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ==========================================
              💡 TAB 1: OVERVIEW
             ========================================== */}
          {tab === "Overview" && (
            <div className="space-y-10 animate-[fade-in_0.5s_ease-out]">
              <Card 
                title="Department of Physical Education" 
                icon={Building}
                className={isEditMode ? "ring-4 ring-amber-500/10 border-amber-200 bg-amber-50/10" : ""}
              >
                {isEditMode ? (
                  <div className="space-y-5 animate-[fade-in_0.3s]">
                    <div>
                      <label className="text-[9px] font-black text-amber-800 uppercase tracking-widest">General Intro Paragraph</label>
                      <textarea 
                        value={editInfo.qualification} 
                        onChange={(e)=>setEditInfo({...editInfo, qualification:e.target.value})} 
                        placeholder="General introduction text..." 
                        className="w-full h-24 border bg-white p-3 rounded-xl text-xs font-medium shadow-inner outline-none focus:border-amber-400" 
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-amber-800 uppercase tracking-widest">Infrastructure Narrative Block</label>
                      <textarea 
                        value={editInfo.overviewInfra} 
                        onChange={(e)=>setEditInfo({...editInfo, overviewInfra:e.target.value})} 
                        placeholder="Infrastructure and field logistics..." 
                        className="w-full h-24 border bg-white p-3 rounded-xl text-xs font-medium shadow-inner outline-none focus:border-amber-400" 
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-dashed border-amber-200">
                      <div>
                        <label className="text-[9px] font-black text-amber-800 uppercase tracking-widest">Bullets List Title</label>
                        <input 
                          value={editInfo.overviewBulletsTitle} 
                          onChange={(e)=>setEditInfo({...editInfo, overviewBulletsTitle:e.target.value})} 
                          className="w-full border bg-white p-3 rounded-xl text-xs font-bold shadow-inner outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-amber-800 uppercase tracking-widest">List Items (One per line)</label>
                        <textarea 
                          value={editInfo.overviewBullets} 
                          onChange={(e)=>setEditInfo({...editInfo, overviewBullets:e.target.value})} 
                          className="w-full h-28 border bg-white p-3 rounded-xl text-xs font-medium shadow-inner outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-2 border-t border-amber-200/50">
                      <button 
                        onClick={handleSaveInfo} 
                        className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-amber-950 font-black px-6 py-3 rounded-xl text-xs uppercase shadow active:scale-95 transition cursor-pointer"
                      >
                        <Save className="w-4 h-4"/> Save Overview Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-5 text-[15px] text-slate-600 font-medium leading-relaxed">
                      <p className="whitespace-pre-line">
                        {data?.info?.qualification || DEFAULT_QUAL}
                      </p>
                      <p className="whitespace-pre-line">
                        {parsedAddr.infra}
                      </p>
                    </div>
                    
                    <div className="mt-8 border-t border-slate-100 pt-6">
                      <h4 className="font-display font-black text-slate-900 text-[17px] mb-4">{parsedAddr.title}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(parsedAddr.bullets || "").split("\n").filter(Boolean).map((act: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-3 text-sm font-bold text-slate-700 bg-slate-50 border border-slate-200/40 px-4 py-3 rounded-2xl hover:bg-white duration-300 shadow-sm">
                            <div className="w-2.5 h-2.5 rounded-full bg-[oklch(0.42_0.18_265)] shrink-0 shadow-sm animate-pulse"/>
                            <span>{act}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </Card>
            </div>
          )}

          {/* ==========================================
              👥 TAB 2: STAFF & FACULTY
             ========================================== */}
          {tab === "Staff" && (
            <div className="space-y-10 animate-[fade-in_0.5s_ease-out]">
              {/* Coordinator In-charge Profile */}
              <Card 
                title="Athletics Directorate" 
                icon={User}
                className={isEditMode ? "ring-4 ring-amber-500/10 border-amber-200 bg-amber-50/10" : ""}
              >
                {isEditMode ? (
                  <div className="flex flex-col sm:flex-row gap-8 items-start animate-[fade-in_0.3s]">
                    <PersonAvatarUpload
                      value={editInfo.img}
                      onChange={(newUrl) => setEditInfo({ ...editInfo, img: newUrl })}
                      module="facilities"
                      category="sports/director"
                      size={112}
                    />
                    <div className="flex-1 space-y-4 w-full">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[9px] font-black text-amber-800 uppercase">Officer Full Name</label>
                          <input value={editInfo.name} onChange={(e)=>setEditInfo({...editInfo, name:e.target.value})} className="w-full border bg-white text-xs font-bold p-2.5 rounded-xl" />
                        </div>
                        <div>
                          <label className="text-[9px] font-black text-amber-800 uppercase">Active Designation</label>
                          <input value={editInfo.designation} onChange={(e)=>setEditInfo({...editInfo, designation:e.target.value})} className="w-full border bg-white text-xs font-bold p-2.5 rounded-xl" />
                        </div>
                        <div>
                          <label className="text-[9px] font-black text-amber-800 uppercase">Contact Dial</label>
                          <input value={editInfo.phone} onChange={(e)=>setEditInfo({...editInfo, phone:e.target.value})} className="w-full border bg-white text-xs font-bold p-2.5 rounded-xl" />
                        </div>
                        <div>
                          <label className="text-[9px] font-black text-amber-800 uppercase">Official Mailing Address</label>
                          <input value={editInfo.email} onChange={(e)=>setEditInfo({...editInfo, email:e.target.value})} className="w-full border bg-white text-xs font-bold p-2.5 rounded-xl" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-amber-800 uppercase">Directorate Address Message</label>
                        <textarea value={editInfo.message} onChange={(e)=>setEditInfo({...editInfo, message:e.target.value})} className="w-full h-20 border bg-white text-xs font-medium p-2.5 rounded-xl outline-none resize-none" />
                      </div>
                      <div className="flex justify-end">
                        <button onClick={handleSaveInfo} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-amber-950 font-black px-6 py-3 rounded-xl text-xs uppercase shadow transition active:scale-95 cursor-pointer"><Save className="w-4 h-4"/> Synchronize Directorate Desk</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <img
                      src={getAssetUrl(data?.info?.img) || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250"}
                      onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250"; }}
                      className="w-32 h-40 md:w-40 md:h-52 rounded-[28px] object-cover border-2 border-slate-100 shadow-md shrink-0 transition duration-500 hover:scale-[1.02]"
                      alt={data?.info?.name}
                    />
                    <div className="flex-1 w-full">
                      <h4 className="font-display font-black text-2xl text-slate-900 tracking-tight leading-none mb-2">{data?.info?.name || "Athletics Coordinator"}</h4>
                      <div className="inline-flex bg-indigo-50 border border-indigo-100 text-[oklch(0.42_0.18_265)] font-black text-xs tracking-widest uppercase px-4 py-1.5 rounded-lg shadow-sm mb-4">{data?.info?.designation || "Director of Physical Education"}</div>
                      <p className="text-[15px] text-slate-600 leading-relaxed italic bg-slate-50 border p-5 rounded-2xl mb-6 shadow-inner font-medium">"{data?.info?.message || "Advocating total endurance and sportsmen spirits across student horizons."}"</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-bold text-slate-700">
                        <div className="flex items-center gap-3 bg-white border rounded-xl p-3 shadow-sm"><div className="w-8 h-8 rounded-lg bg-indigo-50 text-[oklch(0.42_0.18_265)] flex items-center justify-center shrink-0"><Phone className="w-4 h-4"/></div> <span>{data?.info?.phone || "N/A"}</span></div>
                        <div className="flex items-center gap-3 bg-white border rounded-xl p-3 shadow-sm"><div className="w-8 h-8 rounded-lg bg-indigo-50 text-[oklch(0.42_0.18_265)] flex items-center justify-center shrink-0"><Mail className="w-4 h-4"/></div> <span className="truncate">{data?.info?.email || "N/A"}</span></div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>

              {/* Faculty Roster Listing */}
              <Card 
                title="Coaching & Instructional Faculty" 
                subtitle="Registered physical instructors and coaching specialists"
                icon={Users} 
                className={isEditMode ? "ring-2 ring-amber-300" : ""}
              >
                <PeopleRegistryEditable 
                  data={data?.faculty || []} 
                  category="faculty" 
                  isEdit={isEditMode} 
                  onRefetch={() => router.invalidate()} 
                />
              </Card>

              {/* Non teaching listing */}
              <Card 
                title="Grounds Supporting Roster" 
                subtitle="Grounds keepers and field technicians maintenance force"
                icon={Users}
                className={isEditMode ? "ring-2 ring-amber-300" : ""}
              >
                <PeopleRegistryEditable 
                  data={data?.nonTeaching || []} 
                  category="non-teaching" 
                  isEdit={isEditMode} 
                  onRefetch={() => router.invalidate()} 
                />
              </Card>
            </div>
          )}

          {/* ==========================================
              🏆 TAB 3: ACHIEVEMENTS
             ========================================== */}
          {tab === "Achievements" && (() => {
            // Group Achievements
            const achievementsByGroup = filteredAchievements.reduce((acc: Record<string, any[]>, a: any) => {
              const rawCat = (a.category || "other").trim().toLowerCase();
              const cat = rawCat || "other";
              if (!acc[cat]) acc[cat] = [];
              acc[cat].push(a);
              return acc;
            }, {});

            const CATEGORY_ORDER = [
              "sports_stars",
              "inter_collegiate",
              "tournaments",
              "athletics",
              "seminars",
              "coaching_camps"
            ];

            const sortedGroups = Object.keys(achievementsByGroup).sort((a, b) => {
              const idxA = CATEGORY_ORDER.indexOf(a);
              const idxB = CATEGORY_ORDER.indexOf(b);
              if (idxA !== -1 && idxB !== -1) return idxA - idxB;
              if (idxA !== -1) return -1;
              if (idxB !== -1) return 1;
              return a.localeCompare(b);
            });

            const getGroupConfig = (slug: string) => {
              const config: Record<string, { title: string; subtitle: string; icon: any }> = {
                sports_stars: {
                  title: `🌟 Individual Sports Stars (${selectedYear})`,
                  subtitle: "Student athletes recognized at national, state, or university circuits",
                  icon: Award
                },
                inter_collegiate: {
                  title: `🏆 Inter-Collegiate & Inter-University (${selectedYear})`,
                  subtitle: "Participatory team standings and university-governed matches",
                  icon: Trophy
                },
                tournaments: {
                  title: `🏅 Invitational Tournaments (${selectedYear})`,
                  subtitle: "Regional invitations, college open meets, and cup standings",
                  icon: Trophy
                },
                athletics: {
                  title: `🏃 Track & Field Records (${selectedYear})`,
                  subtitle: "Event logs for sprints, endurance runs, jump feats, and track throws",
                  icon: Flame
                },
                seminars: {
                  title: `📚 Research Seminars & Summits (${selectedYear})`,
                  subtitle: "Theoretical training lectures and athletic physical science platforms",
                  icon: BookOpen
                },
                coaching_camps: {
                  title: `🏕️ Specialized Coaching Camps (${selectedYear})`,
                  subtitle: "Intensive camps, elite skills training, and fitness camps",
                  icon: Map
                }
              };

              return config[slug] || {
                title: `${slug.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} - ${selectedYear}`,
                subtitle: "Academic achievements catalog",
                icon: Trophy
              };
            };

            return (
              <div className="space-y-10 animate-[fade-in_0.5s_ease-out] w-full">
                
                {/* Add a global form if edit is active to start a new entry */}
                {isEditMode && (
                  <Card title="Log Student Athletic Accomplishment" icon={Plus} className="ring-4 ring-amber-500/10 bg-amber-50/10 border-amber-200">
                    <AchievementCreator onRefetch={()=>router.invalidate()} />
                  </Card>
                )}

                {availableYears.length === 0 && !isEditMode ? (
                  <div className="p-16 bg-white border border-slate-200/60 rounded-[32px] text-center shadow-sm max-w-lg mx-auto">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-[oklch(0.42_0.18_265)] flex items-center justify-center mx-auto mb-4 shadow-sm"><Trophy className="w-7 h-7 animate-bounce"/></div>
                    <h4 className="font-black text-slate-800 text-lg mb-1">Achievements Ledger Clean</h4>
                    <p className="text-sm text-slate-400 font-medium">Athletic catalogs are being parsed currently.</p>
                  </div>
                ) : (
                  <div className="space-y-8 w-full max-w-full overflow-hidden">
                    {/* Ledger Switcher Years */}
                    <div className="flex flex-wrap gap-2 justify-center border-b pb-5">
                      {availableYears.map((yr: any)=>(
                        <button 
                          key={yr} 
                          onClick={()=>setSelectedYear(yr)}
                          className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition active:scale-95 cursor-pointer border ${selectedYear === yr ? "bg-indigo-950 border-indigo-950 text-white shadow-md" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm"}`}
                        >
                          {yr} Ledger
                        </button>
                      ))}
                    </div>

                    {/* Dynamic grouped separation */}
                    {sortedGroups.map((slug) => {
                      const config = getGroupConfig(slug);
                      return (
                        <div key={slug} className="animate-[fade-in_0.4s_ease-out]">
                          <Card 
                            title={config.title} 
                            subtitle={config.subtitle} 
                            icon={config.icon}
                          >
                            <AchievementsTableEditable 
                              data={achievementsByGroup[slug]} 
                              isEdit={isEditMode} 
                              onRefetch={()=>router.invalidate()} 
                            />
                          </Card>
                        </div>
                      );
                    })}

                    {/* No results fallback */}
                    {sortedGroups.length === 0 && (
                      <div className="p-14 text-center italic bg-white border border-slate-100 rounded-[28px] text-slate-400 text-sm font-medium shadow-inner">
                        No structured accomplishments filed under the selected ledger.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()}

          {/* ==========================================
              🗺️ TAB 4: PLAY FIELDS
             ========================================== */}
          {tab === "Play Fields" && (
            <div className="animate-[fade-in_0.5s_ease-out]">
              <Card 
                title="Institutional Playfield Topography" 
                subtitle="Current active outdoor surfaces catalog"
                icon={Map}
                className={isEditMode ? "ring-2 ring-amber-300" : ""}
              >
                <InfraRegistryEditable 
                  data={data?.fields || []} 
                  category="field" 
                  isEdit={isEditMode} 
                  onRefetch={() => router.invalidate()} 
                />
              </Card>
            </div>
          )}

          {/* ==========================================
              🏋️ TAB 5: GYMNASIUM
             ========================================== */}
          {tab === "Gymnasium" && (
            <div className="animate-[fade-in_0.5s_ease-out]">
              <Card 
                title="Conditioning Station Roster" 
                subtitle="Mechanical workout units available in weights wing"
                icon={Dumbbell}
                className={isEditMode ? "ring-2 ring-amber-300" : ""}
              >
                <InfraRegistryEditable 
                  data={data?.gym || []} 
                  category="gym" 
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

/* ---------- SHARED COMMON HELPERS ---------- */

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
      className="relative aspect-[16/9] sm:aspect-[16/7] md:aspect-[21/9] max-h-[260px] md:max-h-[320px] w-full bg-slate-950 overflow-hidden group"
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

/* ---------- EDITABLE TABLES & ROSTERS ---------- */

function PeopleRegistryEditable({ data, category, isEdit, onRefetch }: any) {
  const [form, setForm] = useState({ name: "", designation: "", phone: "", email: "" });

  async function handleAdd() {
    if (!form.name.trim()) return;
    const tId = toast.loading("Enrolling athletic coach...");
    try {
      await createPerson({ data: { category, ...form } });
      toast.success("Faculty logged!", { id: tId });
      setForm({ name: "", designation: "", phone: "", email: "" });
      onRefetch();
    } catch {
      toast.error("Fail.", { id: tId });
    }
  }

  async function handleDelete(id: number) {
    const tId = toast.loading("Purging profile file...");
    try {
      await deletePerson({ data: { id } });
      toast.success("Wiped!", { id: tId });
      onRefetch();
    } catch {
      toast.error("Failed.", { id: tId });
    }
  }

  return (
    <div className="space-y-6 w-full">
      {isEdit && (
        <div className="bg-amber-50/80 border-2 border-amber-200 p-5 rounded-[24px] grid grid-cols-1 sm:grid-cols-3 gap-4 items-end shadow-inner animate-[fade-in_0.3s]">
          <div>
            <label className="text-[10px] font-black uppercase text-amber-800">Personnel Name</label>
            <input value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} className="w-full border bg-white p-2 rounded text-xs font-bold" />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-amber-800">Rank Station</label>
            <input value={form.designation} onChange={(e)=>setForm({...form, designation:e.target.value})} className="w-full border bg-white p-2 rounded text-xs font-bold" />
          </div>
          <button onClick={handleAdd} className="bg-slate-950 hover:bg-amber-600 text-white font-black py-3 rounded-lg text-[11px] uppercase shadow active:scale-95 transition cursor-pointer">Log Team Member</button>
        </div>
      )}

      <div className="overflow-x-auto no-scrollbar border rounded-[24px]">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="bg-slate-50 border-b">
              <th className="py-4 px-6 text-[10px] font-black uppercase tracking-wider text-slate-400">Official Full Name</th>
              <th className="py-4 px-6 text-[10px] font-black uppercase tracking-wider text-slate-400">Designation Title</th>
              {isEdit && <th className="py-4 px-6 text-[10px] font-black uppercase tracking-wider text-slate-400">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y font-bold text-slate-800 text-[14px]">
            {data.length === 0 ? (
              <tr><td colSpan={3} className="py-8 text-center italic text-slate-400 font-medium">No active listed personnel.</td></tr>
            ) : (
              data.map((p: any, i: number)=>(
                <tr key={p.id || i} className="hover:bg-slate-50/30 transition">
                  <td className="py-4 px-6">
                    {isEdit ? <InlineCellEdit val={p.name} onCommit={async (n)=>{ await updatePerson({data:{...p, name:n}}); onRefetch(); }} /> : p.name}
                  </td>
                  <td className="py-4 px-6">
                    {isEdit ? <InlineCellEdit val={p.designation} onCommit={async (n)=>{ await updatePerson({data:{...p, designation:n}}); onRefetch(); }} /> : <span className="inline-flex px-2 py-0.5 text-[11px] font-black uppercase bg-indigo-50 text-indigo-700 rounded">{p.designation}</span>}
                  </td>
                  {isEdit && (
                    <td className="py-4 px-6">
                      <button onClick={()=>handleDelete(p.id)} className="text-slate-300 hover:text-rose-600 grid place-items-center transition cursor-pointer"><Trash2 className="w-4 h-4"/></button>
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

function AchievementsTableEditable({ data, isEdit, onRefetch }: any) {
  async function handleDelete(id: number) {
    const tId = toast.loading("Purging student legacy record...");
    try {
      await deleteAchievement({ data: { id } });
      toast.success("Cleared!", { id: tId });
      onRefetch();
    } catch {
      toast.error("Failed.", { id: tId });
    }
  }

  return (
    <div className="overflow-x-auto no-scrollbar w-full border border-slate-200/60 rounded-[24px]">
      <table className={`w-full border-collapse text-left text-slate-800 text-[13px] font-bold ${isEdit ? "min-w-[880px]" : "min-w-[720px]"}`}>
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 w-12 text-center">SNo</th>
            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Medalist / Branch</th>
            {isEdit && <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Level Tier</th>}
            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Event / Game</th>
            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Hosting Arena</th>
            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Medal Scale</th>
            {isEdit && <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 w-12 text-center">Wipe</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((a: any, i: number)=>(
            <tr key={a.id || i} className="hover:bg-indigo-50/20 transition duration-200">
              <td className="py-4.5 px-4 text-center text-slate-400 font-black">{a.sno || (i+1)}</td>
              <td className="py-4.5 px-4">
                <div className="flex flex-col gap-0.5">
                  {isEdit ? <InlineCellEdit val={a.student} onCommit={async (n)=>{ await updateAchievement({data:{...a, student:n}}); onRefetch(); }} /> : <span className="text-slate-950 text-[14px] tracking-tight font-extrabold">{a.student}</span>}
                  {isEdit ? <InlineCellEdit val={a.branch} onCommit={async (n)=>{ await updateAchievement({data:{...a, branch:n}}); onRefetch(); }} /> : <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{a.branch}</span>}
                </div>
              </td>
              {isEdit && (
                <td className="py-4.5 px-4">
                  <InlineCellEdit val={a.category} onCommit={async (n)=>{ await updateAchievement({data:{...a, category:n}}); onRefetch(); }} />
                </td>
              )}
              <td className="py-4.5 px-4">
                <div className="flex flex-col">
                  {isEdit ? <InlineCellEdit val={a.game} onCommit={async (n)=>{ await updateAchievement({data:{...a, game:n}}); onRefetch(); }} /> : <span className="text-slate-800 text-[13.5px]">{a.game}</span>}
                  {isEdit ? <InlineCellEdit val={a.tournament} onCommit={async (n)=>{ await updateAchievement({data:{...a, tournament:n}}); onRefetch(); }} /> : <span className="text-[11px] font-medium text-slate-500 italic">{a.tournament}</span>}
                </div>
              </td>
              <td className="py-4.5 px-4">
                <div className="flex flex-col text-slate-600">
                  {isEdit ? <InlineCellEdit val={a.venue} onCommit={async (n)=>{ await updateAchievement({data:{...a, venue:n}}); onRefetch(); }} /> : <span>{a.venue}</span>}
                  {isEdit ? <InlineCellEdit val={a.tournamentDate} onCommit={async (n)=>{ await updateAchievement({data:{...a, tournamentDate:n}}); onRefetch(); }} /> : <span className="text-[10px] font-black tracking-widest">{a.tournamentDate}</span>}
                </div>
              </td>
              <td className="py-4.5 px-4">
                {isEdit ? (
                  <InlineCellEdit val={a.medal} onCommit={async (n)=>{ await updateAchievement({data:{...a, medal:n}}); onRefetch(); }} />
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-lg shadow-sm text-amber-900 text-[11px] uppercase tracking-widest font-black">
                    <Flame className="w-3 h-3 text-amber-600 fill-amber-500 animate-pulse"/>
                    <span>{a.medal}</span>
                  </div>
                )}
              </td>
              {isEdit && (
                <td className="py-4.5 px-4 text-center">
                  <button onClick={()=>handleDelete(a.id)} className="w-8 h-8 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg inline-grid place-items-center cursor-pointer transition"><Trash2 className="w-4 h-4"/></button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AchievementCreator({ onRefetch }: any) {
  const [f, setF] = useState({
    yearLabel: "", student: "", branch: "", category: "", game: "",
    tournament: "", venue: "", tournamentDate: "", medal: "", sno: ""
  });

  async function submit() {
    if (!f.yearLabel.trim() || !f.student.trim()) return toast.error("Input Year and Student Name!");
    const tId = toast.loading("Saving record to ledger...");
    try {
      await createAchievement({ data: { ...f, sno: Number(f.sno) || undefined } });
      toast.success("Success!", { id: tId });
      setF({ yearLabel: "", student: "", branch: "", category: "", game: "", tournament: "", venue: "", tournamentDate: "", medal: "", sno: "" });
      onRefetch();
    } catch {
      toast.error("Fail.", { id: tId });
    }
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 items-end animate-[fade-in_0.3s]">
      <input placeholder="Year e.g 2024-2025" value={f.yearLabel} onChange={(e)=>setF({...f, yearLabel:e.target.value})} className="border rounded-lg p-2 bg-white text-xs font-bold"/>
      <input placeholder="Student Full Name" value={f.student} onChange={(e)=>setF({...f, student:e.target.value})} className="border rounded-lg p-2 bg-white text-xs font-bold"/>
      <input placeholder="Branch code e.g CSE" value={f.branch} onChange={(e)=>setF({...f, branch:e.target.value})} className="border rounded-lg p-2 bg-white text-xs font-bold"/>
      <input placeholder="Category Level e.g. National" value={f.category} onChange={(e)=>setF({...f, category:e.target.value})} className="border rounded-lg p-2 bg-white text-xs font-bold"/>
      <input placeholder="Game code" value={f.game} onChange={(e)=>setF({...f, game:e.target.value})} className="border rounded-lg p-2 bg-white text-xs font-bold"/>
      <input placeholder="Tournament Arena" value={f.tournament} onChange={(e)=>setF({...f, tournament:e.target.value})} className="border rounded-lg p-2 bg-white text-xs font-bold"/>
      <input placeholder="Venue physical location" value={f.venue} onChange={(e)=>setF({...f, venue:e.target.value})} className="border rounded-lg p-2 bg-white text-xs font-bold"/>
      <input placeholder="Medal Scale e.g. Silver" value={f.medal} onChange={(e)=>setF({...f, medal:e.target.value})} className="border rounded-lg p-2 bg-white text-xs font-bold"/>
      <input placeholder="Serial Order" value={f.sno} onChange={(e)=>setF({...f, sno:e.target.value})} className="border rounded-lg p-2 bg-white text-xs font-bold"/>
      <button onClick={submit} className="bg-slate-950 hover:bg-amber-600 text-white font-black py-2 rounded-lg text-[11px] uppercase cursor-pointer shadow active:scale-95 transition">Log Medalist</button>
    </div>
  );
}

function InfraRegistryEditable({ data, category, isEdit, onRefetch }: any) {
  const [form, setForm] = useState({ name: "", qty: "" });

  async function handleAdd() {
    if (!form.name.trim()) return;
    const tId = toast.loading("Logging arena specification...");
    try {
      await createInfra({ data: { category, name: form.name.trim(), qty: Number(form.qty) || null } });
      toast.success("Registered successfully!", { id: tId });
      setForm({ name: "", qty: "" });
      onRefetch();
    } catch {
      toast.error("Failed.", { id: tId });
    }
  }

  async function handleDelete(id: number) {
    const tId = toast.loading("Revoking specification spec...");
    try {
      await deleteInfra({ data: { id } });
      toast.success("Wiped!", { id: tId });
      onRefetch();
    } catch {
      toast.error("Fail.", { id: tId });
    }
  }

  const isGym = category === "gym";
  const columnLabel = isGym ? "Gymnasium Station / Equipment" : "Outdoor Play Fields / Campus Arena";

  return (
    <div className="space-y-6 w-full">
      {isEdit && (
        <div className="bg-amber-50/80 border-2 border-amber-200 p-4.5 rounded-[24px] flex flex-col sm:flex-row gap-3 items-end shadow-inner animate-[fade-in_0.3s]">
          <div className="flex-1 w-full">
            <label className="text-[10px] font-black uppercase text-amber-800">Inventory Description Name</label>
            <input value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} className="w-full border bg-white px-4 py-3 rounded-xl text-xs font-bold outline-none focus:border-amber-400 shadow-inner" placeholder={isGym ? "e.g. 16 STATIONS MULTI GYM" : "e.g. BASKET-BALL COURT"}/>
          </div>
          <div className="w-full sm:w-36">
            <label className="text-[10px] font-black uppercase text-amber-800">Volume Qty</label>
            <input value={form.qty} onChange={(e)=>setForm({...form, qty:e.target.value})} className="w-full border bg-white px-4 py-3 rounded-xl text-xs font-bold outline-none focus:border-amber-400 shadow-inner" placeholder="e.g. 2" />
          </div>
          <button onClick={handleAdd} className="bg-slate-950 hover:bg-amber-600 text-white font-black px-6 py-3.5 rounded-xl text-xs uppercase cursor-pointer active:scale-95 shadow transition flex gap-2 shrink-0 justify-center w-full sm:w-auto"><Plus className="w-4 h-4"/> Log Specs</button>
        </div>
      )}

      <div className="overflow-x-auto no-scrollbar w-full border border-slate-200/60 rounded-[24px] shadow-sm">
        <table className="w-full border-collapse text-left text-slate-800 text-[13.5px] font-bold min-w-[520px]">
          <thead>
            <tr className="bg-slate-700 text-white border-b border-slate-800">
              <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest w-24 text-center border-r border-slate-600/30">S.No</th>
              <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest">{columnLabel}</th>
              <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest w-36 text-center border-l border-slate-600/30">Numbers</th>
              {isEdit && <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest w-24 text-center border-l border-slate-600/30">Wipe</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/60">
            {data.length === 0 ? (
              <tr>
                <td colSpan={isEdit ? 4 : 3} className="py-12 text-center italic text-slate-400 font-medium bg-white">
                  No registered infrastructure specs found for this catalog.
                </td>
              </tr>
            ) : (
              data.map((infra: any, idx: number)=>(
                <tr key={infra.id || idx} className="hover:bg-indigo-50/10 transition duration-200 odd:bg-white even:bg-slate-50/40">
                  <td className="py-4.5 px-6 text-center text-slate-500 font-black border-r border-slate-100">{String(idx + 1).padStart(2, '0')}</td>
                  <td className="py-4.5 px-6 text-slate-900 font-extrabold tracking-tight uppercase text-[14px]">
                    {isEdit ? (
                      <InlineCellEdit val={infra.name} onCommit={async (n)=>{ await updateInfra({data:{...infra, name:n}}); onRefetch(); }} />
                    ) : (
                      infra.name
                    )}
                  </td>
                  <td className="py-4.5 px-6 text-center font-black text-[14px] text-slate-700 border-l border-slate-100">
                    {isEdit ? (
                      <InlineCellEdit val={String(infra.qty || "")} onCommit={async (n)=>{ await updateInfra({data:{...infra, qty:Number(n) || null}}); onRefetch(); }} />
                    ) : (
                      infra.qty || "N/A"
                    )}
                  </td>
                  {isEdit && (
                    <td className="py-4.5 px-6 text-center border-l border-slate-100">
                      <button onClick={()=>handleDelete(infra.id)} className="w-8 h-8 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg inline-grid place-items-center transition cursor-pointer"><Trash2 className="w-4 h-4"/></button>
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

/* --- MICRO CELL INTERACTION SYSTEMS --- */

function InlineCellEdit({ val, onCommit }: { val: string; onCommit: (n: string) => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  const [localVal, setLocalVal] = useState(val);

  async function commit() {
    setEditing(false);
    if (localVal.trim() !== val) {
      const tId = toast.loading("Synchronizing cell record...");
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
    <span onClick={() => setEditing(true)} className="border-b-2 border-dashed border-amber-500/40 hover:bg-amber-100/60 px-1 cursor-pointer inline-block leading-tight break-words text-slate-850">
      {val || <span className="text-amber-700/20 italic">[Edit]</span>}
    </span>
  );
}

export default SportsPage;