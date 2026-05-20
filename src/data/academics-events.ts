// Shared static notification data for the academics ticker.
// Calendar events come from academic-calendar.tsx local array.
// Exam events come from examination.tsx mock data and fee deadlines.
// NOTE: "daysUntil" is illustrative — in production these would be computed from real dates.

export type TickerSource = "calendar" | "results" | "hall-ticket" | "fee";

export interface TickerNotification {
  id: string;
  source: TickerSource;
  label: string;
  text: string;
  date: string;
  to: string;
  urgent: boolean; // true = within ~10 days
}

export const TICKER_NOTIFICATIONS: TickerNotification[] = [
  // ── Academic Calendar Events ──────────────────────────────────────────────
  {
    id: "cal-1",
    source: "calendar",
    label: "Calendar",
    text: "Commencement of Class Work — B.Tech II, III & IV Year Odd Semester begins",
    date: "15 Jun, 2026",
    to: "/academics/academic-calendar",
    urgent: false,
  },
  {
    id: "cal-2",
    source: "calendar",
    label: "Calendar",
    text: "I Mid Examinations — First mid-term examinations commence across all branches",
    date: "12 Aug, 2026",
    to: "/academics/academic-calendar",
    urgent: false,
  },
  {
    id: "cal-3",
    source: "calendar",
    label: "Calendar",
    text: "II Mid Examinations — Second mid-term examinations commence",
    date: "05 Oct, 2026",
    to: "/academics/academic-calendar",
    urgent: false,
  },
  {
    id: "cal-4",
    source: "calendar",
    label: "Calendar",
    text: "Preparation & Practicals — Lab exams and preparation holidays begin",
    date: "20 Oct, 2026",
    to: "/academics/academic-calendar",
    urgent: false,
  },
  {
    id: "cal-5",
    source: "calendar",
    label: "Calendar",
    text: "End Semester Examinations — Final theory examinations commence",
    date: "02 Nov, 2026",
    to: "/academics/academic-calendar",
    urgent: false,
  },
  {
    id: "cal-6",
    source: "calendar",
    label: "Calendar",
    text: "Semester Break — Winter break for all students begins",
    date: "25 Nov, 2026",
    to: "/academics/academic-calendar",
    urgent: false,
  },

  // ── Examination Results ───────────────────────────────────────────────────
  {
    id: "exam-1",
    source: "results",
    label: "Results",
    text: "Results Declared — B.Tech II Year II Sem Regular Examinations (April 2026)",
    date: "April 2026",
    to: "/academics/examination",
    urgent: true,
  },
  {
    id: "exam-2",
    source: "results",
    label: "Results",
    text: "Evaluation in Progress — M.Tech I Year II Sem Regular Examinations (May 2026)",
    date: "May 2026",
    to: "/academics/examination",
    urgent: false,
  },

  // ── Hall Tickets ──────────────────────────────────────────────────────────
  {
    id: "ht-1",
    source: "hall-ticket",
    label: "Hall Ticket",
    text: "Hall Tickets Available — B.Tech End Semester Examinations (Nov 2026) — Download Now",
    date: "Available Now",
    to: "/academics/examination",
    urgent: true,
  },
  {
    id: "ht-2",
    source: "hall-ticket",
    label: "Hall Ticket",
    text: "Hall Tickets to be Released — B.Tech III Year I Sem Supply Examinations (June 2026)",
    date: "June 2026",
    to: "/academics/examination",
    urgent: false,
  },

  // ── Fee Payment Deadlines ─────────────────────────────────────────────────
  {
    id: "fee-1",
    source: "fee",
    label: "Fee",
    text: "Exam Fee Payment Without Late Fee — Last date for Supply Examinations",
    date: "15 Oct, 2026",
    to: "/academics/examination",
    urgent: false,
  },
  {
    id: "fee-2",
    source: "fee",
    label: "Fee",
    text: "Exam Fee With Late Fee ₹100 — Last date for Supply Examinations registration",
    date: "20 Oct, 2026",
    to: "/academics/examination",
    urgent: false,
  },
  {
    id: "fee-3",
    source: "fee",
    label: "Fee",
    text: "Final Exam Fee With Late Fee ₹1000 — Closing date for Supply Examinations",
    date: "25 Oct, 2026",
    to: "/academics/examination",
    urgent: false,
  },
];
