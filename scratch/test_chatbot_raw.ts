import { db } from "../src/db/index";
import { sql } from "drizzle-orm";

async function main() {
  const query = "who is the principal?";

  // 1. Embed the user query
  console.log("Embedding query...");
  const { pipeline } = await import("@xenova/transformers");
  const embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  const result = await embedder(query, { pooling: "mean", normalize: true });
  const vector = Array.from(result.data as number[]);
  const vectorStr = `[${vector.join(",")}]`;

  // 2. Semantic search
  console.log("Executing vector search...");
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
    rows;

  const context = sorted.map((r: any) => r.content).join("\n\n") + extraContext;

  console.log("\n=== RAG DEBUG ===");
  console.log("Query:", query);
  console.log("Chunks found:", (chunks as any[]).length);
  console.log("Context length:", context.length);
  console.log("Top chunk:", (chunks as any[])[0]?.content?.slice(0, 100));
  console.log("=================");

  // 3. Call Groq with context
  console.log("\nCalling Groq API...");
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
          content: `Test system prompt\n\nRETRIEVED CONTEXT:\n${context || "No specific data found."}`,
        },
        { role: "user", content: query }
      ],
      temperature: 0.7,
    }),
  });

  const resData = await response.json();
  console.log("Reply:", resData.choices?.[0]?.message?.content);
  process.exit(0);
}

main().catch(console.error);
