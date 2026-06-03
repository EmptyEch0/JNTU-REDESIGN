import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SubNav } from "@/components/SubNav";
import { CAMPUS_LIFE_SUBNAV } from "@/lib/site";
import { useAdmin } from "@/context/AdminContext";
import { getPageContent, updatePageSection } from "@/funcs/site.server";
import { toast } from "sonner";
import { Save, Lock, Edit, Image as ImageIcon } from "lucide-react";

import campusLifeImg from "@/assets/campus-life.jpg";
import cultureImg from "@/assets/culture.jpeg";
import sportsImg from "@/assets/Ground.jpg";

export const Route = createFileRoute("/campus-life/")({
  loader: async () => await getPageContent({ data: "campus-overview" }),
  head: () => ({
    meta: [
      { title: "Campus Life — JNTU-GV CEV" },
      {
        name: "description",
        content:
          "Clubs, festivals, sports and the rhythm of student life on a residential campus.",
      },
      {
        property: "og:title",
        content: "Campus Life at JNTU-GV CEV",
      },
      {
        property: "og:description",
        content:
          "A residential campus full of culture, clubs and conversations.",
      },
      {
        property: "og:image",
        content: campusLifeImg,
      },
    ],
  }),
  component: CampusLifePage,
});

const DEFAULTS = {
  heroTitle: "A campus that lives, all day.",
  heroSubtitle:
    "Studies are only the beginning. The campus comes alive in clubs, fests, courts and the spaces in between.",
  culturalTitle: "Cultural",
  culturalDesc:
    "Annual fests, music, dance, drama and the inter-college tournaments that come with them.",
  culturalImg: "",
  technicalTitle: "Technical",
  technicalDesc:
    "Coding clubs, hackathons, robotics and a steady cadence of departmental events.",
  technicalImg: "",
  sportsTitle: "Sports",
  sportsDesc:
    "Daily play, weekly tournaments and an annual sports meet that brings the campus together.",
  sportsImg: "",
};

function CampusLifePage() {
  const initialData = Route.useLoaderData() as any[];
  const { isEditMode } = useAdmin();
  const router = useRouter();

  const heroRec = initialData.find((r) => r.sectionKey === "hero");
  const culturalRec = initialData.find((r) => r.sectionKey === "cultural");
  const technicalRec = initialData.find((r) => r.sectionKey === "technical");
  const sportsRec = initialData.find((r) => r.sectionKey === "sports");

  const [editTexts, setEditTexts] = useState({
    heroTitle: heroRec?.title || DEFAULTS.heroTitle,
    heroSubtitle: heroRec?.content || DEFAULTS.heroSubtitle,
    culturalTitle: culturalRec?.title || DEFAULTS.culturalTitle,
    culturalDesc: culturalRec?.content || DEFAULTS.culturalDesc,
    culturalImg: culturalRec?.imageUrl || DEFAULTS.culturalImg,
    technicalTitle: technicalRec?.title || DEFAULTS.technicalTitle,
    technicalDesc: technicalRec?.content || DEFAULTS.technicalDesc,
    technicalImg: technicalRec?.imageUrl || DEFAULTS.technicalImg,
    sportsTitle: sportsRec?.title || DEFAULTS.sportsTitle,
    sportsDesc: sportsRec?.content || DEFAULTS.sportsDesc,
    sportsImg: sportsRec?.imageUrl || DEFAULTS.sportsImg,
  });

  useEffect(() => {
    setEditTexts({
      heroTitle: heroRec?.title || DEFAULTS.heroTitle,
      heroSubtitle: heroRec?.content || DEFAULTS.heroSubtitle,
      culturalTitle: culturalRec?.title || DEFAULTS.culturalTitle,
      culturalDesc: culturalRec?.content || DEFAULTS.culturalDesc,
      culturalImg: culturalRec?.imageUrl || DEFAULTS.culturalImg,
      technicalTitle: technicalRec?.title || DEFAULTS.technicalTitle,
      technicalDesc: technicalRec?.content || DEFAULTS.technicalDesc,
      technicalImg: technicalRec?.imageUrl || DEFAULTS.technicalImg,
      sportsTitle: sportsRec?.title || DEFAULTS.sportsTitle,
      sportsDesc: sportsRec?.content || DEFAULTS.sportsDesc,
      sportsImg: sportsRec?.imageUrl || DEFAULTS.sportsImg,
    });
  }, [initialData]);

  async function handleSaveSection(
    section: "hero" | "cultural" | "technical" | "sports"
  ) {
    const tId = toast.loading("Saving content...");
    try {
      if (section === "hero") {
        await updatePageSection({
          data: {
            page: "campus-overview",
            sectionKey: "hero",
            title: editTexts.heroTitle,
            content: editTexts.heroSubtitle,
          },
        });
      } else if (section === "cultural") {
        await updatePageSection({
          data: {
            page: "campus-overview",
            sectionKey: "cultural",
            title: editTexts.culturalTitle,
            content: editTexts.culturalDesc,
            imageUrl: editTexts.culturalImg,
          },
        });
      } else if (section === "technical") {
        await updatePageSection({
          data: {
            page: "campus-overview",
            sectionKey: "technical",
            title: editTexts.technicalTitle,
            content: editTexts.technicalDesc,
            imageUrl: editTexts.technicalImg,
          },
        });
      } else if (section === "sports") {
        await updatePageSection({
          data: {
            page: "campus-overview",
            sectionKey: "sports",
            title: editTexts.sportsTitle,
            content: editTexts.sportsDesc,
            imageUrl: editTexts.sportsImg,
          },
        });
      }
      toast.success("Changes saved successfully!", { id: tId });
      router.invalidate();
    } catch {
      toast.error("Failed to save.", { id: tId });
    }
  }

  const PILLARS = [
    {
      key: "cultural" as const,
      title: culturalRec?.title || DEFAULTS.culturalTitle,
      desc: culturalRec?.content || DEFAULTS.culturalDesc,
      img: culturalRec?.imageUrl || cultureImg,
      link: "/campus-life/music-club",
      editTitle: editTexts.culturalTitle,
      editText: editTexts.culturalDesc,
      editImg: editTexts.culturalImg,
    },
    {
      key: "technical" as const,
      title: technicalRec?.title || DEFAULTS.technicalTitle,
      desc: technicalRec?.content || DEFAULTS.technicalDesc,
      img: technicalRec?.imageUrl || campusLifeImg,
      link: "/campus-life/student-activity-club",
      editTitle: editTexts.technicalTitle,
      editText: editTexts.technicalDesc,
      editImg: editTexts.technicalImg,
    },
    {
      key: "sports" as const,
      title: sportsRec?.title || DEFAULTS.sportsTitle,
      desc: sportsRec?.content || DEFAULTS.sportsDesc,
      img: sportsRec?.imageUrl || sportsImg,
      link: "/sports",
      editTitle: editTexts.sportsTitle,
      editText: editTexts.sportsDesc,
      editImg: editTexts.sportsImg,
    },
  ];

  return (
    <div className="w-full">
      {isEditMode && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-white font-black py-3 px-6 sticky top-0 z-[100] shadow-xl flex items-center justify-center gap-2.5 border-b border-amber-700/30 animate-[fade-in_0.15s] backdrop-blur-md text-xs uppercase tracking-widest">
          <Lock className="w-3.5 h-3.5 animate-pulse text-amber-950" />
          <span>Live Campus Editorial Enabled</span>
          <div className="hidden md:block h-1 w-1 rounded-full bg-amber-950" />
          <span className="hidden md:block text-amber-100 normal-case italic font-medium">
            Toggle inline blocks below to shape university messaging.
          </span>
        </div>
      )}

      <PageHero
        eyebrow="Campus Life"
        title={heroRec?.title || DEFAULTS.heroTitle}
        subtitle={heroRec?.content || DEFAULTS.heroSubtitle}
        image={campusLifeImg}
      />

      {/* EDIT HERO */}
      {isEditMode && (
        <div className="max-w-4xl mx-auto px-4 mt-6 animate-[fade-in_0.15s]">
          <div className="bg-amber-50/40 border-2 border-amber-200 rounded-3xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-amber-200/50 pb-2">
              <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                <Edit className="w-3 h-3" /> Page Hero Header & Subtitle
              </span>
              <button
                onClick={() => handleSaveSection("hero")}
                className="bg-amber-500 text-amber-950 hover:bg-amber-600 font-black px-4.5 py-2 rounded-xl text-[10px] uppercase shadow active:scale-95 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" /> Save Hero
              </button>
            </div>
            <div className="space-y-3">
              <input
                value={editTexts.heroTitle}
                onChange={(e) =>
                  setEditTexts({ ...editTexts, heroTitle: e.target.value })
                }
                placeholder="Hero Title (e.g. A campus that lives, all day.)"
                className="w-full border-2 border-amber-200/60 bg-white p-3.5 rounded-xl text-sm font-bold outline-none focus:border-amber-400"
              />
              <textarea
                value={editTexts.heroSubtitle}
                onChange={(e) =>
                  setEditTexts({ ...editTexts, heroSubtitle: e.target.value })
                }
                placeholder="Hero Subtitle text..."
                className="w-full border-2 border-amber-200/60 bg-white p-3.5 rounded-xl text-sm font-medium outline-none focus:border-amber-400 h-20"
              />
            </div>
          </div>
        </div>
      )}

      <SubNav items={CAMPUS_LIFE_SUBNAV} />

      <section className="py-20 container-narrow space-y-20">
        {PILLARS.map((p, i) => (
          <RevealOnScroll key={p.title}>
            <div className="flex flex-col gap-6">
              <Link
                to={p.link}
                className={`grid lg:grid-cols-2 gap-10 items-center group cursor-pointer ${
                  i % 2 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                {/* IMAGE */}
                <div className="overflow-hidden rounded-3xl shadow-[var(--shadow-elegant)] aspect-[4/3]">
                  <img
                    src={p.img}
                    alt={p.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                </div>

                {/* CONTENT */}
                <div className="transition-all duration-300 group-hover:translate-x-1">
                  <div className="text-eyebrow">
                    Pillar {String(i + 1).padStart(2, "0")}
                  </div>

                  <h2 className="text-display text-3xl md:text-5xl mt-3 text-ink font-black">
                    {p.title}
                  </h2>

                  <p className="mt-5 text-lg text-muted-foreground leading-relaxed font-medium">
                    {p.desc}
                  </p>

                  <div className="mt-6 inline-flex items-center gap-2 text-primary font-extrabold">
                    Explore More
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </Link>

              {/* ADMIN EDIT BLOCK FOR PILLAR */}
              {isEditMode && (
                <div
                  className={`max-w-3xl w-full bg-amber-50/40 border-2 border-amber-200 rounded-3xl p-6 space-y-4 mt-2 self-center animate-[fade-in_0.15s]`}
                >
                  <div className="flex items-center justify-between border-b border-amber-200/50 pb-2.5">
                    <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Edit className="w-3.5 h-3.5" /> {p.title} Pillar Control
                    </span>
                    <button
                      onClick={() => handleSaveSection(p.key)}
                      className="bg-amber-500 text-amber-950 hover:bg-amber-600 font-black px-4 py-2 rounded-xl text-[10px] uppercase tracking-wider shadow active:scale-95 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" /> Save Pillar
                    </button>
                  </div>
                  <div className="space-y-3">
                    <input
                      value={p.editTitle}
                      onChange={(e) =>
                        setEditTexts({
                          ...editTexts,
                          [`${p.key}Title`]: e.target.value,
                        })
                      }
                      placeholder="Pillar Display Title (e.g., Cultural)"
                      className="w-full border-2 border-amber-200/60 bg-white px-3.5 py-2.5 text-sm font-bold rounded-xl outline-none focus:border-amber-400"
                    />
                    <textarea
                      value={p.editText}
                      onChange={(e) =>
                        setEditTexts({
                          ...editTexts,
                          [`${p.key}Desc`]: e.target.value,
                        })
                      }
                      placeholder={`Enter summary of ${p.title}...`}
                      className="w-full h-24 border-2 border-amber-200/60 bg-white p-3.5 rounded-2xl text-sm font-medium outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-amber-800 uppercase flex items-center gap-1 tracking-wide">
                      <ImageIcon className="w-2.5 h-2.5" /> Pillar Cover URL
                    </label>
                    <input
                      value={p.editImg}
                      onChange={(e) =>
                        setEditTexts({
                          ...editTexts,
                          [`${p.key}Img`]: e.target.value,
                        })
                      }
                      placeholder="Paste direct URL override (optional)"
                      className="w-full border-2 border-amber-200/60 bg-white px-3.5 py-2.5 text-xs font-semibold rounded-xl outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              )}
            </div>
          </RevealOnScroll>
        ))}
      </section>
    </div>
  );
}

