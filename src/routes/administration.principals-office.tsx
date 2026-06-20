import { createFileRoute, useRouter } from "@tanstack/react-router";
import { imageUrl } from "@/lib/assets";
import { useState, useEffect } from "react";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { ADMINISTRATION_SUBNAV } from "@/lib/site";
import { FileText, Calendar, Users, ClipboardCheck, Mail, MapPin } from "lucide-react";
const campusImg = imageUrl("hero-carousal/hero-campus.jpg");
import { getPageContent, updatePageSection } from "@/funcs/site.server";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import {
  AdminModeBanner,
  AdminPanel,
  AdminPanelHeader,
  AdminField,
  AdminInput,
  AdminTextarea,
  AdminSaveButton,
} from "@/components/AdminEditPanel";

export const Route = createFileRoute("/administration/principals-office")({
  loader: async () => await getPageContent({ data: "principals-office" }),
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

const DEFAULTS = {
  heroTitle: "Principal's Office",
  heroSubtitle: "The administrative heart of the institution, providing essential support services.",
  introTitle: "Streamlining administrative workflows",
  introContent: "The Principal's Office serves as the primary administrative hub of JNTU-GV CEV. It facilitates the smooth functioning of the college by coordinating between the academic departments, the university, and external agencies. We are committed to providing efficient and student-friendly administrative services.",
  s1Title: "Certificates & Records",
  s1Desc: "Processing of study certificates, bonafide certificates and student records.",
  s2Title: "Academic Scheduling",
  s2Desc: "Management of college academic calendar and event coordination.",
  s3Title: "Public Relations",
  s3Desc: "Handling external communications and institutional inquiries.",
  s4Title: "Compliance",
  s4Desc: "Ensuring regulatory compliance and processing of official documentation.",
  location: "Ground Floor, Administrative Block, JNTU-GV CEV Campus",
  email: "office.principal@jntugv.edu.in",
  hours: "Monday – Saturday: 10:00 AM to 5:00 PM",
  supportServicesTitle: "Student Support Services",
  supportServicesText: `Application for study and conduct certificates.
Request for official transcripts and documentation.
Inquiries regarding scholarship processing.
Guidance on academic regulations and procedures.
Meeting requests with the Principal / Vice Principal.`,
};

function getServiceIcon(title: string) {
  const t = title.toLowerCase();
  if (t.includes("certificate") || t.includes("record") || t.includes("file")) return FileText;
  if (t.includes("schedule") || t.includes("calendar")) return Calendar;
  if (t.includes("relation") || t.includes("public") || t.includes("user")) return Users;
  return ClipboardCheck;
}

function PrincipalsOfficePage() {
  const records = Route.useLoaderData() as any[];
  const { isEditMode } = useAdmin();
  const router = useRouter();

  const heroRec = records.find((r) => r.sectionKey === "hero");
  const introRec = records.find((r) => r.sectionKey === "intro");
  const s1Rec = records.find((r) => r.sectionKey === "s1");
  const s2Rec = records.find((r) => r.sectionKey === "s2");
  const s3Rec = records.find((r) => r.sectionKey === "s3");
  const s4Rec = records.find((r) => r.sectionKey === "s4");
  const contactsRec = records.find((r) => r.sectionKey === "contacts");
  const supportRec = records.find((r) => r.sectionKey === "support");

  const [editTexts, setEditTexts] = useState({
    heroTitle: heroRec?.title || DEFAULTS.heroTitle,
    heroSubtitle: heroRec?.content || DEFAULTS.heroSubtitle,
    introTitle: introRec?.title || DEFAULTS.introTitle,
    introContent: introRec?.content || DEFAULTS.introContent,
    s1Title: s1Rec?.title || DEFAULTS.s1Title,
    s1Desc: s1Rec?.content || DEFAULTS.s1Desc,
    s2Title: s2Rec?.title || DEFAULTS.s2Title,
    s2Desc: s2Rec?.content || DEFAULTS.s2Desc,
    s3Title: s3Rec?.title || DEFAULTS.s3Title,
    s3Desc: s3Rec?.content || DEFAULTS.s3Desc,
    s4Title: s4Rec?.title || DEFAULTS.s4Title,
    s4Desc: s4Rec?.content || DEFAULTS.s4Desc,
    location: contactsRec?.title || DEFAULTS.location,
    email: contactsRec?.content || DEFAULTS.email,
    hours: contactsRec?.extras || DEFAULTS.hours,
    supportServicesTitle: supportRec?.title || DEFAULTS.supportServicesTitle,
    supportServicesText: supportRec?.content || DEFAULTS.supportServicesText,
  });

  useEffect(() => {
    setEditTexts({
      heroTitle: heroRec?.title || DEFAULTS.heroTitle,
      heroSubtitle: heroRec?.content || DEFAULTS.heroSubtitle,
      introTitle: introRec?.title || DEFAULTS.introTitle,
      introContent: introRec?.content || DEFAULTS.introContent,
      s1Title: s1Rec?.title || DEFAULTS.s1Title,
      s1Desc: s1Rec?.content || DEFAULTS.s1Desc,
      s2Title: s2Rec?.title || DEFAULTS.s2Title,
      s2Desc: s2Rec?.content || DEFAULTS.s2Desc,
      s3Title: s3Rec?.title || DEFAULTS.s3Title,
      s3Desc: s3Rec?.content || DEFAULTS.s3Desc,
      s4Title: s4Rec?.title || DEFAULTS.s4Title,
      s4Desc: s4Rec?.content || DEFAULTS.s4Desc,
      location: contactsRec?.title || DEFAULTS.location,
      email: contactsRec?.content || DEFAULTS.email,
      hours: contactsRec?.extras || DEFAULTS.hours,
      supportServicesTitle: supportRec?.title || DEFAULTS.supportServicesTitle,
      supportServicesText: supportRec?.content || DEFAULTS.supportServicesText,
    });
  }, [records]);

  async function handleSaveSection(section: string) {
    const tId = toast.loading("Saving content section...");
    try {
      if (section === "hero") {
        await updatePageSection({
          data: {
            page: "principals-office",
            sectionKey: "hero",
            title: editTexts.heroTitle,
            content: editTexts.heroSubtitle,
          },
        });
      } else if (section === "intro") {
        await updatePageSection({
          data: {
            page: "principals-office",
            sectionKey: "intro",
            title: editTexts.introTitle,
            content: editTexts.introContent,
          },
        });
      } else if (section === "s1") {
        await updatePageSection({
          data: {
            page: "principals-office",
            sectionKey: "s1",
            title: editTexts.s1Title,
            content: editTexts.s1Desc,
          },
        });
      } else if (section === "s2") {
        await updatePageSection({
          data: {
            page: "principals-office",
            sectionKey: "s2",
            title: editTexts.s2Title,
            content: editTexts.s2Desc,
          },
        });
      } else if (section === "s3") {
        await updatePageSection({
          data: {
            page: "principals-office",
            sectionKey: "s3",
            title: editTexts.s3Title,
            content: editTexts.s3Desc,
          },
        });
      } else if (section === "s4") {
        await updatePageSection({
          data: {
            page: "principals-office",
            sectionKey: "s4",
            title: editTexts.s4Title,
            content: editTexts.s4Desc,
          },
        });
      } else if (section === "contacts") {
        await updatePageSection({
          data: {
            page: "principals-office",
            sectionKey: "contacts",
            title: editTexts.location,
            content: editTexts.email,
            extras: editTexts.hours,
          },
        });
      } else if (section === "support") {
        await updatePageSection({
          data: {
            page: "principals-office",
            sectionKey: "support",
            title: editTexts.supportServicesTitle,
            content: editTexts.supportServicesText,
          },
        });
      }
      toast.success("Changes saved successfully!", { id: tId });
      router.invalidate();
    } catch {
      toast.error("Failed to save section.", { id: tId });
    }
  }

  const SERVICES = [
    { title: editTexts.s1Title, desc: editTexts.s1Desc, key: "s1", icon: getServiceIcon(editTexts.s1Title) },
    { title: editTexts.s2Title, desc: editTexts.s2Desc, key: "s2", icon: getServiceIcon(editTexts.s2Title) },
    { title: editTexts.s3Title, desc: editTexts.s3Desc, key: "s3", icon: getServiceIcon(editTexts.s3Title) },
    { title: editTexts.s4Title, desc: editTexts.s4Desc, key: "s4", icon: getServiceIcon(editTexts.s4Title) },
  ];

  const supportList = editTexts.supportServicesText
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <>
      {isEditMode && <AdminModeBanner label="Principal's Office Editor Active" />}

      <PageHero
        eyebrow="Administration"
        title={editTexts.heroTitle}
        subtitle={editTexts.heroSubtitle}
        image={campusImg}
      />
      <SubNav items={ADMINISTRATION_SUBNAV} />

      {isEditMode && (
        <section className="container-narrow py-6">
          <AdminPanel>
            <AdminPanelHeader title="Edit Hero Headers">
              <AdminSaveButton onClick={() => handleSaveSection("hero")} label="Save Hero" />
            </AdminPanelHeader>
            <div className="space-y-4">
              <AdminField label="Hero Title">
                <AdminInput
                  value={editTexts.heroTitle}
                  onChange={(e) => setEditTexts({ ...editTexts, heroTitle: e.target.value })}
                />
              </AdminField>
              <AdminField label="Hero Subtitle">
                <AdminTextarea
                  value={editTexts.heroSubtitle}
                  onChange={(e) => setEditTexts({ ...editTexts, heroSubtitle: e.target.value })}
                  rows={2}
                />
              </AdminField>
            </div>
          </AdminPanel>
        </section>
      )}

      {/* Intro */}
      <section className="py-24 md:py-32 container-narrow">
        <div className="max-w-4xl mx-auto text-center">
          <RevealOnScroll>
            {isEditMode ? (
              <AdminPanel>
                <AdminPanelHeader title="Edit Intro Section">
                  <AdminSaveButton onClick={() => handleSaveSection("intro")} label="Save Intro" />
                </AdminPanelHeader>
                <div className="space-y-4">
                  <AdminField label="Intro Title">
                    <AdminInput
                      value={editTexts.introTitle}
                      onChange={(e) => setEditTexts({ ...editTexts, introTitle: e.target.value })}
                    />
                  </AdminField>
                  <AdminField label="Intro Paragraph Narrative">
                    <AdminTextarea
                      value={editTexts.introContent}
                      onChange={(e) => setEditTexts({ ...editTexts, introContent: e.target.value })}
                      rows={5}
                    />
                  </AdminField>
                </div>
              </AdminPanel>
            ) : (
              <>
                <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary grid place-items-center mx-auto mb-6">
                  <ClipboardCheck className="h-8 w-8" />
                </div>
                <h2 className="text-display text-4xl text-ink">{editTexts.introTitle}</h2>
                <p className="mt-6 text-lg text-muted-foreground leading-relaxed">{editTexts.introContent}</p>
              </>
            )}
          </RevealOnScroll>
        </div>
      </section>

      {/* Key Functions */}
      <section className="py-24 bg-sand">
        <div className="container-narrow">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((s, i) => (
              <RevealOnScroll key={s.key} delay={i * 100}>
                <div className="bg-card rounded-2xl p-8 border border-border hover:border-primary/20 transition-all h-full shadow-sm hover:shadow-elegant flex flex-col justify-between">
                  <div>
                    <s.icon className="h-6 w-6 text-primary mb-4" />
                    <h3 className="font-bold text-ink mb-2">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{s.desc}</p>
                  </div>

                  {isEditMode && (
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                      <input
                        className="w-full border border-amber-200 bg-amber-50/20 rounded px-2 py-1 text-xs outline-none font-semibold"
                        value={s.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditTexts((prev) => ({ ...prev, [`${s.key}Title`]: val }));
                        }}
                      />
                      <textarea
                        className="w-full border border-amber-200 bg-amber-50/20 rounded px-2 py-1 text-xs outline-none"
                        value={s.desc}
                        rows={3}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditTexts((prev) => ({ ...prev, [`${s.key}Desc`]: val }));
                        }}
                      />
                      <button
                        onClick={() => handleSaveSection(s.key)}
                        className="w-full bg-slate-900 text-white rounded py-1 text-[10px] uppercase font-bold tracking-wider hover:bg-amber-600 transition"
                      >
                        Save Card
                      </button>
                    </div>
                  )}
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
            {isEditMode ? (
              <AdminPanel>
                <AdminPanelHeader title="Edit Contact & Location">
                  <AdminSaveButton onClick={() => handleSaveSection("contacts")} label="Save Contacts" />
                </AdminPanelHeader>
                <div className="space-y-4">
                  <AdminField label="Physical Location">
                    <AdminInput
                      value={editTexts.location}
                      onChange={(e) => setEditTexts({ ...editTexts, location: e.target.value })}
                    />
                  </AdminField>
                  <AdminField label="Contact Email Address">
                    <AdminInput
                      value={editTexts.email}
                      onChange={(e) => setEditTexts({ ...editTexts, email: e.target.value })}
                    />
                  </AdminField>
                  <AdminField label="Office Operations Hours">
                    <AdminInput
                      value={editTexts.hours}
                      onChange={(e) => setEditTexts({ ...editTexts, hours: e.target.value })}
                    />
                  </AdminField>
                </div>
              </AdminPanel>
            ) : (
              <div className="bg-ink text-white p-10 md:p-14 rounded-[40px] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32" />
                <h3 className="text-3xl font-bold mb-8">Contact & Location</h3>
                <div className="space-y-6">
                  <div className="flex gap-5 items-start">
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-white/50 text-xs uppercase tracking-widest mb-1">Location</div>
                      <div className="text-lg">{editTexts.location}</div>
                    </div>
                  </div>
                  <div className="flex gap-5 items-start">
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-white/50 text-xs uppercase tracking-widest mb-1">Email</div>
                      <div className="text-lg">{editTexts.email}</div>
                    </div>
                  </div>
                  <div className="flex gap-5 items-start">
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-white/50 text-xs uppercase tracking-widest mb-1">Office Hours</div>
                      <div className="text-lg">{editTexts.hours}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </RevealOnScroll>

          <RevealOnScroll delay={200}>
            {isEditMode ? (
              <AdminPanel>
                <AdminPanelHeader title="Edit Support Services">
                  <AdminSaveButton onClick={() => handleSaveSection("support")} label="Save Services" />
                </AdminPanelHeader>
                <div className="space-y-4">
                  <AdminField label="Section Header Title">
                    <AdminInput
                      value={editTexts.supportServicesTitle}
                      onChange={(e) => setEditTexts({ ...editTexts, supportServicesTitle: e.target.value })}
                    />
                  </AdminField>
                  <AdminField label="Support Services List (One service item per line)">
                    <AdminTextarea
                      value={editTexts.supportServicesText}
                      onChange={(e) => setEditTexts({ ...editTexts, supportServicesText: e.target.value })}
                      rows={6}
                    />
                  </AdminField>
                </div>
              </AdminPanel>
            ) : (
              <div className="p-10 space-y-8">
                <h3 className="text-2xl font-bold text-ink">{editTexts.supportServicesTitle}</h3>
                <div className="space-y-4">
                  {supportList.map((item, i) => (
                    <div key={i} className="flex gap-4 items-center p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}

