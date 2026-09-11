import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  ArrowRight,
  ArrowDown,
  Bell,
  MapPin,
  GraduationCap,
  Building2,
  BookOpen,
  Trophy,
  Stethoscope,
  FlaskConical,
  Briefcase,
  Mail,
  Phone,
  Eye,
  Target,
  Shield,
  Quote,
  CheckCircle2,
  Users,
  Calendar,
  Save,
  X,
  Check,
  Edit2,
} from "lucide-react";
import { imageUrl } from "@/lib/assets";

const hero1 = "/images/independence_day.webp";
const hero2 = "/images/hero-carousal/hero-5.webp";
const hero3 = "/images/hero-carousal/hero-4.webp";
const campusLifeImg = imageUrl("campus-life/campus-life.jpg");
import hostelImg from "@/assets/hostel.jpg";
import sportsImg from "@/assets/sports.jpg";
import libraryImg from "@/assets/library-interior.jpg";
import dispensaryImg from "@/assets/dispensary.png";
import labImg from "@/assets/lab.webp";
import cultureImg from "@/assets/culture.webp";
import placementsImg from "@/assets/placements-bg.webp";
import vakulaImg from "@/assets/vakula.jpg";
import nagaRajuImg from "@/assets/naga-raju.webp";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { StatCounter } from "@/components/StatCounter";
import { ParallaxBg } from "@/components/ParallaxBg";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { SectionLabel } from "@/components/SectionLabel";
import { MarqueeLogos } from "@/components/MarqueeLogos";
import { STATS, RECRUITERS } from "@/lib/site"; // Removed static DEPARTMENTS import
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import { getLeadershipData, updateLeadershipData } from "../funcs/leadership";
import { getAllDepartments } from "@/functions/departments"; // Added our new query hook target
import { getAssetUrl, STATIC_DEPARTMENTS } from "@/lib/departments";
import { getHostelData } from "@/funcs/hostel.server";
import { getLibraryData } from "@/funcs/library.server";
import { getDispensaryData } from "@/funcs/dispensary.server";
import { getSportsData } from "@/funcs/sports.server";
import { getJntugvGalleryImages, getNotices, getCampusGallery, getPageContent, updatePageSection } from "@/funcs/site.server";
import { AdminUpload } from "@/components/AdminEditPanel";
import { ImageWithLoader } from "@/components/ImageWithLoader";
import { LatestUpdatesSection } from "@/components/LatestUpdatesSection";
import { HomeNotificationsSection } from "@/components/HomeNotificationsSection";
import { HeroGalleryMiniCarousel } from "@/components/HeroGalleryMiniCarousel";


export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    // Phase 1 — CRITICAL (blocking): data needed for above-the-fold render.
    // Await these so the page paints with notices, principal card and department
    // grid already populated from cache.
    await Promise.allSettled([
      context.queryClient.ensureQueryData({
        queryKey: ["notices", "all"],
        queryFn: () => getNotices(),
      }),
      context.queryClient.ensureQueryData({
        queryKey: ["leadership", "principal"],
        queryFn: () => getLeadershipData({ data: "principal" }),
      }),
      context.queryClient.ensureQueryData({
        queryKey: ["leadership", "vice-principal"],
        queryFn: () => getLeadershipData({ data: "vice-principal" }),
      }),
      context.queryClient.ensureQueryData({
        queryKey: ["departments", "all"],
        queryFn: () => getAllDepartments(),
      }),
    ]);

    // Phase 2 — DEFERRED (non-blocking): below-the-fold sections.
    // Intentionally NOT awaited — these populate the React Query cache in the
    // background while the page is already visible, eliminating the 9-request
    // waterfall that was blocking initial paint.
    Promise.allSettled([
      context.queryClient.ensureQueryData({
        queryKey: ["hostel", "data"],
        queryFn: () => getHostelData(),
      }),
      context.queryClient.ensureQueryData({
        queryKey: ["library", "data"],
        queryFn: () => getLibraryData(),
      }),
      context.queryClient.ensureQueryData({
        queryKey: ["dispensary", "data"],
        queryFn: () => getDispensaryData(),
      }),
      context.queryClient.ensureQueryData({
        queryKey: ["sports", "data"],
        queryFn: () => getSportsData(),
      }),
      context.queryClient.ensureQueryData({
        queryKey: ["jntugv-gallery"],
        queryFn: () => getJntugvGalleryImages(),
      }),
      context.queryClient.ensureQueryData({
        queryKey: ["campus-gallery-db"],
        queryFn: () => getCampusGallery(),
      }),
    ]);
  },
  head: () => ({
    meta: [
      { title: "JNTU-GV CEV — Engineering Tomorrow, Together" },
      {
        name: "description",
        content:
          "JNTU-GV College of Engineering Vizianagaram: a premier institution for engineering, research and innovation in Andhra Pradesh.",
      },
      { property: "og:title", content: "JNTU-GV College of Engineering Vizianagaram" },
      {
        property: "og:description",
        content: "1450 students. 7 disciplines. One ambition — engineering tomorrow.",
      },
    ],
    links: [
      { rel: "canonical", href: "https://jntugvcev.edu.in/" },
      {
        rel: "preload",
        as: "image",
        href: hero1,
        fetchPriority: "high",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          "name": "JNTU-GV College of Engineering Vizianagaram",
          "url": "https://jntugvcev.edu.in/",
          "logo": "https://jntugvcev.edu.in/logo-circle.png",
          "description": "A premier engineering college shaping tomorrow's innovators — JNTU-GV CEV.",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Dwarapudi",
            "addressLocality": "Vizianagaram",
            "addressRegion": "Andhra Pradesh",
            "postalCode": "535003",
            "addressCountry": "IN"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-8922-244100",
            "contactType": "customer service",
            "email": "principal@jntugv.edu.in"
          }
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "JNTU-GV CEV",
          "url": "https://jntugvcev.edu.in/"
        }),
      }
    ],
  }),
  component: HomePage,
});

const FACILITIES = [
  {
    title: "Hostels",
    desc: "318+ rooms across UG & PG residences with modern amenities.",
    img: hostelImg,
    to: "/hostels",
    icon: Building2,
  },
  {
    title: "Library",
    desc: "A quiet, well-stocked knowledge commons open all day.",
    img: libraryImg,
    to: "/library",
    icon: BookOpen,
  },
  {
    title: "Sports",
    desc: "Cricket, athletics, indoor games and a fitness gym.",
    img: sportsImg,
    to: "/sports",
    icon: Trophy,
  },
  {
    title: "Dispensary",
    desc: "On-campus medical care with full-time health assistants.",
    img: dispensaryImg,
    to: "/dispensary",
    icon: Stethoscope,
  },
  {
    title: "R&D Cell",
    desc: "Funded research with UGC, DST, DAE and NRB.",
    img: labImg,
    to: "/rd-cell",
    icon: FlaskConical,
  },
  {
    title: "Placements",
    desc: "Top recruiters every year — TCS, Infosys, Amazon and more.",
    img: placementsImg,
    to: "/placements",
    icon: Briefcase,
  },
];

// Shared cache config — data is stable, reuse it for 10 min before refetching
const QUERY_CACHE = { staleTime: 10 * 60 * 1000, gcTime: 30 * 60 * 1000 } as const;

function HomePage() {
  const { isEditMode } = useAdmin();
  const queryClient = useQueryClient();

  const { data: homeRecords = [] } = useQuery({
    queryKey: ["site-content", "homepage"],
    queryFn: () => getPageContent({ data: "homepage" }),
    ...QUERY_CACHE,
  });

  const { data: principal } = useQuery({
    queryKey: ["leadership", "principal"],
    queryFn: () => getLeadershipData({ data: "principal" }),
    ...QUERY_CACHE,
  });

  const { data: vicePrincipal } = useQuery({
    queryKey: ["leadership", "vice-principal"],
    queryFn: () => getLeadershipData({ data: "vice-principal" }),
    ...QUERY_CACHE,
  });

  // Home content sections
  const whoRec = (homeRecords as any[]).find((r: any) => r.sectionKey === "who-we-are");
  const visionRec = (homeRecords as any[]).find((r: any) => r.sectionKey === "vision");
  const missionRec = (homeRecords as any[]).find((r: any) => r.sectionKey === "mission");

  let defaultWhoHeading = "Building excellence, shaping futures.";
  let defaultWhoDesc =
    "Established in 2007 as a constituent college of JNTU-GV, our institution is recognized by UGC under section 2(f) & 12(B) and approved by AICTE. We bring together rigorous academics and a thriving research community.";
  if (whoRec?.content) {
    try {
      const parsed = JSON.parse(whoRec.content);
      if (parsed.title) defaultWhoHeading = parsed.title;
      if (parsed.description) defaultWhoDesc = parsed.description;
    } catch {
      defaultWhoDesc = whoRec.content;
    }
  }

  const [whoData, setWhoData] = useState({
    eyebrow: whoRec?.title || "Who we are",
    title: defaultWhoHeading,
    description: defaultWhoDesc,
  });

  const [visionData, setVisionData] = useState({
    title: visionRec?.title || "Our Vision",
    content:
      visionRec?.content ||
      "To emerge as a premier technical institution in the field of engineering and research, with a dedicated focus on producing professionally competent and socially sensitive engineers capable of thriving in a multidisciplinary global environment.",
  });

  const [missionData, setMissionData] = useState({
    title: missionRec?.title || "Core Mission",
    content:
      missionRec?.content ||
      "We are committed to providing high-quality technical education through a creative balance of academics and industry. By adopting highly effective teaching-learning processes and promoting multidisciplinary research, we inculcate ethical and moral values that contribute to professional growth and social development.",
  });

  useEffect(() => {
    if (whoRec) {
      let h = "Building excellence, shaping futures.";
      let d =
        "Established in 2007 as a constituent college of JNTU-GV, our institution is recognized by UGC under section 2(f) & 12(B) and approved by AICTE. We bring together rigorous academics and a thriving research community.";
      try {
        const parsed = JSON.parse(whoRec.content);
        if (parsed.title) h = parsed.title;
        if (parsed.description) d = parsed.description;
      } catch {
        d = whoRec.content || d;
      }
      setWhoData({
        eyebrow: whoRec.title || "Who we are",
        title: h,
        description: d,
      });
    }
    if (visionRec) {
      setVisionData({
        title: visionRec.title || "Our Vision",
        content: visionRec.content || visionData.content,
      });
    }
    if (missionRec) {
      setMissionData({
        title: missionRec.title || "Core Mission",
        content: missionRec.content || missionData.content,
      });
    }
  }, [homeRecords]);

  const [principalEdit, setPrincipalEdit] = useState<any>(null);
  const [vicePrincipalEdit, setVicePrincipalEdit] = useState<any>(null);

  const principalActive = principalEdit || principal;
  const vicePrincipalActive = vicePrincipalEdit || vicePrincipal;

  const updateHomeSectionMut = useMutation({
    mutationFn: updatePageSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-content", "homepage"] });
      toast.success("Homepage content section saved!");
    },
    onError: () => toast.error("Failed to save homepage section."),
  });

  const updateLeadershipMut = useMutation({
    mutationFn: updateLeadershipData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadership"] });
      setPrincipalEdit(null);
      setVicePrincipalEdit(null);
      toast.success("Leadership profile updated!");
    },
    onError: () => toast.error("Failed to update leadership profile."),
  });

  const principalPhoto =
    principalActive?.image &&
    !principalActive.image.includes("placeholder") &&
    !principalActive.image.endsWith("Principal.png")
      ? getAssetUrl(principalActive.image)
      : vakulaImg;

  const vicePrincipalPhoto =
    vicePrincipalActive?.image && !vicePrincipalActive.image.includes("placeholder")
      ? getAssetUrl(vicePrincipalActive.image)
      : nagaRajuImg;

  // Pull array dynamically from Neon database
  const { data: liveDepartments = [] } = useQuery({
    queryKey: ["departments", "all"],
    queryFn: () => getAllDepartments(),
    ...QUERY_CACHE,
  });

  // Instantly merge static fallbacks with live DB departments for zero-latency frame 0 rendering
  const departmentsList = useMemo(() => {
    const map = new Map(STATIC_DEPARTMENTS.map((d) => [d.slug.toLowerCase(), { ...d }]));
    if (Array.isArray(liveDepartments) && liveDepartments.length > 0) {
      for (const live of liveDepartments) {
        const slugKey = (live.slug || "").toLowerCase();
        if (slugKey) {
          const existing = map.get(slugKey);
          map.set(slugKey, {
            ...existing,
            ...live,
            id: live.id || existing?.id || slugKey,
            name: live.name || existing?.name || "",
            hod: live.hod || existing?.hod || "",
            description: live.description || existing?.description || "",
            image: live.image || existing?.image || "",
          });
        }
      }
    }
    return Array.from(map.values());
  }, [liveDepartments]);

  const { data: hostelData } = useQuery({
    queryKey: ["hostel", "data"],
    queryFn: () => getHostelData(),
    ...QUERY_CACHE,
  });

  const { data: libraryData } = useQuery({
    queryKey: ["library", "data"],
    queryFn: () => getLibraryData(),
    ...QUERY_CACHE,
  });

  const { data: dispensaryData } = useQuery({
    queryKey: ["dispensary", "data"],
    queryFn: () => getDispensaryData(),
    ...QUERY_CACHE,
  });

  const { data: sportsData } = useQuery({
    queryKey: ["sports", "data"],
    queryFn: () => getSportsData(),
    ...QUERY_CACHE,
  });

  const { data: galleryImages = [] } = useQuery({
    queryKey: ["jntugv-gallery"],
    queryFn: () => getJntugvGalleryImages(),
    ...QUERY_CACHE,
  });
  const { data: dbGallery = [] } = useQuery({
    queryKey: ["campus-gallery-db"],
    queryFn: () => getCampusGallery(),
    ...QUERY_CACHE,
  });

  // Select the latest items sorted strictly by date descending (NO random, only latest unique events)
  const homepageSelectedImages = useMemo(() => {
    if (!galleryImages || galleryImages.length === 0) return [];

    // Strictly sort by date descending (latest first)
    const sorted = [...galleryImages].sort((a, b) => {
      const timeA = new Date(a.date || 0).getTime();
      const timeB = new Date(b.date || 0).getTime();
      return timeB - timeA;
    });

    // Deduplicate so each unique event gets 1 prominent card
    const uniqueList: typeof galleryImages = [];
    const seenTitles = new Set<string>();

    for (const item of sorted) {
      const cleanKey = (item.title || "").trim().toLowerCase();
      if (cleanKey && !seenTitles.has(cleanKey)) {
        seenTitles.add(cleanKey);
        uniqueList.push(item);
      }
      if (uniqueList.length >= 7) break;
    }

    return uniqueList;
  }, [galleryImages]);

  const getFacilityImage = (title: string, staticImg: string) => {
    let dbImgUrl: string | undefined;
    if (title === "Hostels") {
      dbImgUrl = hostelData?.images?.[0]?.url;
    } else if (title === "Library") {
      dbImgUrl = libraryData?.images?.[0]?.url;
    } else if (title === "Dispensary") {
      dbImgUrl = dispensaryData?.images?.[0]?.url;
    } else if (title === "Sports") {
      dbImgUrl = sportsData?.images?.[0]?.url;
    }
    return dbImgUrl ? getAssetUrl(dbImgUrl) : staticImg;
  };

  return (
    <>
      {/* HERO — auto-rotating slideshow */}
      <section className="relative w-full overflow-hidden">
        <HeroSlideshow
          images={[
            { src: hero1, alt: "80th Independence Day Celebrations at JNTU-GV" },
            { src: hero2, alt: "JNTU-GV College of Engineering Campus Building" },
            { src: hero3, alt: "Dr. Y.S.R. Central Knowledge Commons & Library" },
          ]}
          interval={6500}
          minHeight="clamp(580px, calc(100svh - 150px), 760px)"
          overlay="linear-gradient(180deg, oklch(0.18 0.05 260 / 0.6) 0%, oklch(0.18 0.05 260 / 0.4) 40%, oklch(0.18 0.05 260 / 0.85) 100%)"
        >
          <div className="w-full max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 h-full flex flex-col justify-center pt-14 sm:pt-20 pb-12 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Hero Typography & Actions */}
              <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
                <div className="text-eyebrow !text-cyan-300 animate-[fade-up_0.3s_ease-out_0.3s_both] flex items-center gap-2.5 font-bold tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                    VIZIANAGARAM, AP
                  </span>
                  <span className="h-1 w-1 rounded-full bg-white/40" />
                  <span>ESTABLISHED IN 2007</span>
                </div>

                <h1 className="text-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl font-extrabold mt-2.5 max-w-4xl 2xl:max-w-5xl animate-[fade-up_0.4s_ease-out_0.5s_both] leading-[1.08] tracking-tight">
                  Engineering tomorrow,
                  <br />
                  <span>together.</span>
                </h1>

                <p className="mt-3.5 text-sm sm:text-base md:text-lg 2xl:text-xl text-white/90 max-w-2xl 2xl:max-w-3xl leading-relaxed animate-[fade-up_0.4s_ease-out_0.8s_both] font-normal">
                  A constituent college of JNTU-GV, approved by AICTE New Delhi, and recognized by UGC
                  under section 2(f) &amp; 12(B) of UGC Act 1956 — shaping the future of engineering since 2007.
                </p>

                <div className="mt-5 flex flex-wrap gap-3 animate-[fade-up_0.4s_ease-out_1s_both]">
                  <Link to="/academics" className="btn-primary">
                    Academics <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link to="/campus-life" className="btn-ghost">
                    Explore Campus
                  </Link>
                  <Link to="/notices" className="btn-ghost">
                    <Bell className="h-4 w-4" /> Notifications
                  </Link>
                </div>
              </div>

              {/* Right Column: Sleek Mini Highlights Carousel */}
              <div className="lg:col-span-6 xl:col-span-6 flex justify-start lg:justify-end w-full lg:pr-2 xl:pr-4 animate-[fade-up_0.5s_ease-out_0.8s_both]">
                <HeroGalleryMiniCarousel galleryImages={galleryImages} dbGallery={dbGallery} />
              </div>
            </div>
          </div>
        </HeroSlideshow>

        <div className="absolute bottom-9 left-1/2 -translate-x-1/2 text-white/70 text-[10px] uppercase tracking-[0.3em] flex flex-col items-center gap-1 animate-[float_3s_ease-in-out_infinite] z-20 pointer-events-none hidden sm:flex">
          <span>Scroll</span>
          <ArrowDown className="h-3.5 w-3.5" />
        </div>
      </section>


      {/* ABOUT, VISION, LEADERSHIP & STATS SECTION */}
      <section className="py-20 md:py-28 relative overflow-hidden bg-[#FAF8F5]/85">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{ background: "var(--gradient-glow)" }}
        />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] -z-10" />

        <div className="container-narrow">
          <div className="grid lg:grid-cols-12 gap-10 xl:gap-14 items-start">
            {/* Left Column: Who We Are, Vision, Mission */}
            <div className="lg:col-span-7 space-y-8">
              <RevealOnScroll>
                {isEditMode ? (
                  <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">
                        Edit Who We Are
                      </span>
                      <button
                        onClick={() =>
                          updateHomeSectionMut.mutate({
                            data: {
                              page: "homepage",
                              sectionKey: "who-we-are",
                              title: whoData.eyebrow,
                              content: JSON.stringify({
                                title: whoData.title,
                                description: whoData.description,
                              }),
                            },
                          })
                        }
                        disabled={updateHomeSectionMut.isPending}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-all"
                      >
                        <Save className="h-3.5 w-3.5" /> Save Section
                      </button>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">
                        Eyebrow Label
                      </label>
                      <input
                        type="text"
                        value={whoData.eyebrow}
                        onChange={(e) => setWhoData({ ...whoData, eyebrow: e.target.value })}
                        className="w-full bg-white px-3 py-1.5 rounded-lg border border-border text-xs font-bold text-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">
                        Main Title
                      </label>
                      <input
                        type="text"
                        value={whoData.title}
                        onChange={(e) => setWhoData({ ...whoData, title: e.target.value })}
                        className="w-full bg-white px-3 py-2 rounded-lg border border-border text-sm font-bold text-ink outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={whoData.description}
                        onChange={(e) => setWhoData({ ...whoData, description: e.target.value })}
                        className="w-full bg-white px-3 py-2 rounded-lg border border-border text-xs text-muted-foreground leading-relaxed outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
                      {whoData.eyebrow}
                    </div>
                    <h2 className="text-display text-4xl sm:text-5xl lg:text-[54px] font-bold mt-3 text-ink leading-[1.12] tracking-tight whitespace-pre-line">
                      {whoData.title}
                    </h2>
                    <p className="mt-5 text-base sm:text-[17px] text-muted-foreground leading-relaxed">
                      {whoData.description}
                    </p>
                  </>
                )}
              </RevealOnScroll>

              <div className="space-y-4">
                <RevealOnScroll delay={100}>
                  <div className="group p-6 sm:p-7 rounded-[22px] bg-white border border-[#EAE6DF] shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-primary/20 hover:shadow-md transition-all duration-200">
                    <div className="flex flex-col sm:flex-row gap-5 items-start">
                      <div className="h-12 w-12 shrink-0 rounded-full bg-blue-50 text-primary border border-blue-100/60 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Eye className="h-5 w-5" />
                      </div>
                      <div className="flex-1 w-full">
                        {isEditMode ? (
                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                                Edit Vision Card
                              </span>
                              <button
                                onClick={() =>
                                  updateHomeSectionMut.mutate({
                                    data: {
                                      page: "homepage",
                                      sectionKey: "vision",
                                      title: visionData.title,
                                      content: visionData.content,
                                    },
                                  })
                                }
                                disabled={updateHomeSectionMut.isPending}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-all"
                              >
                                <Save className="h-3.5 w-3.5" /> Save Vision
                              </button>
                            </div>
                            <input
                              type="text"
                              value={visionData.title}
                              onChange={(e) =>
                                setVisionData({ ...visionData, title: e.target.value })
                              }
                              className="w-full bg-slate-50 px-3 py-1.5 rounded-lg border border-border text-sm font-bold text-ink outline-none"
                            />
                            <textarea
                              rows={3}
                              value={visionData.content}
                              onChange={(e) =>
                                setVisionData({ ...visionData, content: e.target.value })
                              }
                              className="w-full bg-slate-50 px-3 py-2 rounded-lg border border-border text-xs text-muted-foreground outline-none"
                            />
                          </div>
                        ) : (
                          <>
                            <h3 className="text-xl font-bold font-display text-ink mb-1.5">
                              {visionData.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {visionData.content}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>

                <RevealOnScroll delay={200}>
                  <div className="group p-6 sm:p-7 rounded-[22px] bg-white border border-[#EAE6DF] shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-primary/20 hover:shadow-md transition-all duration-200">
                    <div className="flex flex-col sm:flex-row gap-5 items-start">
                      <div className="h-12 w-12 shrink-0 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100/60 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Target className="h-5 w-5" />
                      </div>
                      <div className="flex-1 w-full">
                        {isEditMode ? (
                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                                Edit Mission Card
                              </span>
                              <button
                                onClick={() =>
                                  updateHomeSectionMut.mutate({
                                    data: {
                                      page: "homepage",
                                      sectionKey: "mission",
                                      title: missionData.title,
                                      content: missionData.content,
                                    },
                                  })
                                }
                                disabled={updateHomeSectionMut.isPending}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-all"
                              >
                                <Save className="h-3.5 w-3.5" /> Save Mission
                              </button>
                            </div>
                            <input
                              type="text"
                              value={missionData.title}
                              onChange={(e) =>
                                setMissionData({ ...missionData, title: e.target.value })
                              }
                              className="w-full bg-slate-50 px-3 py-1.5 rounded-lg border border-border text-sm font-bold text-ink outline-none"
                            />
                            <textarea
                              rows={3}
                              value={missionData.content}
                              onChange={(e) =>
                                setMissionData({ ...missionData, content: e.target.value })
                              }
                              className="w-full bg-slate-50 px-3 py-2 rounded-lg border border-border text-xs text-muted-foreground outline-none"
                            />
                          </div>
                        ) : (
                          <>
                            <h3 className="text-xl font-bold font-display text-ink mb-1.5">
                              {missionData.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {missionData.content}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>
              </div>

              <RevealOnScroll delay={300}>
                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <Link
                    to="/about/vision-mission"
                    className="story-link inline-flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-widest hover:underline"
                  >
                    View full mandate <ArrowRight className="h-4 w-4" />
                  </Link>
                  <div className="h-px w-12 bg-[#DED9D0] hidden sm:block" />
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground/75 uppercase tracking-widest">
                    <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-muted-foreground/60" />
                    AICTE Approved
                  </div>
                </div>
              </RevealOnScroll>
            </div>

            {/* Right Column: Dual Leadership (Principal & Vice Principal) */}
            <div className="lg:col-span-5 w-full">
              <RevealOnScroll delay={200}>
                <div className="bg-white/60 backdrop-blur-sm rounded-[32px] p-3.5 sm:p-4 border border-[#EAE6DF] shadow-sm space-y-4">
                  {/* Principal Card */}
                  <div className="bg-white rounded-[24px] p-5 sm:p-6 border border-[#EFECE6] shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all duration-200 hover:shadow-md">
                    <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                      <div className="relative w-36 sm:w-40 shrink-0 aspect-[4/5] rounded-[20px] overflow-hidden bg-slate-100 border border-black/5 shadow-inner">
                        {isEditMode ? (
                          <AdminUpload
                            value={principalActive?.image || ""}
                            onChange={(newUrl) =>
                              setPrincipalEdit({ ...principalActive, image: newUrl })
                            }
                            module="administration"
                            category="leadership"
                            className="w-full h-full"
                          />
                        ) : (
                          <img
                            src={principalPhoto}
                            alt={principalActive?.name || "Dr. V. S. Vakula"}
                            width="180"
                            height="225"
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover object-top transition-transform duration-300 hover:scale-105"
                          />
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between self-stretch text-center sm:text-left">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary mb-1">
                            Principal
                          </div>
                          {isEditMode ? (
                            <div className="space-y-2 mt-1">
                              <input
                                type="text"
                                value={principalActive?.name || ""}
                                onChange={(e) =>
                                  setPrincipalEdit({ ...principalActive, name: e.target.value })
                                }
                                placeholder="Principal Name"
                                className="w-full bg-slate-50 px-2.5 py-1 rounded-lg border border-border text-sm font-bold text-ink outline-none"
                              />
                              <input
                                type="text"
                                value={principalActive?.designation || ""}
                                onChange={(e) =>
                                  setPrincipalEdit({
                                    ...principalActive,
                                    designation: e.target.value,
                                  })
                                }
                                placeholder="Designation"
                                className="w-full bg-slate-50 px-2.5 py-1 rounded-lg border border-border text-xs font-semibold text-muted-foreground outline-none"
                              />
                              <textarea
                                rows={3}
                                value={principalActive?.quote || ""}
                                onChange={(e) =>
                                  setPrincipalEdit({ ...principalActive, quote: e.target.value })
                                }
                                placeholder="Principal's Quote / Message"
                                className="w-full bg-slate-50 px-2.5 py-1.5 rounded-lg border border-border text-xs italic text-muted-foreground outline-none"
                              />
                              <button
                                onClick={() => {
                                  if (principalActive?.id) {
                                    updateLeadershipMut.mutate({
                                      data: {
                                        id: principalActive.id,
                                        name: principalActive.name,
                                        designation: principalActive.designation,
                                        quote: principalActive.quote,
                                        image: principalActive.image,
                                      },
                                    });
                                  }
                                }}
                                disabled={updateLeadershipMut.isPending}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold shadow-xs hover:bg-primary/90 transition-all"
                              >
                                <Save className="h-3.5 w-3.5" /> Save Principal Card
                              </button>
                            </div>
                          ) : (
                            <>
                              <h3 className="text-xl sm:text-2xl font-bold font-display text-ink leading-tight">
                                {principalActive?.name || "Dr. V. S. Vakula"}
                              </h3>
                              <p className="text-xs font-semibold text-muted-foreground mt-1">
                                {principalActive?.designation || "JNTU-GV CEV"}
                              </p>
                              <p className="text-[13px] text-muted-foreground italic leading-relaxed mt-3">
                                "{principalActive?.quote ||
                                  "Empowering students through academic excellence, innovative engineering education, and holistic development to meet global challenges."}"
                              </p>
                            </>
                          )}
                        </div>
                        {!isEditMode && (
                          <div className="mt-4 pt-1">
                            <Link
                              to="/administration/principal"
                              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary-dark text-white text-xs font-semibold shadow-sm hover:shadow transition-all duration-150"
                            >
                              Principal's Desk <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Vice Principal Card */}
                  <div className="bg-white rounded-[24px] p-5 sm:p-6 border border-[#EFECE6] shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all duration-200 hover:shadow-md">
                    <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                      <div className="relative w-36 sm:w-40 shrink-0 aspect-[4/5] rounded-[20px] overflow-hidden bg-slate-100 border border-black/5 shadow-inner">
                        {isEditMode ? (
                          <AdminUpload
                            value={vicePrincipalActive?.image || ""}
                            onChange={(newUrl) =>
                              setVicePrincipalEdit({ ...vicePrincipalActive, image: newUrl })
                            }
                            module="administration"
                            category="leadership"
                            className="w-full h-full"
                          />
                        ) : (
                          <img
                            src={vicePrincipalPhoto}
                            alt={vicePrincipalActive?.name || "Prof. G. J. Naga Raju"}
                            width="180"
                            height="225"
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover object-top transition-transform duration-300 hover:scale-105"
                          />
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between self-stretch text-center sm:text-left">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary mb-1">
                            Vice Principal
                          </div>
                          {isEditMode ? (
                            <div className="space-y-2 mt-1">
                              <input
                                type="text"
                                value={vicePrincipalActive?.name || ""}
                                onChange={(e) =>
                                  setVicePrincipalEdit({
                                    ...vicePrincipalActive,
                                    name: e.target.value,
                                  })
                                }
                                placeholder="Vice Principal Name"
                                className="w-full bg-slate-50 px-2.5 py-1 rounded-lg border border-border text-sm font-bold text-ink outline-none"
                              />
                              <input
                                type="text"
                                value={vicePrincipalActive?.designation || ""}
                                onChange={(e) =>
                                  setVicePrincipalEdit({
                                    ...vicePrincipalActive,
                                    designation: e.target.value,
                                  })
                                }
                                placeholder="Designation"
                                className="w-full bg-slate-50 px-2.5 py-1 rounded-lg border border-border text-xs font-semibold text-muted-foreground outline-none"
                              />
                              <textarea
                                rows={3}
                                value={vicePrincipalActive?.quote || ""}
                                onChange={(e) =>
                                  setVicePrincipalEdit({
                                    ...vicePrincipalActive,
                                    quote: e.target.value,
                                  })
                                }
                                placeholder="Vice Principal's Quote / Message"
                                className="w-full bg-slate-50 px-2.5 py-1.5 rounded-lg border border-border text-xs italic text-muted-foreground outline-none"
                              />
                              <button
                                onClick={() => {
                                  if (vicePrincipalActive?.id) {
                                    updateLeadershipMut.mutate({
                                      data: {
                                        id: vicePrincipalActive.id,
                                        name: vicePrincipalActive.name,
                                        designation: vicePrincipalActive.designation,
                                        quote: vicePrincipalActive.quote,
                                        image: vicePrincipalActive.image,
                                      },
                                    });
                                  }
                                }}
                                disabled={updateLeadershipMut.isPending}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold shadow-xs hover:bg-primary/90 transition-all"
                              >
                                <Save className="h-3.5 w-3.5" /> Save Vice Principal Card
                              </button>
                            </div>
                          ) : (
                            <>
                              <h3 className="text-xl sm:text-2xl font-bold font-display text-ink leading-tight">
                                {vicePrincipalActive?.name || "Prof. G. J. Naga Raju"}
                              </h3>
                              <p className="text-xs font-semibold text-muted-foreground mt-1">
                                {vicePrincipalActive?.designation ||
                                  "Professor of Physics & Vice Principal (i/c) · JNTU-GV CEV"}
                              </p>
                              <p className="text-[13px] text-muted-foreground italic leading-relaxed mt-3">
                                "{vicePrincipalActive?.quote ||
                                  "Fostering a supportive academic environment and encouraging innovation for the holistic growth and success of every student."}"
                              </p>
                            </>
                          )}
                        </div>
                        {!isEditMode && (
                          <div className="mt-4 pt-1">
                            <Link
                              to="/administration/vice-principal"
                              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary-dark text-white text-xs font-semibold shadow-sm hover:shadow transition-all duration-150"
                            >
                              Vice Principal's Desk <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>

          {/* Full-width Stats Banner */}
          <RevealOnScroll delay={300} className="mt-14 sm:mt-16 lg:mt-20">
            <div className="bg-white rounded-[24px] sm:rounded-[32px] border border-[#EAE6DF] p-6 sm:p-8 lg:p-10 shadow-sm">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-0 lg:divide-x lg:divide-[#EAE6DF]">
                {STATS.map((s) => (
                  <div key={s.label} className="px-2 sm:px-6 lg:px-8 first:pl-0 last:pr-0">
                    <StatCounter
                      value={s.value}
                      label={s.label}
                      valueClassName="text-display text-3xl sm:text-4xl md:text-5xl font-bold text-primary tabular-nums"
                      labelClassName="mt-2 text-xs sm:text-[13px] font-bold uppercase tracking-[0.16em] text-muted-foreground/90"
                    />
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* LATEST CAMPUS NOTICES & CIRCULARS WITH CATEGORY FILTER TABS */}
      <HomeNotificationsSection />

      {/* DEPARTMENTS — Optimized with lazy loading */}
      <section className="py-24 md:py-32 bg-sand">
        <div className="container-narrow dept-section-wrapper">
          <RevealOnScroll>
            <SectionLabel
              eyebrow="Departments"
              title="Eight departments. One academic culture."
              subtitle="Each department is led by faculty who teach with conviction, mentor with care and research with rigour."
            />
          </RevealOnScroll>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {departmentsList.map((d: any, index: number) => {
              const deptSlug = (d.slug || "").toLowerCase();

              // Define fallback map for department images
              const fallbackMap: Record<string, string> = {
                cse: "https://jntugvcev.edu.in/local-assets/uploads/departments/banners/cse-banner.jpg",
                ece: "https://jntugvcev.edu.in/local-assets/uploads/departments/banners/ece-banner.jpg",
                eee: "https://jntugvcev.edu.in/local-assets/uploads/departments/banners/eee-banner.jpg",
                it: "https://jntugvcev.edu.in/local-assets/uploads/departments/banners/it-banner.jpg",
                mech: "https://jntugvcev.edu.in/local-assets/uploads/departments/banners/mech-banner.jpg",
                met: "https://jntugvcev.edu.in/local-assets/uploads/departments/banners/met-banner.jpg",
                sh: "https://jntugvcev.edu.in/local-assets/uploads/departments/banners/sh-banner.jpg",
                bsh: "https://jntugvcev.edu.in/local-assets/uploads/departments/banners/sh-banner.jpg",
                bshss: "https://jntugvcev.edu.in/local-assets/uploads/departments/banners/sh-banner.jpg",
                mba: "https://jntugvcev.edu.in/local-assets/uploads/departments/banners/mba-banner.jpg",
              };

              // Get the image source
              const imageSrc = d.image
                ? getAssetUrl(d.image)
                : fallbackMap[deptSlug] || `https://jntugvcev.edu.in/local-assets/uploads/departments/banners/${deptSlug}-banner.jpg`;

              const fallback = fallbackMap[deptSlug] || "/assets/lab.webp";

              return (
                <Link
                  key={d.id || d.slug}
                  to="/departments/$id"
                  params={{ id: d.slug }}
                  className="dept-card group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 shadow-lg aspect-[4/3]"
                >
                  {/* Background Image */}
                  <img
                    src={imageSrc}
                    alt={`${d.name} department`}
                    width={600}
                    height={450}
                    loading={index < 4 ? "eager" : "lazy"}
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== fallback && !target.src.endsWith(fallback)) {
                        target.src = fallback;
                      }
                    }}
                  />

                  {/* Dark gradient overlay — opacity-only transition avoids repaint */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 group-hover:opacity-100 opacity-90 transition-opacity duration-300 z-10" />

                  {/* Content */}
                  <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-between text-white z-20">
                    <div className="flex items-center justify-between">
                      {/* Flat badge — no backdrop-blur so no GPU filter layer */}
                      <span className="px-2.5 py-1 text-[9px] font-bold tracking-widest uppercase rounded-full bg-white/20 border border-white/10 text-white/90">
                        {(d.slug || "").toUpperCase()}
                      </span>
                      {/* Flat arrow button — replaces backdrop-blur-md */}
                      <div className="h-8 w-8 rounded-full grid place-items-center bg-white/15 border border-white/10 group-hover:bg-white group-hover:text-slate-900 transition-colors duration-200">
                        <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-lg md:text-xl font-extrabold tracking-tight text-white leading-tight">
                        {d.name}
                      </h3>

                      {d.hod && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded inline-block">
                            HOD: <span className="text-white">{d.hod}</span>
                          </span>
                        </div>
                      )}

                      <p className="text-xs text-white/80 line-clamp-2 font-medium leading-relaxed">
                        {d.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );

            })}
          </div>
        </div>
      </section>

      {/* FACILITIES — interactive showcase */}
      <section className="py-20 md:py-28">
        <div className="container-narrow">
          <RevealOnScroll>
            <div className="flex items-end justify-between flex-wrap gap-6">
              <SectionLabel
                eyebrow="Facilities"
                title="Everything you need, on campus."
                subtitle="Click any tile to explore — hostels, library, sports, healthcare and more."
              />
            </div>
          </RevealOnScroll>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {FACILITIES.map((f, i) => {
              return (
                <RevealOnScroll key={f.title} delay={i * 70} className="h-full">
                  <Link
                    to={f.to}
                    className="group relative flex flex-col rounded-3xl overflow-hidden h-[260px] sm:h-[300px] lg:h-[320px] hover-lift"
                  >
                    <img decoding="async"
                      src={getFacilityImage(f.title, f.img)}
                      alt={f.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] lg:group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/50 to-ink/10" />
                    <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end text-white">
                      <div className="flex items-center gap-2 text-eyebrow !text-white/60 mb-2">
                        <f.icon className="h-3 w-3" /> Facility
                      </div>
                      <h3 className="text-display text-xl md:text-2xl leading-tight">{f.title}</h3>
                      <p className="mt-1.5 text-sm text-white/80 max-w-md overflow-hidden line-clamp-2">
                        {f.desc}
                      </p>
                      <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 group-hover:text-white transition-colors">
                        Explore <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* CAMPUS LIFE — parallax */}
      <ParallaxBg
        src={campusLifeImg}
        alt="Students on campus"
        speed={0.35}
        minHeight="80vh"
        overlay="linear-gradient(135deg, oklch(0.20 0.10 265 / 0.7), oklch(0.18 0.10 285 / 0.55))"
      >
        <div className="h-full min-h-[80vh] flex items-center">
          <div className="container-narrow text-white">
            <RevealOnScroll>
              <div className="max-w-2xl">
                <div className="text-eyebrow !text-white/70">Campus Life</div>
                <h2 className="text-display text-4xl md:text-6xl mt-3">
                  Where studies end and stories begin.
                </h2>
                <p className="mt-6 text-lg text-white/80 leading-relaxed">
                  A residential campus that hums with cultural fests, technical clubs, NSS drives,
                  sports tournaments and quiet conversations under the trees. There is rhythm here —
                  and room for every kind of student.
                </p>
                <Link to="/campus-life" className="btn-ghost mt-8">
                  Step inside <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </ParallaxBg>

      {/* PLACEMENTS */}
      <section className="py-20 md:py-28 bg-sand">
        <div className="container-narrow">
          <RevealOnScroll>
            <SectionLabel
              eyebrow="Placements"
              title="From classroom to career."
              subtitle="Year after year, our students land roles at leading consulting, product and core engineering firms."
            />
          </RevealOnScroll>

          <RevealOnScroll className="mt-10" delay={100}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-3xl overflow-hidden border border-border">
              <div className="bg-card p-6 md:p-8">
                <StatCounter value={420} label="Offers / Year" suffix="+" />
              </div>
              <div className="bg-card p-6 md:p-8">
                <StatCounter value={42} label="LPA Top Package" suffix="L" />
              </div>
              <div className="bg-card p-6 md:p-8">
                <StatCounter value={85} label="Recruiters" suffix="+" />
              </div>
              <div className="bg-card p-6 md:p-8">
                <StatCounter value={92} label="Placement %" suffix="%" />
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll className="mt-10" delay={150}>
            <div className="text-eyebrow text-center mb-4">Trusted by recruiters</div>
            <MarqueeLogos items={RECRUITERS} />
          </RevealOnScroll>

          <div className="mt-8 text-center">
            <Link to="/placements" className="btn-primary">
              View placements report <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* LATEST UPDATES & PRESS NOTES SECTION */}
      <LatestUpdatesSection />

      {/* GALLERY TEASER — live images from JNTU-GV API */}
      <section className="py-20 md:py-28">
        <div className="container-narrow">
          <RevealOnScroll>
            <div className="flex items-end justify-between flex-wrap gap-6">
              <SectionLabel eyebrow="Gallery" title="A campus, in moments." />
              <Link
                to="/gallery"
                className="story-link text-primary font-semibold inline-flex items-center gap-2"
              >
                Open gallery <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </RevealOnScroll>

          <RevealOnScroll className="mt-10" delay={120}>
            {homepageSelectedImages.length > 0 ? (
              <div className="grid grid-cols-12 gap-3 md:gap-4">
                {homepageSelectedImages.map((img, i) => {
                  const colClass =
                    i < 2
                      ? "col-span-12 md:col-span-6 aspect-[16/10]"
                      : "col-span-12 sm:col-span-6 md:col-span-4 aspect-[4/3]";
                  return (
                    <Link
                      key={img.id}
                      to="/gallery"
                      className={`${colClass} w-full rounded-3xl hover-lift overflow-hidden relative group bg-slate-900 shadow-md border border-border/30`}
                    >
                      <ImageWithLoader
                        src={
                          img.imglink?.startsWith("http") || img.imglink?.startsWith("/")
                            ? img.imglink
                            : getAssetUrl(img.imglink)
                        }
                        alt={img.title || "Campus moment"}
                        wrapperClassName="h-full w-full rounded-3xl"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Top Date Badge — solid, no blur (avoids repaint on scroll) */}
                      <div className="absolute top-4 left-4 z-20 pointer-events-none">
                        <span className="px-3 py-1 rounded-full bg-black/75 border border-white/20 text-white/90 font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                          <Calendar className="h-3 w-3 text-amber-400" />
                          {img.date}
                        </span>
                      </div>
                      {/* Bottom Gradient & High-Contrast White Title */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300 pointer-events-none z-10" />
                      <div className="absolute bottom-0 inset-x-0 p-5 md:p-6 text-white z-20 pointer-events-none">
                        <p className="text-sm md:text-base font-extrabold text-white leading-snug line-clamp-2 drop-shadow-md group-hover:text-amber-300 transition-colors">
                          {img.title}
                        </p>
                        {img.description && img.description !== img.title && (
                          <p className="text-xs text-white/70 line-clamp-1 mt-1 font-medium">
                            {img.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}

                {/* 8th Card: Bento Interactive Gallery CTA Card */}
                <Link
                  to="/gallery"
                  className="col-span-12 sm:col-span-6 md:col-span-4 aspect-[4/3] w-full rounded-3xl p-6 md:p-8 bg-gradient-to-br from-primary via-indigo-950 to-slate-950 text-white flex flex-col justify-between hover-lift shadow-xl border border-white/10 group relative overflow-hidden"
                >
                  <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-amber-400/10 blur-2xl group-hover:bg-amber-400/20 transition-colors" />

                  <div className="flex items-center justify-between z-10">
                    <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest text-amber-300">
                      Campus Archive
                    </span>
                    <div className="h-10 w-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="space-y-2 z-10">
                    <div className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                      110+ Campus Moments
                    </div>
                    <p className="text-xs md:text-sm text-white/75 line-clamp-2">
                      Browse convocation ceremonies, sports meets, MoU signings, hackathons and cultural drives.
                    </p>
                  </div>

                  <div className="z-10 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-300 group-hover:text-white transition-colors">
                    Explore full gallery <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </div>
            ) : (
              /* Fallback to static images when API isn't available */
              <div className="grid grid-cols-12 gap-3 md:gap-4">
                <img
                  src={cultureImg}
                  alt="Cultural fest"
                  width="800"
                  height="500"
                  loading="lazy"
                  decoding="async"
                  className="col-span-12 md:col-span-7 aspect-[16/10] w-full object-cover rounded-3xl hover-lift"
                />
                <img
                  src={labImg}
                  alt="Lab"
                  width="600"
                  height="375"
                  loading="lazy"
                  decoding="async"
                  className="col-span-12 md:col-span-5 aspect-[16/10] w-full object-cover rounded-3xl hover-lift"
                />
                <img
                  src={sportsImg}
                  alt="Sports"
                  width="400"
                  height="400"
                  loading="lazy"
                  decoding="async"
                  className="col-span-6 md:col-span-4 aspect-square w-full object-cover rounded-3xl hover-lift"
                />
                <img
                  src={libraryImg}
                  alt="Library"
                  width="400"
                  height="400"
                  loading="lazy"
                  decoding="async"
                  className="col-span-6 md:col-span-4 aspect-square w-full object-cover rounded-3xl hover-lift"
                />
                <img
                  src={hostelImg}
                  alt="Hostel"
                  width="400"
                  height="400"
                  loading="lazy"
                  decoding="async"
                  className="col-span-12 md:col-span-4 aspect-square w-full object-cover rounded-3xl hover-lift"
                />
              </div>
            )}
          </RevealOnScroll>
        </div>
      </section>

      {/* CONTACT STRIP */}
      <section className="py-20">
        <div className="container-narrow">
          <RevealOnScroll>
            <div className="relative overflow-hidden rounded-[40px] bg-[oklch(0.18_0.04_255)] p-8 md:p-14 text-white shadow-[var(--shadow-elegant)] border border-white/5">
              <div
                aria-hidden
                className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
              />
              <div
                aria-hidden
                className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-accent/20 blur-3xl"
              />

              <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                <div className="max-w-xl">
                  <div className="text-eyebrow !text-white/60 flex items-center gap-2">
                    Contact Us
                  </div>
                  <h3 className="text-display text-4xl md:text-5xl mt-4">
                    Have questions? <br />
                    <span className="text-primary-glow">We're here to help.</span>
                  </h3>
                  <p className="mt-6 text-white/50 leading-relaxed max-w-md">
                    Reach out to our administrative office for academic inquiries, examinations, or
                    general information.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full lg:max-w-2xl">
                  <a
                    href="tel:08922277388"
                    className="group flex items-center gap-4 p-5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-primary-glow/40 transition-all duration-300 backdrop-blur-sm min-w-0"
                  >
                    <div className="h-12 w-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary-glow group-hover:scale-105 group-hover:bg-primary group-hover:text-white transition-all duration-300 shrink-0 shadow-inner">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold mb-1">
                        Contact Number
                      </div>
                      <div className="text-base sm:text-lg xl:text-xl font-bold tracking-tight text-white group-hover:text-primary-glow transition-colors whitespace-nowrap">
                        08922 277388
                      </div>
                    </div>
                  </a>

                  <a
                    href="mailto:principal@jntugv.edu.in"
                    className="group flex items-center gap-4 p-5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-primary-glow/40 transition-all duration-300 backdrop-blur-sm"
                  >
                    <div className="h-12 w-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary-glow group-hover:scale-105 group-hover:bg-primary group-hover:text-white transition-all duration-300 shrink-0 shadow-inner">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold mb-1">
                        Email Support
                      </div>
                      <div className="text-sm sm:text-base xl:text-lg font-bold tracking-tight text-white group-hover:text-primary-glow transition-colors whitespace-nowrap">
                        principal@jntugv.edu.in
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
