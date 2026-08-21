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
    <div className="min-h-[80vh] bg-gradient-to-br from-slate-50 via-white to-sky-50/30 flex items-center justify-center p-4 md:p-8">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200/80 max-w-md w-full p-8 md:p-10 shadow-xl shadow-slate-200/40 space-y-6" style={{ animation: "login-entrance 0.6s cubic-bezier(0.22, 1, 0.36, 1) both" }}>
        {/* Logo + Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-2">
            <img
              src="/logo.png"
              alt="JNTU-GV Logo"
              className="h-16 w-16 object-contain rounded-full border border-slate-200 bg-white p-0.5 shadow-md"
            />
          </div>
          <div className="h-14 w-14 bg-blue-50 border border-blue-200 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
            <KeyRound size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Account Settings</h1>
          <p className="text-xs text-slate-500">Update your login email or password.</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl text-xs flex items-start gap-2.5" style={{ animation: "login-entrance 0.3s ease-out both" }}>
            <svg className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

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
                className="login-input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <hr className="border-slate-100" />

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] flex items-center gap-1 ml-1">
              <Mail size={10} /> New Email (optional)
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                placeholder="Leave blank to keep current email"
                className="login-input"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] flex items-center gap-1 ml-1">
              <KeyRound size={10} /> New Password (optional)
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type="password"
                placeholder="Leave blank to keep current password"
                className="login-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {newPassword && (
            <div className="space-y-1.5" style={{ animation: "login-entrance 0.3s ease-out both" }}>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] ml-1">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  className="login-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-sm disabled:opacity-50 transition-all duration-300 shadow-lg shadow-blue-600/15 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/20 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              "Update Credentials"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}