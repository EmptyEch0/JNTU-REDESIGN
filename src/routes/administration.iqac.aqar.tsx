import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { IQAC_SUBNAV } from "@/lib/site";
import campusImg from "@/assets/hero-campus.jpg";
import { useQuery } from "@tanstack/react-query";
import { getIqacReports } from "@/funcs/leadership";
import { FileDown, ShieldCheck, ClipboardCheck } from "lucide-react";

export const Route = createFileRoute("/administration/iqac/aqar")({
  head: () => ({
    meta: [
      { title: "AQAR & Academic Audit — Administration — JNTU-GV CEV" },
      {
        name: "description",
        content: "Annual Quality Assurance Reports and Academic Audit Reports of JNTU-GV CEV.",
      },
    ],
  }),
  component: AqarPage,
});

function AqarPage() {
  const { data: aqarReports, isLoading: isAqarLoading } = useQuery({
    queryKey: ["iqac", "reports", "AQAR"],
    queryFn: () => getIqacReports({ data: "AQAR" }),
  });

  const { data: auditReports, isLoading: isAuditLoading } = useQuery({
    queryKey: ["iqac", "reports", "Academic Audit"],
    queryFn: () => getIqacReports({ data: "Academic Audit" }),
  });

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-5xl mx-auto space-y-24">
        {/* AQAR Section */}
        <RevealOnScroll>
          <div>
            <div className="flex items-center gap-4 mb-10">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 grid place-items-center text-primary shadow-sm border border-primary/20">
                <ClipboardCheck className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-ink">Annual Quality Assurance Report</h3>
                <p className="text-muted-foreground mt-1 text-base">
                  Annual self-appraisal reports submitted to NAAC.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-[32px] border border-border bg-card/50 backdrop-blur-sm shadow-elegant">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      AQAR Year
                    </th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">
                      Download
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isAqarLoading ? (
                    <tr>
                      <td
                        colSpan={2}
                        className="px-8 py-16 text-center text-muted-foreground animate-pulse"
                      >
                        Loading reports...
                      </td>
                    </tr>
                  ) : (
                    aqarReports?.map((report: any) => (
                      <tr
                        key={report.id}
                        className="group hover:bg-primary/[0.02] transition-colors"
                      >
                        <td className="px-8 py-6 text-base font-bold text-ink">{report.title}</td>
                        <td className="px-8 py-6 text-right">
                          <a
                            href={report.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/5 text-primary text-sm font-bold hover:bg-primary hover:text-white transition-all duration-300"
                          >
                            <FileDown className="h-4 w-4" />
                            View/Download
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </RevealOnScroll>

        {/* Academic Audit Section */}
        <RevealOnScroll delay={100}>
          <div>
            <div className="flex items-center gap-4 mb-10">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 grid place-items-center text-primary shadow-sm border border-primary/20">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-ink">Academic Audit Report</h3>
                <p className="text-muted-foreground mt-1 text-base">
                  Periodic internal and external reviews of academic processes.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-[32px] border border-border bg-card/50 backdrop-blur-sm shadow-elegant">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Audit Year
                    </th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">
                      Download
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isAuditLoading ? (
                    <tr>
                      <td
                        colSpan={2}
                        className="px-8 py-16 text-center text-muted-foreground animate-pulse"
                      >
                        Loading audits...
                      </td>
                    </tr>
                  ) : (
                    auditReports?.map((report: any) => (
                      <tr
                        key={report.id}
                        className="group hover:bg-primary/[0.02] transition-colors"
                      >
                        <td className="px-8 py-6 text-base font-bold text-ink">{report.title}</td>
                        <td className="px-8 py-6 text-right">
                          <a
                            href={report.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/5 text-primary text-sm font-bold hover:bg-primary hover:text-white transition-all duration-300"
                          >
                            <FileDown className="h-4 w-4" />
                            View/Download
                          </a>
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
