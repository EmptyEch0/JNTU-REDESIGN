import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { X, SendHorizontal, Bot, User, Sparkles } from "lucide-react";
import { queryChatbot } from "@/funcs/site.server";
import { tryInstantResponse } from "@/lib/chatbot-instant";

// Lazy-load DotLottie so it NEVER runs during SSR (avoids the addListener WASM crash)
const DotLottieReact = lazy(() =>
  import("@lottiefiles/dotlottie-react").then((m) => ({ default: m.DotLottieReact }))
);

interface Message {
  id: string;
  role: "system" | "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

/**
 * Parses inline markdown tokens:
 * - **bold** or __bold__ -> <strong>
 * - *italic* or _italic_ -> <em>
 * - `code` -> <code>
 * - [label](url) -> formatted button / link
 * - Cleans up any remaining raw asterisks/formatting clutter
 */
function parseInlineFormatting(rawText: string): React.ReactNode[] {
  // Regex to match markdown links, bold, italic, and inline code
  // 1: [label](url)
  // 2: **bold**
  // 3: `code`
  // 4: *italic*
  const tokenRegex = /(\[([^\]]+)\]\(([^)]+)\))|(\*\*([^*]+)\*\*|__([^_]+)__)|(`([^`]+)`)|(\*([^*]+)\*|_([^_]+)_)/g;

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = tokenRegex.exec(rawText)) !== null) {
    if (match.index > lastIndex) {
      // Clean any stray unparsed formatting symbols from standard text
      const plainText = rawText
        .slice(lastIndex, match.index)
        .replace(/\*\*/g, "")
        .replace(/__+/g, "")
        .replace(/`+/g, "");
      if (plainText) elements.push(<span key={key++}>{plainText}</span>);
    }

    if (match[1]) {
      // ── Markdown Link: [label](url)
      const label = match[2];
      const url = match[3];
      const isPdf = url.toLowerCase().endsWith(".pdf") || url.startsWith("/uploads/") || url.includes(".pdf");
      const isInternalRoute = url.startsWith("/") && !isPdf;

      if (isPdf) {
        elements.push(
          <a
            key={key++}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="inline-flex items-center gap-1 px-2.5 py-0.5 my-0.5 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold border border-blue-200/90 transition-colors text-[11px] shadow-2xs"
          >
            📥 {label.includes("Download") ? label : `Download PDF (${label})`}
          </a>
        );
      } else if (isInternalRoute) {
        elements.push(
          <a
            key={key++}
            href={url}
            onClick={(evt) => {
              evt.preventDefault();
              window.location.href = url;
            }}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 my-0.5 rounded-md bg-slate-900 hover:bg-blue-600 text-white font-bold transition-all text-[11px] cursor-pointer shadow-2xs"
          >
            📂 {label}
          </a>
        );
      } else {
        elements.push(
          <a
            key={key++}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 underline font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            🔗 {label}
          </a>
        );
      }
    } else if (match[4]) {
      // ── Bold: **bold** or __bold__
      const boldContent = match[5] || match[6] || "";
      elements.push(
        <strong key={key++} className="font-bold text-slate-950">
          {parseInlineFormatting(boldContent)}
        </strong>
      );
    } else if (match[7]) {
      // ── Inline Code: `code`
      const codeContent = match[8] || "";
      elements.push(
        <code
          key={key++}
          className="px-1 py-0.5 rounded bg-blue-50/80 font-mono text-[10.5px] font-semibold text-blue-800 border border-blue-200/50"
        >
          {codeContent}
        </code>
      );
    } else if (match[9]) {
      // ── Italic: *italic* or _italic_
      const italicContent = match[10] || match[11] || "";
      elements.push(
        <em key={key++} className="italic text-slate-700">
          {italicContent}
        </em>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < rawText.length) {
    const remainingText = rawText
      .slice(lastIndex)
      .replace(/\*\*/g, "")
      .replace(/__+/g, "")
      .replace(/`+/g, "");
    if (remainingText) elements.push(<span key={key++}>{remainingText}</span>);
  }

  return elements.length > 0 ? elements : [<span key={0}>{rawText.replace(/\*\*/g, "")}</span>];
}

/**
 * Formatted Markdown block renderer:
 * Converts headers, lists, and paragraphs into formatted React UI.
 */
function FormattedBotMessageContent({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      blocks.push(<div key={`empty-${i}`} className="h-1.5" />);
      continue;
    }

    // Heading lines: ### Title or ## Title or # Title
    if (/^#{1,4}\s+/.test(line)) {
      const headingText = line.replace(/^#{1,4}\s+/, "");
      blocks.push(
        <div
          key={`heading-${i}`}
          className="font-bold text-slate-900 text-xs sm:text-[13px] mt-2 mb-1 flex items-center gap-1.5 border-b border-slate-100 pb-0.5 text-primary"
        >
          <Sparkles className="h-3 w-3 text-blue-500 shrink-0" />
          <span>{parseInlineFormatting(headingText)}</span>
        </div>
      );
      continue;
    }

    // Bullet items: •, -, *, 1., 2.
    const bulletMatch = line.match(/^([•\-\*]|\d+\.)\s+(.+)$/);
    if (bulletMatch) {
      const bulletContent = bulletMatch[2];
      blocks.push(
        <div key={`bullet-${i}`} className="flex items-start gap-2 my-0.5 ml-0.5">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
          <div className="flex-1 leading-relaxed text-slate-800">
            {parseInlineFormatting(bulletContent)}
          </div>
        </div>
      );
      continue;
    }

    // Standard paragraph line
    blocks.push(
      <div key={`para-${i}`} className="leading-relaxed text-slate-800">
        {parseInlineFormatting(line)}
      </div>
    );
  }

  return <div className="space-y-0.5">{blocks}</div>;
}

/**
 * Smooth typewriter streaming wrapper for incoming assistant messages
 */
function StreamedAssistantMessage({
  fullText,
  isStreaming,
  onComplete,
}: {
  fullText: string;
  isStreaming?: boolean;
  onComplete?: () => void;
}) {
  const [displayedLength, setDisplayedLength] = useState(isStreaming ? 0 : fullText.length);

  useEffect(() => {
    if (!isStreaming) {
      setDisplayedLength(fullText.length);
      return;
    }

    setDisplayedLength(0);
    const speed = Math.max(12, Math.min(24, Math.floor(1200 / (fullText.length || 1)))); // Adaptive fast streaming
    const step = fullText.length > 200 ? 3 : 2;

    const interval = setInterval(() => {
      setDisplayedLength((prev) => {
        const next = prev + step;
        if (next >= fullText.length) {
          clearInterval(interval);
          onComplete?.();
          return fullText.length;
        }
        return next;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [fullText, isStreaming, onComplete]);

  const currentText = isStreaming ? fullText.slice(0, displayedLength) : fullText;
  const isTypingActive = isStreaming && displayedLength < fullText.length;

  return (
    <div className="relative">
      <FormattedBotMessageContent text={currentText} />
      {isTypingActive && (
        <span className="inline-block w-1.5 h-3.5 bg-blue-600 rounded-xs animate-pulse align-middle ml-0.5" />
      )}
    </div>
  );
}

export function Chatbot() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-greeting",
      role: "assistant",
      content:
        "Hi there! I am JNTU AI, your smart digital campus companion. How can I help you today? 😊",
      isStreaming: false,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chips, setChips] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Only render Lottie after client hydration
  useEffect(() => {
    setMounted(true);
    // Show greeting bubble after 1.2s, hide after 6s
    const showTimer = setTimeout(() => setShowGreeting(true), 1200);
    const hideTimer = setTimeout(() => setShowGreeting(false), 6000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  // Auto-scroll to latest message whenever content updates
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

    // Immediately finish any streaming assistant messages
    setMessages((prev) =>
      prev.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m))
    );

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: queryText.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // ── Level 1: Client-Side Instant Pre-Filter (0ms latency, zero server load) ──
    const instantReply = tryInstantResponse(queryText);
    if (instantReply) {
      const botMessageId = `bot-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: botMessageId,
          role: "assistant",
          content: instantReply,
          isStreaming: true,
        },
      ]);
      return;
    }

    setIsLoading(true);

    try {
      const res = await queryChatbot({
        data: {
          messages: [...messages, userMessage].map(({ role, content }) => ({
            role,
            content,
          })),
        },
      });
      const reply = res.reply;

      const qLower = queryText.toLowerCase();
      const isSyllabusQuery =
        qLower.includes("syllabus") ||
        qLower.includes("r23") ||
        qLower.includes("r20") ||
        qLower.includes("r25");

      if (isSyllabusQuery) {
        const hasReg = /r(23|20|25|19|16)/i.test(qLower);
        const hasDept = /\b(cse|ece|eee|mech|met|it|civil|mba|mca)\b/i.test(qLower);

        if (!hasReg && !hasDept) {
          setChips([
            "Show R23 Syllabus",
            "R20 Syllabus",
            "CSE Syllabus",
            "ECE Syllabus",
            "IT Syllabus",
          ]);
        } else if (hasReg && !hasDept) {
          const regMatch =
            qLower.match(/r(23|20|25|19|16)/i)?.[0]?.toUpperCase() || "R23";
          setChips([
            `${regMatch} CSE`,
            `${regMatch} ECE`,
            `${regMatch} EEE`,
            `${regMatch} MECH`,
            `${regMatch} IT`,
            `${regMatch} Civil`,
          ]);
        } else if (!hasReg && hasDept) {
          const deptMatch =
            qLower.match(/\b(cse|ece|eee|mech|met|it|civil|mba|mca)\b/i)?.[0]?.toUpperCase() ||
            "CSE";
          setChips([`R23 ${deptMatch}`, `R20 ${deptMatch}`, `R25 ${deptMatch}`]);
        } else {
          setChips(["📄 Show R23 Syllabus", "🕒 Exam Timetables", "🏠 Hostel Fee Structure"]);
        }
      } else {
        const isAskingRegulation =
          reply.toLowerCase().includes("r20") && reply.toLowerCase().includes("r23");

        setChips(isAskingRegulation ? ["R20", "R23", "R25"] : []);
      }

      const botMessageId = `bot-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: botMessageId,
          role: "assistant",
          content: reply,
          isStreaming: true,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: "assistant",
          content: "I'm having trouble right now. Please try again in a bit! 😊",
          isStreaming: false,
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

  const handleStreamingComplete = (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, isStreaming: false } : m))
    );
  };

  return (
    <div className="fixed bottom-4 right-4 z-[999] font-sans flex flex-col items-end select-none">
      {/* ── Chat panel ──────────────────────────────────────── */}
      {isOpen && (
        <div
          style={{
            width: "380px",
            height: "510px",
            maxHeight: "72vh",
            animation: "chatSlideUp 0.35s cubic-bezier(0.34,1.56,0.64,1)",
          }}
          className="mb-2 flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.25)] bg-white/98 backdrop-blur-md max-w-[calc(100vw-2rem)]"
        >
          {/* Header */}
          <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-3.5 shadow-md">
            <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-blue-500/15 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-4 left-10 h-20 w-20 rounded-full bg-indigo-500/15 blur-xl" />

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
                  <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-widest text-cyan-300/80">
                    Smart Campus Companion
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white/10 transition hover:bg-white/25"
                title="Close chat"
                aria-label="Close chat"
              >
                <X className="h-3.5 w-3.5 text-white" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto bg-slate-50/70 p-3.5 space-y-3 no-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.role === "user"
                    ? "ml-auto flex-row-reverse max-w-[88%]"
                    : "mr-auto max-w-[90%]"
                }`}
              >
                <div
                  className={`h-7 w-7 shrink-0 rounded-full flex items-center justify-center ${
                    msg.role === "user"
                      ? "bg-slate-900 text-white"
                      : "bg-blue-50 text-blue-600 border border-blue-200/70 shadow-2xs"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="h-3.5 w-3.5" />
                  ) : (
                    <Bot className="h-3.5 w-3.5" />
                  )}
                </div>

                <div
                  className={`rounded-2xl px-3.5 py-2.5 text-xs shadow-xs ${
                    msg.role === "user"
                      ? "bg-slate-900 text-white rounded-tr-none whitespace-pre-line"
                      : "bg-white border border-slate-200/80 text-slate-800 rounded-tl-none"
                  }`}
                >
                  {msg.role === "user" ? (
                    msg.content
                  ) : (
                    <StreamedAssistantMessage
                      fullText={msg.content}
                      isStreaming={msg.isStreaming}
                      onComplete={() => handleStreamingComplete(msg.id)}
                    />
                  )}
                </div>
              </div>
            ))}

            {/* Loading typing indicator */}
            {isLoading && (
              <div className="flex gap-2.5 mr-auto max-w-[88%]">
                <div className="h-7 w-7 shrink-0 rounded-full flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-200/70 shadow-2xs">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="flex h-9 items-center gap-1.5 rounded-2xl rounded-tl-none border border-slate-200/80 bg-white px-3.5 shadow-xs">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestion pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto px-3 py-2 border-t border-slate-100 bg-slate-50/95 [scrollbar-width:none]">
            {(chips.length > 0 ? chips : DEFAULT_SUGGESTIONS).map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => submitQuery(sug)}
                className="shrink-0 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-2xs hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all cursor-pointer flex items-center gap-1"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="flex shrink-0 items-center gap-2 border-t border-slate-200/80 bg-white p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about the college…"
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs outline-none transition-all duration-200 hover:bg-white focus:bg-white focus:border-slate-700 text-slate-900"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-8.5 w-8.5 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-slate-900 text-white transition-all duration-200 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Send message"
            >
              <SendHorizontal className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* ── Floating Avatar ── */}
      <div className="relative flex flex-col items-end">
        {/* Greeting bubble */}
        {showGreeting && !isOpen && (
          <div
            style={{ animation: "greetPop 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}
            className="mb-2 mr-3 flex items-center gap-2 rounded-2xl rounded-br-none bg-white px-3.5 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.14)] border border-slate-100 whitespace-nowrap"
          >
            <span className="text-xs font-semibold text-slate-800">Hi there! 👋</span>
            <span className="text-[11px] text-slate-500">Need help?</span>
            <button
              onClick={() => setShowGreeting(false)}
              className="ml-1 text-slate-300 hover:text-slate-500 transition-colors text-xs leading-none cursor-pointer"
              aria-label="Dismiss greeting"
            >
              ✕
            </button>
          </div>
        )}

        <button
          onClick={() => {
            setIsOpen((o) => !o);
            setShowGreeting(false);
          }}
          title="Chat with JNTU AI"
          style={{ background: "none", border: "none", padding: 0 }}
          className="cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95 drop-shadow-[0_8px_24px_rgba(0,0,0,0.32)]"
          aria-label="Toggle chat window"
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
