import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import { getAssetUrl } from "@/lib/assets";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  GraduationCap,
  Briefcase,
  Users,
  Shield,
  ExternalLink,
  Lock,
  Info,
  Share2,
  Plus,
  Trash2,
  Camera,
  Calendar,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Upload,
  FileText,
  Image as ImageIcon,
  Globe,
  ChevronRight,
  Activity,
  Check
} from "lucide-react";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { notices, campusGallery, socialPosts, socialConnections } from "@/db/schema";
import { desc, count, eq } from "drizzle-orm";
import { addNotice, deleteNotice, addCampusGalleryItem, deleteCampusGalleryItem } from "@/funcs/site.server";
import { SocialPublishingPanel } from "@/components/SocialPublishingPanel";

export const getDashboardData = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const { getCookie, getRequest } = await import("@tanstack/react-start/server");
      const { authService } = await import("@/auth/auth.service");

      const request = getRequest();
      const token = getCookie("admin_session_token");
      if (!token) {
        throw new Error("Unauthorized");
      }

      const userAgent = request.headers.get("user-agent") || null;
      const ipAddress = request.headers.get("x-forwarded-for") || null;
      const admin = await authService.validateSession(token, ipAddress, userAgent);
      if (!admin) {
        throw new Error("Unauthorized");
      }

      const [noticesCountResult] = await db.select({ val: count() }).from(notices);
      const [galleryCountResult] = await db.select({ val: count() }).from(campusGallery);
      
      const [linkedinCountResult] = await db
        .select({ val: count() })
        .from(socialPosts)
        .where(eq(socialPosts.platform, "linkedin"));
        
      const [instagramCountResult] = await db
        .select({ val: count() })
        .from(socialPosts)
        .where(eq(socialPosts.platform, "instagram"));

      const recentPosts = await db
        .select()
        .from(socialPosts)
        .orderBy(desc(socialPosts.id))
        .limit(10);

      const recentNotices = await db
        .select()
        .from(notices)
        .orderBy(desc(notices.id))
        .limit(10);

      const recentGallery = await db
        .select()
        .from(campusGallery)
        .orderBy(desc(campusGallery.id))
        .limit(10);

      return {
        stats: {
          totalNotices: noticesCountResult.val,
          totalGallery: galleryCountResult.val,
          linkedinPosts: linkedinCountResult.val,
          instagramPosts: instagramCountResult.val,
        },
        recentPosts,
        recentNotices,
        recentGallery,
      };
    } catch (err: any) {
      console.error("Failed to load dashboard data:", err);
      throw err;
    }
  });

export const Route = createFileRoute("/admin/")({
  component: AdminPageRouter,
});

function AdminPageRouter() {
  const { isAdmin } = useAdmin();

  if (isAdmin) {
    return <AdminDashboard />;
  }

  return <AdminLoginPage />;
}

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
  const { login } = useAdmin();
  const navigate = useNavigate();

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
        navigate({ to: "/admin" });
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

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-50/40 via-slate-50 to-slate-100 flex flex-col font-sans text-slate-800">
      <div className="w-full max-w-7xl mx-auto px-6 pt-4 flex justify-end">
        <a
          href="/"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0F4C81] transition-colors bg-white px-4 py-2 rounded-full border border-slate-200/60 shadow-sm"
        >
          Main Site <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-16">
        <div className="text-center max-w-2xl mx-auto mb-10 flex flex-col items-center animate-fade-in">
          <div className="relative group mb-6">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-400 to-[#0F4C81] rounded-full blur opacity-35 group-hover:opacity-55 transition duration-500"></div>
            <img decoding="async" loading="lazy"
              src={getAssetUrl("https://jntugvcev.edu.in/wp-content/uploads/2022/07/logo-min.jpeg")}
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
      </div>

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

function normalizeSrcForStorage(src: string): string {
  const trimmed = src.trim();
  const legacyHostPattern = /^https?:\/\/89\.116\.134\.182(:\d+)?\/local-assets\//;
  if (legacyHostPattern.test(trimmed)) {
    return trimmed.replace(legacyHostPattern, "");
  }
  return trimmed;
}

const noticeCategories = ["Academic", "Exams", "Placements", "Admissions", "Events", "Tenders", "Others"];

function AdminDashboard() {
  const { logout } = useAdmin();
  const navigate = useNavigate();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<"overview" | "notices" | "gallery" | "posts" | "connections">("overview");
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [healthData, setHealthData] = useState<any>(null);
  const [connections, setConnections] = useState<any>(null);
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [linkedinPosts, setLinkedinPosts] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Forms states
  const [newNotice, setNewNotice] = useState({ title: "", tag: "Academic", url: "" });
  const [uploadingNoticeFile, setUploadingNoticeFile] = useState(false);
  const [savedNoticeItem, setSavedNoticeItem] = useState<any | null>(null);
  const [selectedNoticeForShare, setSelectedNoticeForShare] = useState<number | null>(null);

  const [newImage, setNewImage] = useState({ src: "", caption: "" });
  const [savedGalleryItem, setSavedGalleryItem] = useState<any | null>(null);
  const [selectedGalleryForShare, setSelectedGalleryForShare] = useState<number | null>(null);

  const fetchAllData = async () => {
    setRefreshing(true);
    try {
      const stats = await getDashboardData();
      setDashboardData(stats);

      const healthRes = await fetch("/api/admin/social/health");
      if (healthRes.ok) {
        setHealthData(await healthRes.json());
      }

      const statusRes = await fetch("/api/admin/social/status");
      const diagRes = await fetch("/api/admin/social/diagnostics");
      if (statusRes.ok && diagRes.ok) {
        setConnections(await statusRes.json());
        setDiagnostics(await diagRes.json());
      }

      const postsRes = await fetch("/api/posts?platform=linkedin");
      if (postsRes.ok) {
        const postsJson = await postsRes.json();
        if (postsJson.success) {
          setLinkedinPosts(postsJson.posts);
        }
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleNoticeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingNoticeFile(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("module", "notices");
    formData.append("category", "date");

    const tId = toast.loading(`Uploading document ${file.name}...`);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (json.success) {
        const assetUrl = `http://89.116.134.182/${json.path}`;
        setNewNotice((prev) => ({ ...prev, url: assetUrl }));
        toast.success(`File uploaded successfully!`, { id: tId });
      } else {
        toast.error(json.error || "Upload failed", { id: tId });
      }
    } catch (err: any) {
      toast.error("Failed to upload file", { id: tId });
    } finally {
      setUploadingNoticeFile(false);
    }
  };

  const handleAddNoticeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title.trim()) {
      toast.error("Please enter notice title.");
      return;
    }

    setSavedNoticeItem(null);
    const tId = toast.loading("Publishing notice...");
    try {
      const dateStr = new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      const res = await addNotice({
        data: {
          title: newNotice.title.trim(),
          tag: newNotice.tag,
          link: newNotice.url || undefined,
          date: dateStr,
        },
      });

      toast.success("Notice added successfully!", { id: tId });
      if (res && res.id) {
        const itemObj = {
          id: res.id,
          title: newNotice.title.trim(),
          tag: newNotice.tag,
          url: newNotice.url,
          date: dateStr,
          instagramPosted: false,
          linkedinPosted: false,
        };
        setSavedNoticeItem(itemObj);
        setSelectedNoticeForShare(res.id);
      }
      setNewNotice({ title: "", tag: "Academic", url: "" });
      fetchAllData();
    } catch (err: any) {
      toast.error("Failed to publish notice.", { id: tId });
    }
  };

  const handleDeleteNoticeClick = async (id: number) => {
    if (!confirm("Delete this notice?")) return;
    const tId = toast.loading("Deleting notice...");
    try {
      await deleteNotice({ data: { id } });
      toast.success("Notice deleted.", { id: tId });
      if (selectedNoticeForShare === id) setSelectedNoticeForShare(null);
      if (savedNoticeItem?.id === id) setSavedNoticeItem(null);
      fetchAllData();
    } catch {
      toast.error("Failed to delete notice.", { id: tId });
    }
  };

  const handleAddGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImage.src.trim()) {
      toast.error("Please provide image URL.");
      return;
    }

    setSavedGalleryItem(null);
    const tId = toast.loading("Adding photo...");
    try {
      const res = await addCampusGalleryItem({
        data: {
          src: normalizeSrcForStorage(newImage.src),
          caption: newImage.caption || "Campus Moment",
        },
      });

      toast.success("Photo added to gallery!", { id: tId });
      if (res && res.id) {
        const itemObj = {
          id: res.id,
          src: normalizeSrcForStorage(newImage.src),
          caption: newImage.caption || "Campus Moment",
          instagramPosted: false,
          linkedinPosted: false,
        };
        setSavedGalleryItem(itemObj);
        setSelectedGalleryForShare(res.id);
      }
      setNewImage({ src: "", caption: "" });
      fetchAllData();
    } catch {
      toast.error("Failed to add photo.", { id: tId });
    }
  };

  const handleDeleteGalleryClick = async (id: number) => {
    if (!confirm("Delete this photo?")) return;
    const tId = toast.loading("Deleting photo...");
    try {
      await deleteCampusGalleryItem({ data: { id } });
      toast.success("Photo deleted.", { id: tId });
      if (selectedGalleryForShare === id) setSelectedGalleryForShare(null);
      if (savedGalleryItem?.id === id) setSavedGalleryItem(null);
      fetchAllData();
    } catch {
      toast.error("Failed to delete photo.", { id: tId });
    }
  };

  const handleDisconnect = async (platform: string) => {
    if (!confirm(`Disconnect ${platform} integration?`)) return;
    const tId = toast.loading(`Disconnecting ${platform}...`);
    try {
      const res = await fetch("/api/admin/social/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Disconnected ${platform} successfully!`, { id: tId });
        fetchAllData();
      } else {
        toast.error(data.error || "Failed to disconnect", { id: tId });
      }
    } catch (err: any) {
      toast.error(`Error: ${err.message}`, { id: tId });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center font-sans text-slate-800 dark:text-slate-200">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 border-4 border-slate-350 border-t-[#0F4C81] rounded-full animate-spin"></span>
          <span className="text-xs uppercase font-bold tracking-widest text-slate-400">Loading Admin Center...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans text-slate-800 dark:text-slate-200">
      {/* Top Header */}
      <header className="w-full bg-[#0F4C81] dark:bg-slate-900 border-b border-[#0D3F6D] dark:border-slate-800 py-4 px-6 text-white flex items-center justify-between shadow-md select-none">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-sky-400" />
          <div>
            <h1 className="text-sm font-bold uppercase tracking-wider font-display">
              JNTU-GV Admin Center
            </h1>
            <p className="text-[10px] text-sky-200 font-semibold uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${healthData?.database === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`}></span>
              Database: {healthData?.database || "offline"} | Mode: {healthData?.postingMode || "personal"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchAllData}
            disabled={refreshing}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/5 transition flex items-center justify-center cursor-pointer text-white disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={async () => {
              await logout();
              navigate({ to: "/admin" });
            }}
            className="flex items-center gap-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 px-3.5 py-2 rounded-xl transition cursor-pointer border border-white/10"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 p-4 shrink-0 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 transition cursor-pointer ${
              activeTab === "overview"
                ? "bg-[#0F4C81]/15 text-[#0F4C81] dark:bg-sky-500/10 dark:text-sky-400"
                : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <Activity className="w-4 h-4" /> Overview
          </button>
          <button
            onClick={() => setActiveTab("notices")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 transition cursor-pointer ${
              activeTab === "notices"
                ? "bg-[#0F4C81]/15 text-[#0F4C81] dark:bg-sky-500/10 dark:text-sky-400"
                : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <FileText className="w-4 h-4" /> Notice Board
          </button>
          <button
            onClick={() => setActiveTab("gallery")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 transition cursor-pointer ${
              activeTab === "gallery"
                ? "bg-[#0F4C81]/15 text-[#0F4C81] dark:bg-sky-500/10 dark:text-sky-400"
                : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <ImageIcon className="w-4 h-4" /> Campus Gallery
          </button>
          <button
            onClick={() => setActiveTab("posts")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 transition cursor-pointer ${
              activeTab === "posts"
                ? "bg-[#0F4C81]/15 text-[#0F4C81] dark:bg-sky-500/10 dark:text-sky-400"
                : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <Briefcase className="w-4 h-4" /> LinkedIn Posts
          </button>
          <button
            onClick={() => setActiveTab("connections")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 transition cursor-pointer ${
              activeTab === "connections"
                ? "bg-[#0F4C81]/15 text-[#0F4C81] dark:bg-sky-500/10 dark:text-sky-400"
                : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <Globe className="w-4 h-4" /> Connections
          </button>
        </aside>

        {/* Content Pane */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-65px)]">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold font-display uppercase tracking-wider">Dashboard Overview</h2>
                <p className="text-xs text-slate-400">Live statistics and connections indicators.</p>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-sm group">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase block">Total Notices</span>
                    <span className="text-2xl font-black text-slate-800 dark:text-white mt-1 block">
                      {dashboardData?.stats.totalNotices ?? 0}
                    </span>
                  </div>
                  <div className="p-3 bg-sky-50 dark:bg-sky-950 rounded-2xl text-[#0F4C81] dark:text-sky-400">
                    <FileText className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-sm group">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase block">Gallery Photos</span>
                    <span className="text-2xl font-black text-slate-800 dark:text-white mt-1 block">
                      {dashboardData?.stats.totalGallery ?? 0}
                    </span>
                  </div>
                  <div className="p-3 bg-pink-50 dark:bg-pink-950 rounded-2xl text-pink-650 dark:text-pink-400">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-sm group">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase block">LinkedIn Shares</span>
                    <span className="text-2xl font-black text-slate-800 dark:text-white mt-1 block">
                      {dashboardData?.stats.linkedinPosts ?? 0}
                    </span>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-2xl text-blue-600 dark:text-blue-400">
                    <Briefcase className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-sm group">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase block">Instagram Shares</span>
                    <span className="text-2xl font-black text-slate-800 dark:text-white mt-1 block">
                      {dashboardData?.stats.instagramPosts ?? 0}
                    </span>
                  </div>
                  <div className="p-3 bg-rose-50 dark:bg-rose-950 rounded-2xl text-rose-600 dark:text-rose-450">
                    <Camera className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Connections Summary & Health Details */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm lg:col-span-2 space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Recent Social Activity Logs</h3>
                  
                  {dashboardData?.recentPosts && dashboardData.recentPosts.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 dark:border-slate-800 pb-2">
                            <th className="py-2.5 font-bold text-slate-500 uppercase">Platform</th>
                            <th className="py-2.5 font-bold text-slate-500 uppercase">Content Preview</th>
                            <th className="py-2.5 font-bold text-slate-500 uppercase">Published At</th>
                            <th className="py-2.5 font-bold text-slate-500 uppercase text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40">
                          {dashboardData.recentPosts.map((post: any) => (
                            <tr key={post.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                              <td className="py-3.5 font-semibold">
                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                                  post.platform === "linkedin"
                                    ? "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-955/20 dark:text-blue-450 dark:border-blue-900/40"
                                    : "bg-pink-50 text-pink-700 border-pink-100 dark:bg-pink-955/20 dark:text-pink-450 dark:border-pink-900/40"
                                }`}>
                                  {post.platform === "linkedin" ? <Briefcase className="w-2.5 h-2.5" /> : <Camera className="w-2.5 h-2.5" />}
                                  {post.platform}
                                </span>
                              </td>
                              <td className="py-3.5 text-slate-600 dark:text-slate-350 max-w-xs truncate">
                                {post.content}
                              </td>
                              <td className="py-3.5 text-slate-400 font-medium">
                                {new Date(post.publishedAt).toLocaleDateString()} {new Date(post.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </td>
                              <td className="py-3.5 text-right">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                  post.status === "published"
                                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                                    : "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400"
                                }`}>
                                  {post.status === "published" ? <Check className="w-2.5 h-2.5" /> : <AlertTriangle className="w-2.5 h-2.5" />}
                                  {post.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-slate-450 dark:text-slate-500 font-medium flex flex-col items-center gap-1">
                      <Activity className="w-8 h-8 opacity-45 mb-1" />
                      <span>No social publishing activities logged yet.</span>
                    </div>
                  )}
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">OAuth Connections</h3>
                  
                  {/* LinkedIn */}
                  <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-850/20 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-blue-600" /> LinkedIn
                      </span>
                      <span className={`w-2 h-2 rounded-full ${connections?.linkedin.connected ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                    </div>
                    {connections?.linkedin.connected ? (
                      <div className="space-y-1.5 mt-1">
                        <p className="text-[11px] text-slate-500">Connected as <strong className="text-slate-800 dark:text-slate-250">{connections.linkedin.connectedAs}</strong></p>
                        <button
                          onClick={() => handleDisconnect("linkedin")}
                          className="w-full text-center py-1.5 bg-rose-50 text-rose-750 dark:bg-rose-950/20 dark:text-rose-400 font-bold rounded-xl border border-rose-100 dark:border-rose-900/30 text-[10px] uppercase cursor-pointer"
                        >
                          Disconnect
                        </button>
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">No active LinkedIn connection setup.</p>
                    )}
                  </div>

                  {/* Instagram */}
                  <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-850/20 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold flex items-center gap-1.5">
                        <Camera className="w-4 h-4 text-pink-650" /> Instagram
                      </span>
                      <span className={`w-2 h-2 rounded-full ${connections?.instagram.connected ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                    </div>
                    {connections?.instagram.connected ? (
                      <div className="space-y-1.5 mt-1">
                        <p className="text-[11px] text-slate-500">Connected as <strong className="text-slate-800 dark:text-slate-250">{connections.instagram.connectedAs}</strong></p>
                        <button
                          onClick={() => handleDisconnect("instagram")}
                          className="w-full text-center py-1.5 bg-rose-50 text-rose-750 dark:bg-rose-950/20 dark:text-rose-400 font-bold rounded-xl border border-rose-100 dark:border-rose-900/30 text-[10px] uppercase cursor-pointer"
                        >
                          Disconnect
                        </button>
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">No active Instagram connection setup.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NOTICE BOARD */}
          {activeTab === "notices" && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold font-display uppercase tracking-wider">Notice Board Management</h2>
                <p className="text-xs text-slate-400">Post announcements and optional documents to the site notice board.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Column */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm h-fit">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">Publish Announcement</h3>
                  
                  <form onSubmit={handleAddNoticeSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Notice Title</label>
                      <input
                        type="text"
                        placeholder="e.g. B.Tech Exams circular postponed..."
                        className="w-full bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#0F4C81]/25 focus:border-[#0F4C81] dark:text-white"
                        value={newNotice.title}
                        onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Category Tag</label>
                        <select
                          className="w-full bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-bold outline-none focus:ring-2 focus:ring-[#0F4C81]/25 cursor-pointer dark:text-white"
                          value={newNotice.tag}
                          onChange={(e) => setNewNotice({ ...newNotice, tag: e.target.value })}
                        >
                          {noticeCategories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">PDF Document</label>
                        <label className="flex items-center justify-center gap-1.5 p-2.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 rounded-xl font-bold text-xs cursor-pointer transition">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadingNoticeFile ? "Uploading..." : "Attach File"}</span>
                          <input
                            type="file"
                            accept=".pdf,image/*"
                            onChange={handleNoticeUpload}
                            className="hidden"
                            disabled={uploadingNoticeFile}
                          />
                        </label>
                      </div>
                    </div>

                    {newNotice.url && (
                      <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl text-xs text-emerald-800 dark:text-emerald-350 font-semibold flex items-center justify-between">
                        <span className="truncate max-w-[200px]">Attached: {newNotice.url}</span>
                        <button
                          type="button"
                          onClick={() => setNewNotice((prev) => ({ ...prev, url: "" }))}
                          className="text-rose-600 font-bold hover:underline shrink-0 text-[10px] cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-[#0F4C81] hover:bg-[#0D3F6D] text-white font-bold py-3 rounded-xl transition shadow-md text-xs flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider mt-2"
                    >
                      <Plus className="w-4 h-4" /> Publish Announcement
                    </button>
                  </form>
                </div>

                {/* List Column */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm lg:col-span-2 space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Recent Notice Board Posts</h3>

                  {dashboardData?.recentNotices && dashboardData.recentNotices.length > 0 ? (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {dashboardData.recentNotices.map((notice: any) => (
                        <div key={notice.id} className="py-4 space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <span className="inline-flex px-2 py-0.5 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40 rounded-full text-[9px] font-black uppercase">
                                {notice.tag}
                              </span>
                              <h4 className="text-xs font-bold text-slate-800 dark:text-white leading-snug">
                                {notice.title}
                              </h4>
                              <p className="text-[10px] text-slate-400 font-medium">Posted on: {notice.date}</p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => setSelectedNoticeForShare(selectedNoticeForShare === notice.id ? null : notice.id)}
                                className={`p-1.5 rounded-lg border transition flex items-center justify-center cursor-pointer ${
                                  selectedNoticeForShare === notice.id
                                    ? "bg-blue-600 border-blue-600 text-white"
                                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-350"
                                }`}
                                title="Share on Social Media"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteNoticeClick(notice.id)}
                                className="p-1.5 bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/20 dark:border-rose-900/30 rounded-lg transition flex items-center justify-center cursor-pointer"
                                title="Delete Notice"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Social Panel Expandable Drawer */}
                          {selectedNoticeForShare === notice.id && (
                            <div className="border border-slate-150 dark:border-slate-800 rounded-2xl overflow-hidden mt-2 animate-fade-in shadow-inner bg-slate-50/20">
                              <SocialPublishingPanel
                                itemId={notice.id}
                                itemType="notice"
                                initialData={notice}
                                onStatusUpdate={fetchAllData}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-slate-450 dark:text-slate-500 font-medium flex flex-col items-center gap-1.5">
                      <FileText className="w-8 h-8 opacity-45 mb-1" />
                      <span>No announcements posted yet.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CAMPUS GALLERY */}
          {activeTab === "gallery" && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold font-display uppercase tracking-wider">Campus Gallery Management</h2>
                <p className="text-xs text-slate-400">Log new visual assets and photo records directly into the public campus catalog.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Column */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm h-fit">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">Log New Photo</h3>

                  <form onSubmit={handleAddGallerySubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Image Asset URL</label>
                      <input
                        type="text"
                        placeholder="uploads/photo-gallery/img.jpg or full https:// URL"
                        className="w-full bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#0F4C81]/25 focus:border-[#0F4C81] dark:text-white"
                        value={newImage.src}
                        onChange={(e) => setNewImage({ ...newImage, src: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Caption / Description</label>
                      <input
                        type="text"
                        placeholder="e.g. Independence Day celebrations on campus"
                        className="w-full bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#0F4C81]/25 focus:border-[#0F4C81] dark:text-white"
                        value={newImage.caption}
                        onChange={(e) => setNewImage({ ...newImage, caption: e.target.value })}
                      />
                    </div>

                    {newImage.src && (
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl max-w-sm">
                        <span className="block text-[9px] uppercase font-bold text-slate-400 mb-2">Asset Preview</span>
                        <img decoding="async" loading="lazy"
                          src={getAssetUrl(normalizeSrcForStorage(newImage.src))}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-xl"
                          onError={(e) => {
                            (e.target as any).src = "https://images.unsplash.com/photo-1594322436404-5a0526db4d13?w=500";
                          }}
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-[#0F4C81] hover:bg-[#0D3F6D] text-white font-bold py-3 rounded-xl transition shadow-md text-xs flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider mt-2"
                    >
                      <Plus className="w-4 h-4" /> Add Photo to Gallery
                    </button>
                  </form>
                </div>

                {/* List Column */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm lg:col-span-2 space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Recent Campus Gallery Logs</h3>

                  {dashboardData?.recentGallery && dashboardData.recentGallery.length > 0 ? (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {dashboardData.recentGallery.map((item: any) => (
                        <div key={item.id} className="py-4 space-y-3">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <img decoding="async" loading="lazy"
                                src={getAssetUrl(item.src)}
                                alt={item.caption}
                                className="w-12 h-12 object-cover rounded-xl border border-slate-200 dark:border-slate-800 shrink-0"
                                onError={(e) => {
                                  (e.target as any).src = "https://images.unsplash.com/photo-1594322436404-5a0526db4d13?w=100";
                                }}
                              />
                              <div className="space-y-0.5">
                                <h4 className="text-xs font-bold text-slate-800 dark:text-white leading-snug">
                                  {item.caption || "No caption"}
                                </h4>
                                <p className="text-[10px] text-slate-400 font-medium">Logged: {new Date(item.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => setSelectedGalleryForShare(selectedGalleryForShare === item.id ? null : item.id)}
                                className={`p-1.5 rounded-lg border transition flex items-center justify-center cursor-pointer ${
                                  selectedGalleryForShare === item.id
                                    ? "bg-blue-600 border-blue-600 text-white"
                                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-350"
                                }`}
                                title="Share on Social Media"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteGalleryClick(item.id)}
                                className="p-1.5 bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/20 dark:border-rose-900/30 rounded-lg transition flex items-center justify-center cursor-pointer"
                                title="Delete Image"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Social Panel Expandable Drawer */}
                          {selectedGalleryForShare === item.id && (
                            <div className="border border-slate-150 dark:border-slate-800 rounded-2xl overflow-hidden mt-2 animate-fade-in shadow-inner bg-slate-50/20">
                              <SocialPublishingPanel
                                itemId={item.id}
                                itemType="gallery"
                                initialData={item}
                                onStatusUpdate={fetchAllData}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-slate-450 dark:text-slate-500 font-medium flex flex-col items-center gap-1.5">
                      <ImageIcon className="w-8 h-8 opacity-45 mb-1" />
                      <span>No gallery images logged yet.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LINKEDIN POSTS */}
          {activeTab === "posts" && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold font-display uppercase tracking-wider">LinkedIn Posts Feed</h2>
                <p className="text-xs text-slate-400">View and track all items successfully published from this site to your LinkedIn profile/page.</p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
                {linkedinPosts && linkedinPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {linkedinPosts.map((post) => (
                      <div key={post.id} className="p-5 rounded-2xl border border-slate-150 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-850/10 flex flex-col justify-between gap-4 hover:-translate-y-0.5 transition-all duration-300">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-400 font-bold">
                              URN: {post.postId.length > 25 ? post.postId.substring(0, 25) + "..." : post.postId}
                            </span>
                            <span className="inline-flex px-2 py-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-450 rounded-full text-[9px] font-black uppercase border border-emerald-100 dark:border-emerald-900/40">
                              {post.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 dark:text-slate-200 font-medium leading-relaxed italic">
                            "{post.content}"
                          </p>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                          <span className="text-[10px] text-slate-400 font-semibold">
                            Published: {new Date(post.publishedAt).toLocaleDateString()}
                          </span>
                          {post.postUrl && (
                            <a
                              href={post.postUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline inline-flex items-center gap-1"
                            >
                              View on LinkedIn →
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-16 text-center text-slate-450 dark:text-slate-500 font-medium flex flex-col items-center gap-2">
                    <Briefcase className="w-10 h-10 opacity-30 mb-1" />
                    <span className="text-xs uppercase tracking-wider font-bold">No active LinkedIn posts found</span>
                    <p className="text-[11px] text-slate-400 font-medium max-w-sm mx-auto">
                      Verify that you have connected your LinkedIn profile and checked the "Confirm & Publish" option when uploading notices or gallery images.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: CONNECTIONS SETTINGS */}
          {activeTab === "connections" && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold font-display uppercase tracking-wider">Social Publishing Connections</h2>
                <p className="text-xs text-slate-400">Establish and manage secure OAuth channels to LinkedIn and Instagram.</p>
              </div>

              {/* Status and Connect Panels */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* LinkedIn Connection Widget */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-blue-600 animate-pulse" /> LinkedIn Integration
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      connections?.linkedin.connected 
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400" 
                        : "bg-slate-50 text-slate-400 dark:bg-slate-800/40"
                    }`}>
                      {connections?.linkedin.connected ? "Connected" : "Disconnected"}
                    </span>
                  </div>

                  {connections?.linkedin.connected ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-50 dark:bg-slate-850/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                        <p className="text-slate-500">Connected account name:</p>
                        <p className="text-sm font-extrabold text-slate-800 dark:text-white">{connections.linkedin.connectedAs}</p>
                        <p className="text-[10px] text-slate-400 mt-2 font-medium">Expires: {new Date(connections.linkedin.expiresAt).toLocaleDateString()}</p>
                      </div>
                      <button
                        onClick={() => handleDisconnect("linkedin")}
                        className="w-full text-center py-2.5 bg-rose-50 text-rose-750 dark:bg-rose-950/20 dark:text-rose-450 hover:bg-rose-100 transition rounded-xl font-bold text-xs uppercase cursor-pointer border border-rose-100 dark:border-rose-900/30"
                      >
                        Disconnect LinkedIn Account
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Connect your personal or organizational LinkedIn profile to enable publishing notifications and images directly to feeds.
                      </p>
                      <a
                        href={diagnostics?.linkedin.ready ? `/api/admin/social/connect/linkedin?redirect_to=${encodeURIComponent(window.location.pathname)}` : "#"}
                        onClick={(e) => {
                          if (!diagnostics?.linkedin.ready) {
                            e.preventDefault();
                            toast.error("LinkedIn configuration is incomplete. Check environment variables.");
                          }
                        }}
                        className={`inline-flex items-center justify-center w-full px-4 py-3 text-white rounded-xl text-xs font-bold transition shadow-sm ${
                          diagnostics?.linkedin.ready 
                            ? "bg-blue-600 hover:bg-blue-700 cursor-pointer" 
                            : "bg-slate-300 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                        }`}
                      >
                        Connect LinkedIn (OAuth)
                      </a>
                    </div>
                  )}

                  {/* Diagnostics section */}
                  <div className="pt-2">
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest block mb-2">Credentials Diagnostics</span>
                    <div className="space-y-1.5 text-[10px] font-semibold text-slate-500">
                      <div className="flex items-center justify-between">
                        <span>LINKEDIN_CLIENT_ID:</span>
                        <span className={diagnostics?.linkedin.hasClientId ? "text-emerald-600 dark:text-emerald-450" : "text-rose-500"}>
                          {diagnostics?.linkedin.hasClientId ? "Configured ✓" : "MISSING"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>LINKEDIN_CLIENT_SECRET:</span>
                        <span className={diagnostics?.linkedin.hasClientSecret ? "text-emerald-600 dark:text-emerald-450" : "text-rose-500"}>
                          {diagnostics?.linkedin.hasClientSecret ? "Configured ✓" : "MISSING"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instagram Connection Widget */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <Camera className="w-5 h-5 text-pink-650 animate-pulse" /> Instagram Integration
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      connections?.instagram.connected 
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400" 
                        : "bg-slate-50 text-slate-400 dark:bg-slate-800/40"
                    }`}>
                      {connections?.instagram.connected ? "Connected" : "Disconnected"}
                    </span>
                  </div>

                  {connections?.instagram.connected ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-50 dark:bg-slate-850/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                        <p className="text-slate-500">Connected account username:</p>
                        <p className="text-sm font-extrabold text-slate-800 dark:text-white">{connections.instagram.connectedAs}</p>
                        <p className="text-[10px] text-slate-400 mt-2 font-medium">Expires: {new Date(connections.instagram.expiresAt).toLocaleDateString()}</p>
                      </div>
                      <button
                        onClick={() => handleDisconnect("instagram")}
                        className="w-full text-center py-2.5 bg-rose-50 text-rose-750 dark:bg-rose-950/20 dark:text-rose-455 hover:bg-rose-100 transition rounded-xl font-bold text-xs uppercase cursor-pointer border border-rose-100 dark:border-rose-900/30"
                      >
                        Disconnect Instagram Account
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Connect your Facebook Page & Linked Instagram Business Account to enable publishing notices and gallery photos to your grid.
                      </p>
                      <a
                        href={diagnostics?.instagram.ready ? `/api/admin/social/connect/instagram?redirect_to=${encodeURIComponent(window.location.pathname)}` : "#"}
                        onClick={(e) => {
                          if (!diagnostics?.instagram.ready) {
                            e.preventDefault();
                            toast.error("Instagram configuration is incomplete. Check environment variables.");
                          }
                        }}
                        className={`inline-flex items-center justify-center w-full px-4 py-3 text-white rounded-xl text-xs font-bold transition shadow-sm ${
                          diagnostics?.instagram.ready 
                            ? "bg-pink-600 hover:bg-pink-700 cursor-pointer" 
                            : "bg-slate-300 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                        }`}
                      >
                        Connect Instagram (Meta OAuth)
                      </a>
                    </div>
                  )}

                  {/* Diagnostics section */}
                  <div className="pt-2">
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest block mb-2">Credentials Diagnostics</span>
                    <div className="space-y-1.5 text-[10px] font-semibold text-slate-500">
                      <div className="flex items-center justify-between">
                        <span>META_APP_ID:</span>
                        <span className={diagnostics?.instagram.hasAppId ? "text-emerald-600 dark:text-emerald-450" : "text-rose-500"}>
                          {diagnostics?.instagram.hasAppId ? "Configured ✓" : "MISSING"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>META_APP_SECRET:</span>
                        <span className={diagnostics?.instagram.hasAppSecret ? "text-emerald-600 dark:text-emerald-450" : "text-rose-500"}>
                          {diagnostics?.instagram.hasAppSecret ? "Configured ✓" : "MISSING"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>INSTAGRAM_BUSINESS_ACCOUNT_ID:</span>
                        <span className={diagnostics?.instagram.hasBusinessAccountId ? "text-emerald-600 dark:text-emerald-450" : "text-rose-500"}>
                          {diagnostics?.instagram.hasBusinessAccountId ? "Configured ✓" : "MISSING"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}