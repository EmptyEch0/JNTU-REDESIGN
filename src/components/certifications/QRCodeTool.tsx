import { useState } from "react";
import { Copy, Check, Download, QrCode, ExternalLink, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface Props {
  certificateId: string;
  verificationUrl: string;
  recipientName: string;
}

export function QRCodeTool({ certificateId, verificationUrl, recipientName }: Props) {
  const [copied, setCopied] = useState(false);
  const [customUrl, setCustomUrl] = useState(verificationUrl);

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
    customUrl
  )}&bgcolor=ffffff&color=0f172a&margin=2`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(customUrl);
      setCopied(true);
      toast.success("Verification Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleDownloadQR = async () => {
    try {
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `jntugv-qr-${certificateId.toLowerCase()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("QR Code downloaded successfully!");
    } catch {
      window.open(qrImageUrl, "_blank");
    }
  };

  return (
    <div className="bg-card/90 dark:bg-slate-900/90 border border-border/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-base">Certificate QR & Link Generator</h3>
            <p className="text-xs text-muted-foreground">
              Official QR code linked to this digital verification record
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <Sparkles className="w-3 h-3" /> Live
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Left: Scannable QR Code display */}
        <div className="flex flex-col items-center justify-center text-center p-4 bg-white rounded-xl border border-slate-200 shadow-inner">
          <img
            src={qrImageUrl}
            alt={`QR Code for ${recipientName}`}
            className="w-40 h-40 object-contain rounded-lg transition-transform hover:scale-105 duration-200"
          />
          <span className="mt-2 text-[11px] font-mono text-slate-500">Scan to view verification</span>
        </div>

        {/* Right: Link & Download Tools */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
              Official Verification URL
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="w-full text-xs font-mono bg-muted/60 dark:bg-slate-800/60 border border-input rounded-lg px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleCopyLink}
                className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors shadow-sm"
                title="Copy Link"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
          </div>

          <div className="text-xs text-muted-foreground leading-relaxed">
            <p>
              💡 <strong>For designers & printing:</strong> Use this QR Code on physical certificates or
              ID badges. When recipients scan it with their phone camera, they will be redirected to
              this verified showcase with the animated validation popup.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleDownloadQR}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs font-semibold transition-colors border border-border"
            >
              <Download className="w-4 h-4" />
              <span>Download QR Code (PNG)</span>
            </button>

            <a
              href={customUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-muted/70 hover:bg-muted text-foreground text-xs font-medium transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Test Link in New Tab</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
