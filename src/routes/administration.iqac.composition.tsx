import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { IQAC_SUBNAV } from "@/lib/site";
import campusImg from "@/assets/hero-campus.jpg";
import { useQuery } from "@tanstack/react-query";
import { getIqacComposition } from "@/funcs/leadership";
import { Users } from "lucide-react";

export const Route = createFileRoute("/administration/iqac/composition")({
  head: () => ({
    meta: [
      { title: "IQAC Composition — Administration — JNTU-GV CEV" },
      {
        name: "description",
        content: "Members and composition of the Internal Quality Assurance Cell at JNTU-GV CEV.",
      },
    ],
  }),
  component: CompositionPage,
});

function CompositionPage() {
  const { data: members, isLoading } = useQuery({
    queryKey: ["iqac", "composition"],
    queryFn: () => getIqacComposition(),
  });

  return (
    <section className="py-12 md:py-20">
      <RevealOnScroll>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 grid place-items-center text-primary shadow-sm border border-primary/20">
              <Users className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-ink">Committee Members</h3>
              <p className="text-muted-foreground mt-1">
                Institutional and external stakeholders ensuring academic excellence.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-[32px] border border-border bg-card/50 backdrop-blur-sm shadow-elegant">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      S.No
                    </th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Name of the Member
                    </th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Designation
                    </th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Role in IQAC
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-8 py-20 text-center text-muted-foreground animate-pulse"
                      >
                        Loading committee details...
                      </td>
                    </tr>
                  ) : (
                    members?.map((member: any, idx: number) => (
                      <tr
                        key={member.id}
                        className="group hover:bg-primary/[0.02] transition-colors"
                      >
                        <td className="px-8 py-5 text-sm font-medium text-muted-foreground">
                          {idx + 1}
                        </td>
                        <td className="px-8 py-5 text-sm font-bold text-ink group-hover:text-primary transition-colors">
                          {member.name}
                        </td>
                        <td className="px-8 py-5 text-sm text-muted-foreground leading-relaxed">
                          {member.designation}
                        </td>
                        <td className="px-8 py-5">
                          <span className="inline-flex px-4 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-bold tracking-tight">
                            {member.role}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
