import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWeRecreation, updateWeRecreation } from "@/funcs/we";
import { useAdmin } from "@/context/AdminContext";
import { useState } from "react";
import { toast } from "sonner";
import { Save, X, Sparkles, Smile, Trophy, Heart } from "lucide-react";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";
import { getAssetUrl } from "@/lib/assets";
import { AdminUpload } from "@/components/AdminEditPanel";

export const Route = createFileRoute("/women-empowerment/recreation")({
  component: WERecreationPage,
});

function WERecreationPage() {
  const queryClient = useQueryClient();
  const { isEditMode } = useAdmin();
  const [editedData, setEditedData] = useState<any>(null);

  const { data: rec, isLoading } = useQuery({
    queryKey: ["we-recreation"],
    queryFn: () => getWeRecreation(),
  });

  const updateMutation = useMutation({
    mutationFn: updateWeRecreation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["we-recreation"] });
      setEditedData(null);
      toast.success("Recreation content updated successfully!");
    },
    onError: () => toast.error("Failed to update recreation content."),
  });

  const handleSave = () => {
    if (!editedData) return;
    updateMutation.mutate({ data: editedData });
  };

  if (isLoading || !rec) {
    return (
      <div className="py-20 grid place-items-center">
        <div className="spinner" />
      </div>
    );
  }

  const data = editedData || rec;
  const images = (data.images as string[]) || [];

  // Descriptive text pieces to accompany the zigzag images beautifully
  const zigzagDetails = [
    {
      title: "Leisure & Creativity",
      desc: "Providing a peaceful space for women to connect, express themselves, and build strong bonds through leisure.",
      icon: Smile,
    },
    {
      title: "Team Building Morale",
      desc: "Enhancing collaboration and communication through regular group games and creative workshops.",
      icon: Sparkles,
    },
    {
      title: "Physical & Mental Balance",
      desc: "A happy, positive environment essential for healthy, stress-free, and successful academic careers.",
      icon: Heart,
    },
    {
      title: "Talents & Competitions",
      desc: "Fostering artistic talent, leadership qualities, and critical thinking with unique student engagements.",
      icon: Trophy,
    },
  ];

  return (
    <>
      <section className="py-16 container-narrow">
        <div className="space-y-12">
          {/* Introductory Description */}
          <RevealOnScroll>
            <div className="space-y-6">
              <SectionLabel eyebrow="Leisure & Well-being" title="Recreation Club" />

              {isEditMode ? (
                <textarea
                  className="w-full text-base text-muted-foreground leading-relaxed bg-primary/5 p-4 rounded-2xl border border-border outline-none min-h-[300px] focus:border-primary"
                  value={data.description}
                  onChange={(e) => setEditedData({ ...data, description: e.target.value })}
                />
              ) : (
                <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                  {data.description}
                </p>
              )}
            </div>
          </RevealOnScroll>

          {/* Alternating Zigzag Images Layout */}
          <div className="space-y-24 pt-16">
            {images.map((imgUrl, idx) => {
              const isEven = idx % 2 === 0;
              const detail = zigzagDetails[idx % zigzagDetails.length];
              return (
                <RevealOnScroll key={idx} delay={idx * 50}>
                  <div
                    className={`grid md:grid-cols-2 gap-12 md:gap-16 items-center ${isEven ? "" : "md:flex-row-reverse"}`}
                  >
                    {/* Image Box */}
                    <div className={`relative group ${isEven ? "" : "md:order-2"}`}>
                      <div className="absolute -inset-3 rounded-[32px] bg-primary/5 blur-xl group-hover:bg-primary/10 transition-all duration-200" />
                      <div className="relative aspect-[4/3] rounded-[24px] overflow-hidden border border-border shadow-elegant bg-card">
                        {isEditMode ? (
                          <AdminUpload
                            value={imgUrl || ""}
                            onChange={(newUrl) => {
                              const updatedImages = [...images];
                              updatedImages[idx] = newUrl;
                              setEditedData({ ...data, images: updatedImages });
                            }}
                            module="clubs"
                            category="we"
                            className="w-full h-full"
                          />
                        ) : (
                          <img decoding="async" loading="lazy"
                            src={getAssetUrl(imgUrl)}
                            alt={detail.title}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                      </div>
                    </div>

                    {/* Accompanying Details Box */}
                    <div className="space-y-4">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary grid place-items-center mb-2">
                        <detail.icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold text-ink">{detail.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                        {detail.desc}
                      </p>
                    </div>
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* Persistent admin controls */}
      {isEditMode && editedData && (
        <div className="fixed top-24 right-8 z-50 animate-in fade-in zoom-in slide-in-from-top-4">
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
              <Save className="h-4 w-4" /> Save Content
            </button>
          </div>
        </div>
      )}
    </>
  );
}
