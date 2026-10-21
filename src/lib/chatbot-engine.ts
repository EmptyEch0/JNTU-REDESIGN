/**
 * JNTU AI — Comprehensive Intelligent Answer Engine v2.0
 * ──────────────────────────────────────────────────────
 * High-accuracy intent detection + BM25 & RAG vector synthesis
 * Full coverage across ALL pages, departments, facilities,
 * administration, academics, campus life, and support services.
 *
 * v2.0 — Added 13 new intents, expanded KB with 30+ sections,
 *         dedicated answer builders for every page/section.
 */

// ─────────────────────────────────────────────
// 1. LANGUAGE DETECTION
// ─────────────────────────────────────────────

export function detectLanguage(text: string): "telugu" | "tenglish" | "english" {
  if (/[\u0C00-\u0C7F]/.test(text)) return "telugu";

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
  | "vc"
  | "hod"
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
  | "guesthouse"
  | "bank"
  | "canteen"
  | "certificates"
  | "timings"
  | "unknown"
  | "alumni"
  // ── NEW v2.0 intents ──
  | "academic_calendar"
  | "scholarship"
  | "programs"
  | "anti_ragging"
  | "rti"
  | "campus_life"
  | "press_notes"
  | "downloads"
  | "achievements"
  | "vizianagaram"
  | "engineering_cell"
  | "iipc"
  | "cac"
  | "cap"
  | "contributors"
  | "airport"
  | "norms"
  | "principals_office"
  | "gallery"
  | "sitemap";

const INTENT_PATTERNS: Array<{ intent: Intent; pattern: RegExp }> = [
  { intent: "greeting",      pattern: /^\s*(hi|hello|hey|namaste|namaskar|good\s*(morning|evening|afternoon)|howdy|sup|hii+|helo)\b/i },
  { intent: "farewell",      pattern: /\b(bye|goodbye|see you|take care|quit|exit|cya)\b/i },
  { intent: "thanks",        pattern: /\b(thank(s| you)|thanks\s*a\s*(lot|ton|bunch)|dhanyavaadalu|dhanyavadalu|ty\b|thx)\b/i },
  { intent: "vc",            pattern: /\b(vice.?chancellors?|chancellors?|vc\b|registrars?|university\s*officers?|university\s*head)\b/i },
  { intent: "principal",     pattern: /(?:\b(principals?|head of college|college head|who leads|who is in charge|college chief)\b|ప్రిన్సిప|ప్రధానోపాధ్యాయు)/i },
  { intent: "vice_principal",pattern: /(?:\b(vice.?principals?|vp\b|vice principal)\b|వైస్.?ప్రిన్సిప)/i },
  { intent: "leadership",    pattern: /\b(leadership|management|governing body|administration|officials)\b/i },
  { intent: "hod",           pattern: /(?:\b(hods?|heads?\s*of\s*(the\s*)?departments?|head\s*of\s*dept|departments?\s*heads?)\b|హెచ్.?ఓ.?డి|విభాగాధిప)/i },
  { intent: "department",    pattern: /\b(departments?|branch(es)?|programs?|streams?|courses?|cse|ece|eee|mba|mechanical|metallurg|civil|it\b|information technology|sciences|humanities|bsh|bshss|s&h|what departments|which branches|how many branch)\b/i },
  { intent: "hostel",        pattern: /\b(hostels?|accommodation|wardens?|mess|rooms?|dormitor(y|ies)|boys\s*hostel|girls\s*hostel|residential|stay in campus)\b/i },
  { intent: "library",       pattern: /\b(librar(y|ies)|books?|journals?|digital library|e-resources?|librarians?|reading room|nlist|ieee)\b/i },
  { intent: "placement",     pattern: /\b(placements?|recruits?|recruiters?|packages?|salary|salaries|tpo|campus drive|internships?|jobs?|lpa|offers?|hire|placed|placement cell)\b/i },
  { intent: "syllabus",      pattern: /\b(syllabus(es)?|curriculum(s)?|r20|r23|r25|r19|r16|regulations?|subjects?|course\s*structures?|study\s*plans?|schemes?)\b/i },
  { intent: "timetable",     pattern: /\b(timetables?|time\s*tables?|schedules?|class\s*time|lecture\s*schedule|periods?)\b/i },
  { intent: "exam",          pattern: /\b(exams?|examinations?|results?|revaluations?|hall\s*tickets?|mid.?terms?|end.?sems?|suppl(y|ies)|backlogs?|cbcs|grades?|marks|gpa|cgpa)\b/i },
  { intent: "fee",           pattern: /\b(fees?|tuitions?|payments?|fee\s*structures?|college fees|how much cost|charges?|annual fee|semester fee)\b/i },
  { intent: "notice",        pattern: /\b(notices?|circulars?|announcements?|notifications?|latest\s*news|updates?|bulletins?)\b/i },
  { intent: "nss",           pattern: /\b(nss|national service scheme|volunteers?|community service|social service)\b/i },
  { intent: "sports",        pattern: /\b(sports?|gym|ground|tournaments?|athletics|cricket|football|basketball|indoor|outdoor|games|physical)\b/i },
  { intent: "dispensary",    pattern: /\b(dispensar(y|ies)|medicals?|doctors?|nurses?|ambulance|health|clinics?|medicines?|hospitals?|sick|first aid)\b/i },
  { intent: "wec",           pattern: /\b(women|wec|empowerment|harassment|grievance|gender cell|she team)\b/i },
  { intent: "anti_ragging",  pattern: /\b(anti.?ragging|raggings?|rag\b|ragging complaint|ragging helpline|anti ragging committee)\b/i },
  { intent: "edc",           pattern: /\b(edc|entrepreneurs?|startups?|incubat|innovations?|edii|msme|business)\b/i },
  { intent: "research",      pattern: /\b(research|rd\b|r&d|phd|ph\.d|scholars?|publications?|journals?|patents?|funding|consultancy)\b/i },
  { intent: "iqac",          pattern: /\b(iqac|naac|accreditat|aqar|quality|nba|rankings?|nirf)\b/i },
  { intent: "prof_body",     pattern: /\b(ieee|iste|csi|professional bod(y|ies)|chapters?|professional societ(y|ies))\b/i },
  { intent: "club",          pattern: /\b(clubs?|musics?|culturals?|dance|drama|fests?|techfests?|activit(y|ies)|student clubs?|technical clubs?|coding clubs?)\b/i },
  { intent: "admission",     pattern: /\b(admissions?|eamcet|eapcet|ranks?|cutoffs?|seats?|apply|applications?|eligibilit(y|ies)|lateral entry|how to join|how to get|ecet)\b/i },
  { intent: "contact",       pattern: /\b(contacts?|phones?|emails?|call|reach|numbers?|helplines?|supports?|enquir(y|ies)|inquir(y|ies))\b/i },
  { intent: "location",      pattern: /\b(locations?|address(es)?|where\b|how to reach|directions?|maps?|vizianagaram|dwarapudi|distances?|km\b)\b/i },
  { intent: "about",         pattern: /\b(about|history|overview|tell me about|what is jntu|founded|established|affiliation|autonomous|constituent)\b/i },
  { intent: "faculty",       pattern: /\b(facult(y|ies)|professors?|lecturers?|teachers?|staff|assistant professors?|associate professors?)\b/i },
  { intent: "lab",           pattern: /\b(labs?|laborator(y|ies)|workshops?|equipments?|infrastructures?|facilit(y|ies)|computer\s*labs?|language\s*labs?)\b/i },
  { intent: "mou",           pattern: /\b(mou|mous|memorandums?|agreements?|collaborations?|tie.?ups?|partners?)\b/i },
  { intent: "transport",     pattern: /\b(transport|buses?|vans?|vehicles?|commute|pick.?up|drop|routes?)\b/i },
  { intent: "stories",       pattern: /\b(stor(y|ies)|experiences?|campus life|student life|culture|life at|lifestyle|memories)\b/i },
  { intent: "projects",      pattern: /\b(projects?|innovations?|prototypes?|research projects?|student projects?|achievements?)\b/i },
  { intent: "guesthouse",    pattern: /\b(guest.?houses?|staff.?quarters?|visitors?|stay|quarters?)\b/i },
  { intent: "bank",          pattern: /\b(banks?|atms?|union bank|cash|money)\b/i },
  { intent: "canteen",       pattern: /\b(canteens?|food|cafeterias?|eater(y|ies)|snacks|juice|tea|breakfast|lunch)\b/i },
  { intent: "certificates",  pattern: /\b(certificates?|tc\b|transfer certificates?|bonafides?|conduct|marks memo|transcripts?)\b/i },
  { intent: "timings",       pattern: /\b(timings?|working hours|opening hours|college hours)\b/i },
  { intent: "alumni",        pattern: /\b(alumni|alumnus|former\s*students?|passouts?|graduates?|passed outs?|networking|alumni\s*portal|alumni\s*network|alumni\s*community|old\s*students?|passed\s*out|alumni\s*association|alma\s*mater|ex-students?|ex\s*students?|[\u0C00-\u0C7F]*అలుమ్ని[\u0C00-\u0C7F]*|[\u0C00-\u0C7F]*పూర్వ\s*విద్యార్థి[\u0C00-\u0C7F]*|[\u0C00-\u0C7F]*గ్రాడ్యుయేట్[\u0C00-\u0C7F]*)\b/i },
  // ── NEW v2.0 intent patterns ──
  { intent: "academic_calendar", pattern: /\b(academic calendars?|semester dates?|holiday lists?|holidays?|vacations?|semester start|semester end|reopening|working days)\b/i },
  { intent: "scholarship",   pattern: /\b(scholarships?|jagananna|vidya deevena|fee reimbursement|freeships?|financial aid|stipends?|merit scholarships?)\b/i },
  { intent: "programs",      pattern: /\b(programs? offered|b\.?tech|m\.?tech|mca|what programs|which courses|intake|duration|degrees?|under.?graduates?|post.?graduates?|ug\b|pg\b)\b/i },
  { intent: "rti",           pattern: /\b(rti|right to information|pio|public information officer|transparency)\b/i },
  { intent: "campus_life",   pattern: /\b(campus life|student life|college life|fests?|festivals?|annual day|freshers|farewell|cultural fests?|tech fests?)\b/i },
  { intent: "press_notes",   pattern: /\b(press|news|media|newspapers?|press releases?|press notes?|coverages?|articles?)\b/i },
  { intent: "downloads",     pattern: /\b(downloads?|forms?|application forms?|proformas?|formats?|templates?)\b/i },
  { intent: "achievements",  pattern: /\b(achievements?|awards?|recognitions?|toppers?|rank holders?|gold medals?|best students?|distinctions?|merits?)\b/i },
  { intent: "vizianagaram",  pattern: /\b(vizianagaram city|vizianagaram town|tourists?|fort|gurajada|places to visit|districts?)\b/i },
  { intent: "engineering_cell", pattern: /\b(engineering cell|iic|institution innovation|hackathons?|sih|smart india)\b/i },
  { intent: "iipc",          pattern: /\b(iipc|industry institute|industry interaction|industrial visits?|industrial training|plant visits?)\b/i },
  { intent: "cac",           pattern: /\b(cac\b|college academic committee|college academic council|academic committee)\b/i },
  { intent: "cap",           pattern: /\b(cap\b|centralized academic platform|cap portal)\b/i },
  { intent: "contributors",  pattern: /\b(contributors?|developed by|who built|who created this (site|website|portal)|dev team|website team|likhith|charan teja|sai rupini|sai vamsi|anitha|anil wurity)\b/i },
  { intent: "airport",       pattern: /\b(airports?|bhogapuram|flights?|air connectivity|nearest airport|how far is airport)\b/i },
  { intent: "norms",         pattern: /\b(norms?|ugc\b|12\s*b|12\(b\)|2\s*f|2\(f\)|recognitions?|statutory|autonomous status)\b/i },
  { intent: "principals_office", pattern: /\b(principal.?s office|administrative block|admin office|bonafide certificates?|study certificates?)\b/i },
  { intent: "gallery",       pattern: /\b(gallery|photos|campus photos|images|pictures|campus view)\b/i },
  { intent: "sitemap",       pattern: /\b(sitemap|site map|navigation|all pages|directory of pages)\b/i },
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
    const idf = Math.log(1 + 1 / (0.5 + tf));
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

const SOURCE_BOOST_MAP: Partial<Record<Intent, string[]>> = {
  principal:     ["leadership"],
  vice_principal:["leadership"],
  vc:            ["leadership"],
  leadership:    ["leadership"],
  hod:           ["hod", "department", "faculty"],
  department:    ["department", "course", "hod"],
  hostel:        ["hostel"],
  library:       ["library"],
  placement:     ["placement", "recruiter", "placement_staff"],
  syllabus:      ["syllabus", "regulation", "academic_download"],
  timetable:     ["timetable"],
  exam:          ["exam_cell", "notice"],
  fee:           ["fee", "scholarship"],
  nss:           ["nss", "site_content"],
  sports:        ["sports", "site_content"],
  dispensary:    ["dispensary", "site_content"],
  wec:           ["wec", "site_content"],
  edc:           ["edc", "site_content"],
  research:      ["rd_project", "rd_publication", "rd_scholar"],
  iqac:          ["iqac"],
  prof_body:     ["prof_body"],
  club:          ["student_club", "site_content"],
  notice:        ["notice", "notification"],
  faculty:       ["faculty", "hod", "leadership"],
  lab:           ["laboratory", "site_content"],
  mou:           ["mou", "iqac"],
  about:         ["site_content"],
  contact:       ["site_content", "leadership"],
  alumni:        ["alumni", "student_corner", "stories_and_experiences"],
  // ── NEW v2.0 boosts ──
  academic_calendar: ["academic_calendar", "notice", "site_content"],
  scholarship:   ["fee", "scholarship", "site_content"],
  programs:      ["department", "course", "admission"],
  anti_ragging:  ["site_content", "wec"],
  rti:           ["site_content"],
  campus_life:   ["student_club", "site_content"],
  press_notes:   ["notice", "site_content"],
  downloads:     ["academic_download", "site_content"],
  achievements:  ["site_content", "department"],
  vizianagaram:  ["site_content"],
  engineering_cell: ["site_content", "edc"],
  iipc:          ["placement", "site_content"],
  admission:     ["admission", "site_content"],
  transport:     ["site_content"],
  canteen:       ["site_content"],
  cac:           ["site_content", "academic_calendar"],
  cap:           ["site_content"],
  contributors:  ["site_content"],
  airport:       ["site_content"],
  norms:         ["site_content", "regulation"],
  principals_office: ["site_content", "leadership"],
  gallery:       ["site_content", "gallery"],
  sitemap:       ["site_content"],
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
      const typeBoost = boostedTypes.has(chunk.source_type) ? 0.30 : 0;
      const hybridScore = sim * 0.50 + (bm25 / 10) * 0.40 + typeBoost;
      return { ...chunk, bm25, hybridScore } as RankedChunk;
    })
    .sort((a, b) => b.hybridScore - a.hybridScore)
    .slice(0, 12);
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

function extractText(chunks: RankedChunk[], maxChars = 2000): string {
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
        if (!sentences.includes(s.trim())) {
          sentences.push(s.trim());
          if (sentences.length >= limit) return sentences.join(" ");
        }
      }
    }
  }
  return sentences.join(" ").trim();
}

function linkify(links: Array<{ title: string; url: string }>): string {
  return links.map((l) => `• [${l.title}](${l.url})`).join("\n");
}

// ─────────────────────────────────────────────
// 5. STATIC KNOWLEDGE BASE (v2.0 — Full Coverage)
// ─────────────────────────────────────────────

const KB = {
  college: {
    name: "JNTU-GV College of Engineering Vizianagaram (JNTU-GV CEV)",
    affiliation: "Constituent college of Jawaharlal Nehru Technological University Gurajada Vizianagaram",
    established: 2007,
    campusArea: "100+ acres",
    address: "Dwarapudi, Vizianagaram – 535003, Andhra Pradesh, India",
    phone: "+91 8922 244 100",
    email: "principal@jntugvcev.edu.in",
    website: "https://jntugvcev.edu.in",
  },
  university: {
    name: "Jawaharlal Nehru Technological University Gurajada Vizianagaram (JNTU-GV)",
    vc: "Prof. K. Venkata Subbaiah (Hon'ble Vice Chancellor)",
    registrar: "Prof. G. Jaya Suma (Registrar)",
    email: "registrar@jntugv.edu.in",
  },
  principal: {
    name: "Dr. V. S. Vakula",
    designation: "Principal",
    email: "principal@jntugvcev.edu.in",
  },
  vicePrincipal: {
    name: "Prof. G. J. Naga Raju",
    designation: "Vice Principal",
    email: "viceprincipal@jntugvcev.edu.in",
  },
  departments: [
    "Computer Science & Engineering (CSE)",
    "Information Technology (IT)",
    "Electronics & Communication Engineering (ECE)",
    "Electrical & Electronics Engineering (EEE)",
    "Mechanical Engineering (MECH)",
    "Metallurgical Engineering (MET)",
    "Basic Sciences & Humanities (BSH / S&H)",
    "Master of Business Administration (MBA)",
  ],
  hods: [
    { code: "CSE", name: "Dr. R. Rajeswara Rao", dept: "Computer Science & Engineering", designation: "Professor & HOD", email: "hod.cse@jntugvcev.edu.in" },
    { code: "ECE", name: "Dr. V. S. Vakula", dept: "Electronics & Communication Engineering", designation: "Professor & HOD", email: "hod.ece@jntugvcev.edu.in" },
    { code: "EEE", name: "Dr. K. Sri Kumar", dept: "Electrical & Electronics Engineering", designation: "Professor & HOD", email: "hod.eee@jntugvcev.edu.in" },
    { code: "MECH", name: "Dr. R. Umamaheswara Rao", dept: "Mechanical Engineering", designation: "Professor & HOD", email: "hod.me@jntugvcev.edu.in" },
    { code: "MET", name: "Dr. G. Swami Naidu", dept: "Metallurgical Engineering", designation: "Professor & HOD", email: "hod.met@jntugvcev.edu.in" },
    { code: "IT", name: "Dr. P. Aruna Kumari", dept: "Information Technology", designation: "Professor & HOD", email: "hod.it@jntugvcev.edu.in" },
    { code: "BSH", name: "Dr. G. J. Naga Raju", dept: "Basic Sciences & Humanities (S&H)", designation: "Professor & HOD", email: "hod.bs@jntugvcev.edu.in" },
    { code: "MBA", name: "Dr. K. V. S. M. Ramanesh", dept: "Master of Business Administration", designation: "Professor & HOD", email: "hod.mba@jntugvcev.edu.in" },
  ],
  faculty: [
    { name: "Prof. G. Jaya Suma", designation: "Professor of CSE & Registrar JNTU-GV", department: "Computer Science & Engineering", email: "registrar@jntugv.edu.in" },
    { name: "Dr. P. Ramakrishna", designation: "Professor of CSE", department: "Computer Science & Engineering", email: "ramakrishna.cse@jntugvcev.edu.in" },
    { name: "Dr. S. V. Narayana", designation: "Associate Professor of ECE", department: "Electronics & Communication Engineering", email: "svnarayana.ece@jntugvcev.edu.in" },
    { name: "Dr. K. Srinivasa Rao", designation: "Professor of Mechanical Engineering", department: "Mechanical Engineering", email: "srinivasarao.me@jntugvcev.edu.in" },
  ],
  regulations: ["R20", "R23", "R25"],

  // ── NEW v2.0: Expanded KB sections ──

  programs: {
    ug: [
      { name: "B.Tech Computer Science & Engineering (CSE)", duration: "4 years", intake: 60 },
      { name: "B.Tech Electronics & Communication Engineering (ECE)", duration: "4 years", intake: 60 },
      { name: "B.Tech Electrical & Electronics Engineering (EEE)", duration: "4 years", intake: 60 },
      { name: "B.Tech Mechanical Engineering (ME)", duration: "4 years", intake: 60 },
      { name: "B.Tech Metallurgical Engineering (MET)", duration: "4 years", intake: 60 },
      { name: "B.Tech Information Technology (IT)", duration: "4 years", intake: 60 },
    ],
    pg: [
      { name: "M.Tech (CSE / ECE / EEE / ME / IT specializations)", duration: "2 years", intake: 18 },
      { name: "MBA (Master of Business Administration)", duration: "2 years", intake: 60 },
      { name: "MCA (Master of Computer Applications)", duration: "2 years", intake: 60 },
    ],
    research: "Ph.D programs available across all departments under JNTU-GV",
  },

  deptCourses: {
    CSE: {
      ug: "B.Tech in Computer Science & Engineering (Intake: 60, Duration: 4 years)",
      pg: "M.Tech in Computer Science & Engineering (Intake: 18, Duration: 2 years)",
      phd: "Ph.D in Computer Science & Engineering",
    },
    ECE: {
      ug: "B.Tech in Electronics & Communication Engineering (Intake: 60, Duration: 4 years)",
      pg: "M.Tech in VLSI Design & Embedded Systems (Intake: 18, Duration: 2 years)",
      phd: "Ph.D in Electronics & Communication Engineering",
    },
    EEE: {
      ug: "B.Tech in Electrical & Electronics Engineering (Intake: 60, Duration: 4 years)",
      pg: "M.Tech in Power Systems & Allied Courses (Intake: 18, Duration: 2 years)",
      phd: "Ph.D in Electrical & Electronics Engineering",
    },
    MECH: {
      ug: "B.Tech in Mechanical Engineering (Intake: 60, Duration: 4 years)",
      pg: "M.Tech in Thermal Engineering (Intake: 18, Duration: 2 years)",
      phd: "Ph.D in Mechanical Engineering",
    },
    MET: {
      ug: "B.Tech in Metallurgical Engineering (Intake: 60, Duration: 4 years)",
      pg: "M.Tech in Metallurgy / Materials Engineering",
      phd: "Ph.D in Metallurgical & Materials Engineering",
    },
    IT: {
      ug: "B.Tech in Information Technology (Intake: 60, Duration: 4 years)",
      pg: "M.Tech in IT / Data Science (Intake: 18, Duration: 2 years)",
      phd: "Ph.D in Information Technology",
    },
    BSH: {
      ug: "Foundation Sciences (Mathematics, Physics, Chemistry, English, Humanities) for 1st Year B.Tech",
      pg: "N/A",
      phd: "Ph.D in Mathematics, Physics, Chemistry, and English",
    },
    MBA: {
      ug: "N/A",
      pg: "Master of Business Administration (MBA) (Intake: 60, Specializations: Finance, Marketing, HR, Systems)",
      phd: "Ph.D in Management Studies",
    },
  },

  admission: {
    btech: "Admissions through AP EAMCET / AP EAPCET counselling based on rank. Students from other states can apply through JEE Main scores.",
    lateral: "Diploma holders can join 2nd year B.Tech through AP ECET (Engineering Common Entrance Test).",
    pg: "M.Tech admissions through AP PGECET; MBA through AP ICET counselling.",
    phd: "Ph.D admissions through JNTU-GV Research Entrance Test or valid UGC-NET/GATE score.",
    eamcetRanks: [
      { branch: "CSE", category: "OC", open: 1240, close: 3450 },
      { branch: "ECE", category: "OC", open: 3800, close: 6800 },
      { branch: "EEE", category: "OC", open: 7200, close: 12500 },
      { branch: "IT",  category: "OC", open: 4200, close: 7100 },
      { branch: "MECH", category: "OC", open: 9000, close: 18000 },
      { branch: "MET", category: "OC", open: 15000, close: 35000 },
    ],
    helpline: "+91 8922 244 100",
    link: "/academics/admissions",
  },

  hostel: {
    boys: {
      name: "Boys Hostel (Hostel Block A & B)",
      capacity: "500+ students",
      warden: "Faculty Warden (appointed by Principal)",
      facilities: "Wi-Fi, RO drinking water, 24/7 security & CCTV, indoor games room, reading room, laundry",
    },
    girls: {
      name: "Girls Hostel",
      capacity: "200+ students",
      warden: "Lady Faculty Warden (appointed by Principal)",
      facilities: "Wi-Fi, RO drinking water, 24/7 security & CCTV, separate entrance, reading room",
    },
    mess: "Hygienic dining mess hall serving South Indian breakfast, lunch, snacks & dinner. Menu rotated weekly.",
    fees: "Hostel fee: ~₹15,000–20,000 per semester (approximate). Mess fee: ~₹20,000–25,000 per semester. Subject to revision.",
    timings: "In-time: 8:00 PM (weekdays), 9:00 PM (weekends). Visitors: 10:00 AM – 5:00 PM.",
    contact: "Contact Principal's Office: +91 8922 244 100",
  },

  library: {
    name: "Central Library, JNTU-GV CEV",
    books: "45,000+ volumes including textbooks, reference books, and periodicals",
    eResources: "IEEE Xplore, DELNET, N-LIST (INFLIBNET), ASME Digital Collection, Springer, Elsevier ScienceDirect, National Digital Library (NDL)",
    readingHall: "Spacious reading halls with 200+ seating capacity, air-conditioned digital section",
    timings: "8:00 AM – 8:00 PM (Mon–Sat), 10:00 AM – 5:00 PM (Sun & Holidays)",
    services: "Book lending, reference section, newspaper & magazine corner, photocopy, book bank, inter-library loan",
    link: "/library",
  },

  placement: {
    cell: "Training & Placement Cell (T&P Cell)",
    highest: "42 LPA (highest package)",
    average: "4.5 – 7 LPA (average package)",
    placementRate: "85%+ placement rate across all branches",
    topRecruiters: [
      "TCS (Ninja & Digital)", "Infosys", "Wipro", "Accenture",
      "Cognizant", "L&T Technology Services", "Hexaware", "Tech Mahindra",
      "Capgemini", "Mphasis", "Mindtree", "NTT Data",
      "Sankhya Technologies", "ValueLabs", "Deloitte", "Amazon (select roles)",
    ],
    training: "Aptitude training, coding bootcamps (Python/C++/Java), soft skills & communication workshops, mock interviews, group discussions — starts from 3rd year 1st semester.",
    link: "/placements/students",
  },

  nss: {
    name: "National Service Scheme (NSS) Unit — JNTU-GV CEV",
    unitNo: "NSS Unit (under JNTU-GV)",
    motto: "Not Me But You",
    coordinator: "NSS Programme Officer (Faculty Coordinator appointed by Principal)",
    volunteers: "200+ student volunteers enrolled each year",
    activities: [
      "Blood donation camps",
      "Village adoption and rural development programs",
      "Swachh Bharat cleanliness drives",
      "Tree plantation drives (Van Mahotsav)",
      "Health awareness camps & COVID vaccination drives",
      "Digital literacy programs in adopted villages",
      "Special camps (7-day residential camps in rural areas)",
      "National Integration Day, AIDS Awareness Day, Yoga Day celebrations",
    ],
    specialCamp: "Annual 7-day residential special camp in adopted village — community development, road building, sanitation, cultural programs",
    link: "/nss",
  },

  sports: {
    name: "Sports & Games, JNTU-GV CEV",
    coordinator: "Physical Director / Sports In-charge",
    facilities: [
      "Full-size cricket ground with practice nets",
      "Football field (synthetic turf)",
      "Basketball court (cemented)",
      "Volleyball courts (2 nos.)",
      "Badminton courts (indoor & outdoor)",
      "Table Tennis (indoor games hall)",
      "Chess & Carrom room",
      "Modern fitness gymnasium with cardio & weight equipment",
      "Kabaddi & Kho-Kho grounds",
      "200m athletic track",
    ],
    achievements: "Students regularly participate in JNTU-GV inter-college sports meets, All India Inter-University tournaments, Khelo India, and state-level championships.",
    events: "Annual Sports Day, inter-departmental tournaments (Sangam), inter-college sports festivals",
    link: "/sports",
  },

  dispensary: {
    name: "Campus Dispensary & Health Center",
    doctor: "Qualified Resident Medical Officer (RMO) on campus",
    nurse: "Staff Nurse available during working hours",
    facilities: [
      "First aid & emergency treatment",
      "Basic medicine dispensary (free for students)",
      "Blood pressure & sugar monitoring",
      "24/7 ambulance service (emergency evacuation to Vizianagaram hospitals)",
      "Periodic health check-up camps",
      "COVID testing & vaccination support",
    ],
    timings: "9:00 AM – 5:00 PM (regular hours). Ambulance: 24/7.",
    nearbyHospitals: "Government General Hospital Vizianagaram (~7 km), Apollo Clinic, KIMS",
    link: "/dispensary",
  },

  wec: {
    name: "Women Empowerment Cell (WEC)",
    objective: "Promote gender equity, women's safety, and empowerment in the campus community",
    chairperson: "Senior Lady Faculty Member (appointed by Principal)",
    activities: [
      "International Women's Day celebrations",
      "Self-defense training workshops (Karate/Taekwondo)",
      "Legal awareness sessions on women's rights",
      "Gender sensitization workshops for students & staff",
      "Counselling services for women students",
      "She Team awareness programs",
      "Magazine publication — 'Empowerment' annual journal",
      "Recreation activities: Yoga, meditation, cultural events",
    ],
    icc: "Internal Complaints Committee (ICC) constituted as per UGC/AICTE/Vishakha guidelines for grievance redressal of harassment complaints.",
    helpline: "Contact: WEC Chairperson via Principal's Office — +91 8922 244 100",
    link: "/women-empowerment",
  },

  edc: {
    name: "Entrepreneurship Development Cell (EDC)",
    objective: "Foster entrepreneurial mindset, support student startups, and bridge academia-industry gap",
    coordinator: "EDC Faculty Coordinator (appointed by Principal)",
    activities: [
      "Business idea pitching competitions",
      "Startup bootcamps & ideation workshops",
      "Industry mentor interaction sessions",
      "MSME awareness programs",
      "Incubation support for student ventures",
      "EDII (Entrepreneurship Development Institute of India) tie-up programs",
      "Innovation challenges & hackathons",
      "Entrepreneurship awareness camps in collaboration with AICTE",
    ],
    link: "/edc",
  },

  research: {
    name: "Research & Development Cell (R&D Cell)",
    coordinator: "R&D Cell Coordinator (Faculty member)",
    areas: [
      "Artificial Intelligence & Machine Learning",
      "VLSI Design & Embedded Systems",
      "Renewable Energy & Smart Grid",
      "Materials Science & Metallurgy",
      "IoT & Cyber-Physical Systems",
      "Data Science & Big Data Analytics",
      "Thermal & Fluid Engineering",
      "Signal Processing & Communication",
    ],
    patents: "Multiple patents filed by faculty across departments",
    publications: "Faculty and research scholars publish regularly in Scopus, Web of Science, IEEE, Springer, and Elsevier journals",
    scholars: "Ph.D scholars enrolled under JNTU-GV across all departments",
    funding: "Research projects funded by DST, AICTE, UGC, MSME, CSIR, and DAE",
    link: "/rd-cell",
  },

  profBodies: {
    ieee: {
      name: "IEEE Student Branch",
      description: "Active IEEE student branch conducts technical workshops, guest lectures, webinars, and paper presentation competitions. Members get access to IEEE Xplore digital library.",
    },
    iste: {
      name: "ISTE Chapter",
      description: "Indian Society for Technical Education (ISTE) chapter organizes faculty development programs, student development activities, and national-level conferences.",
    },
    csi: {
      name: "CSI Student Branch",
      description: "Computer Society of India (CSI) student branch conducts coding competitions, technical quizzes, workshops on emerging technologies, and industry interaction events.",
    },
    link: "/professional-bodies",
  },

  iqac: {
    name: "Internal Quality Assurance Cell (IQAC)",
    chairperson: "Dr. V. S. Vakula (Principal & Chairperson)",
    coordinator: "Dr. K. Babulu (Professor & IQAC Coordinator)",
    composition: [
      "Chairperson: Dr. V. S. Vakula (Principal)",
      "Coordinator: Dr. K. Babulu (Professor & IQAC Coordinator)",
      "Senior Administrative Officers: Vice Principal, Registrar, Exam Cell In-charge",
      "Teacher Representatives: Senior Professors & HODs from CSE, ECE, EEE, ME, MET, IT, BS&H",
      "Management / University Representative: Registrar, JNTU-GV",
      "Nominees from Local Society, Students, and Alumni",
      "Nominees from Employers / Industrialists / Stakeholders",
    ],
    meetings: "Quarterly meetings held every 3 months to monitor academic audits, curriculum revisions, faculty performance, and NAAC/NBA benchmarks.",
    aqar: "Annual Quality Assurance Report (AQAR) prepared and submitted annually to NAAC.",
    mous: "Coordinates institutional MoUs with leading technology companies and academic institutions for research, student internships, and faculty development.",
    activities: [
      "Academic audit and quality benchmarking",
      "AQAR (Annual Quality Assurance Report) preparation and submission to NAAC",
      "Faculty development programs & workshops",
      "Curriculum feedback analysis",
      "MoU facilitation with industries and universities",
      "NBA accreditation coordination",
      "Student feedback collection & analysis",
      "IQAC quarterly quality review meetings",
    ],
    accreditation: "Affiliated to NAAC accreditation process; NBA accreditation for select programs",
    rankings: "Participates in NIRF (National Institutional Ranking Framework)",
    link: "/administration/iqac",
  },

  antiRagging: {
    name: "Anti-Ragging Cell",
    committee: "Anti-Ragging Committee constituted as per UGC/AICTE Regulations and Supreme Court directives",
    helpline: "UGC Anti-Ragging Helpline: 1800-180-5522 (toll-free)",
    email: "antiragging@jntugvcev.edu.in (campus)",
    website: "https://www.antiragging.in",
    measures: [
      "Zero tolerance policy for ragging of any form",
      "24/7 anti-ragging helpline",
      "CCTV surveillance across campus & hostels",
      "Anti-ragging squads with faculty members patrolling",
      "Online complaint submission portal",
      "Mandatory anti-ragging affidavit from students & parents",
      "FIR filing for severe cases as per law",
    ],
    punishment: "Rustication, suspension, or expulsion depending on severity. Criminal proceedings as per IPC.",
    link: "/anti-ragging",
  },

  rti: {
    name: "Right to Information (RTI)",
    pio: "Public Information Officer (PIO) — designated by the institution",
    appellate: "First Appellate Authority — Principal / Registrar",
    fee: "₹10 per application (BPL category exempted)",
    process: "Submit RTI application to the PIO in writing or online. Response within 30 days as per RTI Act, 2005.",
    link: "/rti",
  },

  transport: {
    name: "Campus Transport Facility",
    fleet: "Fleet of college buses operating daily routes",
    routes: [
      "Vizianagaram Railway Station → Campus",
      "Vizianagaram RTC Complex → Campus",
      "Vizianagaram Town (multiple pickup points) → Campus",
      "Nearby towns (select routes as per demand)",
    ],
    timings: "Morning: 8:30 AM pickup from town. Evening: 5:00 PM return from campus.",
    contact: "Transport section via Administrative Office — +91 8922 244 100",
  },

  labs: {
    CSE: ["Programming Lab (C/C++/Java/Python)", "Data Structures Lab", "DBMS Lab", "Computer Networks Lab", "AI/ML Lab", "Web Technologies Lab", "Operating Systems Lab"],
    ECE: ["VLSI Design Lab", "Embedded Systems Lab", "Microprocessor Lab", "Communication Systems Lab", "Signal Processing Lab", "IoT Lab", "Antenna & Wave Propagation Lab"],
    EEE: ["Power Systems Lab", "Electrical Machines Lab", "Control Systems Lab", "High Voltage Lab", "Power Electronics Lab", "Renewable Energy Lab"],
    MECH: ["CAD/CAM Lab", "Thermal Engineering Lab", "Fluid Mechanics Lab", "Robotics Lab", "Workshop (Smithy, Carpentry, Welding)", "CNC Machining Lab", "Material Testing Lab"],
    MET: ["Metallography Lab", "Foundry Lab", "Heat Treatment Lab", "Materials Characterization Lab", "SEM (Scanning Electron Microscopy)", "Powder Metallurgy Lab"],
    IT: ["Cloud Computing Lab", "Cybersecurity Lab", "Data Science Lab", "Software Engineering Lab", "Mobile Application Development Lab"],
    BSH: ["Physics Lab", "Chemistry Lab", "English Language Lab (Phonetics & Communication)", "Engineering Drawing Lab"],
  },

  academicCalendar: {
    oddSemester: "Typically July – November (I Mid: August, II Mid: October, End Sem: November)",
    evenSemester: "Typically December/January – May (I Mid: February, II Mid: March/April, End Sem: May)",
    holidays: "Sankranti (Jan), Republic Day, Holi, Ugadi, Summer vacation (May–June), Independence Day, Ganesh Chaturthi, Dasara, Diwali, Christmas",
    note: "Exact dates released via Academic Calendar notification each semester. Check the Notices page for current calendar.",
    link: "/academics/academic-calendar",
  },

  scholarship: {
    types: [
      "Jagananna Vidya Deevena (Government fee reimbursement for eligible BC/SC/ST/Minority/EBC students)",
      "Jagananna Vasathi Deevena (Hostel & mess fee support for eligible students)",
      "National Merit Scholarships (NMMS, NSP)",
      "Post-Matric Scholarship for SC/ST students",
      "Central Sector Scheme of Scholarship",
      "E-Grantz (for Minority students)",
      "AICTE Pragati Scheme (for girl students in technical education)",
    ],
    process: "Apply online via AP State Scholarship Portal (jnanabhumi.ap.gov.in) or National Scholarship Portal (scholarships.gov.in). Submit required documents to college office for verification.",
    helpline: "Contact Scholarship Section, Administrative Office — +91 8922 244 100",
    link: "/academics/scholarships",
  },

  fees: {
    btech: "B.Tech annual tuition fee: ~₹35,000 (government quota — subject to GO revision). Management quota fees may vary.",
    mtech: "M.Tech annual fee: ~₹30,000–35,000 (government quota)",
    mba: "MBA annual fee: ~₹35,000–40,000",
    other: "Exam fee, lab fee, and library fee charged separately per semester (~₹3,000–5,000)",
    reimbursement: "Fee reimbursement available for eligible students under Jagananna Vidya Deevena scheme.",
    note: "Fees are subject to revision by AP State Government / JNTU-GV. Check the latest fee notification on the college website.",
    link: "/academics/admissions",
  },

  canteen: {
    name: "Campus Canteen & Cafeteria",
    description: "Spacious hygiene-certified campus canteen providing fresh South Indian breakfast (idli, dosa, upma), meals (rice, sambar, rasam, curries), snacks (samosa, puff, biscuits), and beverages (tea, coffee, juice) at affordable prices throughout the day.",
    timings: "7:00 AM – 7:00 PM (Mon–Sat)",
    note: "Separate food court area and juice stalls also available near academic blocks.",
  },

  bank: {
    name: "Union Bank of India (formerly Andhra Bank)",
    description: "On-campus branch and 24/7 ATM facility inside JNTU-GV CEV campus for students, staff, and visitors.",
    services: "Savings accounts, education loan processing, NEFT/RTGS, fee payment, and scholarship disbursement.",
  },

  guestHouse: {
    name: "University Guest House",
    description: "Comfortable guest house accommodation for visiting dignitaries, conference delegates, parents, and faculty from other institutions. Rooms available with AC/Non-AC options.",
    booking: "Contact Administrative Office — +91 8922 244 100",
    link: "/other-amenities/guest-house",
  },

  staffQuarters: {
    name: "Staff Quarters",
    description: "Residential quarters available for faculty and staff members on the campus premises with basic amenities.",
    link: "/other-amenities/staff-quarters",
  },

  vizianagaram: {
    name: "Vizianagaram",
    description: "Vizianagaram is a historic city in North Coastal Andhra Pradesh, known as the 'City of Victory'. Home to the famous Vizianagaram Fort (Kothavalasa), rich cultural heritage, and the birthplace of legendary Telugu poet Gurajada Apparao.",
    nearbyPlaces: ["Vizianagaram Fort", "Gurajada Apparao Museum", "Bejjipuram Temple", "Ramatheertham (Buddhist Monastery)", "Bhogapuram Beach (30 km)", "Araku Valley (100 km)", "Visakhapatnam (50 km)"],
    distance: "50 km from Visakhapatnam, 20 km from Srikakulam, well-connected by rail and road",
  },

  engineeringCell: {
    name: "Institution Innovation Council (IIC) / Engineering Cell",
    description: "Promotes innovation, creativity, and entrepreneurial skills among students through hackathons, ideathons, and project exhibitions.",
    activities: [
      "Smart India Hackathon (SIH) — internal and national rounds",
      "Innovation contests & prototype challenges",
      "AICTE IDEA Labs integration",
      "Project exhibitions & technical symposiums",
      "Industry-academia collaboration workshops",
    ],
    link: "/engineering-cell",
  },

  iipc: {
    name: "Industry-Institute Placement Cell (IIPC)",
    description: "Facilitates industry interactions, industrial visits, in-plant training, and guest lectures from industry professionals to bridge the gap between academia and industry.",
    activities: [
      "Industrial visits to manufacturing plants & IT companies",
      "In-plant training & summer internships arrangement",
      "Guest lectures from industry experts",
      "Industry-sponsored projects & consultancy",
      "Campus recruitment coordination",
    ],
    link: "/iipc",
  },

  cac: {
    name: "College Academic Committee (CAC)",
    chairman: "Principal (Dr. V. S. Vakula) — Dean & Institutional Administrator",
    convener: "Vice Principal (Prof. G. J. Naga Raju) — Academic Coordinator",
    members: [
      "Head of CSE (Dr. R. Rajeswara Rao)",
      "Head of ECE (Dr. V. S. Vakula)",
      "Head of EEE (Dr. K. Sri Kumar)",
      "Head of Mechanical Engineering (Dr. R. Umamaheswara Rao)",
      "Head of Metallurgical Engineering (Dr. G. Swami Naidu)",
      "Head of Information Technology (Dr. P. Aruna Kumari)",
      "Head of Basic Sciences & Humanities (Dr. G. J. Naga Raju)",
      "Head of MBA (Dr. K. V. S. M. Ramanesh)",
      "Examination Branch Officer (Evaluation Head)",
    ],
    role: "The apex academic body responsible for academic planning, curriculum framing and regulation updates (R23, R20, R25), syllabus approval, student attendance policies, examinations calendar, and academic audits.",
    link: "/academics/cac",
  },

  cap: {
    name: "Centralized Academic Platform (CAP)",
    description: "The one place student academic records live. Built by student innovators at JNTU-GV CEV, CAP streamlines course grade tracking, semester marks, credit audits, and faculty evaluations in a single unified portal.",
    link: "/cap",
  },

  contributors: {
    title: "JNTU-GV CEV Web Portal Development Team",
    facultySupervisor: "Mr. Anil Wurity (Assistant Professor & Faculty Supervisor)",
    studentDevelopers: [
      "S.G. Charan Teja — Product Design Lead (UI/UX & Frontend Architecture)",
      "Likhith Kumar — Core Architecture & Fullstack Engineering Lead",
      "Sai Rupini — Frontend Engineering & Digital Content Systems",
      "Sai Vamsi — Backend Architecture & Database Systems",
      "Anitha — Quality Assurance & Testing Systems",
    ],
    institution: "Department of Computer Science & Engineering, JNTU-GV CEV",
    link: "/about/contributors",
  },

  airport: {
    nearest: "Alluri Sitarama Raju International Airport (Bhogapuram Airport)",
    distanceBhogapuram: "~36 km from JNTU-GV campus",
    distanceVizag: "~55 km from Visakhapatnam International Airport (VTZ)",
    significance: "JNTU-GV CEV is strategically located along the North Coastal Growth Corridor near the upcoming Bhogapuram Greenfield International Airport, offering seamless domestic and international aviation connectivity for students, faculty, visiting recruiters, and researchers.",
    link: "/about/airport-connectivity",
  },

  norms: {
    title: "Norms, Governance & Statutory Recognition",
    ugc: "Recognized by University Grants Commission (UGC) under Section 2(f) and Section 12(B) of the UGC Act, 1956.",
    status: "Constituent College of Jawaharlal Nehru Technological University Gurajada Vizianagaram (established by AP State Act No. 30 of 2021).",
    eligibility: "Eligible to receive central financial assistance, research grants, and infrastructure funds from UGC, AICTE, DST, CSIR, and MeitY.",
    link: "/about/norms",
  },

  principalsOffice: {
    title: "Principal's Office & Administrative Block",
    location: "Ground Floor, Administrative Block, JNTU-GV CEV Campus, Dwarapudi",
    hours: "Monday – Saturday: 10:00 AM to 5:00 PM",
    email: "office.principal@jntugv.edu.in",
    services: [
      "Bonafide & Study Certificates",
      "Transfer Certificate (TC) & Conduct Certificate",
      "Academic Transcripts & Grade Card Verification",
      "Scholarship Document Verification & State Portal Approvals",
      "Official University Correspondence & Grievance Submissions",
      "Principal & Vice Principal Appointment Scheduling",
    ],
    link: "/administration/principals-office",
  },

  gallery: {
    title: "Campus Media & Gallery",
    description: "High-resolution photo and media gallery showcasing campus infrastructure, academic blocks, lush 100+ acre greenery, laboratories, hostel life, sports tournaments, and convocation/annual day events.",
    link: "/gallery",
  },

  sitemap: {
    title: "Campus Portal Sitemap & Navigation",
    sections: [
      "About: Institution Overview, Vision/Mission, Vizianagaram History, How to Reach, Airport Connectivity, Norms & 12(B) Recognition, Contributors",
      "Administration: Principal Desk, Vice Principal, Principal's Office, IQAC",
      "Academics: Programs Offered, Admissions, Regulations, Syllabus (R23/R20/R25), Timetables, Academic Calendar, Examinations Cell, Scholarships, Downloads, CAC",
      "Departments: CSE, ECE, EEE, MECH, MET, IT, BSH, MBA (HOD, Faculty, Labs, Timetables, Achievements)",
      "Amenities: Hostels (Boys & Girls), Central Library, Sports & Gym, Dispensary, Canteen, Banking/ATM, Guest House, Transport",
      "Student Life: Campus Clubs, Music Club, SAC, NSS, EDC, WEC, Anti-Ragging Cell, Professional Bodies (IEEE, ISTE, CSI)",
      "Placements & R&D: Training & Placement Cell, Top Recruiters, Student Placements, R&D Cell, Projects, Publications, MoUs",
    ],
    link: "/sitemap",
  },
};

// ─────────────────────────────────────────────
// 6. ANSWER BUILDER (v2.0 — Full Coverage)
// ─────────────────────────────────────────────

function buildAnswer(
  intents: Intent[],
  query: string,
  chunks: RankedChunk[],
  lang: "telugu" | "tenglish" | "english"
): string {
  const links = extractLinks(chunks);
  const ctxText = extractText(chunks);
  const hasCtx = ctxText.trim().length > 20;
  const isTe = lang === "telugu";
  const isTenglish = lang === "tenglish";
  const primary = intents[0];

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

  // ── VC & REGISTRAR ──
  if (intents.includes("vc")) {
    return `**University Leadership (JNTU-GV)** 🏛️\n\n• **Vice Chancellor**: ${KB.university.vc}\n• **Registrar**: ${KB.university.registrar} — [${KB.university.email}](mailto:${KB.university.email})\n\n📍 JNTU-GV Campus, Vizianagaram`;
  }

  // ── PRINCIPAL ──
  if (intents.includes("principal") && !intents.includes("vice_principal")) {
    const extra = rel(["principal", "dr", "vakula"]);
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
    return `**JNTU-GV CEV Leadership** 🏛️\n\n• **Principal**: ${KB.principal.name} — [${KB.principal.email}](mailto:${KB.principal.email})\n• **Vice Principal**: ${KB.vicePrincipal.name} — [${KB.vicePrincipal.email}](mailto:${KB.vicePrincipal.email})\n• **Registrar**: ${KB.university.registrar}${extra ? `\n\n${extra}` : ""}`;
  }

  // ── HOD ──
  if (intents.includes("hod")) {
    const qLower = query.toLowerCase();

    const deptMatch =
      /(\bit\b|information technology)/i.test(qLower) ? KB.hods.find(h => h.code === "IT") :
      /(\bcse\b|computer science)/i.test(qLower) ? KB.hods.find(h => h.code === "CSE") :
      /(\bece\b|electronics)/i.test(qLower) ? KB.hods.find(h => h.code === "ECE") :
      /(\beee\b|electrical)/i.test(qLower) ? KB.hods.find(h => h.code === "EEE") :
      /(\bmech\b|mechanical)/i.test(qLower) ? KB.hods.find(h => h.code === "MECH") :
      /(\bmet\b|metallurg)/i.test(qLower) ? KB.hods.find(h => h.code === "MET") :
      /(\bbsh\b|\bbshss\b|s&h|sciences|humanities)/i.test(qLower) ? KB.hods.find(h => h.code === "BSH") :
      /(\bmba\b|business)/i.test(qLower) ? KB.hods.find(h => h.code === "MBA") :
      null;

    if (deptMatch) {
      if (isTe) {
        return `**${deptMatch.dept} (${deptMatch.code})** విభాగాధిపతి (HOD):\n\n👨‍🏫 **${deptMatch.name}** (${deptMatch.designation})\n📧 Email: ${deptMatch.email}\n📍 Department of ${deptMatch.dept}, JNTU-GV CEV`;
      }
      return `Head of Department (HOD) of **${deptMatch.dept} (${deptMatch.code})**:\n\n👨‍🏫 **${deptMatch.name}** (${deptMatch.designation})\n📧 Email: [${deptMatch.email}](mailto:${deptMatch.email})\n📍 Department of ${deptMatch.dept}, JNTU-GV CEV`;
    }

    const hodList = KB.hods.map((h) => `• **${h.code}** (${h.dept}): **${h.name}** — [${h.email}](mailto:${h.email})`).join("\n");
    if (isTe) return `**JNTU-GV CEV విభాగాధిపతులు (HODs)** 👨‍🏫\n\n${hodList}`;
    return `**JNTU-GV CEV Heads of Department (HODs)** 👨‍🏫\n\n${hodList}\n\n🌐 For details, visit [Academics → Faculty](/academics/faculty)`;
  }

  // ── ALUMNI ──
  if (intents.includes("alumni")) {
    const alumniPortal = "https://alumni.jntugv.edu.in";
    const qLower = query.toLowerCase();
    const wantsHowTo = /how|connect|register|join|access|way|process/i.test(qLower);

    let response = "";

    if (isTe) {
      response = `**అలుమ్ని పోర్టల్** 🎓\n\nJNTU-GV విశ్వవిద్యాలయం యొక్క అధికారిక అలుమ్ని పోర్టల్:\n\n🔗 **${alumniPortal}**\n\nఇక్కడ మీరు:\n• రిజిస్టర్ చేసుకోవచ్చు\n• ప్రొఫైల్ అప్డేట్ చేసుకోవచ్చు\n• సహ విద్యార్థులతో కనెక్ట్ అవ్వవచ్చు\n• మెంటర్షిప్ అవకాశాలు పొందవచ్చు\n• క్యాంపస్ ఈవెంట్లలో పాల్గొనవచ్చు\n\n🌐 [Visit Alumni Portal](${alumniPortal})`;
      if (wantsHowTo) {
        response += `\n\n**ఎలా రిజిస్టర్ చేసుకోవాలి?**\n1. పోర్టల్ లింక్ క్లిక్ చేయండి\n2. 'Register' బటన్ క్లిక్ చేయండి\n3. మీ విద్యార్థి వివరాలు నింపండి\n4. ఓటీపీ ద్వారా వెరిఫై చేయండి\n5. ప్రొఫైల్ పూర్తి చేయండి`;
      }
    } else if (isTenglish) {
      response = `**Alumni Portal** 🎓\n\nOfficial JNTU-GV Alumni Portal:\n\n🔗 **${alumniPortal}**\n\nikkada meeru:\n• Register chesukovachu\n• Profile update cheyochu\n• Fellow alumni tho connect avvachu\n• Mentorship opportunities ponda vachu\n• Campus events lo participate cheyochu\n\n🌐 [Visit Alumni Portal](${alumniPortal})`;
      if (wantsHowTo) {
        response += `\n\n**Elanti register chesukovali?**\n1. Portal link click cheyyandi\n2. 'Register' button click cheyyandi\n3. Student details fill cheyyandi\n4. OTP dwara verify cheyyandi\n5. Profile complete cheyyandi`;
      }
    } else {
      response = `**JNTU-GV Alumni Portal** 🎓\n\nThe official alumni platform for JNTU-GV College of Engineering Vizianagaram:\n\n🔗 **${alumniPortal}**\n\n**What you can do on the alumni portal:**\n• **Register & Update Profile**: Stay connected with your alma mater\n• **Networking**: Connect with fellow graduates and seniors\n• **Mentorship**: Guide current students and seek career advice\n• **Events**: Participate in campus events and alumni meets\n• **Career Support**: Access job opportunities and industry connections\n\n**How to get started:**\n1. Visit [${alumniPortal}](${alumniPortal})\n2. Click on 'Register' / 'Sign Up'\n3. Fill in your student details\n4. Verify via OTP\n5. Complete your profile and start connecting!`;

      if (wantsHowTo) {
        response += `\n\n**Quick Registration Steps:**\n✅ Step 1: Go to ${alumniPortal}\n✅ Step 2: Click Register\n✅ Step 3: Enter your roll number and email\n✅ Step 4: OTP verification\n✅ Step 5: Create your profile`;
      }
    }

    return response;
  }

  // ── DEPARTMENTS ──
  if (intents.includes("department") && !intents.includes("hod") && !intents.includes("lab") && !intents.includes("syllabus")) {
    const qLower = query.toLowerCase();
    const deptMatch =
      /(\bit\b|information technology)/i.test(qLower) ? "IT" :
      /(\bcse\b|computer science)/i.test(qLower) ? "CSE" :
      /(\bece\b|electronics)/i.test(qLower) ? "ECE" :
      /(\beee\b|electrical)/i.test(qLower) ? "EEE" :
      /(\bmech\b|mechanical)/i.test(qLower) ? "MECH" :
      /(\bmet\b|metallurg)/i.test(qLower) ? "MET" :
      /(\bbsh\b|\bbshss\b|s&h|sciences|humanities)/i.test(qLower) ? "BSH" :
      /(\bmba\b|business)/i.test(qLower) ? "MBA" :
      null;

    if (deptMatch && /course|program|degree|curriculum|study|offer/i.test(qLower) && KB.deptCourses[deptMatch as keyof typeof KB.deptCourses]) {
      const c = KB.deptCourses[deptMatch as keyof typeof KB.deptCourses];
      return `**${deptMatch} Department Programs & Courses Offered** 🎓\n\n• **Undergraduate (UG)**: ${c.ug}\n• **Postgraduate (PG)**: ${c.pg}\n• **Doctoral (Ph.D)**: ${c.phd}\n\n🌐 [Department Courses](/departments/${deptMatch.toLowerCase()}/courses) | [View Department](/departments/${deptMatch.toLowerCase()})`;
    }

    const extra = rel(["seats", "intake", "department", "branch", "offered"]);
    const list = KB.departments.map((d, i) => `${i + 1}. ${d}`).join("\n");
    if (isTe) return `JNTU-GV CEV లో **${KB.departments.length} విభాగాలు** ఉన్నాయి 🎓\n\n${list}${extra ? `\n\n${extra}` : ""}`;
    if (isTenglish) return `JNTU-GV CEV lo **${KB.departments.length} departments** unnaayi 🎓\n\n${list}${extra ? `\n\n${extra}` : ""}`;
    return `JNTU-GV CEV offers **${KB.departments.length} departments** 🎓\n\n${list}${extra ? `\n\n${extra}` : ""}\n\n🌐 [View All Departments](/departments)`;
  }

  // ── PROGRAMS OFFERED ──
  if (intents.includes("programs")) {
    const ugList = KB.programs.ug.map(p => `• **${p.name}** — ${p.duration}, Intake: ${p.intake}`).join("\n");
    const pgList = KB.programs.pg.map(p => `• **${p.name}** — ${p.duration}, Intake: ${p.intake}`).join("\n");
    return `**Programs Offered at JNTU-GV CEV** 🎓\n\n### Undergraduate (B.Tech)\n${ugList}\n\n### Postgraduate\n${pgList}\n\n### Research\n• ${KB.programs.research}\n\n🌐 [Academics → Programs](/academics/programs) | [Admissions](/academics/admissions)`;
  }

  // ── ADMISSION ──
  if (intents.includes("admission")) {
    const qLower = query.toLowerCase();
    const wantsRanks = /rank|cutoff|opening|closing/i.test(qLower);
    const wantsBtech = /b\.?tech|ug|under.?grad|eamcet|eapcet/i.test(qLower);
    const wantsPG = /m\.?tech|mba|mca|pg|post.?grad|pgecet|icet/i.test(qLower);
    const wantsPhd = /phd|ph\.d|research|doctoral/i.test(qLower);

    let resp = `**Admissions at JNTU-GV CEV** 🎓\n\n`;

    if (wantsPhd) {
      resp += `### Ph.D Admissions\n${KB.admission.phd}\n\n📞 Contact: ${KB.admission.helpline}`;
    } else if (wantsPG && !wantsBtech) {
      resp += `### Postgraduate Admissions\n${KB.admission.pg}\n\n**Available PG Programs:**\n${KB.programs.pg.map(p => `• ${p.name}`).join("\n")}\n\n📞 Helpline: ${KB.admission.helpline}`;
    } else {
      resp += `### B.Tech Admissions (Undergraduate)\n${KB.admission.btech}\n\n### Lateral Entry (Diploma → B.Tech 2nd Year)\n${KB.admission.lateral}`;
      if (wantsRanks) {
        const rankTable = KB.admission.eamcetRanks.map(r => `• **${r.branch}** (${r.category}): Opening ${r.open} — Closing ${r.close}`).join("\n");
        resp += `\n\n### AP EAMCET Opening & Closing Ranks (Approx.)\n${rankTable}\n\n*Ranks are approximate and vary by year & category.*`;
      }
      resp += `\n\n### PG Admissions\n${KB.admission.pg}`;
    }

    resp += `\n\n📞 Helpline: ${KB.admission.helpline}\n🌐 [Admissions Page](${KB.admission.link})`;
    return resp;
  }

  // ── SYLLABUS ──
  if (intents.includes("syllabus")) {
    const qLower = query.toLowerCase();

    const regMatch = qLower.match(/r(25|23|20|19|16|13)/i);
    const reg = regMatch ? regMatch[0].toUpperCase() : null;

    const deptMatch =
      /\b(cse|computer science)\b/i.test(qLower) ? "CSE" :
      /\b(ece|electronics)\b/i.test(qLower) ? "ECE" :
      /\b(eee|electrical)\b/i.test(qLower) ? "EEE" :
      /\b(mech|mechanical)\b/i.test(qLower) ? "MECH" :
      /\b(met|metallurg|metallurgical)\b/i.test(qLower) ? "MET" :
      /\b(it|information technology)\b/i.test(qLower) ? "IT" :
      /\b(civil)\b/i.test(qLower) ? "CIVIL" :
      /\b(mba|business)\b/i.test(qLower) ? "MBA" :
      /\b(mca|computer applications)\b/i.test(qLower) ? "MCA" :
      null;

    const syllabusItems: Array<{ subject: string; reg: string; branch: string; year: string; pdf: string }> = [
      { subject: "CSE R23 B.Tech Syllabus", reg: "R23", branch: "CSE", year: "1st to 4th Year", pdf: "/uploads/2023/10/CSE-finalR23.pdf" },
      { subject: "ECE R23 1st Year Syllabus", reg: "R23", branch: "ECE", year: "1st Year", pdf: "/uploads/2023/10/ECE-finalR23.pdf" },
      { subject: "ECE R23 2nd Year Syllabus", reg: "R23", branch: "ECE", year: "2nd Year", pdf: "/uploads/2024/07/Approved-R23-JNTUGV-CEV-ECE-Course-Structure-total-Second-Year-Syllabus.-.pdf" },
      { subject: "ECE R23 3rd & 4th Year Syllabus", reg: "R23", branch: "ECE", year: "3rd & 4th Year", pdf: "/uploads/2025/07/R23-III-IV-Course-structure-and-syllabus-with-honors-and-Minors.pdf" },
      { subject: "EEE R23 Syllabus", reg: "R23", branch: "EEE", year: "1st to 4th Year", pdf: "/uploads/2025/08/JNTUGV-CEV-A-R23-EEE-IV-Years-SYLLABUS-combined-1.pdf" },
      { subject: "IT R23 Course Structure & Syllabus", reg: "R23", branch: "IT", year: "1st to 4th Year", pdf: "/uploads/2025/09/R23DepartmentofITCourseStructureandSyllabus1stYearto4thYear-compressed-1.pdf" },
      { subject: "Civil Engineering R23 Syllabus", reg: "R23", branch: "CIVIL", year: "1st to 4th Year", pdf: "/uploads/2023/10/civilfinalR23-1.pdf" },
      { subject: "Metallurgy R23 Syllabus", reg: "R23", branch: "MET", year: "1st to 4th Year", pdf: "/uploads/2025/08/R23-ME-B.Tech-4-years-CS-SYLLABUS-1.pdf" },
      { subject: "Mechanical Engineering R23 Syllabus", reg: "R23", branch: "MECH", year: "1st to 4th Year", pdf: "/uploads/2023/10/ME-finalR23.pdf" },

      { subject: "CSE R20 B.Tech Syllabus", reg: "R20", branch: "CSE", year: "1st to 4th Year", pdf: "/uploads/2021/04/R20-B.TECH-CSE-SYLLABUS.pdf" },
      { subject: "ECE R20 B.Tech Syllabus", reg: "R20", branch: "ECE", year: "1st to 4th Year", pdf: "/uploads/2021/04/R20-B.TECH-ECE-SYLLABUS.pdf" },
      { subject: "EEE R20 B.Tech Syllabus", reg: "R20", branch: "EEE", year: "1st to 4th Year", pdf: "/uploads/2021/04/R20-B.TECH-EEE-SYLLABUS.pdf" },
      { subject: "MECH R20 B.Tech Syllabus", reg: "R20", branch: "MECH", year: "1st to 4th Year", pdf: "/uploads/2021/04/R20-B.TECH-ME-SYLLABUS.pdf" },
      { subject: "MET R20 B.Tech Syllabus", reg: "R20", branch: "MET", year: "1st to 4th Year", pdf: "/uploads/2021/04/R20-B.TECH-MET-SYLLABUS.pdf" },
      { subject: "IT R20 B.Tech Syllabus", reg: "R20", branch: "IT", year: "1st to 4th Year", pdf: "/uploads/2021/04/R20-B.TECH-IT-SYLLABUS.pdf" },

      { subject: "M.Tech IT / Data Science R25 Syllabus", reg: "R25", branch: "IT", year: "1st & 2nd Year", pdf: "/uploads/2025/12/R25_M.Tech_ITDS.pdf" },
      { subject: "MCA R25 Syllabus & Course Structure", reg: "R25", branch: "MCA", year: "1st & 2nd Year", pdf: "/uploads/2025/11/JNTUGV_R25_MCA_Syllabus-Course-structure.pdf" },
      { subject: "MBA R25 Course Structure & Syllabus", reg: "R25", branch: "MBA", year: "1st & 2nd Year", pdf: "/uploads/2025/11/MBA-R25-Course-Structure-Syllabus.pdf" },
      { subject: "M.Tech Thermal Engineering (Mechanical) R25 Syllabus", reg: "R25", branch: "MECH", year: "1st & 2nd Year", pdf: "/uploads/2025/11/R25-MTech-Thermal-Engg_JNTU-GV-CEV-CS-Syllabus-1.pdf" },
      { subject: "M.Tech Power Systems & Allied Courses (EEE) R25 Syllabus", reg: "R25", branch: "EEE", year: "1st & 2nd Year", pdf: "/uploads/2025/12/JNTUGV-R25-M.tech-Power-systems-Allied-courses-Course-structure-Syllabus-3-1.pdf" },
      { subject: "M.Tech VLSI Design & Embedded Systems (ECE) R25 Syllabus", reg: "R25", branch: "ECE", year: "1st & 2nd Year", pdf: "/uploads/2025/12/R-25-M.-Tech-VLSID-ES-Syllabus.pdf" },
      { subject: "M.Tech R25 Final Course Structure & Syllabus (General)", reg: "R25", branch: "M.Tech", year: "1st & 2nd Year", pdf: "/uploads/2025/10/M.Tech-R25-Final-Course-Structure-Syllabus.pdf" },
    ];

    for (const chunk of chunks) {
      if (chunk.source_type === "syllabus" && chunk.metadata?.pdf_url) {
        const p = chunk.metadata.pdf_url;
        if (!syllabusItems.some(i => i.pdf === p)) {
          syllabusItems.push({
            subject: chunk.content.split(".")[0].replace(/^Syllabus:\s*/i, ""),
            reg: chunk.metadata.regulation || "R23",
            branch: (chunk.metadata.branch || "CSE").toUpperCase(),
            year: chunk.metadata.academic_year || "All Years",
            pdf: p
          });
        }
      }
    }

    if (!reg && !deptMatch) {
      return `**Course Syllabus Assistant** 📄\n\nWhich regulation and department syllabus would you like to view?\n\n• **Regulations**: R23, R20, R19, R16, R25 (PG)\n• **Departments**: CSE, ECE, EEE, MECH, MET, IT, Civil, MBA, MCA\n\nClick one of the suggestion chips below, or filter online at [Academics → Syllabus](/academics/syllabus).`;
    }

    if (reg && !deptMatch) {
      const regItems = syllabusItems.filter(item => item.reg.toUpperCase() === reg);
      let resp = `**${reg} Academic Syllabus** 📄\n\nHere are the available syllabus courses for **${reg} Regulation**:\n\n`;
      if (regItems.length > 0) {
        resp += regItems.map(item => `• **${item.branch}** (${item.year}): [Download PDF](${item.pdf})`).join("\n");
      } else {
        resp += `No specific ${reg} syllabus files are currently uploaded. You can view all regulations on [Academics → Regulations](/academics/regulations).`;
      }
      resp += `\n\nWhich department do you need? Select a department chip below or view all at [Academics → Syllabus](/academics/syllabus).`;
      return resp;
    }

    if (!reg && deptMatch) {
      const deptItems = syllabusItems.filter(item => item.branch.toUpperCase() === deptMatch);
      let resp = `**${deptMatch} Department Syllabus** 📄\n\nHere are the available syllabus records for **${deptMatch}** department:\n\n`;
      if (deptItems.length > 0) {
        resp += deptItems.map(item => `• **${item.reg} Regulation** (${item.year}): [Download PDF](${item.pdf})`).join("\n");
      } else {
        resp += `Visit the main [Academics → Syllabus](/academics/syllabus) page to view all available syllabus documents for ${deptMatch}.`;
      }
      resp += `\n\nWhich regulation do you need? Select a regulation chip below.`;
      return resp;
    }

    if (reg && deptMatch) {
      const exactMatches = syllabusItems.filter(item => item.reg.toUpperCase() === reg && item.branch.toUpperCase() === deptMatch);
      if (exactMatches.length > 0) {
        let resp = `**${deptMatch} ${reg} Syllabus Information** 📄\n\n`;
        resp += exactMatches.map(item => `• **${item.subject}** (${item.year}):\n  👉 [Download PDF](${item.pdf})`).join("\n\n");
        resp += `\n\n🌐 View full interactive syllabus list: [Academics → Syllabus](/academics/syllabus)`;
        return resp;
      }
      return `**${deptMatch} ${reg} Syllabus** 📄\n\nWe don't have a specific PDF uploaded for ${deptMatch} under ${reg} regulation yet.\n\n🌐 Check all available syllabus documents on [Academics → Syllabus](/academics/syllabus) or regulations on [Academics → Regulations](/academics/regulations).`;
    }
  }

  // ── TIMETABLE ──
  if (intents.includes("timetable")) {
    const relInfo = rel(["timetable", "schedule", "time", "class", "lecture", "semester"], 6);
    const ttLinks = linksFor("timetable", "schedule");
    let resp = `**Class Timetables** 🕒\n\nClass timetables are published at the beginning of each semester by the respective departments. Both regular and supplementary exam timetables are available.`;
    if (relInfo) resp += `\n\n${relInfo}`;
    resp += ttLinks.length > 0 ? `\n\n**Downloads:**\n${linkify(ttLinks)}` : `\n\n📂 [View Timetables](/academics/timetables)\n📂 [Department Timetables](/departments) — Select your department for department-specific timetables`;
    return resp;
  }

  // ── EXAM / RESULTS ──
  if (intents.includes("exam")) {
    const relInfo = rel(["exam", "result", "date", "schedule", "revaluation", "hall ticket", "supply", "backlog", "grade"], 7);
    const examLinks = linksFor("exam", "result", "hall", "notification");
    let resp = `**Examination & Results** 📝\n\n`;
    resp += `Internal mid-term exams (Mid-1 & Mid-2) and end-semester university examinations are conducted as per the academic calendar.\n\n`;
    resp += `**Key Information:**\n• **Mid Exams**: 2 mid-term exams per semester (descriptive/objective)\n• **End Semester**: University exams conducted by JNTU-GV\n• **Revaluation**: Apply within 15 days of results via JNTU-GV exam portal\n• **Supply/Backlog**: Supplementary exams held after regular exams\n• **Grading**: CBCS grading system (O, A+, A, B+, B, C, F)\n• **Hall Tickets**: Available on JNTU-GV university portal before exams`;
    if (relInfo) resp += `\n\n${relInfo}`;
    resp += examLinks.length > 0 ? `\n\n**Links:**\n${linkify(examLinks)}` : `\n\n📂 [Examination Cell](/academics/examination)`;
    return resp;
  }

  // ── HOSTEL ──
  if (intents.includes("hostel")) {
    const qLower = query.toLowerCase();
    const wantsFee = /fee|cost|charge|amount|price|how much/i.test(qLower);
    const wantsBoys = /boys?\b/i.test(qLower);
    const wantsGirls = /girls?\b/i.test(qLower);

    let resp = `**Hostel Information** 🏠\n\n`;

    if (wantsBoys && !wantsGirls) {
      resp += `### Boys Hostel\n• **Name**: ${KB.hostel.boys.name}\n• **Capacity**: ${KB.hostel.boys.capacity}\n• **Warden**: ${KB.hostel.boys.warden}\n• **Facilities**: ${KB.hostel.boys.facilities}`;
    } else if (wantsGirls && !wantsBoys) {
      resp += `### Girls Hostel\n• **Name**: ${KB.hostel.girls.name}\n• **Capacity**: ${KB.hostel.girls.capacity}\n• **Warden**: ${KB.hostel.girls.warden}\n• **Facilities**: ${KB.hostel.girls.facilities}`;
    } else {
      resp += `### Boys Hostel\n• **Capacity**: ${KB.hostel.boys.capacity}\n• **Facilities**: ${KB.hostel.boys.facilities}\n\n### Girls Hostel\n• **Capacity**: ${KB.hostel.girls.capacity}\n• **Facilities**: ${KB.hostel.girls.facilities}`;
    }

    resp += `\n\n### Dining Mess\n${KB.hostel.mess}`;

    if (wantsFee) {
      resp += `\n\n### Hostel & Mess Fees\n${KB.hostel.fees}`;
    }

    resp += `\n\n### Timings\n${KB.hostel.timings}`;
    resp += `\n\n📞 ${KB.hostel.contact}\n🌐 [Hostel Details](/hostels)`;
    return resp;
  }

  // ── PLACEMENT ──
  if (intents.includes("placement")) {
    const qLower = query.toLowerCase();
    const wantsRecruiters = /recruiter|company|companies|who recruit/i.test(qLower);
    const wantsPackage = /package|salary|lpa|highest|average|ctc/i.test(qLower);

    let resp = `**Placements at JNTU-GV CEV** 🏢\n\n`;
    resp += `• **Highest Package**: ${KB.placement.highest}\n• **Average Package**: ${KB.placement.average}\n• **Placement Rate**: ${KB.placement.placementRate}\n\n`;

    if (wantsRecruiters || !wantsPackage) {
      resp += `### Top Recruiters\n${KB.placement.topRecruiters.map(r => `• ${r}`).join("\n")}\n\n`;
    }

    resp += `### Training & Preparation\n${KB.placement.training}`;
    resp += `\n\n🌐 [Placements → Students](${KB.placement.link}) | [Recruiters](/placements/recruiters) | [Training](/placements/training)`;

    const relInfo = rel(["placement", "package", "company", "selected", "offer"], 4);
    if (relInfo) resp += `\n\n${relInfo}`;
    return resp;
  }

  // ── FEE ──
  if (intents.includes("fee") && !intents.includes("hostel")) {
    let resp = `**Fee Structure** 💰\n\n`;
    resp += `• **B.Tech**: ${KB.fees.btech}\n• **M.Tech**: ${KB.fees.mtech}\n• **MBA**: ${KB.fees.mba}\n• **Other Charges**: ${KB.fees.other}\n\n`;
    resp += `### Fee Reimbursement\n${KB.fees.reimbursement}\n\n`;
    resp += `⚠️ ${KB.fees.note}`;
    resp += `\n\n📞 Office: ${KB.college.phone}\n🌐 [Fee Structure & Admissions](${KB.fees.link}) | [Scholarships](/academics/scholarships)`;
    return resp;
  }

  // ── SCHOLARSHIP ──
  if (intents.includes("scholarship")) {
    let resp = `**Scholarships & Financial Aid** 🎓💰\n\n`;
    resp += `### Available Scholarship Schemes\n${KB.scholarship.types.map(s => `• ${s}`).join("\n")}\n\n`;
    resp += `### How to Apply\n${KB.scholarship.process}\n\n`;
    resp += `📞 ${KB.scholarship.helpline}\n🌐 [Scholarships Page](${KB.scholarship.link})`;
    return resp;
  }

  // ── LIBRARY ──
  if (intents.includes("library")) {
    let resp = `**${KB.library.name}** 📚\n\n`;
    resp += `• **Collection**: ${KB.library.books}\n• **E-Resources**: ${KB.library.eResources}\n• **Reading Hall**: ${KB.library.readingHall}\n• **Timings**: ${KB.library.timings}\n\n`;
    resp += `### Services Available\n${KB.library.services}\n\n`;
    resp += `🌐 [Library Page](${KB.library.link})`;

    const relInfo = rel(["library", "book", "journal", "digital", "ieee", "nlist"], 4);
    if (relInfo) resp += `\n\n${relInfo}`;
    return resp;
  }

  // ── NSS ──
  if (intents.includes("nss")) {
    let resp = `**${KB.nss.name}** 🤝\n\n`;
    resp += `**Motto**: "${KB.nss.motto}"\n\n`;
    resp += `• **Coordinator**: ${KB.nss.coordinator}\n• **Volunteers**: ${KB.nss.volunteers}\n\n`;
    resp += `### Activities & Programs\n${KB.nss.activities.map(a => `• ${a}`).join("\n")}\n\n`;
    resp += `### Special Camp\n${KB.nss.specialCamp}\n\n`;
    resp += `🌐 [NSS Page](${KB.nss.link}) | [Activities](/nss/activities) | [Special Camp](/nss/special-camp)`;
    return resp;
  }

  // ── SPORTS ──
  if (intents.includes("sports")) {
    let resp = `**${KB.sports.name}** 🏅\n\n`;
    resp += `### Facilities\n${KB.sports.facilities.map(f => `• ${f}`).join("\n")}\n\n`;
    resp += `### Achievements\n${KB.sports.achievements}\n\n`;
    resp += `### Events\n${KB.sports.events}\n\n`;
    resp += `🌐 [Sports Page](${KB.sports.link})`;
    return resp;
  }

  // ── DISPENSARY ──
  if (intents.includes("dispensary")) {
    let resp = `**${KB.dispensary.name}** 🏥\n\n`;
    resp += `• **Doctor**: ${KB.dispensary.doctor}\n• **Nurse**: ${KB.dispensary.nurse}\n• **Timings**: ${KB.dispensary.timings}\n\n`;
    resp += `### Facilities\n${KB.dispensary.facilities.map(f => `• ${f}`).join("\n")}\n\n`;
    resp += `### Nearby Hospitals\n${KB.dispensary.nearbyHospitals}\n\n`;
    resp += `🌐 [Dispensary Page](${KB.dispensary.link})`;
    return resp;
  }

  // ── WOMEN EMPOWERMENT CELL (WEC) ──
  if (intents.includes("wec") && !intents.includes("anti_ragging")) {
    let resp = `**${KB.wec.name}** 👩‍💼\n\n`;
    resp += `**Objective**: ${KB.wec.objective}\n\n`;
    resp += `• **Chairperson**: ${KB.wec.chairperson}\n\n`;
    resp += `### Activities\n${KB.wec.activities.map(a => `• ${a}`).join("\n")}\n\n`;
    resp += `### Internal Complaints Committee (ICC)\n${KB.wec.icc}\n\n`;
    resp += `📞 ${KB.wec.helpline}\n🌐 [Women Empowerment Cell](${KB.wec.link}) | [Activities](/women-empowerment/activities) | [Magazine](/women-empowerment/magazine)`;
    return resp;
  }

  // ── ANTI-RAGGING ──
  if (intents.includes("anti_ragging")) {
    let resp = `**${KB.antiRagging.name}** 🚫\n\n`;
    resp += `${KB.antiRagging.committee}\n\n`;
    resp += `### Anti-Ragging Measures\n${KB.antiRagging.measures.map(m => `• ${m}`).join("\n")}\n\n`;
    resp += `### Punishment\n${KB.antiRagging.punishment}\n\n`;
    resp += `📞 **UGC Helpline**: ${KB.antiRagging.helpline}\n📧 Email: ${KB.antiRagging.email}\n🌐 National Portal: [antiragging.in](${KB.antiRagging.website})\n📂 [Anti-Ragging Page](${KB.antiRagging.link})`;
    return resp;
  }

  // ── EDC ──
  if (intents.includes("edc")) {
    let resp = `**${KB.edc.name}** 🚀\n\n`;
    resp += `**Objective**: ${KB.edc.objective}\n\n`;
    resp += `• **Coordinator**: ${KB.edc.coordinator}\n\n`;
    resp += `### Activities & Programs\n${KB.edc.activities.map(a => `• ${a}`).join("\n")}\n\n`;
    resp += `🌐 [EDC Page](${KB.edc.link})`;
    return resp;
  }

  // ── RESEARCH / R&D ──
  if (intents.includes("research")) {
    const qLower = query.toLowerCase();
    const wantsPublications = /publication|journal|paper|publish/i.test(qLower);
    const wantsScholars = /scholar|phd|ph\.d|research student/i.test(qLower);
    const wantsProjects = /project|funded|funding|grant/i.test(qLower);
    const wantsAreas = /area|domain|topic|field/i.test(qLower);

    let resp = `**${KB.research.name}** 🔬\n\n`;
    resp += `• **Coordinator**: ${KB.research.coordinator}\n\n`;

    if (wantsAreas || (!wantsPublications && !wantsScholars && !wantsProjects)) {
      resp += `### Research Areas\n${KB.research.areas.map(a => `• ${a}`).join("\n")}\n\n`;
    }
    if (wantsPublications) {
      resp += `### Publications\nFaculty and research scholars actively publish in high-impact international journals indexed in Scopus, Web of Science, IEEE Xplore, Springer, and Elsevier. Over **350+ research papers** have been published across CSE, ECE, EEE, Mechanical, Metallurgy, and Basic Sciences.\n\n🌐 [View Publications](/rd-cell/publications)\n\n`;
    }
    if (wantsScholars) {
      resp += `### Research Scholars\nCurrently **60+ Ph.D scholars** are actively pursuing doctoral research under recognized faculty supervisors across VLSI, AI/ML, Smart Power Grids, Thermal Systems, Nanomaterials, and Data Science.\n\n🌐 [View Research Scholars](/rd-cell/scholars)\n\n`;
    }
    if (wantsProjects) {
      resp += `### Funded Projects\n${KB.research.funding}\n\n🌐 [View R&D Projects](/rd-cell/projects)\n\n`;
    }

    resp += `• **Patents**: ${KB.research.patents}\n\n`;
    resp += `🌐 [R&D Cell](${KB.research.link}) | [Projects](/rd-cell/projects) | [Publications](/rd-cell/publications) | [Scholars](/rd-cell/scholars)`;
    return resp;
  }

  // ── IQAC ──
  if (intents.includes("iqac")) {
    const qLower = query.toLowerCase();
    const wantsAQAR = /aqar|annual quality/i.test(qLower);
    const wantsMOU = /mou|memorandum|collaboration/i.test(qLower);
    const wantsComposition = /composition|member|committee|who is in|chairperson|coordinator/i.test(qLower);
    const wantsMeetings = /meeting|minutes|agenda/i.test(qLower);

    let resp = `**${KB.iqac.name}** 🏆\n\n`;
    resp += `• **Chairperson**: ${KB.iqac.chairperson}\n`;
    resp += `• **Coordinator**: ${KB.iqac.coordinator}\n`;
    resp += `• **Accreditation**: ${KB.iqac.accreditation}\n`;
    resp += `• **Rankings**: ${KB.iqac.rankings}\n\n`;

    if (wantsComposition) {
      resp += `### IQAC Committee Composition\n${KB.iqac.composition.map(m => `• ${m}`).join("\n")}\n\n`;
    } else if (wantsMeetings) {
      resp += `### IQAC Meetings & Review Schedule\n${KB.iqac.meetings}\n\n`;
    } else if (wantsAQAR) {
      resp += `### Annual Quality Assurance Report (AQAR)\n${KB.iqac.aqar} View reports at [IQAC → AQAR](/administration/iqac/aqar).\n\n`;
    } else if (wantsMOU) {
      resp += `### MoUs & Collaborations\n${KB.iqac.mous} View details at [IQAC → MoUs](/administration/iqac/mous).\n\n`;
    } else {
      resp += `### Key Functions & Activities\n${KB.iqac.activities.map(a => `• ${a}`).join("\n")}\n\n`;
    }

    resp += `🌐 [IQAC Page](${KB.iqac.link}) | [AQAR](/administration/iqac/aqar) | [Composition](/administration/iqac/composition) | [Meetings](/administration/iqac/meetings) | [MoUs](/administration/iqac/mous)`;
    return resp;
  }

  // ── PROFESSIONAL BODIES ──
  if (intents.includes("prof_body")) {
    let resp = `**Professional Bodies & Student Chapters** 🏅\n\n`;
    resp += `### ${KB.profBodies.ieee.name}\n${KB.profBodies.ieee.description}\n\n`;
    resp += `### ${KB.profBodies.iste.name}\n${KB.profBodies.iste.description}\n\n`;
    resp += `### ${KB.profBodies.csi.name}\n${KB.profBodies.csi.description}\n\n`;
    resp += `🌐 [Professional Bodies Page](${KB.profBodies.link})`;
    return resp;
  }

  // ── LABS / LABORATORY ──
  if (intents.includes("lab")) {
    const qLower = query.toLowerCase();
    const deptCode =
      /\b(cse|computer science)\b/i.test(qLower) ? "CSE" :
      /\b(ece|electronics)\b/i.test(qLower) ? "ECE" :
      /\b(eee|electrical)\b/i.test(qLower) ? "EEE" :
      /\b(mech|mechanical)\b/i.test(qLower) ? "MECH" :
      /\b(met|metallurg)\b/i.test(qLower) ? "MET" :
      /\b(it\b|information technology)\b/i.test(qLower) ? "IT" :
      /\b(bsh|science|humanities|physics|chemistry|english)\b/i.test(qLower) ? "BSH" :
      null;

    if (deptCode && KB.labs[deptCode as keyof typeof KB.labs]) {
      const labs = KB.labs[deptCode as keyof typeof KB.labs];
      return `**${deptCode} Department Laboratories** 🔬\n\n${labs.map(l => `• ${l}`).join("\n")}\n\n🌐 [Department Labs](/departments/${deptCode.toLowerCase()}/labs)`;
    }

    let resp = `**Campus Laboratories & Infrastructure** 🔬\n\n`;
    for (const [dept, labs] of Object.entries(KB.labs)) {
      resp += `### ${dept}\n${labs.slice(0, 4).map(l => `• ${l}`).join("\n")}\n\n`;
    }
    resp += `🌐 Select a department at [Departments](/departments) to see all labs.`;
    return resp;
  }

  // ── MOU ──
  if (intents.includes("mou")) {
    const relInfo = rel(["mou", "memorandum", "agreement", "collaboration", "partner", "tie"], 6);
    let resp = `**Memoranda of Understanding (MoUs)** 🤝\n\nJNTU-GV CEV has signed MoUs with multiple national and international organizations for academic collaboration, student exchange, internships, and research partnerships.`;
    if (relInfo) resp += `\n\n${relInfo}`;
    resp += `\n\n🌐 [R&D → MoUs](/rd-cell/mous) | [IQAC → MoUs](/administration/iqac/mous)`;
    return resp;
  }

  // ── CLUB / CAMPUS LIFE ──
  if (intents.includes("club") || intents.includes("campus_life")) {
    let resp = `**Campus Life & Student Clubs** 🎭\n\n`;
    resp += `### Student Clubs & Cells\n`;
    resp += `• **Music Club** — Annual concerts, inter-college music competitions\n`;
    resp += `• **Student Activity Club (SAC)** — Cultural events, workshops, talent shows\n`;
    resp += `• **Coding Club** — Competitive programming, hackathons\n`;
    resp += `• **NSS Unit** — Community service, blood donation, village adoption\n`;
    resp += `• **EDC** — Entrepreneurship workshops, startup bootcamps\n`;
    resp += `• **WEC** — Women empowerment activities, self-defense training\n`;
    resp += `• **IEEE/ISTE/CSI Chapters** — Technical workshops, paper presentations\n\n`;
    resp += `### Events & Fests\n`;
    resp += `• Annual Day celebrations\n• Technical Fest (departmental symposiums)\n• Cultural Fest (inter-college competitions)\n• Freshers' Day & Farewell events\n• Sports Day & inter-departmental tournaments\n\n`;
    resp += `🌐 [Campus Life](/campus-life) | [Music Club](/campus-life/music-club) | [Student Activity Club](/campus-life/student-activity-club)`;
    return resp;
  }

  // ── NOTICE ──
  if (intents.includes("notice")) {
    const noticeChunks = chunks.filter(c => c.source_type === "notice" || /notice|circular|notification/i.test(c.content));
    let resp = `**Latest Notices & Circulars** 📢\n\n`;
    if (noticeChunks.length > 0) {
      resp += noticeChunks.slice(0, 5).map(c => `• ${c.content}`).join("\n\n");
    } else {
      const relInfo = rel(["notice", "circular", "notification", "announcement", "latest"], 6);
      resp += relInfo || `All official notices, circulars, exam notifications, and announcements are published on the Notices page. Check regularly for the latest updates.`;
    }
    resp += `\n\n🌐 [View All Notices](/notices) | [Latest Updates](/latest-updates)`;
    return resp;
  }

  // ── ACADEMIC CALENDAR ──
  if (intents.includes("academic_calendar")) {
    let resp = `**Academic Calendar** 📅\n\n`;
    resp += `### Odd Semester (July – November)\n${KB.academicCalendar.oddSemester}\n\n`;
    resp += `### Even Semester (December – May)\n${KB.academicCalendar.evenSemester}\n\n`;
    resp += `### Holidays\n${KB.academicCalendar.holidays}\n\n`;
    resp += `⚠️ ${KB.academicCalendar.note}\n\n`;
    resp += `🌐 [Academic Calendar Page](${KB.academicCalendar.link})`;
    return resp;
  }

  // ── TRANSPORT ──
  if (intents.includes("transport")) {
    let resp = `**${KB.transport.name}** 🚌\n\n`;
    resp += `### Routes\n${KB.transport.routes.map(r => `• ${r}`).join("\n")}\n\n`;
    resp += `### Timings\n${KB.transport.timings}\n\n`;
    resp += `📞 ${KB.transport.contact}`;
    return resp;
  }

  // ── GUESTHOUSE & AMENITIES ──
  if (intents.includes("guesthouse")) {
    const qLower = query.toLowerCase();
    const wantsStaff = /staff|quarter/i.test(qLower);

    if (wantsStaff) {
      return `**${KB.staffQuarters.name}** 🏘️\n\n${KB.staffQuarters.description}\n\n🌐 [Staff Quarters](${KB.staffQuarters.link})`;
    }

    return `**${KB.guestHouse.name}** 🏨\n\n${KB.guestHouse.description}\n\n📞 ${KB.guestHouse.booking}\n🌐 [Guest House](${KB.guestHouse.link}) | [Staff Quarters](${KB.staffQuarters.link})`;
  }

  // ── BANK & ATM ──
  if (intents.includes("bank")) {
    return `**${KB.bank.name}** 🏦\n\n${KB.bank.description}\n\n**Services**: ${KB.bank.services}`;
  }

  // ── CANTEEN ──
  if (intents.includes("canteen")) {
    return `**${KB.canteen.name}** 🍽️\n\n${KB.canteen.description}\n\n⏰ **Timings**: ${KB.canteen.timings}\n\n📝 ${KB.canteen.note}`;
  }

  // ── CERTIFICATES & TC ──
  if (intents.includes("certificates")) {
    return `**Certificates & Student Documents** 📜\n\nFor Transfer Certificate (TC), Bonafide Certificate, Conduct Certificate, or Grade Memos:\n\n**Process:**\n1. Collect application form from the Academic Section\n2. Fill in details and attach required documents\n3. Submit to the Academic Section / Principal's Office\n4. Processing time: 3–7 working days\n5. Collect with valid ID card\n\n**Available Certificates:**\n• Transfer Certificate (TC)\n• Bonafide Certificate\n• Conduct Certificate\n• Marks Memo / Grade Sheet\n• Provisional Certificate\n• Consolidated Marks Memo\n• Migration Certificate\n\n📞 Office Phone: ${KB.college.phone}`;
  }

  // ── TIMINGS ──
  if (intents.includes("timings")) {
    return `**College & Office Timings** ⏰\n\n• **Class Timings**: 9:30 AM – 4:30 PM (Mon – Sat)\n• **Administrative Office**: 10:00 AM – 5:00 PM\n• **Library**: ${KB.library.timings}\n• **Dispensary**: ${KB.dispensary.timings}\n• **Canteen**: ${KB.canteen.timings}\n• **Hostel In-time**: ${KB.hostel.timings}\n• **Bank/ATM**: Banking hours + 24/7 ATM`;
  }

  // ── FACULTY ──
  if (intents.includes("faculty")) {
    const qLower = query.toLowerCase();
    const allPeople = [
      { name: "Dr. V. S. Vakula", designation: "Principal", department: "Principal Office", email: "principal@jntugvcev.edu.in" },
      { name: "Prof. G. J. Naga Raju", designation: "Vice Principal & HOD of S&H", department: "Basic Sciences & Humanities", email: "viceprincipal@jntugvcev.edu.in" },
      ...KB.hods.map(h => ({ name: h.name, designation: h.designation, department: h.dept, email: h.email })),
      ...KB.faculty,
    ];

    const matchedPerson = allPeople.find(p => {
      const parts = p.name.toLowerCase().replace(/^(dr\.|prof\.|mr\.|mrs\.|ms\.)\s*/, "").split(/\s+/);
      return parts.some(part => part.length > 3 && qLower.includes(part));
    });

    if (matchedPerson) {
      return `👨‍🏫 **Faculty Profile**: **${matchedPerson.name}**\n\n• **Designation**: ${matchedPerson.designation}\n• **Department**: ${matchedPerson.department}\n• **Email**: [${matchedPerson.email}](mailto:${matchedPerson.email})\n\n🌐 View directory: [Academics → Faculty](/academics/faculty)`;
    }

    const relInfo = rel(["faculty", "professor", "hod", "staff", "lecturer", "assistant", "associate"], 7);
    return `**Faculty Directory & Information** 👨‍🏫\n\n${relInfo || "Experienced faculty members with Ph.D. degrees and industrial exposure across all engineering branches."}\n\n🌐 [Academics → Faculty Directory](/academics/faculty)`;
  }

  // ── LOCATION ──
  if (intents.includes("location")) {
    const extra = rel(["dwarapudi", "vizianagaram", "km", "bus", "train", "route"]);
    return `**How to Reach JNTU-GV CEV** 📍\n\n📍 ${KB.college.address}\n• **From Vizianagaram Railway Station**: ~7 km\n• **From RTC Bus Stand**: ~6 km\n• **From Visakhapatnam**: ~50 km via NH-16${extra ? `\n\n${extra}` : ""}\n\n🗺️ [View on Google Maps](https://maps.google.com/?q=JNTU+GV+College+of+Engineering+Vizianagaram)`;
  }

  // ── CONTACT ──
  if (intents.includes("contact")) {
    return `**Contact JNTU-GV CEV** 📞\n\n📍 ${KB.college.address}\n📞 Phone: ${KB.college.phone}\n📧 Email: [${KB.college.email}](mailto:${KB.college.email})\n🌐 Website: [jntugvcev.edu.in](${KB.college.website})`;
  }

  // ── ABOUT ──
  if (intents.includes("about") && !intents.includes("norms") && !intents.includes("airport") && !intents.includes("contributors") && !intents.includes("principals_office")) {
    const extra = rel(["established", "founded", "history", "vision", "mission", "constituent", "autonomous"]);
    return `**About ${KB.college.name}** 🏛️\n\nA ${KB.college.affiliation}, established in **${KB.college.established}**. Campus spans over **${KB.college.campusArea}** in Dwarapudi, Vizianagaram.\n\n**Key Highlights:**\n• ${KB.departments.length} academic departments\n• ${KB.programs.ug.length} UG programs + ${KB.programs.pg.length} PG programs + Ph.D\n• NAAC accredited\n• ${KB.placement.placementRate} placement rate\n• Active NSS, EDC, WEC, IEEE, ISTE, CSI chapters\n${extra ? `\n${extra}` : ""}\n\n🌐 [About Institution](/about/institution) | [Vision & Mission](/about/vision-mission)`;
  }

  // ── VIZIANAGARAM ──
  if (intents.includes("vizianagaram")) {
    let resp = `**${KB.vizianagaram.name}** 🏰\n\n${KB.vizianagaram.description}\n\n`;
    resp += `### Nearby Places to Visit\n${KB.vizianagaram.nearbyPlaces.map(p => `• ${p}`).join("\n")}\n\n`;
    resp += `### Distance\n${KB.vizianagaram.distance}\n\n`;
    resp += `🌐 [About Vizianagaram](/about/vizianagaram)`;
    return resp;
  }

  // ── RTI ──
  if (intents.includes("rti")) {
    let resp = `**${KB.rti.name}** 📋\n\n`;
    resp += `• **PIO**: ${KB.rti.pio}\n• **Appellate Authority**: ${KB.rti.appellate}\n• **Application Fee**: ${KB.rti.fee}\n\n`;
    resp += `### Process\n${KB.rti.process}\n\n`;
    resp += `🌐 [RTI Page](${KB.rti.link})`;
    return resp;
  }

  // ── ENGINEERING CELL / IIC ──
  if (intents.includes("engineering_cell")) {
    let resp = `**${KB.engineeringCell.name}** 💡\n\n${KB.engineeringCell.description}\n\n`;
    resp += `### Activities\n${KB.engineeringCell.activities.map(a => `• ${a}`).join("\n")}\n\n`;
    resp += `🌐 [Engineering Cell](${KB.engineeringCell.link})`;
    return resp;
  }

  // ── IIPC ──
  if (intents.includes("iipc")) {
    let resp = `**${KB.iipc.name}** 🏭\n\n${KB.iipc.description}\n\n`;
    resp += `### Activities\n${KB.iipc.activities.map(a => `• ${a}`).join("\n")}\n\n`;
    resp += `🌐 [IIPC Page](${KB.iipc.link})`;
    return resp;
  }

  // ── PRESS NOTES ──
  if (intents.includes("press_notes")) {
    const relInfo = rel(["press", "news", "media", "article", "coverage"], 6);
    let resp = `**Press Notes & Media Coverage** 📰\n\n`;
    resp += relInfo || "JNTU-GV CEV regularly features in state and national media for academic excellence, placements, innovations, and campus events.";
    resp += `\n\n🌐 [Latest Updates](/latest-updates) | [Press Notes](/latest-updates)`;
    return resp;
  }

  // ── DOWNLOADS ──
  if (intents.includes("downloads")) {
    const relInfo = rel(["download", "form", "application", "proforma", "format"], 6);
    let resp = `**Academic Downloads & Forms** 📥\n\n`;
    resp += relInfo || "Download academic forms, application proformas, syllabus PDFs, timetables, and other documents from the Downloads section.";
    resp += `\n\n**Available Downloads:**\n• Syllabus PDFs (R23/R20/R25)\n• Exam timetables & hall tickets\n• Application forms (TC, Bonafide, etc.)\n• Academic calendar\n• Fee structure documents\n• Brochures\n\n🌐 [Downloads Page](/academics/downloads)`;
    return resp;
  }

  // ── NORMS & UGC RECOGNITION ──
  if (intents.includes("norms")) {
    let resp = `**${KB.norms.title}** 📜\n\n`;
    resp += `• **UGC Status**: ${KB.norms.ugc}\n`;
    resp += `• **University Affiliation**: ${KB.norms.status}\n`;
    resp += `• **Grant & Funding Eligibility**: ${KB.norms.eligibility}\n\n`;
    resp += `🌐 [Norms & Recognition](${KB.norms.link}) | [About Institution](/about/institution)`;
    return resp;
  }

  // ── ACHIEVEMENTS ──
  if (intents.includes("achievements") && !intents.includes("norms")) {
    const relInfo = rel(["achievement", "award", "topper", "rank", "gold", "best", "distinction", "merit"], 6);
    let resp = `**Achievements & Awards** 🏆\n\n`;
    resp += relInfo || "JNTU-GV CEV students and faculty have received numerous awards, university toppers, gold medals, and national-level recognition in academics, sports, and research.";
    resp += `\n\n**Notable Achievements:**\n• University rank holders across departments\n• Smart India Hackathon (SIH) finalists and winners\n• GATE/GRE qualified students\n• National-level sports achievements\n• Research publications in high-impact journals\n• Patents filed by faculty and students\n\n🌐 [Department Achievements](/departments) — Select a department for specific achievements`;
    return resp;
  }

  // ── STORIES / EXPERIENCES ──
  if (intents.includes("stories")) {
    return `**Campus Stories & Experiences** 🌟\n\nLife at JNTU-GV CEV is vibrant and multi-faceted. Students engage in:\n\n• 🔬 State-level technical symposiums & coding hackathons\n• 🏅 Inter-college sports tournaments\n• 🎭 Cultural festivals & annual day celebrations\n• 🤝 NSS community outreach programs\n• 🚀 Startup bootcamps & innovation challenges\n• 🎵 Music & dance clubs\n\nThe campus spans **${KB.college.campusArea}** of green landscape with modern infrastructure, hostels, library, sports grounds, and research labs.\n\n🌐 [Campus Life](/campus-life) | [Gallery](/gallery)`;
  }

  // ── PROJECTS ──
  if (intents.includes("projects")) {
    const relInfo = rel(["project", "innovation", "prototype", "research", "student"], 6);
    let resp = `**Student Projects & Innovations** 💡\n\n`;
    resp += `**Notable Projects:**\n• AI-powered precision agriculture (CSE & ECE teams)\n• Solar energy storage optimization (EEE department)\n• Industrial automation & robotics prototypes (MECH)\n• Novel materials & high-entropy alloys research (MET)\n• IoT-based smart campus monitoring systems\n• Deep learning medical diagnostic tools\n\n`;
    if (relInfo) resp += `${relInfo}\n\n`;
    resp += `🌐 [R&D → Projects](/rd-cell/projects)`;
    return resp;
  }

  // ── CAC (COLLEGE ACADEMIC COMMITTEE) ──
  if (intents.includes("cac")) {
    let resp = `**${KB.cac.name}** 🏛️\n\n`;
    resp += `• **Chairman**: ${KB.cac.chairman}\n• **Convener**: ${KB.cac.convener}\n\n`;
    resp += `### Committee Members\n${KB.cac.members.map(m => `• ${m}`).join("\n")}\n\n`;
    resp += `### Functions & Mandate\n${KB.cac.role}\n\n`;
    resp += `🌐 [College Academic Committee (CAC)](${KB.cac.link})`;
    return resp;
  }

  // ── CAP (CENTRALIZED ACADEMIC PLATFORM) ──
  if (intents.includes("cap")) {
    let resp = `**${KB.cap.name}** 🎓💻\n\n`;
    resp += `${KB.cap.description}\n\n`;
    resp += `🌐 [Access CAP Portal](${KB.cap.link})`;
    return resp;
  }

  // ── CONTRIBUTORS / DEVELOPER TEAM ──
  if (intents.includes("contributors")) {
    let resp = `**${KB.contributors.title}** 👨‍💻👩‍💻\n\n`;
    resp += `• **Faculty Supervisor**: ${KB.contributors.facultySupervisor}\n\n`;
    resp += `### Student Developers\n${KB.contributors.studentDevelopers.map(d => `• ${d}`).join("\n")}\n\n`;
    resp += `📍 ${KB.contributors.institution}\n\n`;
    resp += `🌐 [Meet the Contributors](${KB.contributors.link})`;
    return resp;
  }

  // ── AIRPORT CONNECTIVITY ──
  if (intents.includes("airport")) {
    let resp = `**Airport Connectivity & Travel Guide** ✈️\n\n`;
    resp += `• **Nearest Upcoming International Airport**: **${KB.airport.nearest}** (${KB.airport.distanceBhogapuram})\n`;
    resp += `• **Current Operational Airport**: Visakhapatnam International Airport (VTZ) (${KB.airport.distanceVizag})\n\n`;
    resp += `### Strategic Importance\n${KB.airport.significance}\n\n`;
    resp += `🌐 [Airport Connectivity](${KB.airport.link}) | [How to Reach](/about/how-to-reach)`;
    return resp;
  }

  // ── NORMS & UGC RECOGNITION ──
  if (intents.includes("norms")) {
    let resp = `**${KB.norms.title}** 📜\n\n`;
    resp += `• **UGC Status**: ${KB.norms.ugc}\n`;
    resp += `• **University Affiliation**: ${KB.norms.status}\n`;
    resp += `• **Grant & Funding Eligibility**: ${KB.norms.eligibility}\n\n`;
    resp += `🌐 [Norms & Recognition](${KB.norms.link}) | [About Institution](/about/institution)`;
    return resp;
  }

  // ── PRINCIPAL'S OFFICE ──
  if (intents.includes("principals_office")) {
    let resp = `**${KB.principalsOffice.title}** 🏢\n\n`;
    resp += `📍 **Location**: ${KB.principalsOffice.location}\n`;
    resp += `⏰ **Working Hours**: ${KB.principalsOffice.hours}\n`;
    resp += `📧 **Email**: [${KB.principalsOffice.email}](mailto:${KB.principalsOffice.email})\n\n`;
    resp += `### Student Support Services\n${KB.principalsOffice.services.map(s => `• ${s}`).join("\n")}\n\n`;
    resp += `🌐 [Principal's Office](${KB.principalsOffice.link}) | [Principal Desk](/administration/principal)`;
    return resp;
  }

  // ── GALLERY ──
  if (intents.includes("gallery")) {
    let resp = `**${KB.gallery.title}** 📸\n\n`;
    resp += `${KB.gallery.description}\n\n`;
    resp += `🌐 [Browse Campus Gallery](${KB.gallery.link})`;
    return resp;
  }

  // ── SITEMAP / NAVIGATION ──
  if (intents.includes("sitemap")) {
    let resp = `**${KB.sitemap.title}** 🗺️\n\n`;
    resp += `${KB.sitemap.sections.map(s => `• **${s.split(":")[0]}**: ${s.split(":")[1]}`).join("\n\n")}\n\n`;
    resp += `🌐 [Full Interactive Sitemap](${KB.sitemap.link})`;
    return resp;
  }

  // ── COMPREHENSIVE RAG EXTRACTION FOR ANY OTHER QUESTION ──
  if (hasCtx) {
    const qTokens = tokenize(query).filter((t) => !STOPWORDS.has(t));
    const extracted = rel(qTokens, 8);
    let resp = extracted || ctxText.slice(0, 900);
    if (links.length > 0) {
      resp += `\n\n**Relevant Links & Resources:**\n${linkify(links.slice(0, 4))}`;
    }
    return resp;
  }

  // ── GENERAL COLLEGE INFORMATION FALLBACK ──
  return `**JNTU-GV College of Engineering Vizianagaram** 🏛️\n\nI am here to assist with any information about JNTU-GV CEV departments, faculty, admissions, hostels, fee structures, examinations, and placements.\n\n📞 Phone: ${KB.college.phone}\n📧 Email: [${KB.college.email}](mailto:${KB.college.email})\n🌐 Website: [jntugvcev.edu.in](${KB.college.website})`;
}

// ─────────────────────────────────────────────
// 7. MAIN ENTRY POINT
// ─────────────────────────────────────────────

export interface ChatbotEngineInput {
  query: string;
  chunks: any[];
}

export function runChatbotEngine({ query, chunks }: ChatbotEngineInput): string {
  const lang = detectLanguage(query);
  const intents = detectIntents(query);
  const ranked = rerankChunks(chunks, query, intents);
  return buildAnswer(intents, query, ranked, lang);
}
