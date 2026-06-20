import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { imageUrl } from "@/lib/assets";
import { useState, useEffect } from "react";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";
import { ArrowRight, Eye, Target, Shield, BookOpen } from "lucide-react";
const campusImg = imageUrl("hero-carousal/hero-campus.jpg");
const ugcImg = imageUrl("ugc-certificate.png");
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

export const Route = createFileRoute("/about/vision-mission")({
  loader: async () => await getPageContent({ data: "vision-mission" }),
  head: () => ({
    meta: [
      { title: "Vision & Mission — JNTU-GV CEV" },
      {
        name: "description",
        content:
          "Vision, Mission and UGC recognition of JNTU-GV College of Engineering Vizianagaram.",
      },
      { property: "og:title", content: "Vision & Mission — JNTU-GV CEV" },
      {
        property: "og:description",
        content: "Our guiding principles and UGC 2(f) & 12(B) recognition.",
      },
    ],
  }),
  component: VisionMissionPage,
});

const DEFAULTS = {
  heroTitle: "Vision & Mission",
  heroSubtitle: "Guiding principles that shape our pursuit of engineering excellence.",
  visionTitle: "A premier institution for the future",
  visionContent: "To emerge as a premier technical Institution in the field of engineering and research with a focus to produce professionally competent and socially sensitive engineers capable of working in a multidisciplinary global environment.",
  m1Text: "To provide high quality technical education through a creative balance of academia and industry by adopting highly effective teaching learning processes.",
  m2Text: "To promote multidisciplinary research with a global perspective to attain professional excellence.",
  m3Text: "To establish standards that inculcate ethical and moral values that contribute to growth in the Career and development of society.",
  ugcDesc: "The College is eligible to receive Central assistance in terms of the Rules framed under Section 12(B) of the UGC Act, 1956. The college has been recognized under Section 2(f) and 12(B) of the UGC Act.",
  ugcYear: "2007",
  ugcType: "Aided & Constituent College",
  ugcRec: "Section 2(f) & 12(B)",
};

function VisionMissionPage() {
  const records = Route.useLoaderData() as any[];
  const { isEditMode } = useAdmin();
  const router = useRouter();

  const heroRec = records.find((r) => r.sectionKey === "hero");
  const visionRec = records.find((r) => r.sectionKey === "vision");
  const m1Rec = records.find((r) => r.sectionKey === "m1");
  const m2Rec = records.find((r) => r.sectionKey === "m2");
  const m3Rec = records.find((r) => r.sectionKey === "m3");
  const ugcRecInfo = records.find((r) => r.sectionKey === "ugc");

  const [editTexts, setEditTexts] = useState({
    heroTitle: heroRec?.title || DEFAULTS.heroTitle,
    heroSubtitle: heroRec?.content || DEFAULTS.heroSubtitle,
    visionTitle: visionRec?.title || DEFAULTS.visionTitle,
    visionContent: visionRec?.content || DEFAULTS.visionContent,
    m1Text: m1Rec?.content || DEFAULTS.m1Text,
    m2Text: m2Rec?.content || DEFAULTS.m2Text,
    m3Text: m3Rec?.content || DEFAULTS.m3Text,
    ugcDesc: ugcRecInfo?.content || DEFAULTS.ugcDesc,
    ugcYear: ugcRecInfo?.title || DEFAULTS.ugcYear,
    ugcType: records.find((r) => r.sectionKey === "ugc_type")?.content || DEFAULTS.ugcType,
    ugcRec: records.find((r) => r.sectionKey === "ugc_rec")?.content || DEFAULTS.ugcRec,
  });

  useEffect(() => {
    setEditTexts({
      heroTitle: heroRec?.title || DEFAULTS.heroTitle,
      heroSubtitle: heroRec?.content || DEFAULTS.heroSubtitle,
      visionTitle: visionRec?.title || DEFAULTS.visionTitle,
      visionContent: visionRec?.content || DEFAULTS.visionContent,
      m1Text: m1Rec?.content || DEFAULTS.m1Text,
      m2Text: m2Rec?.content || DEFAULTS.m2Text,
      m3Text: m3Rec?.content || DEFAULTS.m3Text,
      ugcDesc: ugcRecInfo?.content || DEFAULTS.ugcDesc,
      ugcYear: ugcRecInfo?.title || DEFAULTS.ugcYear,
      ugcType: records.find((r) => r.sectionKey === "ugc_type")?.content || DEFAULTS.ugcType,
      ugcRec: records.find((r) => r.sectionKey === "ugc_rec")?.content || DEFAULTS.ugcRec,
    });
  }, [records]);

  async function handleSaveSection(section: string) {
    const tId = toast.loading("Saving vision & mission details...");
    try {
      if (section === "hero") {
        await updatePageSection({
          data: {
            page: "vision-mission",
            sectionKey: "hero",
            title: editTexts.heroTitle,
            content: editTexts.heroSubtitle,
          },
        });
      } else if (section === "vision") {
        await updatePageSection({
          data: {
            page: "vision-mission",
            sectionKey: "vision",
            title: editTexts.visionTitle,
            content: editTexts.visionContent,
          },
        });
      } else if (section === "m1") {
        await updatePageSection({
          data: {
            page: "vision-mission",
            sectionKey: "m1",
            content: editTexts.m1Text,
          },
        });
      } else if (section === "m2") {
        await updatePageSection({
          data: {
            page: "vision-mission",
            sectionKey: "m2",
            content: editTexts.m2Text,
          },
        });
      } else if (section === "m3") {
        await updatePageSection({
          data: {
            page: "vision-mission",
            sectionKey: "m3",
            content: editTexts.m3Text,
          },
        });
      } else if (section === "ugc") {
        await updatePageSection({
          data: {
            page: "vision-mission",
            sectionKey: "ugc",
            title: editTexts.ugcYear,
            content: editTexts.ugcDesc,
          },
        });
        await updatePageSection({
          data: {
            page: "vision-mission",
            sectionKey: "ugc_type",
            content: editTexts.ugcType,
          },
        });
        await updatePageSection({
          data: {
            page: "vision-mission",
            sectionKey: "ugc_rec",
            content: editTexts.ugcRec,
          },
        });
      }
      toast.success("Changes saved successfully!", { id: tId });
      router.invalidate();
    } catch {
      toast.error("Failed to save vision & mission.", { id: tId });
    }
  }

  const dynamicMissions = [
    { icon: BookOpen, text: editTexts.m1Text, key: "m1", title: "Mission 1" },
    { icon: Target, text: editTexts.m2Text, key: "m2", title: "Mission 2" },
    { icon: Shield, text: editTexts.m3Text, key: "m3", title: "Mission 3" },
  ];

  return (
    <>
      {isEditMode && <AdminModeBanner label="Vision & Mission CMS Mode" />}

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

      {/* Vision */}
      <section className="py-24 md:py-32 container-narrow">
        <RevealOnScroll>
          <div className="max-w-3xl mx-auto text-center">
            <div className="h-16 w-16 rounded-2xl bg-[var(--gradient-royal)] text-white grid place-items-center mx-auto mb-6">
              <Eye className="h-7 w-7" />
            </div>
            {isEditMode ? (
              <AdminPanel>
                <AdminPanelHeader title="Edit Vision Segment">
                  <AdminSaveButton onClick={() => handleSaveSection("vision")} label="Save Vision" />
                </AdminPanelHeader>
                <div className="space-y-4">
                  <AdminField label="Vision Header Title">
                    <AdminInput
                      value={editTexts.visionTitle}
                      onChange={(e) => setEditTexts({ ...editTexts, visionTitle: e.target.value })}
                    />
                  </AdminField>
                  <AdminField label="Vision Core Statement">
                    <AdminTextarea
                      value={editTexts.visionContent}
                      onChange={(e) => setEditTexts({ ...editTexts, visionContent: e.target.value })}
                      rows={4}
                    />
                  </AdminField>
                </div>
              </AdminPanel>
            ) : (
              <>
                <div className="text-eyebrow">Our Vision</div>
                <h2 className="text-display text-3xl md:text-4xl mt-3 text-ink">
                  {editTexts.visionTitle}
                </h2>
                <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                  {editTexts.visionContent}
                </p>
              </>
            )}
          </div>
        </RevealOnScroll>
      </section>

      {/* Mission */}
      <section className="py-20 bg-sand">
        <div className="container-narrow">
          <RevealOnScroll>
            <SectionLabel
              eyebrow="Our Mission"
              title="Three pillars of our purpose"
              align="center"
            />
          </RevealOnScroll>
          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {dynamicMissions.map((m, i) => (
              <RevealOnScroll key={m.key} delay={i * 120}>
                <div className="bg-card rounded-2xl p-8 border border-border hover-lift h-full group flex flex-col justify-between">
                  <div>
                    <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary grid place-items-center mb-5 group-hover:bg-[var(--gradient-royal)] group-hover:text-white transition-all duration-200">
                      <m.icon className="h-5 w-5" />
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-primary mb-3">
                      {m.title}
                    </div>
                    {isEditMode ? (
                      <textarea
                        className="w-full border border-amber-200 bg-amber-50/20 rounded p-2 text-sm outline-none"
                        value={m.text}
                        rows={5}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (m.key === "m1") setEditTexts(prev => ({ ...prev, m1Text: val }));
                          if (m.key === "m2") setEditTexts(prev => ({ ...prev, m2Text: val }));
                          if (m.key === "m3") setEditTexts(prev => ({ ...prev, m3Text: val }));
                        }}
                      />
                    ) : (
                      <p className="text-ink leading-relaxed">{m.text}</p>
                    )}
                  </div>

                  {isEditMode && (
                    <button
                      onClick={() => handleSaveSection(m.key)}
                      className="mt-4 w-full bg-slate-900 text-white rounded py-1.5 text-xs font-bold uppercase tracking-wider hover:bg-amber-600 transition"
                    >
                      Save Pillar
                    </button>
                  )}
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* UGC Recognition */}
      <section className="py-24 container-narrow">
        <RevealOnScroll>
          <SectionLabel eyebrow="Recognition" title="UGC 2(f) & 12(B) Status" align="center" />
        </RevealOnScroll>
        <RevealOnScroll delay={100}>
          <div className="mt-10 grid lg:grid-cols-2 gap-12 items-center">
            {isEditMode ? (
              <AdminPanel>
                <AdminPanelHeader title="Edit UGC Recognition Details">
                  <AdminSaveButton onClick={() => handleSaveSection("ugc")} label="Save UGC Data" />
                </AdminPanelHeader>
                <div className="space-y-4">
                  <AdminField label="UGC Recognition Paragraph">
                    <AdminTextarea
                      value={editTexts.ugcDesc}
                      onChange={(e) => setEditTexts({ ...editTexts, ugcDesc: e.target.value })}
                      rows={4}
                    />
                  </AdminField>
                  <AdminField label="Year of Establishment">
                    <AdminInput
                      value={editTexts.ugcYear}
                      onChange={(e) => setEditTexts({ ...editTexts, ugcYear: e.target.value })}
                    />
                  </AdminField>
                  <AdminField label="Type">
                    <AdminInput
                      value={editTexts.ugcType}
                      onChange={(e) => setEditTexts({ ...editTexts, ugcType: e.target.value })}
                    />
                  </AdminField>
                  <AdminField label="Recognition Status">
                    <AdminInput
                      value={editTexts.ugcRec}
                      onChange={(e) => setEditTexts({ ...editTexts, ugcRec: e.target.value })}
                    />
                  </AdminField>
                </div>
              </AdminPanel>
            ) : (
              <div className="space-y-5">
                <div className="bg-card rounded-2xl p-8 border border-border hover-lift">
                  <h3 className="text-lg font-semibold text-ink flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" /> UGC Recognition
                  </h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    {editTexts.ugcDesc}
                  </p>
                </div>
                <div className="bg-card rounded-2xl p-8 border border-border hover-lift">
                  <h3 className="text-lg font-semibold text-ink">Key Details</h3>
                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between py-2 border-b border-border gap-4">
                      <span className="text-muted-foreground">College Name</span>
                      <span className="text-ink font-medium text-right">
                        JNTUK University College of Engineering, Vizianagaram
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Year of Establishment</span>
                      <span className="text-ink font-medium">{editTexts.ugcYear}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Type</span>
                      <span className="text-ink font-medium">{editTexts.ugcType}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-muted-foreground">Recognition</span>
                      <span className="text-ink font-medium">{editTexts.ugcRec}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div>
              <img
                src={ugcImg}
                alt="UGC Recognition certificate under Section 2(f) and 12(B)"
                loading="lazy"
                className="rounded-2xl border border-border shadow-[var(--shadow-elegant)] w-full hover:scale-[1.02] transition-transform duration-300"
              />
              <p className="mt-3 text-xs text-muted-foreground text-center">
                UGC Recognition Letter — November 2016
              </p>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      <section className="py-16 container-narrow text-center">
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/about/institution" className="btn-primary">
            About Institution <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/about/jntuk" className="btn-secondary">
            About JNTUK <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

