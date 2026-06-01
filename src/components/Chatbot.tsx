import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { X, SendHorizontal, Bot, User } from "lucide-react";
import { queryChatbot } from "@/funcs/site.server";

// Lazy-load DotLottie so it NEVER runs during SSR (avoids the addListener WASM crash)
const DotLottieReact = lazy(() =>
  import("@lottiefiles/dotlottie-react").then((m) => ({ default: m.DotLottieReact }))
);

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export function Chatbot() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi there! I am JNTU AI, your smart digital campus companion. How can I help you today? 😊",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Only render Lottie after client hydration
  useEffect(() => {
    setMounted(true);
    // Show greeting bubble after 1.2s, hide after 5s
    const showTimer = setTimeout(() => setShowGreeting(true), 1200);
    const hideTimer = setTimeout(() => setShowGreeting(false), 6000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await queryChatbot({
        data: { messages: [...messages, userMessage] },
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble right now. Please try again in a bit! 😊",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-[999] font-sans flex flex-col items-end select-none">

      {/* ── Chat panel ──────────────────────────────────────── */}
      {isOpen && (
        <div
          style={{
            width: "480px",
            height: "620px",
            maxHeight: "85vh",
            animation: "chatSlideUp 0.35s cubic-bezier(0.34,1.56,0.64,1)",
          }}
          className="mb-2 flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 shadow-[0_24px_60px_rgba(0,0,0,0.18)] bg-white/97 backdrop-blur-md"
        >
          {/* Header */}
          <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 shadow-md">
            <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-4 left-10 h-24 w-24 rounded-full bg-indigo-500/10 blur-2xl" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Avatar in header — client only */}
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-white/10 ring-2 ring-white/20">
                  {mounted && (
                    <Suspense fallback={<div className="h-12 w-12 rounded-full bg-white/10" />}>
                      <DotLottieReact
                        src="/CHATBOT.lottie"
                        autoplay
                        loop
                        style={{ width: "48px", height: "48px" }}
                      />
                    </Suspense>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold tracking-wide text-white leading-none">
                      JNTU AI
                    </h3>
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <span className="mt-1 block text-[10px] font-semibold uppercase tracking-widest text-white/50">
                    Campus Guide
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/10 transition hover:bg-white/25"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-slate-50/60 p-5 space-y-4 no-scrollbar">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${
                  msg.role === "user"
                    ? "ml-auto flex-row-reverse max-w-[88%]"
                    : "mr-auto max-w-[88%]"
                }`}
              >
                <div
                  className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center ${
                    msg.role === "user"
                      ? "bg-slate-900 text-white"
                      : "bg-blue-50 text-blue-600 border border-blue-100"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>

                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                    msg.role === "user"
                      ? "bg-slate-900 text-white rounded-tr-none"
                      : "bg-white border border-slate-200/70 text-slate-800 rounded-tl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex gap-3 mr-auto max-w-[88%]">
                <div className="h-8 w-8 shrink-0 rounded-full flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-100">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex h-10 items-center gap-1.5 rounded-2xl rounded-tl-none border border-slate-200/70 bg-white px-4 shadow-sm">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSendMessage}
            className="flex shrink-0 items-center gap-2 border-t border-slate-200/80 bg-white p-4"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about the college…"
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition-all duration-200 hover:bg-white focus:bg-white focus:border-slate-700"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-slate-900 text-white transition-all duration-200 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <SendHorizontal className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* ── Floating Avatar (no circle, just the bare animation) ── */}
      <div className="relative flex flex-col items-end">
        {/* Greeting bubble */}
        {showGreeting && !isOpen && (
          <div
            style={{ animation: "greetPop 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}
            className="mb-2 mr-3 flex items-center gap-2 rounded-2xl rounded-br-none bg-white px-4 py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-slate-100 whitespace-nowrap"
          >
            <span className="text-sm font-semibold text-slate-800">Hi there! 👋</span>
            <span className="text-xs text-slate-500">Need help?</span>
            <button
              onClick={() => setShowGreeting(false)}
              className="ml-1 text-slate-300 hover:text-slate-500 transition-colors text-xs leading-none cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        <button
          onClick={() => { setIsOpen((o) => !o); setShowGreeting(false); }}
          title="Chat with JNTU AI"
          style={{ background: "none", border: "none", padding: 0 }}
          className="cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95 drop-shadow-[0_8px_28px_rgba(0,0,0,0.38)]"
        >
          {mounted ? (
            <Suspense
              fallback={
                <div
                  style={{ width: "150px", height: "150px" }}
                  className="rounded-full bg-slate-800/40 animate-pulse"
                />
              }
            >
              <DotLottieReact
                src="/CHATBOT.lottie"
                autoplay
                loop
                style={{ width: "150px", height: "150px", display: "block" }}
              />
            </Suspense>
          ) : (
            <div style={{ width: "150px", height: "150px" }} />
          )}
        </button>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes greetPop {
          from { opacity: 0; transform: translateY(8px) scale(0.9); }
          to   { opacity: 1; transform: translateY(0)   scale(1);   }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
