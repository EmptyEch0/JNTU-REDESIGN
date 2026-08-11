import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { imageUrl } from "@/lib/assets";
import { useState, useEffect } from "react";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";
import { ArrowRight, MapPin, Music, Crown, Landmark } from "lucide-react";
const vizImg = imageUrl("vizianagaram.jpg");
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

export const Route = createFileRoute("/about/vizianagaram")({
  loader: async () => await getPageContent({ data: "vizianagaram" }),
  head: () => ({
    meta: [
      { title: "About Vizianagaram — JNTU-GV CEV" },
      {
        name: "description",
        content:
          "Vizianagaram – the City of Victory. 500 years of glorious past, rich cultural heritage, and the cultural capital of Andhra Pradesh.",
      },
      { property: "og:title", content: "About Vizianagaram" },
      {
        property: "og:description",
        content: "The cultural capital of Andhra Pradesh with 500 years of heritage.",
      },
    ],
  }),
  component: VizPage,
});

const DEFAULTS = {
  heroTitle: "Vizianagaram — The City of Victory",
  heroSubtitle: "500 years of glorious past and rich cultural heritage made Vizianagaram the cultural capital of Andhra Pradesh.",
  historyTitle: "A city steeped in history",
  historyContent: "Vizianagaram is the main city of the Vizianagaram District of North Eastern Andhra Pradesh in Southern India. An important centre for commerce and education, the city is located 18 km inland from the Bay of Bengal and 42 km to the northeast of Visakhapatnam. Vizianagaram translates to the \"city of victory\".\n\nIt is, at present, the largest municipality of Andhra Pradesh in terms of population. As of 2011 Census of India, the town had a population of 227,533.\n\nThe climate of Vizianagaram is characterized by high humidity nearly all the year round, with oppressive summers and good seasonal rainfall. The summer season extends from March to May, followed by the southwest monsoon season, which continues to September.",
  eminentPersonalitiesSubtitle: "Many luminaries have added new dimensions of glory to Vizianagaram.",
  p1Name: "Dr. P.V.G. Raju",
  p1Desc: "The Raja Saheb who renounced his Zamindari without compensation for the cause of education.",
  p2Name: "Sri Gurajada Apparao",
  p2Desc: "The great social reformer and literary icon.",
  p3Name: "Sri Adibhatla Narayana Das",
  p3Desc: "The celebrated poet and singer.",
  p4Name: "Kodi Rammurthy",
  p4Desc: "The legendary wrestler who brought glory to the region.",
  p5Name: "Dwaram Venkataswamy Naidu",
  p5Desc: "Renowned violinist and musician.",
  p6Name: "Gantasala Venkateswara Rao",
  p6Desc: "The divine singer and legendary playback artist.",
  legacyTitle: "The citadel of education",
  legacyContent: "The Raja Saheb Dr. P.V.G. Raju who inherits the socialistic fervor and the spirit of religious tolerance from his ancestors renounced his Zamindari without taking any compensation and their fort is now entirely becoming the citadel of education which houses one of the oldest colleges — Maharaja College (1879) — in India.\n\nThe talented musicians Dwaram Venkata Swami Naidu, Saluri Rajeswara Rao hail from this place. The divine singers Gantasala and Suseela who were the proud students of Maharaja College of Music added indescribable grace to the art of singing.",
  t1Title: "Roadways",
  t1Desc: "APSRTC operates bus services from Vizianagaram to all major cities and towns in the state.",
  t2Title: "Railways",
  t2Desc: "Vizianagaram railway station is on the Khurda Road-Visakhapatnam section of Howrah-Chennai main line. Many important trains halt here.",
  t3Title: "Airport",
  t3Desc: "The nearest airport is in Visakhapatnam which is about 62 km from Vizianagaram.",
};

function VizPage() {
  const records = Route.useLoaderData() as any[];
  const { isEditMode } = useAdmin();
  const router = useRouter();

  const heroRec = records.find((r) => r.sectionKey === "hero");
  const historyRec = records.find((r) => r.sectionKey === "history");
  const pHeadRec = records.find((r) => r.sectionKey === "personalities_head");
  const legacyRec = records.find((r) => r.sectionKey === "legacy");

  const p1Rec = records.find((r) => r.sectionKey === "p1");
  const p2Rec = records.find((r) => r.sectionKey === "p2");
  const p3Rec = records.find((r) => r.sectionKey === "p3");
  const p4Rec = records.find((r) => r.sectionKey === "p4");
  const p5Rec = records.find((r) => r.sectionKey === "p5");
  const p6Rec = records.find((r) => r.sectionKey === "p6");

  const t1Rec = records.find((r) => r.sectionKey === "t1");
  const t2Rec = records.find((r) => r.sectionKey === "t2");
  const t3Rec = records.find((r) => r.sectionKey === "t3");

  const [editTexts, setEditTexts] = useState({
    heroTitle: heroRec?.title || DEFAULTS.heroTitle,
    heroSubtitle: heroRec?.content || DEFAULTS.heroSubtitle,
    historyTitle: historyRec?.title || DEFAULTS.historyTitle,
    historyContent: historyRec?.content || DEFAULTS.historyContent,
    pHeadSubtitle: pHeadRec?.content || DEFAULTS.eminentPersonalitiesSubtitle,
    p1Name: p1Rec?.title || DEFAULTS.p1Name,
    p1Desc: p1Rec?.content || DEFAULTS.p1Desc,
    p2Name: p2Rec?.title || DEFAULTS.p2Name,
    p2Desc: p2Rec?.content || DEFAULTS.p2Desc,
    p3Name: p3Rec?.title || DEFAULTS.p3Name,
    p3Desc: p3Rec?.content || DEFAULTS.p3Desc,
    p4Name: p4Rec?.title || DEFAULTS.p4Name,
    p4Desc: p4Rec?.content || DEFAULTS.p4Desc,
    p5Name: p5Rec?.title || DEFAULTS.p5Name,
    p5Desc: p5Rec?.content || DEFAULTS.p5Desc,
    p6Name: p6Rec?.title || DEFAULTS.p6Name,
    p6Desc: p6Rec?.content || DEFAULTS.p6Desc,
    legacyTitle: legacyRec?.title || DEFAULTS.legacyTitle,
    legacyContent: legacyRec?.content || DEFAULTS.legacyContent,
    t1Title: t1Rec?.title || DEFAULTS.t1Title,
    t1Desc: t1Rec?.content || DEFAULTS.t1Desc,
    t2Title: t2Rec?.title || DEFAULTS.t2Title,
    t2Desc: t2Rec?.content || DEFAULTS.t2Desc,
    t3Title: t3Rec?.title || DEFAULTS.t3Title,
    t3Desc: t3Rec?.content || DEFAULTS.t3Desc,
  });

  useEffect(() => {
    setEditTexts({
      heroTitle: heroRec?.title || DEFAULTS.heroTitle,
      heroSubtitle: heroRec?.content || DEFAULTS.heroSubtitle,
      historyTitle: historyRec?.title || DEFAULTS.historyTitle,
      historyContent: historyRec?.content || DEFAULTS.historyContent,
      pHeadSubtitle: pHeadRec?.content || DEFAULTS.eminentPersonalitiesSubtitle,
      p1Name: p1Rec?.title || DEFAULTS.p1Name,
      p1Desc: p1Rec?.content || DEFAULTS.p1Desc,
      p2Name: p2Rec?.title || DEFAULTS.p2Name,
      p2Desc: p2Rec?.content || DEFAULTS.p2Desc,
      p3Name: p3Rec?.title || DEFAULTS.p3Name,
      p3Desc: p3Rec?.content || DEFAULTS.p3Desc,
      p4Name: p4Rec?.title || DEFAULTS.p4Name,
      p4Desc: p4Rec?.content || DEFAULTS.p4Desc,
      p5Name: p5Rec?.title || DEFAULTS.p5Name,
      p5Desc: p5Rec?.content || DEFAULTS.p5Desc,
      p6Name: p6Rec?.title || DEFAULTS.p6Name,
      p6Desc: p6Rec?.content || DEFAULTS.p6Desc,
      legacyTitle: legacyRec?.title || DEFAULTS.legacyTitle,
      legacyContent: legacyRec?.content || DEFAULTS.legacyContent,
      t1Title: t1Rec?.title || DEFAULTS.t1Title,
      t1Desc: t1Rec?.content || DEFAULTS.t1Desc,
      t2Title: t2Rec?.title || DEFAULTS.t2Title,
      t2Desc: t2Rec?.content || DEFAULTS.t2Desc,
      t3Title: t3Rec?.title || DEFAULTS.t3Title,
      t3Desc: t3Rec?.content || DEFAULTS.t3Desc,
    });
  }, [records]);

  async function handleSaveSection(section: string) {
    const tId = toast.loading("Saving content section...");
    try {
      if (section === "hero") {
        await updatePageSection({
          data: {
            page: "vizianagaram",
            sectionKey: "hero",
            title: editTexts.heroTitle,
            content: editTexts.heroSubtitle,
          },
        });
      } else if (section === "history") {
        await updatePageSection({
          data: {
            page: "vizianagaram",
            sectionKey: "history",
            title: editTexts.historyTitle,
            content: editTexts.historyContent,
          },
        });
      } else if (section === "personalities_head") {
        await updatePageSection({
          data: {
            page: "vizianagaram",
            sectionKey: "personalities_head",
            title: "Eminent personalities",
            content: editTexts.pHeadSubtitle,
          },
        });
      } else if (section.startsWith("p")) {
        const num = section.substring(1);
        const name = (editTexts as any)[`p${num}Name`];
        const desc = (editTexts as any)[`p${num}Desc`];
        await updatePageSection({
          data: {
            page: "vizianagaram",
            sectionKey: `p${num}`,
            title: name,
            content: desc,
          },
        });
      } else if (section === "legacy") {
        await updatePageSection({
          data: {
            page: "vizianagaram",
            sectionKey: "legacy",
            title: editTexts.legacyTitle,
            content: editTexts.legacyContent,
          },
        });
      } else if (section.startsWith("t")) {
        const num = section.substring(1);
        const title = (editTexts as any)[`t${num}Title`];
        const desc = (editTexts as any)[`t${num}Desc`];
        await updatePageSection({
          data: {
            page: "vizianagaram",
            sectionKey: `t${num}`,
            title,
            content: desc,
          },
        });
      }
      toast.success("Changes saved successfully!", { id: tId });
      router.invalidate();
    } catch {
      toast.error("Failed to save section.", { id: tId });
    }
  }

  const PERSONALITIES = [
    { name: editTexts.p1Name, desc: editTexts.p1Desc, key: "p1" },
    { name: editTexts.p2Name, desc: editTexts.p2Desc, key: "p2" },
    { name: editTexts.p3Name, desc: editTexts.p3Desc, key: "p3" },
    { name: editTexts.p4Name, desc: editTexts.p4Desc, key: "p4" },
    { name: editTexts.p5Name, desc: editTexts.p5Desc, key: "p5" },
    { name: editTexts.p6Name, desc: editTexts.p6Desc, key: "p6" },
  ];

  const TRANSPORT = [
    { title: editTexts.t1Title, desc: editTexts.t1Desc, key: "t1" },
    { title: editTexts.t2Title, desc: editTexts.t2Desc, key: "t2" },
    { title: editTexts.t3Title, desc: editTexts.t3Desc, key: "t3" },
  ];

  return (
    <>
      {isEditMode && <AdminModeBanner label="Vizianagaram Editor Active" />}

      <PageHero
        eyebrow="About"
        title={editTexts.heroTitle}
        subtitle={editTexts.heroSubtitle}
        image={vizImg}
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

      <section className="py-24 md:py-32 container-narrow grid lg:grid-cols-2 gap-16 items-start">
        <RevealOnScroll>
          <img decoding="async"
            src={vizImg}
            alt="Vizianagaram Clock Tower"
            loading="lazy"
            className="rounded-3xl aspect-[3/4] object-cover w-full shadow-[var(--shadow-elegant)] hover:scale-[1.02] transition-transform duration-300"
          />
        </RevealOnScroll>
        <RevealOnScroll delay={150}>
          {isEditMode ? (
            <AdminPanel>
              <AdminPanelHeader title="Edit City Heritage Overview">
                <AdminSaveButton onClick={() => handleSaveSection("history")} label="Save Overview" />
              </AdminPanelHeader>
              <div className="space-y-4">
                <AdminField label="Overview Block Title">
                  <AdminInput
                    value={editTexts.historyTitle}
                    onChange={(e) => setEditTexts({ ...editTexts, historyTitle: e.target.value })}
                  />
                </AdminField>
                <AdminField label="History Paragraph Narrative (separated by double linebreaks)">
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
              <div className="text-eyebrow flex items-center gap-2">
                <MapPin className="h-3 w-3" /> The City
              </div>
              <h2 className="text-display text-3xl md:text-4xl mt-3 text-ink">
                {editTexts.historyTitle}
              </h2>
              <div className="mt-6 space-y-4 text-muted-foreground text-lg leading-relaxed whitespace-pre-line">
                {editTexts.historyContent.split("\n\n").map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </>
          )}
        </RevealOnScroll>
      </section>

      {/* Cultural Heritage */}
      <section className="py-20 bg-sand">
        <div className="container-narrow">
          <RevealOnScroll>
            {isEditMode ? (
              <div className="mb-6">
                <AdminPanel>
                  <AdminPanelHeader title="Edit Personalities Subtitle">
                    <AdminSaveButton onClick={() => handleSaveSection("personalities_head")} label="Save Subtitle" />
                  </AdminPanelHeader>
                  <AdminField label="Personalities Subtitle">
                    <AdminInput
                      value={editTexts.pHeadSubtitle}
                      onChange={(e) => setEditTexts({ ...editTexts, pHeadSubtitle: e.target.value })}
                    />
                  </AdminField>
                </AdminPanel>
              </div>
            ) : (
              <SectionLabel
                eyebrow="Heritage"
                title="Eminent personalities"
                subtitle={editTexts.pHeadSubtitle}
                align="center"
              />
            )}
          </RevealOnScroll>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PERSONALITIES.map((p, i) => (
              <RevealOnScroll key={p.key} delay={i * 80}>
                <div className="bg-card rounded-2xl p-7 border border-border hover-lift h-full group cursor-default flex flex-col justify-between">
                  <div>
                    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center mb-4 group-hover:bg-[var(--gradient-royal)] group-hover:text-white transition-all duration-200">
                      {i < 2 ? (
                        <Crown className="h-5 w-5" />
                      ) : i < 4 ? (
                        <Landmark className="h-5 w-5" />
                      ) : (
                        <Music className="h-5 w-5" />
                      )}
                    </div>
                    <h3 className="text-base font-semibold text-ink">{p.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                  </div>

                  {isEditMode && (
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                      <input
                        className="w-full border border-amber-200 bg-amber-50/20 rounded px-2 py-1 text-xs outline-none"
                        value={p.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditTexts((prev: any) => ({ ...prev, [`${p.key}Name`]: val }));
                        }}
                      />
                      <textarea
                        className="w-full border border-amber-200 bg-amber-50/20 rounded px-2 py-1 text-xs outline-none"
                        value={p.desc}
                        rows={2}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditTexts((prev: any) => ({ ...prev, [`${p.key}Desc`]: val }));
                        }}
                      />
                      <button
                        onClick={() => handleSaveSection(p.key)}
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

      {/* Fort & Education */}
      <section className="py-24 container-narrow">
        <RevealOnScroll>
          <div className="max-w-3xl">
            {isEditMode ? (
              <AdminPanel>
                <AdminPanelHeader title="Edit Legacy Block">
                  <AdminSaveButton onClick={() => handleSaveSection("legacy")} label="Save Legacy" />
                </AdminPanelHeader>
                <div className="space-y-4">
                  <AdminField label="Legacy Title">
                    <AdminInput
                      value={editTexts.legacyTitle}
                      onChange={(e) => setEditTexts({ ...editTexts, legacyTitle: e.target.value })}
                    />
                  </AdminField>
                  <AdminField label="Legacy Narrative paragraphs (separated by double linebreaks)">
                    <AdminTextarea
                      value={editTexts.legacyContent}
                      onChange={(e) => setEditTexts({ ...editTexts, legacyContent: e.target.value })}
                      rows={6}
                    />
                  </AdminField>
                </div>
              </AdminPanel>
            ) : (
              <>
                <div className="text-eyebrow">Education Legacy</div>
                <h2 className="text-display text-3xl md:text-4xl mt-3 text-ink">
                  {editTexts.legacyTitle}
                </h2>
                <div className="mt-6 text-muted-foreground text-lg leading-relaxed space-y-4 whitespace-pre-line">
                  {editTexts.legacyContent.split("\n\n").map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>
              </>
            )}
          </div>
        </RevealOnScroll>
      </section>

      {/* Transport */}
      <section className="py-20 bg-sand">
        <div className="container-narrow">
          <RevealOnScroll>
            <SectionLabel eyebrow="Connectivity" title="Transportation" />
          </RevealOnScroll>
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {TRANSPORT.map((t, i) => (
              <RevealOnScroll key={t.key} delay={i * 100}>
                <div className="bg-card rounded-2xl p-7 border border-border hover-lift h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-ink">{t.title}</h3>
                    <p className="mt-3 text-muted-foreground">{t.desc}</p>
                  </div>

                  {isEditMode && (
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                      <input
                        className="w-full border border-amber-200 bg-amber-50/20 rounded px-2 py-1 text-xs outline-none"
                        value={t.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditTexts((prev: any) => ({ ...prev, [`${t.key}Title`]: val }));
                        }}
                      />
                      <textarea
                        className="w-full border border-amber-200 bg-amber-50/20 rounded px-2 py-1 text-xs outline-none"
                        value={t.desc}
                        rows={2}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditTexts((prev: any) => ({ ...prev, [`${t.key}Desc`]: val }));
                        }}
                      />
                      <button
                        onClick={() => handleSaveSection(t.key)}
                        className="w-full bg-slate-900 text-white rounded py-1 text-[10px] uppercase font-bold tracking-wider hover:bg-amber-600 transition"
                      >
                        Save Connectivity Card
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
        <Link to="/about/how-to-reach" className="btn-primary">
          How to Reach Campus <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </>
  );
}

