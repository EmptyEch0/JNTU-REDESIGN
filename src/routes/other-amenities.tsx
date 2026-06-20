import {
  createFileRoute,
  Outlet,
  useRouterState,
  useRouter,
  Link,
} from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { OTHER_AMENITIES_SUBNAV } from "@/lib/site";
import { useAdmin } from "@/context/AdminContext";
import { getPageContent, updatePageSection } from "@/funcs/site.server";
import { toast } from "sonner";
import { Image as ImageIcon } from "lucide-react";
import { getAssetUrl } from "@/lib/assets";
import {
  AdminModeBanner,
  AdminPanel,
  AdminPanelHeader,
  AdminField,
  AdminInput,
  AdminTextarea,
  AdminSaveButton,
  AdminUpload,
  
} from "@/components/AdminEditPanel";

import typeA from "@/assets/faculity-quaters1.jpg";
import guest from "@/assets/guestoffice.jpg";

export const Route = createFileRoute("/other-amenities")({
  loader: async () => await getPageContent({ data: "amenities" }),
  component: OtherAmenitiesPage,
});

const DEFAULTS = {
  heroTitle: "Other Amenities",
  heroSubtitle: "Premium residential and world-class hospitality facilities on campus",
  introTitle: "On-Campus Residential & Hospitality",
  introText: "JNTU-GV provides secure, comfortable, and well-maintained residential and lodging spaces. These facilities guarantee comfort, proximity to work, and a vibrant academic ecosystem.",
  staffTitle: "Staff Quarters",
  staffDesc: "Comfortable and fully-serviced residential accommodation is provided for non-teaching and support staff members, promoting a tight-knit community.",
  staffImg: "",
  guestTitle: "Guest House",
  guestDesc: "A world-class lodging facility offering VIP suites and executive rooms for visiting dignitaries, speakers, and external examiners.",
  guestImg: "",
};

function OtherAmenitiesPage() {
  const initialData = Route.useLoaderData() as any[];
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isOverview = path === "/other-amenities";
  const { isEditMode } = useAdmin();
  const router = useRouter();

  const heroRec = initialData.find((r) => r.sectionKey === "hero");
  const introRec = initialData.find((r) => r.sectionKey === "intro");
  const staffRec = initialData.find((r) => r.sectionKey === "staff");
  const guestRec = initialData.find((r) => r.sectionKey === "guest");

  const [editTexts, setEditTexts] = useState({
    heroTitle: heroRec?.title || DEFAULTS.heroTitle,
    heroSubtitle: heroRec?.content || DEFAULTS.heroSubtitle,
    introTitle: introRec?.title || DEFAULTS.introTitle,
    introText: introRec?.content || DEFAULTS.introText,
    staffTitle: staffRec?.title || DEFAULTS.staffTitle,
    staffDesc: staffRec?.content || DEFAULTS.staffDesc,
    staffImg: staffRec?.imageUrl || DEFAULTS.staffImg,
    guestTitle: guestRec?.title || DEFAULTS.guestTitle,
    guestDesc: guestRec?.content || DEFAULTS.guestDesc,
    guestImg: guestRec?.imageUrl || DEFAULTS.guestImg,
  });

  useEffect(() => {
    setEditTexts({
      heroTitle: heroRec?.title || DEFAULTS.heroTitle,
      heroSubtitle: heroRec?.content || DEFAULTS.heroSubtitle,
      introTitle: introRec?.title || DEFAULTS.introTitle,
      introText: introRec?.content || DEFAULTS.introText,
      staffTitle: staffRec?.title || DEFAULTS.staffTitle,
      staffDesc: staffRec?.content || DEFAULTS.staffDesc,
      staffImg: staffRec?.imageUrl || DEFAULTS.staffImg,
      guestTitle: guestRec?.title || DEFAULTS.guestTitle,
      guestDesc: guestRec?.content || DEFAULTS.guestDesc,
      guestImg: guestRec?.imageUrl || DEFAULTS.guestImg,
    });
  }, [initialData]);

  async function handleSaveSection(section: "hero" | "intro" | "staff" | "guest") {
    const tId = toast.loading("Saving content...");
    try {
      if (section === "hero") {
        await updatePageSection({
          data: {
            page: "amenities",
            sectionKey: "hero",
            title: editTexts.heroTitle,
            content: editTexts.heroSubtitle,
          },
        });
      } else if (section === "intro") {
        await updatePageSection({
          data: {
            page: "amenities",
            sectionKey: "intro",
            title: editTexts.introTitle,
            content: editTexts.introText,
          },
        });
      } else if (section === "staff") {
        await updatePageSection({
          data: {
            page: "amenities",
            sectionKey: "staff",
            title: editTexts.staffTitle,
            content: editTexts.staffDesc,
            imageUrl: editTexts.staffImg,
          },
        });
      } else if (section === "guest") {
        await updatePageSection({
          data: {
            page: "amenities",
            sectionKey: "guest",
            title: editTexts.guestTitle,
            content: editTexts.guestDesc,
            imageUrl: editTexts.guestImg,
          },
        });
      }

      toast.success("Changes saved successfully!", { id: tId });
      router.invalidate();
    } catch {
      toast.error("Failed to save.", { id: tId });
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      {isEditMode && <AdminModeBanner label="Amenities Live Editorial Mode" />}

      <PageHero
        title={heroRec?.title || DEFAULTS.heroTitle}
        subtitle={heroRec?.content || DEFAULTS.heroSubtitle}
      />

      {/* EDIT HERO SECTION */}
      {isEditMode && (
        <div className="max-w-4xl mx-auto px-4 mt-6">
          <AdminPanel>
            <AdminPanelHeader title="Hero Title & Subtitle">
              <AdminSaveButton onClick={() => handleSaveSection("hero")} label="Save Hero" />
            </AdminPanelHeader>
            <div className="space-y-3">
              <AdminField label="Page Title">
                <AdminInput
                  value={editTexts.heroTitle}
                  onChange={(e) => setEditTexts({ ...editTexts, heroTitle: e.target.value })}
                  placeholder="e.g. Other Amenities"
                />
              </AdminField>
              <AdminField label="Subtitle">
                <AdminInput
                  value={editTexts.heroSubtitle}
                  onChange={(e) => setEditTexts({ ...editTexts, heroSubtitle: e.target.value })}
                  placeholder="Hero subtitle copy…"
                />
              </AdminField>
            </div>
          </AdminPanel>
        </div>
      )}

      {/* SUB NAV — same style as Student Corner */}
      <SubNav items={OTHER_AMENITIES_SUBNAV} />

      {isOverview ? (
        <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 animate-[fade-in_0.5s_ease-out] space-y-16">
          
          {/* INTRO EXPLAINER */}
          {isEditMode ? (
            <div className="max-w-3xl mx-auto">
              <AdminPanel>
                <AdminPanelHeader title="Intro Banner Text">
                  <AdminSaveButton onClick={() => handleSaveSection("intro")} label="Save Section" />
                </AdminPanelHeader>
                <div className="space-y-3">
                  <AdminField label="Intro Header">
                    <AdminInput
                      value={editTexts.introTitle}
                      onChange={(e) => setEditTexts({ ...editTexts, introTitle: e.target.value })}
                      placeholder="Intro Header"
                    />
                  </AdminField>
                  <AdminField label="Description Payload">
                    <AdminTextarea
                      value={editTexts.introText}
                      onChange={(e) => setEditTexts({ ...editTexts, introText: e.target.value })}
                      rows={4}
                      placeholder="Description payload..."
                    />
                  </AdminField>
                </div>
              </AdminPanel>
            </div>
          ) : (
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {introRec?.title || DEFAULTS.introTitle}
              </h2>
              <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
              <p className="text-base sm:text-lg text-slate-500 leading-relaxed font-medium whitespace-pre-line">
                {introRec?.content || DEFAULTS.introText}
              </p>
            </div>
          )}

          {/* CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* CARD 1: STAFF QUARTERS */}
            <div className="flex flex-col gap-4">
              <Link
                to="/other-amenities/staff-quarters"
                className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1 h-full"
              >
                <div className="relative overflow-hidden h-64">
                  <img
                    src={getAssetUrl(staffRec?.imageUrl) || typeA}
                    alt={staffRec?.title || DEFAULTS.staffTitle}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
                  <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary tracking-wide uppercase">
                    Welfare
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                      {staffRec?.title || DEFAULTS.staffTitle}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 font-medium">
                      {staffRec?.content || DEFAULTS.staffDesc}
                    </p>
                  </div>
                  <div className="pt-2 text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">
                    Explore Details <span>&rarr;</span>
                  </div>
                </div>
              </Link>

              {isEditMode && (
                <div className="mt-4">
                  <AdminPanel>
                    <AdminPanelHeader title="Quarters Card Edits">
                      <AdminSaveButton onClick={() => handleSaveSection("staff")} label="Save Card" />
                    </AdminPanelHeader>
                    <div className="space-y-3">
                      <AdminField label="Card Title">
                        <AdminInput
                          value={editTexts.staffTitle}
                          onChange={(e) => setEditTexts({ ...editTexts, staffTitle: e.target.value })}
                          placeholder="e.g. Staff Quarters"
                        />
                      </AdminField>
                      <AdminField label="Summary">
                        <AdminTextarea
                          value={editTexts.staffDesc}
                          onChange={(e) => setEditTexts({ ...editTexts, staffDesc: e.target.value })}
                          rows={3}
                          placeholder="Quarters summary..."
                        />
                      </AdminField>
                      <AdminField label="Cover Image">
                        <AdminUpload
                          value={editTexts.staffImg}
                          onChange={(newUrl) => setEditTexts({ ...editTexts, staffImg: newUrl || "" })}
                          module="amenities"
                          category="staff"
                        />
                      </AdminField>
                    </div>
                  </AdminPanel>
                </div>
              )}
            </div>

            {/* CARD 2: GUEST HOUSE */}
            <div className="flex flex-col gap-4">
              <Link
                to="/other-amenities/guest-house"
                className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1 h-full"
              >
                <div className="relative overflow-hidden h-64">
                  <img
                    src={getAssetUrl(guestRec?.imageUrl) || guest}
                    alt={guestRec?.title || DEFAULTS.guestTitle}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
                  <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary tracking-wide uppercase">
                    Hospitality
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                      {guestRec?.title || DEFAULTS.guestTitle}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 font-medium">
                      {guestRec?.content || DEFAULTS.guestDesc}
                    </p>
                  </div>
                  <div className="pt-2 text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">
                    Explore Details <span>&rarr;</span>
                  </div>
                </div>
              </Link>

              {isEditMode && (
                <div className="mt-4">
                  <AdminPanel>
                    <AdminPanelHeader title="Guest House Card Edits">
                      <AdminSaveButton onClick={() => handleSaveSection("guest")} label="Save Card" />
                    </AdminPanelHeader>
                    <div className="space-y-3">
                      <AdminField label="Card Title">
                        <AdminInput
                          value={editTexts.guestTitle}
                          onChange={(e) => setEditTexts({ ...editTexts, guestTitle: e.target.value })}
                          placeholder="e.g. Guest House"
                        />
                      </AdminField>
                      <AdminField label="Summary">
                        <AdminTextarea
                          value={editTexts.guestDesc}
                          onChange={(e) => setEditTexts({ ...editTexts, guestDesc: e.target.value })}
                          rows={3}
                          placeholder="Guest summary..."
                        />
                      </AdminField>
                      <AdminField label="Cover Image">
                        <AdminUpload
                          value={editTexts.guestImg}
                          onChange={(newUrl) => setEditTexts({ ...editTexts, guestImg: newUrl || "" })}
                          module="amenities"
                          category="guest"
                        />
                      </AdminField>
                    </div>
                  </AdminPanel>
                </div>
              )}
            </div>

          </div>
        </section>
      ) : (
        <section className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <Outlet />
        </section>
      )}
    </div>
  );
}

export default OtherAmenitiesPage;