import { useState, useEffect, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Minimize2,
  Maximize2,
  ExternalLink,
  Calendar,
  Settings2,
  Plus,
  Trash2,
  Upload,
  X,
  Save,
  Image as ImageIcon,
} from "lucide-react";
import { getAssetUrl } from "@/lib/assets";
import { JntugvGalleryItem, updatePageSection } from "@/funcs/site.server";
import { useAdmin } from "@/context/AdminContext";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { preloadImages, preloadImage } from "@/lib/image-cache";

interface HeroGalleryMiniCarouselProps {
  galleryImages?: JntugvGalleryItem[];
  dbGallery?: Array<{ id: number; src: string; caption?: string | null; createdAt?: string }>;
  homeRecords?: any[];
}

export interface SlideItem {
  id: number | string;
  title: string;
  date?: string;
  src: string;
  description?: string;
  isNew?: boolean;
}

const DEFAULT_FEATURED_SLIDES: SlideItem[] = [
  {
    id: "featured-sih-2026",
    title: "JNTU-GV CEV successfully completed SIH internal hackthon 2026",
    date: "Sep 16, 2026",
    src: "uploads/2026/09/SIH2026/Main.JPG",
    description: "JNTU-GV CEV successfully completed SIH internal hackthon 2026 valedictory ceremony.",
    isNew: true,
  },
  {
    id: "featured-engineers-day-developers",
    title: "Developers of JNTUGVCEV website have been felicitated",
    date: "Sep 15, 2026",
    src: "uploads/2026/09/IT GROUP.jpeg",
    description: "Developers of JNTUGVCEV website felicitated during Engineer's Day 2026 celebrations.",
  },

  {
    id: "featured-independence-day",
    title: "80th Independence Day Celebrations at JNTU-GV",
    date: "Aug 15, 2026",
    src: "/images/independence_day.webp",
    description: "Grand celebrations at JNTU-GV campus in presence of Hon'ble Vice-Chancellor & Faculty.",
  },
  {
    id: "featured-admin",
    title: "Campus Administration & Main Building",
    date: "Campus Hub",
    src: "/images/gallery/IMG_6832.webp",
  },
  {
    id: "featured-library",
    title: "Central Knowledge Commons & Library",
    date: "Academic Hub",
    src: "/images/gallery/IMG_6859.webp",
  },
];

export function HeroGalleryMiniCarousel({
  galleryImages = [],
  dbGallery = [],
  homeRecords = [],
}: HeroGalleryMiniCarouselProps) {
  const { isEditMode } = useAdmin();
  const queryClient = useQueryClient();

  const [isMinimized, setIsMinimized] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);

  // Admin Modal State
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [customSlides, setCustomSlides] = useState<SlideItem[] | null>(null);
  const [newSlide, setNewSlide] = useState({
    title: "",
    date: "",
    src: "",
    description: "",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Extract saved custom mini carousel slides from homeRecords
  const savedMiniRec = useMemo(() => {
    return homeRecords.find((r: any) => r.sectionKey === "mini-carousel-slides");
  }, [homeRecords]);

  // Sync customSlides with DB record
  useEffect(() => {
    if (savedMiniRec?.content) {
      try {
        const parsed = JSON.parse(savedMiniRec.content);
        if (Array.isArray(parsed)) {
          setCustomSlides(parsed.slice(0, 6)); // Strict Max 6 FIFO
        }
      } catch {
        // use default
      }
    }
  }, [savedMiniRec]);

  // Build unique slides prioritized:
  // 1. Custom Admin configured slides (if any)
  // 2. Featured Engineer's Day 2026 (Civil Group ONLY)
  // 3. Featured 80th Independence Day (Single instance)
  // 4. Newly uploaded DB gallery photos
  // 5. Unique campus moments & fallback hubs
  // Strictly capped at Max 6 items (FIFO)
  const slides = useMemo(() => {
    if (customSlides && customSlides.length > 0) {
      return customSlides.slice(0, 6);
    }

    const result: SlideItem[] = [];
    const seenSrcs = new Set<string>();
    const seenTopics = new Set<string>();

    const addSlide = (slide: SlideItem, topicKey?: string): boolean => {
      if (result.length >= 6) return false;

      const filename = (slide.src || "").split("/").pop()?.toLowerCase() || "";
      const normalizedSrc = (slide.src || "").toLowerCase().trim();

      if (seenSrcs.has(filename) || seenSrcs.has(normalizedSrc)) {
        return false;
      }

      if (topicKey && seenTopics.has(topicKey)) {
        return false;
      }

      seenSrcs.add(filename);
      seenSrcs.add(normalizedSrc);
      if (topicKey) seenTopics.add(topicKey);

      result.push(slide);
      return true;
    };

    // 1. Featured SIH 2026 Hackathon Valedictory
    addSlide(
      {
        id: "featured-sih-2026",
        title: "JNTU-GV CEV successfully completed SIH internal hackthon 2026",
        date: "Sep 16, 2026",
        src: "uploads/2026/09/SIH2026/Main.JPG",
        description: "JNTU-GV CEV successfully completed SIH internal hackthon 2026 valedictory ceremony.",
        isNew: true,
      },
      "sih-2026"
    );

    // 2. Featured Engineer's Day 2026 - Developers of JNTUGVCEV website felicitated
    addSlide(
      {
        id: "featured-engineers-day-developers",
        title: "Developers of JNTUGVCEV website have been felicitated",
        date: "Sep 15, 2026",
        src: "uploads/2026/09/IT GROUP.jpeg",
        description: "Developers of JNTUGVCEV website felicitated during Engineer's Day 2026 celebrations.",
      },
      "engineers-day"
    );



    // 4. Featured Independence Day celebration (GUARANTEED SINGLE INSTANCE)
    addSlide(
      {
        id: "featured-independence-day",
        title: "80th Independence Day Celebrations at JNTU-GV",
        date: "Aug 15, 2026",
        src: "/images/independence_day.webp",
        description: "Grand celebrations at JNTU-GV campus in presence of Hon'ble Vice-Chancellor & Faculty.",
      },
      "independence-day"
    );

    // 3. Newly uploaded images from database gallery (excluding duplicates)
    for (const dbItem of dbGallery) {
      if (!dbItem.src) continue;
      const cleanSrc = dbItem.src.toLowerCase();
      const cleanTitle = (dbItem.caption || "Campus Moment").trim().toLowerCase();

      // Skip Independence Day, Engineer's Day, and extra SIH photos (SIH Main.JPG already added as slide 1)
      if (
        cleanSrc.includes("independence") ||
        cleanTitle.includes("independence") ||
        cleanSrc.includes("it group") ||
        cleanSrc.includes("main.jpeg") ||
        cleanSrc.includes("civil group") ||
        cleanTitle.includes("engineer") ||
        cleanSrc.includes("sih") ||
        cleanTitle.includes("sih") ||
        cleanTitle.includes("hackthon") ||
        cleanTitle.includes("hackathon") ||
        cleanSrc.includes("valedictory") ||
        cleanSrc.includes("p1170")
      ) {
        continue;
      }

      addSlide(
        {
          id: `db-${dbItem.id}`,
          title: dbItem.caption?.trim() || "Campus Moment",
          date: "Recently Added",
          src: dbItem.src,
          isNew: true,
        },
        cleanTitle
      );
      if (result.length >= 6) break;
    }

    // 4. Latest external API gallery photos
    const sortedGallery = [...galleryImages].sort((a, b) => {
      const timeA = new Date(a.date || 0).getTime();
      const timeB = new Date(b.date || 0).getTime();
      return timeB - timeA;
    });

    for (const img of sortedGallery) {
      const rawTitle = (img.title || "").trim();
      const cleanTitle = rawTitle.toLowerCase();
      const rawSrc = (img.imglink || img.file_path || "").toLowerCase();

      if (
        img.id === 166 ||
        cleanTitle.includes("independence") ||
        rawSrc.includes("independence") ||
        cleanTitle.includes("it group") ||
        cleanTitle.includes("main.jpeg") ||
        cleanTitle.includes("civil group") ||
        cleanTitle.includes("engineer") ||
        cleanTitle.includes("sih") ||
        cleanTitle.includes("hackthon") ||
        cleanTitle.includes("hackathon") ||
        rawSrc.includes("it group") ||
        rawSrc.includes("main.jpeg") ||
        rawSrc.includes("civil group") ||
        rawSrc.includes("sih") ||
        rawSrc.includes("valedictory") ||
        rawSrc.includes("p1170")
      ) {
        continue;
      }

      if (img.imglink || img.file_path) {
        addSlide(
          {
            id: img.id,
            title: rawTitle || "Campus Highlights",
            date: img.date
              ? new Date(img.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Campus Moment",
            src: img.imglink || img.file_path,
            description: img.description,
          },
          cleanTitle
        );
      }

      if (result.length >= 6) break;
    }

    // 5. Fallback distinct campus hubs if needed
    const fallbackList = [
      {
        id: "featured-admin",
        title: "Campus Administration & Main Building",
        date: "Campus Hub",
        src: "/images/gallery/IMG_6832.webp",
      },
      {
        id: "featured-library",
        title: "Central Knowledge Commons & Library",
        date: "Academic Hub",
        src: "/images/gallery/IMG_6859.webp",
      },
      {
        id: "featured-sports",
        title: "Annual Sports Meet & Athletics",
        date: "Sports Arena",
        src: "/images/gallery/IMG_6872.webp",
      },
      {
        id: "featured-fest",
        title: "Cultural Fest & Student Celebrations",
        date: "Campus Culture",
        src: "/images/gallery/IMG_6840.webp",
      },
    ];

    for (const fb of fallbackList) {
      if (result.length >= 6) break;
      addSlide(fb, fb.title.toLowerCase());
    }

    return result.slice(0, 6);
  }, [customSlides, galleryImages, dbGallery]);

  // High-performance image pre-caching: pre-loads all images in memory & Cache API
  useEffect(() => {
    const urls = slides.map((s) => getAssetUrl(s.src)).filter(Boolean);
    preloadImages(urls);
  }, [slides]);

  // Auto-rotate every 3.2s
  useEffect(() => {
    if (isMinimized || isPaused || showAdminModal || slides.length <= 1) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3200);

    return () => clearInterval(timer);
  }, [isMinimized, isPaused, showAdminModal, slides.length, currentIndex]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Admin Slide Actions
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("module", "carousel");
    formData.append("category", "highlights");

    const tId = toast.loading(`Uploading slide image ${file.name}...`);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (json.success) {
        const assetPath = json.path;
        setNewSlide((prev) => ({ ...prev, src: assetPath }));
        preloadImage(getAssetUrl(assetPath));
        toast.success("Image uploaded and cached!", { id: tId });
      } else {
        toast.error(json.error || "Upload failed", { id: tId });
      }
    } catch {
      toast.error("Failed to upload image file", { id: tId });
    } finally {
      setUploading(false);
    }
  };

  const handleAddSlide = () => {
    if (!newSlide.title.trim() || !newSlide.src.trim()) {
      toast.error("Please provide both a Title and Image for the slide.");
      return;
    }

    const item: SlideItem = {
      id: `custom-${Date.now()}`,
      title: newSlide.title.trim(),
      date: newSlide.date.trim() || "Campus Highlight",
      src: newSlide.src.trim(),
      description: newSlide.description.trim(),
      isNew: true,
    };

    preloadImage(getAssetUrl(item.src));

    // Prepend new slide (FIFO: newest on top, max 6 kept)
    const updated = [item, ...(customSlides || slides)].slice(0, 6);
    setCustomSlides(updated);
    setNewSlide({ title: "", date: "", src: "", description: "" });
    toast.success("Slide added to queue! (Max 6 slides retained)");
  };

  const handleDeleteSlide = (id: number | string) => {
    const currentList = customSlides || slides;
    const updated = currentList.filter((s) => s.id !== id);
    setCustomSlides(updated);
    toast.info("Slide removed from carousel");
  };

  const handleSaveCarousel = async () => {
    setSaving(true);
    const tId = toast.loading("Saving mini carousel configuration...");
    try {
      const payload = (customSlides || slides).slice(0, 6);
      await updatePageSection({
        data: {
          page: "homepage",
          sectionKey: "mini-carousel-slides",
          title: "Mini Carousel Highlights",
          content: JSON.stringify(payload),
        },
      });
      await queryClient.invalidateQueries({ queryKey: ["site-content", "homepage"] });
      toast.success("Mini carousel updated successfully!", { id: tId });
      setShowAdminModal(false);
    } catch {
      toast.error("Failed to save mini carousel configuration", { id: tId });
    } finally {
      setSaving(false);
    }
  };

  const currentSlide = slides[currentIndex] || slides[0] || DEFAULT_FEATURED_SLIDES[0];

  const slideVariants: import("framer-motion").Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
      },
    }),
  };

  return (
    <div className="w-full flex justify-end select-none">
      <AnimatePresence mode="wait">
        {isMinimized ? (
          /* Minimized Capsule Button aligned to the Right */
          <motion.div
            key="minimized-capsule"
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-end w-full"
          >
            <button
              onClick={() => setIsMinimized(false)}
              className="group flex items-center gap-2 px-4.5 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-2xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all cursor-pointer hover:scale-105 active:scale-95 hover:border-white/60"
              title="Expand Campus Highlights"
              aria-label="Expand Campus Highlights"
            >
              <Sparkles className="h-4 w-4 text-cyan-200 group-hover:rotate-12 transition-transform" />
              <span className="text-xs sm:text-sm font-bold tracking-wide text-white drop-shadow-xs whitespace-nowrap">
                Campus Highlights
              </span>
              <Maximize2 className="h-3.5 w-3.5 text-white/80 group-hover:text-white transition-colors ml-0.5" />
            </button>
          </motion.div>
        ) : (
          /* Expanded Full Glassmorphic Carousel */
          <motion.div
            key="expanded-carousel"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="w-full max-w-[480px] sm:max-w-[520px] lg:max-w-[540px] xl:max-w-[580px] 2xl:max-w-[660px] 3xl:max-w-[720px] rounded-3xl overflow-hidden bg-white/20 backdrop-blur-2xl border border-white/35 shadow-[0_20px_60px_rgba(0,0,0,0.35)] text-white group relative"
          >
            {/* Top Light Glassmorphic Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white/25 backdrop-blur-md border-b border-white/25">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/35 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-2xs">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-200" />
                  Campus Highlights
                </span>
                <span className="text-[10px] font-bold text-white/70 bg-black/20 px-2 py-0.5 rounded-full">
                  {currentIndex + 1} / {slides.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Admin CMS Edit Button */}
                {isEditMode && (
                  <button
                    onClick={() => {
                      setCustomSlides(slides);
                      setShowAdminModal(true);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                    title="Edit Mini Carousel (Max 6 slides)"
                  >
                    <Settings2 className="h-3.5 w-3.5" />
                    <span>Edit (Max 6)</span>
                  </button>
                )}

                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/25 transition-all cursor-pointer border border-white/20 hover:border-white/40"
                  title="Minimize carousel"
                  aria-label="Minimize carousel"
                >
                  <Minimize2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Carousel Slide Stage */}
            <div
              className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900/40"
              title={currentSlide.title}
            >
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentSlide.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 w-full h-full"
                >
                  <img
                    src={getAssetUrl(currentSlide.src)}
                    alt={currentSlide.title}
                    title={currentSlide.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                    decoding="async"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.src.includes("hero-campus.webp")) {
                        target.src = "/images/hero-carousal/hero-campus.webp";
                      }
                    }}
                  />
                  {/* Frosted vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows on Hover */}
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/25 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-white/40 z-20 shadow-md"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/25 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-white/40 z-20 shadow-md"
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              {/* Bottom Details Overlay on Image */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 z-10 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-1.5">
                  {currentSlide.date && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-white/25 border border-white/40 px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-2xs">
                      <Calendar className="h-3 w-3 text-cyan-200" />
                      {currentSlide.date}
                    </span>
                  )}
                  {currentSlide.isNew && (
                    <span className="text-[11px] font-extrabold text-emerald-200 bg-emerald-500/30 border border-emerald-300/40 px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-2xs">
                      New
                    </span>
                  )}
                  {currentIndex === 0 && !currentSlide.isNew && (
                    <span className="text-[11px] font-extrabold text-amber-200 bg-amber-500/30 border border-amber-300/40 px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-2xs">
                      Featured
                    </span>
                  )}
                </div>

                <h4 className="text-sm sm:text-base font-bold text-white leading-snug line-clamp-2 drop-shadow-md">
                  {currentSlide.title}
                </h4>
              </div>
            </div>

            {/* Bottom Footer Bar with Dots and Gallery Link */}
            <div className="px-4 py-3 bg-white/20 backdrop-blur-md flex items-center justify-between gap-3 border-t border-white/25">
              {/* Animated Dots Indicator */}
              <div className="flex items-center gap-1.5">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setDirection(idx > currentIndex ? 1 : -1);
                      setCurrentIndex(idx);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentIndex
                        ? "w-6 bg-white shadow-sm"
                        : "w-2 bg-white/40 hover:bg-white/70"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* View Full Gallery Link */}
              <Link
                to="/gallery"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-cyan-200 bg-white/15 hover:bg-white/25 border border-white/30 px-3 py-1.5 rounded-xl transition-all shadow-2xs"
              >
                <span>View Gallery</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ADMIN EDIT MODAL FOR MINI CAROUSEL */}
      <AnimatePresence>
        {showAdminModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-gradient-to-r from-amber-500/10 to-transparent">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    Edit Mini Carousel Highlights
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Max 6 active slides. If you add more than 6, the oldest slides are automatically removed (FIFO).
                  </p>
                </div>
                <button
                  onClick={() => setShowAdminModal(false)}
                  className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-zinc-800 dark:text-zinc-200">
                {/* Add New Slide Card */}
                <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 space-y-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <Plus className="h-4 w-4" /> Add New Highlight Slide
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300 block mb-1">
                        Slide Title *
                      </label>
                      <input
                        type="text"
                        value={newSlide.title}
                        onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
                        placeholder="e.g. Annual Tech Symposium 2026"
                        className="w-full bg-white dark:bg-zinc-900 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300 block mb-1">
                        Display Date / Tag
                      </label>
                      <input
                        type="text"
                        value={newSlide.date}
                        onChange={(e) => setNewSlide({ ...newSlide, date: e.target.value })}
                        placeholder="e.g. Sep 16, 2026"
                        className="w-full bg-white dark:bg-zinc-900 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300 block mb-1">
                        Image (Upload File or Enter URL) *
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={newSlide.src}
                          onChange={(e) => setNewSlide({ ...newSlide, src: e.target.value })}
                          placeholder="Paste image path / URL..."
                          className="flex-1 bg-white dark:bg-zinc-900 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <label className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs cursor-pointer shadow-sm">
                          <Upload className="h-4 w-4" />
                          <span>{uploading ? "Uploading..." : "Upload Photo"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            disabled={uploading}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleAddSlide}
                      className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-zinc-700 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="h-4 w-4" /> Add Slide to Queue
                    </button>
                  </div>
                </div>

                {/* Current Active Slides List (Max 6) */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Active Carousel Queue ({slides.length} / 6 Max)
                    </h4>
                    <span className="text-[11px] text-amber-600 font-medium">
                      Oldest auto-evicted when exceeding 6
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {slides.map((s, idx) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-xs gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-600 dark:text-zinc-300">
                            {idx + 1}
                          </span>
                          <img
                            src={getAssetUrl(s.src)}
                            alt={s.title}
                            className="w-12 h-10 rounded-lg object-cover bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/images/hero-carousal/hero-campus.webp";
                            }}
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                              {s.title}
                            </p>
                            <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                              {s.date || "Highlight"} {idx === 0 && "• (First Slide)"}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteSlide(s.id)}
                          className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                          title="Delete slide"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                <button
                  onClick={() => setShowAdminModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCarousel}
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? "Saving Changes..." : "Save Carousel (Live)"}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
