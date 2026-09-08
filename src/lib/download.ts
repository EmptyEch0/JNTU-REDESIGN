import { getAssetUrl } from "./assets";
import { toast } from "sonner";

/**
 * Initiates a direct file download onto the user's device.
 * Uses fetch + blob URL to force the browser to trigger a local file save dialog / download
 * rather than navigating or opening built-in PDF previewers.
 *
 * @param url The relative or absolute URL of the asset/PDF to download
 * @param defaultFilename Optional custom name for the saved file on disk
 */
export async function downloadFile(
  url: string | null | undefined,
  defaultFilename?: string
): Promise<void> {
  if (!url || url.trim() === "" || url.trim() === "#") {
    toast.error("File is not available for download.");
    return;
  }

  const resolvedUrl = getAssetUrl(url.trim());

  // Formulate clean filename
  let filename = defaultFilename?.trim();
  if (!filename) {
    try {
      const parsed = new URL(
        resolvedUrl,
        typeof window !== "undefined" ? window.location.origin : "http://localhost"
      );
      const segments = parsed.pathname.split("/").filter(Boolean);
      const last = segments[segments.length - 1];
      if (last) {
        filename = decodeURIComponent(last);
      }
    } catch {
      filename = url.split("/").pop() || "document.pdf";
    }
  }

  if (!filename || filename === "#") {
    filename = "document.pdf";
  }

  // Ensure appropriate extension if missing
  if (!filename.includes(".")) {
    filename += ".pdf";
  }

  // Sanitize filename of illegal Windows/filesystem characters
  filename = filename.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_").trim();

  const toastId = toast.loading(`Downloading ${filename}...`);

  try {
    const response = await fetch(resolvedUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.style.display = "none";
    anchor.href = blobUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();

    setTimeout(() => {
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(blobUrl);
    }, 1000);

    toast.success("Download completed!", { id: toastId });
  } catch (err: any) {
    console.warn("Direct blob download failed, falling back to standard anchor:", err);

    try {
      const anchor = document.createElement("a");
      anchor.style.display = "none";
      anchor.href = resolvedUrl;
      anchor.download = filename;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      document.body.appendChild(anchor);
      anchor.click();

      setTimeout(() => {
        document.body.removeChild(anchor);
      }, 1000);

      toast.success("Download started!", { id: toastId });
    } catch (fallbackErr) {
      console.error("Download fallback failed:", fallbackErr);
      toast.error("Could not download file directly. Opening in new tab...", { id: toastId });
      window.open(resolvedUrl, "_blank");
    }
  }
}

/**
 * Opens a file in a new browser tab for inline preview.
 *
 * @param url The relative or absolute URL of the asset/PDF to preview
 */
export function previewFile(url: string | null | undefined): void {
  if (!url || url.trim() === "" || url.trim() === "#") {
    toast.error("Document preview is currently unavailable.");
    return;
  }
  const resolvedUrl = getAssetUrl(url.trim());
  window.open(resolvedUrl, "_blank", "noopener,noreferrer");
}
