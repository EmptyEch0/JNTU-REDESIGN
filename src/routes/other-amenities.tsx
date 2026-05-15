import {
  createFileRoute,
  Link,
  Outlet,
  useRouterState,
  useRouter,
} from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHero } from "@/components/PageHero";
import { OTHER_AMENITIES_SUBNAV } from "@/lib/site";
import { useAdmin } from "@/context/AdminContext";
import { getPageContent, updatePageSection } from "@/funcs/site.server";
import { toast } from "sonner";
import { Save, Lock, Edit, Image as ImageIcon } from "lucide-react";

import typeA from "@/assets/faculity-quaters1.jpg";
import guest from "@/assets/guestoffice.jpg";

export const Route = createFileRoute("/other-amenities")({
  loader: async () => await getPageContent({ data: "amenities" }),
  component: OtherAmenitiesPage,
});

const DEFAULTS = {
  heroTitle: "Other Amenities",
  heroSubtitle: "Premium residential and world-class hospitality facilities on campus",
  introTitle: "On-Campus Residential & Hospitality",
  introText: "JNTU-GV provides secure, comfortable, and well-maintained residential and lodging spaces. These facilities guarantee comfort, proximity to work, and a vibrant academic ecosystem.",
  staffTitle: "Staff Quarters",
  staffDesc: "Comfortable and fully-serviced residential accommodation is provided for non-teaching and support staff members, promoting a tight-knit community.",
  staffImg: "",
  guestTitle: "Guest House",
  guestDesc: "A world-class lodging facility offering VIP suites and executive rooms for visiting dignitaries, speakers, and external examiners.",
  guestImg: "",
};

function OtherAmenitiesPage() {
  const initialData = Route.useLoaderData() as any[];
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isOverview = path === "/other-amenities";
  const { isEditMode } = useAdmin();
  const router = useRouter();

  const heroRec = initialData.find((r) => r.sectionKey === "hero");
  const introRec = initialData.find((r) => r.sectionKey === "intro");
  const staffRec = initialData.find((r) => r.sectionKey === "staff");
  const guestRec = initialData.find((r) => r.sectionKey === "guest");

  const [editTexts, setEditTexts] = useState({
    heroTitle: heroRec?.title || DEFAULTS.heroTitle,
    heroSubtitle: heroRec?.content || DEFAULTS.heroSubtitle,
    introTitle: introRec?.title || DEFAULTS.introTitle,
    introText: introRec?.content || DEFAULTS.introText,
    staffTitle: staffRec?.title || DEFAULTS.staffTitle,
    staffDesc: staffRec?.content || DEFAULTS.staffDesc,
    staffImg: staffRec?.imageUrl || DEFAULTS.staffImg,
    guestTitle: guestRec?.title || DEFAULTS.guestTitle,
    guestDesc: guestRec?.content || DEFAULTS.guestDesc,
    guestImg: guestRec?.imageUrl || DEFAULTS.guestImg,
  });

  useEffect(() => {
    setEditTexts({
      heroTitle: heroRec?.title || DEFAULTS.heroTitle,
      heroSubtitle: heroRec?.content || DEFAULTS.heroSubtitle,
      introTitle: introRec?.title || DEFAULTS.introTitle,
      introText: introRec?.content || DEFAULTS.introText,
      staffTitle: staffRec?.title || DEFAULTS.staffTitle,
      staffDesc: staffRec?.content || DEFAULTS.staffDesc,
      staffImg: staffRec?.imageUrl || DEFAULTS.staffImg,
      guestTitle: guestRec?.title || DEFAULTS.guestTitle,
      guestDesc: guestRec?.content || DEFAULTS.guestDesc,
      guestImg: guestRec?.imageUrl || DEFAULTS.guestImg,
    });
  }, [initialData]);

  async function handleSaveSection(section: "hero" | "intro" | "staff" | "guest") {
    const tId = toast.loading("Saving content...");
    try {
      if (section === "hero") {
        await updatePageSection({
          data: {
            page: "amenities",
            sectionKey: "hero",
            title: editTexts.heroTitle,
            content: editTexts.heroSubtitle,
          },
        });
      } else if (section === "intro") {
        await updatePageSection({
          data: {
            page: "amenities",
            sectionKey: "intro",
            title: editTexts.introTitle,
            content: editTexts.introText,
          },
        });
      } else if (section === "staff") {
        await updatePageSection({
          data: {
            page: "amenities",
            sectionKey: "staff",
            title: editTexts.staffTitle,
            content: editTexts.staffDesc,
            imageUrl: editTexts.staffImg,
          },
        });
      } else if (section === "guest") {
        await updatePageSection({
          data: {
            page: "amenities",
            sectionKey: "guest",
            title: editTexts.guestTitle,
            content: editTexts.guestDesc,
            imageUrl: editTexts.guestImg,
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
    <div className="min-h-screen bg-slate-50/50">
      {isEditMode && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-white font-black py-3 px-6 sticky top-0 z-[100] shadow-xl flex items-center justify-center gap-2.5 border-b border-amber-700/30 animate-[fade-in_0.3s] backdrop-blur-md text-xs uppercase tracking-widest">
          <Lock className="w-3.5 h-3.5 animate-pulse text-amber-950" />
          <span>Live Amenities Editorial Enabled</span>
          <div className="hidden md:block h-1 w-1 rounded-full bg-amber-950" />
          <span className="hidden md:block text-amber-100 normal-case italic font-medium">
            Click inline editors and save modifications live.
          </span>
        </div>
      )}

      <PageHero
        title={heroRec?.title || DEFAULTS.heroTitle}
        subtitle={heroRec?.content || DEFAULTS.heroSubtitle}
      />

      {/* EDIT HERO SECTION */}
      {isEditMode && (
        <div className="max-w-4xl mx-auto px-4 mt-6">
          <div className="bg-amber-50/40 border-2 border-amber-200 rounded-3xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-amber-200/50 pb-2">
              <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                <Edit className="w-3 h-3" /> Page Hero Title & Subtitle
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
                placeholder="Hero Title (e.g., Other Amenities)"
                className="w-full border-2 border-amber-200/60 bg-white p-3 rounded-xl text-sm font-bold outline-none focus:border-amber-400"
              />
              <input
                value={editTexts.heroSubtitle}
                onChange={(e) =>
                  setEditTexts({ ...editTexts, heroSubtitle: e.target.value })
                }
                placeholder="Hero Subtitle copy..."
                className="w-full border-2 border-amber-200/60 bg-white p-3 rounded-xl text-sm font-medium outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUB NAV */}
      <div className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/80 backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-3 no-scrollbar justify-start sm:justify-center">
            {OTHER_AMENITIES_SUBNAV.map((item) => {
              const active = path === item.to || path.startsWith(item.to + "/");
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`shrink-0 rounded-full px-5 py-2 text-xs sm:text-sm font-semibold tracking-wide uppercase transition-all duration-300 border ${
                    active
                      ? "bg-primary text-white border-primary shadow-md shadow-primary/20 scale-[1.02]"
                      : "bg-white text-slate-600 border-slate-200 hover:text-primary hover:border-primary/40 hover:bg-slate-50/50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {isOverview ? (
        <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 animate-[fade-in_0.5s_ease-out] space-y-16">
          
          {/* INTRO EXPLAINER */}
          {isEditMode ? (
            <div className="max-w-3xl mx-auto p-6 bg-amber-50/40 border-2 border-amber-200 rounded-3xl space-y-5 animate-[fade-in_0.3s]">
              <div className="flex items-center justify-between border-b border-amber-200/50 pb-2">
                <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Edit className="w-3 h-3" /> Intro Banner Text
                </span>
                <button
                  onClick={() => handleSaveSection("intro")}
                  className="bg-amber-500 text-amber-950 hover:bg-amber-600 font-black px-4.5 py-2 rounded-xl text-[10px] uppercase shadow active:scale-95 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" /> Save Section
                </button>
              </div>
              <div className="space-y-3">
                <input
                  value={editTexts.introTitle}
                  onChange={(e) =>
                    setEditTexts({ ...editTexts, introTitle: e.target.value })
                  }
                  className="w-full border-2 border-amber-200/60 bg-white p-3 rounded-xl text-sm font-extrabold focus:border-amber-400 outline-none"
                  placeholder="Intro Header"
                />
                <textarea
                  value={editTexts.introText}
                  onChange={(e) =>
                    setEditTexts({ ...editTexts, introText: e.target.value })
                  }
                  className="w-full h-28 border-2 border-amber-200/60 bg-white p-4 rounded-xl text-sm font-medium focus:border-amber-400 outline-none"
                  placeholder="Description payload..."
                />
              </div>
            </div>
          ) : (
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {introRec?.title || DEFAULTS.introTitle}
              </h2>
              <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
              <p className="text-base sm:text-lg text-slate-500 leading-relaxed font-medium whitespace-pre-line">
                {introRec?.content || DEFAULTS.introText}
              </p>
            </div>
          )}

          {/* CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* CARD 1: STAFF QUARTERS */}
            <div className="flex flex-col gap-4">
              <Link
                to="/other-amenities/staff-quarters"
                className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1 h-full"
              >
                <div className="relative overflow-hidden h-64">
                  <img
                    src={staffRec?.imageUrl || typeA}
                    alt={staffRec?.title || DEFAULTS.staffTitle}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
                  <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary tracking-wide uppercase">
                    Welfare
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                      {staffRec?.title || DEFAULTS.staffTitle}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 font-medium">
                      {staffRec?.content || DEFAULTS.staffDesc}
                    </p>
                  </div>
                  <div className="pt-2 text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">
                    Explore Details <span>&rarr;</span>
                  </div>
                </div>
              </Link>

              {isEditMode && (
                <div className="p-5 bg-amber-50/40 border-2 border-amber-200 rounded-3xl space-y-4 animate-[fade-in_0.3s]">
                  <div className="flex items-center justify-between border-b border-amber-200/50 pb-2">
                    <span className="text-[10px] font-black text-amber-800 uppercase flex items-center gap-1">
                      <Edit className="w-3 h-3" /> Quarters Card Edits
                    </span>
                    <button
                      onClick={() => handleSaveSection("staff")}
                      className="bg-amber-500 text-amber-950 hover:bg-amber-600 font-black px-3.5 py-1.5 rounded-xl text-[9px] uppercase tracking-wider shadow active:scale-95 transition cursor-pointer"
                    >
                      Save Card
                    </button>
                  </div>
                  <div className="space-y-2.5">
                    <input
                      value={editTexts.staffTitle}
                      onChange={(e) =>
                        setEditTexts({ ...editTexts, staffTitle: e.target.value })
                      }
                      placeholder="Card Title (e.g. Staff Quarters)"
                      className="w-full border bg-white text-xs px-3 py-2 rounded-xl font-bold outline-none focus:border-amber-400"
                    />
                    <textarea
                      value={editTexts.staffDesc}
                      onChange={(e) =>
                        setEditTexts({ ...editTexts, staffDesc: e.target.value })
                      }
                      className="w-full h-20 border bg-white text-xs p-3 rounded-xl font-medium outline-none focus:border-amber-400"
                      placeholder="Quarters summary..."
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-amber-800 uppercase flex items-center gap-1">
                      <ImageIcon className="w-2.5 h-2.5" /> Image Overrides
                    </label>
                    <input
                      value={editTexts.staffImg}
                      onChange={(e) =>
                        setEditTexts({ ...editTexts, staffImg: e.target.value })
                      }
                      placeholder="Paste URL (optional)"
                      className="w-full border bg-white px-3 py-2 text-xs rounded-xl outline-none font-semibold"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* CARD 2: GUEST HOUSE */}
            <div className="flex flex-col gap-4">
              <Link
                to="/other-amenities/guest-house"
                className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1 h-full"
              >
                <div className="relative overflow-hidden h-64">
                  <img
                    src={guestRec?.imageUrl || guest}
                    alt={guestRec?.title || DEFAULTS.guestTitle}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
                  <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary tracking-wide uppercase">
                    Hospitality
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                      {guestRec?.title || DEFAULTS.guestTitle}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 font-medium">
                      {guestRec?.content || DEFAULTS.guestDesc}
                    </p>
                  </div>
                  <div className="pt-2 text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">
                    Explore Details <span>&rarr;</span>
                  </div>
                </div>
              </Link>

              {isEditMode && (
                <div className="p-5 bg-amber-50/40 border-2 border-amber-200 rounded-3xl space-y-4 animate-[fade-in_0.3s]">
                  <div className="flex items-center justify-between border-b border-amber-200/50 pb-2">
                    <span className="text-[10px] font-black text-amber-800 uppercase flex items-center gap-1">
                      <Edit className="w-3 h-3" /> Guest House Card Edits
                    </span>
                    <button
                      onClick={() => handleSaveSection("guest")}
                      className="bg-amber-500 text-amber-950 hover:bg-amber-600 font-black px-3.5 py-1.5 rounded-xl text-[9px] uppercase tracking-wider shadow active:scale-95 transition cursor-pointer"
                    >
                      Save Card
                    </button>
                  </div>
                  <div className="space-y-2.5">
                    <input
                      value={editTexts.guestTitle}
                      onChange={(e) =>
                        setEditTexts({ ...editTexts, guestTitle: e.target.value })
                      }
                      placeholder="Card Title (e.g. Guest House)"
                      className="w-full border bg-white text-xs px-3 py-2 rounded-xl font-bold outline-none focus:border-amber-400"
                    />
                    <textarea
                      value={editTexts.guestDesc}
                      onChange={(e) =>
                        setEditTexts({ ...editTexts, guestDesc: e.target.value })
                      }
                      className="w-full h-20 border bg-white text-xs p-3 rounded-xl font-medium outline-none focus:border-amber-400"
                      placeholder="Guest summary..."
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-amber-800 uppercase flex items-center gap-1">
                      <ImageIcon className="w-2.5 h-2.5" /> Image Overrides
                    </label>
                    <input
                      value={editTexts.guestImg}
                      onChange={(e) =>
                        setEditTexts({ ...editTexts, guestImg: e.target.value })
                      }
                      placeholder="Paste URL (optional)"
                      className="w-full border bg-white px-3 py-2 text-xs rounded-xl outline-none font-semibold"
                    />
                  </div>
                </div>
              )}
            </div>

          </div>
        </section>
      ) : (
        <section className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <Outlet />
        </section>
      )}
    </div>
  );
}

export default OtherAmenitiesPage;