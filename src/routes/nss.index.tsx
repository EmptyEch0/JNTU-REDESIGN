import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNssProfile, updateNssProfile } from "@/funcs/nss";
import { useAdmin } from "@/context/AdminContext";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Quote, Save, X, Mail } from "lucide-react";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";

export const Route = createFileRoute("/nss/")({
  component: NSSAboutPage,
});

function NSSAboutPage() {
  const queryClient = useQueryClient();
  const { isEditMode } = useAdmin();
  const [editedData, setEditedData] = useState<any>(null);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["nss-profile"],
    queryFn: () => getNssProfile(),
  });

  const updateMutation = useMutation({
    mutationFn: updateNssProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nss-profile"] });
      setEditedData(null);
      toast.success("NSS profile updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update NSS profile.");
    },
  });

  const handleSave = () => {
    if (!editedData) return;
    updateMutation.mutate({ data: editedData });
  };

  if (isLoading || !profile) {
    return (
      <div className="py-20 grid place-items-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const data = editedData || profile;

  return (
    <>
      <section className="py-16 container-narrow">
        <div className="grid lg:grid-cols-[1fr_400px] gap-16 items-start">
          
          {/* About NSS content */}
          <div className="space-y-8">
            <RevealOnScroll>
              <SectionLabel eyebrow="History & Vision" title="About NSS" />
            </RevealOnScroll>
            
            <RevealOnScroll delay={100}>
              {isEditMode ? (
                <textarea
                  className="w-full text-base text-muted-foreground leading-relaxed bg-primary/5 p-4 rounded-2xl border border-border outline-none min-h-[400px] focus:border-primary"
                  value={data.aboutText}
                  onChange={(e) => setEditedData({ ...data, aboutText: e.target.value })}
                />
              ) : (
                <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                  {data.aboutText}
                </p>
              )}
            </RevealOnScroll>
          </div>

          {/* Programme Officer desk */}
          <RevealOnScroll delay={150}>
            <div className="space-y-8 bg-card border border-border rounded-[32px] p-6 shadow-sm">
              <div className="text-eyebrow">Programme Officer</div>
              
              {/* Photo */}
              <div className="relative group">
                <div className="absolute -inset-2 rounded-[24px] bg-primary/10 blur-xl group-hover:bg-primary/20 transition-colors duration-500" />
                <div className="relative aspect-square rounded-[20px] overflow-hidden border border-border bg-muted">
                  <img
                    src={data.imageUrl || data.officerImage}
                    alt={data.officerName}
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  {isEditMode && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity p-4 text-center">
                      <p className="text-white text-xs font-medium">Officer Image URL</p>
                      <input
                        className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-xs text-white outline-none focus:border-primary"
                        value={data.imageUrl || data.officerImage}
                        onChange={(e) => setEditedData({ ...data, officerImage: e.target.value, imageUrl: e.target.value })}
                        placeholder="https://example.com/photo.jpg"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Identity & Message */}
              <div className="space-y-4">
                {isEditMode ? (
                  <div className="space-y-2">
                    <input
                      className="w-full text-xl font-bold text-ink bg-primary/5 p-2 rounded outline-none border border-border"
                      value={data.officerName}
                      onChange={(e) => setEditedData({ ...data, officerName: e.target.value })}
                    />
                    <input
                      className="w-full text-primary font-medium bg-primary/5 p-2 rounded outline-none border border-border text-xs"
                      value={data.officerQuote}
                      placeholder="Officer Quote or Message"
                      onChange={(e) => setEditedData({ ...data, officerQuote: e.target.value, officerMessage: e.target.value })}
                    />
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-bold text-ink">{data.officerName}</h3>
                    <p className="text-xs text-primary font-medium uppercase tracking-wider mt-1">
                      NSS Programme Officer
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-border relative">
                  <Quote className="h-8 w-8 text-primary/10 absolute -top-4 -left-2" />
                  <p className="text-sm italic text-muted-foreground leading-relaxed pl-6">
                    "{data.officerQuote || data.officerMessage}"
                  </p>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Persistent admin controls */}
      {isEditMode && editedData && (
        <div className="fixed bottom-8 right-8 z-50 animate-in fade-in zoom-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3 bg-card p-2 rounded-full border border-border shadow-2xl">
            <button
              onClick={() => setEditedData(null)}
              className="flex items-center gap-2 px-5 py-3 rounded-full text-muted-foreground hover:text-ink transition-colors font-medium text-xs"
            >
              <X className="h-4 w-4" /> Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white shadow-lg hover:scale-105 active:scale-95 transition-all font-semibold text-xs"
            >
              <Save className="h-4 w-4" /> Save Profile
            </button>
          </div>
        </div>
      )}
    </>
  );
}
