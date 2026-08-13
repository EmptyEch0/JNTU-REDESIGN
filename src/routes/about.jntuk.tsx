import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { imageUrl } from "@/lib/assets";
import { useState, useEffect } from "react";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";
import { ArrowRight, ExternalLink, School, MapPin, Building2, Users } from "lucide-react";
const campusImg = imageUrl("hero-carousal/hero-campus.jpg");
import { getPageContent, updatePageSection } from "@/funcs/site.server";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import {
  AdminModeBanner,
  AdminPanel,
  AdminPanelHeader,
  AdminField,
  AdminInput,
  AdminTextarea,
  AdminSaveButton,
} from "@/components/AdminEditPanel";

export const Route = createFileRoute("/about/jntuk")({
  loader: async () => await getPageContent({ data: "jntuk" }),
  head: () => ({
    meta: [
      { title: "About JNTUK — JNTU-GV CEV" },
      {
        name: "description",
        content:
          "Jawaharlal Nehru Technological University Kakinada – the parent university of JNTU-GV CEV, established in 1946.",
      },
      { property: "og:title", content: "About JNTUK" },
      { property: "og:description", content: "History and legacy of JNTUK since 1946." },
    ],
  }),
  component: JntukPage,
});

const DEFAULTS = {
  heroTitle: "Jawaharlal Nehru Technological University Kakinada",
  heroSubtitle: "The parent university — a legacy of engineering education since 1946.",
  historyTitle: "From a single college to a multi-campus university",
  historyContent: "Jawaharlal Nehru Technological University Kakinada (JNTUK) was initially incepted with the name \"The College of Engineering – Vizagapatnam\" in 1946. The university grew out of that college.\n\nSpread over a sprawling campus of 110 acres in the port city of Kakinada, the college became a constituent unit of JNTU Hyderabad in 1972. Subject to the bifurcation of JNTU, it was notified as JNTUK by the act of legislature in 2008 as a separate university.\n\nJNTUK has two constituent colleges under its fold: University College of Engineering (Autonomous) Kakinada and University College of Engineering Vizianagaram. The university has nearly 268 affiliated colleges under the jurisdiction of 8 districts.",
  f1Title: "Est. 1946",
  f1Desc: "Originally 'The College of Engineering – Vizagapatnam'",
  f2Title: "110 Acres",
  f2Desc: "Sprawling campus in the port city of Kakinada",
  f3Title: "2 Constituent Colleges",
  f3Desc: "UCEK (Autonomous) Kakinada & UCEV Vizianagaram",
  f4Title: "268 Affiliated Colleges",
  f4Desc: "Under the jurisdiction of 8 districts",
};

function JntukPage() {
  const records = Route.useLoaderData() as any[];
  const { isEditMode } = useAdmin();
  const router = useRouter();

  const heroRec = records.find((r) => r.sectionKey === "hero");
  const historyRec = records.find((r) => r.sectionKey === "history");
  const f1Rec = records.find((r) => r.sectionKey === "fact_1");
  const f2Rec = records.find((r) => r.sectionKey === "fact_2");
  const f3Rec = records.find((r) => r.sectionKey === "fact_3");
  const f4Rec = records.find((r) => r.sectionKey === "fact_4");

  const [editTexts, setEditTexts] = useState({
    heroTitle: heroRec?.title || DEFAULTS.heroTitle,
    heroSubtitle: heroRec?.content || DEFAULTS.heroSubtitle,
    historyTitle: historyRec?.title || DEFAULTS.historyTitle,
    historyContent: historyRec?.content || DEFAULTS.historyContent,
    f1Title: f1Rec?.title || DEFAULTS.f1Title,
    f1Desc: f1Rec?.content || DEFAULTS.f1Desc,
    f2Title: f2Rec?.title || DEFAULTS.f2Title,
    f2Desc: f2Rec?.content || DEFAULTS.f2Desc,
    f3Title: f3Rec?.title || DEFAULTS.f3Title,
    f3Desc: f3Rec?.content || DEFAULTS.f3Desc,
    f4Title: f4Rec?.title || DEFAULTS.f4Title,
    f4Desc: f4Rec?.content || DEFAULTS.f4Desc,
  });

  useEffect(() => {
    setEditTexts({
      heroTitle: heroRec?.title || DEFAULTS.heroTitle,
      heroSubtitle: heroRec?.content || DEFAULTS.heroSubtitle,
      historyTitle: historyRec?.title || DEFAULTS.historyTitle,
      historyContent: historyRec?.content || DEFAULTS.historyContent,
      f1Title: f1Rec?.title || DEFAULTS.f1Title,
      f1Desc: f1Rec?.content || DEFAULTS.f1Desc,
      f2Title: f2Rec?.title || DEFAULTS.f2Title,
      f2Desc: f2Rec?.content || DEFAULTS.f2Desc,
      f3Title: f3Rec?.title || DEFAULTS.f3Title,
      f3Desc: f3Rec?.content || DEFAULTS.f3Desc,
      f4Title: f4Rec?.title || DEFAULTS.f4Title,
      f4Desc: f4Rec?.content || DEFAULTS.f4Desc,
    });
  }, [records]);

  async function handleSaveSection(section: string) {
    const tId = toast.loading("Saving content section...");
    try {
      if (section === "hero") {
        await updatePageSection({
          data: {
            page: "jntuk",
            sectionKey: "hero",
            title: editTexts.heroTitle,
            content: editTexts.heroSubtitle,
          },
        });
      } else if (section === "history") {
        await updatePageSection({
          data: {
            page: "jntuk",
            sectionKey: "history",
            title: editTexts.historyTitle,
            content: editTexts.historyContent,
          },
        });
      } else if (section === "f1") {
        await updatePageSection({
          data: {
            page: "jntuk",
            sectionKey: "fact_1",
            title: editTexts.f1Title,
            content: editTexts.f1Desc,
          },
        });
      } else if (section === "f2") {
        await updatePageSection({
          data: {
            page: "jntuk",
            sectionKey: "fact_2",
            title: editTexts.f2Title,
            content: editTexts.f2Desc,
          },
        });
      } else if (section === "f3") {
        await updatePageSection({
          data: {
            page: "jntuk",
            sectionKey: "fact_3",
            title: editTexts.f3Title,
            content: editTexts.f3Desc,
          },
        });
      } else if (section === "f4") {
        await updatePageSection({
          data: {
            page: "jntuk",
            sectionKey: "fact_4",
            title: editTexts.f4Title,
            content: editTexts.f4Desc,
          },
        });
      }
      toast.success("Changes saved successfully!", { id: tId });
      router.invalidate();
    } catch {
      toast.error("Failed to save section.", { id: tId });
    }
  }

  const dynamicFacts = [
    { icon: School, title: editTexts.f1Title, desc: editTexts.f1Desc, key: "f1" },
    { icon: MapPin, title: editTexts.f2Title, desc: editTexts.f2Desc, key: "f2" },
    { icon: Building2, title: editTexts.f3Title, desc: editTexts.f3Desc, key: "f3" },
    { icon: Users, title: editTexts.f4Title, desc: editTexts.f4Desc, key: "f4" },
  ];

  return (
    <>
      {isEditMode && <AdminModeBanner label="JNTUK Info Editor Active" />}

      <PageHero
        eyebrow="About"
        title={editTexts.heroTitle}
        subtitle={editTexts.heroSubtitle}
        image={campusImg}
      />

      {isEditMode && (
        <section className="container-narrow py-6">
          <AdminPanel>
            <AdminPanelHeader title="Edit Hero Headers">
              <AdminSaveButton onClick={() => handleSaveSection("hero")} label="Save Hero" />
            </AdminPanelHeader>
            <div className="space-y-4">
              <AdminField label="Hero Title">
                <AdminInput
                  value={editTexts.heroTitle}
                  onChange={(e) => setEditTexts({ ...editTexts, heroTitle: e.target.value })}
                />
              </AdminField>
              <AdminField label="Hero Subtitle">
                <AdminTextarea
                  value={editTexts.heroSubtitle}
                  onChange={(e) => setEditTexts({ ...editTexts, heroSubtitle: e.target.value })}
                  rows={2}
                />
              </AdminField>
            </div>
          </AdminPanel>
        </section>
      )}

      <section className="py-24 md:py-32 container-narrow">
        <RevealOnScroll>
          <div className="max-w-3xl mx-auto">
            {isEditMode ? (
              <AdminPanel>
                <AdminPanelHeader title="Edit History Overview">
                  <AdminSaveButton onClick={() => handleSaveSection("history")} label="Save History" />
                </AdminPanelHeader>
                <div className="space-y-4">
                  <AdminField label="History Block Title">
                    <AdminInput
                      value={editTexts.historyTitle}
                      onChange={(e) => setEditTexts({ ...editTexts, historyTitle: e.target.value })}
                    />
                  </AdminField>
                  <AdminField label="History Body Narrative (Paragraphs separated by double linebreaks)">
                    <AdminTextarea
                      value={editTexts.historyContent}
                      onChange={(e) => setEditTexts({ ...editTexts, historyContent: e.target.value })}
                      rows={10}
                    />
                  </AdminField>
                </div>
              </AdminPanel>
            ) : (
              <>
                <div className="text-eyebrow">History</div>
                <h2 className="text-display text-3xl md:text-4xl mt-3 text-ink">
                  {editTexts.historyTitle}
                </h2>
                <div className="mt-6 space-y-4 text-muted-foreground text-lg leading-relaxed whitespace-pre-line">
                  {editTexts.historyContent.split("\n\n").map((para: string, idx: number) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>
              </>
            )}

            <a
              href="https://www.jntuk.edu.in"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-8 inline-flex items-center gap-2 cursor-pointer"
            >
              Visit JNTUK Website <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </RevealOnScroll>
      </section>

      {/* Facts */}
      <section className="py-20 bg-sand">
        <div className="container-narrow">
          <RevealOnScroll>
            <SectionLabel eyebrow="Key facts" title="JNTUK at a glance" align="center" />
          </RevealOnScroll>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {dynamicFacts.map((f, i) => (
              <RevealOnScroll key={f.key} delay={i * 100}>
                <div className="bg-card rounded-2xl p-7 border border-border hover-lift h-full group cursor-default flex flex-col justify-between">
                  <div>
                    <div className="h-12 w-12 rounded-xl bg-[var(--gradient-royal)] text-white grid place-items-center mb-4 group-hover:scale-110 transition-transform duration-200">
                      <f.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-display text-xl text-ink">{f.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                  </div>

                  {isEditMode && (
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                      <input
                        className="w-full border border-amber-200 bg-amber-50/20 rounded px-2 py-1 text-xs outline-none"
                        value={f.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (f.key === "f1") setEditTexts(prev => ({ ...prev, f1Title: val }));
                          if (f.key === "f2") setEditTexts(prev => ({ ...prev, f2Title: val }));
                          if (f.key === "f3") setEditTexts(prev => ({ ...prev, f3Title: val }));
                          if (f.key === "f4") setEditTexts(prev => ({ ...prev, f4Title: val }));
                        }}
                      />
                      <textarea
                        className="w-full border border-amber-200 bg-amber-50/20 rounded px-2 py-1 text-xs outline-none"
                        value={f.desc}
                        rows={2}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (f.key === "f1") setEditTexts(prev => ({ ...prev, f1Desc: val }));
                          if (f.key === "f2") setEditTexts(prev => ({ ...prev, f2Desc: val }));
                          if (f.key === "f3") setEditTexts(prev => ({ ...prev, f3Desc: val }));
                          if (f.key === "f4") setEditTexts(prev => ({ ...prev, f4Desc: val }));
                        }}
                      />
                      <button
                        onClick={() => handleSaveSection(f.key)}
                        className="w-full bg-slate-900 text-white rounded py-1 text-[10px] uppercase font-bold tracking-wider hover:bg-amber-600 transition"
                      >
                        Save Card
                      </button>
                    </div>
                  )}
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 container-narrow text-center">
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/about/institution" className="btn-secondary">
            About Institution <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/about/vizianagaram" className="btn-primary">
            About Vizianagaram <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

