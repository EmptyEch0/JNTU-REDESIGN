import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Instagram,
  Linkedin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Share2,
  Send,
  Eye,
  X,
  FileText
} from "lucide-react";
import { getAssetUrl } from "@/lib/assets";

interface SocialPublishingPanelProps {
  itemId: number;
  itemType: "notice" | "gallery";
  initialData: {
    title: string;
    tag?: string;
    date?: string;
    url?: string; // For notices, could be PDF or Image
    src?: string; // For gallery, always Image
    caption?: string; // For gallery
    instagramPosted: boolean;
    instagramPostId?: string | null;
    instagramPostedAt?: string | null;
    instagramError?: string | null;
    linkedinPosted: boolean;
    linkedinPostId?: string | null;
    linkedinPostedAt?: string | null;
    linkedinError?: string | null;
  };
  onStatusUpdate: () => void;
}

export function SocialPublishingPanel({
  itemId,
  itemType,
  initialData,
  onStatusUpdate
}: SocialPublishingPanelProps) {
  // Connection states
  const [connections, setConnections] = useState<{
    instagram: { connected: boolean; connectedAs: string | null };
    linkedin: { connected: boolean; connectedAs: string | null };
  } | null>(null);
  
  const [diagnostics, setDiagnostics] = useState<{
    instagram: {
      ready: boolean;
      META_APP_ID: string;
      META_APP_SECRET: string;
      INSTAGRAM_BUSINESS_ACCOUNT_ID: string;
      VITE_SITE_URL: string;
      activeOAuthToken: string;
      connectedAs: string | null;
    };
    linkedin: {
      ready: boolean;
      LINKEDIN_CLIENT_ID: string;
      LINKEDIN_CLIENT_SECRET: string;
      VITE_SITE_URL: string;
      activeOAuthToken: string;
      connectedAs: string | null;
    };
  } | null>(null);
  
  const [loadingConnections, setLoadingConnections] = useState(true);

  // Modal / Preview states
  const [activePreviewPlatform, setActivePreviewPlatform] = useState<"instagram" | "linkedin" | "combined" | null>(null);
  const [editedCaption, setEditedCaption] = useState("");
  const [editedLinkedinCaption, setEditedLinkedinCaption] = useState("");

  // Publishing actions states
  const [isPostingInstagram, setIsPostingInstagram] = useState(false);
  const [isPostingLinkedin, setIsPostingLinkedin] = useState(false);
  const [showConfirm, setShowConfirm] = useState<"instagram" | "linkedin" | "combined" | null>(null);

  // Fetch connection status on mount
  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/admin/social/status");
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setConnections({
            instagram: json.instagram,
            linkedin: json.linkedin
          });
        }
      }

      const diagRes = await fetch("/api/admin/social/diagnostics");
      if (diagRes.ok) {
        const diagJson = await diagRes.json();
        if (diagJson.success) {
          setDiagnostics({
            instagram: diagJson.instagram,
            linkedin: diagJson.linkedin
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch connection statuses/diagnostics:", err);
    } finally {
      setLoadingConnections(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [itemId]);

  // Determine media assets
  const attachmentUrl = itemType === "notice" ? initialData.url : initialData.src;
  const isImageAttachment = (() => {
    if (!attachmentUrl) return false;
    const cleanUrl = attachmentUrl.split("?")[0].toLowerCase();
    return (
      cleanUrl.endsWith(".jpg") ||
      cleanUrl.endsWith(".jpeg") ||
      cleanUrl.endsWith(".png") ||
      cleanUrl.endsWith(".webp")
    );
  })();

  // Generated default captions based on the item type and guidelines
  const generateDefaultCaption = (platform: "instagram" | "linkedin") => {
    if (itemType === "notice") {
      if (platform === "instagram") {
        return `📢 ${initialData.tag || "JNTU-GV"} Notice: ${initialData.title}\n\nAcademic circular released on ${initialData.date || "recent date"}.\n\nStudents and faculty are requested to visit the official website to review instructions.\n\n#JNTUGV #BTech #Examinations #UniversityNotice #${initialData.tag || "Circular"}`;
      } else {
        return `📢 JNTU-GV Academic Update\n\nThe university has officially released: "${initialData.title}" (${initialData.date || "recent date"}).\n\nPlease check the complete notification, timetables, or instructions through the official college portal.\n\n#JNTUGV #HigherEducation #BTech #Examinations #Academics`;
      }
    } else {
      const captionText = initialData.caption || "Campus Moment";
      if (platform === "instagram") {
        return `📸 JNTU-GV Event Highlights\n\n${captionText}\n\nGlimpses from the latest happenings at JNTU-GV CEV Vizianagaram.\n\n#JNTUGV #CampusLife #Vizianagaram #CampusEvents`;
      } else {
        return `📸 Campus Life at JNTU-GV CEV Vizianagaram\n\n${captionText} - Glimpses from the university campus, showcasing student events and academic facilities.\n\n#JNTUGV #CampusMoments #HigherEducation #CampusLife`;
      }
    }
  };

  const handleOpenPreview = (platform: "instagram" | "linkedin" | "combined") => {
    setEditedCaption(generateDefaultCaption("instagram"));
    setEditedLinkedinCaption(generateDefaultCaption("linkedin"));
    setActivePreviewPlatform(platform);
  };

  const handlePostInstagram = async (finalCaption: string) => {
    if (isPostingInstagram) return;
    setIsPostingInstagram(true);
    
    const tId = toast.loading("Publishing to Instagram...");
    try {
      const res = await fetch(`/api/admin/gallery/${itemId}/instagram`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption: finalCaption }),
      });
      
      const finalRes = res.status === 404 && itemType === "notice" 
        ? await fetch(`/api/admin/notifications/${itemId}/instagram`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ caption: finalCaption }),
          })
        : res;

      const data = await finalRes.json();
      if (data.success) {
        const instagramUrl = "https://www.instagram.com/";
        toast.success(
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-xs">Successfully published to Instagram!</span>
            <a 
              href={instagramUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[10px] text-pink-600 dark:text-pink-400 font-bold hover:underline inline-flex items-center gap-1 mt-0.5"
            >
              View Feed on Instagram →
            </a>
          </div>,
          { id: tId }
        );
        window.open(instagramUrl, "_blank");
        onStatusUpdate();
      } else {
        toast.error(`Instagram Error: ${data.error || "Publishing failed"}`, { id: tId });
      }
    } catch (err: any) {
      toast.error(`Instagram connection error: ${err.message}`, { id: tId });
    } finally {
      setIsPostingInstagram(false);
    }
  };

  const handlePostLinkedin = async (finalCaption: string) => {
    if (isPostingLinkedin) return;
    setIsPostingLinkedin(true);

    const tId = toast.loading("Publishing to LinkedIn...");
    try {
      const res = await fetch(`/api/admin/gallery/${itemId}/linkedin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption: finalCaption }),
      });
      
      const finalRes = res.status === 404 && itemType === "notice"
        ? await fetch(`/api/admin/notifications/${itemId}/linkedin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ caption: finalCaption }),
          })
        : res;

      const data = await finalRes.json();
      if (data.success) {
        const postId = data.postId;
        const postUrl = postId ? `https://www.linkedin.com/feed/update/${postId}` : "https://www.linkedin.com/";
        
        toast.success(
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-xs">Successfully published to LinkedIn!</span>
            <a 
              href={postUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline inline-flex items-center gap-1 mt-0.5"
            >
              View Post on LinkedIn →
            </a>
          </div>,
          { id: tId }
        );
        window.open(postUrl, "_blank");
        onStatusUpdate();
      } else {
        toast.error(`LinkedIn Error: ${data.error || "Publishing failed"}`, { id: tId });
      }
    } catch (err: any) {
      toast.error(`LinkedIn connection error: ${err.message}`, { id: tId });
    } finally {
      setIsPostingLinkedin(false);
    }
  };

  const handleCombinedPost = async () => {
    setShowConfirm(null);
    setActivePreviewPlatform(null);
    
    let instaPromise = Promise.resolve();
    let linkedinPromise = Promise.resolve();

    if (!initialData.instagramPosted) {
      instaPromise = handlePostInstagram(editedCaption);
    }
    
    if (!initialData.linkedinPosted) {
      // Delay slightly to prevent race conditions on parallel file reads
      await new Promise(r => setTimeout(r, 1000));
      linkedinPromise = handlePostLinkedin(editedLinkedinCaption);
    }

    await Promise.all([instaPromise, linkedinPromise]);
  };

  const handleDisconnect = async (platform: "instagram" | "linkedin") => {
    const tId = toast.loading(`Disconnecting ${platform}...`);
    try {
      const res = await fetch("/api/admin/social/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Successfully disconnected ${platform}!`, { id: tId });
        fetchStatus();
      } else {
        toast.error(`Disconnect failed: ${data.error || "Unknown error"}`, { id: tId });
      }
    } catch (err: any) {
      toast.error(`Disconnect error: ${err.message}`, { id: tId });
    }
  };

  const formatPublishDate = (dateStr?: string | null) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return dateStr;
    }
  };

  if (loadingConnections) {
    return (
      <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
        <span className="text-xs text-slate-500">Checking social connections status...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
      {/* Title Header */}
      <div className="flex items-center gap-2">
        <Share2 className="w-5 h-5 text-blue-600" />
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
          Admin Social Media Publishing Panel
        </h3>
      </div>

      {/* Diagnostics Alert Callout */}
      {diagnostics && (!diagnostics.instagram.ready || !diagnostics.linkedin.ready) && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl space-y-2 text-slate-800 dark:text-slate-200">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-450 font-bold text-xs">
            <AlertCircle className="w-4.5 h-4.5" />
            <span>Warning: Social Publishing Setup Incomplete</span>
          </div>
          <p className="text-[11px] text-slate-555 dark:text-slate-400 font-medium leading-relaxed">
            The application is missing some server-side environment variables required to connect to the platforms. Publishing will fail until they are configured in the environment:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px] font-semibold font-mono p-1">
            {/* Instagram variables */}
            <div className="space-y-1 bg-white dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-pink-600 font-extrabold uppercase text-[9px] tracking-wider block mb-1">Instagram Graph API Configuration</span>
              <div className="flex justify-between">
                <span>META_APP_ID:</span>
                <span className={diagnostics.instagram.META_APP_ID === "configured" ? "text-emerald-600" : "text-rose-600"}>{diagnostics.instagram.META_APP_ID}</span>
              </div>
              <div className="flex justify-between">
                <span>META_APP_SECRET:</span>
                <span className={diagnostics.instagram.META_APP_SECRET === "configured" ? "text-emerald-600" : "text-rose-600"}>{diagnostics.instagram.META_APP_SECRET}</span>
              </div>
              <div className="flex justify-between">
                <span>INSTAGRAM_BUSINESS_ACCOUNT_ID:</span>
                <span className={diagnostics.instagram.INSTAGRAM_BUSINESS_ACCOUNT_ID === "configured" ? "text-emerald-600" : "text-rose-600"}>{diagnostics.instagram.INSTAGRAM_BUSINESS_ACCOUNT_ID}</span>
              </div>
              <div className="flex justify-between">
                <span>VITE_SITE_URL:</span>
                <span className={diagnostics.instagram.VITE_SITE_URL === "configured" ? "text-emerald-600" : "text-rose-600"}>{diagnostics.instagram.VITE_SITE_URL}</span>
              </div>
            </div>

            {/* LinkedIn variables */}
            <div className="space-y-1 bg-white dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-blue-600 font-extrabold uppercase text-[9px] tracking-wider block mb-1">LinkedIn OIDC + Shares Configuration</span>
              <div className="flex justify-between">
                <span>LINKEDIN_CLIENT_ID:</span>
                <span className={diagnostics.linkedin.LINKEDIN_CLIENT_ID === "configured" ? "text-emerald-600" : "text-rose-600"}>{diagnostics.linkedin.LINKEDIN_CLIENT_ID}</span>
              </div>
              <div className="flex justify-between">
                <span>LINKEDIN_CLIENT_SECRET:</span>
                <span className={diagnostics.linkedin.LINKEDIN_CLIENT_SECRET === "configured" ? "text-emerald-600" : "text-rose-600"}>{diagnostics.linkedin.LINKEDIN_CLIENT_SECRET}</span>
              </div>
              <div className="flex justify-between">
                <span>VITE_SITE_URL:</span>
                <span className={diagnostics.linkedin.VITE_SITE_URL === "configured" ? "text-emerald-600" : "text-rose-600"}>{diagnostics.linkedin.VITE_SITE_URL}</span>
              </div>
            </div>
          </div>
          <p className="text-[9.5px] text-slate-405 font-medium italic">
            Consult the <a href="/social-setup.md" target="_blank" className="text-blue-500 hover:underline">social-setup.md</a> documentation in the codebase for detailed portal instructions.
          </p>
        </div>
      )}

      {/* Grid of Platforms Connections & Connect Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Instagram Connection Status */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-250/70 dark:border-slate-800/60 rounded-2xl flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <Instagram className="w-5 h-5 text-pink-600" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Instagram</h4>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                  Connected Account: _glitch_48
                </p>
              </div>
            </div>
            {connections?.instagram.connected ? (
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-200/40">
                <CheckCircle2 className="w-3 h-3" /> Connected
              </span>
            ) : (
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full border border-amber-200/40">
                Not Connected
              </span>
            )}
          </div>
          
          <div className="mt-4">
            {connections?.instagram.connected ? (
              <div className="flex items-center justify-between gap-2">
                <div className="text-[11px] text-slate-500 font-medium truncate">
                  Connected as <span className="font-bold text-slate-800 dark:text-slate-200">@{connections.instagram.connectedAs}</span>
                </div>
                <button
                  onClick={() => handleDisconnect("instagram")}
                  className="px-2 py-0.5 text-[9px] font-bold text-red-650 bg-red-50 hover:bg-red-100 rounded border border-red-200 cursor-pointer transition shrink-0"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <a
                href={diagnostics?.instagram.ready ? `/api/admin/social/connect/instagram?redirect_to=${encodeURIComponent(window.location.pathname)}` : "#"}
                onClick={(e) => {
                  if (!diagnostics?.instagram.ready) {
                    e.preventDefault();
                    toast.error("Instagram configuration is incomplete. Check server environment variables.");
                  }
                }}
                className={`inline-flex items-center justify-center w-full px-3 py-2 text-white rounded-xl text-xs font-bold transition shadow-sm ${
                  diagnostics?.instagram.ready 
                    ? "bg-pink-600 hover:bg-pink-700 cursor-pointer" 
                    : "bg-slate-350 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                }`}
              >
                Connect Instagram (Meta OAuth)
              </a>
            )}
          </div>
        </div>

        {/* LinkedIn Connection Status */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-250/70 dark:border-slate-800/60 rounded-2xl flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <Linkedin className="w-5 h-5 text-blue-600" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">LinkedIn</h4>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                  Connected Account: Personal Profile
                </p>
              </div>
            </div>
            {connections?.linkedin.connected ? (
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-200/40">
                <CheckCircle2 className="w-3 h-3" /> Connected
              </span>
            ) : (
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full border border-amber-200/40">
                Not Connected
              </span>
            )}
          </div>

          <div className="mt-4">
            {connections?.linkedin.connected ? (
              <div className="flex items-center justify-between gap-2">
                <div className="text-[11px] text-slate-500 font-medium truncate">
                  Connected as <span className="font-bold text-slate-800 dark:text-slate-200">{connections.linkedin.connectedAs}</span>
                </div>
                <button
                  onClick={() => handleDisconnect("linkedin")}
                  className="px-2 py-0.5 text-[9px] font-bold text-red-650 bg-red-50 hover:bg-red-100 rounded border border-red-200 cursor-pointer transition shrink-0"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <a
                href={diagnostics?.linkedin.ready ? `/api/admin/social/connect/linkedin?redirect_to=${encodeURIComponent(window.location.pathname)}` : "#"}
                onClick={(e) => {
                  if (!diagnostics?.linkedin.ready) {
                    e.preventDefault();
                    toast.error("LinkedIn configuration is incomplete. Check server environment variables.");
                  }
                }}
                className={`inline-flex items-center justify-center w-full px-3 py-2 text-white rounded-xl text-xs font-bold transition shadow-sm ${
                  diagnostics?.linkedin.ready 
                    ? "bg-blue-600 hover:bg-blue-700 cursor-pointer" 
                    : "bg-slate-350 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                }`}
              >
                Connect LinkedIn (OAuth)
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Posting Status & Triggers */}
      <div className="p-5 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-350">Status & Publishing Actions</span>
          {connections?.instagram.connected && connections?.linkedin.connected && (!initialData.instagramPosted || !initialData.linkedinPosted) && diagnostics?.instagram.ready && diagnostics?.linkedin.ready && (
            <button
              onClick={() => handleOpenPreview("combined")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-750 text-white rounded-xl text-xs font-extrabold transition shadow-md cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Publish to Both Platforms
            </button>
          )}
        </div>

        <div className="space-y-4">
          {/* Instagram Post Panel */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <Instagram className="w-4 h-4 text-pink-600 shrink-0" />
              <div className="space-y-0.5">
                <span className="font-bold">Instagram Feed Post</span>
                <div className="flex items-center gap-2">
                  {initialData.instagramPosted ? (
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                      ✓ Published on {formatPublishDate(initialData.instagramPostedAt)}
                    </span>
                  ) : initialData.instagramError ? (
                    <span className="text-[10px] text-rose-600 font-bold flex items-center gap-0.5" title={initialData.instagramError}>
                      ✕ Failed: {initialData.instagramError.substring(0, 50)}...
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-bold">Not Published</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {initialData.instagramPosted ? (
                <button
                  disabled
                  className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-750"
                >
                  ✓ Already posted to Instagram
                </button>
              ) : connections?.instagram.connected ? (
                <>
                  {itemType === "notice" && !isImageAttachment ? (
                    <div className="flex items-center gap-1 text-[10.5px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-2 rounded-xl border border-amber-500/20">
                      <AlertCircle className="w-3.5 h-3.5" /> Notice PDF attachment is not supported on Instagram
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenPreview("instagram")}
                      disabled={isPostingInstagram || !diagnostics?.instagram.ready}
                      className={`px-3.5 py-2 rounded-xl font-bold transition cursor-pointer active:scale-95 flex items-center gap-1.5 ${
                        diagnostics?.instagram.ready
                          ? "bg-white dark:bg-slate-800 text-pink-600 hover:bg-pink-600 hover:text-white border border-pink-200 dark:border-pink-900"
                          : "bg-slate-105 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-750 cursor-not-allowed"
                      }`}
                    >
                      {isPostingInstagram ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{initialData.instagramError ? "Retry Instagram" : "Preview & Post Instagram"}</span>
                    </button>
                  )}
                </>
              ) : (
                <span className="text-[11px] text-slate-400 font-semibold italic">Connect Instagram to enable</span>
              )}
            </div>
          </div>

          {/* LinkedIn Post Panel */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <Linkedin className="w-4 h-4 text-blue-600 shrink-0" />
              <div className="space-y-0.5">
                <span className="font-bold">LinkedIn Feed Post</span>
                <div className="flex items-center gap-2">
                  {initialData.linkedinPosted ? (
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                      ✓ Published on {formatPublishDate(initialData.linkedinPostedAt)}
                    </span>
                  ) : initialData.linkedinError ? (
                    <span className="text-[10px] text-rose-600 font-bold flex items-center gap-0.5" title={initialData.linkedinError}>
                      ✕ Failed: {initialData.linkedinError.substring(0, 50)}...
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-bold">Not Published</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {initialData.linkedinPosted ? (
                <button
                  disabled
                  className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-750"
                >
                  ✓ Already posted to LinkedIn
                </button>
              ) : connections?.linkedin.connected ? (
                <button
                  onClick={() => handleOpenPreview("linkedin")}
                  disabled={isPostingLinkedin || !diagnostics?.linkedin.ready}
                  className={`px-3.5 py-2 rounded-xl font-bold transition cursor-pointer active:scale-95 flex items-center gap-1.5 ${
                    diagnostics?.linkedin.ready
                      ? "bg-white dark:bg-slate-800 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-200 dark:border-blue-900"
                      : "bg-slate-105 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-750 cursor-not-allowed"
                  }`}
                >
                  {isPostingLinkedin ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{initialData.linkedinError ? "Retry LinkedIn" : "Preview & Post LinkedIn"}</span>
                </button>
              ) : (
                <span className="text-[11px] text-slate-400 font-semibold italic">Connect LinkedIn to enable</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sub-modal for Custom Preview and Submission */}
      {activePreviewPlatform && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden animate-scale-reveal text-slate-800 dark:text-slate-100">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-850/60">
              <h3 className="text-sm sm:text-base font-black uppercase tracking-wider flex items-center gap-2">
                {activePreviewPlatform === "instagram" && <Instagram className="w-5 h-5 text-pink-600" />}
                {activePreviewPlatform === "linkedin" && <Linkedin className="w-5 h-5 text-blue-600" />}
                {activePreviewPlatform === "combined" && <Share2 className="w-5 h-5 text-blue-600" />}
                <span>
                  {activePreviewPlatform === "instagram" && "Instagram Media Preview"}
                  {activePreviewPlatform === "linkedin" && "LinkedIn Post Preview"}
                  {activePreviewPlatform === "combined" && "Combined Social Publishing Preview"}
                </span>
              </h3>
              <button
                onClick={() => {
                  setActivePreviewPlatform(null);
                  setShowConfirm(null);
                }}
                className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto flex-1 space-y-5">
              {/* Attachment Preview */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Media Attachment Preview
                </span>
                
                {isImageAttachment ? (
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
                    <img
                      src={getAssetUrl(attachmentUrl)}
                      alt="Posting Attachment"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-dashed border-slate-250 dark:border-slate-700/60 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {itemType === "notice" ? "PDF Notice Circular" : "Text/Link Announcement"}
                      </h5>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                        {itemType === "notice" ? "Note: LinkedIn will post this as a text notification since it is not an image." : ""}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Editable Captions */}
              {activePreviewPlatform !== "linkedin" && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex justify-between items-center">
                    <span>Instagram Caption (Max 2,200 characters)</span>
                    <span className={`font-semibold ${editedCaption.length > 2200 ? "text-rose-500" : "text-slate-500"}`}>
                      {editedCaption.length} / 2200
                    </span>
                  </label>
                  <textarea
                    value={editedCaption}
                    onChange={(e) => setEditedCaption(e.target.value)}
                    className="w-full h-32 text-xs border border-slate-200 dark:border-slate-750 bg-slate-50/50 dark:bg-slate-950 rounded-2xl p-3.5 focus:bg-white outline-none focus:ring-2 focus:ring-pink-500/40 transition font-medium"
                    placeholder="Enter custom caption for Instagram..."
                  />
                </div>
              )}

              {activePreviewPlatform !== "instagram" && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex justify-between items-center">
                    <span>LinkedIn Commentary Text</span>
                    <span className="font-semibold text-slate-500">
                      {editedLinkedinCaption.length} characters
                    </span>
                  </label>
                  <textarea
                    value={editedLinkedinCaption}
                    onChange={(e) => setEditedLinkedinCaption(e.target.value)}
                    className="w-full h-32 text-xs border border-slate-200 dark:border-slate-750 bg-slate-50/50 dark:bg-slate-950 rounded-2xl p-3.5 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500/40 transition font-medium"
                    placeholder="Enter custom commentary for LinkedIn..."
                  />
                </div>
              )}
            </div>

            {/* Modal Footer / Confirmation Trigger */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/60 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setActivePreviewPlatform(null);
                  setShowConfirm(null);
                }}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-750 dark:text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>

              {showConfirm === null ? (
                <button
                  onClick={() => setShowConfirm(activePreviewPlatform)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-md flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Content</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 animate-fade-in">
                  <span className="text-[11px] font-extrabold text-slate-500">Are you sure?</span>
                  <button
                    onClick={() => {
                      if (activePreviewPlatform === "instagram") {
                        handlePostInstagram(editedCaption);
                        setActivePreviewPlatform(null);
                        setShowConfirm(null);
                      } else if (activePreviewPlatform === "linkedin") {
                        handlePostLinkedin(editedLinkedinCaption);
                        setActivePreviewPlatform(null);
                        setShowConfirm(null);
                      } else if (activePreviewPlatform === "combined") {
                        handleCombinedPost();
                      }
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Confirm Publish
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
