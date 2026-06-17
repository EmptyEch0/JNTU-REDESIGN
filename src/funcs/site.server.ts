import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import { siteContent, notices, academicRegulations, campusGallery, leadership } from "../db/schema";
import { eq, and, desc } from "drizzle-orm";

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

      if (existing) {
        await db
          .update(siteContent)
          .set({
            title: data.title !== undefined ? data.title : existing.title,
            content: data.content !== undefined ? data.content : existing.content,
            imageUrl: data.imageUrl !== undefined ? data.imageUrl : existing.imageUrl,
          })
          .where(eq(siteContent.id, existing.id));
      } else {
        await db.insert(siteContent).values({
          page: data.page,
          sectionKey: data.sectionKey,
          title: data.title || "",
          content: data.content || "",
          imageUrl: data.imageUrl || "",
        });
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
  .inputValidator((data: { date: string; tag: string; title: string }) => data)
  .handler(async ({ data }) => {
    try {
      await db.insert(notices).values({
        date: data.date,
        tag: data.tag,
        title: data.title,
      });
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
      await db.insert(academicRegulations).values({
        title: data.title,
        category: data.category,
        size: data.size,
        date: data.date,
        link: data.link || "#",
      });
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

export const queryChatbot = createServerFn({
  method: "POST",
})
  .inputValidator(
    (data: {
      messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
    }) => data
  )
  .handler(async ({ data }) => {
    try {
      const query = data.messages[data.messages.length - 1]?.content || "";
      
      // Clean query into search tokens for fuzzy matching
      const terms = query
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter((word) => word.length > 2);

      let context = "";

      // 1. Semantic / Fuzzy Search on Leadership table (Principal, Vice-Principal)
      const allLeaders = await db.select().from(leadership);
      const matchedLeaders = allLeaders.filter((leader) => {
        const searchableText = `${leader.name} ${leader.designation} ${leader.quote} ${leader.profile} ${leader.slug}`.toLowerCase();
        
        // Match general terms or fuzzy rules for principal/vp typos
        return terms.some(
          (term) =>
            searchableText.includes(term) ||
            (term.includes("princi") && leader.slug === "principal") ||
            (term.includes("vice") && leader.slug === "vice-principal") ||
            (term.includes("leader") && leader.slug === "principal")
        );
      });

      if (matchedLeaders.length > 0) {
        context += `\n--- Leadership / Key Staff Information ---\n`;
        for (const l of matchedLeaders) {
          context += `[Role: ${l.designation}] Name: ${l.name}\nEmail: ${l.email}\nProfile: ${l.profile}\nOfficial Message: ${l.message}\n`;
        }
      }

      // 2. Semantic / Fuzzy Search on general page content (SiteContent)
      const allContent = await db.select().from(siteContent);
      const matchedContent = allContent.filter((c) => {
        const searchableText = `${c.page} ${c.sectionKey} ${c.title} ${c.content}`.toLowerCase();
        return terms.some((term) => {
          // Synonym maps
          if (term.includes("place") && c.page === "placements") return true;
          if (term.includes("reach") && c.page === "how-to-reach") return true;
          if (term.includes("vizia") && c.page === "vizianagaram") return true;
          if (term.includes("norm") && c.page === "norms") return true;
          return searchableText.includes(term);
        });
      });

      if (matchedContent.length > 0) {
        context += `\n--- Matching Website Details ---\n`;
        for (const c of matchedContent.slice(0, 10)) {
          context += `[Page: ${c.page}] [Section: ${c.sectionKey}] Title: ${c.title}\nContent: ${c.content}\n`;
        }
      }

      // 3. Semantic / Fuzzy Search on Academic Regulations
      const allRegs = await db.select().from(academicRegulations);
      const regKeywords = ["syllabus", "regulation", "r20", "r23", "r25", "r19", "curriculum", "subject"];
      const isRegQuery = terms.some(t => regKeywords.some(k => t.includes(k)));

      const matchedRegs = isRegQuery
        ? allRegs  // send ALL regs to AI when it's a reg/syllabus question
        : allRegs.filter((r) => {
            const searchableText = `${r.title} ${r.category}`.toLowerCase();
            return terms.some((term) => searchableText.includes(term));
          });

      if (matchedRegs.length > 0) {
        context += `\n--- Academic Regulations & Documents (USE THESE LINKS ONLY) ---\n`;
        for (const r of matchedRegs) {
          context += `Category: ${r.category} | Title: ${r.title} | Download PDF: ${r.link}\n`;
        }
      } else if (isRegQuery) {
        // Explicitly tell AI there are no links in DB
        context += `\n--- NO REGULATION DOCUMENTS FOUND IN DATABASE ---\nTell user to visit: https://jntugvcev.edu.in/academics/regulations\n`;
      }

      // 4. Semantic / Fuzzy Search on notices
      const allNotices = await db.select().from(notices);
      const matchedNotices = allNotices.filter((n) => {
        const searchableText = `${n.title} ${n.tag}`.toLowerCase();
        return terms.some((term) => searchableText.includes(term));
      });

      if (matchedNotices.length > 0) {
        context += `\n--- Matching Announcements / Notices ---\n`;
        for (const n of matchedNotices.slice(0, 8)) {
          context += `[Date: ${n.date}] [Category: ${n.tag}] Title: ${n.title}\n`;
        }
      }

      // Fallback / Defaults: If search yielded absolutely zero database rows, pre-load Principal and General College Info
      if (!context.trim()) {
        const principal = allLeaders.find((l) => l.slug === "principal");
        if (principal) {
          context += `\n--- Principal Info (General Fallback) ---\n[Role: ${principal.designation}] Name: ${principal.name}\nEmail: ${principal.email}\nProfile: ${principal.profile}\nMessage: ${principal.message}\n`;
        }
        const generalContent = allContent.filter((c) => c.page === "institution");
        context += `\n--- College Info (General Fallback) ---\n`;
        for (const c of generalContent) {
          context += `Title: ${c.title}\nContent: ${c.content}\n`;
        }
      }

      const SYSTEM_PROMPT = `You are "JNTU AI", a smart, friendly, engaging, and professional AI assistant for the JNTU-GV CEV college website. Your role is to help students, faculty, parents, and visitors with accurate information about the college.

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

CRITICAL RULES FOR LINKS:
- ONLY provide download links that are explicitly present in the RETRIEVED DATABASE CONTEXT below.
- If the RETRIEVED DATABASE CONTEXT contains a PDF link for the requested regulation, provide it exactly as given.
- If NO link is found in the context, say: "I don't have the direct download link right now, but you can find it at the Academics → Regulations section on our website: https://jntugvcev.edu.in/academics/regulations"
- NEVER invent, guess, or fabricate any URL. Only use URLs from the database context.`;

      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) {
        console.error("GROQ_API_KEY is not defined in the environment.");
        return { reply: "I am JNTU AI, but my AI system is currently missing its access key. Please check back shortly! 😊" };
      }

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
              content: `${SYSTEM_PROMPT}\n\nRETRIEVED DATABASE CONTEXT:\n${context.trim()}`,
            },
            ...data.messages,
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Groq API error response:", errText);
        throw new Error("Failed to get completion from Groq API");
      }

      const resData = await response.json();
      const reply =
        resData.choices?.[0]?.message?.content ||
        "I'm sorry, I encountered an issue processing that. Please try again! 😊";

      return { reply };
    } catch (err) {
      console.error("Chatbot query failed:", err);
      // Attempt a fallback LLM call without DB context so the user still gets a useful answer
      try {
        const apiKey = process.env.GROQ_API_KEY;
        if (apiKey) {
          const fallbackResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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
                  content: `You are "JNTU AI", a friendly and professional AI assistant for JNTU-GV CEV college. Answer questions helpfully using your general knowledge about Indian engineering colleges and JNTUK. Be warm, concise, and use light emojis occasionally.`,
                },
                ...data.messages,
              ],
              temperature: 0.7,
            }),
          });
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            const reply = fallbackData.choices?.[0]?.message?.content;
            if (reply) return { reply };
          }
        }
      } catch {
        // ignore fallback error
      }
      return { reply: "Oops! Something went wrong on my end. Please try again in a moment! 😊" };
    }
  });


