import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdmin } from "@/context/AdminContext";
import { useEffect } from "react";
import {
  Bot,
  Sparkles,
  TrendingUp,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  RefreshCw,
  Download,
  Calendar,
  Languages,
  Check,
  ChevronRight,
  X,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Edit3,
  ExternalLink,
  Layers,
  ArrowUpRight,
  Database,
  Zap,
  Info,
  ShieldAlert,
  Send,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { toast } from "sonner";
import {
  getChatbotAnalyticsSummary,
  getChatbotLogs,
  updateChatbotLogReview,
  deleteChatbotLog,
  seedSampleChatbotLogs,
  ChatbotLogItem,
  ChatbotAnalyticsSummary,
} from "@/funcs/chatbot-analytics.server";

export const Route = createFileRoute("/admin/chatbot-analytics")({
  component: AdminChatbotAnalyticsPage,
});

function AdminChatbotAnalyticsPage() {
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAdmin) {
      navigate({ to: "/" });
    }
  }, [isAdmin, navigate]);

  // Filters & State
  const [selectedDays, setSelectedDays] = useState<number>(30);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "good" | "needs_change" | "unreviewed">("all");
  const [intentFilter, setIntentFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [activeLog, setActiveLog] = useState<ChatbotLogItem | null>(null);

  // Modal Review Form state
  const [editRating, setEditRating] = useState<"good" | "needs_change" | "unreviewed">("unreviewed");
  const [editAdminNotes, setEditAdminNotes] = useState<string>("");
  const [editSuggestedAnswer, setEditSuggestedAnswer] = useState<string>("");

  // 1. Fetch Analytics Summary
  const {
    data: summary,
    isLoading: isSummaryLoading,
    refetch: refetchSummary,
    isRefetching: isRefetchingSummary,
  } = useQuery({
    queryKey: ["chatbot-analytics-summary", selectedDays],
    queryFn: () => getChatbotAnalyticsSummary({ data: selectedDays }),
  });

  // 2. Fetch Logs List
  const {
    data: logsData,
    isLoading: isLogsLoading,
    refetch: refetchLogs,
    isRefetching: isRefetchingLogs,
  } = useQuery({
    queryKey: ["chatbot-logs", statusFilter, intentFilter, sourceFilter, searchTerm],
    queryFn: () =>
      getChatbotLogs({
        data: {
          rating: statusFilter,
          intent: intentFilter,
          source: sourceFilter,
          search: searchTerm,
          limit: 100,
        },
      }),
  });

  // 3. Update Review Mutation
  const updateReviewMutation = useMutation({
    mutationFn: (payload: {
      id: number;
      rating: "good" | "needs_change" | "unreviewed";
      adminNotes?: string;
      suggestedAnswer?: string;
    }) => updateChatbotLogReview({ data: payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatbot-analytics-summary"] });
      queryClient.invalidateQueries({ queryKey: ["chatbot-logs"] });
      toast.success("Review verdict saved successfully!");
      if (activeLog) {
        setActiveLog((prev) =>
          prev
            ? {
                ...prev,
                rating: editRating,
                adminNotes: editAdminNotes || null,
                suggestedAnswer: editSuggestedAnswer || null,
              }
            : null
        );
      }
    },
    onError: (err: any) => {
      toast.error("Failed to save review: " + err.message);
    },
  });

  // 4. Delete Log Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteChatbotLog({ data: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatbot-analytics-summary"] });
      queryClient.invalidateQueries({ queryKey: ["chatbot-logs"] });
      toast.success("Query log removed.");
      setActiveLog(null);
    },
  });

  // 5. Seed Mutation
  const seedMutation = useMutation({
    mutationFn: () => seedSampleChatbotLogs(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatbot-analytics-summary"] });
      queryClient.invalidateQueries({ queryKey: ["chatbot-logs"] });
      toast.success("Sample campus chatbot insights seeded!");
    },
  });

  const handleOpenDetailModal = (log: ChatbotLogItem) => {
    setActiveLog(log);
    setEditRating(log.rating);
    setEditAdminNotes(log.adminNotes || "");
    setEditSuggestedAnswer(log.suggestedAnswer || "");
  };

  const handleQuickMark = (
    e: React.MouseEvent,
    id: number,
    newRating: "good" | "needs_change"
  ) => {
    e.stopPropagation();
    updateReviewMutation.mutate({ id, rating: newRating });
  };

  const handleExportCSV = () => {
    if (!logsData?.items || logsData.items.length === 0) {
      toast.error("No inquiry records to export.");
      return;
    }

    const headers = [
      "ID",
      "Timestamp",
      "User Question",
      "Bot Answer",
      "Intent",
      "Language",
      "Source",
      "Confidence",
      "Admin Rating",
      "Admin Notes",
      "Suggested Answer",
    ];

    const rows = logsData.items.map((item) => [
      item.id,
      `"${item.createdAt}"`,
      `"${item.question.replace(/"/g, '""')}"`,
      `"${item.answer.replace(/"/g, '""')}"`,
      `"${item.intent}"`,
      `"${item.language}"`,
      `"${item.source}"`,
      `"${item.confidence}"`,
      `"${item.rating}"`,
      `"${(item.adminNotes || "").replace(/"/g, '""')}"`,
      `"${(item.suggestedAnswer || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `jntugv_chatbot_insights_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported chatbot logs CSV!");
  };

  const totalLogs = summary?.totalQueries ?? 0;
  const accuracyPct = summary?.accuracyRate ?? 100;
  const goodCount = summary?.goodCount ?? 0;
  const needsChangeCount = summary?.needsChangeCount ?? 0;
  const unreviewedCount = summary?.unreviewedCount ?? 0;

  const isRefreshing = isRefetchingSummary || isRefetchingLogs;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans pb-24">
      {/* Top Header / Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white border-b border-blue-900/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Bot size={14} className="text-blue-400" />
                  AI Intelligence Hub
                </span>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-0.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active Monitoring
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display text-white">
                Chatbot <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">Analytics & Insights</span>
              </h1>
              <p className="text-slate-300 text-sm mt-1 max-w-2xl">
                Monitor live questions asked by students and visitors, inspect bot replies, conclude response accuracy, and flag needed content updates.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center flex-wrap gap-2.5">
              <div className="flex items-center bg-slate-800/80 border border-slate-700/80 rounded-xl p-1 text-xs">
                {[7, 14, 30].map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDays(d)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      selectedDays === d
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {d} Days
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  refetchSummary();
                  refetchLogs();
                }}
                disabled={isRefreshing}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-200 hover:text-white transition cursor-pointer shadow-sm disabled:opacity-50"
                title="Refresh Analytics"
              >
                <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
              </button>

              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-900/40 active:scale-95 cursor-pointer"
              >
                <Download size={14} /> Export CSV
              </button>

              {totalLogs < 5 && (
                <button
                  onClick={() => seedMutation.mutate()}
                  disabled={seedMutation.isPending}
                  className="flex items-center gap-1.5 px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold transition"
                >
                  <Sparkles size={14} /> Seed Demo Insights
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Total Queries */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Questions</span>
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                <MessageSquare size={18} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
                {totalLogs}
              </span>
              <span className="text-xs font-bold text-slate-400">queries</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Across all pages & topics over {selectedDays} days
            </p>
          </div>

          {/* Card 2: Today's Inquiries */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Today's Inquiries</span>
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
                <TrendingUp size={18} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
                {summary?.todayQueries ?? 0}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                vs {summary?.yesterdayQueries ?? 0} yesterday
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Active student interactions today
            </p>
          </div>

          {/* Card 3: Quality Verdicts (Good vs Needs Change) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Admin Review Verdict</span>
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                <span className="text-2xl font-black">{goodCount}</span>
                <span className="text-xs uppercase">Good</span>
              </div>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
                <span className="text-2xl font-black">{needsChangeCount}</span>
                <span className="text-xs uppercase">Needs Change</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {unreviewedCount} questions awaiting review
            </p>
          </div>

          {/* Card 4: High Accuracy Rate */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Bot Confidence Rate</span>
              <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400">
                <Sparkles size={18} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
                {accuracyPct}%
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">high accuracy</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${accuracyPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Chart: Daily Inquiry Volume */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100 font-display flex items-center gap-2">
                  <TrendingUp size={16} className="text-blue-500" />
                  Daily Questions Volume Trend
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Number of questions submitted per day over the selected window
                </p>
              </div>
              <span className="text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg font-bold text-slate-600 dark:text-slate-300">
                Last {selectedDays} Days
              </span>
            </div>

            <div className="h-64 w-full">
              {summary?.dailyTrends && summary.dailyTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={summary.dailyTrends}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorGood" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="label"
                      stroke="#94A3B8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: "#E2E8F0" }}
                    />
                    <YAxis
                      stroke="#94A3B8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1">
                              <p className="font-bold text-sky-400">{label}</p>
                              <p className="text-slate-200">
                                Total Questions: <span className="font-bold">{payload[0]?.value}</span>
                              </p>
                              {payload[1] && (
                                <p className="text-emerald-400">
                                  Good Verdicts: <span className="font-bold">{payload[1]?.value}</span>
                                </p>
                              )}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#3B82F6"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorTotal)"
                      name="Total"
                    />
                    <Area
                      type="monotone"
                      dataKey="good"
                      stroke="#10B981"
                      strokeWidth={1.5}
                      fillOpacity={1}
                      fill="url(#colorGood)"
                      name="Good"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                  No query trend data available for this window.
                </div>
              )}
            </div>
          </div>

          {/* Side Breakdown: Most Asked Topics */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100 font-display flex items-center gap-2">
              <Layers size={16} className="text-indigo-500" />
              Most Inquired Topics
            </h3>
            <p className="text-xs text-slate-400">
              Frequency of topics requested by students
            </p>

            <div className="space-y-3 pt-2">
              {summary?.intentDistribution && summary.intentDistribution.length > 0 ? (
                summary.intentDistribution.map((item, idx) => (
                  <div key={item.intent} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        {item.label}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 font-semibold">
                        {item.count} asks ({item.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full"
                        style={{ width: `${Math.max(5, item.percentage)}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-8">
                  No topic data recorded yet.
                </p>
              )}
            </div>

            {/* Languages summary badge */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Languages Detected
              </span>
              <div className="flex flex-wrap gap-2">
                {summary?.languageDistribution.map((l) => (
                  <span
                    key={l.language}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    <Languages size={12} className="text-blue-500" />
                    {l.language}: {l.count}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Questions & Replies Explorer (Main Table) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          {/* Table Toolbar & Filters */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageSquare size={18} className="text-blue-600" />
                  Questions & Responses Log
                </h2>
                <p className="text-xs text-slate-400">
                  Inspect every inquiry, test answer accuracy, and mark what is good or needs to be changed.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search questions, replies, notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              {/* Verdict Status Pills */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-bold">
                {[
                  { key: "all", label: "All Questions" },
                  { key: "needs_change", label: `Needs Change (${needsChangeCount})` },
                  { key: "good", label: `Marked Good (${goodCount})` },
                  { key: "unreviewed", label: `Unreviewed (${unreviewedCount})` },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setStatusFilter(tab.key as any)}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      statusFilter === tab.key
                        ? tab.key === "needs_change"
                          ? "bg-amber-600 text-white shadow-sm"
                          : tab.key === "good"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-blue-600 text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-300 hover:text-blue-600"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Source Filter */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-semibold flex items-center gap-1">
                  <Filter size={13} /> Source:
                </span>
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 outline-none"
                >
                  <option value="all">All Sources</option>
                  <option value="dedicated_kb">Dedicated KB</option>
                  <option value="live_db">Live DB</option>
                  <option value="instant_client">Instant (0ms)</option>
                  <option value="rag_fallback">RAG Fallback</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-400 uppercase tracking-wider text-[10px] font-extrabold">
                  <th className="py-3 px-6">Timestamp</th>
                  <th className="py-3 px-6">User Question</th>
                  <th className="py-3 px-6">Bot Reply</th>
                  <th className="py-3 px-4">Topic / Source</th>
                  <th className="py-3 px-4">Verdict</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {isLogsLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <RefreshCw size={20} className="animate-spin mx-auto mb-2 text-blue-500" />
                      Loading inquiry logs...
                    </td>
                  </tr>
                ) : logsData?.items && logsData.items.length > 0 ? (
                  logsData.items.map((log) => {
                    const isGood = log.rating === "good";
                    const isNeedsChange = log.rating === "needs_change";

                    return (
                      <tr
                        key={log.id}
                        onClick={() => handleOpenDetailModal(log)}
                        className="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition cursor-pointer group"
                      >
                        {/* Timestamp */}
                        <td className="py-4 px-6 text-slate-400 whitespace-nowrap">
                          <span className="font-semibold block text-slate-600 dark:text-slate-300">
                            {new Date(log.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span className="text-[10.5px]">
                            {new Date(log.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </td>

                        {/* Question */}
                        <td className="py-4 px-6 max-w-xs sm:max-w-sm">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span
                              className={`text-[9.5px] px-1.5 py-0.5 rounded font-black uppercase ${
                                log.language === "telugu"
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                                  : log.language === "tenglish"
                                  ? "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300"
                                  : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                              }`}
                            >
                              {log.language}
                            </span>
                          </div>
                          <p className="font-bold text-slate-900 dark:text-white line-clamp-2">
                            {log.question}
                          </p>
                        </td>

                        {/* Bot Reply Preview */}
                        <td className="py-4 px-6 max-w-sm sm:max-w-md text-slate-600 dark:text-slate-300">
                          <p className="line-clamp-2 leading-relaxed">
                            {log.answer.replace(/[#*`[\]()]/g, " ")}
                          </p>
                        </td>

                        {/* Topic / Source */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="inline-block px-2.5 py-1 rounded-md text-[10.5px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/40 uppercase mb-1">
                            {log.intent}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-medium">
                            {log.source === "live_db"
                              ? "Live Database"
                              : log.source === "instant_client"
                              ? "Instant 0ms"
                              : log.source === "dedicated_kb"
                              ? "Dedicated KB"
                              : "RAG Fallback"}
                          </span>
                        </td>

                        {/* Verdict / Status */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          {isGood ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                              <CheckCircle2 size={12} /> Good Answer
                            </span>
                          ) : isNeedsChange ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
                              <AlertTriangle size={12} /> Needs Change
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                              <Clock size={12} /> Unreviewed
                            </span>
                          )}
                        </td>

                        {/* Quick Action Buttons */}
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition">
                            <button
                              onClick={(e) => handleQuickMark(e, log.id, "good")}
                              title="Mark as Good"
                              className={`p-1.5 rounded-lg transition ${
                                isGood
                                  ? "bg-emerald-600 text-white"
                                  : "bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 hover:text-emerald-600 text-slate-500"
                              }`}
                            >
                              <ThumbsUp size={13} />
                            </button>
                            <button
                              onClick={(e) => handleQuickMark(e, log.id, "needs_change")}
                              title="Flag Needs Change"
                              className={`p-1.5 rounded-lg transition ${
                                isNeedsChange
                                  ? "bg-amber-600 text-white"
                                  : "bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 hover:text-amber-600 text-slate-500"
                              }`}
                            >
                              <ThumbsDown size={13} />
                            </button>
                            <button
                              onClick={() => handleOpenDetailModal(log)}
                              className="p-1.5 rounded-lg bg-blue-50 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-blue-600 transition"
                              title="Inspect Full Conversation"
                            >
                              <ChevronRight size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-400">
                      <Bot size={32} className="mx-auto mb-2 opacity-40" />
                      <p className="font-semibold text-sm">No inquiry logs found matching your filters.</p>
                      <p className="text-xs text-slate-400 mt-1">Try resetting search or change the verdict filter.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* DETAIL / PREVIEW & REVIEW MODAL */}
      {activeLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                  <Bot size={18} />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                    Inquiry Inspection & Quality Review
                  </h3>
                  <p className="text-xs text-slate-400">
                    Logged at {new Date(activeLog.createdAt).toLocaleString()} • ID #{activeLog.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveLog(null)}
                className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Question Box */}
              <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                    User Question
                  </span>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase">
                      Lang: {activeLog.language}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 uppercase">
                      Intent: {activeLog.intent}
                    </span>
                  </div>
                </div>
                <p className="text-base font-bold text-slate-900 dark:text-white pt-1">
                  "{activeLog.question}"
                </p>
              </div>

              {/* Bot Answer Box */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    Bot Generated Response
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-200/60 dark:bg-slate-800 px-2 py-0.5 rounded">
                    Source: {activeLog.source} ({activeLog.confidence} confidence)
                  </span>
                </div>
                <div className="text-xs leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-line bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 font-sans">
                  {activeLog.answer}
                </div>
              </div>

              {/* Admin Verdict Selection */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                  Conclude Accuracy Verdict
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setEditRating("good")}
                    className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition cursor-pointer ${
                      editRating === "good"
                        ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/30"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <CheckCircle2 size={18} className={editRating === "good" ? "text-emerald-600" : ""} />
                    Good & Accurate Answer
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditRating("needs_change")}
                    className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition cursor-pointer ${
                      editRating === "needs_change"
                        ? "bg-amber-50 dark:bg-amber-950/60 border-amber-500 text-amber-800 dark:text-amber-300 ring-2 ring-amber-500/30"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <AlertTriangle size={18} className={editRating === "needs_change" ? "text-amber-600" : ""} />
                    Needs Content Change
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditRating("unreviewed")}
                    className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition cursor-pointer ${
                      editRating === "unreviewed"
                        ? "bg-slate-100 dark:bg-slate-800 border-slate-400 text-slate-800 dark:text-slate-200"
                        : "border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Clock size={18} />
                    Unreviewed
                  </button>
                </div>
              </div>

              {/* Admin Feedback Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Admin Feedback / Reason for Change</span>
                  <span className="text-[10.5px] font-normal text-slate-400">
                    What should be updated or who to contact
                  </span>
                </label>
                <textarea
                  rows={2}
                  value={editAdminNotes}
                  onChange={(e) => setEditAdminNotes(e.target.value)}
                  placeholder="e.g. Verify start date with Controller of Exams; update R23 revision 2 syllabus link..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Proposed Corrected Answer */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Suggested / Corrected Answer (Preview)</span>
                  <span className="text-[10.5px] font-normal text-slate-400">
                    Draft the ideal answer to train or inform
                  </span>
                </label>
                <textarea
                  rows={3}
                  value={editSuggestedAnswer}
                  onChange={(e) => setEditSuggestedAnswer(e.target.value)}
                  placeholder="Draft the exact improved answer or links to include..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
              <button
                onClick={() => {
                  if (confirm("Delete this log record?")) {
                    deleteMutation.mutate(activeLog.id);
                  }
                }}
                className="text-xs text-rose-600 hover:text-rose-700 font-bold px-3 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
              >
                Delete Log
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveLog(null)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    updateReviewMutation.mutate({
                      id: activeLog.id,
                      rating: editRating,
                      adminNotes: editAdminNotes,
                      suggestedAnswer: editSuggestedAnswer,
                    })
                  }
                  disabled={updateReviewMutation.isPending}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <Check size={14} /> Save Verdict & Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
