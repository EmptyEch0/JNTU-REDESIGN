import { toast as sonnerToast } from "sonner";

export type FeedbackType = "saved" | "updated" | "deleted" | "error" | "info";

export interface ActionFeedbackEvent {
  id: string;
  type: FeedbackType;
  title: string;
  message?: string;
  duration?: number;
}

type Listener = (event: ActionFeedbackEvent | null) => void;
const listeners: Set<Listener> = new Set();

let currentTimeout: ReturnType<typeof setTimeout> | null = null;

export const showActionFeedback = (options: {
  type: FeedbackType;
  title?: string;
  message?: string;
  duration?: number;
}) => {
  const { type, title, message, duration = 2400 } = options;

  const defaultTitles: Record<FeedbackType, string> = {
    saved: "Saved Successfully",
    updated: "Updated Successfully",
    deleted: "Deleted Successfully",
    error: "Action Failed",
    info: "Notification",
  };

  const finalTitle = title || defaultTitles[type];
  const event: ActionFeedbackEvent = {
    id: Math.random().toString(36).substring(2, 9),
    type,
    title: finalTitle,
    message: message && message !== finalTitle ? message : undefined,
    duration,
  };

  listeners.forEach((listener) => listener(event));

  if (currentTimeout) clearTimeout(currentTimeout);
  currentTimeout = setTimeout(() => {
    listeners.forEach((listener) => listener(null));
  }, duration);
};

export const dismissActionFeedback = () => {
  if (currentTimeout) clearTimeout(currentTimeout);
  listeners.forEach((listener) => listener(null));
};

export const subscribeActionFeedback = (listener: Listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const notifySaved = (message?: string, title = "Changes Saved") => {
  showActionFeedback({ type: "saved", title, message });
};

export const notifyUpdated = (message?: string, title = "Updated Successfully") => {
  showActionFeedback({ type: "updated", title, message });
};

export const notifyDeleted = (message?: string, title = "Deleted Successfully") => {
  showActionFeedback({ type: "deleted", title, message });
};

export const notifyError = (message?: string, title = "Action Failed") => {
  showActionFeedback({ type: "error", title, message });
};

/**
 * Automatically hook Sonner toast methods so existing calls across the app
 * trigger the centered feedback modal seamlessly without altering hundreds of files.
 */
let isHooked = false;
export const initToastFeedbackInterceptor = () => {
  if (typeof window === "undefined" || isHooked) return;
  isHooked = true;

  const originalSuccess = sonnerToast.success;
  const originalError = sonnerToast.error;

  sonnerToast.success = ((message: any, options?: any) => {
    const str = typeof message === "string" ? message : (message?.toString?.() || "");
    const lower = str.toLowerCase();

    if (lower.includes("delet") || lower.includes("remov") || lower.includes("trash")) {
      showActionFeedback({ type: "deleted", title: "Deleted Successfully", message: str });
    } else if (
      lower.includes("updat") ||
      lower.includes("modifi") ||
      lower.includes("edit") ||
      lower.includes("publish") ||
      lower.includes("reorder")
    ) {
      showActionFeedback({ type: "updated", title: "Updated Successfully", message: str });
    } else if (
      lower.includes("save") ||
      lower.includes("creat") ||
      lower.includes("add") ||
      lower.includes("upload") ||
      lower.includes("seed") ||
      lower.includes("verifi") ||
      lower.includes("success")
    ) {
      showActionFeedback({ type: "saved", title: "Saved Successfully", message: str });
    } else {
      showActionFeedback({ type: "saved", title: "Success", message: str });
    }

    return originalSuccess(message, options);
  }) as any;

  sonnerToast.error = ((message: any, options?: any) => {
    const str = typeof message === "string" ? message : (message?.toString?.() || "An error occurred");
    showActionFeedback({ type: "error", title: "Action Failed", message: str });
    return originalError(message, options);
  }) as any;
};
