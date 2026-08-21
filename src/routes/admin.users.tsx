import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAdmin } from "@/context/AdminContext";
import { listAdminsForManagement } from "@/auth/auth.server";
import { setHodPasswordByAdmin } from "@/auth/hodAuth.server";
import { listFacultyLoginsByDept, setFacultyCredentials } from "@/lib/facultyAuth";
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
} from "lucide-react";
import {
  PasswordInput,
  PasswordRulesChecklist,
  SettingsField,
  TextInput,
} from "@/components/AccountSettingsLayout";
import { cn } from "@/lib/utils";

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
    { id: "faculty", label: "Faculty Logins", icon: GraduationCap, hint: "Set or reset faculty portal access" },
    { id: "hod", label: "HOD Access", icon: Shield, hint: "Reset department HOD passwords" },
    { id: "admins", label: "Administrators", icon: Users, hint: "View admin accounts" },
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
                  "text-left rounded-2xl border p-4 transition-all",
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
          <AdminsPanel enabled={isSuperAdmin} />
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

function AdminsPanel({ enabled }: { enabled: boolean }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-users-list"],
    queryFn: () => listAdminsForManagement(),
    enabled,
  });

  if (!enabled) {
    return (
      <EmptyGate message="Only super administrators can view the admin account directory." />
    );
  }

  if (isLoading) {
    return <LoadingCard label="Loading administrators…" />;
  }

  if (error) {
    return <EmptyGate message={(error as Error).message || "Failed to load administrators."} />;
  }

  return (
    <section className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-border bg-sand/40 flex items-center gap-3">
        <UserCircle2 className="text-primary" size={18} />
        <div>
          <h2 className="text-sm font-bold text-ink">Administrator accounts</h2>
          <p className="text-xs text-muted-foreground">{data?.length || 0} registered</p>
        </div>
      </div>
      <div className="divide-y divide-border">
        {(data || []).map((admin) => (
          <div key={admin.adminId} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-bold text-ink truncate">{admin.name}</p>
              <p className="text-xs text-muted-foreground truncate flex items-center gap-1.5 mt-0.5">
                <Mail size={12} /> {admin.email}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/15">
                {admin.role.replace("_", " ")}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border">
                {admin.authProvider}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
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

  const startEdit = (row: { id: number; email: string | null }) => {
    setEditingId(row.id);
    setEmail(row.email || "");
    setPassword("");
  };

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
          </div>

          {filtered.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-muted-foreground">
              No faculty found for this department.
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
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:bg-primary/5 px-2.5 py-1.5 rounded-lg transition-colors"
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
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-bold disabled:opacity-50"
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
