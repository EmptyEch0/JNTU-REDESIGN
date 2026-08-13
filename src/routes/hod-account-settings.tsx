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
    <div className="max-w-md mx-auto py-16 px-4">
      <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm space-y-6">
        {hodDeptId && (
          <Link
            to="/departments/$id"
            params={{ id: hodDeptId }}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
        )}

        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-2xl flex items-center justify-center">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">HOD Account Settings</h2>
            <p className="text-xs text-slate-500">Change your department access password</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Current Password
            </label>
            <input
              type="password"
              required
              autoFocus
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm outline-none focus:border-indigo-500 font-mono transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              New Password
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm outline-none focus:border-indigo-500 font-mono transition-all"
            />
            <p className="text-[10px] text-slate-400">
              At least 12 characters, with an uppercase letter, a lowercase letter, a digit, and a symbol.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm outline-none focus:border-indigo-500 font-mono transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10"
          >
            <Lock size={14} /> {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}