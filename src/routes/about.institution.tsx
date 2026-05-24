import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";
import { ArrowRight, Users, Building, BookOpen, Award } from "lucide-react";
import campusImg from "@/assets/hero-campus.jpg";
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

export const Route = createFileRoute("/about/institution")({
  loader: async () => await getPageContent({ data: "institution" }),
  head: () => ({
    meta: [
      { title: "About Institution — JNTU-GV CEV" },
      {
        name: "description",
        content:
          "JNTU-GV College of Engineering Vizianagaram – a constituent college established in 2007, spread across 80 acres in Dwarapudi.",
      },
      { property: "og:title", content: "About JNTU-GV CEV" },
      {
        property: "og:description",
        content: "Imparting technological education since 2007 across 80 acres.",
      },
    ],
  }),
  component: InstitutionPage,
});

const DEFAULTS = {
  heroTitle: "JNTU-GV College of Engineering Vizianagaram",
  heroSubtitle: "A constituent engineering college playing a vital role in imparting technological education in Andhra Pradesh.",
  aboutTitle: "Engineering excellence since 2007",
  aboutContent: "JNTU-GV College of Engineering Vizianagaram is one of the constituent Engineering Colleges of JNTU-GV playing a vital role in imparting Technological Education in the state of Andhra Pradesh since its establishment in the year 2007.\n\nThe state-of-the-art campus is spread across 80 Acres in Dwarapudi panchayat at a distance of 8 KMs from Vizianagaram. It functions under the directions of Executive Council, Vice Chancellor and Registrar of JNTU-GV Vizianagaram.\n\nPrincipal is the executive head of the institution and Chairman of the College Academic Committee comprising all professors and heads of the departments. The Vice Principal, Heads of the departments and Members of College Academic Committee help in academic administration and effective functioning of the Institution.",
  h1Title: "80 Acres",
  h1Desc: "State-of-the-art campus in Dwarapudi panchayat",
  h2Title: "1,450+ Students",
  h2Desc: "Across 7 engineering disciplines and management",
  h3Title: "Est. 2007",
  h3Desc: "Serving Andhra Pradesh's technological aspirations",
  h4Title: "Constituent College",
  h4Desc: "Under JNTU-GV Vizianagaram",
};

function InstitutionPage() {
  const records = Route.useLoaderData() as any[];
  const { isEditMode } = useAdmin();
  const router = useRouter();

  const heroRec = records.find((r) => r.sectionKey === "hero");
  const aboutRec = records.find((r) => r.sectionKey === "about");
  const h1Rec = records.find((r) => r.sectionKey === "highlight_1");
  const h2Rec = records.find((r) => r.sectionKey === "highlight_2");
  const h3Rec = records.find((r) => r.sectionKey === "highlight_3");
  const h4Rec = records.find((r) => r.sectionKey === "highlight_4");

  const [editTexts, setEditTexts] = useState({
    heroTitle: heroRec?.title || DEFAULTS.heroTitle,
    heroSubtitle: heroRec?.content || DEFAULTS.heroSubtitle,
    aboutTitle: aboutRec?.title || DEFAULTS.aboutTitle,
    aboutContent: aboutRec?.content || DEFAULTS.aboutContent,
    h1Title: h1Rec?.title || DEFAULTS.h1Title,
    h1Desc: h1Rec?.content || DEFAULTS.h1Desc,
    h2Title: h2Rec?.title || DEFAULTS.h2Title,
    h2Desc: h2Rec?.content || DEFAULTS.h2Desc,
    h3Title: h3Rec?.title || DEFAULTS.h3Title,
    h3Desc: h3Rec?.content || DEFAULTS.h3Desc,
    h4Title: h4Rec?.title || DEFAULTS.h4Title,
    h4Desc: h4Rec?.content || DEFAULTS.h4Desc,
  });

  useEffect(() => {
    setEditTexts({
      heroTitle: heroRec?.title || DEFAULTS.heroTitle,
      heroSubtitle: heroRec?.content || DEFAULTS.heroSubtitle,
      aboutTitle: aboutRec?.title || DEFAULTS.aboutTitle,
      aboutContent: aboutRec?.content || DEFAULTS.aboutContent,
      h1Title: h1Rec?.title || DEFAULTS.h1Title,
      h1Desc: h1Rec?.content || DEFAULTS.h1Desc,
      h2Title: h2Rec?.title || DEFAULTS.h2Title,
      h2Desc: h2Rec?.content || DEFAULTS.h2Desc,
      h3Title: h3Rec?.title || DEFAULTS.h3Title,
      h3Desc: h3Rec?.content || DEFAULTS.h3Desc,
      h4Title: h4Rec?.title || DEFAULTS.h4Title,
      h4Desc: h4Rec?.content || DEFAULTS.h4Desc,
    });
  }, [records]);

  async function handleSaveSection(section: string) {
    const tId = toast.loading("Saving content section...");
    try {
      if (section === "hero") {
        await updatePageSection({
          data: {
            page: "institution",
            sectionKey: "hero",
            title: editTexts.heroTitle,
            content: editTexts.heroSubtitle,
          },
        });
      } else if (section === "about") {
        await updatePageSection({
          data: {
            page: "institution",
            sectionKey: "about",
            title: editTexts.aboutTitle,
            content: editTexts.aboutContent,
          },
        });
      } else if (section === "h1") {
        await updatePageSection({
          data: {
            page: "institution",
            sectionKey: "highlight_1",
            title: editTexts.h1Title,
            content: editTexts.h1Desc,
          },
        });
      } else if (section === "h2") {
        await updatePageSection({
          data: {
            page: "institution",
            sectionKey: "highlight_2",
            title: editTexts.h2Title,
            content: editTexts.h2Desc,
          },
        });
      } else if (section === "h3") {
        await updatePageSection({
          data: {
            page: "institution",
            sectionKey: "highlight_3",
            title: editTexts.h3Title,
            content: editTexts.h3Desc,
          },
        });
      } else if (section === "h4") {
        await updatePageSection({
          data: {
            page: "institution",
            sectionKey: "highlight_4",
            title: editTexts.h4Title,
            content: editTexts.h4Desc,
          },
        });
      }
      toast.success("Changes saved successfully!", { id: tId });
      router.invalidate();
    } catch {
      toast.error("Failed to save section.", { id: tId });
    }
  }

  const dynamicHighlights = [
    { icon: Building, title: editTexts.h1Title, desc: editTexts.h1Desc, key: "h1" },
    { icon: Users, title: editTexts.h2Title, desc: editTexts.h2Desc, key: "h2" },
    { icon: BookOpen, title: editTexts.h3Title, desc: editTexts.h3Desc, key: "h3" },
    { icon: Award, title: editTexts.h4Title, desc: editTexts.h4Desc, key: "h4" },
  ];

  return (
    <>
      {isEditMode && <AdminModeBanner label="Institution Info CMS Active" />}

      <PageHero
        eyebrow="About"
        title={editTexts.heroTitle}
        subtitle={editTexts.heroSubtitle}
        image={campusImg}
      />

      {isEditMode && (
        <section className="container-narrow py-6">
          <AdminPanel>
            <AdminPanelHeader title="Edit Hero Section">
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

      {/* Main content */}
      <section className="py-24 md:py-32 container-narrow grid lg:grid-cols-2 gap-16 items-start">
        <RevealOnScroll>
          <img
            src={campusImg}
            alt="JNTU-GV Campus aerial view"
            loading="lazy"
            className="rounded-3xl aspect-[4/3] object-cover w-full shadow-[var(--shadow-elegant)] hover:scale-[1.02] transition-transform duration-700"
          />
        </RevealOnScroll>
        <RevealOnScroll delay={150}>
          {isEditMode ? (
            <AdminPanel>
              <AdminPanelHeader title="Edit About History Content">
                <AdminSaveButton onClick={() => handleSaveSection("about")} label="Save History" />
              </AdminPanelHeader>
              <div className="space-y-4">
                <AdminField label="Section Header Title">
                  <AdminInput
                    value={editTexts.aboutTitle}
                    onChange={(e) => setEditTexts({ ...editTexts, aboutTitle: e.target.value })}
                  />
                </AdminField>
                <AdminField label="History Narration Block (Paragraphs separated by line breaks)">
                  <AdminTextarea
                    value={editTexts.aboutContent}
                    onChange={(e) => setEditTexts({ ...editTexts, aboutContent: e.target.value })}
                    rows={12}
                  />
                </AdminField>
              </div>
            </AdminPanel>
          ) : (
            <>
              <div className="text-eyebrow">Our Institution</div>
              <h2 className="text-display text-3xl md:text-4xl mt-3 text-ink">
                {editTexts.aboutTitle}
              </h2>
              <div className="mt-6 space-y-4 text-muted-foreground text-lg leading-relaxed whitespace-pre-line">
                {editTexts.aboutContent.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </>
          )}
        </RevealOnScroll>
      </section>

      {/* Highlights */}
      <section className="py-20 bg-sand">
        <div className="container-narrow">
          <RevealOnScroll>
            <SectionLabel eyebrow="At a glance" title="Key highlights" align="center" />
          </RevealOnScroll>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {dynamicHighlights.map((h, i) => (
              <RevealOnScroll key={h.key} delay={i * 100}>
                <div className="bg-card rounded-2xl p-7 border border-border hover-lift h-full group cursor-default flex flex-col justify-between">
                  <div>
                    <div className="h-12 w-12 rounded-xl bg-[var(--gradient-royal)] text-white grid place-items-center mb-4 group-hover:scale-110 transition-transform duration-500">
                      <h.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-display text-xl text-ink">{h.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{h.desc}</p>
                  </div>
                  
                  {isEditMode && (
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                      <input
                        className="w-full border border-amber-200 bg-amber-50/20 rounded px-2 py-1 text-xs outline-none"
                        value={h.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (h.key === "h1") setEditTexts(prev => ({ ...prev, h1Title: val }));
                          if (h.key === "h2") setEditTexts(prev => ({ ...prev, h2Title: val }));
                          if (h.key === "h3") setEditTexts(prev => ({ ...prev, h3Title: val }));
                          if (h.key === "h4") setEditTexts(prev => ({ ...prev, h4Title: val }));
                        }}
                      />
                      <textarea
                        className="w-full border border-amber-200 bg-amber-50/20 rounded px-2 py-1 text-xs outline-none"
                        value={h.desc}
                        rows={2}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (h.key === "h1") setEditTexts(prev => ({ ...prev, h1Desc: val }));
                          if (h.key === "h2") setEditTexts(prev => ({ ...prev, h2Desc: val }));
                          if (h.key === "h3") setEditTexts(prev => ({ ...prev, h3Desc: val }));
                          if (h.key === "h4") setEditTexts(prev => ({ ...prev, h4Desc: val }));
                        }}
                      />
                      <button
                        onClick={() => handleSaveSection(h.key)}
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

      {/* Administration */}
      <section className="py-24 container-narrow">
        <RevealOnScroll>
          <SectionLabel eyebrow="Administration" title="Governance structure" />
        </RevealOnScroll>
        <RevealOnScroll delay={100}>
          <div className="mt-10 grid md:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl p-8 border border-border hover-lift group">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center mb-4 group-hover:bg-[var(--gradient-royal)] group-hover:text-white transition-all duration-500">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-ink">Executive Council</h3>
              <p className="mt-2 text-muted-foreground">
                The institution functions under the directions of the Executive Council, Vice
                Chancellor and Registrar of JNTU-GV Vizianagaram.
              </p>
            </div>
            <div className="bg-card rounded-2xl p-8 border border-border hover-lift group">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center mb-4 group-hover:bg-[var(--gradient-royal)] group-hover:text-white transition-all duration-500">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-ink">Academic Committee</h3>
              <p className="mt-2 text-muted-foreground">
                The College Academic Committee, chaired by the Principal, comprises all professors
                and heads of departments ensuring academic excellence.
              </p>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* CTA */}
      <section className="py-16 container-narrow text-center">
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/about/jntuk" className="btn-primary">
            About JNTUK <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/about/vizianagaram" className="btn-secondary">
            About Vizianagaram <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

