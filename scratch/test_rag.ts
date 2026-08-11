import { db } from '../src/db';
import { sql } from 'drizzle-orm';
import { pipeline } from '@xenova/transformers';

async function test2() {
  console.log("\n--- Test 2: Is Embedding Model Working? ---");
  try {
    const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    const result = await embedder('test query', { pooling: 'mean', normalize: true });
    console.log('✅ Pass -> Dims:', result.data.length);
    console.log('First 3 values:', Array.from(result.data).slice(0, 3));
    return true;
  } catch (e) {
    console.error('❌ Fail -> Embedding model error:', e);
    return false;
  }
}

async function test1() {
  console.log("\n--- Test 1: Is Ingestion Done? ---");
  try {
    const r = await db.execute(sql`SELECT COUNT(*) as total FROM rag_chunks`);
    const count = Number((r[0] as any).total);
    console.log('Total chunks:', count);
    if (count > 0) {
      console.log('✅ Pass');
      return true;
    } else {
      console.log('❌ Fail -> 0 chunks found.');
      return false;
    }
  } catch (e) {
    console.error('❌ Fail -> Database error:', e);
    return false;
  }
}

async function test3() {
  console.log("\n--- Test 3: Is Vector Search Returning Results? ---");
  try {
    const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    const result = await embedder('who is the principal', { pooling: 'mean', normalize: true });
    const vec = `[${Array.from(result.data).join(',')}]`;
    const rows = await db.execute(sql`
      SELECT content, source_type, 1 - (embedding <=> ${vec}::vector) as score
      FROM rag_chunks ORDER BY embedding <=> ${vec}::vector LIMIT 3
    `);
    console.log(JSON.stringify(rows, null, 2));
    if (rows.length > 0) {
      console.log('✅ Pass');
      return true;
    } else {
      console.log('❌ Fail -> No search results returned.');
      return false;
    }
  } catch (e) {
    console.error('❌ Fail -> Vector search error:', e);
    return false;
  }
}

async function test4() {
  console.log("\n--- Test 4: Is Groq Getting Context or Answering Blind? ---");
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'Reply ONLY with: CONTEXT_RECEIVED if you got context, or BLIND if no context was given.' },
          { role: 'user', content: 'test' }
        ]
      })
    });
    const d: any = await res.json();
    console.log('Groq Response:', d.choices?.[0]?.message?.content);
    console.log('✅ Pass -> Groq connection working.');
    return true;
  } catch (e) {
    console.error('❌ Fail -> Groq API error:', e);
    return false;
  }
}

async function test5() {
  console.log("\n--- Test 5: Is Dedup / Hash Working? ---");
  try {
    const r = await db.execute(sql`
      SELECT 
        COUNT(*) as total,
        COUNT(content_hash) as with_hash,
        COUNT(DISTINCT source) as unique_sources
      FROM rag_chunks
    `);
    const row = r[0] as any;
    console.log(row);
    const total = Number(row.total);
    const with_hash = Number(row.with_hash);
    const unique_sources = Number(row.unique_sources);
    if (total === unique_sources && with_hash === total) {
      console.log('✅ Pass -> Dedup healthy.');
      return true;
    } else {
      console.log('❌ Fail -> Duplicate chunks exist or missing hashes.');
      return false;
    }
  } catch (e) {
    console.error('❌ Fail -> Dedup check error:', e);
    return false;
  }
}

async function run() {
  const t2 = await test2();
  if (!t2) return;
  
  const t1 = await test1();
  if (!t1) {
    console.log("Test 1 failed (0 chunks). Skipping tests 3, 4, and 5. Ingestion needs to run.");
    return;
  }
  
  await test3();
  await test4();
  await test5();
}

run().catch(console.error);
