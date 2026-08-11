/**
 * JNTU AI — LLM-Free Intelligent Answer Engine
 * -----------------------------------------------
 * Replaces Groq/OpenAI with:
 *   1. Intent detection  (regex + keyword scoring)
 *   2. BM25-style term-frequency boosting on top of vector search
 *   3. Structured template-based answer formatting
 *   4. Telugu / Tenglish auto-detection and response
 *
 * Zero external API calls. Fully local + DB.
 */

// ─────────────────────────────────────────────
// 1. LANGUAGE DETECTION
// ─────────────────────────────────────────────

export function detectLanguage(text: string): "telugu" | "tenglish" | "english" {
  // Telugu Unicode block: \u0C00–\u0C7F
  if (/[\u0C00-\u0C7F]/.test(text)) return "telugu";

  // Tenglish — Telugu words written in Roman letters
  const tenglishWords =
    /\b(ela|cheppandi|cheppu|enthi|ento|eppudu|emtho|emi|evaru|ekkada|ledu|undi|cheyandi|meeru|memu|manamu|maku|ivvandi|chudandi|teliyadu|telusa|ani|kada|kaadu|avunu|okka|vundi|unnaru|chestunnaru|cheppadu|randi|velladdam|pampinchandi)\b/i;
  if (tenglishWords.test(text)) return "tenglish";

  return "english";
}

// ─────────────────────────────────────────────
// 2. INTENT DETECTION
// ─────────────────────────────────────────────

export type Intent =
  | "greeting"
  | "farewell"
  | "thanks"
  | "leadership"
  | "principal"
  | "vice_principal"
  | "department"
  | "hostel"
  | "library"
  | "placement"
  | "syllabus"
  | "timetable"
  | "exam"
  | "fee"
  | "notice"
  | "nss"
  | "sports"
  | "dispensary"
  | "wec"
  | "edc"
  | "research"
  | "iqac"
  | "prof_body"
  | "club"
  | "admission"
  | "contact"
  | "location"
  | "about"
  | "faculty"
  | "lab"
  | "mou"
  | "transport"
  | "stories"
  | "projects"
  | "unknown";

const INTENT_PATTERNS: Array<{ intent: Intent; pattern: RegExp }> = [
  { intent: "greeting",      pattern: /^\s*(hi|hello|hey|namaste|namaskar|good\s*(morning|evening|afternoon)|howdy|sup|hii+|helo)\b/i },
  { intent: "farewell",      pattern: /\b(bye|goodbye|see you|take care|quit|exit|cya)\b/i },
  { intent: "thanks",        pattern: /\b(thank(s| you)|thanks\s*a\s*(lot|ton|bunch)|dhanyavaadalu|dhanyavadalu|ty\b|thx)\b/i },
  { intent: "stories",       pattern: /\b(story|stories|experience|campus life|student life|culture|life at|lifestyle|memories)\b/i },
  { intent: "projects",      pattern: /\b(project|projects|innovation|innovations|prototype|research project|student project|achievement)\b/i },
  { intent: "principal",     pattern: /\b(principal|head of college|college head|who leads|who is in charge|college chief)\b/i },
  { intent: "vice_principal",pattern: /\b(vice.?principal|vp\b|vice principal)\b/i },
  { intent: "leadership",    pattern: /\b(leadership|management|governing body|administration|officials)\b/i },
  { intent: "department",    pattern: /\b(department|branch|program|stream|course|cse|ece|eee|mba|mechanical|metallurg|civil|it\b|information technology|what departments|which branches|how many branch)\b/i },
  { intent: "hostel",        pattern: /\b(hostel|accommodation|warden|mess|room|dormitory|boys hostel|girls hostel|residential)\b/i },
  { intent: "library",       pattern: /\b(library|book|journal|digital library|e-resource|librarian|reading room)\b/i },
  { intent: "placement",     pattern: /\b(placement|recruit|package|salary|tpo|campus drive|internship|job|lpa|offer|hire|placed|placement cell)\b/i },
  { intent: "syllabus",      pattern: /\b(syllabus|curriculum|r20|r23|r25|regulation|subject|course structure|study plan|scheme)\b/i },
  { intent: "timetable",     pattern: /\b(timetable|time table|schedule|class time|lecture schedule|period)\b/i },
  { intent: "exam",          pattern: /\b(exam|examination|result|revaluation|hall ticket|mid.?term|end.?sem|supply|backlog|cbcs|grade|marks|gpa|cgpa)\b/i },
  { intent: "fee",           pattern: /\b(fee|tuition|payment|scholarship|fee structure|college fees|how much cost|charges|annual fee|semester fee)\b/i },
  { intent: "notice",        pattern: /\b(notice|circular|announcement|notification|latest news|updates|bulletin)\b/i },
  { intent: "nss",           pattern: /\b(nss|national service scheme|volunteer|community service|social service)\b/i },
  { intent: "sports",        pattern: /\b(sports|gym|ground|tournament|athletics|cricket|football|basketball|indoor|outdoor|games|physical)\b/i },
  { intent: "dispensary",    pattern: /\b(dispensary|medical|doctor|nurse|ambulance|health|clinic|medicine|hospital|sick|first aid)\b/i },
  { intent: "wec",           pattern: /\b(women|wec|empowerment|harassment|anti.?ragging|grievance|gender cell|she team)\b/i },
  { intent: "edc",           pattern: /\b(edc|entrepreneur|startup|incubat|innovation|edii|msme|business)\b/i },
  { intent: "research",      pattern: /\b(research|rd\b|r&d|phd|ph\.d|scholar|publication|journal|patent|project|funding|consultancy)\b/i },
  { intent: "iqac",          pattern: /\b(iqac|naac|accreditat|aqar|quality|nba|ranking|nirf)\b/i },
  { intent: "prof_body",     pattern: /\b(ieee|iste|csi|professional body|chapter|professional society)\b/i },
  { intent: "club",          pattern: /\b(club|music|cultural|dance|drama|fest|techfest|activity|student club|technical club|coding club)\b/i },
  { intent: "admission",     pattern: /\b(admission|eamcet|rank|cutoff|seat|apply|application|eligibility|lateral entry|how to join|how to get)\b/i },
  { intent: "contact",       pattern: /\b(contact|phone|email|call|reach|number|helpline|support|enquiry|inquiry)\b/i },
  { intent: "location",      pattern: /\b(location|address|where|how to reach|directions|map|vizianagaram|dwarapudi|distance|km)\b/i },
  { intent: "about",         pattern: /\b(about|history|overview|tell me about|what is jntu|founded|established|affiliation|autonomous|constituent)\b/i },
  { intent: "faculty",       pattern: /\b(faculty|professor|lecturer|teacher|staff|hod|head of department|assistant professor|associate professor)\b/i },
  { intent: "lab",           pattern: /\b(lab|laboratory|workshop|equipment|infrastructure|facility|computer lab|language lab)\b/i },
  { intent: "mou",           pattern: /\b(mou|memorandum|agreement|collaboration|tie.?up|partner)\b/i },
  { intent: "transport",     pattern: /\b(transport|bus|van|vehicle|commute|pick.?up|drop|route)\b/i },
];

export function detectIntents(query: string): Intent[] {
  const matched: Intent[] = [];
  for (const { intent, pattern } of INTENT_PATTERNS) {
    if (pattern.test(query)) matched.push(intent);
  }
  return matched.length > 0 ? matched : ["unknown"];
}

// ─────────────────────────────────────────────
// 3. BM25-STYLE TERM FREQUENCY BOOSTING
// ─────────────────────────────────────────────

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

const STOPWORDS = new Set([
  "the","and","for","are","was","were","this","that","with","have","from",
  "they","will","been","has","but","not","what","can","all","its","any",
  "how","our","their","who","which","about","tell","give","show","please",
  "want","need","know","get","would","could","should","does","did","some",
]);

function bm25Score(queryTokens: string[], docText: string, k1 = 1.5, b = 0.75, avgDocLen = 80): number {
  const docTokens = tokenize(docText);
  const docLen = docTokens.length;
  const freq: Record<string, number> = {};
  for (const t of docTokens) freq[t] = (freq[t] || 0) + 1;

  let score = 0;
  for (const qt of queryTokens) {
    if (STOPWORDS.has(qt)) continue;
    const tf = freq[qt] || 0;
    if (tf === 0) continue;
    const idf = Math.log(1 + 1 / (0.5 + tf)); // simplified IDF
    const num = tf * (k1 + 1);
    const den = tf + k1 * (1 - b + b * (docLen / avgDocLen));
    score += idf * (num / den);
  }
  return score;
}

export interface RankedChunk {
  content: string;
  source_type: string;
  metadata: any;
  similarity: number;
  bm25: number;
  hybridScore: number;
}

// Maps each intent to the DB source_types that should be boosted
const SOURCE_BOOST_MAP: Partial<Record<Intent, string[]>> = {
  principal:     ["leadership", "leadership_staff"],
  vice_principal:["leadership", "leadership_staff"],
  leadership:    ["leadership", "leadership_staff"],
  department:    ["department", "course", "hod"],
  hostel:        ["hostel", "hostel_staff"],
  library:       ["library", "library_staff"],
  placement:     ["placement", "recruiter", "placement_staff"],
  syllabus:      ["syllabus", "regulation", "academic_download"],
  timetable:     ["timetable"],
  exam:          ["exam_cell"],
  fee:           ["fee"],
  nss:           ["nss"],
  sports:        ["sports"],
  dispensary:    ["dispensary"],
  wec:           ["wec"],
  edc:           ["edc"],
  research:      ["rd_project", "rd_publication", "rd_scholar"],
  iqac:          ["iqac"],
  prof_body:     ["prof_body"],
  club:          ["student_club"],
  notice:        ["notice", "notification"],
  faculty:       ["faculty", "hod", "leadership_staff"],
  lab:           ["laboratory"],
  mou:           ["mou", "iqac"],
  about:         ["site_content", "about"],
  contact:       ["site_content", "leadership"],
};

export function rerankChunks(chunks: any[], query: string, intents: Intent[]): RankedChunk[] {
  const queryTokens = tokenize(query).filter((t) => !STOPWORDS.has(t));

  const boostedTypes = new Set<string>();
  for (const intent of intents) {
    for (const t of SOURCE_BOOST_MAP[intent] ?? []) boostedTypes.add(t);
  }

  return chunks
    .map((chunk) => {
      const sim = parseFloat(chunk.similarity ?? "0") || 0;
      const bm25 = bm25Score(queryTokens, chunk.content);
      const typeBoost = boostedTypes.has(chunk.source_type) ? 0.25 : 0;
      const hybridScore = sim * 0.55 + (bm25 / 10) * 0.35 + typeBoost;
      return { ...chunk, bm25, hybridScore } as RankedChunk;
    })
    .sort((a, b) => b.hybridScore - a.hybridScore)
    .slice(0, 10);
}

// ─────────────────────────────────────────────
// 4. METADATA / LINK EXTRACTION HELPERS
// ─────────────────────────────────────────────

function extractLinks(chunks: RankedChunk[]): Array<{ title: string; url: string }> {
  const links: Array<{ title: string; url: string }> = [];
  const seen = new Set<string>();
  for (const chunk of chunks) {
    const mdLinkRe = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
    let m: RegExpExecArray | null;
    while ((m = mdLinkRe.exec(chunk.content)) !== null) {
      if (!seen.has(m[2])) { links.push({ title: m[1], url: m[2] }); seen.add(m[2]); }
    }
    const rawUrlRe = /https?:\/\/[^\s)>"]+/g;
    while ((m = rawUrlRe.exec(chunk.content)) !== null) {
      if (!seen.has(m[0])) { links.push({ title: "Download", url: m[0] }); seen.add(m[0]); }
    }
  }
  return links;
}

function extractText(chunks: RankedChunk[], maxChars = 1800): string {
  return chunks.map((c) => c.content.trim()).join("\n\n").slice(0, maxChars);
}

function relevantSentences(chunks: RankedChunk[], keywords: string[], limit = 6): string {
  const kws = keywords.map((k) => k.toLowerCase());
  const sentences: string[] = [];
  for (const chunk of chunks) {
    const sents = chunk.content.split(/(?<=[.!?])\s+/);
    for (const s of sents) {
      const sl = s.toLowerCase();
      if (kws.some((k) => sl.includes(k)) && s.trim().length > 15) {
        sentences.push(s.trim());
        if (sentences.length >= limit) return sentences.join(" ");
      }
    }
  }
  return sentences.join(" ").trim();
}

function linkify(links: Array<{ title: string; url: string }>): string {
  return links.map((l) => `• [${l.title}](${l.url})`).join("\n");
}

// ─────────────────────────────────────────────
// 5. STATIC KNOWLEDGE BASE (instant answers, no DB round-trip)
// ─────────────────────────────────────────────

const KB = {
  college: {
    name: "JNTU-GV College of Engineering Vizianagaram (JNTU-GV CEV)",
    affiliation: "constituent college of Jawaharlal Nehru Technological University Gurajada Vizianagaram",
    address: "Dwarapudi, Vizianagaram – 535003, Andhra Pradesh, India",
    phone: "+91 8922 244 100",
    email: "principal@jntugvcev.edu.in",
    website: "https://jntugvcev.edu.in",
  },
  principal: {
    name: "Prof. Kota Chandra Bhushana Rao",
    designation: "Professor & Principal (i/c)",
    email: "principal@jntugvcev.edu.in",
  },
  vicePrincipal: {
    name: "Prof. G. J. Naga Raju",
    designation: "Vice Principal",
    email: "viceprincipal@jntugvcev.edu.in",
  },
  departments: [
    "CSE", "IT", "ECE", "EEE",
    "Mechanical Engineering", "Metallurgical Engineering",
    "Sciences & Humanities", "MBA",
  ],
  regulations: ["R20", "R23", "R25"],
} as const;

// ─────────────────────────────────────────────
// 6. ANSWER BUILDER
// ─────────────────────────────────────────────

function buildAnswer(
  intents: Intent[],
  query: string,
  chunks: RankedChunk[],
  lang: "telugu" | "tenglish" | "english"
): string {
  const links = extractLinks(chunks);
  const ctxText = extractText(chunks);
  const hasCtx = ctxText.trim().length > 30;
  const isTe = lang === "telugu";
  const isTenglish = lang === "tenglish";
  const primary = intents[0];

  // convenience wrappers
  const rel = (kws: string[], n = 6) => relevantSentences(chunks, kws, n);
  const linksFor = (...terms: string[]) =>
    links.filter((l) => terms.some((t) => l.url.toLowerCase().includes(t)));

  // ── GREETING ──
  if (primary === "greeting") {
    if (isTe)  return "నమస్కారం! 🙏 నేను JNTU AI — మీ స్మార్ట్ కాంపస్ సహాయకుడు. విభాగాలు, హాస్టల్, ఫీజులు, పరీక్షలు — అన్నింటి గురించి అడగండి! 😊";
    if (isTenglish) return "Hello! 👋 Nenu JNTU AI — mee campus guide. Departments, hostel, fees, exams gurinchi adugandi! 😊";
    return "Hi! 👋 I'm **JNTU AI**, your smart campus companion. Ask me about departments, admissions, hostel, fees, exams, placements and more! 😊";
  }

  // ── FAREWELL ──
  if (primary === "farewell") {
    if (isTe) return "వెళ్ళి రండి! 😊 ఏదైనా అడగాలంటే, నేను ఇక్కడ ఉన్నాను!";
    return "Goodbye! 😊 Feel free to come back whenever you need help. All the best!";
  }

  // ── THANKS ──
  if (primary === "thanks") {
    if (isTe) return "మీకు ఉపయోగపడినందుకు సంతోషంగా ఉంది! 😊 ఇంకా ఏదైనా అడగండి!";
    return "You're most welcome! 😊 Happy to help anytime!";
  }

  // ── PRINCIPAL ──
  if (intents.includes("principal") && !intents.includes("vice_principal")) {
    const extra = rel(["principal", "prof", "kota", "bhushana"]);
    if (isTe) return `మా కళాశాల ప్రిన్సిపల్ **${KB.principal.name}** గారు (${KB.principal.designation}).\n📧 ${KB.principal.email}${extra ? `\n\n${extra}` : ""}`;
    return `The Principal of JNTU-GV CEV is **${KB.principal.name}** (${KB.principal.designation}).\n📧 Email: [${KB.principal.email}](mailto:${KB.principal.email})${extra ? `\n\n${extra}` : ""}`;
  }

  // ── VICE PRINCIPAL ──
  if (intents.includes("vice_principal")) {
    if (isTe) return `మా వైస్ ప్రిన్సిపల్ **${KB.vicePrincipal.name}** గారు (${KB.vicePrincipal.designation}).\n📧 ${KB.vicePrincipal.email}`;
    return `The Vice Principal is **${KB.vicePrincipal.name}** (${KB.vicePrincipal.designation}).\n📧 [${KB.vicePrincipal.email}](mailto:${KB.vicePrincipal.email})`;
  }

  // ── LEADERSHIP ──
  if (intents.includes("leadership")) {
    const extra = rel(["principal", "vice", "governing", "administration"]);
    return `**JNTU-GV CEV Leadership** 🏛️\n\n• **Principal**: ${KB.principal.name} — [${KB.principal.email}](mailto:${KB.principal.email})\n• **Vice Principal**: ${KB.vicePrincipal.name} — [${KB.vicePrincipal.email}](mailto:${KB.vicePrincipal.email})${extra ? `\n\n${extra}` : ""}`;
  }

  // ── DEPARTMENTS ──
  if (intents.includes("department")) {
    const extra = rel(["seats", "intake", "department", "branch", "offered"]);
    const list = KB.departments.map((d, i) => `${i + 1}. ${d}`).join("\n");
    if (isTe) return `JNTU-GV CEV లో **${KB.departments.length} విభాగాలు** ఉన్నాయి 🎓\n\n${list}${extra ? `\n\n${extra}` : ""}`;
    if (isTenglish) return `JNTU-GV CEV lo **${KB.departments.length} departments** unnaayi 🎓\n\n${list}${extra ? `\n\n${extra}` : ""}`;
    return `JNTU-GV CEV offers **${KB.departments.length} departments** 🎓\n\n${list}${extra ? `\n\n${extra}` : ""}`;
  }

  // ── STORIES & CAMPUS EXPERIENCE ──
  if (intents.includes("stories")) {
    const storyInfo = rel(["story", "campus", "life", "experience", "fest", "culture", "student", "hackathon", "nss"], 8);
    if (isTe) return `**క్యాంపస్ జీవితం మరియు అనుభవాలు** 🌟\n\n${storyInfo || "JNTU-GV CEV లో 100 ఎకరాల హరిత కాంపస్ లో నిరంతరం టెక్ ఫెస్ట్‌లు, హ్యాకథాన్‌లు, క్రీడా పోటీలు మరియు సాంస్కృతిక వేడుకలు జరుగుతుంటాయి."}`;
    return `**Campus Stories & Student Life** 🌟\n\n${storyInfo || "Life at JNTU-GV CEV combines rigorous technical education with a 100-acre lush green campus, annual fests, coding hackathons, sports tournaments, and NSS community activities."}`;
  }

  // ── INNOVATIONS & PROJECTS ──
  if (intents.includes("projects")) {
    const projInfo = rel(["project", "innovation", "research", "r&d", "prototype", "solar", "ai", "iot", "drone"], 8);
    return `**Student Projects & Innovations** 💡\n\n${projInfo || "Students at JNTU-GV CEV develop innovative engineering projects including AI smart agriculture tools, solar microgrids, robotics, and IoT smart grid controllers under faculty guidance."}`;
  }

  // ── SYLLABUS ──
  if (intents.includes("syllabus")) {
    const regMentioned = /r20|r23|r25/i.test(query);
    if (!regMentioned) {
      if (isTe) return "సిలబస్ కోసం — ఏ రెగ్యులేషన్ కావాలి? 😊\n\n• **R20** — 2020 బ్యాచ్\n• **R23** — 2023 బ్యాచ్\n• **R25** — 2025 బ్యాచ్";
      if (isTenglish) return "Syllabus kosam — which regulation kavali? 😊\n\n• **R20**, **R23**, **R25**\n\nOkadaanni cheppandi!";
      return "Sure! Which regulation are you looking for? 😊\n\n• **R20** — 2020 batch\n• **R23** — 2023 batch\n• **R25** — 2025 batch";
    }
    const relInfo = rel(["syllabus", "r20", "r23", "r25", "download", "pdf", "scheme"], 8);
    const sylLinks = linksFor("syllabus", "regulation", "r20", "r23", "r25", ".pdf");
    let resp = `**Syllabus Information** 📄\n\n${relInfo || ctxText.slice(0, 600)}`;
    resp += sylLinks.length > 0
      ? `\n\n**Download Links:**\n${linkify(sylLinks)}`
      : `\n\n📁 [Academics → Regulations](${KB.college.website}/academics/regulations)`;
    return resp;
  }

  // ── TIMETABLE ──
  if (intents.includes("timetable")) {
    if (hasCtx) {
      const relInfo = rel(["timetable", "schedule", "time", "class", "lecture"], 6);
      const ttLinks = linksFor("timetable", "schedule");
      let resp = `**Class Timetables** 🕒\n\n${relInfo || ctxText.slice(0, 500)}`;
      resp += ttLinks.length > 0 ? `\n\n**Downloads:**\n${linkify(ttLinks)}` : `\n\n📂 [Timetables](${KB.college.website}/academics/timetables)`;
      return resp;
    }
    return `📂 Timetables: [Academics → Timetables](${KB.college.website}/academics/timetables)`;
  }

  // ── EXAM / RESULTS ──
  if (intents.includes("exam")) {
    if (hasCtx) {
      const relInfo = rel(["exam", "result", "date", "schedule", "revaluation", "hall ticket"], 6);
      const examLinks = linksFor("exam", "result", "hall", "notification");
      let resp = `**Examination & Results** 📝\n\n${relInfo || ctxText.slice(0, 500)}`;
      resp += examLinks.length > 0 ? `\n\n**Links:**\n${linkify(examLinks)}` : `\n\n📂 [Examination Page](${KB.college.website}/academics/examination)`;
      return resp;
    }
    return `📂 Examination info: [Academics → Examination](${KB.college.website}/academics/examination)`;
  }

  // ── HOSTEL ──
  if (intents.includes("hostel")) {
    const relInfo = rel(["hostel", "warden", "mess", "room", "fee", "accommodation", "boys", "girls"], 7);
    if (isTe) return `**హాస్టల్ సమాచారం** 🏠\n\n${relInfo || "Boys మరియు Girls వేర్వేరు హాస్టల్ సదుపాయాలు ఉన్నాయి."}\n\n📞 ${KB.college.phone}`;
    return `**Hostel Information** 🏠\n\n${relInfo || "JNTU-GV CEV has separate hostel facilities for boys and girls with mess facilities."}\n\n📞 ${KB.college.phone}`;
  }

  // ── PLACEMENT ──
  if (intents.includes("placement")) {
    const relInfo = rel(["placement", "package", "lpa", "company", "recruit", "offer", "tpo", "campus"], 7);
    const pLinks = linksFor("placement", "recruit");
    return `**Placements at JNTU-GV CEV** 🏢\n\n${relInfo || ctxText.slice(0, 600)}\n\n${pLinks.length > 0 ? linkify(pLinks.slice(0, 3)) : `🌐 [Placements](${KB.college.website}/placements)`}`;
  }

  // ── FEE ──
  if (intents.includes("fee")) {
    const relInfo = rel(["fee", "tuition", "semester", "annual", "scholarship", "payment", "amount"], 7);
    const fLinks = linksFor("fee", "scholarship");
    if (isTe) return `**ఫీజు నిర్మాణం** 💰\n\n${relInfo || `కాలేజీని సంప్రదించండి:\n📞 ${KB.college.phone}\n📧 ${KB.college.email}`}${fLinks.length > 0 ? `\n\n${linkify(fLinks.slice(0, 3))}` : ""}`;
    return `**Fee Structure** 💰\n\n${relInfo || `Contact college for exact fee details:\n📞 ${KB.college.phone}`}${fLinks.length > 0 ? `\n\n${linkify(fLinks.slice(0, 3))}` : ""}`;
  }

  // ── LIBRARY ──
  if (intents.includes("library")) {
    const relInfo = rel(["library", "book", "journal", "digital", "librarian", "reading"], 6);
    return `**Library** 📚\n\n${relInfo || "The college library offers physical books, journals, digital resources, and e-library access for all students."}`;
  }

  // ── NOTICE ──
  if (intents.includes("notice")) {
    if (hasCtx) {
      const relInfo = rel(["notice", "circular", "announcement", "date", "deadline", "notification"], 7);
      let resp = `**Notices & Announcements** 📢\n\n${relInfo || ctxText.slice(0, 700)}`;
      if (links.length > 0) resp += `\n\n${linkify(links.slice(0, 5))}`;
      return resp;
    }
    return `📢 Notices: [${KB.college.website}](${KB.college.website})`;
  }

  // ── NSS ──
  if (intents.includes("nss")) {
    const relInfo = rel(["nss", "national service", "volunteer", "community", "camp"], 5);
    return `**NSS — National Service Scheme** 🌱\n\n${relInfo || "JNTU-GV CEV has an active NSS unit organising community service, health camps, and social awareness programs."}\n\n📞 ${KB.college.phone}`;
  }

  // ── SPORTS ──
  if (intents.includes("sports")) {
    const relInfo = rel(["sports", "gym", "ground", "tournament", "cricket", "football", "game"], 6);
    return `**Sports & Athletics** 🏆\n\n${relInfo || "JNTU-GV CEV has sports infrastructure for cricket, football, basketball, and indoor facilities."}`;
  }

  // ── DISPENSARY ──
  if (intents.includes("dispensary")) {
    const relInfo = rel(["dispensary", "medical", "doctor", "nurse", "ambulance", "health"], 5);
    if (isTe) return `**వైద్య సదుపాయాలు** 🏥\n\n${relInfo || "కాలేజీలో డాక్టర్ మరియు నర్స్ సేవలు అందుబాటులో ఉన్నాయి."}\n\n📞 ${KB.college.phone}`;
    return `**Dispensary & Medical** 🏥\n\n${relInfo || "On-campus dispensary with doctor and nurse services. Ambulance available for emergencies."}\n\n📞 ${KB.college.phone}`;
  }

  // ── WEC ──
  if (intents.includes("wec")) {
    const relInfo = rel(["women", "empowerment", "wec", "harassment", "grievance", "gender"], 5);
    return `**Women Empowerment Cell (WEC)** 👩‍🎓\n\n${relInfo || "JNTU-GV CEV's WEC focuses on gender sensitisation, anti-ragging measures, and support for female students."}\n\n📧 [${KB.college.email}](mailto:${KB.college.email})`;
  }

  // ── EDC ──
  if (intents.includes("edc")) {
    const relInfo = rel(["edc", "entrepreneur", "startup", "incubat", "innovation", "msme"], 5);
    return `**EDC — Entrepreneurship Development Cell** 💡\n\n${relInfo || "The EDC supports student startups, innovation, and entrepreneurship through workshops and incubation support."}`;
  }

  // ── RESEARCH ──
  if (intents.includes("research")) {
    const relInfo = rel(["research", "project", "publication", "phd", "scholar", "journal", "patent", "fund"], 8);
    return `**Research & Development** 🔬\n\n${relInfo || ctxText.slice(0, 700) || "Active research programs, Ph.D. scholars and publications across departments."}\n\n🌐 [Research](${KB.college.website}/research)`;
  }

  // ── IQAC ──
  if (intents.includes("iqac")) {
    const relInfo = rel(["iqac", "naac", "quality", "aqar", "accreditat", "nba", "nirf", "ranking"], 6);
    return `**IQAC & Quality Assurance** 📊\n\n${relInfo || "The IQAC ensures academic and administrative quality standards at JNTU-GV CEV."}\n\n🌐 [IQAC](${KB.college.website}/administration/iqac)`;
  }

  // ── PROFESSIONAL BODIES ──
  if (intents.includes("prof_body")) {
    const relInfo = rel(["ieee", "iste", "csi", "chapter", "professional", "society"], 5);
    return `**Professional Bodies** 🏅\n\n${relInfo || "Active chapters of IEEE, ISTE, CSI and others offer technical events, workshops, and networking."}`;
  }

  // ── CLUBS ──
  if (intents.includes("club")) {
    const relInfo = rel(["club", "music", "cultural", "dance", "technical", "coding", "fest", "activity"], 5);
    return `**Student Clubs & Activities** 🎭\n\n${relInfo || "Music, dance, cultural, technical, and coding clubs organise events throughout the year."}`;
  }

  // ── ADMISSION ──
  if (intents.includes("admission")) {
    const extra = rel(["admission", "eamcet", "lateral", "rank", "cutoff", "eligibility"]);
    return `**Admissions at JNTU-GV CEV** 🎓\n\nAdmissions are through **AP EAMCET** rank. B.Tech requires 10+2 with PCM; MBA accepts any graduate degree.\n${extra ? `\n${extra}` : ""}\n\n🌐 [jntugvcev.edu.in](${KB.college.website})`;
  }

  // ── CONTACT ──
  if (intents.includes("contact")) {
    if (isTe) return `**సంప్రదించండి** 📞\n\n📍 ${KB.college.address}\n📞 ${KB.college.phone}\n📧 ${KB.college.email}\n🌐 ${KB.college.website}`;
    return `**Contact JNTU-GV CEV** 📞\n\n📍 ${KB.college.address}\n📞 ${KB.college.phone}\n📧 [${KB.college.email}](mailto:${KB.college.email})\n🌐 [jntugvcev.edu.in](${KB.college.website})`;
  }

  // ── LOCATION ──
  if (intents.includes("location")) {
    const extra = rel(["dwarapudi", "vizianagaram", "km", "bus", "train", "route"]);
    return `**How to Reach JNTU-GV CEV** 📍\n\n📍 ${KB.college.address}${extra ? `\n\n${extra}` : ""}\n\n🗺️ [View on Maps](https://maps.google.com/?q=JNTU+GV+College+of+Engineering+Vizianagaram)`;
  }

  // ── ABOUT ──
  if (intents.includes("about")) {
    const extra = rel(["established", "founded", "history", "vision", "mission", "constituent", "autonomous"]);
    return `**About ${KB.college.name}** 🏛️\n\nA ${KB.college.affiliation}. It offers B.Tech, MBA, and M.Tech programs across ${KB.departments.length} departments.\n${extra ? `\n${extra}` : ""}\n\n🌐 [Learn More](${KB.college.website}/about/institution)`;
  }

  // ── FACULTY ──
  if (intents.includes("faculty")) {
    const relInfo = rel(["faculty", "professor", "hod", "staff", "lecturer", "assistant", "associate"], 7);
    return hasCtx
      ? `**Faculty** 👨‍🏫\n\n${relInfo || ctxText.slice(0, 700)}`
      : `👨‍🏫 Visit the department pages for faculty details: [Departments](${KB.college.website}/departments)`;
  }

  // ── LAB ──
  if (intents.includes("lab")) {
    const relInfo = rel(["lab", "laboratory", "equipment", "computer", "workshop"], 6);
    return `**Labs & Infrastructure** 🔬\n\n${relInfo || "State-of-the-art computer labs, language labs, and specialised engineering workshops."}`;
  }

  // ── MOU ──
  if (intents.includes("mou")) {
    const relInfo = rel(["mou", "memorandum", "agreement", "collaboration", "partner", "industry"], 5);
    return `**MOUs & Collaborations** 🤝\n\n${relInfo || "JNTU-GV CEV has signed MOUs with industries and institutions for academics, internships, and research."}\n\n🌐 [IQAC & MOUs](${KB.college.website}/administration/iqac)`;
  }

  // ── TRANSPORT ──
  if (intents.includes("transport")) {
    const relInfo = rel(["transport", "bus", "route", "pick", "drop", "commute"], 5);
    return `**Transport** 🚌\n\n${relInfo || "College bus services operate across various routes in Vizianagaram. Contact college for route details."}\n\n📞 ${KB.college.phone}`;
  }

  // ── UNRELATED / OUT-OF-SCOPE QUERY CHECK ──
  const isCollegeQuery = /\b(jntu|jntuk|jntugv|cev|college|campus|university|principal|vice.?principal|student|faculty|department|branch|course|syllabus|fee|hostel|exam|result|timetable|placement|library|admission|scholarship|curriculum|dwarapudi|vizianagaram|lab|canteen|sports|nss|wec|edc|iqac|ragging|professor|hod|sir|madam|teacher|regulation|r20|r23|r25)\b/i.test(query);

  const topSimilarity = chunks.length > 0 ? (chunks[0].similarity || 0) : 0;

  if (!isCollegeQuery && primary === "unknown" && topSimilarity < 0.22) {
    if (isTe)
      return `నేను **JNTU-GV CEV** కాలేజీకి సంబంధించిన విషయాల (విభాగాలు, హాస్టల్, ఫీజులు, ప్రవేశాలు, పరీక్షలు, ప్లేస్‌మెంట్స్) పై సహాయం చేయడానికి రూపొందించబడిన సహాయకుడిని. 🎓\n\nమీరు అడిగిన ప్రశ్న కాలేజీకి సంబంధించినది కాదు. దయచేసి క్యాంపస్ లేదా కోర్సుల గురించి అడగండి! 😊`;
    if (isTenglish)
      return `Nenu **JNTU-GV CEV** college gurinchi adige prashnalaku matrame answer ivvagalanu (ex: departments, hostel, fees, admissions, exams, placements). 🎓\n\nMee question college ki sambandhinchindi kaadu. Please campus or courses gurinchi adugandi! 😊`;
    return `I am **JNTU AI**, specifically designed to assist with questions about **JNTU-GV CEV campus, departments, admissions, hostels, fee structure, examinations, and placements** 🏛️\n\nYour question doesn't seem to be related to our college. Please feel free to ask me anything about JNTU-GV CEV campus or academic programs! 😊`;
  }

  // ── GENERIC FALLBACK — use DB context if available ──
  if (hasCtx && topSimilarity >= 0.15) {
    const qTokens = tokenize(query).filter((t) => !STOPWORDS.has(t));
    const relInfo = rel(qTokens, 8);
    let resp = relInfo || ctxText.slice(0, 800);
    if (links.length > 0) resp += `\n\n**Relevant Links:**\n${linkify(links.slice(0, 4))}`;
    return resp;
  }

  // ── LAST RESORT ──
  if (isTe) return `మీరు అడిగిన సమాచారం నా వద్ద లభ్యం కాలేదు. దయచేసి కాలేజీ కార్యాలయాన్ని సంప్రదించండి:\n📞 ${KB.college.phone}\n🌐 [jntugvcev.edu.in](${KB.college.website})`;
  if (isTenglish) return `Eee vishayam naa daggara ledu. College office ni contact cheyandi:\n📞 ${KB.college.phone}\n🌐 [jntugvcev.edu.in](${KB.college.website})`;
  return `I couldn't find specific information on that regarding JNTU-GV CEV. Here's how to reach our office directly:\n\n📞 ${KB.college.phone}\n📧 [${KB.college.email}](mailto:${KB.college.email})\n🌐 [jntugvcev.edu.in](${KB.college.website})`;
}

// ─────────────────────────────────────────────
// 7. MAIN ENTRY POINT
// ─────────────────────────────────────────────

export interface ChatbotEngineInput {
  query: string;
  chunks: any[]; // raw rows from DB vector search (with .content, .source_type, .similarity)
}

export function runChatbotEngine({ query, chunks }: ChatbotEngineInput): string {
  const lang = detectLanguage(query);
  const intents = detectIntents(query);
  const ranked = rerankChunks(chunks, query, intents);
  return buildAnswer(intents, query, ranked, lang);
}
