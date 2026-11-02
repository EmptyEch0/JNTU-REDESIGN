import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAllLeadershipProfiles,
  getAllFacultyRoster,
  saveLeadershipProfile,
  deleteLeadershipProfile,
  type LeadershipProfileItem,
  type SaveLeadershipInput,
} from "@/funcs/leadership";
import { getAssetUrl } from "@/lib/assets";
import { AdminUpload } from "@/components/AdminEditPanel";
import {
  Users,
  Shield,
  Award,
  GraduationCap,
  Briefcase,
  Building2,
  Mail,
  Phone,
  Save,
  Trash2,
  Plus,
  Search,
  Check,
  RefreshCw,
  ArrowRightLeft,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  X,
  UserCheck,
} from "lucide-react";

interface EditableProfileState {
  [slug: string]: {
    name: string;
    designation: string;
    image: string;
    email: string;
    phone: string;
    quote: string;
    message: string;
    isInCharge: boolean;
    category: string;
    department: string;
    deptSlug: string;
    facultyId: number | null;
    isDirty: boolean;
  };
}

export function LeadershipManagementPanel() {
  const queryClient = useQueryClient();

  const {
    data: profiles = [],
    isLoading: isProfilesLoading,
    refetch: refetchProfiles,
  } = useQuery({
    queryKey: ["all-leadership-profiles"],
    queryFn: () => getAllLeadershipProfiles(),
  });

  const { data: facultyRoster = [], isLoading: isFacultyLoading } = useQuery({
    queryKey: ["leadership-faculty-roster"],
    queryFn: () => getAllFacultyRoster(),
  });

  // Local form state for all profiles
  const [formState, setFormState] = useState<EditableProfileState>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "university" | "administration" | "tpo" | "hod" | "custom"
  >("all");

  // Add custom role modal state
  const [isAddingCustomRole, setIsAddingCustomRole] = useState(false);
  const [newRoleData, setNewRoleData] = useState({
    title: "",
    name: "",
    designation: "",
    category: "administration",
    department: "",
    image: "",
    email: "",
    phone: "",
    quote: "",
    message: "",
    isInCharge: false,
  });

  // Track single role saving state
  const [savingSlugs, setSavingSlugs] = useState<Record<string, boolean>>({});

  // Sync loaded profiles into form state
  React.useEffect(() => {
    if (profiles.length > 0) {
      setFormState((prev) => {
        const next: EditableProfileState = { ...prev };
        for (const p of profiles) {
          // If already edited and dirty, keep dirty state unless not yet initialized
          if (!next[p.slug]) {
            const extras = (p.extras as any) || {};
            next[p.slug] = {
              name: p.name || "",
              designation: p.designation || "",
              image: p.image || "",
              email: p.email || "",
              phone: extras.phone || "",
              quote: p.quote || "",
              message: p.message || "",
              isInCharge: Boolean(extras.isInCharge),
              category: extras.category || (p.slug.startsWith("hod_") ? "hod" : "administration"),
              department: extras.department || "",
              deptSlug: extras.deptSlug || (p.slug.startsWith("hod_") ? p.slug.replace("hod_", "") : ""),
              facultyId: extras.facultyId || null,
              isDirty: false,
            };
          }
        }
        return next;
      });
    }
  }, [profiles]);

  const saveMutation = useMutation({
    mutationFn: (input: SaveLeadershipInput) => saveLeadershipProfile({ data: input }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["all-leadership-profiles"] });
      queryClient.invalidateQueries({ queryKey: ["leadership"] });
      queryClient.invalidateQueries({ queryKey: ["tpo"] });
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["department"] });

      setFormState((prev) => ({
        ...prev,
        [variables.slug]: {
          ...prev[variables.slug],
          isDirty: false,
        },
      }));

      setSavingSlugs((prev) => ({ ...prev, [variables.slug]: false }));
      toast.success(`Leadership profile '${variables.slug}' saved & synced!`);
    },
    onError: (err, variables) => {
      setSavingSlugs((prev) => ({ ...prev, [variables.slug]: false }));
      toast.error(`Failed to save: ${err.message || "Unknown error"}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (slug: string) => deleteLeadershipProfile({ data: { slug } }),
    onSuccess: (_, deletedSlug) => {
      queryClient.invalidateQueries({ queryKey: ["all-leadership-profiles"] });
      queryClient.invalidateQueries({ queryKey: ["leadership"] });
      setFormState((prev) => {
        const next = { ...prev };
        delete next[deletedSlug];
        return next;
      });
      toast.success(`Role '${deletedSlug}' removed successfully.`);
    },
    onError: (err) => {
      toast.error(`Could not delete role: ${err.message || "Unknown error"}`);
    },
  });

  const handleFieldChange = (slug: string, field: string, value: any) => {
    setFormState((prev) => {
      const current = prev[slug] || {
        name: "",
        designation: "",
        image: "",
        email: "",
        phone: "",
        quote: "",
        message: "",
        isInCharge: false,
        category: "administration",
        department: "",
        deptSlug: "",
        facultyId: null,
        isDirty: false,
      };
      return {
        ...prev,
        [slug]: {
          ...current,
          [field]: value,
          isDirty: true,
        },
      };
    });
  };

  // Swapping a leadership position with an existing faculty member
  const handleSwapFromFaculty = (slug: string, facultyId: number) => {
    const selected = facultyRoster.find((f: any) => f.id === facultyId);
    if (!selected) return;

    setFormState((prev) => {
      const current = prev[slug];
      if (!current) return prev;

      // When swapped, update person name, photo (if available), email, and facultyId
      return {
        ...prev,
        [slug]: {
          ...current,
          name: selected.name,
          image: selected.photo_url || current.image,
          email: selected.faculty_email || current.email,
          facultyId: selected.id,
          isDirty: true,
        },
      };
    });

    toast.info(`Swapped '${slug}' with faculty: ${selected.name}`, {
      description: "Click 'Save Role' to publish this change across all public pages.",
    });
  };

  const handleSaveSingleRole = (slug: string) => {
    const data = formState[slug];
    if (!data) return;

    if (!data.name.trim()) {
      toast.error("Person Name cannot be empty.");
      return;
    }

    setSavingSlugs((prev) => ({ ...prev, [slug]: true }));

    saveMutation.mutate({
      slug,
      name: data.name,
      designation: data.designation,
      image: data.image,
      email: data.email,
      phone: data.phone,
      quote: data.quote,
      message: data.message,
      isInCharge: data.isInCharge,
      category: data.category,
      department: data.department,
      deptSlug: data.deptSlug,
      facultyId: data.facultyId,
    });
  };

  const handleSaveAll = async () => {
    const dirtySlugs = Object.keys(formState).filter((s) => formState[s]?.isDirty);
    if (dirtySlugs.length === 0) {
      toast.info("No unsaved changes detected.");
      return;
    }

    let successCount = 0;
    for (const slug of dirtySlugs) {
      const data = formState[slug];
      if (!data) continue;
      try {
        await saveLeadershipProfile({
          data: {
            slug,
            name: data.name,
            designation: data.designation,
            image: data.image,
            email: data.email,
            phone: data.phone,
            quote: data.quote,
            message: data.message,
            isInCharge: data.isInCharge,
            category: data.category,
            department: data.department,
            deptSlug: data.deptSlug,
            facultyId: data.facultyId,
          },
        });
        successCount++;
      } catch (e) {
        console.error(`Failed to save ${slug}:`, e);
      }
    }

    queryClient.invalidateQueries({ queryKey: ["all-leadership-profiles"] });
    queryClient.invalidateQueries({ queryKey: ["leadership"] });
    queryClient.invalidateQueries({ queryKey: ["tpo"] });
    queryClient.invalidateQueries({ queryKey: ["departments"] });
    queryClient.invalidateQueries({ queryKey: ["department"] });

    toast.success(`Successfully saved ${successCount} leadership roles!`);
  };

  const handleCreateCustomRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleData.title.trim() || !newRoleData.name.trim()) {
      toast.error("Role title and person name are required.");
      return;
    }

    const generatedSlug = newRoleData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const finalSlug = `custom_${generatedSlug}_${Date.now().toString(36)}`;

    saveMutation.mutate(
      {
        slug: finalSlug,
        name: newRoleData.name,
        designation: newRoleData.designation || newRoleData.title,
        image: newRoleData.image,
        email: newRoleData.email,
        phone: newRoleData.phone,
        quote: newRoleData.quote,
        message: newRoleData.message,
        isInCharge: newRoleData.isInCharge,
        category: "custom",
        department: newRoleData.department,
      },
      {
        onSuccess: () => {
          setIsAddingCustomRole(false);
          setNewRoleData({
            title: "",
            name: "",
            designation: "",
            category: "administration",
            department: "",
            image: "",
            email: "",
            phone: "",
            quote: "",
            message: "",
            isInCharge: false,
          });
          toast.success("New leadership role created successfully!");
        },
      }
    );
  };

  // Filtered profiles
  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      const state = formState[p.slug] || p;
      const extras = (p.extras as any) || {};
      const cat = extras.category || (p.slug.startsWith("hod_") ? "hod" : "administration");

      // Category filter
      if (selectedCategory !== "all") {
        if (selectedCategory === "university" && cat !== "university") return false;
        if (selectedCategory === "administration" && cat !== "administration") return false;
        if (selectedCategory === "tpo" && cat !== "tpo") return false;
        if (selectedCategory === "hod" && cat !== "hod") return false;
        if (selectedCategory === "custom" && cat !== "custom") return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = (state.name || "").toLowerCase().includes(q);
        const desigMatch = (state.designation || "").toLowerCase().includes(q);
        const slugMatch = p.slug.toLowerCase().includes(q);
        const deptMatch = (extras.department || "").toLowerCase().includes(q);
        const emailMatch = (state.email || "").toLowerCase().includes(q);
        if (!nameMatch && !desigMatch && !slugMatch && !deptMatch && !emailMatch) {
          return false;
        }
      }

      return true;
    });
  }, [profiles, formState, selectedCategory, searchQuery]);

  const hasDirtyFields = Object.values(formState).some((s) => s?.isDirty);

  // Grouping helper
  const getRoleBadge = (slug: string, extras: any) => {
    if (slug === "vc") return { label: "UNIVERSITY LEADERSHIP", color: "bg-purple-100 text-purple-800 border-purple-200" };
    if (slug === "registrar") return { label: "UNIVERSITY REGISTRAR", color: "bg-indigo-100 text-indigo-800 border-indigo-200" };
    if (slug === "principal") return { label: "COLLEGE PRINCIPAL", color: "bg-blue-100 text-blue-800 border-blue-200" };
    if (slug === "vice-principal") return { label: "VICE PRINCIPAL", color: "bg-sky-100 text-sky-800 border-sky-200" };
    if (slug === "tpo") return { label: "TRAINING & PLACEMENT", color: "bg-emerald-100 text-emerald-800 border-emerald-200" };
    if (slug.startsWith("hod_")) {
      const deptCode = (extras?.deptSlug || slug.replace("hod_", "")).toUpperCase();
      return { label: `HOD — ${deptCode}`, color: "bg-amber-100 text-amber-800 border-amber-200" };
    }
    return { label: "CUSTOM LEADERSHIP", color: "bg-slate-100 text-slate-800 border-slate-200" };
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 bg-[#0F4C81]/10 dark:bg-sky-500/10 text-[#0F4C81] dark:text-sky-400 rounded-xl">
                <Users className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                  Institutional Leadership Management
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Update Principal, Registrar, VC, TPO, and HODs. Changes immediately sync across the public portal and AI Assistant.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setIsAddingCustomRole(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#0F4C81] hover:bg-[#0F4C81]/90 shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Custom Role
            </button>

            {hasDirtyFields && (
              <button
                onClick={handleSaveAll}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition cursor-pointer animate-pulse"
              >
                <Save className="w-4 h-4" /> Save All Changes
              </button>
            )}

            <button
              onClick={() => refetchProfiles()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition cursor-pointer"
              title="Refresh data"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>
        </div>

        {/* Filter Pills and Search */}
        <div className="pt-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: "all", label: `All Roles (${profiles.length})` },
              { id: "university", label: "University Leadership" },
              { id: "administration", label: "College Administration" },
              { id: "tpo", label: "Placements (TPO)" },
              { id: "hod", label: "Department HODs (9)" },
              { id: "custom", label: "Custom Roles" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-tight whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#0F4C81] text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, role, dept..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-[#0F4C81] transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isProfilesLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-[#0F4C81]" />
          <p className="text-sm font-medium">Loading leadership directory...</p>
        </div>
      ) : filteredProfiles.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">
            No leadership roles found
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or category filter above.
          </p>
        </div>
      ) : (
        /* Profiles Grid */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProfiles.map((p) => {
            const state = formState[p.slug] || {
              name: p.name,
              designation: p.designation,
              image: p.image,
              email: p.email,
              phone: (p.extras as any)?.phone || "",
              quote: p.quote,
              message: p.message,
              isInCharge: Boolean((p.extras as any)?.isInCharge),
              category: (p.extras as any)?.category || "administration",
              department: (p.extras as any)?.department || "",
              deptSlug: (p.extras as any)?.deptSlug || "",
              facultyId: (p.extras as any)?.facultyId || null,
              isDirty: false,
            };

            const extras = (p.extras as any) || {};
            const badge = getRoleBadge(p.slug, extras);
            const isSaving = Boolean(savingSlugs[p.slug]);
            const isProtected = [
              "vc",
              "registrar",
              "principal",
              "vice-principal",
              "tpo",
              "hod_cse",
              "hod_it",
              "hod_ece",
              "hod_eee",
              "hod_mech",
              "hod_met",
              "hod_civil",
              "hod_bshss",
              "hod_mba",
            ].includes(p.slug);

            return (
              <div
                key={p.slug}
                className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-xs transition-all ${
                  state.isDirty
                    ? "border-amber-400/80 ring-2 ring-amber-400/20"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                }`}
              >
                {/* Role Header */}
                <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${badge.color}`}
                      >
                        {badge.label}
                      </span>

                      {/* In-Charge Badge */}
                      {state.isInCharge && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                          (i/c) In-Charge
                        </span>
                      )}

                      {state.isDirty && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          Unsaved Changes
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-semibold text-slate-400 mt-1">
                      Slug: <code className="text-slate-600 dark:text-slate-300">{p.slug}</code>
                      {extras.department ? ` • ${extras.department}` : ""}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleSaveSingleRole(p.slug)}
                      disabled={isSaving}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#0F4C81] hover:bg-[#0F4C81]/90 shadow-2xs transition cursor-pointer disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" /> Save Role
                        </>
                      )}
                    </button>

                    {!isProtected && (
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete role '${p.slug}'?`)) {
                            deleteMutation.mutate(p.slug);
                          }
                        }}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                        title="Delete custom role"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Main Card Body */}
                <div className="pt-4 space-y-4">
                  {/* Photo & Identity Section */}
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    {/* Photo preview */}
                    <div className="w-24 h-28 sm:w-28 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 relative group flex items-center justify-center">
                      {state.image ? (
                        <img
                          src={getAssetUrl(state.image)}
                          alt={state.name}
                          className="w-full h-full object-cover object-top"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              "/images/faculty/default-faculty.jpg";
                          }}
                        />
                      ) : (
                        <div className="text-slate-400 flex flex-col items-center gap-1 text-[10px]">
                          <ImageIcon className="w-6 h-6" />
                          <span>No Photo</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 w-full space-y-3">
                      {/* Swap from Faculty Dropdown */}
                      <div className="bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/50 rounded-xl p-2.5">
                        <label className="text-[11px] font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5 mb-1">
                          <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" />
                          Swap from Existing Faculty Roster:
                        </label>
                        <select
                          value={state.facultyId || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val) handleSwapFromFaculty(p.slug, Number(val));
                          }}
                          className="w-full bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                        >
                          <option value="">-- Choose faculty member to swap ({facultyRoster.length}) --</option>
                          {facultyRoster.map((fac: any) => (
                            <option key={fac.id} value={fac.id}>
                              {fac.name} — {fac.department_name || "CEV"} ({fac.designation || "Faculty"})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Name & In-Charge Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2.5 items-end">
                        <div>
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                            Present Person Name:
                          </label>
                          <input
                            type="text"
                            value={state.name}
                            onChange={(e) => handleFieldChange(p.slug, "name", e.target.value)}
                            placeholder="e.g. Dr. P. Sree Devi"
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-[#0F4C81]"
                          />
                        </div>

                        {/* In-Charge Toggle */}
                        <label className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={state.isInCharge}
                            onChange={(e) => handleFieldChange(p.slug, "isInCharge", e.target.checked)}
                            className="w-4 h-4 rounded text-[#0F4C81] focus:ring-0 cursor-pointer accent-[#0F4C81]"
                          />
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 whitespace-nowrap">
                            In-Charge (i/c)
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Designation & Image URL Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                        Designation / Title:
                      </label>
                      <input
                        type="text"
                        value={state.designation}
                        onChange={(e) => handleFieldChange(p.slug, "designation", e.target.value)}
                        placeholder="e.g. Principal, JNTU-GV CEV"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-white outline-none focus:border-[#0F4C81]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                        Photo URL / Upload:
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={state.image}
                          onChange={(e) => handleFieldChange(p.slug, "image", e.target.value)}
                          placeholder="/images/..."
                          className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-white outline-none focus:border-[#0F4C81]"
                        />
                        <div className="w-8 h-8 shrink-0">
                          <AdminUpload
                            value={state.image}
                            onChange={(url) => handleFieldChange(p.slug, "image", url)}
                            module="administration"
                            category="leadership"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Email & Phone Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                        Official Email:
                      </label>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          value={state.email}
                          onChange={(e) => handleFieldChange(p.slug, "email", e.target.value)}
                          placeholder="official@jntugvcev.edu.in"
                          className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white outline-none focus:border-[#0F4C81]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                        Contact Number / Office:
                      </label>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={state.phone}
                          onChange={(e) => handleFieldChange(p.slug, "phone", e.target.value)}
                          placeholder="e.g. 08922-277388 / 9493759290"
                          className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white outline-none focus:border-[#0F4C81]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quote / Headline */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                      Desk Quote / Headline:
                    </label>
                    <input
                      type="text"
                      value={state.quote}
                      onChange={(e) => handleFieldChange(p.slug, "quote", e.target.value)}
                      placeholder="Empowering students through academic excellence..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-white outline-none focus:border-[#0F4C81]"
                    />
                  </div>

                  {/* Desk Message */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                      Official Desk Message:
                    </label>
                    <textarea
                      rows={3}
                      value={state.message}
                      onChange={(e) => handleFieldChange(p.slug, "message", e.target.value)}
                      placeholder="Welcome message from the desk..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-800 dark:text-white outline-none focus:border-[#0F4C81] resize-y"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Custom Role Modal */}
      {isAddingCustomRole && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#0F4C81]" />
                <h3 className="font-bold text-base text-slate-800 dark:text-white">
                  Add Custom Leadership Role
                </h3>
              </div>
              <button
                onClick={() => setIsAddingCustomRole(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomRole} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Role Title *
                </label>
                <input
                  type="text"
                  required
                  value={newRoleData.title}
                  onChange={(e) => setNewRoleData({ ...newRoleData, title: e.target.value })}
                  placeholder="e.g. Controller of Examinations / Director of R&D"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#0F4C81]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Person Name *
                </label>
                <input
                  type="text"
                  required
                  value={newRoleData.name}
                  onChange={(e) => setNewRoleData({ ...newRoleData, name: e.target.value })}
                  placeholder="e.g. Dr. K. Babulu"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#0F4C81]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={newRoleData.designation}
                    onChange={(e) => setNewRoleData({ ...newRoleData, designation: e.target.value })}
                    placeholder="e.g. Professor & Controller"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#0F4C81]"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer w-full">
                    <input
                      type="checkbox"
                      checked={newRoleData.isInCharge}
                      onChange={(e) => setNewRoleData({ ...newRoleData, isInCharge: e.target.checked })}
                      className="w-4 h-4 rounded text-[#0F4C81] accent-[#0F4C81] cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      In-Charge (i/c)
                    </span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newRoleData.email}
                    onChange={(e) => setNewRoleData({ ...newRoleData, email: e.target.value })}
                    placeholder="role@jntugvcev.edu.in"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#0F4C81]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={newRoleData.phone}
                    onChange={(e) => setNewRoleData({ ...newRoleData, phone: e.target.value })}
                    placeholder="e.g. 08922-277388"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#0F4C81]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Photo URL
                </label>
                <input
                  type="text"
                  value={newRoleData.image}
                  onChange={(e) => setNewRoleData({ ...newRoleData, image: e.target.value })}
                  placeholder="/images/faculty/..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#0F4C81]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Desk Message
                </label>
                <textarea
                  rows={2}
                  value={newRoleData.message}
                  onChange={(e) => setNewRoleData({ ...newRoleData, message: e.target.value })}
                  placeholder="Official message or responsibilities..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs outline-none focus:border-[#0F4C81]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddingCustomRole(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#0F4C81] hover:bg-[#0F4C81]/90 shadow-xs transition cursor-pointer disabled:opacity-50"
                >
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

