import { createFileRoute } from "@tanstack/react-router";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { useQuery } from "@tanstack/react-query";
import { getIqacMous } from "@/funcs/leadership";
import { Handshake, ArrowUpRight, Building2, MapPin } from "lucide-react";
import { getAssetUrl } from "@/lib/assets";

export const Route = createFileRoute("/administration/iqac/mous")({
  head: () => ({
    meta: [
      { title: "IQAC MOUs — Administration — JNTU-GV CEV" },
      {
        name: "description",
        content: "Institutional collaborations and strategic partnerships at JNTU-GV CEV.",
      },
    ],
  }),
  component: MousPage,
});

function MousPage() {
  const { data: mous, isLoading } = useQuery({
    queryKey: ["iqac", "mous"],
    queryFn: () => getIqacMous(),
  });

  return (
    <section className="py-12 md:py-20">
      <RevealOnScroll>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 grid place-items-center text-primary shadow-sm border border-primary/20">
              <Handshake className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-ink tracking-tight">Collaborations & MOUs</h3>
              <p className="text-muted-foreground mt-1 text-base">
                Strategic partnerships driving innovation and student placement.
              </p>
            </div>
          </div>

          <div className="space-y-16">
            {isLoading ? (
              <div className="py-20 text-center text-muted-foreground animate-pulse">
                Loading partnerships...
              </div>
            ) : (
              mous?.map((mou: any) => (
                <div
                  key={mou.id}
                  className="group bg-card rounded-[48px] border border-border overflow-hidden shadow-elegant hover:shadow-2xl transition-all duration-700"
                >
                  {/* Landscape Image Header */}
                  <div className="relative aspect-[16/7] md:aspect-[21/9] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent z-10" />
                    <img
                      src={getAssetUrl(mou.image)}
                      alt={mou.title}
                      className="h-full w-full object-cover grayscale group-hover:grayscale-0 scale-105 group-hover:scale-100 transition-all duration-1000"
                    />
                    <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-20">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary text-white text-[10px] font-bold mb-4 uppercase tracking-[0.2em] shadow-lg">
                        Active Collaboration
                      </div>
                      <h4 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                        {mou.title}
                      </h4>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-8 md:p-16">
                    <div className="grid lg:grid-cols-[1fr_300px] gap-16 items-start">
                      <div className="space-y-8">
                        <div className="prose prose-lg text-muted-foreground max-w-none">
                          {mou.description.split("\n\n").map((para: string, i: number) => (
                            <p key={i} className="leading-relaxed text-lg">
                              {para}
                            </p>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-8">
                        <div className="p-8 rounded-[32px] bg-muted/30 border border-border/50 space-y-6">
                          <div className="flex items-center gap-3 text-ink font-bold">
                            <Building2 className="h-5 w-5 text-primary" />
                            Partnership Details
                          </div>
                          <div className="space-y-4">
                            <div className="flex gap-3">
                              <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                              <span className="text-sm text-muted-foreground font-medium">
                                Blockchain Center of Excellence (BCoE)
                              </span>
                            </div>
                            <div className="flex gap-3">
                              <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                              <span className="text-sm text-muted-foreground font-medium">
                                Industry-Academia Skill Development
                              </span>
                            </div>
                            <div className="flex gap-3">
                              <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                              <span className="text-sm text-muted-foreground font-medium">
                                Student Internships & R&D
                              </span>
                            </div>
                          </div>
                          <div className="pt-6 border-t border-border/50">
                            <div className="flex items-center gap-2 text-primary font-bold text-sm cursor-default group/link">
                              Explore Center
                              <ArrowUpRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 px-6 text-muted-foreground">
                          <MapPin className="h-5 w-5 text-primary/40" />
                          <span className="text-xs font-medium uppercase tracking-wider">
                            Vizianagaram Campus
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
