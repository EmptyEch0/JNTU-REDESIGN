import { useState, useEffect } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-background/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
      <div className="bg-card p-8 rounded-3xl shadow-elegant border border-border flex flex-col items-center max-w-sm mx-4 text-center">
        <div className="w-48 h-48 mb-4">
          <DotLottieReact
            src="/0ee7e840-1153-11ee-9e6c-ffb7dcbc89ca.json"
            loop
            autoplay
          />
        </div>
        <h2 className="text-xl font-bold text-ink mb-2">No Internet Connection</h2>
        <p className="text-sm text-muted-foreground">
          Please check your network connection to continue browsing the site.
        </p>
      </div>
    </div>
  );
}
