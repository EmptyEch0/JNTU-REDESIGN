import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import atmpic from "@/assets/Atm-bank.jpeg";
import { getPageContent, updatePageSection } from "@/funcs/site.server";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import { PageHero } from "@/components/PageHero";
import { 
  Image as ImageIcon,
  Landmark,
  Sparkles
} from "lucide-react";
import { getAssetUrl } from "@/lib/assets";
import {
  AdminModeBanner,
  AdminPanel,
  AdminPanelHeader,
  AdminField,
  AdminInput,
  AdminTextarea,
  AdminSaveButton,
  AdminUpload,
} from "@/components/AdminEditPanel";

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
      {isEditMode && <AdminModeBanner label="Banking CMS Dashboard Live" />}

      <PageHero
        title="Banking Facilities"
        subtitle="Comprehensive financial services and 24/7 access points active on the JNTU-GV campus."
        image={getAssetUrl(imgRec?.imageUrl) || atmpic}
      />

      <section className="container-narrow py-12 md:py-16 px-4 sm:px-6 max-w-full overflow-x-hidden">
        
        <div className="space-y-10 max-w-5xl mx-auto animate-[fade-in_0.2s_ease-out]">

          {/* IMAGE STACK */}
          <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-[32px] shadow-md border border-slate-200/60 bg-slate-200 transition-all duration-300">
            <div className="relative aspect-[21/9] md:aspect-[16/7] min-h-[200px] max-h-[340px] w-full overflow-hidden group bg-slate-900">
              <img
                src={getAssetUrl(imgRec?.imageUrl) || atmpic}
                alt="Banking Infrastructure"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent z-10" />
            </div>
            {isEditMode && (
              <div className="border-t border-amber-200">
                <AdminPanel className="rounded-t-none border-0">
                  <AdminPanelHeader title="Display Graphic Override" />
                  <div className="flex flex-col sm:flex-row gap-3 w-full items-center">
                    <AdminUpload
                      value={editTexts.imageUrl}
                      onChange={(newUrl) => setEditTexts({ ...editTexts, imageUrl: newUrl || "" })}
                      module="banking"
                      category="main"
                      className="flex-1 w-full"
                    />
                    <AdminSaveButton onClick={() => handleSaveSection("image")} label="Save Graphic" className="shrink-0" />
                  </div>
                </AdminPanel>
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
                <AdminPanel>
                  <AdminPanelHeader title="Intro Explainer Narrative">
                    <AdminSaveButton onClick={() => handleSaveSection("intro")} label="Store Intro" />
                  </AdminPanelHeader>
                  <AdminField label="Narrative">
                    <AdminTextarea
                      value={editTexts.intro}
                      onChange={(e) => setEditTexts({ ...editTexts, intro: e.target.value })}
                      rows={3}
                    />
                  </AdminField>
                  
                  <div className="my-4 border-b border-amber-200/40" />
                  
                  <AdminPanelHeader title="Branch Details">
                    <AdminSaveButton onClick={() => handleSaveSection("branch")} label="Store Branch Details" className="!bg-slate-900 !text-white hover:!bg-amber-600" />
                  </AdminPanelHeader>
                  <div className="space-y-4">
                    <AdminField label="Service Node Title">
                      <AdminInput
                        value={editTexts.branchTitle}
                        onChange={(e) => setEditTexts({ ...editTexts, branchTitle: e.target.value })}
                      />
                    </AdminField>
                    <AdminField label="Operational Specifics">
                      <AdminTextarea
                        value={editTexts.branchContent}
                        onChange={(e) => setEditTexts({ ...editTexts, branchContent: e.target.value })}
                        rows={4}
                      />
                    </AdminField>
                  </div>
                </AdminPanel>
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

