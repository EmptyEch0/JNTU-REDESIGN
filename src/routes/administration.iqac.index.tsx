import { createFileRoute } from "@tanstack/react-router";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { getAssetUrl } from "@/lib/assets";
import { Quote, Mail, MapPin, Save, X, Info, LayoutDashboard, Shield, Building2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import { getLeadershipData, updateLeadershipData } from "@/funcs/leadership";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/administration/iqac/")({
  component: IQACAboutPage,
});

const DEFAULT_IQAC_SECTIONS = [
  {
    title: "About IQACELL",
    content:
      "The IQAC is meant for planning, guiding, and monitoring Quality Assurance (QA) and Quality Enhancement (QE) activities of the University. It channelizes and systematizes institutional efforts towards academic excellence. It is not a hierarchical or record-keeping body, but a facilitative and participative organ. The IQAC acts as a driving force to improve quality by identifying deficiencies and implementing strategies for enhancement.",
  },
  {
    title: "🎯 Vision",
    content:
      '"To create a benchmark in defining the quality of JNTUK-UCEV as a professional higher education institution in Engineering and Technology through excellence in teaching, learning, research & development, and by fostering a culture of quality with transparent and reliable evaluation methods to meet global standards."',
  },
  {
    title: "🚀 Mission",
    content:
      "• To channelize and systematize efforts towards academic excellence.\n• To encourage departments to adopt student-centric learning environments using ICT tools.\n• To promote value-based education.\n• To organize seminars, workshops, and faculty development programs.\n• To ensure transparent academic, administrative, and financial operations.\n• To develop an Institutional MIS for quality information.\n• To ensure proper maintenance of institutional infrastructure.\n• To build stakeholder relationships and promote social responsibility.",
  },
  {
    title: "📌 Strategies & Objectives",
    content:
      "• Development and application of quality benchmarks for academic and administrative activities.\n• Creating a learner-centric environment.\n• Collecting feedback from students, parents, and stakeholders.\n• Dissemination of quality-related information in higher education.\n• Organizing workshops and seminars on quality themes.\n• Documentation of activities for continuous improvement.\n• Acting as a nodal agency for quality-related initiatives.\n• Maintaining institutional databases through MIS.\n• Improving academic and administrative performance systematically.\n• Promoting institutional best practices and quality culture.",
  },
  {
    title: "⚙️ Functions",
    content:
      "• Developing ethical work culture.\n• Establishing quality benchmarks.\n• Coordinating quality-related institutional activities.\n• Organizing workshops, seminars, and research events.\n• Ensuring a learner-centric environment.\n• Encouraging faculty innovation and technological adoption.\n• Conducting periodic audits.\n• Collecting and analyzing stakeholder feedback.\n• Preparing Annual Quality Assurance Reports (AQAR).\n• Acting as a dynamic system for institutional improvement.",
  },
  {
    title: "🌟 Benefits",
    content:
      "• Enhances clarity and focus in institutional functioning.\n• Promotes international quality standards.\n• Improves integration across institutional activities.\n• Supports better decision-making.\n• Acts as a dynamic quality improvement system.\n• Strengthens documentation and internal communication.",
  },
  {
    title: "📊 Monitoring Mechanism",
    content:
      "IQAC submits the Annual Quality Assurance Report (AQAR) to NAAC annually. AQAR is prepared based on quality benchmarks. Quality Radars (QRs) are developed bi-annually. Interaction with quality assurance bodies is maintained. Reports are approved by governing bodies.",
  },
];

function extractSections(rawExtras: any): Array<{ title: string; content: string }> {
  if (Array.isArray(rawExtras)) return rawExtras;
  if (rawExtras && typeof rawExtras === "object") {
    if (Array.isArray(rawExtras.sections)) return rawExtras.sections;
    const items: Array<{ title: string; content: string }> = [];
    Object.keys(rawExtras)
      .filter((k) => /^\d+$/.test(k) && rawExtras[k] && rawExtras[k].title)
      .sort((a, b) => Number(a) - Number(b))
      .forEach((k) => items.push(rawExtras[k]));
    if (items.length > 0) return items;
  }
  return DEFAULT_IQAC_SECTIONS;
}

function IQACAboutPage() {
  const queryClient = useQueryClient();
  const { isAdmin, isEditMode } = useAdmin();
  const [editedData, setEditedData] = useState<any>(null);

  const { data: iqac, isLoading } = useQuery({
    queryKey: ["leadership", "iqac-coordinator"],
    queryFn: () => getLeadershipData({ data: "iqac-coordinator" }),
  });

  const updateMutation = useMutation({
    mutationFn: updateLeadershipData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadership", "iqac-coordinator"] });
      setEditedData(null);
      toast.success("IQAC information updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update IQAC information.");
    },
  });

  const handleSave = () => {
    if (!editedData || !iqac?.id) return;
    updateMutation.mutate({ data: { id: iqac.id, ...editedData } });
  };

  if (isLoading || !iqac)
    return (
      <div className="py-20 flex justify-center">
        <div className="spinner" />
      </div>
    );

  const rawData = editedData || iqac;

  const data = {
    ...rawData,
    name: "", // Institutional cell - no coordinator personal name as per user request
    designation: "Internal Quality Assurance Cell",
    image: "", // Institutional cell - no coordinator personal image as per user request
    quote:
      rawData?.quote ||
      "Internal Quality Assurance Cell (IQAC) is committed to continuous quality enhancement, academic excellence, and institutional accreditation standards at JNTU-GV CEV.",
    message:
      rawData?.message ||
      "The IQAC is meant for planning, guiding, and monitoring Quality Assurance (QA) and Quality Enhancement (QE) activities of the University. It channelizes and systematizes institutional efforts towards academic excellence.",
  };

  const sections = extractSections(rawData?.extras);

  return (
    <section className="py-12 md:py-20">
      <div className="grid lg:grid-cols-[380px_1fr] gap-12 lg:gap-16 items-start">
        {/* Institutional Profile Sidebar - No personal photo or coordinator name as requested */}
        <RevealOnScroll>
          <div className="space-y-8 lg:sticky lg:top-32">
            <div className="relative group">
              <div className="absolute -inset-4 rounded-[40px] bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-colors duration-200" />
              <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden border border-white shadow-elegant bg-gradient-to-br from-slate-50 via-white to-blue-50/40 flex flex-col items-center justify-center p-8 text-center space-y-5">
                <div className="w-28 h-28 rounded-full bg-white shadow-md flex items-center justify-center border-2 border-primary/20 p-4 transition-transform duration-300 group-hover:scale-105">
                  <img
                    src="/logo-circle.png"
                    alt="JNTU-GV CEV Emblem"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                    Institutional Cell
                  </span>
                  <h3 className="text-xl font-bold font-display text-slate-900 leading-tight">
                    Internal Quality Assurance Cell
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">JNTU-GV CEV Vizianagaram</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-ink">IQAC Secretariat</h2>
                <p className="text-xs text-primary font-medium mt-0.5">
                  Academic Quality, Accreditation & Compliance
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="h-4 w-4 text-primary shrink-0" />
                  {isEditMode ? (
                    <input
                      className="flex-1 bg-primary/5 p-1 rounded outline-none text-sm"
                      value={data.email}
                      onChange={(e) => setEditedData({ ...data, email: e.target.value })}
                    />
                  ) : (
                    <a href={`mailto:${data.email || "iqac@jntugvcev.edu.in"}`} className="text-sm hover:underline">
                      {data.email || "iqac@jntugvcev.edu.in"}
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm">IQAC Cell, Administrative Building, JNTU-GV Campus</span>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Vision & Message Content */}
        <div className="space-y-12">
          {/* Quote / Vision Headline */}
          <RevealOnScroll delay={100}>
            <div className="relative bg-gradient-to-br from-primary/[0.04] to-transparent p-6 sm:p-8 rounded-3xl border border-primary/10">
              <Quote className="h-10 w-10 text-primary/20 absolute -top-4 -left-4" />
              {isEditMode ? (
                <textarea
                  className="w-full text-display text-xl md:text-2xl text-ink leading-relaxed italic bg-white/80 p-4 rounded-2xl border border-primary/20 outline-none min-h-[120px]"
                  value={data.quote}
                  onChange={(e) => setEditedData({ ...data, quote: e.target.value })}
                />
              ) : (
                <p className="text-display text-xl md:text-2xl text-ink leading-relaxed italic">
                  "{data.quote}"
                </p>
              )}
            </div>
          </RevealOnScroll>

          {/* About IQAC Message */}
          <RevealOnScroll delay={200}>
            <div className="space-y-4">
              <div className="text-eyebrow text-primary">About IQAC</div>
              <h3 className="text-2xl font-bold font-display text-ink">
                Cultivating Quality & Academic Excellence
              </h3>
              {isEditMode ? (
                <textarea
                  className="w-full text-base text-muted-foreground leading-relaxed bg-primary/5 p-4 rounded-2xl outline-none min-h-[200px]"
                  value={data.message}
                  onChange={(e) => setEditedData({ ...data, message: e.target.value })}
                />
              ) : (
                <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {data.message}
                </p>
              )}
            </div>
          </RevealOnScroll>
        </div>
      </div>

      {/* Structured IQAC Framework (Vision, Mission, Strategies, Objectives, etc.) */}
      <RevealOnScroll delay={300}>
        <div className="mt-20 pt-14 border-t border-border">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 grid place-items-center text-primary shadow-xs border border-primary/20">
                <LayoutDashboard className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight font-display">
                  Institutional Quality Framework
                </h3>
                <p className="text-muted-foreground mt-0.5 text-sm">
                  Our comprehensive quality benchmarks, vision, mission, and strategic objectives.
                </p>
              </div>
            </div>
          </div>

          {isEditMode ? (
            <div className="space-y-4 bg-primary/5 p-6 rounded-3xl border border-primary/10">
              <label className="text-xs font-bold text-slate-600 block">Edit Framework Sections (JSON format):</label>
              <textarea
                className="w-full font-mono text-xs text-muted-foreground leading-relaxed bg-white/80 p-4 rounded-xl border border-border outline-none min-h-[350px] shadow-inner"
                value={JSON.stringify(sections, null, 2)}
                onChange={(e) => {
                  try {
                    const val = JSON.parse(e.target.value);
                    setEditedData({
                      ...data,
                      extras: { ...((rawData?.extras as any) || {}), sections: val },
                    });
                  } catch (err) {}
                }}
              />
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-3.5">
              {sections.map((section: any, idx: number) => (
                <AccordionItem
                  key={idx}
                  value={`item-${idx}`}
                  className="border border-border bg-white rounded-2xl overflow-hidden px-6 transition-all duration-300 data-[state=open]:shadow-md data-[state=open]:border-primary/30"
                >
                  <AccordionTrigger className="text-lg font-bold text-ink py-5 hover:no-underline group text-left">
                    <div className="flex items-center gap-3.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted/60 text-xs font-bold text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                        {idx + 1}
                      </span>
                      <span>{section.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 text-base text-muted-foreground leading-relaxed">
                    <div className="pl-10 whitespace-pre-wrap border-l-2 border-primary/20 py-1">
                      {section.content}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </RevealOnScroll>

      {isEditMode && editedData && (
        <div className="fixed top-24 right-8 z-50 animate-in fade-in zoom-in slide-in-from-top-4">
          <div className="flex items-center gap-3 bg-card p-2 rounded-full border border-border shadow-2xl">
            <button
              onClick={() => setEditedData(null)}
              className="px-5 py-3 rounded-full text-muted-foreground font-medium cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white shadow-lg font-semibold cursor-pointer"
            >
              <Save className="h-5 w-5" /> Save Changes
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
