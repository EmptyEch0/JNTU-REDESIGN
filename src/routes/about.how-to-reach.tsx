import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { imageUrl } from "@/lib/assets";
import { useState, useEffect } from "react";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";
import { ArrowRight, Bus, Train, Plane, Navigation, MapPin } from "lucide-react";
const campusImg = imageUrl("hero-carousal/hero-campus.jpg");
const campusMap = imageUrl("campus-map.png");
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

export const Route = createFileRoute("/about/how-to-reach")({
  loader: async () => await getPageContent({ data: "how-to-reach" }),
  head: () => ({
    meta: [
      { title: "How to Reach — JNTU-GV CEV" },
      {
        name: "description",
        content:
          "Directions to JNTU-GV College of Engineering Vizianagaram campus – by road, rail and air.",
      },
      { property: "og:title", content: "How to Reach JNTU-GV CEV" },
      {
        property: "og:description",
        content: "Driving directions, bus routes and transport options to reach the campus.",
      },
    ],
  }),
  component: HowToReachPage,
});

const DEFAULTS = {
  heroTitle: "How to Reach Campus",
  heroSubtitle: "Located across NH43, well connected to all major cities and towns.",
  t1Title: "By Bus",
  t1Desc: "From Vizianagaram APSRTC Bus Complex, board any bus going in Saluru – Bobbili Route and disembark at JNTU Bus Stop (around 5.5 KM) and walk 1.5 KM west to reach the Campus.",
  t1Alt: "Or hire an auto-rickshaw from any major point in Vizianagaram to JNTUK UCEV Campus (charges around ₹100/-)",
  t2Title: "By Train",
  t2Desc: "Vizianagaram railway junction is on the Chennai–Howrah line. Trains like Visakha Express, Konark Express, Howrah Express, East Coast Express, Hirakhand Express and Dhanbad Express halt here.",
  t3Title: "By Air",
  t3Desc: "The nearest domestic airport is at Visakhapatnam at a distance of 62 km and the nearest international airport is at Shamshabad, Hyderabad at a distance of nearly 640 km.",
  directionsTitle: "From APSRTC Bus Station, Vizianagaram",
  directionsText: `Head west on Bus Stand Rd towards Railway Station Rd | 180 m
Continue straight at Mayura Junction (Traffic Signals) | 130 m
At the roundabout, take the 2nd exit and stay on NH 43. Pass by Police Barracks (on the left in 1.1 km) | 5.2 km
Pass by Collectorate Junction, KL Puram and RTA Office | 
Continue on JNTUK-Campus Rd to your destination | 2.2 km / 5 min
Turn left onto JNTUK-Campus Rd | 1.5 km
Continue straight to reach UCEV |`,
};

function getIcon(title: string) {
  const t = title.toLowerCase();
  if (t.includes("bus")) return Bus;
  if (t.includes("train") || t.includes("rail") || t.includes("station")) return Train;
  return Plane;
}

function parseDirections(text: string) {
  return text
    .split("\n")
    .map((line) => {
      const parts = line.split("|");
      return {
        step: parts[0]?.trim() || "",
        dist: parts[1]?.trim() || "",
      };
    })
    .filter((d) => d.step);
}

function HowToReachPage() {
  const records = Route.useLoaderData() as any[];
  const { isEditMode } = useAdmin();
  const router = useRouter();

  const heroRec = records.find((r) => r.sectionKey === "hero");
  const t1Rec = records.find((r) => r.sectionKey === "t1");
  const t2Rec = records.find((r) => r.sectionKey === "t2");
  const t3Rec = records.find((r) => r.sectionKey === "t3");
  const dirRec = records.find((r) => r.sectionKey === "directions");

  const [editTexts, setEditTexts] = useState({
    heroTitle: heroRec?.title || DEFAULTS.heroTitle,
    heroSubtitle: heroRec?.content || DEFAULTS.heroSubtitle,
    t1Title: t1Rec?.title || DEFAULTS.t1Title,
    t1Desc: t1Rec?.content || DEFAULTS.t1Desc,
    t1Alt: t1Rec?.extras || DEFAULTS.t1Alt,
    t2Title: t2Rec?.title || DEFAULTS.t2Title,
    t2Desc: t2Rec?.content || DEFAULTS.t2Desc,
    t3Title: t3Rec?.title || DEFAULTS.t3Title,
    t3Desc: t3Rec?.content || DEFAULTS.t3Desc,
    directionsTitle: dirRec?.title || DEFAULTS.directionsTitle,
    directionsText: dirRec?.content || DEFAULTS.directionsText,
  });

  useEffect(() => {
    setEditTexts({
      heroTitle: heroRec?.title || DEFAULTS.heroTitle,
      heroSubtitle: heroRec?.content || DEFAULTS.heroSubtitle,
      t1Title: t1Rec?.title || DEFAULTS.t1Title,
      t1Desc: t1Rec?.content || DEFAULTS.t1Desc,
      t1Alt: t1Rec?.extras || DEFAULTS.t1Alt,
      t2Title: t2Rec?.title || DEFAULTS.t2Title,
      t2Desc: t2Rec?.content || DEFAULTS.t2Desc,
      t3Title: t3Rec?.title || DEFAULTS.t3Title,
      t3Desc: t3Rec?.content || DEFAULTS.t3Desc,
      directionsTitle: dirRec?.title || DEFAULTS.directionsTitle,
      directionsText: dirRec?.content || DEFAULTS.directionsText,
    });
  }, [records]);

  async function handleSaveSection(section: string) {
    const tId = toast.loading("Saving content section...");
    try {
      if (section === "hero") {
        await updatePageSection({
          data: {
            page: "how-to-reach",
            sectionKey: "hero",
            title: editTexts.heroTitle,
            content: editTexts.heroSubtitle,
          },
        });
      } else if (section === "t1") {
        await updatePageSection({
          data: {
            page: "how-to-reach",
            sectionKey: "t1",
            title: editTexts.t1Title,
            content: editTexts.t1Desc,
            extras: editTexts.t1Alt,
          },
        });
      } else if (section === "t2") {
        await updatePageSection({
          data: {
            page: "how-to-reach",
            sectionKey: "t2",
            title: editTexts.t2Title,
            content: editTexts.t2Desc,
          },
        });
      } else if (section === "t3") {
        await updatePageSection({
          data: {
            page: "how-to-reach",
            sectionKey: "t3",
            title: editTexts.t3Title,
            content: editTexts.t3Desc,
          },
        });
      } else if (section === "directions") {
        await updatePageSection({
          data: {
            page: "how-to-reach",
            sectionKey: "directions",
            title: editTexts.directionsTitle,
            content: editTexts.directionsText,
          },
        });
      }
      toast.success("Changes saved successfully!", { id: tId });
      router.invalidate();
    } catch {
      toast.error("Failed to save section.", { id: tId });
    }
  }

  const TRANSPORT = [
    { title: editTexts.t1Title, desc: editTexts.t1Desc, alt: editTexts.t1Alt, key: "t1", icon: getIcon(editTexts.t1Title) },
    { title: editTexts.t2Title, desc: editTexts.t2Desc, alt: "", key: "t2", icon: getIcon(editTexts.t2Title) },
    { title: editTexts.t3Title, desc: editTexts.t3Desc, alt: "", key: "t3", icon: getIcon(editTexts.t3Title) },
  ];

  const DIRECTIONS = parseDirections(editTexts.directionsText);

  return (
    <>
      {isEditMode && <AdminModeBanner label="How to Reach Editor Active" />}

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

      {/* Transport modes */}
      <section className="py-24 md:py-32 container-narrow">
        <RevealOnScroll>
          <SectionLabel eyebrow="Getting here" title="Multiple ways to reach us" />
        </RevealOnScroll>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {TRANSPORT.map((t, i) => (
            <RevealOnScroll key={t.key} delay={i * 120}>
              <div className="bg-card rounded-2xl p-8 border border-border hover-lift h-full group flex flex-col justify-between">
                <div>
                  <div className="h-12 w-12 rounded-xl bg-[var(--gradient-royal)] text-white grid place-items-center mb-5 group-hover:scale-110 transition-transform duration-200">
                    <t.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-ink">{t.title}</h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">{t.desc}</p>
                  {t.alt && <p className="mt-3 text-sm text-primary font-medium">{t.alt}</p>}
                </div>

                {isEditMode && (
                  <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
                    <input
                      className="w-full border border-amber-200 bg-amber-50/20 rounded px-2 py-1 text-xs outline-none font-semibold"
                      value={t.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditTexts((prev) => ({ ...prev, [`${t.key}Title`]: val }));
                      }}
                    />
                    <textarea
                      className="w-full border border-amber-200 bg-amber-50/20 rounded px-2 py-1 text-xs outline-none"
                      value={t.desc}
                      rows={4}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditTexts((prev) => ({ ...prev, [`${t.key}Desc`]: val }));
                      }}
                    />
                    {t.key === "t1" && (
                      <input
                        placeholder="Alternative transport / extra tip"
                        className="w-full border border-amber-200 bg-amber-50/20 rounded px-2 py-1 text-xs outline-none"
                        value={t.alt}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditTexts((prev) => ({ ...prev, t1Alt: val }));
                        }}
                      />
                    )}
                    <button
                      onClick={() => handleSaveSection(t.key)}
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
      </section>

      {/* Driving directions */}
      <section className="py-20 bg-sand">
        <div className="container-narrow">
          <RevealOnScroll>
            {isEditMode ? (
              <AdminPanel>
                <AdminPanelHeader title="Edit Driving Directions">
                  <AdminSaveButton onClick={() => handleSaveSection("directions")} label="Save Directions" />
                </AdminPanelHeader>
                <div className="space-y-4">
                  <AdminField label="Directions Hero Title">
                    <AdminInput
                      value={editTexts.directionsTitle}
                      onChange={(e) => setEditTexts({ ...editTexts, directionsTitle: e.target.value })}
                    />
                  </AdminField>
                  <AdminField label="Directions (One step per line in the format: Step Description | Distance)">
                    <AdminTextarea
                      value={editTexts.directionsText}
                      onChange={(e) => setEditTexts({ ...editTexts, directionsText: e.target.value })}
                      rows={8}
                    />
                  </AdminField>
                </div>
              </AdminPanel>
            ) : (
              <SectionLabel eyebrow="Driving Directions" title={editTexts.directionsTitle} />
            )}
          </RevealOnScroll>
          {!isEditMode && (
            <RevealOnScroll delay={100}>
              <div className="mt-10 bg-card rounded-2xl border border-border p-8 max-w-2xl">
                <ol className="space-y-4">
                  {DIRECTIONS.map((d, i) => (
                    <li key={i} className="flex gap-4 group">
                      <div className="flex flex-col items-center shrink-0">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary grid place-items-center text-sm font-semibold group-hover:bg-[var(--gradient-royal)] group-hover:text-white transition-all duration-200">
                          {i + 1}
                        </div>
                        {i < DIRECTIONS.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                      </div>
                      <div className="pb-4">
                        <p className="text-ink font-medium">{d.step}</p>
                        {d.dist && <p className="text-sm text-muted-foreground mt-1">{d.dist}</p>}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </RevealOnScroll>
          )}
        </div>
      </section>

      {/* Map */}
      <section className="py-24 container-narrow">
        <RevealOnScroll>
          <SectionLabel eyebrow="Campus Map" title="Location overview" align="center" />
        </RevealOnScroll>
        <RevealOnScroll delay={100}>
          <div className="mt-10 flex justify-center">
            <img
              src={campusMap}
              alt="Directions map showing route from Vizianagaram to JNTUK UCEV campus"
              loading="lazy"
              className="rounded-3xl border border-border shadow-[var(--shadow-elegant)] max-w-2xl w-full hover:scale-[1.01] transition-transform duration-300"
            />
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
            <MapPin className="h-3.5 w-3.5" /> JNTU-GV College of Engineering, Dwarapudi,
            Vizianagaram – 535003
          </p>
        </RevealOnScroll>
      </section>

      {/* Embedded map */}
      <section className="pb-24 container-narrow">
        <RevealOnScroll>
          <div className="rounded-3xl overflow-hidden border border-border shadow-[var(--shadow-card)] aspect-[16/9] bg-sand">
            <iframe
              title="Campus location on map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=83.32%2C18.10%2C83.50%2C18.18&layer=mapnik&marker=18.1418%2C83.4115"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </RevealOnScroll>
      </section>

      <section className="py-16 container-narrow text-center">
        <Link to="/contact" className="btn-primary">
          Contact Us <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </>
  );
}

