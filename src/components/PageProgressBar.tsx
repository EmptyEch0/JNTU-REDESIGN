import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

export function PageProgressBar() {
  const isLoading = useRouterState({ select: (s) => s.status === "pending" });
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let incrementTimer: NodeJS.Timeout;
    let spinnerTimer: NodeJS.Timeout;

    if (isLoading) {
      setVisible(true);
      setProgress(15);

      // Show centered 4-dots spinner if navigation takes more than 60ms
      spinnerTimer = setTimeout(() => {
        setShowSpinner(true);
      }, 60);

      // Gradually increase progress while loading
      incrementTimer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 85) {
            clearInterval(incrementTimer);
            return 85;
          }
          const step = (90 - prev) * 0.1;
          return prev + Math.max(step, 1);
        });
      }, 150);
    } else {
      // Finish loading animation
      setProgress(100);
      setShowSpinner(false);
      timer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 300);
    }

    return () => {
      clearTimeout(timer);
      clearTimeout(spinnerTimer);
      clearInterval(incrementTimer);
    };
  }, [isLoading]);

  if (!visible && progress === 0) return null;

  return (
    <>
      {/* Top 3px progress bar */}
      <div
        className="fixed top-0 left-0 right-0 z-[9999] h-1 pointer-events-none overflow-hidden bg-transparent"
        aria-hidden="true"
      >
        <div
          className="h-full bg-gradient-to-r from-primary via-accent to-sky-400 transition-all duration-200 ease-out shadow-[0_0_10px_rgba(var(--primary-rgb,59,130,246),0.7)]"
          style={{
            width: `${progress}%`,
            opacity: visible ? 1 : 0,
            transition: progress === 100 ? "width 150ms ease-out, opacity 250ms ease-in 100ms" : "width 200ms ease-out",
          }}
        />
      </div>

      {/* Centered 4-dots spinner overlay (matching Image 2) for all page transitions */}
      {showSpinner && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center bg-[oklch(0.972_0.012_85/0.65)] backdrop-blur-[3px] pointer-events-none animate-[fade-in_0.15s_ease-out]">
          <div className="spinner scale-125"></div>
        </div>
      )}
    </>
  );
}
