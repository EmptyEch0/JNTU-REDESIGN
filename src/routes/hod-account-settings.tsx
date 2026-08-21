// Location: src/routes/hod-account-settings.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { changeHodCredentials } from "@/auth/hodAuth.server";
import { toast } from "sonner";
import { ArrowLeft, Lock, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/hod-account-settings")({
  component: HodAccountSettingsPage,
});

function HodAccountSettingsPage() {
  const { hodDeptId } = useAdmin();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }

    setLoading(true);
    try {
      await changeHodCredentials({ data: { currentPassword, newPassword } });
      toast.success("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center p-4 md:p-8">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200/80 max-w-md w-full p-8 md:p-10 shadow-xl shadow-slate-200/40 space-y-6" style={{ animation: "login-entrance 0.6s cubic-bezier(0.22, 1, 0.36, 1) both" }}>
        {hodDeptId && (
          <Link
            to="/departments/$id"
            params={{ id: hodDeptId }}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-700 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
        )}

        {/* Logo + Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-2">
            <img
              src="/logo.png"
              alt="JNTU-GV Logo"
              className="h-16 w-16 object-contain rounded-full border border-slate-200 bg-white p-0.5 shadow-md"
            />
          </div>
          <div className="h-14 w-14 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
            <ShieldCheck size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">HOD Account Settings</h1>
          <p className="text-xs text-slate-500">Change your department access password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] flex items-center gap-1 ml-1">
              <Lock size={10} /> Current Password (required)
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                autoFocus
                className="login-input"
                style={{ ["--tw-ring-color" as any]: "oklch(0.5 0.16 270 / 0.1)" }}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <hr className="border-slate-100" />

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] flex items-center gap-1 ml-1">
              <Lock size={10} /> New Password
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                className="login-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <p className="text-[10px] text-slate-400 ml-1">
              At least 12 characters, with an uppercase letter, a lowercase letter, a digit, and a symbol.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] flex items-center gap-1 ml-1">
              <Lock size={10} /> Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                className="login-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl text-sm disabled:opacity-50 transition-all duration-300 shadow-lg shadow-indigo-600/15 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-600/20 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Lock size={14} /> Update Password
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}