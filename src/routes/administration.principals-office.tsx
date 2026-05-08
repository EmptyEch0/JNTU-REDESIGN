import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { ADMINISTRATION_SUBNAV } from "@/lib/site";
import { FileText, Calendar, Users, ClipboardCheck, Mail, MapPin } from "lucide-react";
import campusImg from "@/assets/hero-campus.jpg";

export const Route = createFileRoute("/administration/principals-office")({
  head: () => ({
    meta: [
      { title: "Principal's Office — Administration — JNTU-GV CEV" },
      {
        name: "description",
        content: "Administrative support and functions of the Principal's Office at JNTU-GV CEV.",
      },
    ],
  }),
  component: PrincipalsOfficePage,
});

const SERVICES = [
  {
    icon: FileText,
    title: "Certificates & Records",
    desc: "Processing of study certificates, bonafide certificates and student records.",
  },
  {
    icon: Calendar,
    title: "Academic Scheduling",
    desc: "Management of college academic calendar and event coordination.",
  },
  {
    icon: Users,
    title: "Public Relations",
    desc: "Handling external communications and institutional inquiries.",
  },
  {
    icon: ClipboardCheck,
    title: "Compliance",
    desc: "Ensuring regulatory compliance and processing of official documentation.",
  },
];

function PrincipalsOfficePage() {
  return (
    <>
      <PageHero
        eyebrow="Administration"
        title="Principal's Office"
        subtitle="The administrative heart of the institution, providing essential support services."
        image={campusImg}
      />
      <SubNav items={ADMINISTRATION_SUBNAV} />

      {/* Intro */}
      <section className="py-24 md:py-32 container-narrow">
        <div className="max-w-4xl mx-auto text-center">
          <RevealOnScroll>
            <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary grid place-items-center mx-auto mb-6">
              <ClipboardCheck className="h-8 w-8" />
            </div>
            <h2 className="text-display text-4xl text-ink">
              Streamlining administrative workflows
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              The Principal's Office serves as the primary administrative hub of JNTU-GV CEV. It
              facilitates the smooth functioning of the college by coordinating between the academic
              departments, the university, and external agencies. We are committed to providing
              efficient and student-friendly administrative services.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* Key Functions */}
      <section className="py-24 bg-sand">
        <div className="container-narrow">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((s, i) => (
              <RevealOnScroll key={s.title} delay={i * 100}>
                <div className="bg-card rounded-2xl p-8 border border-border hover:border-primary/20 transition-all h-full shadow-sm hover:shadow-elegant">
                  <s.icon className="h-6 w-6 text-primary mb-4" />
                  <h3 className="font-bold text-ink mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Office Details */}
      <section className="py-24 container-narrow">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <RevealOnScroll>
            <div className="bg-ink text-white p-10 md:p-14 rounded-[40px] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32" />
              <h3 className="text-3xl font-bold mb-8">Contact & Location</h3>
              <div className="space-y-6">
                <div className="flex gap-5 items-start">
                  <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-white/50 text-xs uppercase tracking-widest mb-1">
                      Location
                    </div>
                    <div className="text-lg">
                      Ground Floor, Administrative Block, JNTU-GV CEV Campus
                    </div>
                  </div>
                </div>
                <div className="flex gap-5 items-start">
                  <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-white/50 text-xs uppercase tracking-widest mb-1">
                      Email
                    </div>
                    <div className="text-lg">office.principal@jntugv.edu.in</div>
                  </div>
                </div>
                <div className="flex gap-5 items-start">
                  <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-white/50 text-xs uppercase tracking-widest mb-1">
                      Office Hours
                    </div>
                    <div className="text-lg">Monday – Saturday: 10:00 AM to 5:00 PM</div>
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={200}>
            <div className="p-10 space-y-8">
              <h3 className="text-2xl font-bold text-ink">Student Support Services</h3>
              <div className="space-y-4">
                {[
                  "Application for study and conduct certificates.",
                  "Request for official transcripts and documentation.",
                  "Inquiries regarding scholarship processing.",
                  "Guidance on academic regulations and procedures.",
                  "Meeting requests with the Principal / Vice Principal.",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-4 items-center p-4 rounded-2xl bg-zinc-50 border border-zinc-100"
                  >
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
