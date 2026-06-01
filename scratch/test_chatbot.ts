import "dotenv/config";
import { db } from "../src/db";
import { siteContent, notices, academicRegulations, leadership } from "../src/db/schema";
import { eq, desc } from "drizzle-orm";


async function test() {
  console.log("=== Testing Database Queries ===");
  try {
    const allLeaders = await db.select().from(leadership);
    console.log("✅ Leadership Table retrieved count:", allLeaders.length);

    const allContent = await db.select().from(siteContent);
    console.log("✅ SiteContent Table retrieved count:", allContent.length);

    const allRegs = await db.select().from(academicRegulations);
    console.log("✅ Regulations Table retrieved count:", allRegs.length);

    const allNotices = await db.select().from(notices);
    console.log("✅ Notices Table retrieved count:", allNotices.length);

    console.log("\n=== Testing Groq Connection ===");
    const apiKey = process.env.GROQ_API_KEY;
    console.log("API Key loaded (first 10 chars):", apiKey?.substring(0, 10));

    if (!apiKey) {
      console.error("❌ GROQ_API_KEY is missing!");
      return;
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
          { role: "system", content: "You are a test assistant." },
          { role: "user", content: "hi" }
        ],
        temperature: 0.7,
      }),
    });

    console.log("Response status:", response.status, response.statusText);
    const resData = await response.json();
    if (response.ok) {
      console.log("✅ Groq answered successfully:", resData.choices?.[0]?.message?.content);
    } else {
      console.error("❌ Groq returned error:", resData);
    }
  } catch (err) {
    console.error("❌ Direct execution error:", err);
  }
}

test().then(() => process.exit(0));
