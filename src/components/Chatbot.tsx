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
  const [chips, setChips] = useState<string[]>([]);
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

  const DEFAULT_SUGGESTIONS = [
    "📄 Show R23 Syllabus",
    "🕒 Exam Timetables",
    "🏠 Hostel Fee Structure",
    "📞 Principal Office Contact",
    "🌐 తెలుగులో వివరించండి",
  ];

  async function submitQuery(queryText: string) {
    if (!queryText.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: queryText.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await queryChatbot({
        data: { messages: [...messages, userMessage] },
      });
      const reply = res.reply;

      const isAskingRegulation = 
        reply.toLowerCase().includes("r20") && 
        reply.toLowerCase().includes("r23");

      setChips(isAskingRegulation ? ["R20", "R23", "R25"] : []);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply },
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

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    submitQuery(input);
  }

  function renderContent(text: string) {
    const mdLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
    const parts: React.ReactNode[] = [];
    let last = 0;
    let match;
    let key = 0;

    while ((match = mdLinkRegex.exec(text)) !== null) {
      if (match.index > last) {
        parts.push(
          <span key={key++}>{text.slice(last, match.index)}</span>
        );
      }
      parts.push(
        <a
          key={key++}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 underline font-semibold text-blue-500 hover:text-blue-700"
        >
          📄 {match[1]}
        </a>
      );
      last = match.index + match[0].length;
    }

    if (last < text.length) parts.push(<span key={key++}>{text.slice(last)}</span>);
    return parts.length > 0 ? parts : text;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[999] font-sans flex flex-col items-end select-none">

      {/* ── Chat panel ──────────────────────────────────────── */}
      {isOpen && (
        <div
          style={{
            width: "370px",
            height: "490px",
            maxHeight: "68vh",
            animation: "chatSlideUp 0.35s cubic-bezier(0.34,1.56,0.64,1)",
          }}
          className="mb-2 flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.22)] bg-white/97 backdrop-blur-md max-w-[calc(100vw-2rem)]"
        >
          {/* Header */}
          <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-3.5 shadow-md">
            <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-blue-500/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-4 left-10 h-20 w-20 rounded-full bg-indigo-500/10 blur-xl" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {/* Avatar in header — client only */}
                <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-white/10 ring-2 ring-white/20">
                  {mounted && (
                    <Suspense fallback={<div className="h-9 w-9 rounded-full bg-white/10" />}>
                      <DotLottieReact
                        src="/CHATBOT.lottie"
                        autoplay
                        loop
                        style={{ width: "36px", height: "36px" }}
                      />
                    </Suspense>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold tracking-wide text-white leading-none">
                      JNTU AI
                    </h3>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-widest text-white/50">
                    Campus Guide
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white/10 transition hover:bg-white/25"
              >
                <X className="h-3.5 w-3.5 text-white" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-slate-50/60 p-3.5 space-y-3 no-scrollbar">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${
                  msg.role === "user"
                    ? "ml-auto flex-row-reverse max-w-[88%]"
                    : "mr-auto max-w-[88%]"
                }`}
              >
                <div
                  className={`h-7 w-7 shrink-0 rounded-full flex items-center justify-center ${
                    msg.role === "user"
                      ? "bg-slate-900 text-white"
                      : "bg-blue-50 text-blue-600 border border-blue-100"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="h-3.5 w-3.5" />
                  ) : (
                    <Bot className="h-3.5 w-3.5" />
                  )}
                </div>

                <div
                  className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line shadow-sm ${
                    msg.role === "user"
                      ? "bg-slate-900 text-white rounded-tr-none"
                      : "bg-white border border-slate-200/70 text-slate-800 rounded-tl-none"
                  }`}
                >
                  {renderContent(msg.content)}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex gap-2.5 mr-auto max-w-[88%]">
                <div className="h-7 w-7 shrink-0 rounded-full flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-100">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="flex h-9 items-center gap-1.5 rounded-2xl rounded-tl-none border border-slate-200/70 bg-white px-3.5 shadow-sm">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestion pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto px-3 py-2 border-t border-slate-100 bg-slate-50/90 [scrollbar-width:none]">
            {(chips.length > 0 ? chips : DEFAULT_SUGGESTIONS).map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => submitQuery(sug)}
                className="shrink-0 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-sm hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all cursor-pointer flex items-center gap-1"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSendMessage}
            className="flex shrink-0 items-center gap-2 border-t border-slate-200/80 bg-white p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about the college…"
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs outline-none transition-all duration-200 hover:bg-white focus:bg-white focus:border-slate-700"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-8.5 w-8.5 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-slate-900 text-white transition-all duration-200 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <SendHorizontal className="h-3.5 w-3.5" />
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
            className="mb-2 mr-3 flex items-center gap-2 rounded-2xl rounded-br-none bg-white px-3.5 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-slate-100 whitespace-nowrap"
          >
            <span className="text-xs font-semibold text-slate-800">Hi there! 👋</span>
            <span className="text-[11px] text-slate-500">Need help?</span>
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
          className="cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95 drop-shadow-[0_8px_24px_rgba(0,0,0,0.32)]"
        >
          {mounted ? (
            <Suspense
              fallback={
                <div
                  style={{ width: "110px", height: "110px" }}
                  className="rounded-full bg-slate-800/40 animate-pulse"
                />
              }
            >
              <DotLottieReact
                src="/CHATBOT.lottie"
                autoplay
                loop
                style={{ width: "110px", height: "110px", display: "block" }}
              />
            </Suspense>
          ) : (
            <div style={{ width: "110px", height: "110px" }} />
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
