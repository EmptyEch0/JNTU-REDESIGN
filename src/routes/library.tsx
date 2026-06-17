import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getLibraryData } from "@/funcs/library.server";
import { PageHero } from "@/components/PageHero";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import {
  updateLibraryContent,
  createSection,
  deleteSection,
  updateSection,
  createStat,
  deleteStat,
  updateStat,
  createMeta,
  deleteMeta,
  updateMeta,
  createTeam,
  deleteTeam,
  updateTeam,
  createImage,
  deleteImage,
} from "@/funcs/library.admin.server";
import {
  User,
  BookOpen,
  Building,
  Monitor,
  Newspaper,
  Users,
  Clock,
  Video,
  Info,
  Lock,
  Camera,
  Trash2,
  ChevronRight,
  Save,
  Plus,
  X,
  RefreshCw,
} from "lucide-react";
import { LocalSubNav } from "@/components/LocalSubNav";

export const Route = createFileRoute("/library")({
  loader: async () => await getLibraryData(),
  component: LibraryPage,
});

const DEFAULT_ABOUT = "The Central Library established in June 2008 serves as a partner in academic dissemination. Rich volumes and advanced infrastructure support multiple curricular streams.";
const DEFAULT_INFRA = "The library resides in a dedicated architecture covering 2864 Sq.mts located within Academic Block-I. Contains lending sections, read halls, reference shelves, and multi-media suites.";
const DEFAULT_SEATING_CURRENT = "225";
const DEFAULT_SEATING_EXPANDED = "350";

function parseCompoundAbout(aboutStr: string | null) {
  const s = aboutStr || "";
  if (s.includes("||||")) {
    const parts = s.split("||||");
    return {
      aboutText: parts[0] || DEFAULT_ABOUT,
      infraText: parts[1] || DEFAULT_INFRA,
      seatingCurrent: parts[2] || DEFAULT_SEATING_CURRENT,
      seatingExpanded: parts[3] || DEFAULT_SEATING_EXPANDED,
    };
  }
  return {
    aboutText: s || DEFAULT_ABOUT,
    infraText: DEFAULT_INFRA,
    seatingCurrent: DEFAULT_SEATING_CURRENT,
    seatingExpanded: DEFAULT_SEATING_EXPANDED,
  };
}

function LibraryPage() {
  const data: any = Route.useLoaderData();
  const router = useRouter();
  const { isEditMode } = useAdmin();

  const content = data?.content || {};
  const sections = data?.sections || [];
  const stats = data?.stats || [];
  const meta = data?.meta || [];
  const images = data?.images || [];
  const team = data?.team || [];

  const [tab, setTab] = useState("About Library");

  const titleStats = stats.filter((item: any) => item.category === "titles");
  const periodicals = stats.filter((item: any) => item.category === "periodicals");
  const digitalItems = meta.filter((item: any) => item.category === "digital");
  const magazines = meta.filter((item: any) => item.category === "magazine");
  const newspapers = meta.filter((item: any) => item.category === "newspaper");

  const getCarouselImages = () => images.map((i: any) => i.url);

  const parsedAbout = parseCompoundAbout(content?.about);

  // --- LOCAL EDITABLE STATES ---
  const [editOfficer, setEditOfficer] = useState({
    name: content?.officerName || "",
    designation: content?.designation || "",
    message: content?.message || "",
    img: content?.img || "",
  });

  const [editTexts, setEditTexts] = useState({
    aboutText: parsedAbout.aboutText,
    infraText: parsedAbout.infraText,
    seatingCurrent: parsedAbout.seatingCurrent,
    seatingExpanded: parsedAbout.seatingExpanded,
    digitalDescription: content?.digitalDescription || "",
    workingDays: content?.workingDays || "",
    workingTime: content?.workingTime || "",
    transactionTime: content?.transactionTime || "",
  });

  useEffect(() => {
    if (content) {
      const res = parseCompoundAbout(content.about);
      setEditOfficer({
        name: content.officerName || "",
        designation: content.designation || "",
        message: content.message || "",
        img: content.img || "",
      });
      setEditTexts({
        aboutText: res.aboutText,
        infraText: res.infraText,
        seatingCurrent: res.seatingCurrent,
        seatingExpanded: res.seatingExpanded,
        digitalDescription: content.digitalDescription || "",
        workingDays: content.workingDays || "",
        workingTime: content.workingTime || "",
        transactionTime: content.transactionTime || "",
      });
    }
  }, [content]);

  // --- CONTENT MUTATIONS ---
  async function handleSaveContent() {
    const tId = toast.loading("Saving changes...");
    try {
      const compoundAbout = `${(editTexts.aboutText || "").trim()}||||${(editTexts.infraText || "").trim()}||||${(editTexts.seatingCurrent || "").trim()}||||${(editTexts.seatingExpanded || "").trim()}`;
      
      await updateLibraryContent({
        data: {
          officerName: editOfficer.name,
          designation: editOfficer.designation,
          message: editOfficer.message,
          img: editOfficer.img,
          about: compoundAbout,
          digitalDescription: editTexts.digitalDescription,
          workingDays: editTexts.workingDays,
          workingTime: editTexts.workingTime,
          transactionTime: editTexts.transactionTime,
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
    const tId = toast.loading("Adding carousel image...");
    try {
      await createImage({ data: { url } });
      toast.success("Image added!", { id: tId });
      router.invalidate();
    } catch {
      toast.error("Failed.", { id: tId });
    }
  }

  async function handleDeleteImage(id: number) {
    const tId = toast.loading("Removing carousel image...");
    try {
      await deleteImage({ data: { id } });
      toast.success("Wiped!", { id: tId });
      router.invalidate();
    } catch {
      toast.error("Fail.", { id: tId });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-sand/20 text-foreground pb-24 w-full max-w-full overflow-x-hidden relative z-0">
      {/* Premium Ambient Background Glows */}
      <div className="absolute top-[25%] -left-48 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[140px] pointer-events-none -z-10 animate-pulse duration-[10s]" />
      <div className="absolute bottom-[35%] -right-48 w-[650px] h-[650px] rounded-full bg-accent/5 blur-[130px] pointer-events-none -z-10 animate-pulse duration-[8s]" />
      {isEditMode && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-white font-black py-3 px-6 sticky top-0 z-[100] shadow-xl flex items-center justify-center gap-2.5 border-b border-amber-700/30 animate-[fade-in_0.15s] backdrop-blur-md text-xs uppercase tracking-widest">
          <Lock className="w-3.5 h-3.5 animate-pulse text-amber-950" />
          <span>Live Library Editorial Enabled</span>
          <div className="hidden md:block h-1 w-1 rounded-full bg-amber-950" />
          <span className="hidden md:block text-amber-100 normal-case italic font-medium">Click and edit descriptors inline and hit save.</span>
        </div>
      )}

      <PageHero
        title="University Library"
        subtitle="State-of-the-art knowledge repositories, extensive archives, and reading supports."
        image={images[0]?.url || "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1000"}
      />

      <section className="container-narrow py-12 md:py-16 px-4 sm:px-6 max-w-full overflow-x-hidden">
        
        {/* TABS CONSOLE - Sleeker clean UI */}
        <LocalSubNav
          activeTab={tab}
          setActiveTab={setTab}
          items={[
            { label: "About Library", icon: Info },
            { label: "Titles & Volumes", icon: BookOpen },
            { label: "Periodicals", icon: Newspaper },
            { label: "Digital Library", icon: Monitor },
            { label: "Team", icon: Users },
            { label: "Ekeeda Video Library", icon: Video },
          ]}
        />

        <div className="space-y-10 md:space-y-12 max-w-5xl mx-auto animate-[fade-in_0.2s_ease-out]">
          
          {/* HIGH-END CAROUSEL & EDIT CONTROL - Bounded container */}
          <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-3xl shadow-lg border border-slate-200/60 bg-slate-100 transition-all duration-300">
            <ImageCarousel 
              images={getCarouselImages()} 
              fallback="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1000" 
            />
            {isEditMode && (
              <div className="bg-amber-50/95 backdrop-blur-md border-t border-amber-200 p-6 sm:p-8 flex flex-col gap-5 animate-[fade-in_0.2s]">
                <div className="flex items-center gap-2 pb-3 border-b border-amber-200/60">
                  <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 grid place-items-center shrink-0">
                    <Camera className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-amber-950 tracking-tight">Carousel Slide Ledger</h4>
                    <p className="text-[10px] text-amber-600 font-medium uppercase tracking-wider">Control visual sliders live</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {images.map((img: any) => (
                    <div key={img.id} className="relative group rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 border-2 border-slate-200/40 shadow-sm hover:shadow-md transition-all duration-300">
                      <img src={img.url} className="w-full h-full object-cover" />
                      <button
                        onClick={() => handleDeleteImage(img.id)}
                        className="absolute inset-0 bg-rose-950/80 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1 font-black text-xs uppercase tracking-wider cursor-pointer"
                      >
                        <Trash2 className="w-4.5 h-4.5" /> Wipe
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mt-2">
                  <input
                    placeholder="Paste picture URL to inject..."
                    className="flex-1 border border-amber-200 rounded-[16px] px-4 py-3 text-sm font-semibold bg-white outline-none shadow-inner"
                    onKeyDown={async (e: any) => {
                      if (e.key === "Enter" && e.target.value.trim()) {
                        await handleAddImage(e.target.value);
                        e.target.value = "";
                      }
                    }}
                  />
                  <div className="text-[10px] text-amber-700 font-bold bg-amber-100/60 px-3.5 rounded-xl flex items-center self-start py-1.5 sm:self-center">Press Enter</div>
                </div>
              </div>
            )}
          </div>

          {/* ==========================================
              💼 TAB 1: ABOUT LIBRARY
             ========================================== */}
          {tab === "About Library" && (
            <div className="space-y-10 animate-[fade-in_0.2s_ease-out]">
              
              {/* OFFICER PROFILE */}
              <Card 
                title="Librarian Message Desk" 
                icon={User}
                className={isEditMode ? "ring-4 ring-amber-500/10 border-amber-200 bg-amber-50/20" : ""}
              >
                {isEditMode ? (
                  <div className="flex flex-col sm:flex-row gap-8 items-start animate-[fade-in_0.15s]">
                    <div className="w-32 h-44 bg-slate-100 border-2 border-amber-200 rounded-[24px] overflow-hidden relative group shadow-sm">
                      <img src={editOfficer.img || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250"} className="w-full h-full object-cover" />
                      <input 
                        placeholder="Paste Img URL"
                        value={editOfficer.img}
                        onChange={(e)=>setEditOfficer({...editOfficer, img:e.target.value})}
                        className="absolute inset-0 opacity-0 bg-amber-950/80 backdrop-blur-sm focus:opacity-100 group-hover:opacity-100 outline-none text-white text-[10px] font-bold p-2 text-center transition"
                      />
                    </div>
                    <div className="flex-1 space-y-4 w-full">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-amber-800 uppercase">Authority Name</label>
                          <input type="text" value={editOfficer.name} onChange={(e)=>setEditOfficer({...editOfficer, name:e.target.value})} className="w-full border-2 bg-white border-amber-200 rounded-xl p-3 text-sm font-bold" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-amber-800 uppercase">Rank Designation</label>
                          <input type="text" value={editOfficer.designation} onChange={(e)=>setEditOfficer({...editOfficer, designation:e.target.value})} className="w-full border-2 bg-white border-amber-200 rounded-xl p-3 text-sm font-bold" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-amber-800 uppercase">Message Content</label>
                        <textarea value={editOfficer.message} onChange={(e)=>setEditOfficer({...editOfficer, message:e.target.value})} className="w-full h-24 border-2 bg-white border-amber-200 rounded-xl p-3 text-sm font-medium resize-none" />
                      </div>
                      <div className="flex justify-end">
                        <button onClick={handleSaveContent} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-amber-950 font-black px-6 py-3.5 rounded-[16px] text-xs uppercase shadow active:scale-95 cursor-pointer transition">
                          <Save className="w-4 h-4" /> Synchronize Profile Message
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <img
                      src={content?.img || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250"}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250";
                      }}
                      className="w-32 h-40 md:w-40 md:h-52 rounded-[24px] object-cover border-2 border-slate-100 shadow-md shrink-0"
                      alt={content?.officerName || "Officer"}
                    />
                    <div className="flex-1">
                      <h4 className="font-display font-black text-xl text-slate-900 tracking-tight mb-1">
                        {content?.officerName || "Librarian"}
                      </h4>
                      <div className="inline-flex bg-indigo-50 border border-indigo-100 text-[oklch(0.42_0.18_265)] font-bold text-xs px-3 py-1.5 rounded-full uppercase tracking-wider mb-4">
                        {content?.designation || "Officer In Charge"}
                      </div>
                      <p className="text-[15px] text-slate-600 leading-relaxed italic bg-slate-50 p-5 rounded-2xl border border-slate-100 font-medium">
                        "{content?.message || "Welcome to the knowledge repository hub."}"
                      </p>
                    </div>
                  </div>
                )}
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* DESCRIPTIONS */}
                <div className="lg:col-span-8 space-y-6">
                  <Card 
                    title="Central Library Overview" 
                    icon={Building}
                    className={isEditMode ? "ring-4 ring-amber-500/10 border-amber-200 bg-amber-50/20" : ""}
                  >
                    {isEditMode ? (
                      <div className="space-y-4 animate-[fade-in_0.15s]">
                        <textarea
                          value={editTexts.aboutText}
                          onChange={(e) => setEditTexts({ ...editTexts, aboutText: e.target.value })}
                          className="w-full h-40 rounded-2xl border-2 border-amber-200 bg-white p-4 text-sm font-medium focus:border-amber-400 outline-none"
                        />
                        <div className="flex justify-end">
                          <button onClick={handleSaveContent} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-amber-950 font-black px-5 py-2.5 rounded-xl text-[11px] uppercase tracking-widest shadow active:scale-95 cursor-pointer transition"><Save className="w-4 h-4" /> Save Overview</button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[15px] text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                        {parsedAbout.aboutText}
                      </p>
                    )}
                  </Card>

                  <Card 
                    title="Building and Infrastructure" 
                    icon={Building}
                    className={isEditMode ? "ring-4 ring-amber-500/10 border-amber-200 bg-amber-50/20" : ""}
                  >
                    {isEditMode ? (
                      <div className="space-y-5 animate-[fade-in_0.15s]">
                        <div>
                          <label className="text-[10px] font-black text-amber-800 uppercase">Infrastructure Narrative</label>
                          <textarea 
                            value={editTexts.infraText} 
                            onChange={(e)=>setEditTexts({...editTexts, infraText:e.target.value})} 
                            className="w-full h-24 border-2 border-amber-200 rounded-xl bg-white p-3 text-sm font-medium outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-black text-amber-800 uppercase">Current Capacity</label>
                            <input 
                              value={editTexts.seatingCurrent} 
                              onChange={(e)=>setEditTexts({...editTexts, seatingCurrent:e.target.value})} 
                              className="w-full border-2 border-amber-200 rounded-xl bg-white p-2.5 text-sm font-bold outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-amber-800 uppercase">Expanded Capacity</label>
                            <input 
                              value={editTexts.seatingExpanded} 
                              onChange={(e)=>setEditTexts({...editTexts, seatingExpanded:e.target.value})} 
                              className="w-full border-2 border-amber-200 rounded-xl bg-white p-2.5 text-sm font-bold outline-none"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button onClick={handleSaveContent} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-amber-950 font-black px-5 py-2.5 rounded-xl text-[11px] uppercase tracking-widest shadow active:scale-95 cursor-pointer transition">
                            <Save className="w-4 h-4" /> Save Infrastructure
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-[15px] text-slate-600 leading-relaxed font-medium mb-5 whitespace-pre-line">
                          {parsedAbout.infraText}
                        </p>
                        <div className="bg-slate-50 border border-slate-150 rounded-[24px] p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-inner">
                          <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[oklch(0.42_0.18_265)] flex items-center justify-center text-xl shrink-0 shadow-sm">🪑</div>
                            <div>
                              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Floor Metrics</div>
                              <h4 className="font-black text-slate-800 text-[15px]">Current Seating Configuration</h4>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 bg-white border border-slate-200/60 rounded-xl px-4.5 py-2 shadow-sm">
                            <span className="text-lg font-black text-slate-800">{parsedAbout.seatingCurrent}</span>
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                            <span className="text-lg font-black text-[oklch(0.42_0.18_265)]">{parsedAbout.seatingExpanded}</span>
                            <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded uppercase tracking-widest">Expansion</span>
                          </div>
                        </div>
                      </>
                    )}
                  </Card>
                </div>

                {/* WORKING HOURS */}
                <div className="lg:col-span-4 h-full">
                  <Card title="Working Hours" icon={Clock} className={isEditMode ? "h-full ring-4 ring-amber-500/10 bg-amber-50/20 border-amber-200" : "h-full"}>
                    {isEditMode ? (
                      <div className="space-y-4 animate-[fade-in_0.15s]">
                        <div>
                          <label className="text-[9px] font-black text-amber-800 uppercase">Weekdays (e.g. Mon-Sat)</label>
                          <input value={editTexts.workingDays} onChange={(e)=>setEditTexts({...editTexts, workingDays:e.target.value})} className="w-full border bg-white text-xs p-2.5 rounded font-bold" />
                        </div>
                        <div>
                          <label className="text-[9px] font-black text-amber-800 uppercase">Active Time Windows</label>
                          <input value={editTexts.workingTime} onChange={(e)=>setEditTexts({...editTexts, workingTime:e.target.value})} className="w-full border bg-white text-xs p-2.5 rounded font-bold" />
                        </div>
                        <div>
                          <label className="text-[9px] font-black text-amber-800 uppercase">Transactional Concludes (e.g. Sunday)</label>
                          <input value={editTexts.transactionTime} onChange={(e)=>setEditTexts({...editTexts, transactionTime:e.target.value})} className="w-full border bg-white text-xs p-2.5 rounded font-bold" placeholder="Sunday window..." />
                        </div>
                        <button onClick={handleSaveContent} className="w-full bg-amber-500 text-amber-950 font-black text-xs p-3 rounded-xl uppercase cursor-pointer shadow hover:bg-amber-600">Save Schedule</button>
                      </div>
                    ) : (
                      <div className="space-y-3.5 mt-1">
                        <div className="flex justify-between items-center text-sm bg-slate-50 border p-4 rounded-2xl shadow-inner">
                          <span className="font-black text-slate-800">{content?.workingDays || "Mon - Sat"}</span>
                          <span className="text-[oklch(0.42_0.18_265)] font-black text-xs tracking-wider bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg shadow-sm">{content?.workingTime || "08:00 AM - 08:00 PM"}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm bg-slate-50 border p-4 rounded-2xl shadow-inner">
                          <span className="font-black text-slate-800">Sunday Schedule</span>
                          <span className="text-slate-600 text-xs font-black tracking-wider">{content?.transactionTime || "09:00 AM - 01:00 PM"}</span>
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-100/80">
                          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-center gap-3 shadow-sm">
                            <Clock className="w-5 h-5 text-[oklch(0.42_0.18_265)] shrink-0" />
                            <p className="text-[11px] text-slate-600 font-bold leading-relaxed">Transactional issuance services conclude 1 hour prior to closure windows.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              </div>

              {/* LIBRARY SECTIONS INTERACTIVE */}
              <Card 
                title="Infrastructure Divisions" 
                subtitle="Active mapping of physical stacks and reading halls"
                icon={Building} 
                className={isEditMode ? "ring-2 ring-amber-300" : ""}
              >
                <SectionsTableEditable 
                  data={sections} 
                  isEdit={isEditMode} 
                  onRefetch={() => router.invalidate()} 
                />
              </Card>
            </div>
          )}

          {/* ==========================================
              📚 TAB 2: TITLES & VOLUMES
             ========================================== */}
          {tab === "Titles & Volumes" && (
            <div className="animate-[fade-in_0.2s_ease-out]">
              <Card 
                title="Branch Wise Collection Metrics" 
                subtitle="Registered inventory mapping across curricular streams"
                icon={BookOpen}
                className={isEditMode ? "ring-2 ring-amber-300" : ""}
              >
                <StatsTableEditable 
                  data={titleStats} 
                  category="titles" 
                  header1="Curricular Branch" 
                  header2="Title Count" 
                  header3="Volumes Logged" 
                  isEdit={isEditMode} 
                  onRefetch={() => router.invalidate()} 
                />
              </Card>
            </div>
          )}

          {/* ==========================================
              📰 TAB 3: PERIODICALS
             ========================================== */}
          {tab === "Periodicals" && (
            <div className="space-y-10 animate-[fade-in_0.2s_ease-out]">
              <Card 
                title="Academic Periodical Subscription Logs" 
                subtitle="Mapping of daily/weekly/monthly academic feeds"
                icon={Newspaper}
                className={isEditMode ? "ring-2 ring-amber-300" : ""}
              >
                <StatsTableEditable 
                  data={periodicals} 
                  category="periodicals" 
                  header1="Academic Branch" 
                  header2="Subscription Ledger Count" 
                  header3="" 
                  isEdit={isEditMode} 
                  onRefetch={() => router.invalidate()} 
                />
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card 
                  title="Curated Periodical Magazines" 
                  subtitle="Logistics registry for campus leisure reading"
                  icon={Newspaper}
                  className={isEditMode ? "ring-2 ring-amber-300" : ""}
                >
                  <MetaListEditable 
                    data={magazines} 
                    category="magazine" 
                    isEdit={isEditMode} 
                    onRefetch={() => router.invalidate()} 
                  />
                </Card>

                <Card 
                  title="Daily Press & Newspapers" 
                  subtitle="Current active daily feed subscriptions"
                  icon={Newspaper}
                  className={isEditMode ? "ring-2 ring-amber-300" : ""}
                >
                  <MetaListEditable 
                    data={newspapers} 
                    category="newspaper" 
                    isEdit={isEditMode} 
                    onRefetch={() => router.invalidate()} 
                  />
                </Card>
              </div>
            </div>
          )}

          {/* ==========================================
              🖥️ TAB 4: DIGITAL LIBRARY
             ========================================== */}
          {tab === "Digital Library" && (
            <div className="space-y-10 animate-[fade-in_0.2s_ease-out]">
              <Card 
                title="Digital Repository Infrastructure" 
                icon={Monitor}
                className={isEditMode ? "ring-4 ring-amber-500/10 bg-amber-50/20 border-amber-200" : ""}
              >
                {isEditMode ? (
                  <div className="space-y-4 animate-[fade-in_0.15s]">
                    <textarea 
                      value={editTexts.digitalDescription}
                      onChange={(e)=>setEditTexts({...editTexts, digitalDescription:e.target.value})}
                      className="w-full h-36 border-2 border-amber-200 bg-white rounded-2xl p-4 outline-none text-sm font-medium focus:border-amber-400"
                    />
                    <div className="flex justify-end">
                      <button onClick={handleSaveContent} className="bg-amber-500 text-amber-950 font-black px-6 py-2.5 rounded-xl text-[11px] uppercase tracking-wider shadow cursor-pointer"><Save className="w-4 h-4 inline mr-2 mb-0.5" /> Save Details</button>
                    </div>
                  </div>
                ) : (
                  <p className="text-[15px] text-slate-600 font-medium leading-relaxed">
                    {content?.digitalDescription || "Comprehensive digital portals and desktop computing stations equipped with full broadband licenses."}
                  </p>
                )}
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                  <Card 
                    title="Authorized Digital E-Gateways" 
                    subtitle="Registered portals providing remote resource logins"
                    icon={Monitor} 
                    className={isEditMode ? "h-full ring-2 ring-amber-300" : "h-full"}
                  >
                    <MetaListEditable 
                      data={digitalItems} 
                      category="digital" 
                      isEdit={isEditMode} 
                      onRefetch={() => router.invalidate()} 
                    />
                  </Card>
                </div>

                <div className="lg:col-span-4">
                  <Card title="Aggregated Volume Scale" icon={BookOpen} className="flex flex-col h-full shadow-[0_15px_40px_rgba(0,0,0,0.04)]">
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/40 border-2 border-indigo-200/60 rounded-[28px] p-7 flex-1 flex flex-col justify-center items-center text-center shadow-inner mt-1 select-none">
                      <span className="text-6xl font-black text-[oklch(0.42_0.18_265)] tracking-tighter drop-shadow-sm mb-2">449</span>
                      <div className="text-xs font-black text-indigo-900 uppercase tracking-[0.2em] border-b border-indigo-200 pb-2 mb-2 w-full">E-Resource Hubs</div>
                      <p className="text-[10px] text-indigo-700/70 font-bold max-w-[180px] leading-relaxed">Includes Integrated portals, Delnet indices, and digital literature stacks.</p>
                    </div>
                  </Card>
                </div>
              </div>

              <Card title="Global Subscribed E-Journal Portals" icon={Newspaper}>
                <div className="grid lg:grid-cols-12 gap-8 items-stretch">
                  <div className="lg:col-span-8 overflow-hidden w-full">
                    <div className="overflow-x-auto no-scrollbar border rounded-2xl">
                      <table className="w-full border-collapse text-left min-w-[450px]">
                        <thead>
                          <tr className="border-b bg-slate-50">
                            <th className="py-3 px-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Academic Department Branch</th>
                            <th className="py-3 px-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Provision Access</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y font-medium text-slate-700 text-sm">
                          {["Electrical & Electronics Engineering", "Mechanical Engineering", "Electronics & Communication", "Computer Science & Eng", "Information Technology", "Civil Engineering"].map((dept, i)=>(
                            <tr key={i} className="hover:bg-slate-50/50 transition">
                              <td className="py-3 px-5 font-bold text-slate-800">{dept}</td>
                              <td className="py-3 px-5"><span className="inline-flex px-2 py-1 text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 rounded shadow-sm">Subscribed Access</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="lg:col-span-4 h-full">
                    <div className="bg-[oklch(0.42_0.18_265)] text-white rounded-[32px] p-8 text-center flex flex-col items-center justify-center h-full shadow-xl shadow-indigo-950/10 relative overflow-hidden">
                      <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mb-4 shadow">
                          <Newspaper className="w-6 h-6 text-indigo-50" />
                        </div>
                        <span className="text-6xl font-black tracking-tighter drop-shadow-sm mb-1">131</span>
                        <div className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-100 mb-3">Total active e-journals</div>
                        <div className="h-1.5 w-10 rounded-full bg-white/30 mb-4" />
                        <p className="text-[10px] text-indigo-50/80 font-medium max-w-[160px]">Authorized institutional gateway licenses across streams.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* ==========================================
              👥 TAB 5: TEAM
             ========================================== */}
          {tab === "Team" && (
            <div className="animate-[fade-in_0.2s_ease-out]">
              <Card 
                title="Supporting Team Registry" 
                subtitle="Active directory of registered personnel facilitating systems"
                icon={Users}
                className={isEditMode ? "ring-2 ring-amber-300" : ""}
              >
                <TeamTableEditable 
                  data={team} 
                  isEdit={isEditMode} 
                  onRefetch={() => router.invalidate()} 
                />
              </Card>
            </div>
          )}

          {/* ==========================================
              🎥 TAB 6: EKEEDA
             ========================================== */}
          {tab === "Ekeeda Video Library" && (
            <div className="animate-[fade-in_0.2s_ease-out]">
              <Card title="Integrated Academic E-Video Desk" icon={Video} className="text-center py-16 hover:shadow-[0_25px_60px_rgba(0,0,0,0.05)] duration-200">
                <div className="max-w-xl mx-auto">
                  <div className="w-20 h-20 rounded-[24px] bg-indigo-50 border-2 border-indigo-100 text-[oklch(0.42_0.18_265)] grid place-items-center mx-auto shadow-xl mb-6 transition duration-200 hover:rotate-6 hover:scale-110">
                    <Video className="w-9 h-9 animate-pulse" />
                  </div>
                  <h2 className="font-display text-3xl font-black text-slate-900 tracking-tight mb-4">
                    Ekeeda Video Desk
                  </h2>
                  <p className="text-slate-600 leading-relaxed font-medium mb-8 text-base">
                    Authorized integration hub for curated digital visual lectures, academic streaming archives, and structured university level e-learning tutorials.
                  </p>
                  <button className="px-8 py-4 rounded-[20px] bg-[oklch(0.42_0.18_265)] hover:bg-slate-900 text-white font-black uppercase text-xs tracking-widest shadow-lg hover:shadow-indigo-500/20 transition duration-300 active:scale-95 cursor-pointer">
                    Launch Digital Console
                  </button>
                </div>
              </Card>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}

/* ---------- SHARED UI WRAPPERS ---------- */

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
            src={img}
            alt={`Slide view ${i + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity transform duration-300 ${
              currentIndex === i ? "opacity-100 z-10 scale-100" : "opacity-0 z-0"
            }`}
            style={{ transitionProperty: "opacity, transform", transitionDuration: "1.2s" }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallback;
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent z-20" />

      {images.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
            className="absolute left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 hover:bg-white/90 text-white hover:text-slate-950 grid place-items-center opacity-0 group-hover:opacity-100 hover:scale-110 transition duration-300 cursor-pointer z-30 text-lg"
          >
            ‹
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
            className="absolute right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 hover:bg-white/90 text-white hover:text-slate-950 grid place-items-center opacity-0 group-hover:opacity-100 hover:scale-110 transition duration-300 cursor-pointer z-30 text-lg"
          >
            ›
          </button>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 z-30 bg-slate-950/10 backdrop-blur px-2.5 py-1 rounded-full">
            {images.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-200 rounded-full h-1.5 cursor-pointer ${
                  currentIndex === index ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- INLINE EDITABLE COMPONENT LISTINGS ---------- */

function SectionsTableEditable({ data, isEdit, onRefetch }: any) {
  const [form, setForm] = useState({ section: "", area: "", location: "" });

  async function handleAdd() {
    if (!form.section.trim()) return;
    const tId = toast.loading("Registering division Stack...");
    try {
      await createSection({ data: { ...form } });
      toast.success("Logged successfully!", { id: tId });
      setForm({ section: "", area: "", location: "" });
      onRefetch();
    } catch {
      toast.error("Store fail.", { id: tId });
    }
  }

  async function handleDelete(id: number) {
    const tId = toast.loading("Deregistering infrastructure node...");
    try {
      await deleteSection({ data: { id } });
      toast.success("Purged!", { id: tId });
      onRefetch();
    } catch {
      toast.error("Failed.", { id: tId });
    }
  }

  return (
    <div className="space-y-6 w-full max-w-full">
      {isEdit && (
        <div className="bg-amber-50/80 border-2 border-amber-200 p-5 rounded-[24px] grid grid-cols-1 sm:grid-cols-4 gap-4 items-end shadow-inner animate-[fade-in_0.15s]">
          <div>
            <label className="text-[10px] font-black uppercase text-amber-800 tracking-widest">Stack Section</label>
            <input type="text" value={form.section} onChange={(e)=>setForm({...form, section:e.target.value})} className="w-full border-2 bg-white border-amber-200 px-3.5 py-2 rounded-xl text-sm font-semibold" placeholder="e.g. Reading Hall"/>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-amber-800 tracking-widest">Area Coverage</label>
            <input type="text" value={form.area} onChange={(e)=>setForm({...form, area:e.target.value})} className="w-full border-2 bg-white border-amber-200 px-3.5 py-2 rounded-xl text-sm font-semibold" placeholder="e.g. 250 sq.m"/>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-amber-800 tracking-widest">Floor Location</label>
            <input type="text" value={form.location} onChange={(e)=>setForm({...form, location:e.target.value})} className="w-full border-2 bg-white border-amber-200 px-3.5 py-2 rounded-xl text-sm font-semibold" placeholder="e.g. First Floor"/>
          </div>
          <button onClick={handleAdd} className="bg-slate-950 hover:bg-amber-600 text-white font-black py-3.5 rounded-[14px] text-xs uppercase shadow flex gap-2 justify-center cursor-pointer active:scale-95 transition duration-300"><Plus className="w-4 h-4"/> Register</button>
        </div>
      )}

      <div className="overflow-x-auto no-scrollbar w-full border border-slate-200/60 rounded-2xl">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-slate-50 border-b">
              <th className="py-4 px-5 text-[10px] font-black uppercase tracking-wider text-slate-400">Infrastructure Stack</th>
              <th className="py-4 px-5 text-[10px] font-black uppercase tracking-wider text-slate-400">Square Footage Area</th>
              <th className="py-4 px-5 text-[10px] font-black uppercase tracking-wider text-slate-400">Level Location</th>
              {isEdit && <th className="py-4 px-5 text-[10px] font-black uppercase tracking-wider text-slate-400">Wipe</th>}
            </tr>
          </thead>
          <tbody className="divide-y text-sm text-slate-800 font-medium">
            {data.map((s: any, i: number)=>(
              <tr key={s.id || i} className="hover:bg-slate-50/40 transition duration-300">
                <td className="py-3.5 px-5 font-bold">
                  {isEdit ? (
                    <InlineCellEdit val={s.section} onCommit={async (n)=> { await updateSection({data:{...s, section:n}}); onRefetch(); }} />
                  ) : s.section}
                </td>
                <td className="py-3.5 px-5">
                  {isEdit ? (
                    <InlineCellEdit val={s.area} onCommit={async (n)=> { await updateSection({data:{...s, area:n}}); onRefetch(); }} />
                  ) : s.area}
                </td>
                <td className="py-3.5 px-5">
                  {isEdit ? (
                    <InlineCellEdit val={s.location} onCommit={async (n)=> { await updateSection({data:{...s, location:n}}); onRefetch(); }} />
                  ) : (
                    <span className="inline-flex bg-slate-100 px-2 py-0.5 rounded font-bold text-xs text-slate-500">{s.location}</span>
                  )}
                </td>
                {isEdit && (
                  <td className="py-3.5 px-5">
                    <button onClick={()=>handleDelete(s.id)} className="text-slate-300 hover:text-rose-600 hover:bg-rose-50 w-8 h-8 rounded-lg grid place-items-center transition cursor-pointer"><Trash2 className="w-4 h-4"/></button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatsTableEditable({ data, category, header1, header2, header3, isEdit, onRefetch }: any) {
  const [form, setForm] = useState({ name: "", value1: "", value2: "" });

  async function handleAdd() {
    if (!form.name.trim()) return;
    const tId = toast.loading("Storing record...");
    try {
      await createStat({ data: { category, ...form } });
      toast.success("Added successfully!", { id: tId });
      setForm({ name: "", value1: "", value2: "" });
      onRefetch();
    } catch {
      toast.error("Fail.", { id: tId });
    }
  }

  async function handleDelete(id: number) {
    const tId = toast.loading("Purging stats ledger...");
    try {
      await deleteStat({ data: { id } });
      toast.success("Purged!", { id: tId });
      onRefetch();
    } catch {
      toast.error("Failed.", { id: tId });
    }
  }

  return (
    <div className="space-y-6 w-full max-w-full">
      {isEdit && (
        <div className="bg-amber-50/80 border-2 border-amber-200 p-5 rounded-[24px] grid grid-cols-1 sm:grid-cols-4 gap-4 items-end shadow-inner animate-[fade-in_0.15s]">
          <div>
            <label className="text-[10px] font-black uppercase text-amber-800 tracking-widest">{header1}</label>
            <input type="text" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} className="w-full border-2 bg-white border-amber-200 px-3 py-2 rounded-xl text-sm font-bold" />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-amber-800 tracking-widest">{header2}</label>
            <input type="text" value={form.value1} onChange={(e)=>setForm({...form, value1:e.target.value})} className="w-full border-2 bg-white border-amber-200 px-3 py-2 rounded-xl text-sm font-bold" />
          </div>
          {header3 && (
            <div>
              <label className="text-[10px] font-black uppercase text-amber-800 tracking-widest">{header3}</label>
              <input type="text" value={form.value2} onChange={(e)=>setForm({...form, value2:e.target.value})} className="w-full border-2 bg-white border-amber-200 px-3 py-2 rounded-xl text-sm font-bold" />
            </div>
          )}
          <button onClick={handleAdd} className="bg-slate-950 hover:bg-amber-600 text-white font-black py-3.5 rounded-[14px] text-xs uppercase shadow flex gap-2 justify-center cursor-pointer transition"><Plus className="w-4 h-4"/> Log Entry</button>
        </div>
      )}

      <div className="overflow-x-auto no-scrollbar w-full border border-slate-200/60 rounded-2xl">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="bg-slate-50 border-b">
              <th className="py-4 px-5 text-[10px] font-black uppercase tracking-widest text-slate-400">{header1}</th>
              <th className="py-4 px-5 text-[10px] font-black uppercase tracking-widest text-slate-400">{header2}</th>
              {header3 && <th className="py-4 px-5 text-[10px] font-black uppercase tracking-widest text-slate-400">{header3}</th>}
              {isEdit && <th className="py-4 px-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y text-[14.5px] font-bold text-slate-800">
            {data.map((item: any, i: number)=>(
              <tr key={item.id || i} className="hover:bg-slate-50/30 transition">
                <td className="py-3.5 px-5 text-slate-900">
                  {isEdit ? (
                    <InlineCellEdit val={item.name} onCommit={async (n)=> { await updateStat({data:{...item, name:n}}); onRefetch(); }} />
                  ) : item.name}
                </td>
                <td className="py-3.5 px-5 text-[oklch(0.42_0.18_265)]">
                  {isEdit ? (
                    <InlineCellEdit val={item.value1} onCommit={async (n)=> { await updateStat({data:{...item, value1:n}}); onRefetch(); }} />
                  ) : item.value1}
                </td>
                {header3 && (
                  <td className="py-3.5 px-5 text-slate-600">
                    {isEdit ? (
                      <InlineCellEdit val={item.value2} onCommit={async (n)=> { await updateStat({data:{...item, value2:n}}); onRefetch(); }} />
                    ) : item.value2}
                  </td>
                )}
                {isEdit && (
                  <td className="py-3.5 px-5">
                    <button onClick={()=>handleDelete(item.id)} className="text-slate-300 hover:text-rose-600 hover:bg-rose-50 w-8 h-8 rounded-lg grid place-items-center transition cursor-pointer"><Trash2 className="w-4 h-4"/></button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MetaListEditable({ data, category, isEdit, onRefetch }: any) {
  const [newVal, setNewVal] = useState("");

  async function handleAdd() {
    if (!newVal.trim()) return;
    const tId = toast.loading("Registering meta pill...");
    try {
      await createMeta({ data: { category, name: newVal } });
      toast.success("Logged!", { id: tId });
      setNewVal("");
      onRefetch();
    } catch {
      toast.error("Store fail.", { id: tId });
    }
  }

  async function handleDelete(id: number) {
    const tId = toast.loading("Deregistering record...");
    try {
      await deleteMeta({ data: { id } });
      toast.success("Deregistered!", { id: tId });
      onRefetch();
    } catch {
      toast.error("Fail.", { id: tId });
    }
  }

  return (
    <div className="space-y-6 w-full">
      {isEdit && (
        <div className="flex gap-2.5 bg-amber-50/80 border-2 border-amber-200 rounded-[18px] p-2.5 shadow-inner max-w-md">
          <input type="text" placeholder="Type entry name..." value={newVal} onChange={(e)=>setNewVal(e.target.value)} onKeyDown={(e)=>e.key === "Enter" && handleAdd()} className="flex-1 border-2 border-amber-200 bg-white px-4 py-2.5 rounded-xl outline-none text-sm font-bold" />
          <button onClick={handleAdd} className="bg-slate-950 hover:bg-amber-600 text-white font-black px-5 rounded-xl text-xs uppercase transition cursor-pointer shadow">Add</button>
        </div>
      )}
      <div className={category === "digital" ? "grid grid-cols-1 sm:grid-cols-2 gap-4 w-full" : "grid grid-cols-1 gap-3 w-full"}>
        {data.map((m: any, i: number)=>(
          <div key={m.id || i} className={`flex items-center justify-between px-4.5 py-4 border rounded-2xl duration-200 transition-all ${
            isEdit ? "bg-amber-50/40 border-amber-200 shadow-sm scale-[1.01]" : "bg-slate-50/80 border-slate-100 hover:bg-white hover:border-slate-200 hover:shadow-md group"
          }`}>
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${isEdit ? "bg-amber-100 text-amber-700" : "bg-white border border-slate-200/50 text-[oklch(0.42_0.18_265)] group-hover:scale-110 transition-transform"}`}>
                <Monitor className="w-4 h-4" />
              </div>
              {isEdit ? (
                <InlineCellEdit val={m.name} onCommit={async (n)=> { await updateMeta({data:{...m, name:n}}); onRefetch(); }} />
              ) : (
                <span className="text-[14.5px] font-bold text-slate-800 truncate">{m.name}</span>
              )}
            </div>
            {isEdit && (
              <button onClick={()=>handleDelete(m.id)} className="w-7 h-7 rounded-full bg-amber-100/60 hover:bg-rose-600 text-amber-800 hover:text-white flex items-center justify-center transition cursor-pointer shrink-0"><X className="w-3.5 h-3.5"/></button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamTableEditable({ data, isEdit, onRefetch }: any) {
  const [form, setForm] = useState({ name: "", qualification: "", designation: "" });

  async function handleAdd() {
    if (!form.name.trim()) return;
    const tId = toast.loading("Enrolling support member...");
    try {
      await createTeam({ data: { ...form } });
      toast.success("Enrolled!", { id: tId });
      setForm({ name: "", qualification: "", designation: "" });
      onRefetch();
    } catch {
      toast.error("Store fail.", { id: tId });
    }
  }

  async function handleDelete(id: number) {
    const tId = toast.loading("Purging roster ledger file...");
    try {
      await deleteTeam({ data: { id } });
      toast.success("Purged!", { id: tId });
      onRefetch();
    } catch {
      toast.error("Fail.", { id: tId });
    }
  }

  return (
    <div className="space-y-6 w-full max-w-full">
      {isEdit && (
        <div className="bg-amber-50/80 border-2 border-amber-200 p-5 rounded-[24px] grid grid-cols-1 sm:grid-cols-4 gap-4 items-end shadow-inner animate-[fade-in_0.15s]">
          <div>
            <label className="text-[10px] font-black uppercase text-amber-800 tracking-widest">Personnel Name</label>
            <input type="text" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} className="w-full border-2 bg-white border-amber-200 px-3 py-2 rounded-xl text-sm font-bold" />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-amber-800 tracking-widest">Academics/Qualification</label>
            <input type="text" value={form.qualification} onChange={(e)=>setForm({...form, qualification:e.target.value})} className="w-full border-2 bg-white border-amber-200 px-3 py-2 rounded-xl text-sm font-bold" />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-amber-800 tracking-widest">Rank/Designation</label>
            <input type="text" value={form.designation} onChange={(e)=>setForm({...form, designation:e.target.value})} className="w-full border-2 bg-white border-amber-200 px-3 py-2 rounded-xl text-sm font-bold" />
          </div>
          <button onClick={handleAdd} className="bg-slate-950 hover:bg-amber-600 text-white font-black py-3.5 rounded-[14px] text-xs uppercase shadow flex gap-2 justify-center cursor-pointer transition"><Plus className="w-4 h-4"/> Log Team</button>
        </div>
      )}

      <div className="overflow-x-auto no-scrollbar w-full border border-slate-200/60 rounded-2xl">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-slate-50 border-b">
              <th className="py-4 px-5 text-[10px] font-black uppercase tracking-wider text-slate-400">Staff Authority Name</th>
              <th className="py-4 px-5 text-[10px] font-black uppercase tracking-wider text-slate-400">Credentials / Qualification</th>
              <th className="py-4 px-5 text-[10px] font-black uppercase tracking-wider text-slate-400">Designation Station</th>
              {isEdit && <th className="py-4 px-5 text-[10px] font-black uppercase tracking-wider text-slate-400">Wipe</th>}
            </tr>
          </thead>
          <tbody className="divide-y text-[14.5px] font-bold text-slate-800">
            {data.map((item: any, i: number)=>(
              <tr key={item.id || i} className="hover:bg-slate-50/40 transition duration-300">
                <td className="py-4 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 border text-indigo-600 font-black grid place-items-center text-[11px] shrink-0">{item.name?.[0]?.toUpperCase()}</div>
                    {isEdit ? (
                      <InlineCellEdit val={item.name} onCommit={async (n)=> { await updateTeam({data:{...item, name:n}}); onRefetch(); }} />
                    ) : item.name}
                  </div>
                </td>
                <td className="py-4 px-5 text-slate-600">
                  {isEdit ? (
                    <InlineCellEdit val={item.qualification} onCommit={async (n)=> { await updateTeam({data:{...item, qualification:n}}); onRefetch(); }} />
                  ) : item.qualification}
                </td>
                <td className="py-4 px-5">
                  {isEdit ? (
                    <InlineCellEdit val={item.designation} onCommit={async (n)=> { await updateTeam({data:{...item, designation:n}}); onRefetch(); }} />
                  ) : (
                    <span className="inline-flex bg-indigo-50 border border-indigo-100/50 text-[oklch(0.42_0.18_265)] px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider shadow-sm">{item.designation}</span>
                  )}
                </td>
                {isEdit && (
                  <td className="py-4 px-5">
                    <button onClick={()=>handleDelete(item.id)} className="text-slate-300 hover:text-rose-600 hover:bg-rose-50 w-9 h-9 rounded-lg grid place-items-center transition cursor-pointer"><Trash2 className="w-4.5 h-4.5"/></button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* --- CORE CELL INTERACTIVE EDITS --- */
function InlineCellEdit({ val, onCommit }: { val: string; onCommit: (newVal: string) => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  const [localVal, setLocalVal] = useState(val);

  async function handleBlur() {
    setEditing(false);
    if (localVal.trim() !== val) {
      const tId = toast.loading("Modifying registry...");
      try {
        await onCommit(localVal.trim());
        toast.success("Updated!", { id: tId });
      } catch {
        toast.error("Failed.", { id: tId });
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
        className="border-2 border-amber-400 bg-white rounded-lg px-2 py-1 text-xs font-black text-amber-950 w-full outline-none shadow"
      />
    );
  }

  return (
    <span
      onClick={() => setEditing(true)}
      className="border-b-2 border-dashed border-amber-500/40 hover:bg-amber-100/60 hover:border-amber-500/80 px-1 rounded cursor-pointer transition duration-300 text-slate-800"
    >
      {val || <span className="text-amber-700/30 italic">[Empty]</span>}
    </span>
  );
}

