import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { MapPin, Phone, Mail } from "lucide-react";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — JNTU-GV CEV" },
      { name: "description", content: "Reach the principal's office, admissions and departments at JNTU-GV CEV." },
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
];

function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Talk to us." subtitle="For admissions queries, campus visits or general information — here is how to reach the office." />

      <section className="py-20 container-narrow">
        <div className="grid md:grid-cols-3 gap-5">
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
    </>
  );
}
