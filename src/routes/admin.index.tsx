import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import {
  Building2,
  GraduationCap,
  Briefcase,
  Users,
  Shield,
  ExternalLink,
  Lock,
  Info
} from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminLoginPage,
});



const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2.5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.53-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-8.77z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.74-2.11-6.68-4.96H1.21v3.15C3.18 21.88 7.39 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.32 14.24A7.16 7.16 0 0 1 5 12c0-.79.13-1.57.32-2.34V6.51H1.21A11.94 11.94 0 0 0 0 12c0 1.92.45 3.74 1.21 5.39l4.11-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.39 0 3.18 2.12 1.21 6.51l4.11 3.15c.94-2.85 3.57-4.91 6.68-4.91z"
    />
  </svg>
);

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAdmin } = useAdmin();
  const navigate = useNavigate();

  // Smart redirect: If already logged in, skip login page
  useEffect(() => {
    if (isAdmin) {
      navigate({ to: "/" });
    }
  }, [isAdmin, navigate]);

  // Read URL query errors (e.g., Google OAuth redirects with errors)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const err = searchParams.get("error");
      const errEmail = searchParams.get("email");
      if (err) {
        if (err === "unauthorized_google_account") {
          setErrorMsg(`The Google account (${errEmail || "your email"}) is not authorized as an administrator.`);
        } else if (err === "state_mismatch" || err === "missing_oauth_params") {
          setErrorMsg("Security validation failed. Please try signing in again.");
        } else if (err === "oauth_exchange_failed") {
          setErrorMsg("Failed to communicate with Google authentication services.");
        } else {
          setErrorMsg("An unexpected authentication error occurred.");
        }
        
        // Clean URL query parameters from address bar so they do not persist on reload
        try {
          const newUrl = window.location.pathname;
          window.history.replaceState(null, "", newUrl);
        } catch (e) {
          console.error("Failed to clear search parameters:", e);
        }
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const success = await login(email, password);
      if (success) {
        navigate({ to: "/" });
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };



  const handleGoogleLogin = () => {
    window.location.href = "/auth/google/login";
  };

  if (isAdmin) return null;

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-50/40 via-slate-50 to-slate-100 flex flex-col font-sans text-slate-800">
      {/* Top Header Navigation (minimal, clean) */}
      <div className="w-full max-w-7xl mx-auto px-6 pt-4 flex justify-end">
        <a
          href="/"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0F4C81] transition-colors bg-white px-4 py-2 rounded-full border border-slate-200/60 shadow-sm"
        >
          Main Site <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-16">
        
        {/* Centered Identity Block */}
        <div className="text-center max-w-2xl mx-auto mb-10 flex flex-col items-center animate-fade-in">
          <div className="relative group mb-6">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-400 to-[#0F4C81] rounded-full blur opacity-35 group-hover:opacity-55 transition duration-500"></div>
            <img
              src="https://jntugvcev.edu.in/wp-content/uploads/2022/07/logo-min.jpeg"
              alt="JNTU-GV Logo"
              className="relative h-24 w-24 object-contain rounded-full border border-slate-200 bg-white p-1 shadow-lg transform group-hover:scale-105 transition duration-300"
            />
          </div>
          
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-wide leading-snug uppercase max-w-xl font-display">
            Jawaharlal Nehru Technological University Gurajada Vizianagaram
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-semibold tracking-wider uppercase mt-1">
            College of Engineering Vizianagaram (CEV)
          </p>
          
          <div className="mt-4 inline-flex items-center gap-2 bg-[#0F4C81]/10 border border-[#0F4C81]/25 text-[#0F4C81] font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            University Administration Portal
          </div>
        </div>

        {/* Centered Login Card */}
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/40 p-8 md:p-10 animate-scale-reveal">
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h3 className="text-2xl font-bold text-slate-900 font-display">Sign In</h3>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Enter your administrative credentials
              </p>
            </div>

            {errorMsg && (
              <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl text-xs leading-relaxed animate-fade-in flex items-start gap-3">
                <Info className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@jntugv.edu.in"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20 focus:border-[#0F4C81] transition-all text-sm shadow-sm placeholder-slate-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20 focus:border-[#0F4C81] transition-all text-sm shadow-sm placeholder-slate-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-[#0F4C81] hover:bg-[#0D3F6D] text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-md shadow-[#0F4C81]/15 text-sm flex items-center justify-center cursor-pointer gap-2 hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Secure Sign In</span>
                  </>
                )}
              </button>
            </form>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200/60"></div>
              <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-wider">or</span>
              <div className="flex-grow border-t border-slate-200/60"></div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-bold text-slate-700 text-sm transition-all shadow-sm cursor-pointer hover:shadow hover:-translate-y-0.5"
            >
              <GoogleIcon />
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            <span>Encrypted ERP Session</span>
          </div>
        </div>

        {/* Statistics & Modules Section (Centred Card Grid) */}
        <div className="w-full max-w-4xl mt-16 space-y-6 px-2">
          <div className="text-center space-y-1">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">ERP Scope</h4>
            <h3 className="text-lg font-bold text-slate-800 font-display">Institutional Capabilities</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Departments</span>
                <div className="p-2 rounded-xl bg-sky-50 text-[#0F4C81] group-hover:bg-[#0F4C81] group-hover:text-white transition-colors duration-300">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-slate-800 tracking-tight">8 Branches</div>
                <p className="text-[11px] text-slate-400 font-medium leading-normal mt-0.5">Course curricula & laboratory configurations</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Enrollment</span>
                <div className="p-2 rounded-xl bg-sky-50 text-[#0F4C81] group-hover:bg-[#0F4C81] group-hover:text-white transition-colors duration-300">
                  <GraduationCap className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-slate-800 tracking-tight">1,450+ Students</div>
                <p className="text-[11px] text-slate-400 font-medium leading-normal mt-0.5">Undergrad, postgrad, and management domains</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Placements</span>
                <div className="p-2 rounded-xl bg-sky-50 text-[#0F4C81] group-hover:bg-[#0F4C81] group-hover:text-white transition-colors duration-300">
                  <Briefcase className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-slate-800 tracking-tight">92% Success</div>
                <p className="text-[11px] text-slate-400 font-medium leading-normal mt-0.5">Recruitment metrics & training programs</p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Faculty & Staff</span>
                <div className="p-2 rounded-xl bg-sky-50 text-[#0F4C81] group-hover:bg-[#0F4C81] group-hover:text-white transition-colors duration-300">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-slate-800 tracking-tight">120+ Members</div>
                <p className="text-[11px] text-slate-400 font-medium leading-normal mt-0.5">Academic credentials & research profiles</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/60 bg-white py-6 px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <span>© 2026 JNTU-GV CEV. All Rights Reserved.</span>
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 px-3 py-1 rounded-full text-slate-600 shadow-sm">
            <Shield className="w-3.5 h-3.5 text-[#0F4C81]" />
            <span>ISO 9001:2015 Certified Institution</span>
          </div>
        </div>
      </footer>
    </div>
  );
}