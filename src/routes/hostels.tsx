import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHero } from "@/components/PageHero";
import hostelImg from "@/assets/hostel.jpg";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import { getAssetUrl } from "@/lib/assets";
import { ImageCarousel } from "@/components/ImageCarousel";
import {
  getHostelData,
  addStructure,
  updateStructure,
  deleteStructure,
  addPerson,
  updatePerson,
  deletePerson,
  addImage,
  deleteImage,
  updateImage,
  updateContent,
} from "@/funcs/hostel.server";
import {
  Building,
  User,
  Activity,
  Sparkles,
  Coffee,
  Phone,
  Tent,
  Home,
  Utensils,
  Clock,
  Plus,
  Trash2,
  Camera,
  RefreshCw,
  ChevronRight,
  X,
  Save,
  Lock,
} from "lucide-react";

import { LocalSubNav } from "@/components/LocalSubNav";
import {
  AdminModeBanner,
  AdminPanel,
  AdminPanelHeader,
  AdminField,
  AdminInput,
  AdminTextarea,
  AdminSaveButton,
  AdminAddButton,
  AdminDeleteButton,
  AdminRemoveButton,
  AdminAddRow,
  AdminUpload,
  PersonAvatarUpload,
} from "@/components/AdminEditPanel";
export const Route = createFileRoute("/hostels")({
  loader: async () => await getHostelData(),
  component: HostelsPage,
});

function HostelsPage() {
  const data = Route.useLoaderData() as any;
  const router = useRouter();
  const { isEditMode } = useAdmin();

  const blocks = data?.blocks ?? [];
  const wardens = data?.wardens ?? [];
  const facilities = data?.facilities ?? [];
  const officer = data?.officer;
  const health = data?.health;
  const staff = data?.staff ?? [];
  const images = data?.images ?? [];

  const [tab, setTab] = useState<"office" | "girls" | "boys">("office");

  const getImages = () =>
    images.map((i: any) => i.url);

  const getRawImages = () =>
    images;

  const girlsBlocks = blocks.filter((b: any) => b.type === "girls");
  const boysBlocks = blocks.filter((b: any) => b.type === "boys");

  const girlsWardens = wardens.filter((w: any) => w.hostelType === "girls");
  const boysWardens = wardens.filter((w: any) => w.hostelType === "boys");

  const girlsFacilities = facilities.filter((f: any) => f.type === "girls");
  const boysFacilities = facilities.filter((f: any) => f.type === "boys");

  // --- LOCAL EDIT STATES ---
  const [editAbout, setEditAbout] = useState(data?.about?.description || "");
  const [editOfficer, setEditOfficer] = useState({
    name: officer?.name || "",
    role: officer?.role || "",
    image: officer?.image || "",
  });

  useEffect(() => {
    if (data?.about?.description) setEditAbout(data.about.description);
    if (officer) {
      setEditOfficer({
        name: officer.name || "",
        role: officer.role || "",
        image: officer.image || "",
      });
    }
  }, [data]);

  // --- MUTATION ACTIONS ---
  async function handleSaveAbout() {
    const tId = toast.loading("Storing summary edits...");
    try {
      await updateContent({
        data: {
          id: 1,
          description: editAbout,
          officerName: editOfficer.name,
          officerRole: editOfficer.role,
          officerImage: editOfficer.image,
          healthName: health?.name,
          healthTiming: health?.timing,
        },
      });
      toast.success("Summary synchronized!", { id: tId });
      router.invalidate();
    } catch {
      toast.error("Update failed.", { id: tId });
    }
  }

  async function handleSaveOfficer() {
    const tId = toast.loading("Saving officer profile...");
    try {
      await updateContent({
        data: {
          id: 1,
          description: editAbout,
          officerName: editOfficer.name,
          officerRole: editOfficer.role,
          officerImage: editOfficer.image,
          healthName: health?.name,
          healthTiming: health?.timing,
        },
      });
      toast.success("Governing profile synchronized!", { id: tId });
      router.invalidate();
    } catch {
      toast.error("Sync failed.", { id: tId });
    }
  }

  async function handleAddImage(url: string) {
    if (!url.trim()) return;
    const tId = toast.loading("Injecting gallery photo...");
    try {
      await addImage({ data: { url } });
      toast.success("Photo logged!", { id: tId });
      router.invalidate();
    } catch {
      toast.error("Upload failed.", { id: tId });
    }
  }

  async function handleDeleteImage(id: number) {
    const tId = toast.loading("Purging image record...");
    try {
      await deleteImage({ data: { id } });
      toast.success("Image wiped!", { id: tId });
      router.invalidate();
    } catch {
      toast.error("Failed to purge.", { id: tId });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-sand/20 text-foreground pb-24 w-full max-w-full overflow-x-hidden relative z-0">
      {/* Premium Ambient Glows */}
      <div className="absolute top-[30%] -left-48 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[130px] pointer-events-none -z-10 animate-pulse duration-[8s]" />
      <div className="absolute bottom-[20%] -right-48 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[130px] pointer-events-none -z-10 animate-pulse duration-[10s]" />
      {/* STICKY ADIMINISTRATOR CONTROL STRIP */}
      {isEditMode && <AdminModeBanner label="Hostel Live Editorial Mode" />}

      <PageHero
        title="Campus Hostels"
        subtitle={data?.about?.description || "Safe, modern, and comfortable community housing suites for university scholars."}
        image={getAssetUrl(getImages()[0]) || hostelImg}
      />

      <section className="container-narrow py-12 md:py-16 px-4 sm:px-6 max-w-full overflow-x-hidden">

        {/* TABS CONTROLLER - Sleeker, modern, clean UI */}
        <LocalSubNav
          activeTab={tab}
          setActiveTab={setTab as (tab: string) => void}
          items={[
            { label: "office", icon: Building },
            { label: "girls", icon: Home },
            { label: "boys", icon: Tent },
          ]}
        />

        <div className="space-y-10 md:space-y-12 max-w-5xl mx-auto animate-[fade-in_0.5s_ease-out]">

          {/* BEAUTIFUL SHADOW-BORDERED CAROUSEL */}
          <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-3xl shadow-lg border border-slate-200/60 bg-slate-100 transition-all duration-300">
            <ImageCarousel images={getImages()} fallback={hostelImg} />

            {/* INLINE EDITORIAL IMAGES CONTROLLER */}
            {isEditMode && (
              <div className="bg-amber-50/95 backdrop-blur-md border-t border-amber-200 p-6 sm:p-8 flex flex-col gap-5 animate-[fade-in_0.2s]">
                <div className="flex items-center gap-2 pb-3 border-b border-amber-200/60">
                  <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 grid place-items-center shrink-0">
                    <Camera className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-amber-950 tracking-tight">Carousel Ledger</h4>
                    <p className="text-[10px] text-amber-600 font-medium uppercase tracking-wider">Manage visual slides live</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {getRawImages().map((img: any) => (
                    <div key={img.id} className="relative group rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 border-2 border-slate-200/40 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                      <img alt="" decoding="async" loading="lazy" src={getAssetUrl(img.url)} className="w-full h-full object-cover" />
                      <button
                        onClick={() => handleDeleteImage(img.id)}
                        className="absolute inset-0 bg-rose-950/80 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col gap-1 items-center justify-center font-black text-xs uppercase tracking-widest cursor-pointer"
                      >
                        <Trash2 className="w-5 h-5" /> WIPE
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mt-2 items-center">
                  <AdminUpload
                    value=""
                    onChange={async (newUrl) => {
                      if (newUrl) {
                        await handleAddImage(newUrl);
                      }
                    }}
                    module="facilities"
                    category="hostel"
                    placeholder="Drag & drop or click to add a new slide image..."
                    className="flex-1 w-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ============================================================================
              💼 TAB 1: OFFICE VIEW
              ============================================================================ */}
          {tab === "office" && (
            <div className="space-y-10 animate-[fade-in_0.5s_ease-out]">

              {/* ABOUT SUMMARY CARD */}
              <Card
                title="Administration Desk"
                subtitle="Strategic governance & administrative definitions"
                icon={Building}
                className={isEditMode ? "ring-4 ring-amber-500/10 border-amber-200 bg-amber-50/20 shadow-xl duration-200" : "hover:-translate-y-1.5 shadow-[0_10px_35px_rgba(0,0,0,0.04)] duration-200"}
              >
                {isEditMode ? (
                  <AdminPanel>
                    <AdminTextarea
                      value={editAbout}
                      onChange={(e) => setEditAbout(e.target.value)}
                      rows={6}
                      placeholder="Enter governing description…"
                    />
                    <div className="flex justify-end">
                      <AdminSaveButton onClick={handleSaveAbout} label="Save Description" />
                    </div>
                  </AdminPanel>
                ) : (
                  <p className="text-slate-600 leading-relaxed text-sm md:text-[15px] whitespace-pre-line font-medium">
                    {data?.about?.description || "Governance descriptions have yet to be detailed."}
                  </p>
                )}
              </Card>

              {/* GOVERNING HEAD CARD */}
              <Card
                title="Officer In Charge"
                subtitle="Active presiding campus hostel coordinator"
                icon={User}
                className={isEditMode ? "ring-4 ring-amber-500/10 border-amber-200 bg-amber-50/20" : "hover:-translate-y-1.5 shadow-[0_10px_35px_rgba(0,0,0,0.04)]"}
              >
                {isEditMode ? (
                  <AdminPanel>
                    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">

                      {/* ── Avatar Upload Zone ── */}
                      <PersonAvatarUpload
                        value={editOfficer.image}
                        onChange={(newUrl) => setEditOfficer({ ...editOfficer, image: newUrl })}
                        module="facilities"
                        category="hostel/officer"
                        size={96}
                      />

                      <div className="flex-1 space-y-3 w-full">
                        <AdminField label="Officer Name">
                          <AdminInput value={editOfficer.name} onChange={(e) => setEditOfficer({ ...editOfficer, name: e.target.value })} placeholder="Full name" />
                        </AdminField>
                        <AdminField label="Designation">
                          <AdminInput value={editOfficer.role} onChange={(e) => setEditOfficer({ ...editOfficer, role: e.target.value })} placeholder="e.g. Chief Hostel Officer" />
                        </AdminField>
                        <div className="flex justify-end pt-1">
                          <AdminSaveButton onClick={handleSaveOfficer} label="Save Officer" />
                        </div>
                      </div>
                    </div>
                  </AdminPanel>
                ) : (
                  officer && (
                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                      <div className="relative shrink-0">
                        <img decoding="async" loading="lazy"
                          src={getAssetUrl(officer.image) || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250"}
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250"; }}
                          className="w-24 h-24 rounded-[24px] object-cover border-2 border-slate-100 shadow-md shrink-0 transition duration-500 hover:scale-[1.03]"
                          alt={officer.name}
                        />
                      </div>
                      <div>
                        <h4 className="font-display font-black text-xl text-slate-900 tracking-tight mb-1">{officer.name}</h4>
                        <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-[oklch(0.42_0.18_265)] font-bold text-xs tracking-widest uppercase px-3 py-1.5 rounded-full">
                          <Sparkles className="w-3.5 h-3.5" />
                          {officer.role}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </Card>

              {/* WARDENS ACTIVE DIRECTORIES */}
              <div className="grid grid-cols-1 gap-8">
                <Card
                  title="Girls Dormitory Wardens"
                  subtitle="Governing female security and operations rosters"
                  icon={User}
                  className={isEditMode ? "ring-2 ring-amber-300" : "shadow-[0_10px_35px_rgba(0,0,0,0.03)]"}
                >
                  <WardenTableEditable
                    data={girlsWardens}
                    type="girls"
                    isEdit={isEditMode}
                    onRefetch={() => router.invalidate()}
                  />
                </Card>

                <Card
                  title="Boys Dormitory Wardens"
                  subtitle="Governing male security and operations rosters"
                  icon={User}
                  className={isEditMode ? "ring-2 ring-amber-300" : "shadow-[0_10px_35px_rgba(0,0,0,0.03)]"}
                >
                  <WardenTableEditable
                    data={boysWardens}
                    type="boys"
                    isEdit={isEditMode}
                    onRefetch={() => router.invalidate()}
                  />
                </Card>

                <Card
                  title="Office Supporting Staff"
                  subtitle="Governing ledger assistance and logistical registry"
                  icon={Sparkles}
                  className={isEditMode ? "ring-2 ring-amber-300" : "shadow-[0_10px_35px_rgba(0,0,0,0.03)]"}
                >
                  <StaffTableEditable
                    data={staff}
                    isEdit={isEditMode}
                    onRefetch={() => router.invalidate()}
                  />
                </Card>
              </div>
            </div>
          )}

          {/* ============================================================================
              👧 TAB 2: GIRLS HOSTEL VIEW
             ============================================================================ */}
          {tab === "girls" && (
            <div className="space-y-10 animate-[fade-in_0.2s_ease-out]">
              <div className="border-b border-slate-200/60 pb-3 flex items-center gap-3">
                <Home className="w-5 h-5 text-pink-600" />
                <h3 className="text-lg font-black tracking-tight text-slate-900">Girls Inhabitation Ledger</h3>
              </div>

              <BlocksManagerEditable
                blocks={girlsBlocks}
                type="girls"
                isEdit={isEditMode}
                onRefetch={() => router.invalidate()}
              />

              <Card
                title="Available Facilities"
                subtitle="Active logistical amenities mapped to girls dorms"
                icon={Sparkles}
                className={isEditMode ? "ring-2 ring-amber-300" : ""}
              >
                <FacilitiesManagerEditable
                  facilities={girlsFacilities}
                  type="girls"
                  isEdit={isEditMode}
                  onRefetch={() => router.invalidate()}
                />
              </Card>

              {health && (
                <Card title="Physical Care Unit" icon={Activity}>
                  <HealthCard health={health} />
                </Card>
              )}
            </div>
          )}

          {/* ============================================================================
              👦 TAB 3: BOYS HOSTEL VIEW
             ============================================================================ */}
          {tab === "boys" && (
            <div className="space-y-10 animate-[fade-in_0.2s_ease-out]">
              <div className="border-b border-slate-200/60 pb-3 flex items-center gap-3">
                <Tent className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-black tracking-tight text-slate-900">Boys Inhabitation Ledger</h3>
              </div>

              <BlocksManagerEditable
                blocks={boysBlocks}
                type="boys"
                isEdit={isEditMode}
                onRefetch={() => router.invalidate()}
              />

              <Card
                title="Available Facilities"
                subtitle="Active logistical amenities mapped to boys dorms"
                icon={Sparkles}
                className={isEditMode ? "ring-2 ring-amber-300" : ""}
              >
                <FacilitiesManagerEditable
                  facilities={boysFacilities}
                  type="boys"
                  isEdit={isEditMode}
                  onRefetch={() => router.invalidate()}
                />
              </Card>

              {health && (
                <Card title="Physical Care Unit" icon={Activity}>
                  <HealthCard health={health} />
                </Card>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/* ---------- UI SUBCOMPONENTS ---------- */

function Card({ title, subtitle, icon: Icon, children, className = "" }: any) {
  return (
    <div
      className={`glass-panel rounded-3xl p-6 md:p-8 hover-lift overflow-hidden w-full ${className}`}
    >
      {title && (
        <div className="flex items-center gap-3.5 mb-6 md:mb-8 pb-5 border-b border-border/50">
          <div className="w-12 h-12 rounded-2xl bg-background border border-border/60 text-primary grid place-items-center shrink-0 shadow-sm">
            {Icon && <Icon className="w-5.5 h-5.5" />}
          </div>
          <div>
            <h3 className="font-display font-extrabold text-xl text-foreground tracking-tight leading-none">
              {title}
            </h3>
            {subtitle && <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mt-1.5">{subtitle}</p>}
          </div>
        </div>
      )}
      <div className="w-full">{children}</div>
    </div>
  );
}



/* ---------- EDITABLE DATA PRESENTATIONS ---------- */

function WardenTableEditable({ data, type, isEdit, onRefetch }: any) {
  const [newForm, setNewForm] = useState({ name: "", designation: "Assistant Warden", phone: "" });

  async function handleDelete(id: number) {
    const tId = toast.loading("Purging warden registration...");
    try {
      await deletePerson({ data: { id } });
      toast.success("Purged successfully!", { id: tId });
      onRefetch();
    } catch {
      toast.error("Purge failed.", { id: tId });
    }
  }

  async function handleAdd() {
    if (!newForm.name.trim()) return;
    const tId = toast.loading("Enrolling warden roster file...");
    try {
      await addPerson({
        data: {
          roleType: "warden",
          hostelType: type,
          name: newForm.name,
          designation: newForm.designation,
          phone: newForm.phone,
        },
      });
      toast.success("Warden enrolled successfully!", { id: tId });
      setNewForm({ name: "", designation: "Assistant Warden", phone: "" });
      onRefetch();
    } catch {
      toast.error("Storage failed.", { id: tId });
    }
  }

  return (
    <div className="space-y-6 w-full max-w-full">
      {isEdit && (
        <div className="bg-amber-50/80 border-2 border-amber-200 p-5 rounded-[24px] grid grid-cols-1 sm:grid-cols-4 gap-4 items-end shadow-inner animate-[fade-in_0.15s]">
          <div className="space-y-1 flex-1">
            <label className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Warden Full Name</label>
            <input
              type="text"
              value={newForm.name}
              onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
              className="w-full border-2 border-amber-200 bg-white rounded-[12px] px-4 py-2.5 outline-none font-semibold text-sm"
              placeholder="e.g. M. Vijayalaxmi"
            />
          </div>
          <div className="space-y-1 flex-1">
            <label className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Designation Rank</label>
            <input
              type="text"
              value={newForm.designation}
              onChange={(e) => setNewForm({ ...newForm, designation: e.target.value })}
              className="w-full border-2 border-amber-200 bg-white rounded-[12px] px-4 py-2.5 outline-none font-semibold text-sm"
            />
          </div>
          <div className="space-y-1 flex-1">
            <label className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Hotline Contact</label>
            <input
              type="text"
              value={newForm.phone}
              onChange={(e) => setNewForm({ ...newForm, phone: e.target.value })}
              className="w-full border-2 border-amber-200 bg-white rounded-[12px] px-4 py-2.5 outline-none font-bold text-sm"
              placeholder="e.g. +91..."
            />
          </div>
          <button
            onClick={handleAdd}
            className="bg-slate-900 hover:bg-amber-600 text-white font-black py-3.5 rounded-[14px] flex items-center gap-2 justify-center transition cursor-pointer active:scale-95 text-xs uppercase tracking-wider shadow shadow-slate-900/10"
          >
            <Plus className="w-4 h-4" /> Log Warden
          </button>
        </div>
      )}

      {/* ZERO HORIZONTAL SCROLL SUPPRESSION CONTAINER */}
      <div className="overflow-x-auto no-scrollbar w-full border border-slate-200/60 rounded-2xl">
        <table className="w-full text-left border-collapse min-w-[680px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="py-4 px-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Authority Name</th>
              <th className="py-4 px-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Rank Profile</th>
              <th className="py-4 px-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Hotline / Phone</th>
              {isEdit && <th className="py-4 px-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Control</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={isEdit ? 4 : 3} className="py-8 text-center italic text-slate-400 text-sm font-medium">No active wardens currently mapped in ledger.</td>
              </tr>
            ) : (
              data.map((w: any, i: number) => (
                <tr key={w.id || i} className="hover:bg-slate-50/50 transition-colors duration-300">
                  <td className="py-4 px-5 font-bold text-slate-900 text-[15px]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-[14px] bg-indigo-50 border border-indigo-100/50 text-indigo-600 grid place-items-center font-black text-xs shrink-0 shadow-sm">
                        {w.name?.[0]?.toUpperCase() || "?"}
                      </div>
                      {isEdit ? (
                        <InlineCellEdit
                          val={w.name}
                          onCommit={async (newVal: string) => {
                            await updatePerson({ data: { ...w, name: newVal } });
                            onRefetch();
                          }}
                        />
                      ) : w.name}
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    {isEdit ? (
                      <InlineCellEdit
                        val={w.designation}
                        onCommit={async (newVal: string) => {
                          await updatePerson({ data: { ...w, designation: newVal } });
                          onRefetch();
                        }}
                      />
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-[10px] text-xs font-bold bg-slate-100/80 border border-slate-200/50 text-slate-600">
                        {w.designation}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-5">
                    {isEdit ? (
                      <InlineCellEdit
                        val={w.phone || ""}
                        onCommit={async (newVal: string) => {
                          await updatePerson({ data: { ...w, phone: newVal } });
                          onRefetch();
                        }}
                      />
                    ) : w.phone ? (
                      <a href={`tel:${w.phone}`} className="inline-flex items-center gap-2 text-sm font-black text-[oklch(0.42_0.18_265)] hover:underline transition-all">
                        <div className="w-7 h-7 rounded-full bg-indigo-50 hover:bg-indigo-100 flex items-center justify-center transition">
                          <Phone className="w-3 h-3" />
                        </div>
                        {w.phone}
                      </a>
                    ) : (
                      <span className="text-slate-300 italic text-xs font-semibold">N/A</span>
                    )}
                  </td>
                  {isEdit && (
                    <td className="py-4 px-5">
                      <button onClick={() => handleDelete(w.id)} className="text-slate-300 hover:text-rose-600 hover:bg-rose-50 w-9 h-9 rounded-full grid place-items-center transition duration-300 cursor-pointer active:scale-90">
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StaffTableEditable({ data, isEdit, onRefetch }: any) {
  const [newForm, setNewForm] = useState({ name: "", role: "Supporting Staff" });

  async function handleDelete(id: number) {
    const tId = toast.loading("Removing personnel ledger file...");
    try {
      await deletePerson({ data: { id } });
      toast.success("Purged from ledger!", { id: tId });
      onRefetch();
    } catch {
      toast.error("Failed.", { id: tId });
    }
  }

  async function handleAdd() {
    if (!newForm.name.trim()) return;
    const tId = toast.loading("Logging supporting staff file...");
    try {
      await addPerson({
        data: {
          roleType: "staff",
          hostelType: "office",
          name: newForm.name,
          role: newForm.role,
        },
      });
      toast.success("Staff logged successfully!", { id: tId });
      setNewForm({ name: "", role: "Supporting Staff" });
      onRefetch();
    } catch {
      toast.error("Store failure.", { id: tId });
    }
  }

  return (
    <div className="space-y-6 w-full max-w-full">
      {isEdit && (
        <div className="bg-amber-50/80 border-2 border-amber-200 p-5 rounded-[24px] grid grid-cols-1 sm:grid-cols-3 gap-4 items-end shadow-inner animate-[fade-in_0.15s]">
          <div className="space-y-1 flex-1">
            <label className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Staff Full Name</label>
            <input
              type="text"
              value={newForm.name}
              onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
              className="w-full border-2 border-amber-200 bg-white rounded-[12px] px-4 py-2.5 outline-none font-semibold text-sm"
            />
          </div>
          <div className="space-y-1 flex-1">
            <label className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Position Role</label>
            <input
              type="text"
              value={newForm.role}
              onChange={(e) => setNewForm({ ...newForm, role: e.target.value })}
              className="w-full border-2 border-amber-200 bg-white rounded-[12px] px-4 py-2.5 outline-none font-semibold text-sm"
            />
          </div>
          <button
            onClick={handleAdd}
            className="bg-slate-900 hover:bg-amber-600 text-white font-black py-3.5 rounded-[14px] flex items-center gap-2 justify-center transition cursor-pointer active:scale-95 text-xs uppercase tracking-wider shadow"
          >
            <Plus className="w-4 h-4" /> Enroll Staff
          </button>
        </div>
      )}

      <div className="overflow-x-auto no-scrollbar w-full border border-slate-200/60 rounded-2xl">
        <table className="w-full text-left border-collapse min-w-[580px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="py-4 px-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Personnel Name</th>
              <th className="py-4 px-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Assigned Duty</th>
              {isEdit && <th className="py-4 px-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={isEdit ? 3 : 2} className="py-8 text-center italic text-slate-400 text-sm font-medium">No supporting staff registered in ledger.</td>
              </tr>
            ) : (
              data.map((s: any, i: number) => (
                <tr key={s.id || i} className="hover:bg-slate-50/50 transition duration-300">
                  <td className="py-4 px-5 font-bold text-slate-900 text-[15px]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-[14px] bg-emerald-50 border border-emerald-100/50 text-emerald-600 grid place-items-center font-black text-xs shrink-0 shadow-sm">
                        {s.name?.[0]?.toUpperCase() || "?"}
                      </div>
                      {isEdit ? (
                        <InlineCellEdit
                          val={s.name}
                          onCommit={async (newVal: string) => {
                            await updatePerson({ data: { ...s, name: newVal } });
                            onRefetch();
                          }}
                        />
                      ) : s.name}
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    {isEdit ? (
                      <InlineCellEdit
                        val={s.role}
                        onCommit={async (newVal: string) => {
                          await updatePerson({ data: { ...s, role: newVal } });
                          onRefetch();
                        }}
                      />
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-[10px] text-xs font-bold bg-slate-100/80 border border-slate-200/50 text-slate-600">
                        {s.role}
                      </span>
                    )}
                  </td>
                  {isEdit && (
                    <td className="py-4 px-5">
                      <button onClick={() => handleDelete(s.id)} className="text-slate-300 hover:text-rose-600 hover:bg-rose-50 w-9 h-9 rounded-full grid place-items-center transition duration-300 cursor-pointer active:scale-90">
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BlocksManagerEditable({ blocks, type, isEdit, onRefetch }: any) {
  const [addingBlock, setAddingBlock] = useState(false);
  const [form, setForm] = useState({ title: "New Inhabitant Block", rooms: 80, diningHall: 1, kitchen: 1 });

  async function handleCreate() {
    if (!form.title.trim()) return;
    const tId = toast.loading("Constructing block specs...");
    try {
      await addStructure({
        data: {
          type,
          category: "block",
          ...form,
        },
      });
      toast.success("Physical block registered!", { id: tId });
      setAddingBlock(false);
      onRefetch();
    } catch {
      toast.error("Fail.", { id: tId });
    }
  }

  async function handleUpdate(updated: any) {
    const tId = toast.loading("Updating block ledger...");
    try {
      await updateStructure({ data: updated });
      toast.success("Metrics synchronized!", { id: tId });
      onRefetch();
    } catch {
      toast.error("Sync fail.", { id: tId });
    }
  }

  async function handleDelete(id: number) {
    const tId = toast.loading("Purging block ledger entry...");
    try {
      await deleteStructure({ data: { id } });
      toast.success("Block record purged!", { id: tId });
      onRefetch();
    } catch {
      toast.error("Failed.", { id: tId });
    }
  }

  return (
    <div className="space-y-8 w-full max-w-full">
      {isEdit && (
        <div className="bg-amber-50 border-2 border-dashed border-amber-300 rounded-[28px] p-6 flex flex-col gap-4 duration-300 shadow-inner">
          {!addingBlock ? (
            <button
              onClick={() => setAddingBlock(true)}
              className="w-full py-4 flex items-center gap-2 justify-center bg-amber-500 hover:bg-amber-600 text-amber-950 font-black rounded-[18px] uppercase text-xs tracking-widest shadow cursor-pointer transition active:scale-[0.99]"
            >
              <Plus className="w-4.5 h-4.5" /> Construct New Spatial Block
            </button>
          ) : (
            <div className="space-y-5 animate-[fade-in_0.15s] w-full">
              <div className="flex items-center gap-2 pb-2 border-b border-amber-200/60">
                <h4 className="text-xs font-black uppercase tracking-widest text-amber-950">Construct spatial physical block</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-amber-800">Block Identifier</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border-2 border-amber-200 bg-white rounded-[12px] px-3 py-2 outline-none text-sm font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-amber-800">Total Rooms</label>
                  <input type="number" value={form.rooms} onChange={(e) => setForm({ ...form, rooms: Number(e.target.value) })} className="w-full border-2 border-amber-200 bg-white rounded-[12px] px-3 py-2 outline-none text-sm font-bold text-center" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-amber-800">Dining Halls</label>
                  <input type="number" value={form.diningHall} onChange={(e) => setForm({ ...form, diningHall: Number(e.target.value) })} className="w-full border-2 border-amber-200 bg-white rounded-[12px] px-3 py-2 outline-none text-sm font-bold text-center" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-amber-800">Kitchens Available</label>
                  <input type="number" value={form.kitchen} onChange={(e) => setForm({ ...form, kitchen: Number(e.target.value) })} className="w-full border-2 border-amber-200 bg-white rounded-[12px] px-3 py-2 outline-none text-sm font-bold text-center" />
                </div>
              </div>
              <div className="flex justify-end gap-2.5 pt-2">
                <button onClick={() => setAddingBlock(false)} className="text-slate-500 hover:bg-slate-200/40 font-black px-5 py-2 rounded-lg text-xs uppercase tracking-wider transition cursor-pointer">Cancel</button>
                <button onClick={handleCreate} className="bg-slate-900 hover:bg-amber-600 text-white font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-widest transition cursor-pointer shadow">Construct</button>
              </div>
            </div>
          )}
        </div>
      )}

      {blocks.length === 0 && !isEdit ? (
        <div className="p-12 text-center bg-white border border-dashed border-slate-200 rounded-[32px]">
          <p className="italic text-slate-400 font-medium">No inhabiting physical blocks mapped yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:gap-8">
          {blocks.map((b: any) => (
            <Card
              key={b.id}
              title={isEdit ? undefined : b.title}
              icon={type === "girls" ? Home : Tent}
              className={isEdit ? "ring-4 ring-amber-500/10 border-2 border-amber-200 bg-amber-50/10 duration-200 shadow-xl scale-[1.01]" : "hover:-translate-y-1.5 duration-200 shadow-[0_10px_35px_rgba(0,0,0,0.04)]"}
            >
              {isEdit ? (
                <div className="space-y-6 animate-[fade-in_0.15s_ease-out] w-full">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-amber-200/60 pb-4 gap-4">
                    <div className="flex-1 w-full sm:max-w-lg">
                      <label className="text-[10px] font-black text-amber-800 uppercase tracking-[0.15em]">Rename Block Entity (Press Enter)</label>
                      <input
                        defaultValue={b.title}
                        className="w-full font-display font-black text-xl sm:text-2xl outline-none bg-amber-50/50 border-b-2 border-dashed border-amber-300 text-amber-950 focus:border-solid focus:border-amber-500 py-1.5 transition-all mt-1"
                        onKeyDown={async (e: any) => {
                          if (e.key === "Enter" && e.target.value.trim()) {
                            await handleUpdate({ ...b, title: e.target.value });
                            e.target.blur();
                          }
                        }}
                      />
                    </div>
                    <button onClick={() => handleDelete(b.id)} className="bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white w-10 h-10 rounded-xl grid place-items-center transition duration-300 cursor-pointer active:scale-90 shrink-0">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 sm:gap-6">
                    <div className="bg-white border-2 border-amber-200 rounded-[20px] p-4 flex flex-col items-center shadow-sm duration-300 focus-within:border-amber-500">
                      <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest flex items-center gap-1"><Building className="w-3 h-3" /> Rooms</span>
                      <input
                        type="number"
                        defaultValue={b.rooms}
                        className="font-black text-slate-800 text-center text-xl w-full outline-none mt-2"
                        onBlur={async (e) => {
                          const val = Number(e.target.value);
                          if (val !== b.rooms) {
                            await handleUpdate({ ...b, rooms: val });
                          }
                        }}
                      />
                    </div>
                    <div className="bg-white border-2 border-amber-200 rounded-[20px] p-4 flex flex-col items-center shadow-sm duration-300 focus-within:border-amber-500">
                      <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest flex items-center gap-1"><Utensils className="w-3 h-3" /> Dining</span>
                      <input
                        type="number"
                        defaultValue={b.diningHall}
                        className="font-black text-slate-800 text-center text-xl w-full outline-none mt-2"
                        onBlur={async (e) => {
                          const val = Number(e.target.value);
                          if (val !== b.diningHall) {
                            await handleUpdate({ ...b, diningHall: val });
                          }
                        }}
                      />
                    </div>
                    <div className="bg-white border-2 border-amber-200 rounded-[20px] p-4 flex flex-col items-center shadow-sm duration-300 focus-within:border-amber-500">
                      <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest flex items-center gap-1"><Coffee className="w-3 h-3" /> Kitchen</span>
                      <input
                        type="number"
                        defaultValue={b.kitchen}
                        className="font-black text-slate-800 text-center text-xl w-full outline-none mt-2"
                        onBlur={async (e) => {
                          const val = Number(e.target.value);
                          if (val !== b.kitchen) {
                            await handleUpdate({ ...b, kitchen: val });
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-1 text-[10px] italic text-amber-700/70 font-bold">
                    <RefreshCw className="w-2.5 h-2.5 animate-[spin_4s_linear_infinite]" /> Metrics auto-save on blur
                  </div>
                </div>
              ) : (
                <BlockInfo block={b} />
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function FacilitiesManagerEditable({ facilities, type, isEdit, onRefetch }: any) {
  const [newFac, setNewFac] = useState("");

  async function handleAdd() {
    if (!newFac.trim()) return;
    const tId = toast.loading("Registering facility spec...");
    try {
      await addStructure({
        data: {
          type,
          category: "facility",
          name: newFac,
        },
      });
      toast.success("Facility logged!", { id: tId });
      setNewFac("");
      onRefetch();
    } catch {
      toast.error("Store fail.", { id: tId });
    }
  }

  async function handleDelete(id: number) {
    const tId = toast.loading("Purging amenity spec...");
    try {
      await deleteStructure({ data: { id } });
      toast.success("Facility deregistered!", { id: tId });
      onRefetch();
    } catch {
      toast.error("Wipe failed.", { id: tId });
    }
  }

  return (
    <div className="space-y-6 w-full">
      {isEdit && (
        <div className="flex gap-2.5 max-w-md bg-amber-50/80 border-2 border-amber-200 rounded-[18px] p-3 shadow-inner animate-[fade-in_0.3s]">
          <input
            type="text"
            placeholder="Add amenity (e.g. Wifi, Gym)..."
            value={newFac}
            onChange={(e) => setNewFac(e.target.value)}
            className="flex-1 text-sm px-4 py-2.5 border-2 border-amber-200 bg-white rounded-xl outline-none font-bold focus:border-amber-500"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <button onClick={handleAdd} className="bg-slate-900 hover:bg-amber-600 text-white font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-widest cursor-pointer transition shadow active:scale-95">Log</button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
        {facilities.length === 0 ? (
          <p className="col-span-3 italic text-slate-400 font-medium text-sm pt-2">No specified facilities mapped for these dorms.</p>
        ) : (
          facilities.map((f: any, i: number) => (
            <div
              key={f.id || i}
              className={`flex items-center justify-between gap-3 border rounded-2xl px-4 py-4 transition-all duration-500 ${isEdit
                  ? "bg-amber-50/40 border-amber-200 shadow-sm"
                  : "bg-slate-50/80 border-slate-100 hover:bg-white hover:border-slate-200 hover:shadow-[0_10px_25px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 group"
                }`}
            >
              <div className="flex items-center gap-3 shrink-0 min-w-0">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition shrink-0 ${isEdit ? "bg-amber-100 text-amber-700" : "bg-white border border-slate-200/60 text-[oklch(0.42_0.18_265)] group-hover:scale-110"}`}>
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-[15px] font-bold text-slate-700 truncate">{f.name}</span>
              </div>

              {isEdit && (
                <button onClick={() => handleDelete(f.id)} className="w-7 h-7 rounded-full bg-amber-100/60 hover:bg-rose-600 text-amber-800 hover:text-white flex items-center justify-center transition duration-300 cursor-pointer shrink-0 active:scale-90 shadow-sm border border-amber-200/40">
                  <X className="w-3.5 h-3.5 font-black" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function BlockInfo({ block }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full animate-[fade-in_0.15s]">
      <div className="flex items-center gap-4 bg-slate-50 border border-slate-200/50 hover:border-slate-200 hover:shadow-sm duration-300 px-5 py-4.5 rounded-2xl">
        <div className="w-11 h-11 rounded-[15px] bg-white border border-slate-200 flex items-center justify-center text-[oklch(0.42_0.18_265)] shadow-sm shrink-0">
          <Building className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Total Rooms</p>
          <p className="text-lg font-black text-slate-900">{block.rooms || "-"}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-slate-50 border border-slate-200/50 hover:border-slate-200 hover:shadow-sm duration-300 px-5 py-4.5 rounded-2xl">
        <div className="w-11 h-11 rounded-[15px] bg-white border border-slate-200 flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
          <Utensils className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Dining Suites</p>
          <p className="text-lg font-black text-slate-900">{block.diningHall || "-"}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-slate-50 border border-slate-200/50 hover:border-slate-200 hover:shadow-sm duration-300 px-5 py-4.5 rounded-2xl">
        <div className="w-11 h-11 rounded-[15px] bg-white border border-slate-200 flex items-center justify-center text-amber-600 shadow-sm shrink-0">
          <Coffee className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Culinary Unit</p>
          <p className="text-lg font-black text-slate-900">{block.kitchen || "-"}</p>
        </div>
      </div>
    </div>
  );
}

function HealthCard({ health }: any) {
  return (
    <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center bg-slate-50 border border-slate-200/60 p-6 rounded-3xl shadow-inner">
      <div className="w-12 h-12 rounded-[18px] bg-[oklch(0.42_0.18_265)]/10 grid place-items-center text-[oklch(0.42_0.18_265)] shrink-0 border border-[oklch(0.42_0.18_265)]/10">
        <Activity className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <h4 className="font-black text-slate-900 text-[17px] tracking-tight">{health.name}</h4>
        <p className="text-xs text-slate-500 font-medium">Campus Medical Assistant</p>
      </div>
      <div className="flex items-center gap-2 text-xs font-black text-slate-700 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm tracking-wide uppercase">
        <Clock className="w-4 h-4 text-slate-400 shrink-0" />
        <span>{health.timing}</span>
      </div>
    </div>
  );
}

/* --- MICRO CELL INLINE EDITS --- */
function InlineCellEdit({ val, onCommit }: { val: string; onCommit: (newVal: string) => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  const [localVal, setLocalVal] = useState(val);

  async function handleBlur() {
    setEditing(false);
    if (localVal.trim() !== val) {
      const tId = toast.loading("Commiting cell edit...");
      try {
        await onCommit(localVal.trim());
        toast.success("Updated!", { id: tId });
      } catch {
        toast.error("Failed.", { id: tId });
      }
    }
  }

  if (editing) {
    return (
      <input
        autoFocus
        value={localVal}
        onChange={(e) => setLocalVal(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={(e) => e.key === "Enter" && handleBlur()}
        className="border-2 border-amber-400 bg-white rounded-lg px-2 py-1 text-xs font-black text-amber-950 w-full outline-none shadow shadow-amber-500/10"
      />
    );
  }

  return (
    <span
      onClick={() => setEditing(true)}
      className="border-b-2 border-dashed border-amber-500/40 hover:bg-amber-100/60 hover:border-amber-500/80 px-1.5 py-0.5 rounded cursor-pointer font-bold transition duration-300 text-slate-800 focus:border-solid"
    >
      {val || <span className="text-amber-700/30 italic">[Empty]</span>}
    </span>
  );
}