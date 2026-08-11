import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import guestImg from "@/assets/guestoffice.jpg";
import { getPageContent, updatePageSection } from "@/funcs/site.server";
import { getAssetUrl } from "@/lib/assets";
import { AdminUpload } from "@/components/AdminEditPanel";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import { 
  Save, 
  Lock, 
  Edit, 
  Image as ImageIcon,
  Building,
  Sparkles,
  HeartHandshake
} from "lucide-react";

export const Route = createFileRoute("/other-amenities/guest-house")({
  loader: async () => await getPageContent({ data: "guest-house" }),
  component: GuestHousePage,
});

const DEFAULTS = {
  heroTitle: "Guest House",
  intro:
    "The JNTU-GV Guest House stands as a testament to the university's commitment to academic hospitality. Designed to be a professional yet comfortable haven, it provides high-quality temporary accommodation for visiting professors, distinguished scholars, administrative officials, and participants of national and international conferences.",
  featuresTitle: "Features and Amenities",
  featuresContent:
    "The facility offers well-appointed rooms, including AC and non-AC suites, meticulously maintained to provide a quiet and productive environment. Its strategic location near the Central Administrative Building and Academic Blocks ensures seamless convenience for guests engaged in official interactions and academic collaborations.",
  collabTitle: "A Hub for Academic Collaboration",
  collabContent:
    "Serving as a \"home away from home,\" the Guest House plays a crucial role in fostering scholarship and networking. With dedicated meeting spaces and a commitment to hospitality, it reflects the university's dedication to supporting all academic pursuits in a prestigious setting.",
  imageUrl: "",
  imageLabel: "JNTU-GV VIP Guest House",
};

function GuestHousePage() {
  const initialData = Route.useLoaderData() as any[];
  const { isEditMode } = useAdmin();
  const router = useRouter();

  const heroRec = initialData.find((r) => r.sectionKey === "hero");
  const introRec = initialData.find((r) => r.sectionKey === "intro");
  const featuresRec = initialData.find((r) => r.sectionKey === "features");
  const collabRec = initialData.find((r) => r.sectionKey === "collab");
  const imgRec = initialData.find((r) => r.sectionKey === "image");

  const [editTexts, setEditTexts] = useState({
    heroTitle: heroRec?.title || DEFAULTS.heroTitle,
    intro: introRec?.content || DEFAULTS.intro,
    featuresTitle: featuresRec?.title || DEFAULTS.featuresTitle,
    featuresContent: featuresRec?.content || DEFAULTS.featuresContent,
    collabTitle: collabRec?.title || DEFAULTS.collabTitle,
    collabContent: collabRec?.content || DEFAULTS.collabContent,
    imageUrl: imgRec?.imageUrl || DEFAULTS.imageUrl,
    imageLabel: imgRec?.title || DEFAULTS.imageLabel,
  });

  useEffect(() => {
    setEditTexts({
      heroTitle: heroRec?.title || DEFAULTS.heroTitle,
      intro: introRec?.content || DEFAULTS.intro,
      featuresTitle: featuresRec?.title || DEFAULTS.featuresTitle,
      featuresContent: featuresRec?.content || DEFAULTS.featuresContent,
      collabTitle: collabRec?.title || DEFAULTS.collabTitle,
      collabContent: collabRec?.content || DEFAULTS.collabContent,
      imageUrl: imgRec?.imageUrl || DEFAULTS.imageUrl,
      imageLabel: imgRec?.title || DEFAULTS.imageLabel,
    });
  }, [initialData]);

  async function handleSaveSection(
    section: "hero" | "intro" | "features" | "collab" | "image"
  ) {
    const tId = toast.loading("Saving guest house details...");
    try {
      if (section === "hero") {
        await updatePageSection({
          data: {
            page: "guest-house",
            sectionKey: "hero",
            title: editTexts.heroTitle,
          },
        });
      } else if (section === "intro") {
        await updatePageSection({
          data: {
            page: "guest-house",
            sectionKey: "intro",
            content: editTexts.intro,
          },
        });
      } else if (section === "features") {
        await updatePageSection({
          data: {
            page: "guest-house",
            sectionKey: "features",
            title: editTexts.featuresTitle,
            content: editTexts.featuresContent,
          },
        });
      } else if (section === "collab") {
        await updatePageSection({
          data: {
            page: "guest-house",
            sectionKey: "collab",
            title: editTexts.collabTitle,
            content: editTexts.collabContent,
          },
        });
      } else if (section === "image") {
        await updatePageSection({
          data: {
            page: "guest-house",
            sectionKey: "image",
            title: editTexts.imageLabel,
            imageUrl: editTexts.imageUrl,
          },
        });
      }

      toast.success("Saved successfully!", { id: tId });
      router.invalidate();
    } catch {
      toast.error("Failed to save updates.", { id: tId });
    }
  }

  return (
    <div className="w-full animate-[fade-in_0.2s_ease-out] pb-12">
      {isEditMode && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-white font-black py-2.5 px-6 sticky top-0 z-[50] shadow-lg flex items-center justify-center gap-2 border-b border-amber-700/20 backdrop-blur-md text-[10px] uppercase tracking-widest rounded-2xl mb-6">
          <Lock className="w-3.5 h-3.5 animate-pulse" />
          <span>Guest House CMS Portal Live</span>
        </div>
      )}

      <div className="space-y-10 max-w-5xl mx-auto">
        
        {/* TOP IMAGE BANNER / CATALOGUE */}
        <div className="relative w-full overflow-hidden rounded-[32px] border border-slate-200/60 shadow-md group bg-slate-200 aspect-[21/9] md:aspect-[16/7] min-h-[200px] max-h-[320px] transition-all duration-200 hover:shadow-lg">
          <img decoding="async" loading="lazy"
            src={getAssetUrl(imgRec?.imageUrl) || guestImg}
            alt="University Guest House"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent flex items-end p-6 md:p-8">
            <span className="text-white font-black font-display text-xl sm:text-2xl tracking-tight drop-shadow">
              {imgRec?.title || DEFAULTS.imageLabel}
            </span>
          </div>
        </div>

        {/* IMAGE CMS */}
        {isEditMode && (
          <div className="w-full p-5 sm:p-6 bg-amber-50/40 border-2 border-amber-200 rounded-[28px] space-y-4 animate-[fade-in_0.15s]">
            <div className="flex items-center justify-between border-b border-amber-200/60 pb-2">
              <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" /> Guest House Visual Editor
              </span>
              <button
                onClick={() => handleSaveSection("image")}
                className="bg-amber-500 text-amber-950 font-black px-4 py-2 rounded-xl text-[10px] uppercase tracking-wide shadow cursor-pointer active:scale-95 transition"
              >
                Save Photo Settings
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-amber-800 uppercase tracking-wider ml-1">Overlay Headline</label>
                <input
                  value={editTexts.imageLabel}
                  onChange={(e) =>
                    setEditTexts({ ...editTexts, imageLabel: e.target.value })
                  }
                  placeholder="Label Text (e.g., VIP Suites)"
                  className="w-full bg-white border border-amber-200 px-3.5 py-2.5 rounded-xl text-xs font-bold outline-none shadow-inner focus:border-amber-400"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-amber-800 uppercase tracking-wider ml-1">Picture</label>
                <AdminUpload
                  value={editTexts.imageUrl}
                  onChange={(newUrl) =>
                    setEditTexts({ ...editTexts, imageUrl: newUrl || "" })
                  }
                  module="amenities"
                  category="guest-house"
                  className="w-full font-semibold"
                />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8">
          
          {/* SECTION 1: OVERVIEW CARD */}
          <Card 
            title={heroRec?.title || DEFAULTS.heroTitle} 
            subtitle="University Hospitality Infrastructure" 
            icon={Building}
            className={isEditMode ? "ring-4 ring-amber-500/10 border-amber-200 bg-amber-50/10" : ""}
          >
            {isEditMode ? (
              <div className="space-y-6 animate-[fade-in_0.15s]">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-amber-800 uppercase tracking-wider ml-1">Display Title</label>
                  <input
                    value={editTexts.heroTitle}
                    onChange={(e) => setEditTexts({ ...editTexts, heroTitle: e.target.value })}
                    className="w-full border bg-white px-3.5 py-2.5 rounded-xl font-bold text-sm text-indigo-950 outline-none focus:border-amber-400 shadow-inner"
                  />
                  <div className="flex justify-end">
                    <button 
                      onClick={() => handleSaveSection("hero")} 
                      className="bg-amber-500 text-amber-950 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase shadow active:scale-95 transition cursor-pointer"
                    >
                      Save Title
                    </button>
                  </div>
                </div>
                
                <hr className="border-amber-200/40" />

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-amber-800 uppercase tracking-wider ml-1">Introductory Explainer Text</label>
                  <textarea
                    value={editTexts.intro}
                    onChange={(e) => setEditTexts({ ...editTexts, intro: e.target.value })}
                    className="w-full h-28 bg-white border border-amber-200 p-4 rounded-xl text-xs font-bold outline-none focus:border-amber-400 shadow-inner"
                  />
                  <div className="flex justify-end">
                    <button 
                      onClick={() => handleSaveSection("intro")} 
                      className="bg-slate-950 hover:bg-amber-600 text-white font-black px-5 py-2.5 rounded-xl text-[9px] uppercase shadow active:scale-95 transition cursor-pointer"
                    >
                      Store Intro Paragraph
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-[15px] leading-relaxed text-slate-600 text-justify font-medium bg-slate-50 border p-6 rounded-2xl shadow-inner italic">
                  "{introRec?.content || DEFAULTS.intro}"
                </p>
              </div>
            )}
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* FEATURES CARD */}
            <Card 
              title="Amenities & Logs" 
              subtitle="Premium Facility Provisions"
              icon={Sparkles}
              className={isEditMode ? "ring-4 ring-amber-500/10 border-amber-200 bg-amber-50/10" : ""}
            >
              {isEditMode ? (
                <div className="space-y-4 animate-[fade-in_0.15s]">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-amber-800 uppercase tracking-wider ml-1">Feature Heading</label>
                    <input
                      value={editTexts.featuresTitle}
                      onChange={(e) => setEditTexts({ ...editTexts, featuresTitle: e.target.value })}
                      className="w-full border bg-white px-3 py-2 rounded-xl font-bold text-xs outline-none shadow-inner focus:border-amber-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-amber-800 uppercase tracking-wider ml-1">Specifications payload</label>
                    <textarea
                      value={editTexts.featuresContent}
                      onChange={(e) => setEditTexts({ ...editTexts, featuresContent: e.target.value })}
                      className="w-full h-28 border bg-white p-3 rounded-xl text-xs font-medium outline-none shadow-inner focus:border-amber-400"
                    />
                  </div>
                  <button 
                    onClick={() => handleSaveSection("features")} 
                    className="w-full bg-amber-500 text-amber-950 hover:bg-amber-600 font-black py-2.5 rounded-xl text-[10px] uppercase tracking-wider shadow active:scale-95 transition cursor-pointer"
                  >
                    Store Amenities Block
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <h4 className="text-indigo-950 font-extrabold text-lg flex items-center gap-2 leading-tight">
                    <Sparkles className="w-4 h-4 text-[oklch(0.42_0.18_265)]" />
                    {featuresRec?.title || DEFAULTS.featuresTitle}
                  </h4>
                  <p className="text-slate-600 font-medium text-[14.5px] leading-relaxed whitespace-pre-line text-justify">
                    {featuresRec?.content || DEFAULTS.featuresContent}
                  </p>
                </div>
              )}
            </Card>

            {/* COLLAB CARD */}
            <Card 
              title="Hospitality Grid" 
              subtitle="Institutional Networking Legacy"
              icon={HeartHandshake}
              className={isEditMode ? "ring-4 ring-amber-500/10 border-amber-200 bg-amber-50/10" : ""}
            >
              {isEditMode ? (
                <div className="space-y-4 animate-[fade-in_0.15s]">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-amber-800 uppercase tracking-wider ml-1">Block Heading</label>
                    <input
                      value={editTexts.collabTitle}
                      onChange={(e) => setEditTexts({ ...editTexts, collabTitle: e.target.value })}
                      className="w-full border bg-white px-3 py-2 rounded-xl font-bold text-xs outline-none shadow-inner focus:border-amber-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-amber-800 uppercase tracking-wider ml-1">Description metrics</label>
                    <textarea
                      value={editTexts.collabContent}
                      onChange={(e) => setEditTexts({ ...editTexts, collabContent: e.target.value })}
                      className="w-full h-28 border bg-white p-3 rounded-xl text-xs font-medium outline-none shadow-inner focus:border-amber-400"
                    />
                  </div>
                  <button 
                    onClick={() => handleSaveSection("collab")} 
                    className="w-full bg-amber-500 text-amber-950 hover:bg-amber-600 font-black py-2.5 rounded-xl text-[10px] uppercase tracking-wider shadow active:scale-95 transition cursor-pointer"
                  >
                    Store Collaboration Block
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <h4 className="text-indigo-950 font-extrabold text-lg flex items-center gap-2 leading-tight">
                    <HeartHandshake className="w-4 h-4 text-[oklch(0.42_0.18_265)]" />
                    {collabRec?.title || DEFAULTS.collabTitle}
                  </h4>
                  <p className="text-slate-600 font-medium text-[14.5px] leading-relaxed whitespace-pre-line text-justify">
                    {collabRec?.content || DEFAULTS.collabContent}
                  </p>
                </div>
              )}
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ---------- SHARED LOCAL WIDGET COMPONENT ---------- */

function Card({ title, subtitle, icon: Icon, children, className = "" }: any) {
  return (
    <div className={`bg-white rounded-[32px] border border-slate-200/60 p-6 md:p-8 hover:shadow-lg transition duration-200 shadow-sm overflow-hidden w-full ${className}`}>
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
