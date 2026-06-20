import { useState } from "react";
import { verifyDepartmentAccess } from "@/lib/departments";
import { useAdmin } from "@/context/AdminContext";
import { Lock, ShieldAlert, ArrowLeft } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

interface StrictLockProps {
  deptId: string;
  deptSlug: string; // FIXED: Added strict typed identifier prop for matching
  isOpen: boolean;
  onSuccess: () => void;
}

export function DepartmentStrictLockModal({ deptId, deptSlug, isOpen, onSuccess }: StrictLockProps) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { authorizeDepartment } = useAdmin();
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(false); 

    if (password === "jntu@2026") {
      toast.error("Access Denied: Super Admin master password is not accepted here. HOD credentials required.");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyDepartmentAccess({ data: { deptId, password } });
      
      if (res.valid && res.role === "hod") {
        // FIXED: Authorizes session storage mapping using the slug string (e.g. "cse")
        authorizeDepartment(deptSlug);
        toast.success("HOD Authorization Verified!");
        onSuccess();
        setPassword("");
      } else {
        toast.error("Invalid credentials. Only valid HOD passwords are accepted for this department.");
      }
    } catch (err) {
      toast.error("An authentication process error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.history.push("/departments");
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] border border-slate-100 max-w-md w-full p-10 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-200">
        
        <div className="h-16 w-16 bg-red-50 border border-red-200 text-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert size={28} />
        </div>

        <div>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">HOD Authentication Required</h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            This department space is highly restricted. Even if you are logged in as an Administrator, you must provide the specific **Department HOD Password** to open this segment.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">HOD Access Password Key</label>
            <input 
              type="password"
              required
              placeholder="••••••••"
              autoFocus
              className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-sm outline-none focus:border-red-500 font-mono transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 shadow-lg shadow-red-600/10"
          >
            {loading ? "Authenticating HOD Access..." : "Verify & Open Department"}
          </button>
        </form>

        <hr className="border-slate-100" />

        <button 
          onClick={handleGoBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors mx-auto"
        >
          <ArrowLeft size={14} /> Exit to Admin Panel
        </button>
      </div>
    </div>
  );
}