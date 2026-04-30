import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { Bell, ArrowRight } from "lucide-react";
import libraryImg from "@/assets/library-interior.jpg";

export const Route = createFileRoute("/notices")({
  head: () => ({
    meta: [
      { title: "Notices — JNTU-GV CEV" },
      { name: "description", content: "Latest announcements, circulars and notices from JNTU-GV CEV." },
      { property: "og:title", content: "Notices — JNTU-GV CEV" },
      { property: "og:description", content: "Stay updated with academic, hostel and event notices." },
    ],
  }),
  component: NoticesPage,
});

const NOTICES = [
  { date: "29 Apr 2026", tag: "Academic", title: "End-semester examinations schedule released for B.Tech IV-II." },
  { date: "24 Apr 2026", tag: "Placements", title: "Pre-placement talks for Capgemini and Hexaware on 02 May." },
  { date: "18 Apr 2026", tag: "Hostel", title: "Vacation guidelines for residents staying through summer." },
  { date: "12 Apr 2026", tag: "R&D", title: "Call for proposals — UGC minor research grants 2026." },
  { date: "05 Apr 2026", tag: "Event", title: "Annual cultural fest 'Spandana 2026' opens for registrations." },
  { date: "28 Mar 2026", tag: "General", title: "Library timings extended during examination weeks." },
];

function NoticesPage() {
  return (
    <>
      <PageHero eyebrow="Announcements" title="Notices, circulars & updates." subtitle="The latest from the office of the Principal, departments and student cells." image={libraryImg} />

      <section className="py-20 container-narrow">
        <div className="space-y-3">
          {NOTICES.map((n, i) => (
            <RevealOnScroll key={i} delay={i * 50}>
              <article className="group flex items-start sm:items-center gap-5 p-5 sm:p-6 bg-card border border-border rounded-2xl hover-lift">
                <div className="h-12 w-12 rounded-xl bg-sand text-primary grid place-items-center shrink-0">
                  <Bell className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-eyebrow">{n.tag}</span>
                    <span className="text-muted-foreground">{n.date}</span>
                  </div>
                  <p className="mt-2 text-ink font-medium">{n.title}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </section>
    </>
  );
}
