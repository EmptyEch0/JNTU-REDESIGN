import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import {
  Bell,
  BellRing,
  BellOff,
  X,
  CheckCircle2,
  Sparkles,
  Loader2,
  ShieldCheck,
  Zap,
  Clock,
  ChevronRight,
  Volume2,
  Layers
} from "lucide-react";
import { toast } from "sonner";

export function PushNotificationBanner() {
  const { isSupported, permission, isSubscribed, loading, subscribe } = usePushNotifications();
  const [isVisible, setIsVisible] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!isSupported || loading) return;

    // Do not show if already subscribed or blocked
    if (isSubscribed || permission === "denied") {
      setIsVisible(false);
      return;
    }

    // Check if user dismissed recently
    const dismissedUntil = localStorage.getItem("jntugv_push_dismissed_until");
    if (dismissedUntil && Date.now() < Number(dismissedUntil)) {
      return;
    }

    // Delay prompt slightly so page settles gracefully
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2800);

    return () => clearTimeout(timer);
  }, [isSupported, loading, isSubscribed, permission]);

  const handleAllow = async () => {
    setSubscribing(true);
    const success = await subscribe();
    setSubscribing(false);

    if (success) {
      setIsVisible(false);
      toast.success("Push Notifications Enabled! 🎉", {
        description: "You will now receive instant alerts for exams, timetables, and official college circulars.",
        icon: <BellRing className="w-4 h-4 text-emerald-500" />,
      });
    } else {
      toast.error("Could not enable push notifications", {
        description: "Please check your browser permissions settings or try again.",
      });
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Dismiss for 3 days
    localStorage.setItem("jntugv_push_dismissed_until", String(Date.now() + 3 * 24 * 60 * 60 * 1000));
  };

  if (!isVisible || !isSupported || isSubscribed || permission === "denied") {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="fixed bottom-5 right-5 z-[99] max-w-[400px] w-[calc(100vw-2.5rem)]"
        >
          {/* Outer glow aura */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#0F4C81]/30 via-blue-500/25 to-amber-500/25 rounded-[2rem] blur-xl opacity-60 dark:opacity-40 animate-pulse pointer-events-none" />

          <div className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-slate-900/85 backdrop-blur-3xl border border-white/70 dark:border-white/10 shadow-[0_25px_60px_-15px_rgba(15,76,129,0.35)] p-5 text-slate-800 dark:text-slate-100 ring-1 ring-black/5">
            {/* Background Decorative Mesh */}
            <div className="absolute -top-14 -right-14 w-40 h-40 bg-gradient-to-br from-blue-500/20 via-[#0F4C81]/20 to-transparent rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

            {/* Header / Top Bar */}
            <div className="flex items-start justify-between gap-3 relative z-10">
              <div className="flex items-center gap-3">
                {/* Animated Bell Icon Container */}
                <div className="relative">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0F4C81] via-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-900/25 border border-white/30 backdrop-blur-md">
                    <BellRing className="w-5 h-5 text-amber-300 animate-bounce" />
                  </div>
                  {/* Radar ping dot */}
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 ring-2 ring-white dark:ring-slate-900" />
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-500/10 dark:bg-blue-400/15 text-[#0F4C81] dark:text-blue-300 border border-blue-500/20 dark:border-blue-400/25 backdrop-blur-sm">
                      <Sparkles className="w-2.5 h-2.5 text-amber-500" /> JNTU-GV Alerts
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-400/15 px-2 py-0.5 rounded-full border border-emerald-500/20 dark:border-emerald-400/25 backdrop-blur-sm">
                      Live
                    </span>
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5 tracking-tight">
                    Never Miss an Official Notice
                  </h3>
                </div>
              </div>

              {/* Dismiss button */}
              <button
                onClick={handleDismiss}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 shrink-0 cursor-pointer"
                aria-label="Dismiss notifications prompt"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Description Body */}
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2.5 relative z-10 font-medium">
              Get instant alerts on your phone or laptop whenever new exam schedules, fee circulars, or timetables are published.
            </p>

            {/* Benefit Feature Chips */}
            <div className="grid grid-cols-2 gap-1.5 mt-3 relative z-10">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-700 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-800/60 px-2 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                <Zap className="w-3 h-3 text-amber-500 shrink-0" />
                <span className="truncate">Instant Exam Alerts</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-700 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-800/60 px-2 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                <Clock className="w-3 h-3 text-blue-500 shrink-0" />
                <span className="truncate">Class Timetables</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-700 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-800/60 px-2 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                <Layers className="w-3 h-3 text-emerald-500 shrink-0" />
                <span className="truncate">Campus Circulars</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-700 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-800/60 px-2 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                <ShieldCheck className="w-3 h-3 text-violet-500 shrink-0" />
                <span className="truncate">100% Free & No Spam</span>
              </div>
            </div>

            {/* Optional Interactive Notification Preview Toggle */}
            <div className="mt-3 relative z-10">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Volume2 className="w-3 h-3" />
                {showPreview ? "Hide notification preview" : "See what notifications look like"}
              </button>

              {showPreview && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 p-2.5 rounded-xl bg-gradient-to-r from-slate-900 to-blue-950 text-white shadow-inner border border-blue-500/30 text-left overflow-hidden"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <img src="/favicon.png" alt="JNTU-GV" className="w-4 h-4 rounded-full" />
                    <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider">JNTU-GV College Alert</span>
                    <span className="text-[9px] text-slate-400 ml-auto">Just now</span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-100">📢 End Semester Examination Timetable Released</div>
                  <div className="text-[10px] text-slate-300 mt-0.5">B.Tech R20 & R23 Regular / Supplementary Schedules are now available.</div>
                </motion.div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex items-center gap-2.5 pt-3 border-t border-slate-150 dark:border-slate-800/80 relative z-10">
              <button
                onClick={handleAllow}
                disabled={subscribing}
                className="relative group flex-1 overflow-hidden bg-gradient-to-r from-[#0F4C81] via-blue-600 to-indigo-700 hover:from-[#0D3F6D] hover:via-blue-700 hover:to-indigo-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md hover:shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

                {subscribing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4 text-amber-300" />
                    <span>Allow Notifications</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>

              <button
                onClick={handleDismiss}
                className="px-3.5 py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 transition rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Later
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Compact high-precision toggle button for TopRibbon header.
 */
export function PushNotificationToggle() {
  const { isSupported, isSubscribed, loading, subscribe, unsubscribe } = usePushNotifications();
  const [toggling, setToggling] = useState(false);

  if (!isSupported) return null;

  const handleToggle = async () => {
    setToggling(true);
    if (isSubscribed) {
      const res = await unsubscribe();
      if (res) {
        toast.info("Push Notifications Muted", {
          description: "You have unsubscribed from real-time campus alerts.",
          icon: <BellOff className="w-4 h-4 text-slate-400" />
        });
      }
    } else {
      const res = await subscribe();
      if (res) {
        toast.success("Push Notifications Enabled!", {
          description: "You'll receive instant alerts whenever new notices or timetables are posted.",
          icon: <BellRing className="w-4 h-4 text-emerald-500" />
        });
      }
    }
    setToggling(false);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={toggling || loading}
      className={`group relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all duration-200 cursor-pointer border shadow-sm ${
        isSubscribed
          ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/40 hover:bg-emerald-500/25 ring-1 ring-emerald-400/20"
          : "bg-white/10 text-slate-200 hover:bg-white/20 border-white/20 hover:text-white"
      }`}
      title={isSubscribed ? "Push Notifications Active (Click to mute)" : "Enable instant campus notifications"}
      aria-label={isSubscribed ? "Disable push notifications" : "Enable push notifications"}
    >
      {toggling || loading ? (
        <Loader2 className="w-3 h-3 animate-spin text-current" />
      ) : isSubscribed ? (
        <div className="relative flex items-center">
          <BellRing className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
        </div>
      ) : (
        <Bell className="w-3 h-3 text-amber-300 group-hover:scale-110 transition-transform" />
      )}
      <span className="hidden sm:inline">
        {isSubscribed ? "Alerts ON" : "Get Alerts"}
      </span>
    </button>
  );
}

/**
 * High-impact interactive Push Notification card for Notice Board (`/notices`)
 */
export function NoticesPushBanner() {
  const { isSupported, isSubscribed, loading, subscribe, unsubscribe, permission } = usePushNotifications();
  const [toggling, setToggling] = useState(false);

  if (!isSupported || permission === "denied") return null;

  const handleAction = async () => {
    setToggling(true);
    if (isSubscribed) {
      await unsubscribe();
      toast.info("Notifications Turned Off");
    } else {
      const ok = await subscribe();
      if (ok) {
        toast.success("Subscribed to Campus Alerts!");
      }
    }
    setToggling(false);
  };

  return (
    <div className="mb-6 relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0F4C81] via-blue-900 to-indigo-950 text-white p-4 sm:p-5 shadow-xl border border-blue-400/20">
      {/* Decorative background aura */}
      <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
      <div className="absolute -bottom-10 right-10 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
            {isSubscribed ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            ) : (
              <BellRing className="w-6 h-6 text-amber-300 animate-pulse" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Official Web Push
              </span>
              {isSubscribed && (
                <span className="text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Active on this browser
                </span>
              )}
            </div>
            <h4 className="text-sm sm:text-base font-bold text-white mt-1">
              {isSubscribed
                ? "You are receiving real-time campus notifications"
                : "Get notified instantly when new notices or timetables are posted"}
            </h4>
            <p className="text-xs text-blue-100/80 mt-0.5">
              {isSubscribed
                ? "Whenever college administration publishes or updates a notice, you receive an instant alert on your device."
                : "No app installation required. Works directly on your phone and laptop browsers for free."}
            </p>
          </div>
        </div>

        <button
          onClick={handleAction}
          disabled={toggling || loading}
          className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50 ${
            isSubscribed
              ? "bg-white/10 hover:bg-white/20 text-white border border-white/20"
              : "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-amber-500/25"
          }`}
        >
          {toggling || loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : isSubscribed ? (
            <>
              <BellOff className="w-3.5 h-3.5 text-slate-300" />
              <span>Mute Alerts</span>
            </>
          ) : (
            <>
              <Bell className="w-3.5 h-3.5 text-slate-950" />
              <span>Turn On Alerts</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
