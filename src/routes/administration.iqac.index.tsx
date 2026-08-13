import { createFileRoute } from "@tanstack/react-router";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { getAssetUrl } from "@/lib/assets";
import { Quote, Mail, MapPin, Save, X, Info, LayoutDashboard } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import { getLeadershipData, updateLeadershipData } from "@/funcs/leadership";
import { AdminUpload } from "@/components/AdminEditPanel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/administration/iqac/")({
  component: IQACAboutPage,
});

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
    if (!editedData) return;
    updateMutation.mutate({ data: { id: iqac.id, ...editedData } });
  };

  if (isLoading || !iqac)
    return (
      <div className="py-20 flex justify-center">
        <div className="spinner" />
      </div>
    );

  const data = editedData || iqac;
  const sections = data.extras || [];

  return (
    <section className="py-12 md:py-20">
      <div className="grid lg:grid-cols-[400px_1fr] gap-16 items-start">
        {/* Profile Sidebar */}
        <RevealOnScroll>
          <div className="space-y-8 lg:sticky lg:top-32">
            <div className="relative group">
              <div className="absolute -inset-4 rounded-[40px] bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-colors duration-200" />
              <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden border border-white shadow-elegant bg-card">
                  {isEditMode ? (
                    <AdminUpload
                      value={data.image}
                      onChange={(newUrl) => setEditedData({ ...data, image: newUrl })}
                      module="administration"
                      category="iqac"
                      className="w-full h-full"
                    />
                  ) : (
                    <img decoding="async" loading="lazy"
                      src={getAssetUrl(data.image)}
                      alt={data.name}
                      className="h-full w-full object-cover transition-all duration-700"
                    />
                  )}
              </div>
            </div>

            <div className="space-y-4">
              {isEditMode ? (
                <div className="space-y-2">
                  <input
                    className="w-full text-2xl font-bold text-ink bg-primary/5 p-2 rounded outline-none"
                    value={data.name}
                    onChange={(e) => setEditedData({ ...data, name: e.target.value })}
                  />
                  <input
                    className="w-full text-primary font-medium bg-primary/5 p-2 rounded outline-none"
                    value={data.designation}
                    onChange={(e) => setEditedData({ ...data, designation: e.target.value })}
                  />
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-ink">{data.name}</h2>
                  <p className="text-primary font-medium">{data.designation}</p>
                </div>
              )}

              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="h-4 w-4" />
                  {isEditMode ? (
                    <input
                      className="flex-1 bg-primary/5 p-1 rounded outline-none text-sm"
                      value={data.email}
                      onChange={(e) => setEditedData({ ...data, email: e.target.value })}
                    />
                  ) : (
                    <span className="text-sm">{data.email}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm">IQAC Cell, Administrative Building</span>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Message Content */}
        <div className="space-y-12">
          <RevealOnScroll delay={100}>
            <div className="relative">
              <Quote className="h-12 w-12 text-primary/10 absolute -top-6 -left-6" />
              {isEditMode ? (
                <textarea
                  className="w-full text-display text-2xl md:text-3xl text-ink leading-tight italic bg-primary/5 p-4 rounded outline-none min-h-[120px]"
                  value={data.quote}
                  onChange={(e) => setEditedData({ ...data, quote: e.target.value })}
                />
              ) : (
                <p className="text-display text-2xl md:text-3xl text-ink leading-tight italic">
                  "{data.quote}"
                </p>
              )}
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={200}>
            <div className="space-y-6">
              <div className="text-eyebrow">About IQAC</div>
              {isEditMode ? (
                <textarea
                  className="w-full text-lg text-muted-foreground leading-relaxed bg-primary/5 p-4 rounded outline-none min-h-[300px]"
                  value={data.message}
                  onChange={(e) => setEditedData({ ...data, message: e.target.value })}
                />
              ) : (
                <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {data.message}
                </p>
              )}
            </div>
          </RevealOnScroll>
        </div>
      </div>

      {/* Structured IQAC Content (Accordion) */}
      <RevealOnScroll delay={300}>
        <div className="mt-24 pt-16 border-t border-border">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 grid place-items-center text-primary shadow-sm border border-primary/20">
                <LayoutDashboard className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-ink tracking-tight">
                  Institutional Quality Framework
                </h3>
                <p className="text-muted-foreground mt-1 text-base">
                  Explore our mission, vision, and strategic objectives.
                </p>
              </div>
            </div>
          </div>

          {isEditMode ? (
            <div className="space-y-6 bg-primary/5 p-8 rounded-[32px] border border-primary/10">
              <textarea
                className="w-full font-mono text-sm text-muted-foreground leading-relaxed bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-border outline-none min-h-[500px] shadow-inner"
                value={JSON.stringify(sections, null, 2)}
                onChange={(e) => {
                  try {
                    const val = JSON.parse(e.target.value);
                    setEditedData({ ...data, extras: val });
                  } catch (err) {}
                }}
              />
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-4">
              {sections.map((section: any, idx: number) => (
                <AccordionItem
                  key={idx}
                  value={`item-${idx}`}
                  className="border border-border bg-white rounded-3xl overflow-hidden px-6 transition-all duration-300 data-[state=open]:shadow-elegant data-[state=open]:border-primary/30"
                >
                  <AccordionTrigger className="text-xl font-bold text-ink py-6 hover:no-underline group text-left">
                    <div className="flex items-center gap-4">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50 text-[13px] font-bold text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                        {idx + 1}
                      </span>
                      {section.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-8 text-lg text-muted-foreground leading-relaxed">
                    <div className="pl-12 whitespace-pre-wrap border-l-2 border-primary/10">
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
              className="px-5 py-3 rounded-full text-muted-foreground font-medium"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white shadow-lg font-semibold"
            >
              <Save className="h-5 w-5" /> Save Changes
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
