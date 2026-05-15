import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import guestImg from "@/assets/guestoffice.jpg";
import { getPageContent, updatePageSection } from "@/funcs/site.server";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import { Save, Lock, Edit, Image as ImageIcon } from "lucide-react";

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
    <div className="bg-white min-h-screen animate-[fade-in_0.5s_ease-out] pb-24 relative">
      {isEditMode && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-white font-black py-2 px-6 sticky top-0 z-[100] shadow-lg flex items-center justify-center gap-2 border-b border-amber-700/20 backdrop-blur-md text-[10px] uppercase tracking-widest">
          <Lock className="w-3 h-3 animate-pulse" />
          <span>Guest House Portal Editorial</span>
        </div>
      )}

      <section className="max-w-4xl mx-auto px-4 py-10 space-y-8 text-slate-800">
        {/* HERO CONTROL */}
        <div className="border-b border-primary/20 pb-3 flex items-center justify-between">
          {isEditMode ? (
            <div className="flex-1 flex items-center gap-3 bg-amber-50/40 border border-amber-200 p-3 rounded-2xl">
              <input
                value={editTexts.heroTitle}
                onChange={(e) =>
                  setEditTexts({ ...editTexts, heroTitle: e.target.value })
                }
                className="flex-1 bg-white border border-amber-200 px-3 py-1.5 rounded-xl font-extrabold text-xl outline-none text-indigo-950 focus:border-amber-400"
              />
              <button
                onClick={() => handleSaveSection("hero")}
                className="bg-amber-500 text-amber-950 px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider shadow cursor-pointer active:scale-95 transition"
              >
                Save
              </button>
            </div>
          ) : (
            <h1 className="text-3xl font-black text-primary tracking-tight">
              {heroRec?.title || DEFAULTS.heroTitle}
            </h1>
          )}
        </div>

        <div className="space-y-8">
          {/* INTRO BOX */}
          {isEditMode ? (
            <div className="p-5 bg-amber-50/40 border border-amber-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                <span className="text-[9px] font-black text-amber-800 uppercase tracking-wider">
                  Intro Explainer
                </span>
                <button
                  onClick={() => handleSaveSection("intro")}
                  className="bg-amber-500 text-amber-950 px-3 py-1 rounded-lg text-[9px] font-black uppercase cursor-pointer"
                >
                  Save
                </button>
              </div>
              <textarea
                value={editTexts.intro}
                onChange={(e) =>
                  setEditTexts({ ...editTexts, intro: e.target.value })
                }
                className="w-full h-24 bg-white border border-amber-200 p-3 rounded-xl text-sm font-medium outline-none"
              />
            </div>
          ) : (
            <p className="text-base leading-relaxed text-slate-600 text-justify font-medium bg-indigo-50/10 p-5 rounded-2xl border border-indigo-100/30">
              {introRec?.content || DEFAULTS.intro}
            </p>
          )}

          {/* FEATURES BLOCK */}
          {isEditMode ? (
            <div className="p-5 bg-amber-50/40 border border-amber-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                <span className="text-[9px] font-black text-amber-800 uppercase tracking-wider">
                  Features Module Control
                </span>
                <button
                  onClick={() => handleSaveSection("features")}
                  className="bg-amber-500 text-amber-950 px-3 py-1 rounded-lg text-[9px] font-black uppercase cursor-pointer"
                >
                  Save Block
                </button>
              </div>
              <input
                value={editTexts.featuresTitle}
                onChange={(e) =>
                  setEditTexts({ ...editTexts, featuresTitle: e.target.value })
                }
                className="w-full bg-white border border-amber-200 px-3 py-2 rounded-xl text-sm font-bold outline-none"
                placeholder="Features Header..."
              />
              <textarea
                value={editTexts.featuresContent}
                onChange={(e) =>
                  setEditTexts({
                    ...editTexts,
                    featuresContent: e.target.value,
                  })
                }
                className="w-full h-24 bg-white border border-amber-200 p-3 rounded-xl text-sm font-medium outline-none"
                placeholder="Description metrics..."
              />
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 space-y-3 shadow-sm">
              <h3 className="text-indigo-700 font-black text-lg">
                {featuresRec?.title || DEFAULTS.featuresTitle}
              </h3>
              <p className="text-slate-600 text-justify font-medium whitespace-pre-line leading-relaxed">
                {featuresRec?.content || DEFAULTS.featuresContent}
              </p>
            </div>
          )}

          {/* COLLABORATION BLOCK */}
          {isEditMode ? (
            <div className="p-5 bg-amber-50/40 border border-amber-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                <span className="text-[9px] font-black text-amber-800 uppercase tracking-wider">
                  Collaboration Module Control
                </span>
                <button
                  onClick={() => handleSaveSection("collab")}
                  className="bg-amber-500 text-amber-950 px-3 py-1 rounded-lg text-[9px] font-black uppercase cursor-pointer"
                >
                  Save Block
                </button>
              </div>
              <input
                value={editTexts.collabTitle}
                onChange={(e) =>
                  setEditTexts({ ...editTexts, collabTitle: e.target.value })
                }
                className="w-full bg-white border border-amber-200 px-3 py-2 rounded-xl text-sm font-bold outline-none"
                placeholder="Collaboration Header..."
              />
              <textarea
                value={editTexts.collabContent}
                onChange={(e) =>
                  setEditTexts({ ...editTexts, collabContent: e.target.value })
                }
                className="w-full h-24 bg-white border border-amber-200 p-3 rounded-xl text-sm font-medium outline-none"
                placeholder="Collaboration details..."
              />
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 space-y-3 shadow-sm">
              <h3 className="text-indigo-700 font-black text-lg">
                {collabRec?.title || DEFAULTS.collabTitle}
              </h3>
              <p className="text-slate-600 text-justify font-medium whitespace-pre-line leading-relaxed">
                {collabRec?.content || DEFAULTS.collabContent}
              </p>
            </div>
          )}
        </div>

        {/* GUEST HOUSE DISPLAY IMAGE */}
        <div className="pt-6 flex flex-col items-center gap-6">
          <div className="relative group overflow-hidden rounded-[32px] border-2 border-primary/10 shadow-lg w-full max-w-2xl aspect-[16/9]">
            <img
              src={imgRec?.imageUrl || guestImg}
              alt="University Guest House"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-all flex items-end p-6">
              <span className="text-white font-black text-lg tracking-wide uppercase">
                {imgRec?.title || DEFAULTS.imageLabel}
              </span>
            </div>
          </div>

          {isEditMode && (
            <div className="w-full max-w-2xl p-5 bg-amber-50/40 border border-amber-200 rounded-2xl space-y-3.5">
              <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                <span className="text-[9px] font-black text-amber-800 uppercase tracking-wider flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" /> Media Center Controls
                </span>
                <button
                  onClick={() => handleSaveSection("image")}
                  className="bg-amber-500 text-amber-950 px-3.5 py-1.5 rounded-xl text-[9px] font-black uppercase cursor-pointer"
                >
                  Save Photo
                </button>
              </div>
              <div className="space-y-2">
                <input
                  value={editTexts.imageLabel}
                  onChange={(e) =>
                    setEditTexts({ ...editTexts, imageLabel: e.target.value })
                  }
                  placeholder="Overlay Label text (e.g. VIP Suites)"
                  className="w-full bg-white border border-amber-200 px-3 py-2 rounded-xl text-xs font-bold outline-none"
                />
                <input
                  value={editTexts.imageUrl}
                  onChange={(e) =>
                    setEditTexts({ ...editTexts, imageUrl: e.target.value })
                  }
                  placeholder="Direct URL override (optional)..."
                  className="w-full bg-white border border-amber-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none"
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
