import { useState, useEffect, useCallback } from "react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const FALLBACK_VAPID_PUBLIC_KEY =
  "BD1s6zOfEGWlhKZ1yscLf-TrMCGSLiIGZl8t5of5hJJapWfs0f2FaiiTmvlRcjiAzZkjpHJ8LJ7lH2v935PKO9E";

let cachedRegistration: ServiceWorkerRegistration | null = null;

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check support & current subscription on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const supported =
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;

    setIsSupported(supported);

    if (!supported) {
      setLoading(false);
      return;
    }

    setPermission(Notification.permission);

    // Register service worker and pre-cache existing subscription
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then(async (reg) => {
        cachedRegistration = reg;
        const sub = await reg.pushManager.getSubscription();
        setIsSubscribed(Boolean(sub));
      })
      .catch((err) => {
        console.warn("Service worker registration notice:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const subscribe = useCallback(async () => {
    if (!isSupported) {
      setError("Push notifications are not supported in this browser.");
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Request browser permission immediately
      const currentPermission = await Notification.requestPermission();
      setPermission(currentPermission);

      if (currentPermission !== "granted") {
        setError("Notification permission was not granted.");
        setLoading(false);
        return false;
      }

      // 2. Resolve VAPID public key instantly without extra blocking roundtrip
      const vapidKey =
        (import.meta as any).env?.VITE_VAPID_PUBLIC_KEY ||
        FALLBACK_VAPID_PUBLIC_KEY;

      // 3. Ensure Service Worker registration is ready
      const registration = cachedRegistration || (await navigator.serviceWorker.ready);
      cachedRegistration = registration;

      // 4. Subscribe to browser push service
      const convertedKey = urlBase64ToUint8Array(vapidKey);
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedKey,
        });
      }

      // 5. Send subscription to server endpoint asynchronously
      const subJson = subscription.toJSON();
      const endpoint = subscription.endpoint;
      const p256dh = subJson.keys?.p256dh || "";
      const auth = subJson.keys?.auth || "";

      if (!endpoint || !p256dh || !auth) {
        throw new Error("Failed to extract subscription encryption keys.");
      }

      const saveRes = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint,
          p256dh,
          auth,
        }),
      });

      const saveJson = await saveRes.json();

      if (saveJson && saveJson.success) {
        setIsSubscribed(true);
        localStorage.setItem("jntugv_push_subscribed", "true");
        localStorage.removeItem("jntugv_push_dismissed_until");
        setLoading(false);
        return true;
      } else {
        throw new Error(saveJson?.error || "Failed to save subscription to database");
      }
    } catch (err: any) {
      console.error("Subscription failed:", err);
      setError(err.message || "Failed to enable notifications");
      setLoading(false);
      return false;
    }
  }, [isSupported]);

  const unsubscribe = useCallback(async () => {
    if (!isSupported) return false;

    setLoading(true);
    setError(null);

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        const endpoint = subscription.endpoint;
        await subscription.unsubscribe();
        await fetch("/api/push/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint }),
        });
      }

      setIsSubscribed(false);
      localStorage.removeItem("jntugv_push_subscribed");
      setLoading(false);
      return true;
    } catch (err: any) {
      console.error("Unsubscribe failed:", err);
      setError(err.message || "Failed to unsubscribe");
      setLoading(false);
      return false;
    }
  }, [isSupported]);

  return {
    isSupported,
    permission,
    isSubscribed,
    loading,
    error,
    subscribe,
    unsubscribe,
  };
}
