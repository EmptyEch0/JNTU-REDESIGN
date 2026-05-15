import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import img1 from "@/assets/faculity-quaters1.jpg";
import img2 from "@/assets/faculity-quaters2.jpg";
import { getPageContent, updatePageSection } from "@/funcs/site.server";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import { Save, Lock, Edit, Image as ImageIcon } from "lucide-react";

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
    <div className="bg-white min-h-screen animate-[fade-in_0.5s_ease-out] pb-24 relative">
      {isEditMode && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-white font-black py-2 px-6 sticky top-0 z-[100] shadow-lg flex items-center justify-center gap-2 border-b border-amber-700/20 backdrop-blur-md text-[10px] uppercase tracking-widest">
          <Lock className="w-3 h-3 animate-pulse" />
          <span>Staff Quarters Portal Editorial</span>
        </div>
      )}

      <section className="max-w-4xl mx-auto px-4 py-10 space-y-8 text-slate-800">
        {/* HERO AREA */}
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

        {/* CORE BODY NARRATIVES */}
        <div className="space-y-6 text-base leading-relaxed text-slate-600 text-justify font-medium">
          {isEditMode ? (
            <div className="p-5 bg-amber-50/40 border border-amber-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                <span className="text-[9px] font-black text-amber-800 uppercase tracking-wider">
                  Explainer Paragraph 1
                </span>
                <button
                  onClick={() => handleSaveSection("para1")}
                  className="bg-amber-500 text-amber-950 px-3 py-1 rounded-lg text-[9px] font-black uppercase cursor-pointer"
                >
                  Save
                </button>
              </div>
              <textarea
                value={editTexts.para1}
                onChange={(e) =>
                  setEditTexts({ ...editTexts, para1: e.target.value })
                }
                className="w-full h-24 bg-white border border-amber-200 p-3 rounded-xl text-sm font-medium outline-none"
              />
            </div>
          ) : (
            <p className="bg-indigo-50/10 p-5 rounded-2xl border border-indigo-100/30">
              {para1Rec?.content || DEFAULTS.para1}
            </p>
          )}

          {isEditMode ? (
            <div className="p-5 bg-amber-50/40 border border-amber-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                <span className="text-[9px] font-black text-amber-800 uppercase tracking-wider">
                  Explainer Paragraph 2
                </span>
                <button
                  onClick={() => handleSaveSection("para2")}
                  className="bg-amber-500 text-amber-950 px-3 py-1 rounded-lg text-[9px] font-black uppercase cursor-pointer"
                >
                  Save
                </button>
              </div>
              <textarea
                value={editTexts.para2}
                onChange={(e) =>
                  setEditTexts({ ...editTexts, para2: e.target.value })
                }
                className="w-full h-24 bg-white border border-amber-200 p-3 rounded-xl text-sm font-medium outline-none"
              />
            </div>
          ) : (
            <p className="bg-indigo-50/10 p-5 rounded-2xl border border-indigo-100/30">
              {para2Rec?.content || DEFAULTS.para2}
            </p>
          )}
        </div>

        {/* GALLERY BLOCKS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
          {/* BLOCK A */}
          <div className="flex flex-col gap-4">
            <div className="relative group overflow-hidden rounded-3xl border-2 border-primary/10 shadow-md aspect-[4/3]">
              <img
                src={blockARec?.imageUrl || img1}
                alt={blockARec?.title || DEFAULTS.blockALabel}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-5">
                <span className="text-white font-black text-base uppercase tracking-wide">
                  {blockARec?.title || DEFAULTS.blockALabel}
                </span>
              </div>
            </div>

            {isEditMode && (
              <div className="p-4 bg-amber-50/40 border border-amber-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-amber-100 pb-1.5">
                  <span className="text-[9px] font-black text-amber-800 uppercase flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" /> Image A Controls
                  </span>
                  <button
                    onClick={() => handleSaveSection("blockA")}
                    className="bg-amber-500 text-amber-950 px-3 py-1 rounded-lg text-[9px] font-black uppercase cursor-pointer"
                  >
                    Save
                  </button>
                </div>
                <input
                  value={editTexts.blockALabel}
                  onChange={(e) =>
                    setEditTexts({ ...editTexts, blockALabel: e.target.value })
                  }
                  placeholder="Label Text (e.g. Block A)"
                  className="w-full bg-white border border-amber-200 px-3 py-1.5 rounded-xl text-xs font-bold outline-none"
                />
                <input
                  value={editTexts.blockAImage}
                  onChange={(e) =>
                    setEditTexts({ ...editTexts, blockAImage: e.target.value })
                  }
                  placeholder="Paste image URL..."
                  className="w-full bg-white border border-amber-200 px-3 py-1.5 rounded-xl text-xs font-semibold outline-none"
                />
              </div>
            )}
          </div>

          {/* BLOCK B */}
          <div className="flex flex-col gap-4">
            <div className="relative group overflow-hidden rounded-3xl border-2 border-primary/10 shadow-md aspect-[4/3]">
              <img
                src={blockBRec?.imageUrl || img2}
                alt={blockBRec?.title || DEFAULTS.blockBLabel}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-5">
                <span className="text-white font-black text-base uppercase tracking-wide">
                  {blockBRec?.title || DEFAULTS.blockBLabel}
                </span>
              </div>
            </div>

            {isEditMode && (
              <div className="p-4 bg-amber-50/40 border-2 border-amber-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-amber-100 pb-1.5">
                  <span className="text-[9px] font-black text-amber-800 uppercase flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" /> Image B Controls
                  </span>
                  <button
                    onClick={() => handleSaveSection("blockB")}
                    className="bg-amber-500 text-amber-950 px-3 py-1 rounded-lg text-[9px] font-black uppercase cursor-pointer"
                  >
                    Save
                  </button>
                </div>
                <input
                  value={editTexts.blockBLabel}
                  onChange={(e) =>
                    setEditTexts({ ...editTexts, blockBLabel: e.target.value })
                  }
                  placeholder="Label Text (e.g. Block B)"
                  className="w-full bg-white border border-amber-200 px-3 py-1.5 rounded-xl text-xs font-bold outline-none"
                />
                <input
                  value={editTexts.blockBImage}
                  onChange={(e) =>
                    setEditTexts({ ...editTexts, blockBImage: e.target.value })
                  }
                  placeholder="Paste image URL..."
                  className="w-full bg-white border border-amber-200 px-3 py-1.5 rounded-xl text-xs font-semibold outline-none"
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
