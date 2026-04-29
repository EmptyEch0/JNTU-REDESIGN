import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import campusImg from "@/assets/hero-campus.jpg";
import campusLifeImg from "@/assets/campus-life.jpg";
import labImg from "@/assets/lab.jpg";
import hostelImg from "@/assets/hostel.jpg";
import sportsImg from "@/assets/sports.jpg";
import libraryImg from "@/assets/library-interior.jpg";
import cultureImg from "@/assets/culture.jpg";
import placementsImg from "@/assets/placements-bg.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — JNTU-GV CEV" },
      { name: "description", content: "Moments from across the JNTU-GV Vizianagaram campus." },
      { property: "og:title", content: "Gallery — JNTU-GV CEV" },
      { property: "og:description", content: "Pictures from campus, classrooms, labs, sports and culture." },
      { property: "og:image", content: campusImg },
    ],
  }),
  component: GalleryPage,
});

const IMAGES = [
  { src: campusImg, alt: "Campus aerial" },
  { src: cultureImg, alt: "Cultural fest" },
  { src: labImg, alt: "Engineering lab" },
  { src: libraryImg, alt: "Library reading hall" },
  { src: campusLifeImg, alt: "Students on campus" },
  { src: sportsImg, alt: "Sports ground" },
  { src: hostelImg, alt: "Hostel building" },
  { src: placementsImg, alt: "Placements event" },
];

function GalleryPage() {
  return (
    <>
      <PageHero eyebrow="Gallery" title="A campus, in moments." subtitle="A growing visual record of the rhythms, faces and seasons of life at JNTU-GV CEV." />
      <section className="py-20 container-narrow">
        <RevealOnScroll>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
            {IMAGES.map((img, i) => (
              <div key={i} className="break-inside-avoid mb-5 overflow-hidden rounded-2xl hover-lift">
                <img src={img.src} alt={img.alt} loading="lazy" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </section>
    </>
  );
}
