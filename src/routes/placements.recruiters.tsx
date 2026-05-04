import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { LogoCarousel } from "@/components/LogoCarousel";
import { SectionLabel } from "@/components/SectionLabel";
import { PLACEMENTS_SUBNAV, RECRUITER_LOGOS } from "@/lib/site";
import placementsImg from "@/assets/placements-bg.jpg";

export const Route = createFileRoute("/placements/recruiters")({
  head: () => ({
    meta: [
      { title: "Our Recruiters — Placements — JNTU-GV CEV" },
      { name: "description", content: "Companies that recruit from JNTU-GV CEV." },
    ],
  }),
  component: RecruitersPage,
});

function RecruitersPage() {
  const half = Math.ceil(RECRUITER_LOGOS.length / 2);
  const row1 = RECRUITER_LOGOS.slice(0, half);
  const row2 = RECRUITER_LOGOS.slice(half);

  return (
    <>
      <PageHero
        eyebrow="Placements"
        title="Our Recruiters"
        subtitle="A growing network of product, services, core engineering and consulting employers."
        image={placementsImg}
      />
      <SubNav items={PLACEMENTS_SUBNAV} />

      <section className="py-16 container-narrow">
        <RevealOnScroll>
          <SectionLabel
            eyebrow="On campus"
            title="Recruiters that hire from us"
            align="center"
          />
        </RevealOnScroll>
        <div className="mt-10 space-y-2">
          <LogoCarousel logos={row1} speed={70} />
          <LogoCarousel logos={row2} speed={80} reverse />
        </div>
      </section>

      <section className="py-16 bg-sand">
        <div className="container-narrow">
          <RevealOnScroll>
            <SectionLabel eyebrow="Directory" title={`All ${RECRUITER_LOGOS.length} recruiters`} />
          </RevealOnScroll>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {RECRUITER_LOGOS.map((logo, i) => (
              <RevealOnScroll key={logo.name} delay={(i % 12) * 30}>
                <div
                  title={logo.name}
                  className="aspect-[4/3] rounded-xl bg-card border border-border flex items-center justify-center p-3 hover:border-primary/40 hover:shadow-[var(--shadow-card-hover)] hover-lift"
                >
                  <img
                    src={logo.url}
                    alt={logo.name}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain grayscale hover:grayscale-0 transition-all duration-500"
                    onError={(e) => {
                      const t = e.currentTarget;
                      t.style.display = "none";
                      const fb = document.createElement("span");
                      fb.textContent = logo.name;
                      fb.className = "text-ink text-xs font-medium text-center px-1";
                      t.parentElement?.appendChild(fb);
                    }}
                  />
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
