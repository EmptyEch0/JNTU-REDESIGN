import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import atmpic from "@/assets/Atm-bank.jpeg";
import { getPageContent, updatePageSection } from "@/funcs/site.server";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import { Save, Lock, Edit, Image as ImageIcon } from "lucide-react";

export const Route = createFileRoute("/banking")({
  loader: async () => await getPageContent({ data: "banking" }),
  component: BankingPage,
});

const DEFAULTS = {
  intro: "Jawaharlal Nehru Technological University-Gurajada, Vizianagaram (JNTU-GV) provides comprehensive banking facilities directly on its campus to ensure a seamless experience for the university community.",
  branchTitle: "Bank Branch",
  branchContent: "A full-fledged branch of the State Bank of India (SBI) is located within the administrative zone, offering account services, deposits, withdrawals, cheque clearance, and support for fee payment.",
  imageUrl: "",
};

function BankingPage() {
  const initialData = Route.useLoaderData() as any[];
  const { isEditMode } = useAdmin();
  const router = useRouter();

  const introRec = initialData.find((r) => r.sectionKey === "intro");
  const branchRec = initialData.find((r) => r.sectionKey === "branch");
  const imgRec = initialData.find((r) => r.sectionKey === "image");

  const [editTexts, setEditTexts] = useState({
    intro: introRec?.content || DEFAULTS.intro,
    branchTitle: branchRec?.title || DEFAULTS.branchTitle,
    branchContent: branchRec?.content || DEFAULTS.branchContent,
    imageUrl: imgRec?.imageUrl || DEFAULTS.imageUrl,
  });

  useEffect(() => {
    setEditTexts({
      intro: introRec?.content || DEFAULTS.intro,
      branchTitle: branchRec?.title || DEFAULTS.branchTitle,
      branchContent: branchRec?.content || DEFAULTS.branchContent,
      imageUrl: imgRec?.imageUrl || DEFAULTS.imageUrl,
    });
  }, [initialData]);

  async function handleSaveSection(section: "intro" | "branch" | "image") {
    const tId = toast.loading("Saving banking content...");
    try {
      if (section === "intro") {
        await updatePageSection({
          data: {
            page: "banking",
            sectionKey: "intro",
            content: editTexts.intro,
          },
        });
      } else if (section === "branch") {
        await updatePageSection({
          data: {
            page: "banking",
            sectionKey: "branch",
            title: editTexts.branchTitle,
            content: editTexts.branchContent,
          },
        });
      } else if (section === "image") {
        await updatePageSection({
          data: {
            page: "banking",
            sectionKey: "image",
            imageUrl: editTexts.imageUrl,
          },
        });
      }

      toast.success("Changes saved successfully!", { id: tId });
      router.invalidate();
    } catch {
      toast.error("Failed to save.", { id: tId });
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/30 pb-24 w-full">
      {isEditMode && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-white font-black py-3 px-6 sticky top-0 z-[100] shadow-xl flex items-center justify-center gap-2.5 border-b border-amber-700/30 animate-[fade-in_0.3s] backdrop-blur-md text-xs uppercase tracking-widest">
          <Lock className="w-3.5 h-3.5 animate-pulse text-amber-950" />
          <span>Live Banking Editorial Enabled</span>
          <div className="hidden md:block h-1 w-1 rounded-full bg-amber-950" />
          <span className="hidden md:block text-amber-100 normal-case italic font-medium">
            Make text or image edits and click save to push updates.
          </span>
        </div>
      )}

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10 text-slate-800 animate-[fade-in_0.5s_ease-out]">
        <div className="border-b border-indigo-200/60 pb-5 flex items-center justify-between">
          <h1 className="text-3xl sm:text-4xl font-black text-indigo-950 tracking-tight flex items-center gap-3">
            🏦 Bank Facilities
          </h1>
        </div>

        {/* INTRO SECTION */}
        {isEditMode ? (
          <div className="p-6 bg-amber-50/40 border-2 border-amber-200 rounded-3xl space-y-4 animate-[fade-in_0.3s]">
            <div className="flex items-center justify-between border-b border-amber-200/50 pb-2">
              <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                <Edit className="w-3 h-3" /> Intro Paragraph
              </span>
              <button
                onClick={() => handleSaveSection("intro")}
                className="bg-amber-500 text-amber-950 hover:bg-amber-600 font-black px-4.5 py-2 rounded-xl text-[10px] uppercase tracking-wider shadow active:scale-95 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" /> Save
              </button>
            </div>
            <textarea
              value={editTexts.intro}
              onChange={(e) => setEditTexts({ ...editTexts, intro: e.target.value })}
              className="w-full h-28 rounded-2xl border-2 border-amber-200/60 bg-white p-4 text-sm font-medium outline-none focus:border-amber-400"
            />
          </div>
        ) : (
          <p className="leading-relaxed text-justify text-base text-slate-600 font-medium bg-indigo-50/30 p-6 rounded-3xl border border-indigo-100/50 shadow-sm">
            {introRec?.content || DEFAULTS.intro}
          </p>
        )}

        {/* BRANCH DETAILS */}
        {isEditMode ? (
          <div className="p-6 bg-amber-50/40 border-2 border-amber-200 rounded-3xl space-y-5 animate-[fade-in_0.3s]">
            <div className="flex items-center justify-between border-b border-amber-200/50 pb-2">
              <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                <Edit className="w-3 h-3" /> Branch Card Details
              </span>
              <button
                onClick={() => handleSaveSection("branch")}
                className="bg-amber-500 text-amber-950 hover:bg-amber-600 font-black px-4.5 py-2 rounded-xl text-[10px] uppercase tracking-wider shadow active:scale-95 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" /> Save
              </button>
            </div>
            <div className="space-y-3">
              <input
                value={editTexts.branchTitle}
                onChange={(e) =>
                  setEditTexts({ ...editTexts, branchTitle: e.target.value })
                }
                className="w-full border-2 border-amber-200/60 bg-white p-3.5 rounded-xl text-sm font-bold outline-none focus:border-amber-400"
                placeholder="Card Title (e.g., Bank Branch)"
              />
              <textarea
                value={editTexts.branchContent}
                onChange={(e) =>
                  setEditTexts({ ...editTexts, branchContent: e.target.value })
                }
                className="w-full h-28 rounded-2xl border-2 border-amber-200/60 bg-white p-4 text-sm font-medium outline-none focus:border-amber-400"
                placeholder="Card content paragraphs..."
              />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[32px] border border-slate-200/60 shadow-lg shadow-slate-200/30 p-8 space-y-4 transition-all duration-300 hover:shadow-xl">
            <h3 className="text-indigo-600 font-black text-xl tracking-tight">
              {branchRec?.title || DEFAULTS.branchTitle}
            </h3>
            <p className="leading-relaxed text-justify text-[15px] text-slate-600 font-medium whitespace-pre-line">
              {branchRec?.content || DEFAULTS.branchContent}
            </p>
          </div>
        )}

        {/* FACILITY IMAGE */}
        <div className="pt-6 flex flex-col items-center gap-5">
          <img
            src={imgRec?.imageUrl || atmpic}
            alt="Bank Facility"
            className="w-full max-w-2xl object-cover aspect-[16/10] rounded-[32px] shadow-xl border border-slate-200/40 shadow-slate-300/40"
          />

          {isEditMode && (
            <div className="w-full max-w-2xl bg-amber-50/40 border-2 border-amber-200 rounded-3xl p-5 flex flex-col gap-3 animate-[fade-in_0.3s]">
              <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" /> Swap Banner Image
              </span>
              <div className="flex gap-3">
                <input
                  value={editTexts.imageUrl}
                  onChange={(e) =>
                    setEditTexts({ ...editTexts, imageUrl: e.target.value })
                  }
                  placeholder="Paste image URL here..."
                  className="flex-1 border-2 border-amber-200/60 bg-white px-4 py-3 rounded-xl text-xs font-semibold outline-none focus:border-amber-400"
                />
                <button
                  onClick={() => handleSaveSection("image")}
                  className="bg-amber-500 text-amber-950 hover:bg-amber-600 font-black px-5 py-3 rounded-xl text-[10px] uppercase shadow active:scale-95 cursor-pointer transition flex items-center gap-1.5 shrink-0"
                >
                  <Save className="w-3.5 h-3.5" /> Save
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
