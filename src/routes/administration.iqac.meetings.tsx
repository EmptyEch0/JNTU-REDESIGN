import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { IQAC_SUBNAV } from "@/lib/site";
import campusImg from "@/assets/hero-campus.jpg";
import { useQuery } from "@tanstack/react-query";
import { getIqacEvents, getIqacOutcomes } from "@/funcs/leadership";
import { Calendar, CheckCircle2, Presentation, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/administration/iqac/meetings")({
  head: () => ({
    meta: [
      { title: "IQAC Meetings & Events — Administration — JNTU-GV CEV" },
      {
        name: "description",
        content:
          "Outcomes, workshops, and faculty development programs organized by IQAC at JNTU-GV CEV.",
      },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const { data: outcomes, isLoading: isOutcomesLoading } = useQuery({
    queryKey: ["iqac", "outcomes"],
    queryFn: () => getIqacOutcomes(),
  });

  const { data: events, isLoading: isEventsLoading } = useQuery({
    queryKey: ["iqac", "events"],
    queryFn: () => getIqacEvents(),
  });

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-6xl mx-auto space-y-32">
        {/* Outcomes Section */}
        <RevealOnScroll>
          <div className="grid lg:grid-cols-[1fr_450px] gap-16 items-start">
            <div>
              <div className="flex items-center gap-4 mb-10">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 grid place-items-center text-primary shadow-sm border border-primary/20">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-ink">Outcomes of IQAC</h3>
                  <p className="text-muted-foreground mt-1 text-base">
                    Measurable impacts on institutional quality and performance.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-x-12 gap-y-6">
                {isOutcomesLoading ? (
                  <div className="col-span-2 py-10 text-center text-muted-foreground animate-pulse">
                    Loading outcomes...
                  </div>
                ) : (
                  outcomes?.map((outcome: any, idx: number) => (
                    <div key={outcome.id} className="flex gap-4 group">
                      <div className="mt-1 h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 transition-colors group-hover:bg-primary group-hover:text-white">
                        <ArrowRight className="h-3 w-3" />
                      </div>
                      <p className="text-muted-foreground leading-snug">{outcome.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-sand rounded-[40px] p-10 border border-border relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 transition-transform group-hover:scale-110 duration-300">
                <CheckCircle2 className="h-48 w-48 text-primary" />
              </div>
              <div className="relative z-10 space-y-6">
                <h4 className="text-2xl font-bold text-ink">Institutional Impact</h4>
                <p className="text-muted-foreground leading-relaxed italic">
                  "The IQAC serves as a catalyst for excellence, ensuring that our academic and
                  administrative processes are continuously evolving to meet global standards."
                </p>
                <div className="pt-6 border-t border-border/50">
                  <div className="text-sm font-bold text-primary uppercase tracking-widest">
                    Quality Assurance
                  </div>
                  <div className="text-ink font-medium mt-1">
                    JNTU-GV College of Engineering Vizianagaram
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Events/Workshops Section */}
        <RevealOnScroll delay={100}>
          <div>
            <div className="flex items-center gap-4 mb-10">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 grid place-items-center text-primary shadow-sm border border-primary/20">
                <Presentation className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-ink">Workshops & FDPs</h3>
                <p className="text-muted-foreground mt-1 text-base">
                  Empowering faculty and staff through continuous learning initiatives.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-[32px] border border-border bg-card/50 backdrop-blur-sm shadow-elegant">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      S.No
                    </th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Name of the Workshop/FDP
                    </th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isEventsLoading ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-8 py-16 text-center text-muted-foreground animate-pulse"
                      >
                        Loading events...
                      </td>
                    </tr>
                  ) : (
                    events?.map((event: any, idx: number) => (
                      <tr
                        key={event.id}
                        className="group hover:bg-primary/[0.02] transition-colors"
                      >
                        <td className="px-8 py-6 text-sm font-medium text-muted-foreground">
                          {idx + 1}
                        </td>
                        <td className="px-8 py-6 text-base font-bold text-ink group-hover:text-primary transition-colors leading-relaxed">
                          {event.title}
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-bold border border-primary/10">
                            <Calendar className="h-3.5 w-3.5" />
                            {event.date}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
