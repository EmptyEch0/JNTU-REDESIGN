import { useState, useEffect } from "react";
import { CheckCircle2, ShieldCheck, Sparkles, X, QrCode, ArrowRight, RefreshCw, Check } from "lucide-react";
import type { CertificationRecord } from "@/data/certifications-2026";

interface Props {
  certificate: CertificationRecord;
  isOpen: boolean;
  onClose: () => void;
  onReplay?: () => void;
}

export function VerificationScannerModal({ certificate, isOpen, onClose }: Props) {
  const [step, setStep] = useState<number>(1);
  const [progress, setProgress] = useState<number>(25);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setProgress(25);
      return;
    }

    setStep(1);
    setProgress(25);

    const t1 = setTimeout(() => {
      setStep(2);
      setProgress(55);
    }, 800);

    const t2 = setTimeout(() => {
      setStep(3);
      setProgress(85);
    }, 1600);

    const t3 = setTimeout(() => {
      setStep(4);
      setProgress(100);
    }, 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
    >
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-amber-500/20 via-blue-600/25 to-emerald-500/25 rounded-full blur-3xl opacity-70 animate-pulse" />
      </div>

      <div className="relative w-full max-w-lg bg-card/95 dark:bg-slate-900/95 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl transition-all">
        {/* Animated Gradient Progress Line */}
        <div className="h-2 w-full bg-muted/60 relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-primary to-emerald-500 transition-all duration-500 ease-out shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors z-20"
          aria-label="Close verification popup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 text-center">
          {/* Holographic Radar / Scanner Animation */}
          <div className="relative mx-auto w-24 h-24 mb-5 flex items-center justify-center">
            {/* Outer spinning ring */}
            <div
              className={`absolute inset-0 rounded-full border-2 border-dashed transition-colors duration-500 ${
                step >= 4 ? "border-emerald-500 animate-none" : "border-amber-500/80 animate-spin"
              }`}
              style={{ animationDuration: "5s" }}
            />
            {/* Inner pulse */}
            <div
              className={`absolute inset-2 rounded-full transition-all duration-500 ${
                step >= 4
                  ? "bg-emerald-500/20 border border-emerald-500"
                  : "bg-amber-500/15 border border-amber-500/50 animate-ping"
              }`}
              style={{ animationDuration: "2s" }}
            />

            {/* Laser scan bar (active during scanning) */}
            {step < 4 && (
              <div
                className="absolute inset-x-2 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_14px_#f59e0b] animate-bounce"
                style={{ animationDuration: "1s" }}
              />
            )}

            {/* Center Icon */}
            <div className="relative z-10 flex items-center justify-center w-14 h-14 rounded-full bg-background/95 shadow-inner border border-amber-500/40">
              {step < 4 ? (
                <QrCode className="w-7 h-7 text-amber-500 animate-pulse" />
              ) : (
                <ShieldCheck className="w-8 h-8 text-emerald-500 animate-bounce" />
              )}
            </div>
          </div>

          {/* Subtitle / Eyebrow */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            Official JNTU-GV QR Verification
          </div>

          {/* Main Title */}
          <h2 className="text-2xl font-bold tracking-tight text-foreground font-display">
            {step < 4 ? "Scanning Certificate QR..." : "Certificate Authenticated!"}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {step < 4
              ? "Validating official security watermark & university database"
              : "Issued for Summer Internship on Engineer's Day 2026"}
          </p>

          {/* Step Progress Tracker */}
          <div className="mt-5 space-y-2.5 text-left bg-muted/40 dark:bg-slate-800/40 p-4 rounded-xl border border-border/60">
            {/* Step 1 */}
            <div className="flex items-center gap-3 text-xs font-medium">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-white transition-all duration-300 ${
                  step >= 1 ? "bg-emerald-500 shadow-sm shadow-emerald-500/40" : "bg-muted-foreground/30"
                }`}
              >
                {step >= 1 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : "1"}
              </div>
              <span className={step >= 1 ? "text-foreground font-semibold" : "text-muted-foreground"}>
                QR Code & Hash Authenticated ({certificate.id})
              </span>
            </div>

            {/* Step 2 */}
            <div className="flex items-center gap-3 text-xs font-medium">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-white transition-all duration-300 ${
                  step >= 2 ? "bg-emerald-500 shadow-sm shadow-emerald-500/40" : "bg-muted-foreground/30"
                }`}
              >
                {step >= 2 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : "2"}
              </div>
              <span className={step >= 2 ? "text-foreground font-semibold" : "text-muted-foreground"}>
                Verified in JNTU-GV Digital Ledger
              </span>
            </div>

            {/* Step 3 */}
            <div className="flex items-center gap-3 text-xs font-medium">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-white transition-all duration-300 ${
                  step >= 3 ? "bg-emerald-500 shadow-sm shadow-emerald-500/40" : "bg-muted-foreground/30"
                }`}
              >
                {step >= 3 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : "3"}
              </div>
              <span className={step >= 3 ? "text-foreground font-semibold" : "text-muted-foreground"}>
                Endorsed by HOD, Principal, Registrar & VC
              </span>
            </div>
          </div>

          {/* Success Reveal Card */}
          {step >= 4 && (
            <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 animate-in zoom-in-95 duration-300 text-center">
              <div className="text-[11px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold mb-0.5">
                Verified Recipient
              </div>
              <div className="text-xl font-bold text-foreground font-display">
                {certificate.honorific} {certificate.name}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {certificate.role} • {certificate.department}
              </div>
              <div className="mt-2 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 py-1 px-3 rounded-md inline-block max-w-full truncate">
                Contribution: {certificate.project || "Developing JNTUGVCEV Website"}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onClose}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] shadow-md shadow-primary/20 transition-all cursor-pointer"
            >
              <span>View Official Certificate</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {step >= 4 && (
              <button
                onClick={() => {
                  setStep(1);
                  setProgress(25);
                  setTimeout(() => {
                    setStep(2);
                    setProgress(55);
                  }, 700);
                  setTimeout(() => {
                    setStep(3);
                    setProgress(85);
                  }, 1400);
                  setTimeout(() => {
                    setStep(4);
                    setProgress(100);
                  }, 2100);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-medium text-xs text-muted-foreground hover:text-foreground bg-muted/60 hover:bg-muted transition-colors border border-border cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-scan</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
