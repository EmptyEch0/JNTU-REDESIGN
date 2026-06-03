import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { ADMINISTRATION_SUBNAV } from "@/lib/site";
import { Quote, Mail, MapPin, Save, X, Users } from "lucide-react";
import campusImg from "@/assets/hero-campus.jpg";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import { getLeadershipData, getLeadershipStaff, updateLeadershipData } from "@/funcs/leadership";
import { ProfileRenderer } from "@/components/ProfileRenderer";

export const Route = createFileRoute("/administration/principal")({
  head: () => ({
    meta: [
      { title: "Principal — Administration — JNTU-GV CEV" },
      {
        name: "description",
        content: "Principal's message and profile of JNTU-GV College of Engineering Vizianagaram.",
      },
    ],
  }),
  component: PrincipalPage,
});

function PrincipalPage() {
  const queryClient = useQueryClient();
  const { isAdmin, isEditMode } = useAdmin();
  const [editedData, setEditedData] = useState<any>(null);

  const { data: principal, isLoading: isPrincipalLoading } = useQuery({
    queryKey: ["leadership", "principal"],
    queryFn: () => getLeadershipData({ data: "principal" }),
  });

  const { data: staff, isLoading: isStaffLoading } = useQuery({
    queryKey: ["leadership-staff", "principal"],
    queryFn: () => getLeadershipStaff({ data: "principal" }),
  });

  const updateMutation = useMutation({
    mutationFn: updateLeadershipData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadership", "principal"] });
      setEditedData(null);
      toast.success("Principal's information updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update Principal's information.");
    },
  });

  const handleSave = () => {
    if (!editedData) return;
    updateMutation.mutate({ data: { id: principal.id, ...editedData } });
  };

  if (isPrincipalLoading || !principal)
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );

  const data = editedData || principal;

  return (
    <>
      <PageHero
        eyebrow="Administration"
        title="Principal's Desk"
        subtitle="Leading the pursuit of excellence in engineering education and research."
        image={campusImg}
      />
      <SubNav items={ADMINISTRATION_SUBNAV} />

      <section className="py-24 md:py-32 container-narrow">
        <div className="grid lg:grid-cols-[400px_1fr] gap-16 items-start max-w-6xl mx-auto">
          {/* Profile Sidebar */}
          <RevealOnScroll>
            <div className="space-y-8 lg:sticky lg:top-32">
              <div className="relative group">
                <div className="absolute -inset-4 rounded-[40px] bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-colors duration-200" />
                <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden border border-white shadow-elegant bg-card">
                  <img
                    src={data.image}
                    alt={data.name}
                    className="h-full w-full object-cover transition-all duration-300"
                  />
                  {isEditMode && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity p-6 text-center">
                      <p className="text-white text-xs font-medium">Profile Image URL</p>
                      <input
                        className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-xs text-white outline-none focus:border-primary"
                        value={data.image}
                        onChange={(e) => setEditedData({ ...data, image: e.target.value })}
                        placeholder="/assets/Principal.png"
                      />
                    </div>
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
                    <span className="text-sm">Principal's Office, Admin Block</span>
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
                <div className="text-eyebrow">Message</div>
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

        {/* Supporting Staff Section */}
        <RevealOnScroll delay={250}>
          <div className="mt-20 pt-16 border-t border-border max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 grid place-items-center text-primary">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-ink">Supporting Staff</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  The Principal’s Office plays a key role in supporting the academic activities and
                  the overall management of CEV.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-border bg-card/50 backdrop-blur-sm shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      S.No
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Name of the Employee
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Section
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Designation
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isStaffLoading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-12 text-center text-muted-foreground animate-pulse"
                      >
                        Loading staff records...
                      </td>
                    </tr>
                  ) : (
                    staff?.map((member: any, idx: number) => (
                      <tr
                        key={member.id}
                        className="group hover:bg-primary/[0.02] transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-muted-foreground">
                          {idx + 1}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-ink group-hover:text-primary transition-colors">
                          {member.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground font-medium">
                          {member.section}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-bold tracking-tight">
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
        </RevealOnScroll>

        {/* Professional Profile */}
        <RevealOnScroll delay={300}>
          <div className="mt-20 pt-16 border-t border-border max-w-6xl mx-auto">
            <div className="text-eyebrow mb-8">Professional Profile</div>
            {isEditMode ? (
              <textarea
                className="w-full font-mono text-sm text-muted-foreground leading-relaxed bg-primary/5 p-4 rounded outline-none min-h-[600px]"
                value={data.profile}
                onChange={(e) => setEditedData({ ...data, profile: e.target.value })}
              />
            ) : (
              <div className="max-w-none">
                <ProfileRenderer content={data.profile} />
              </div>
            )}
          </div>
        </RevealOnScroll>
      </section>

      {isEditMode && editedData && (
        <div className="fixed bottom-8 right-8 z-50 animate-in fade-in zoom-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3 bg-card p-2 rounded-full border border-border shadow-2xl">
            <button
              onClick={() => setEditedData(null)}
              className="flex items-center gap-2 px-5 py-3 rounded-full text-muted-foreground hover:text-ink transition-colors font-medium"
            >
              <X className="h-5 w-5" /> Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white shadow-lg hover:scale-105 active:scale-95 transition-all font-semibold"
            >
              <Save className="h-5 w-5" /> Save Changes
            </button>
          </div>
        </div>
      )}
    </>
  );
}
