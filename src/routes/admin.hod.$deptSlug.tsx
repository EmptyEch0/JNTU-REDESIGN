import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { useQuery } from "@tanstack/react-query";
import { getDepartments } from "@/lib/departments";
import { Lock, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/admin/hod/$deptSlug")({
  component: HodLoginPage,
});

function HodLoginPage() {
  const { deptSlug } = useParams({ from: "/admin/hod/$deptSlug" });
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginAsHod } = useAdmin();
  const navigate = useNavigate();

  const { data: depts, isLoading: deptsLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });

  const dept = depts?.find((d: any) => d.slug === deptSlug);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dept) {
      setErrorMsg("Department not found.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    try {
        const success = await loginAsHod(dept.id, dept.slug, password);
      if (success) {
        navigate({ to: "/departments/$id", params: { id: deptSlug } });
      } else {
        setErrorMsg("Invalid HOD credentials.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid HOD credentials.");
    } finally {
      setLoading(false);
    }
  };

  if (deptsLoading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading...</div>;
  }

  if (!dept) {
    return (
      <div className="min-h-screen flex items-center justify-center text-rose-600 font-bold">
        Department "{deptSlug}" not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-10 shadow-xl space-y-6 text-center">
        <div className="h-16 w-16 bg-blue-50 border border-blue-200 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
          <ShieldAlert size={28} />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">HOD Sign In</h1>
          <p className="text-xs text-slate-500 mt-2">
            Department of {dept.name} — Head of Department access only.
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
            disabled={loading}
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