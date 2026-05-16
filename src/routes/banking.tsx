import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import atmpic from "@/assets/Atm-bank.jpeg";
import { getPageContent, updatePageSection } from "@/funcs/site.server";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import { PageHero } from "@/components/PageHero";
import { 
  Save, 
  Lock, 
  Edit, 
  Image as ImageIcon,
  Landmark,
  Sparkles
} from "lucide-react";

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
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 text-slate-800 pb-24">
      {isEditMode && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-white font-black py-3 px-6 sticky top-0 z-[100] shadow-xl flex items-center justify-center gap-2.5 border-b border-amber-700/30 animate-[fade-in_0.3s] backdrop-blur-md text-xs uppercase tracking-widest">
          <Lock className="w-3.5 h-3.5 animate-pulse text-amber-950" />
          <span>Banking CMS Dashboard Live</span>
          <div className="hidden md:block h-1 w-1 rounded-full bg-amber-950" />
          <span className="hidden md:block text-amber-100 normal-case italic font-medium">
            Real-time alignment activated. Save to push updates.
          </span>
        </div>
      )}

      <PageHero
        title="Banking Facilities"
        subtitle="Comprehensive financial services and 24/7 access points active on the JNTU-GV campus."
        image={imgRec?.imageUrl || atmpic}
      />

      <section className="container-narrow py-12 md:py-16 px-4 sm:px-6 max-w-full overflow-x-hidden">
        
        <div className="space-y-10 max-w-5xl mx-auto animate-[fade-in_0.5s_ease-out]">

          {/* IMAGE STACK */}
          <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-[32px] shadow-md border border-slate-200/60 bg-slate-200 transition-all duration-300">
            <div className="relative aspect-[21/9] md:aspect-[16/7] min-h-[200px] max-h-[340px] w-full overflow-hidden group bg-slate-900">
              <img
                src={imgRec?.imageUrl || atmpic}
                alt="Banking Infrastructure"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent z-10" />
            </div>
            {isEditMode && (
              <div className="bg-amber-50/95 backdrop-blur-md border-t border-amber-200 p-6 sm:p-8 flex flex-col gap-4 animate-[fade-in_0.4s]">
                <div className="flex items-center gap-2 pb-1.5 border-b border-amber-200/60">
                  <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 grid place-items-center shrink-0 shadow-sm">
                    <ImageIcon className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-amber-950 tracking-tight">Display Graphic Override</h4>
                    <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Swap banner photo</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full mt-1">
                  <input
                    value={editTexts.imageUrl}
                    onChange={(e) =>
                      setEditTexts({ ...editTexts, imageUrl: e.target.value })
                    }
                    placeholder="Paste new image source URL..."
                    className="flex-1 border border-amber-200 rounded-xl px-4 py-3.5 text-sm font-bold bg-white outline-none shadow-inner"
                  />
                  <button
                    onClick={() => handleSaveSection("image")}
                    className="bg-amber-500 text-amber-950 hover:bg-amber-600 font-black px-6 py-3 rounded-xl text-xs uppercase active:scale-95 cursor-pointer shadow transition flex gap-2 items-center justify-center shrink-0"
                  >
                    <Save className="w-4 h-4" /> Save Graphic
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* DETAILS GRID */}
          <div className="grid grid-cols-1 gap-8">
            <Card 
              title="SBI Campus Branch & ATM" 
              subtitle="Institutional Banking Hub" 
              icon={Landmark}
              className={isEditMode ? "ring-4 ring-amber-500/10 border-amber-200 bg-amber-50/10" : ""}
            >
              {isEditMode ? (
                <div className="space-y-6 animate-[fade-in_0.3s]">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-amber-800 uppercase tracking-wider">Intro Explainer Narrative</label>
                    <textarea
                      value={editTexts.intro}
                      onChange={(e) => setEditTexts({ ...editTexts, intro: e.target.value })}
                      className="w-full h-24 rounded-xl border bg-white p-3.5 text-xs font-bold outline-none focus:border-amber-400 shadow-inner"
                    />
                    <div className="flex justify-end">
                      <button 
                        onClick={() => handleSaveSection("intro")} 
                        className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-amber-950 font-black px-4.5 py-2.5 rounded-xl text-xs uppercase shadow active:scale-95 cursor-pointer transition"
                      >
                        <Save className="w-4 h-4"/> Store Intro
                      </button>
                    </div>
                  </div>

                  <hr className="border-amber-200/40" />

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-amber-800 uppercase tracking-wider">Service Node Title</label>
                      <input
                        value={editTexts.branchTitle}
                        onChange={(e) => setEditTexts({ ...editTexts, branchTitle: e.target.value })}
                        className="w-full border bg-white text-xs font-bold p-3 rounded-xl shadow-inner focus:border-amber-400 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-amber-800 uppercase tracking-wider">Operational Specifics</label>
                      <textarea
                        value={editTexts.branchContent}
                        onChange={(e) => setEditTexts({ ...editTexts, branchContent: e.target.value })}
                        className="w-full h-32 border bg-white text-xs font-medium p-3.5 rounded-xl shadow-inner focus:border-amber-400 outline-none"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button 
                        onClick={() => handleSaveSection("branch")} 
                        className="flex items-center gap-2 bg-slate-950 hover:bg-amber-600 text-white font-black px-5 py-2.5 rounded-xl text-xs uppercase shadow active:scale-95 cursor-pointer transition"
                      >
                        <Save className="w-4 h-4"/> Store Branch Details
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <p className="text-[15px] leading-relaxed text-slate-600 text-justify font-medium bg-slate-50 border p-6 rounded-2xl shadow-inner italic">
                    "{introRec?.content || DEFAULTS.intro}"
                  </p>
                  
                  <div className="bg-indigo-50/40 border border-indigo-100/80 p-6 rounded-2xl space-y-3 shadow-sm">
                    <div className="flex items-center gap-2 text-[oklch(0.42_0.18_265)]">
                      <Sparkles className="w-4.5 h-4.5 shrink-0 animate-pulse" />
                      <h4 className="font-black font-display text-xl tracking-tight text-slate-900">
                        {branchRec?.title || DEFAULTS.branchTitle}
                      </h4>
                    </div>
                    <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-line text-justify text-[14.5px]">
                      {branchRec?.content || DEFAULTS.branchContent}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>

        </div>
      </section>
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

export default BankingPage;
