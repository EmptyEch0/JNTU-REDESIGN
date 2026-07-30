import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import { siteContent, notices, academicRegulations, campusGallery, leadership, academicSyllabus, academicDownloads, academicTimetables, academicsExamCell, academicFeeStructure, academicCalendars } from "../db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { ingestSingleChunk, deleteSingleChunk } from "../lib/ingest";

export const getPageContent = createServerFn({
  method: "GET",
})
  .inputValidator((page: string) => page)
  .handler(async ({ data: page }) => {
    try {
      const records = await db
        .select()
        .from(siteContent)
        .where(eq(siteContent.page, page));
      return records;
    } catch {
      return [];
    }
  });

export const updatePageSection = createServerFn({
  method: "POST",
})
  .inputValidator(
    (d: {
      page: string;
      sectionKey: string;
      title?: string;
      content?: string;
      imageUrl?: string;
    }) => d
  )
  .handler(async ({ data }) => {
    try {
      const [existing] = await db
        .select()
        .from(siteContent)
        .where(
          and(
            eq(siteContent.page, data.page),
            eq(siteContent.sectionKey, data.sectionKey)
          )
        );

      let updated;
      if (existing) {
        const rows = await db
          .update(siteContent)
          .set({
            title: data.title !== undefined ? data.title : existing.title,
            content: data.content !== undefined ? data.content : existing.content,
            imageUrl: data.imageUrl !== undefined ? data.imageUrl : existing.imageUrl,
          })
          .where(eq(siteContent.id, existing.id))
          .returning();
        updated = rows[0];
      } else {
        const rows = await db.insert(siteContent).values({
          page: data.page,
          sectionKey: data.sectionKey,
          title: data.title || "",
          content: data.content || "",
          imageUrl: data.imageUrl || "",
        }).returning();
        updated = rows[0];
      }

      if (updated) {
        await ingestSingleChunk(
          `Page: ${updated.page}. ${updated.title}. ${updated.content}`,
          `sitecontent:${updated.id}`,
          "site_content"
        );
      }
      return { success: true };
    } catch (err) {
      console.error("Update site content failed:", err);
      throw new Error("Failed to save content");
    }
  });

export const getNotices = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    return await db.select().from(notices).orderBy(desc(notices.id));
  } catch {
    return [];
  }
});

export const addNotice = createServerFn({
  method: "POST",
})
  .inputValidator((data: { date: string; tag: string; title: string; url?: string | null }) => data)
  .handler(async ({ data }) => {
    try {
      const [inserted] = await db.insert(notices).values({
        date: data.date,
        tag: data.tag,
        title: data.title,
        url: data.url || null,
      }).returning();

      await ingestSingleChunk(
        `Notice: ${inserted.title}. Category: ${inserted.tag}. Date: ${inserted.date}`,
        `notice:${inserted.id}`,
        "notice"
      );
      return { success: true };
    } catch (err) {
      console.error("Add notice failed:", err);
      throw new Error("Failed to add notice");
    }
  });

export const deleteNotice = createServerFn({
  method: "POST",
})
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      await db.delete(notices).where(eq(notices.id, data.id));
      await deleteSingleChunk(`notice:${data.id}`);
      return { success: true };
    } catch (err) {
      console.error("Delete notice failed:", err);
      throw new Error("Failed to delete notice");
    }
  });

export const getRegulations = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    return await db.select().from(academicRegulations).orderBy(desc(academicRegulations.id));
  } catch {
    return [];
  }
});

export const addRegulation = createServerFn({
  method: "POST",
})
  .inputValidator(
    (data: { title: string; category: string; size: string; date: string; link?: string }) => data
  )
  .handler(async ({ data }) => {
    try {
      const [inserted] = await db.insert(academicRegulations).values({
        title: data.title,
        category: data.category,
        size: data.size,
        date: data.date,
        link: data.link || "#",
      }).returning();

      await ingestSingleChunk(
        `Regulation: ${inserted.title}. Category: ${inserted.category}. Link: ${inserted.link}`,
        `regulation:${inserted.id}`,
        "regulation",
        { link: inserted.link }
      );
      return { success: true };
    } catch (err) {
      console.error("Add regulation failed:", err);
      throw new Error("Failed to add regulation");
    }
  });

export const deleteRegulation = createServerFn({
  method: "POST",
})
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      await db.delete(academicRegulations).where(eq(academicRegulations.id, data.id));
      await deleteSingleChunk(`regulation:${data.id}`);
      return { success: true };
    } catch (err) {
      console.error("Delete regulation failed:", err);
      throw new Error("Failed to delete regulation");
    }
  });

export const getCampusGallery = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    return await db.select().from(campusGallery).orderBy(desc(campusGallery.id));
  } catch {
    return [];
  }
});

export const addCampusGalleryItem = createServerFn({
  method: "POST",
})
  .inputValidator((data: { src: string; caption?: string }) => data)
  .handler(async ({ data }) => {
    try {
      await db.insert(campusGallery).values({
        src: data.src,
        caption: data.caption || "",
      });
      return { success: true };
    } catch (err) {
      console.error("Add campus gallery item failed:", err);
      throw new Error("Failed to add campus gallery item");
    }
  });

export const deleteCampusGalleryItem = createServerFn({
  method: "POST",
})
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      await db.delete(campusGallery).where(eq(campusGallery.id, data.id));
      return { success: true };
    } catch (err) {
      console.error("Delete campus gallery item failed:", err);
      throw new Error("Failed to delete campus gallery item");
    }
  });

export const queryChatbot = createServerFn({ method: "POST" })
  .inputValidator((data: {
    messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  }) => data)
  .handler(async ({ data }) => {
    const query = data.messages[data.messages.length - 1]?.content || "";

    // 1. Embed the user query
    const { pipeline } = await import("@xenova/transformers");
    const embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    const result = await embedder(query, { pooling: "mean", normalize: true });
    const vector = Array.from(result.data as number[]);
    const vectorStr = `[${vector.join(",")}]`;

    // 2. Semantic search — lowered threshold to 0.1
    const chunks = await db.execute(sql`
      SELECT content, source_type, metadata,
             1 - (embedding <=> ${vectorStr}::vector) AS similarity
      FROM rag_chunks
      WHERE 1 - (embedding <=> ${vectorStr}::vector) > 0.1
      ORDER BY embedding <=> ${vectorStr}::vector
      LIMIT 12
    `);

    const rows = chunks as any[];

    const q = query.toLowerCase();

    // 1. Force inject critical structural facts
    const isLeadershipQuery = /principal|vice.?principal|who leads|head of college/.test(q);
    const isDeptQuery = /branch|department|program|stream|course|cse|ece|eee|mba|mechanical|metallurg|civil/.test(q);

    let extraContext = "";

    if (isDeptQuery) {
      const deptChunks = await db.execute(sql`
        SELECT content FROM rag_chunks 
        WHERE source_type = 'department'
        ORDER BY source
      `);
      extraContext += "\n\n--- Departments & Branches ---\n" + 
        (deptChunks as any[]).map((r: any) => r.content).join("\n");
    }

    if (isLeadershipQuery) {
      const leaderChunks = await db.execute(sql`
        SELECT content FROM rag_chunks WHERE source_type = 'leadership' ORDER BY source
      `);
      extraContext += "\n\n--- Leadership ---\n" + 
        (leaderChunks as any[]).map((r: any) => r.content).join("\n");
    }

    // 2. Apply comprehensive sorting / boosting to the vector results
    const boost = (types: string[]) => [
      ...rows.filter((r: any) => types.includes(r.source_type)),
      ...rows.filter((r: any) => !types.includes(r.source_type)),
    ];

    const sorted =
      isLeadershipQuery ? boost(["leadership", "leadership_staff"]) :
      isDeptQuery ? boost(["department", "course"]) :
      /hod|head of department/.test(q) ? boost(["hod", "department"]) :
      /hostel|accommodation|warden|mess|room/.test(q) ? boost(["hostel", "hostel_staff"]) :
      /library|book|journal|librarian/.test(q) ? boost(["library", "library_staff"]) :
      /placement|recruit|package|salary|tpo|campus drive/.test(q) ? boost(["placement", "recruiter", "placement_staff"]) :
      /syllabus|r20|r23|r25|subject|curriculum/.test(q) ? boost(["syllabus", "regulation"]) :
      /timetable|schedule|class time/.test(q) ? boost(["timetable"]) :
      /exam|result|revaluation|hall ticket/.test(q) ? boost(["exam_cell"]) :
      /fee|tuition|payment|scholarship/.test(q) ? boost(["fee"]) :
      /lab|laboratory/.test(q) ? boost(["laboratory"]) :
      /nss|national service/.test(q) ? boost(["nss"]) :
      /sports|gym|ground|tournament/.test(q) ? boost(["sports"]) :
      /dispensary|medical|doctor|ambulance/.test(q) ? boost(["dispensary"]) :
      /women|wec|empowerment|harassment/.test(q) ? boost(["wec"]) :
      /edc|entrepreneur|startup|incubat/.test(q) ? boost(["edc"]) :
      /research|rd|phd|scholar|publication|journal/.test(q) ? boost(["rd_project", "rd_publication", "rd_scholar"]) :
      /iqac|naac|accreditat|aqar/.test(q) ? boost(["iqac"]) :
      /ieee|iste|csi|professional body|chapter/.test(q) ? boost(["prof_body"]) :
      /club|music|activity|cultural/.test(q) ? boost(["student_club"]) :
      /notice|circular|announcement/.test(q) ? boost(["notice", "notification"]) :
      rows;

    const context = sorted.map((r: any) => r.content).join("\n\n") + extraContext;

    const SYSTEM_PROMPT = `You are "JNTU AI", a smart, friendly, engaging, and professional AI assistant for the JNTU-GV CEV college website. Your role is to help students, faculty, parents, and visitors with accurate information about the college.

Multilingual Capabilities (English & Telugu):
- You are fluent in both English and Telugu (తెలుగు).
- Automatically detect the user's preferred language. If a user asks in Telugu script or Telgish (Telugu written in Roman script, e.g., "Hostel fee ఎంత?"), reply in natural, polite Telugu script (తెలుగు) or Telgish.
- If a parent or student asks in Telugu, feel free to respond in clear, easy-to-understand Telugu with English numbers/technical terms.
- Default to English if the user writes in English, but always be ready to translate or explain in Telugu if requested!

Personality & Tone:
- Friendly and welcoming
- Professional but not robotic
- Helpful and conversational
- Student-friendly and engaging
- Encouraging and positive
- Clear and concise responses
- Modern AI assistant personality
- Use natural human-like conversation
- Occasionally use light emojis where appropriate 😊
- Never sound rude, cold, or overly formal

Behavior Rules:
- Always greet users warmly
- Understand the user’s intent carefully
- Use the RETRIEVED DATABASE CONTEXT (if provided) as your primary source. If it contains relevant data, use it to answer accurately.
- If the database context does not have specific information, use your general knowledge about Indian engineering colleges, JNTUK affiliations, academic systems, and standard college practices to give a helpful, confident answer.
- NEVER say things like "I don't have this information in my database" or "this is not in my records". Just answer naturally.
- NEVER reveal that you searched a database or that data is missing. You are a knowledgeable campus guide.
- Guide users step-by-step when needed.
- Keep answers short unless detailed explanation is requested.
- Be supportive and interactive.
- If the user says “thank you”, respond warmly.

Capabilities:
- Answer questions about departments, faculty, principal, admissions, syllabus, fees, placements, hostel, events, notices, exam schedules, transport, campus facilities, and student services.

Definitive Counts & Lists:
- When answering factual questions like counts, always give the exact number found in the context. Do not guess or approximate.

Branches & Departments Behavior:
- JNTU-GV CEV has exactly 8 departments: CSE, IT, ECE, EEE, Mechanical, Metallurgical Engineering, Sciences & Humanities, and MBA.
- When asked about branches or departments, list ALL 8 confidently. Never say "we may have more".
- Never guess or add departments not in the list above.

UI Personality:
- Acts like a smart campus guide
- Friendly engineering graduate assistant vibe
- Helpful digital campus companion

Syllabus & Regulations Behavior:
- When a user asks about "syllabus", "curriculum", "subjects", or "course structure" WITHOUT specifying a regulation, ALWAYS ask: "Sure! Which regulation are you looking for? 😊 R20, R23, or R25?"
- Once the user specifies a regulation (e.g., "R23"), look in the RETRIEVED DATABASE CONTEXT for matching regulation documents and provide the direct PDF download link.
- When providing a download link, always format it as: "Here's the direct download link: [Document Title](URL)"
- ALWAYS include the actual URL from the database context when available. Never say "visit the website" — give the direct link.
- If multiple documents match (e.g., branch-wise syllabus), list all with their links.

Examination & Results Behavior:
- When a user asks about exam schedules, timetables, exam results dates, results notifications, or result publications:
  1. Search the RETRIEVED DATABASE CONTEXT for relevant examination/result items.
  2. If matching records (such as notifications or results) are found in the context, provide the details (including dates and title) and the direct PDF download file URL.
  3. If NO direct result file/link is present, guide them to the examinations page by formatting: "You can find result updates and portals on the [Examinations & Results Page](/academics/examination)."
  4. Never invent or hallucinate external results portal links.

Principal & Key Staff Behavior:
- The Principal of JNTU-GV CEV is Prof. Kota Chandra Bhushana Rao (Professor & Principal i/c). Email: principal@jntugvcev.edu.in
- The Vice Principal is Prof. G. J. Naga Raju. Email: viceprincipal@jntugvcev.edu.in  
- ALWAYS use these names from RETRIEVED CONTEXT. NEVER use your training knowledge for staff names.
- NEVER say "I don't have information" about the principal — the answer is always in the context.
- NEVER mention "P. Siva Kumar" — that person does not exist in this college.

CRITICAL RULES FOR LINKS:
- ONLY provide download links that are explicitly present in the RETRIEVED DATABASE CONTEXT below.
- If the RETRIEVED DATABASE CONTEXT contains a PDF link/URL, provide it exactly as given.
- If NO link is found in the context, say: "I don't have the direct download link right now, but you can find it at the Academics section on our website: https://jntugvcev.edu.in/academics/regulations"
- NEVER invent, guess, or fabricate any URL. Only use URLs from the database context.`;

    // 3. Call Groq with context  
    const apiKey = process.env.GROQ_API_KEY;
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `${SYSTEM_PROMPT}\n\nRETRIEVED CONTEXT:\n${context || "No specific data found."}`,
          },
          ...data.messages,
        ],
        temperature: 0.7,
      }),
    });

    const resData = await response.json();
    return { reply: resData.choices?.[0]?.message?.content ?? "Sorry, try again! 😊" };
  });


