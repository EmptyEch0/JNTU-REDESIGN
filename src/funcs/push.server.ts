import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { pushSubscriptions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

let isVapidConfigured = false;
let _webpushModule: any = null;

async function getWebPush() {
  if (!_webpushModule) {
    _webpushModule = (await import("web-push")).default;
  }
  return _webpushModule;
}

async function ensureVapidConfig() {
  if (isVapidConfigured) return true;

  const publicKey = process.env.VAPID_PUBLIC_KEY || process.env.VITE_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:admin@jntugvcev.edu.in";

  if (!publicKey || !privateKey) {
    console.warn("VAPID keys not configured in environment. Push notifications disabled.");
    return false;
  }

  try {
    const webpush = await getWebPush();
    webpush.setVapidDetails(subject, publicKey, privateKey);
    isVapidConfigured = true;
    return true;
  } catch (err) {
    console.error("Failed to initialize web-push VAPID details:", err);
    return false;
  }
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
  icon?: string;
  badge?: string;
}

/**
 * Server utility to broadcast a push notification to all stored subscribers.
 * Automatically cleans up expired / revoked subscriptions (HTTP 410 / 404).
 */
export async function sendPushToAllSubscribers(payload: PushPayload) {
  const configured = await ensureVapidConfig();
  if (!configured) {
    console.warn("Skipping push broadcast: VAPID not configured.");
    return { success: false, reason: "VAPID not configured" };
  }

  try {
    const webpush = await getWebPush();
    const subs = await db.select().from(pushSubscriptions);
    if (subs.length === 0) {
      console.log("Push broadcast skipped: No subscribers in database.");
      return { success: true, count: 0, sent: 0 };
    }

    console.log(`Broadcasting push notification to ${subs.length} subscribers...`);

    const jsonPayload = JSON.stringify({
      title: payload.title,
      body: payload.body,
      url: payload.url || "/notices",
      tag: payload.tag || "jntugv-update",
      icon: payload.icon || "/logo-circle.png",
      badge: payload.badge || "/favicon.png",
    });

    const deadEndpoints: string[] = [];
    let successCount = 0;

    const pushPromises = subs.map(async (sub) => {
      const pushSub = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      };

      try {
        await webpush.sendNotification(pushSub, jsonPayload, {
          TTL: 86400, // 24 hours
          urgency: "high",
        });
        successCount++;
      } catch (err: any) {
        if (err.statusCode === 410 || err.statusCode === 404) {
          // Subscription has expired or user revoked it
          deadEndpoints.push(sub.endpoint);
        } else {
          console.error(`Error sending push to ${sub.endpoint.slice(0, 30)}...:`, err.message || err);
        }
      }
    });

    await Promise.allSettled(pushPromises);

    // Clean up expired subscriptions from DB
    if (deadEndpoints.length > 0) {
      console.log(`Cleaning up ${deadEndpoints.length} expired subscriptions...`);
      for (const endpoint of deadEndpoints) {
        await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, endpoint)).catch(() => {});
      }
    }

    console.log(`Push broadcast finished: ${successCount}/${subs.length} sent successfully.`);
    return { success: true, count: subs.length, sent: successCount, removed: deadEndpoints.length };
  } catch (err: any) {
    console.error("sendPushToAllSubscribers failed:", err);
    return { success: false, error: err.message || String(err) };
  }
}

/**
 * Server function: Get public VAPID key so client can subscribe without hardcoding.
 */
export const getVapidPublicKey = createServerFn({ method: "GET" }).handler(async () => {
  const publicKey = process.env.VAPID_PUBLIC_KEY || process.env.VITE_VAPID_PUBLIC_KEY || "";
  return { publicKey };
});

/**
 * Server function: Save or update client's push subscription
 */
export const savePushSubscription = createServerFn({ method: "POST" })
  .validator((data: { endpoint: string; p256dh: string; auth: string; userAgent?: string }) => data)
  .handler(async ({ data }) => {
    try {
      if (!data.endpoint || !data.p256dh || !data.auth) {
        return { success: false, error: "Missing required subscription parameters." };
      }

      const existing = await db
        .select({ id: pushSubscriptions.id })
        .from(pushSubscriptions)
        .where(eq(pushSubscriptions.endpoint, data.endpoint));

      if (existing.length > 0) {
        await db
          .update(pushSubscriptions)
          .set({
            p256dh: data.p256dh,
            auth: data.auth,
            userAgent: data.userAgent || null,
          })
          .where(eq(pushSubscriptions.endpoint, data.endpoint));
      } else {
        await db.insert(pushSubscriptions).values({
          endpoint: data.endpoint,
          p256dh: data.p256dh,
          auth: data.auth,
          userAgent: data.userAgent || null,
        });
      }

      return { success: true };
    } catch (err: any) {
      console.error("Failed to save push subscription:", err);
      return { success: false, error: err.message || "Failed to save subscription" };
    }
  });

/**
 * Server function: Unsubscribe client's endpoint
 */
export const removePushSubscription = createServerFn({ method: "POST" })
  .validator((data: { endpoint: string }) => data)
  .handler(async ({ data }) => {
    try {
      if (!data.endpoint) return { success: false };
      await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, data.endpoint));
      return { success: true };
    } catch (err: any) {
      console.error("Failed to remove push subscription:", err);
      return { success: false };
    }
  });

/**
 * Server function: Get total count of push subscribers for Admin stats
 */
export const getPushSubscriberStats = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const result = await db.select({ count: sql<number>`count(*)::int` }).from(pushSubscriptions);
    return { count: result[0]?.count || 0 };
  } catch {
    return { count: 0 };
  }
});

/**
 * Server function: Admin manual trigger or test notification
 */
export const sendManualPushNotification = createServerFn({ method: "POST" })
  .validator((data: { title: string; body: string; url?: string; tag?: string }) => data)
  .handler(async ({ data }) => {
    try {
      const res = await sendPushToAllSubscribers({
        title: data.title,
        body: data.body,
        url: data.url || "/notices",
        tag: data.tag || `manual-${Date.now()}`,
      });
      return res;
    } catch (err: any) {
      console.error("Manual push failed:", err);
      return { success: false, error: err.message };
    }
  });
