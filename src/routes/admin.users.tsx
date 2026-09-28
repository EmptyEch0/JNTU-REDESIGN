import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAdmin } from "@/context/AdminContext";
import { listAdminsForManagement, createAdminAccount, deleteAdminAccount } from "@/auth/auth.server";
import { setHodPasswordByAdmin } from "@/auth/hodAuth.server";
import { listFacultyLoginsByDept, setFacultyCredentials, createFacultyWithLogin } from "@/lib/facultyAuth";
import { getDepartments } from "@/lib/departments";
import { PageHero } from "@/components/PageHero";
import { getAssetUrl } from "@/lib/assets";
import { toast } from "sonner";
import {
  Building2,
  CheckCircle2,
  GraduationCap,
  KeyRound,
  Mail,
  Search,
  Shield,
  UserCircle2,
  Users,
  UserPlus,
  Plus,
  Trash2,
  X,
  AlertTriangle,
  Lock,
} from "lucide-react";
import {
  PasswordInput,
  PasswordRulesChecklist,
  SettingsField,
  TextInput,
} from "@/components/AccountSettingsLayout";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersPage,
});

type Tab = "admins" | "hod" | "faculty";

function AdminUsersPage() {
  const { isAdmin, role } = useAdmin();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("faculty");
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isAdmin) navigate({ to: "/" });
  }, [isAdmin, navigate]);

  const { data: depts } = useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
    enabled: isAdmin,
  });

  const sortedDepts = useMemo(
    () => (depts || []).slice().sort((a: any, b: any) => a.name.localeCompare(b.name)),
    [depts],
  );

  useEffect(() => {
    if (!selectedDeptId && sortedDepts[0]?.id) {
      setSelectedDeptId(sortedDepts[0].id);
    }
  }, [sortedDepts, selectedDeptId]);

  const isSuperAdmin = role === "super_admin";

  if (!isAdmin) return null;

  const tabs: { id: Tab; label: string; icon: typeof Users; hint: string }[] = [
    { id: "faculty", label: "Faculty Logins", icon: GraduationCap, hint: "Set, add, or reset faculty portal access" },
    { id: "hod", label: "HOD Access", icon: Shield, hint: "Reset department HOD passwords" },
    { id: "admins", label: "Administrators", icon: Users, hint: "Manage & create admin accounts" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sand/60 via-background to-background pb-20">
      <PageHero
        eyebrow="Administration"
        title="User Access"
        subtitle="Manage login credentials for administrators, HODs, and faculty in one place."
      />

      <div className="container-narrow mt-8 md:mt-10 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {tabs.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={cn(
                  "text-left rounded-2xl border p-4 transition-all cursor-pointer",
                  active
                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                    : "bg-card border-border hover:border-primary/30 hover:bg-sand/40",
                )}
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <Icon size={18} />
                  <span className="text-sm font-bold">{item.label}</span>
                </div>
                <p className={cn("text-[11px] leading-relaxed", active ? "text-white/75" : "text-muted-foreground")}>
                  {item.hint}
                </p>
              </button>
            );
          })}
        </div>

        {tab === "admins" && (
          <AdminsPanel
            enabled={isSuperAdmin}
            depts={sortedDepts}
            queryClient={queryClient}
          />
        )}

        {tab === "hod" && (
          <HodPanel
            depts={sortedDepts}
            selectedDeptId={selectedDeptId}
            setSelectedDeptId={setSelectedDeptId}
            enabled={isSuperAdmin}
          />
        )}

        {tab === "faculty" && (
          <FacultyPanel
            depts={sortedDepts}
            selectedDeptId={selectedDeptId}
            setSelectedDeptId={setSelectedDeptId}
            search={search}
            setSearch={setSearch}
            queryClient={queryClient}
          />
        )}
      </div>
    </div>
  );
}

function AdminsPanel({
  enabled,
  depts,
  currentEmail,
  queryClient,
}: {
  enabled: boolean;
  depts: any[];
  currentEmail?: string | null;
  queryClient: ReturnType<typeof useQueryClient>;
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<{ adminId: string; name: string; email: string } | null>(null);

  // Form fields for new admin
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"super_admin" | "department_admin">("department_admin");
  const [authProvider, setAuthProvider] = useState<"email" | "google">("email");
  const [password, setPassword] = useState("");
  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-users-list"],
    queryFn: () => listAdminsForManagement(),
    enabled,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      createAdminAccount({
        data: {
          name,
          email,
          role,
          authProvider,
          password: authProvider === "email" ? password : undefined,
          authorizedDepts: role === "department_admin" ? selectedDepts : [],
        },
      }),
    onSuccess: () => {
      toast.success("Administrator account created successfully!");
      setIsAddModalOpen(false);
      setName("");
      setEmail("");
      setPassword("");
      setSelectedDepts([]);
      queryClient.invalidateQueries({ queryKey: ["admin-users-list"] });
    },
    onError: (err: any) => toast.error(err?.message || "Failed to create administrator."),
  });

  const deleteMutation = useMutation({
    mutationFn: (adminId: string) => deleteAdminAccount({ data: { adminId } }),
    onSuccess: () => {
      toast.success("Administrator removed successfully.");
      setAdminToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["admin-users-list"] });
    },
    onError: (err: any) => toast.error(err?.message || "Failed to remove administrator."),
  });

  const toggleDeptSelection = (slug: string) => {
    setSelectedDepts((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  if (!enabled) {
    return (
      <EmptyGate message="Only super administrators can view and manage administrator accounts." />
    );
  }

  if (isLoading) {
    return <LoadingCard label="Loading administrators…" />;
  }

  if (error) {
    return <EmptyGate message={(error as Error).message || "Failed to load administrators."} />;
  }

  const canSubmit =
    name.trim().length > 0 &&
    email.includes("@") &&
    (authProvider === "google" || password.length >= 12) &&
    !createMutation.isPending;

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-sand/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <UserCircle2 className="text-primary" size={18} />
            <div>
              <h2 className="text-sm font-bold text-ink">Administrator accounts</h2>
              <p className="text-xs text-muted-foreground">{data?.length || 0} registered</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold transition-all shadow-xs cursor-pointer self-start sm:self-auto"
          >
            <UserPlus size={14} />
            <span>+ Add New Admin</span>
          </button>
        </div>

        <div className="divide-y divide-border">
          {(data || []).map((admin) => {
            const isSelf = admin.email.toLowerCase() === (currentEmail || "").toLowerCase();
            return (
              <div key={admin.adminId} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-ink truncate">{admin.name}</p>
                    {isSelf && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate flex items-center gap-1.5 mt-0.5">
                    <Mail size={12} /> {admin.email}
                  </p>
                  {admin.role === "department_admin" && Array.isArray(admin.authorizedDepts) && admin.authorizedDepts.length > 0 && (
                    <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                      <span>Depts:</span>
                      <span className="font-semibold text-slate-700 uppercase">
                        {admin.authorizedDepts.join(", ")}
                      </span>
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/15">
                    {admin.role.replace("_", " ")}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border">
                    {admin.authProvider}
                  </span>

                  {!isSelf && (
                    <button
                      type="button"
                      onClick={() => setAdminToDelete(admin)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer ml-1"
                      title="Delete Administrator"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── ADD NEW ADMIN MODAL ─── */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setIsAddModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-card rounded-3xl p-6 shadow-2xl border border-border space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <UserPlus size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-ink">Add New Administrator</h3>
                    <p className="text-xs text-muted-foreground">Grant access to manage campus portal</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 text-muted-foreground hover:text-ink hover:bg-muted rounded-xl transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (authProvider === "email" && password.length < 12) {
                    toast.error("Password must be at least 12 characters.");
                    return;
                  }
                  createMutation.mutate();
                }}
              >
                <SettingsField label="Full Name" required>
                  <TextInput
                    accent="admin"
                    placeholder="e.g. Dr. M. Sravani"
                    value={name}
                    onChange={setName}
                    required
                  />
                </SettingsField>

                <SettingsField label="Email Address" required>
                  <TextInput
                    accent="admin"
                    type="email"
                    icon={Mail}
                    placeholder="name@jntugv.edu.in"
                    value={email}
                    onChange={setEmail}
                    required
                  />
                </SettingsField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <SettingsField label="Role" required>
                    <select
                      className="w-full rounded-xl border border-border bg-white px-3.5 py-3 text-sm font-medium"
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                    >
                      <option value="department_admin">Department Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </SettingsField>

                  <SettingsField label="Authentication Provider" required>
                    <select
                      className="w-full rounded-xl border border-border bg-white px-3.5 py-3 text-sm font-medium"
                      value={authProvider}
                      onChange={(e) => setAuthProvider(e.target.value as any)}
                    >
                      <option value="email">Email & Password</option>
                      <option value="google">Google Sign-In</option>
                    </select>
                  </SettingsField>
                </div>

                {role === "department_admin" && (
                  <div className="space-y-2 p-3 bg-sand/30 rounded-2xl border border-border">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">
                      Authorized Departments
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {depts.map((d) => (
                        <label
                          key={d.id}
                          className="flex items-center gap-2 p-2 rounded-xl border border-border bg-white text-xs font-semibold cursor-pointer hover:bg-sand/20"
                        >
                          <input
                            type="checkbox"
                            checked={selectedDepts.includes(d.slug || d.id)}
                            onChange={() => toggleDeptSelection(d.slug || d.id)}
                            className="rounded text-primary focus:ring-primary"
                          />
                          <span className="uppercase text-[11px] truncate">{d.slug || d.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {authProvider === "email" && (
                  <>
                    <SettingsField
                      label="Initial Password"
                      required
                      hint="At least 12 chars with upper, lower, number, symbol"
                    >
                      <PasswordInput
                        accent="admin"
                        value={password}
                        onChange={setPassword}
                        required
                        showStrength
                      />
                    </SettingsField>
                    <PasswordRulesChecklist password={password} minLength={12} />
                  </>
                )}

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-xs cursor-pointer disabled:cursor-not-allowed"
                  >
                    {createMutation.isPending ? "Creating…" : "Create Administrator"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── DELETE ADMIN CONFIRMATION MODAL ─── */}
      <AnimatePresence>
        {adminToDelete && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setAdminToDelete(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-5"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    Remove Administrator?
                  </h3>
                  <p className="text-sm text-slate-600">
                    Are you sure you want to delete <span className="font-bold text-slate-900">"{adminToDelete.name}"</span> ({adminToDelete.email})? This user will immediately lose access.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAdminToDelete(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(adminToDelete.adminId)}
                  disabled={deleteMutation.isPending}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-xs cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span>{deleteMutation.isPending ? "Deleting…" : "Yes, Remove"}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HodPanel({
  depts,
  selectedDeptId,
  setSelectedDeptId,
  enabled,
}: {
  depts: any[];
  selectedDeptId: string;
  setSelectedDeptId: (id: string) => void;
  enabled: boolean;
}) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const selected = depts.find((d) => d.id === selectedDeptId);

  const mutation = useMutation({
    mutationFn: () =>
      setHodPasswordByAdmin({ data: { deptId: selectedDeptId, newPassword } }),
    onSuccess: () => {
      toast.success(`HOD password updated for ${selected?.name || "department"}.`);
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (err: any) => toast.error(err?.message || "Failed to update HOD password."),
  });

  if (!enabled) {
    return (
      <EmptyGate message="Only super administrators can reset HOD portal passwords. HODs can change their own password from Account Settings." />
    );
  }

  const canSubmit =
    selectedDeptId &&
    newPassword.length >= 12 &&
    newPassword === confirmPassword &&
    !mutation.isPending;

  return (
    <section className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-border bg-sand/40 flex items-center gap-3">
        <Shield className="text-indigo-700" size={18} />
        <div>
          <h2 className="text-sm font-bold text-ink">Reset HOD portal password</h2>
          <p className="text-xs text-muted-foreground">
            Issues a new department access password for the HOD login portal.
          </p>
        </div>
      </div>

      <form
        className="p-5 md:p-6 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
          }
          mutation.mutate();
        }}
      >
        <SettingsField label="Department" required>
          <select
            className="w-full rounded-xl border border-border bg-white px-3.5 py-3 text-sm"
            value={selectedDeptId}
            onChange={(e) => setSelectedDeptId(e.target.value)}
          >
            {depts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </SettingsField>

        {selected && (
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 px-4 py-3 flex items-center gap-3">
            <Building2 className="text-indigo-700 shrink-0" size={18} />
            <div>
              <p className="text-sm font-bold text-ink">{selected.name}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{selected.slug}</p>
            </div>
          </div>
        )}

        <SettingsField label="New HOD password" required>
          <PasswordInput
            accent="hod"
            value={newPassword}
            onChange={setNewPassword}
            showStrength
            required
          />
        </SettingsField>
        <PasswordRulesChecklist password={newPassword} minLength={12} />
        <SettingsField label="Confirm password" required>
          <PasswordInput
            accent="hod"
            value={confirmPassword}
            onChange={setConfirmPassword}
            required
          />
        </SettingsField>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-sm font-bold disabled:opacity-50 transition-colors"
        >
          {mutation.isPending ? "Saving…" : "Update HOD password"}
        </button>
      </form>
    </section>
  );
}

function FacultyPanel({
  depts,
  selectedDeptId,
  setSelectedDeptId,
  search,
  setSearch,
  queryClient,
}: {
  depts: any[];
  selectedDeptId: string;
  setSelectedDeptId: (id: string) => void;
  search: string;
  setSearch: (v: string) => void;
  queryClient: ReturnType<typeof useQueryClient>;
}) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Add Faculty Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesignation, setNewDesignation] = useState("Assistant Professor");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newDeptId, setNewDeptId] = useState(selectedDeptId || (depts[0]?.id ?? ""));

  const { data: facultyRows, isLoading, error } = useQuery({
    queryKey: ["faculty-logins", selectedDeptId],
    queryFn: () => listFacultyLoginsByDept({ data: { deptId: selectedDeptId } }),
    enabled: !!selectedDeptId,
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return facultyRows || [];
    return (facultyRows || []).filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        (f.email || "").toLowerCase().includes(q) ||
        (f.designation || "").toLowerCase().includes(q),
    );
  }, [facultyRows, search]);

  const mutation = useMutation({
    mutationFn: () =>
      setFacultyCredentials({
        data: { facultyId: editingId!, email, newPassword: password },
      }),
    onSuccess: () => {
      toast.success("Faculty login credentials saved.");
      setEditingId(null);
      setEmail("");
      setPassword("");
      queryClient.invalidateQueries({ queryKey: ["faculty-logins", selectedDeptId] });
    },
    onError: (err: any) => toast.error(err?.message || "Failed to save credentials."),
  });

  const createFacultyMutation = useMutation({
    mutationFn: () =>
      createFacultyWithLogin({
        data: {
          deptId: newDeptId || selectedDeptId,
          name: newName.trim(),
          designation: newDesignation.trim() || "Assistant Professor",
          email: newEmail.trim().toLowerCase(),
          password: newPassword,
        },
      }),
    onSuccess: () => {
      toast.success("Faculty member created successfully!");
      setIsAddModalOpen(false);
      setNewName("");
      setNewDesignation("Assistant Professor");
      setNewEmail("");
      setNewPassword("");
      queryClient.invalidateQueries({ queryKey: ["faculty-logins", selectedDeptId] });
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
    onError: (err: any) => toast.error(err?.message || "Failed to create faculty member."),
  });

  const startEdit = (row: { id: number; email: string | null }) => {
    setEditingId(row.id);
    setEmail(row.email || "");
    setPassword("");
  };

  const openAddModal = () => {
    setNewDeptId(selectedDeptId || (depts[0]?.id ?? ""));
    setNewName("");
    setNewDesignation("Assistant Professor");
    setNewEmail("");
    setNewPassword("");
    setIsAddModalOpen(true);
  };

  const canSubmitNewFaculty =
    newName.trim().length > 0 &&
    newEmail.includes("@") &&
    newPassword.length >= 8 &&
    !createFacultyMutation.isPending;

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-border bg-card shadow-sm p-5 md:p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-end">
          <div className="flex-1 space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600">
              Department
            </label>
            <select
              className="w-full rounded-xl border border-border bg-white px-3.5 py-3 text-sm"
              value={selectedDeptId}
              onChange={(e) => {
                setSelectedDeptId(e.target.value);
                setEditingId(null);
              }}
            >
              {depts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600">
              Search faculty
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                className="w-full rounded-xl border border-border bg-white pl-10 pr-3.5 py-3 text-sm"
                placeholder="Name, email, or designation"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-bold shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <UserPlus size={16} />
            <span>Add New Faculty</span>
          </button>
        </div>
      </section>

      {isLoading && <LoadingCard label="Loading faculty logins…" />}
      {error && <EmptyGate message={(error as Error).message || "Failed to load faculty."} />}

      {!isLoading && !error && (
        <section className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-sand/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <GraduationCap className="text-teal-700" size={18} />
              <div>
                <h2 className="text-sm font-bold text-ink">Faculty portal access</h2>
                <p className="text-xs text-muted-foreground">
                  {filtered.length} member{filtered.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex sm:hidden items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <Plus size={14} />
              <span>Add</span>
            </button>
          </div>

          {filtered.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-muted-foreground space-y-3">
              <p>No faculty found for this department.</p>
              <button
                type="button"
                onClick={openAddModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-bold hover:bg-teal-800 transition-colors cursor-pointer"
              >
                <UserPlus size={14} />
                <span>Add First Faculty Member</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((row) => {
                const isEditing = editingId === row.id;
                return (
                  <div key={row.id} className="px-5 py-4 space-y-4">
                    <div className="flex items-start gap-3 justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={
                            getAssetUrl(row.photo_url) ||
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                          }
                          alt=""
                          className="h-11 w-11 rounded-full object-cover bg-muted shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-ink truncate">{row.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {row.designation || "Faculty"}
                            {row.email ? ` · ${row.email}` : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {row.hasLogin ? (
                          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full">
                            <CheckCircle2 size={12} /> Active
                          </span>
                        ) : (
                          <span className="hidden sm:inline-flex text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-100 px-2 py-1 rounded-full">
                            No login
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => (isEditing ? setEditingId(null) : startEdit(row))}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:bg-primary/5 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          <KeyRound size={13} />
                          {isEditing ? "Cancel" : row.hasLogin ? "Reset" : "Set login"}
                        </button>
                      </div>
                    </div>

                    {isEditing && (
                      <form
                        className="rounded-2xl border border-border bg-sand/30 p-4 space-y-3"
                        onSubmit={(e) => {
                          e.preventDefault();
                          mutation.mutate();
                        }}
                      >
                        <SettingsField label="Login email" required>
                          <TextInput
                            accent="faculty"
                            type="email"
                            icon={Mail}
                            value={email}
                            onChange={setEmail}
                            required
                            placeholder="name@jntugv.edu.in"
                          />
                        </SettingsField>
                        <SettingsField label="Temporary password" required hint="Share this with the faculty member so they can sign in and change it.">
                          <PasswordInput
                            accent="faculty"
                            value={password}
                            onChange={setPassword}
                            required
                            showStrength
                          />
                        </SettingsField>
                        <button
                          type="submit"
                          disabled={mutation.isPending || password.length < 8}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-bold disabled:opacity-50 cursor-pointer"
                        >
                          {mutation.isPending ? "Saving…" : "Save credentials"}
                        </button>
                      </form>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ─── ADD NEW FACULTY MODAL ─── */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setIsAddModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-card rounded-3xl p-6 shadow-2xl border border-border space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-700 flex items-center justify-center">
                    <UserPlus size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-ink">Add New Faculty Member</h3>
                    <p className="text-xs text-muted-foreground">
                      Create a faculty profile with portal credentials
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 text-muted-foreground hover:text-ink hover:bg-muted rounded-xl transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newPassword.length < 8) {
                    toast.error("Password must be at least 8 characters.");
                    return;
                  }
                  createFacultyMutation.mutate();
                }}
              >
                <SettingsField label="Department" required>
                  <select
                    className="w-full rounded-xl border border-border bg-white px-3.5 py-3 text-sm font-medium"
                    value={newDeptId}
                    onChange={(e) => setNewDeptId(e.target.value)}
                  >
                    {depts.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </SettingsField>

                <SettingsField label="Faculty Full Name" required>
                  <TextInput
                    accent="faculty"
                    placeholder="e.g. Dr. K. Venkatesh"
                    value={newName}
                    onChange={setNewName}
                    required
                  />
                </SettingsField>

                <SettingsField label="Designation" required>
                  <select
                    className="w-full rounded-xl border border-border bg-white px-3.5 py-3 text-sm font-medium"
                    value={newDesignation}
                    onChange={(e) => setNewDesignation(e.target.value)}
                  >
                    <option value="Professor">Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Assistant Professor (Ad-hoc)">Assistant Professor (Ad-hoc)</option>
                    <option value="Academic Consultant">Academic Consultant</option>
                    <option value="Teaching Assistant">Teaching Assistant</option>
                    <option value="Adjunct Faculty">Adjunct Faculty</option>
                  </select>
                </SettingsField>

                <SettingsField label="Institutional Login Email" required>
                  <TextInput
                    accent="faculty"
                    type="email"
                    icon={Mail}
                    placeholder="faculty.name@jntugv.edu.in"
                    value={newEmail}
                    onChange={setNewEmail}
                    required
                  />
                </SettingsField>

                <SettingsField
                  label="Initial Temporary Password"
                  required
                  hint="Faculty member will use this to sign in and can change it later."
                >
                  <PasswordInput
                    accent="faculty"
                    value={newPassword}
                    onChange={setNewPassword}
                    required
                    showStrength
                  />
                </SettingsField>
                <PasswordRulesChecklist password={newPassword} minLength={8} />

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!canSubmitNewFaculty}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 transition-colors shadow-xs cursor-pointer disabled:cursor-not-allowed"
                  >
                    {createFacultyMutation.isPending ? "Creating Faculty…" : "Create Faculty Member"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyGate({ message }: { message: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground shadow-sm">
      {message}
    </div>
  );
}

function LoadingCard({ label }: { label: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground shadow-sm">
      {label}
    </div>
  );
}
