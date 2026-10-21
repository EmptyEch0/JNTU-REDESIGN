import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import { chatbotLogs } from "../db/schema";
import { desc, eq, and, sql, gte, ilike, or } from "drizzle-orm";

export interface ChatbotLogItem {
  id: number;
  sessionId: string | null;
  question: string;
  answer: string;
  intent: string;
  language: string;
  source: string;
  confidence: string;
  rating: "good" | "needs_change" | "unreviewed";
  adminNotes: string | null;
  suggestedAnswer: string | null;
  userAgent: string | null;
  createdAt: string;
}

export interface ChatbotAnalyticsSummary {
  totalQueries: number;
  todayQueries: number;
  yesterdayQueries: number;
  accuracyRate: number;
  goodCount: number;
  needsChangeCount: number;
  unreviewedCount: number;
  dailyTrends: Array<{
    date: string;
    label: string;
    total: number;
    good: number;
    needsChange: number;
  }>;
  intentDistribution: Array<{
    intent: string;
    label: string;
    count: number;
    percentage: number;
  }>;
  languageDistribution: Array<{
    language: string;
    count: number;
  }>;
}

// ─────────────────────────────────────────────
// 1. LOG CHATBOT QUERY (Called from client/server)
// ─────────────────────────────────────────────

export const recordChatbotQuery = createServerFn({ method: "POST" })
  .validator(
    (data: {
      question: string;
      answer: string;
      intent?: string;
      language?: string;
      source?: string;
      confidence?: string;
      sessionId?: string;
    }) => data
  )
  .handler(async ({ data }) => {
    try {
      const [inserted] = await db
        .insert(chatbotLogs)
        .values({
          question: data.question.trim(),
          answer: data.answer.trim(),
          intent: data.intent || "unknown",
          language: data.language || "english",
          source: data.source || "server",
          confidence: data.confidence || "high",
          sessionId: data.sessionId || null,
          rating: "unreviewed",
        })
        .returning({ id: chatbotLogs.id });

      return { success: true, id: inserted?.id };
    } catch (err: any) {
      console.error("Error recording chatbot query log:", err);
      return { success: false, error: err.message };
    }
  });

// ─────────────────────────────────────────────
// 2. GET COMPREHENSIVE ANALYTICS SUMMARY
// ─────────────────────────────────────────────

export const getChatbotAnalyticsSummary = createServerFn({ method: "GET" })
  .validator((days: number = 30) => days)
  .handler(async ({ data: days = 30 }): Promise<ChatbotAnalyticsSummary> => {
    try {
      const now = new Date();
      const cutoffDate = new Date();
      cutoffDate.setDate(now.getDate() - days);

      // Fetch all queries within the window
      const rows = await db
        .select()
        .from(chatbotLogs)
        .where(gte(chatbotLogs.createdAt, cutoffDate))
        .orderBy(desc(chatbotLogs.createdAt));

      const totalQueries = rows.length;

      // Group by day for today & yesterday
      const todayStr = now.toISOString().slice(0, 10);
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);

      let todayQueries = 0;
      let yesterdayQueries = 0;
      let goodCount = 0;
      let needsChangeCount = 0;
      let unreviewedCount = 0;

      const dailyMap = new Map<string, { total: number; good: number; needsChange: number }>();

      // Initialize date buckets for the last N days
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const dateKey = d.toISOString().slice(0, 10);
        dailyMap.set(dateKey, { total: 0, good: 0, needsChange: 0 });
      }

      const intentCounts = new Map<string, number>();
      const langCounts = new Map<string, number>();

      for (const row of rows) {
        const createdAt = new Date(row.createdAt);
        const dateKey = createdAt.toISOString().slice(0, 10);

        if (dateKey === todayStr) todayQueries++;
        if (dateKey === yesterdayStr) yesterdayQueries++;

        if (row.rating === "good") goodCount++;
        else if (row.rating === "needs_change") needsChangeCount++;
        else unreviewedCount++;

        // Daily trend tracking
        const currentDay = dailyMap.get(dateKey) || { total: 0, good: 0, needsChange: 0 };
        currentDay.total += 1;
        if (row.rating === "good") currentDay.good += 1;
        if (row.rating === "needs_change") currentDay.needsChange += 1;
        dailyMap.set(dateKey, currentDay);

        // Intent distribution
        const intentKey = (row.intent || "general").toLowerCase();
        intentCounts.set(intentKey, (intentCounts.get(intentKey) || 0) + 1);

        // Language distribution
        const langKey = (row.language || "english").toLowerCase();
        langCounts.set(langKey, (langCounts.get(langKey) || 0) + 1);
      }

      // Convert daily trends array
      const dailyTrends = Array.from(dailyMap.entries()).map(([dateStr, stats]) => {
        const d = new Date(dateStr);
        const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        return {
          date: dateStr,
          label,
          total: stats.total,
          good: stats.good,
          needsChange: stats.needsChange,
        };
      });

      // Top intent breakdown
      const intentDistribution = Array.from(intentCounts.entries())
        .map(([intent, count]) => {
          const formatted = intent
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
          const percentage = totalQueries > 0 ? Math.round((count / totalQueries) * 100) : 0;
          return {
            intent,
            label: formatted,
            count,
            percentage,
          };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

      // Language breakdown
      const languageDistribution = Array.from(langCounts.entries())
        .map(([language, count]) => ({
          language: language.charAt(0).toUpperCase() + language.slice(1),
          count,
        }))
        .sort((a, b) => b.count - a.count);

      // Accuracy calculation (Good or High confidence without flagged changes)
      const nonFailedCount = totalQueries - needsChangeCount;
      const accuracyRate = totalQueries > 0 ? Math.round((nonFailedCount / totalQueries) * 100) : 100;

      return {
        totalQueries,
        todayQueries,
        yesterdayQueries,
        accuracyRate,
        goodCount,
        needsChangeCount,
        unreviewedCount,
        dailyTrends,
        intentDistribution,
        languageDistribution,
      };
    } catch (err: any) {
      console.error("Failed to calculate chatbot analytics:", err);
      return {
        totalQueries: 0,
        todayQueries: 0,
        yesterdayQueries: 0,
        accuracyRate: 100,
        goodCount: 0,
        needsChangeCount: 0,
        unreviewedCount: 0,
        dailyTrends: [],
        intentDistribution: [],
        languageDistribution: [],
      };
    }
  });

// ─────────────────────────────────────────────
// 3. GET FILTERED CHATBOT QUERY LOGS
// ─────────────────────────────────────────────

export interface GetChatbotLogsFilter {
  search?: string;
  rating?: "all" | "good" | "needs_change" | "unreviewed";
  intent?: string;
  source?: string;
  limit?: number;
  offset?: number;
}

export const getChatbotLogs = createServerFn({ method: "POST" })
  .validator((filter: GetChatbotLogsFilter) => filter)
  .handler(async ({ data: filter }): Promise<{ items: ChatbotLogItem[]; total: number }> => {
    try {
      const limit = filter.limit || 50;
      const offset = filter.offset || 0;

      const conditions: any[] = [];

      if (filter.rating && filter.rating !== "all") {
        conditions.push(eq(chatbotLogs.rating, filter.rating));
      }

      if (filter.intent && filter.intent !== "all") {
        conditions.push(eq(chatbotLogs.intent, filter.intent));
      }

      if (filter.source && filter.source !== "all") {
        conditions.push(eq(chatbotLogs.source, filter.source));
      }

      if (filter.search && filter.search.trim()) {
        const term = `%${filter.search.trim()}%`;
        conditions.push(
          or(
            ilike(chatbotLogs.question, term),
            ilike(chatbotLogs.answer, term),
            ilike(chatbotLogs.adminNotes, term)
          )
        );
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const rows = await db
        .select()
        .from(chatbotLogs)
        .where(whereClause)
        .orderBy(desc(chatbotLogs.createdAt))
        .limit(limit)
        .offset(offset);

      const items: ChatbotLogItem[] = rows.map((r) => ({
        id: r.id,
        sessionId: r.sessionId,
        question: r.question,
        answer: r.answer,
        intent: r.intent,
        language: r.language,
        source: r.source,
        confidence: r.confidence,
        rating: (r.rating as any) || "unreviewed",
        adminNotes: r.adminNotes,
        suggestedAnswer: r.suggestedAnswer,
        userAgent: r.userAgent,
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
      }));

      // Approximate count
      return { items, total: items.length };
    } catch (err: any) {
      console.error("Failed to query chatbot logs:", err);
      return { items: [], total: 0 };
    }
  });

// ─────────────────────────────────────────────
// 4. UPDATE ADMIN REVIEW / FEEDBACK
// ─────────────────────────────────────────────

export const updateChatbotLogReview = createServerFn({ method: "POST" })
  .validator(
    (data: {
      id: number;
      rating: "good" | "needs_change" | "unreviewed";
      adminNotes?: string;
      suggestedAnswer?: string;
    }) => data
  )
  .handler(async ({ data }) => {
    try {
      await db
        .update(chatbotLogs)
        .set({
          rating: data.rating,
          adminNotes: data.adminNotes !== undefined ? data.adminNotes : null,
          suggestedAnswer: data.suggestedAnswer !== undefined ? data.suggestedAnswer : null,
        })
        .where(eq(chatbotLogs.id, data.id));

      return { success: true };
    } catch (err: any) {
      console.error("Failed to update chatbot log review:", err);
      return { success: false, error: err.message };
    }
  });

// ─────────────────────────────────────────────
// 5. DELETE A LOG ENTRY
// ─────────────────────────────────────────────

export const deleteChatbotLog = createServerFn({ method: "POST" })
  .validator((id: number) => id)
  .handler(async ({ data: id }) => {
    try {
      await db.delete(chatbotLogs).where(eq(chatbotLogs.id, id));
      return { success: true };
    } catch (err: any) {
      console.error("Failed to delete chatbot log:", err);
      return { success: false, error: err.message };
    }
  });

// ─────────────────────────────────────────────
// 6. SEED DEMO LOGS (If logs are empty)
// ─────────────────────────────────────────────

export const seedSampleChatbotLogs = createServerFn({ method: "POST" }).handler(async () => {
  try {
    const existing = await db.select({ count: sql<number>`count(*)` }).from(chatbotLogs);
    if (Number(existing[0]?.count || 0) > 10) {
      return { success: true, message: "Logs already populated." };
    }

    const sampleQueries = [
      {
        question: "Show me the CSE R23 B.Tech syllabus",
        answer: "Here is the **CSE R23 B.Tech Syllabus** covering 1st to 4th Year. 📥 [Download Syllabus PDF](/uploads/2023/10/CSE-finalR23.pdf)",
        intent: "syllabus",
        language: "english",
        source: "dedicated_kb",
        confidence: "high",
        rating: "good",
        daysAgo: 0,
      },
      {
        question: "What are the hostel fees for boys and girls?",
        answer: "**Hostel & Mess Fees**: The refundable hostel caution deposit is ₹3,000. Mess bills run on monthly dividing system approx ₹2,800 - ₹3,500/month. 🏠 [Hostel Details](/hostels)",
        intent: "hostel",
        language: "english",
        source: "dedicated_kb",
        confidence: "high",
        rating: "good",
        daysAgo: 0,
      },
      {
        question: "Who is the principal of JNTU-GV CEV?",
        answer: "**Principal**: Prof. Dr. V. S. Vakula, Ph.D. Office: Ground Floor, Administrative Block. 📧 principal.cev@jntugv.edu.in",
        intent: "principal",
        language: "english",
        source: "dedicated_kb",
        confidence: "high",
        rating: "good",
        daysAgo: 1,
      },
      {
        question: "ECE department lo emi laboratories unnayi?",
        answer: "JNTU-GV CEV ECE Department has **7 advanced laboratories**: IC & HDL Lab, DSP Lab, Microwave & Optical Lab, IoT Lab. 🌐 [ECE Labs](/departments/ece/labs)",
        intent: "lab",
        language: "tenglish",
        source: "dedicated_kb",
        confidence: "high",
        rating: "good",
        daysAgo: 1,
      },
      {
        question: "What is the highest package in placements this year?",
        answer: "The **Highest Package** at JNTU-GV CEV is **42 LPA** (Microsoft/Amazon off-campus) and **14 LPA** on-campus. Average package: 5.5 LPA. 🏢 [Placements Portal](/placements/students)",
        intent: "placement",
        language: "english",
        source: "dedicated_kb",
        confidence: "high",
        rating: "good",
        daysAgo: 2,
      },
      {
        question: "When will mid-2 exams start for 3rd year?",
        answer: "Mid-term examinations (Mid-1 & Mid-2) follow the academic calendar published by the Controller of Examinations. 📂 [View Academic Calendar](/academics/academic-calendar)",
        intent: "exam",
        language: "english",
        source: "live_db",
        confidence: "high",
        rating: "needs_change",
        adminNotes: "Needs exact start date once COE issues notification for March 2026.",
        suggestedAnswer: "Mid-2 exams for 3rd year B.Tech are scheduled tentatively for the 3rd week of March 2026. Official circular will be posted on Notices.",
        daysAgo: 2,
      },
      {
        question: "How to apply for Jagananna Vidya Deevena scholarship?",
        answer: "Apply through the official **JnanaBhumi Portal** via your village/ward secretariats. Required documents: Rice card, Aadhaar, Income certificate. 🌐 [Scholarships](/academics/scholarships)",
        intent: "scholarship",
        language: "english",
        source: "dedicated_kb",
        confidence: "high",
        rating: "good",
        daysAgo: 3,
      },
      {
        question: "ప్రధానోపాధ్యాయులు ఎవరు?",
        answer: "జేఎన్‌టీయూ-జీవీ కాలేజ్ ఆఫ్ ఇంజనీరింగ్ విజయనగరం **ప్రిన్సిపాల్**: **డా. వి. ఎస్. వాకుల** (Dr. V. S. Vakula), ప్రొఫెసర్, ఈఈఈ విభాగం.",
        intent: "principal",
        language: "telugu",
        source: "dedicated_kb",
        confidence: "high",
        rating: "good",
        daysAgo: 3,
      },
      {
        question: "Where can I get bonafide certificate for passport?",
        answer: "Visit the **Principal's Office** (Admin Block, Ground Floor) with a written application countersigned by your HOD. Working hours: 10:00 AM - 5:00 PM.",
        intent: "principals_office",
        language: "english",
        source: "dedicated_kb",
        confidence: "high",
        rating: "good",
        daysAgo: 4,
      },
      {
        question: "Who built this AI chatbot?",
        answer: "This intelligent chatbot and portal redesign was architected and developed by the **Student Engineering Team**: Likhith, Charan Teja, Sai Rupini, Sai Vamsi, and Anitha, under the mentorship of **Mr. Anil Wurity** (Assistant Professor, IT).",
        intent: "contributors",
        language: "english",
        source: "instant_client",
        confidence: "high",
        rating: "good",
        daysAgo: 4,
      },
      {
        question: "Nearest airport to college and travel time?",
        answer: "The nearest upcoming airport is **Bhogapuram Greenfield International Airport (~36 km)**. The current operational airport is Visakhapatnam International Airport (VTZ) (~55 km).",
        intent: "airport",
        language: "english",
        source: "dedicated_kb",
        confidence: "high",
        rating: "good",
        daysAgo: 5,
      },
      {
        question: "Is there any swimming pool in college?",
        answer: "JNTU-GV CEV campus has sports facilities including cricket, football ground, basketball court, indoor badminton courts, and gymnasium. Currently there is no swimming pool.",
        intent: "sports",
        language: "english",
        source: "dedicated_kb",
        confidence: "high",
        rating: "good",
        daysAgo: 5,
      },
      {
        question: "What is EAMCET cutoff for CSE branch?",
        answer: "Approximate AP EAMCET Closing Ranks for CSE: OC Boys ~6,500, OC Girls ~7,200, BC ~12,000 - 18,000, SC/ST ~35,000 - 55,000. 🌐 [Admissions Info](/academics/admissions)",
        intent: "admission",
        language: "english",
        source: "dedicated_kb",
        confidence: "high",
        rating: "good",
        daysAgo: 6,
      },
      {
        question: "What is the WiFi password for library?",
        answer: "The Central Library provides high-speed campus Wi-Fi. Students can obtain credentials from the IT center or library circulation desk using their roll number.",
        intent: "library",
        language: "english",
        source: "rag_fallback",
        confidence: "fallback",
        rating: "needs_change",
        adminNotes: "Clarify that students must register their device MAC address with the Computer Center.",
        suggestedAnswer: "Campus Wi-Fi is accessed via student roll number portal. Register your MAC address with the System Administrator in the Central Computing Center.",
        daysAgo: 6,
      },
    ];

    for (const item of sampleQueries) {
      const d = new Date();
      d.setDate(d.getDate() - item.daysAgo);
      d.setHours(10 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60));

      await db.insert(chatbotLogs).values({
        question: item.question,
        answer: item.answer,
        intent: item.intent,
        language: item.language,
        source: item.source,
        confidence: item.confidence,
        rating: item.rating as any,
        adminNotes: item.adminNotes || null,
        suggestedAnswer: item.suggestedAnswer || null,
        createdAt: d,
      });
    }

    return { success: true, count: sampleQueries.length };
  } catch (err: any) {
    console.error("Failed to seed sample chatbot logs:", err);
    return { success: false, error: err.message };
  }
});
