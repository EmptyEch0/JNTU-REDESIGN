import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import img1 from "@/assets/faculity-quaters1.jpg";
import img2 from "@/assets/faculity-quaters2.jpg";
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
  Home
} from "lucide-react";

export const Route = createFileRoute("/other-amenities/staff-quarters")({
  loader: async () => await getPageContent({ data: "staff-quarters" }),
  component: StaffQuartersPage,
});

const DEFAULTS = {
  heroTitle: "Staff Quarters",
  para1:
    "Staff quarters are an integral part of the university's welfare initiatives, providing residential units for the accommodation of employees. The primary goal is to enhance the quality of life for staff members and strategically attract and retain talent by offering a convenient living environment.",
  para2:
    "Equipped with essential facilities such as kitchens, living areas, and utilities, these quarters provide a comfortable and welcoming atmosphere. The proximity of the quarters to the campus enhances accessibility and fosters a strong sense of community among the university's employees, reinforcing a positive organizational culture.",
  blockAImage: "",
  blockALabel: "Residential Block A",
  blockBImage: "",
  blockBLabel: "Residential Block B",
};

function StaffQuartersPage() {
  const initialData = Route.useLoaderData() as any[];
  const { isEditMode } = useAdmin();
  const router = useRouter();

  const heroRec = initialData.find((r) => r.sectionKey === "hero");
  const para1Rec = initialData.find((r) => r.sectionKey === "para1");
  const para2Rec = initialData.find((r) => r.sectionKey === "para2");
  const blockARec = initialData.find((r) => r.sectionKey === "blockA");
  const blockBRec = initialData.find((r) => r.sectionKey === "blockB");

  const [editTexts, setEditTexts] = useState({
    heroTitle: heroRec?.title || DEFAULTS.heroTitle,
    para1: para1Rec?.content || DEFAULTS.para1,
    para2: para2Rec?.content || DEFAULTS.para2,
    blockAImage: blockARec?.imageUrl || DEFAULTS.blockAImage,
    blockALabel: blockARec?.title || DEFAULTS.blockALabel,
    blockBImage: blockBRec?.imageUrl || DEFAULTS.blockBImage,
    blockBLabel: blockBRec?.title || DEFAULTS.blockBLabel,
  });

  useEffect(() => {
    setEditTexts({
      heroTitle: heroRec?.title || DEFAULTS.heroTitle,
      para1: para1Rec?.content || DEFAULTS.para1,
      para2: para2Rec?.content || DEFAULTS.para2,
      blockAImage: blockARec?.imageUrl || DEFAULTS.blockAImage,
      blockALabel: blockARec?.title || DEFAULTS.blockALabel,
      blockBImage: blockBRec?.imageUrl || DEFAULTS.blockBImage,
      blockBLabel: blockBRec?.title || DEFAULTS.blockBLabel,
    });
  }, [initialData]);

  async function handleSaveSection(
    section: "hero" | "para1" | "para2" | "blockA" | "blockB"
  ) {
    const tId = toast.loading("Saving staff quarters details...");
    try {
      if (section === "hero") {
        await updatePageSection({
          data: {
            page: "staff-quarters",
            sectionKey: "hero",
            title: editTexts.heroTitle,
          },
        });
      } else if (section === "para1") {
        await updatePageSection({
          data: {
            page: "staff-quarters",
            sectionKey: "para1",
            content: editTexts.para1,
          },
        });
      } else if (section === "para2") {
        await updatePageSection({
          data: {
            page: "staff-quarters",
            sectionKey: "para2",
            content: editTexts.para2,
          },
        });
      } else if (section === "blockA") {
        await updatePageSection({
          data: {
            page: "staff-quarters",
            sectionKey: "blockA",
            title: editTexts.blockALabel,
            imageUrl: editTexts.blockAImage,
          },
        });
      } else if (section === "blockB") {
        await updatePageSection({
          data: {
            page: "staff-quarters",
            sectionKey: "blockB",
            title: editTexts.blockBLabel,
            imageUrl: editTexts.blockBImage,
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
    <div className="w-full animate-[fade-in_0.5s_ease-out] pb-12">
      {isEditMode && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-white font-black py-2.5 px-6 sticky top-0 z-[50] shadow-lg flex items-center justify-center gap-2 border-b border-amber-700/20 backdrop-blur-md text-[10px] uppercase tracking-widest rounded-2xl mb-6">
          <Lock className="w-3.5 h-3.5 animate-pulse" />
          <span>Staff Quarters CMS Portal Live</span>
        </div>
      )}

      <div className="space-y-10 max-w-5xl mx-auto">

        {/* CORE BODY CARD */}
        <Card 
          title={heroRec?.title || DEFAULTS.heroTitle} 
          subtitle="University Residential Welfare" 
          icon={Home}
          className={isEditMode ? "ring-4 ring-amber-500/10 border-amber-200 bg-amber-50/10" : ""}
        >
          {isEditMode ? (
            <div className="space-y-6 animate-[fade-in_0.3s]">
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

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-amber-800 uppercase tracking-wider ml-1">Explainer Paragraph 1</label>
                  <textarea
                    value={editTexts.para1}
                    onChange={(e) => setEditTexts({ ...editTexts, para1: e.target.value })}
                    className="w-full h-24 bg-white border border-amber-200 p-3.5 rounded-xl text-xs font-bold outline-none focus:border-amber-400 shadow-inner"
                  />
                  <div className="flex justify-end">
                    <button 
                      onClick={() => handleSaveSection("para1")} 
                      className="bg-slate-950 hover:bg-amber-600 text-white font-black px-5 py-2 rounded-xl text-[9px] uppercase shadow active:scale-95 transition cursor-pointer"
                    >
                      Store Paragraph 1
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-amber-800 uppercase tracking-wider ml-1">Explainer Paragraph 2</label>
                  <textarea
                    value={editTexts.para2}
                    onChange={(e) => setEditTexts({ ...editTexts, para2: e.target.value })}
                    className="w-full h-24 bg-white border border-amber-200 p-3.5 rounded-xl text-xs font-bold outline-none focus:border-amber-400 shadow-inner"
                  />
                  <div className="flex justify-end">
                    <button 
                      onClick={() => handleSaveSection("para2")} 
                      className="bg-slate-950 hover:bg-amber-600 text-white font-black px-5 py-2 rounded-xl text-[9px] uppercase shadow active:scale-95 transition cursor-pointer"
                    >
                      Store Paragraph 2
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-[15px] leading-relaxed text-slate-600 text-justify font-medium bg-slate-50 border p-6 rounded-2xl shadow-inner italic">
                "{para1Rec?.content || DEFAULTS.para1}"
              </p>
              <p className="text-[15px] leading-relaxed text-slate-600 text-justify font-medium bg-indigo-50/40 border border-indigo-100/50 p-6 rounded-2xl shadow-sm">
                {para2Rec?.content || DEFAULTS.para2}
              </p>
            </div>
          )}
        </Card>

        {/* GALLERY BLOCKS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
          {/* BLOCK A */}
          <div className="flex flex-col gap-6">
            <div className="relative group overflow-hidden rounded-[32px] border border-slate-200/60 shadow-md aspect-[4/3] bg-slate-200 transition-all duration-500 hover:shadow-lg">
              <img
                src={getAssetUrl(blockARec?.imageUrl) || img1}
                alt={blockARec?.title || DEFAULTS.blockALabel}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-6">
                <span className="text-white font-black font-display text-lg sm:text-xl tracking-wide uppercase drop-shadow">
                  {blockARec?.title || DEFAULTS.blockALabel}
                </span>
              </div>
            </div>

            {isEditMode && (
              <div className="p-5 bg-amber-50/40 border-2 border-amber-200 rounded-[28px] space-y-3.5 animate-[fade-in_0.3s]">
                <div className="flex items-center justify-between border-b border-amber-200/60 pb-2">
                  <span className="text-[9px] font-black text-amber-800 uppercase flex items-center gap-1 tracking-wider">
                    <ImageIcon className="w-3.5 h-3.5" /> Visual Module A Controls
                  </span>
                  <button
                    onClick={() => handleSaveSection("blockA")}
                    className="bg-amber-500 text-amber-950 hover:bg-amber-600 font-black px-4 py-1.5 rounded-xl text-[9px] uppercase shadow active:scale-95 transition cursor-pointer"
                  >
                    Save Visual
                  </button>
                </div>
                <div className="space-y-2 mt-1">
                  <input
                    value={editTexts.blockALabel}
                    onChange={(e) =>
                      setEditTexts({ ...editTexts, blockALabel: e.target.value })
                    }
                    placeholder="Label Text (e.g. Block A)"
                    className="w-full bg-white border border-amber-200 px-3 py-2 rounded-xl text-xs font-bold outline-none focus:border-amber-400 shadow-inner"
                  />
                  <AdminUpload
                    value={editTexts.blockAImage}
                    onChange={(newUrl) =>
                      setEditTexts({ ...editTexts, blockAImage: newUrl || "" })
                    }
                    module="amenities"
                    category="staff-quarters"
                    className="w-full font-semibold"
                  />
                </div>
              </div>
            )}
          </div>

          {/* BLOCK B */}
          <div className="flex flex-col gap-6">
            <div className="relative group overflow-hidden rounded-[32px] border border-slate-200/60 shadow-md aspect-[4/3] bg-slate-200 transition-all duration-500 hover:shadow-lg">
              <img
                src={getAssetUrl(blockBRec?.imageUrl) || img2}
                alt={blockBRec?.title || DEFAULTS.blockBLabel}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-6">
                <span className="text-white font-black font-display text-lg sm:text-xl tracking-wide uppercase drop-shadow">
                  {blockBRec?.title || DEFAULTS.blockBLabel}
                </span>
              </div>
            </div>

            {isEditMode && (
              <div className="p-5 bg-amber-50/40 border-2 border-amber-200 rounded-[28px] space-y-3.5 animate-[fade-in_0.3s]">
                <div className="flex items-center justify-between border-b border-amber-200/60 pb-2">
                  <span className="text-[9px] font-black text-amber-800 uppercase flex items-center gap-1 tracking-wider">
                    <ImageIcon className="w-3.5 h-3.5" /> Visual Module B Controls
                  </span>
                  <button
                    onClick={() => handleSaveSection("blockB")}
                    className="bg-amber-500 text-amber-950 hover:bg-amber-600 font-black px-4 py-1.5 rounded-xl text-[9px] uppercase shadow active:scale-95 transition cursor-pointer"
                  >
                    Save Visual
                  </button>
                </div>
                <div className="space-y-2 mt-1">
                  <input
                    value={editTexts.blockBLabel}
                    onChange={(e) =>
                      setEditTexts({ ...editTexts, blockBLabel: e.target.value })
                    }
                    placeholder="Label Text (e.g. Block B)"
                    className="w-full bg-white border border-amber-200 px-3 py-2 rounded-xl text-xs font-bold outline-none focus:border-amber-400 shadow-inner"
                  />
                  <AdminUpload
                    value={editTexts.blockBImage}
                    onChange={(newUrl) =>
                      setEditTexts({ ...editTexts, blockBImage: newUrl || "" })
                    }
                    module="amenities"
                    category="staff-quarters"
                    className="w-full font-semibold"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ---------- STANDARDIZED WIDGET COMPONENT ---------- */

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
