import { createFileRoute } from "@tanstack/react-router";
import { imageUrl } from "@/lib/assets";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { SITE, STUDENT_SUBNAV } from "@/lib/site";
const campusImg = imageUrl("hero-carousal/hero-campus.jpg");
import { SubNav } from "@/components/SubNav";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — JNTU-GV CEV" },
      {
        name: "description",
        content: "Reach the principal's office, administration and departments at JNTU-GV CEV.",
      },
      { property: "og:title", content: "Contact JNTU-GV CEV" },
      { property: "og:description", content: "Address, phone and email for the college." },
    ],
  }),
  component: ContactPage,
});

const CARDS = [
  { icon: MapPin, title: "Address", value: SITE.contact.address },
  { icon: Phone, title: "Phone", value: SITE.contact.phone },
  { icon: Mail, title: "Email", value: SITE.contact.email },
  { icon: Clock, title: "Office Hours", value: "Mon – Sat · 9:30 AM – 5:00 PM" },
];

function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to us."
        subtitle="For academic queries, campus visits or general information — here is how to reach the office."
        image={campusImg}
      />
      <SubNav items={STUDENT_SUBNAV} />

      <section className="py-20 container-narrow">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CARDS.map((c, i) => (
            <RevealOnScroll key={c.title} delay={i * 80}>
              <div className="p-7 bg-card rounded-2xl border border-border hover-lift h-full">
                <div className="h-12 w-12 rounded-xl bg-[var(--gradient-royal)] text-white grid place-items-center">
                  <c.icon className="h-5 w-5" />
                </div>
                <div className="text-eyebrow mt-5">{c.title}</div>
                <p className="mt-2 text-ink font-medium leading-relaxed">{c.value}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="pb-24 container-narrow">
        <RevealOnScroll>
          <div className="rounded-3xl overflow-hidden border border-border shadow-[var(--shadow-card)] aspect-[16/9] bg-sand">
            <iframe
              title="Campus location map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=83.32%2C18.10%2C83.50%2C18.18&layer=mapnik&marker=18.1418%2C83.4115"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p className="mt-3 text-xs text-muted-foreground text-center">
            JNTU-GV College of Engineering, Dwarapudi, Vizianagaram
          </p>
        </RevealOnScroll>
      </section>
    </>
  );
}
