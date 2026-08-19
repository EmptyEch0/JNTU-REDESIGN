import { createFileRoute } from "@tanstack/react-router";
import { imageUrl, getAssetUrl } from "@/lib/assets";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SubNav } from "@/components/SubNav";
import { STUDENT_SUBNAV } from "@/lib/site";
import { getCampusGallery, getJntugvGalleryImages } from "@/funcs/site.server";
import { useQuery } from "@tanstack/react-query";
import { ImageWithLoader } from "@/components/ImageWithLoader";

const campusImg = imageUrl("hero-carousal/hero-campus.jpg");
import cultureImg from "@/assets/culture.jpeg";

export const Route = createFileRoute("/gallery")({
  loader: async () => await getCampusGallery(),
  head: () => ({
    meta: [
      { title: "Gallery — JNTU-GV CEV" },
      { name: "description", content: "Moments from across the JNTU-GV Vizianagaram campus." },
      { property: "og:title", content: "Gallery — JNTU-GV CEV" },
      {
        property: "og:description",
        content: "Pictures from campus, classrooms, labs, sports and culture.",
      },
      { property: "og:image", content: campusImg },
    ],
  }),
  component: GalleryPage,
});

const DEFAULT_IMAGES = [
  {
    id: -1,
    src: "uploads/photo-gallery/independence_day.jpeg",
    caption: "80th Independence Day Celebrations on Campus in Presence of Hon'ble Vice-Chancellor",
  },
  { id: -2, src: "uploads/photo-gallery/IMG_6832.JPG", caption: "Campus Administration & Main Building" },
  { id: -3, src: "uploads/photo-gallery/IMG_6840.JPG", caption: "Cultural Fest & Student Celebrations" },
  { id: -4, src: "uploads/photo-gallery/IMG_6844.JPG", caption: "Advanced Engineering Laboratories" },
  { id: -5, src: "uploads/photo-gallery/IMG_6859.JPG", caption: "Central Knowledge Commons & Library" },
  { id: -6, src: "uploads/photo-gallery/IMG_6868.JPG", caption: "Campus Life & Student Interactions" },
  { id: -7, src: "uploads/photo-gallery/IMG_6872.JPG", caption: "Sports Meet & Athletic Complex" },
  { id: -8, src: "uploads/photo-gallery/IMG_6875.JPG", caption: "Hostel & Residential Blocks" },
  { id: -9, src: "uploads/photo-gallery/IMG_6920.JPG", caption: "Placements Drive & Auditorium Session" },
];

function GalleryPage() {
  const records = Route.useLoaderData() as any[];

  // Fetch live images from the JNTU-GV external API with memory caching
  const { data: apiImages = [] } = useQuery({
    queryKey: ["jntugv-gallery"],
    queryFn: () => getJntugvGalleryImages(),
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  // Convert API images to the same shape as local records
  const apiGalleryItems = apiImages.map((img) => ({
    id: -(img.id + 1000), // negative IDs to avoid collision
    src: img.imglink,
    caption: img.title || img.description,
    isExternal: true,
  }));

  const localImages = records.length > 0 ? records : [];
  const images = [...apiGalleryItems, ...localImages, ...(apiGalleryItems.length === 0 && localImages.length === 0 ? DEFAULT_IMAGES : [])];

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="A campus, in moments."
        subtitle="A growing visual record of the rhythms, faces and seasons of life at JNTU-GV CEV."
        image={cultureImg}
      />
      <SubNav items={STUDENT_SUBNAV} />

      <section className="py-20 container-narrow">
        <RevealOnScroll>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
            {images.map((img, i) => {
              return (
                <div
                  key={img.id || i}
                  className="break-inside-avoid mb-5 overflow-hidden rounded-2xl hover-lift relative group transition-all duration-300"
                >
                  <ImageWithLoader
                    src={img.src.startsWith("http") ? img.src : getAssetUrl(img.src)}
                    alt={img.caption || "Campus Moment"}
                    smartFit={true}
                    wrapperClassName="w-full min-h-[220px] max-h-[480px] rounded-2xl border border-border/40 shadow-sm"
                  />

                  {img.caption && (
                    <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                      <p className="text-xs font-semibold tracking-wide uppercase text-primary-glow">Moment</p>
                      <p className="text-sm font-medium mt-1">{img.caption}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </RevealOnScroll>
      </section>
    </>
  );
}
