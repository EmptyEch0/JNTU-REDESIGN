// Location: src/routes/hod-login.tsx
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { useQuery } from "@tanstack/react-query";
import { getDepartments } from "@/lib/departments";
import { Lock, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/hod-login")({
  component: HodLoginPage,
});

function HodLoginPage() {
  const [selectedSlug, setSelectedSlug] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginAsHod } = useAdmin();
  const navigate = useNavigate();

  const { data: depts, isLoading: deptsLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });

  const sortedDepts = (depts || []).slice().sort((a: any, b: any) => a.name.localeCompare(b.name));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!selectedSlug) {
      setErrorMsg("Select your department.");
      return;
    }

    const dept = sortedDepts.find((d: any) => d.slug === selectedSlug);
    if (!dept) {
      setErrorMsg("Invalid credentials.");
      return;
    }

    setLoading(true);
    try {
      const success = await loginAsHod(dept.id, dept.slug, password);
      if (success) {
        navigate({ to: "/departments/$id", params: { id: dept.slug } });
      } else {
        // Deliberately generic — don't reveal whether the department or
        // the password was wrong, so this can't be used to enumerate
        // valid department slugs.
        setErrorMsg("Invalid credentials.");
      }
    } catch (err: any) {
      setErrorMsg("Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-10 shadow-xl space-y-6 text-center">
        <div className="h-16 w-16 bg-blue-50 border border-blue-200 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
          <ShieldAlert size={28} />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">HOD Sign In</h1>
          <p className="text-xs text-slate-500 mt-2">
            Head of Department access only.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Department
            </label>
            <select
              required
              disabled={deptsLoading || loading}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
            >
              <option value="" disabled>
                {deptsLoading ? "Loading..." : "Select your department"}
              </option>
              {sortedDepts.map((d: any) => (
                <option key={d.slug} value={d.slug}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              HOD Password
            </label>
            <input
              type="password"
              required
              autoFocus
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || deptsLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}