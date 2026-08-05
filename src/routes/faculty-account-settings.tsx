import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useFaculty } from "@/context/FacultyContext";
import { Lock, Mail, KeyRound } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/faculty-account-settings")({
  component: FacultyAccountSettingsPage,
});

function FacultyAccountSettingsPage() {
  const { isFacultyLoggedIn, changeCredentials } = useFaculty();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isFacultyLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        You must be signed in as faculty to access this page.{" "}
        <button onClick={() => navigate({ to: "/faculty-login" })} className="text-blue-600 underline ml-1">
          Sign in
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (newPassword && newPassword !== confirmPassword) {
      setErrorMsg("New password and confirmation do not match.");
      return;
    }
    if (!newEmail && !newPassword) {
      setErrorMsg("Enter a new email or new password to update.");
      return;
    }

    setLoading(true);
    try {
      await changeCredentials(
        currentPassword,
        newEmail.trim() || undefined,
        newPassword.trim() || undefined
      );
      toast.success("Credentials updated successfully.");
      setCurrentPassword("");
      setNewEmail("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-10 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="h-16 w-16 bg-blue-50 border border-blue-200 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
            <KeyRound size={28} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Account Settings</h1>
          <p className="text-xs text-slate-500">Update your login email or password.</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <Lock size={12} /> Current Password (required)
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <hr className="border-slate-100" />

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <Mail size={12} /> New Email (optional)
            </label>
            <input
              type="email"
              placeholder="Leave blank to keep current email"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <KeyRound size={12} /> New Password (optional)
            </label>
            <input
              type="password"
              placeholder="Leave blank to keep current password"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {newPassword && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Confirm New Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Credentials"}
          </button>
        </form>
      </div>
    </div>
  );
}