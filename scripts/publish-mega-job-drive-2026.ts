// Adds students placed in the Mega Job Drive-2026 (T&P circular dated 26 Nov 2026) to batch 2026-27.
// Circular lists no roll numbers or per-student company, so roll_no uses the GEN- placeholder convention.
// Usage: npx tsx scripts/publish-mega-job-drive-2026.ts
import "dotenv/config";
import "../src/lib/dns-setup";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { like } from "drizzle-orm";
import { students } from "../src/db/schema";

const YEAR = "2026-27";
const COMPANY = "Mega Job Drive-2026";

// [name, branch] in circular order (S.No. 1–43)
const PLACED: [string, string][] = [
  ["GUNNAM VENKATA JOSH LALITHICK", "MECH"],
  ["P MEGHANA SATYA SAI SUVARCHALA", "MECH"],
  ["GONABOYINA VEERA RAGHAVULU", "MECH"],
  ["SOWMYA MURLA", "MECH"],
  ["MALLUVALASA AARTHI", "MECH"],
  ["B. SANDHYA", "MECH"],
  ["BAKI KEERTHI", "MECH"],
  ["MADELI RAM KISHORE", "MECH"],
  ["KARRI PARIMALASREE", "MECH"],
  ["SOMIREDDI DEVI", "MECH"],
  ["BOLAGANA NARESH", "MECH"],
  ["VANGAPANDU SAMPATH", "MECH"],
  ["SAVARA NITHIN KUMAR", "MECH"],
  ["K. SNIGDHA SAMEERA", "MECH"],
  ["UNDRU THANMAY KISHAN", "MECH"],
  ["ADARI PRAVEEN", "MECH"],
  ["CHITTIRI SRIRAM", "MECH"],
  ["KARRI MADHUSHALINI", "MECH"],
  ["KANDRAKOTA SHRIVATSA PARAVASTHU", "MECH"],
  ["KARRI MADHUSHALINI", "MECH"], // listed twice in the circular (S.No. 18 & 20)
  ["POTNURU BHARATH KUMAR", "MECH"],
  ["VAMMALA UDAYKIRAN", "MECH"],
  ["BANNARAVURI RAJU", "MECH"],
  ["SRIBHASHYAM NAGA VENKATA KRISHNA SREE", "ECE"],
  ["YERIKIREDDY PANDURANGA", "ECE"],
  ["SUDHAGANI JOHN", "ECE"],
  ["KEERTHI PAPPALA", "ECE"],
  ["VETURI SAI KISHOR", "ECE"],
  ["BANALA LAKSHMI TEJASWINI", "ECE"],
  ["MADDU DEEPAK", "ECE"],
  ["NAMABATHULA VIJAY RAJ KUMAR", "ECE-VLSI"],
  ["PRAVALLIKA JALAGADUGULA", "ECE"],
  ["GAVARASANI RAMADEVI", "EEE"],
  ["PIDAKALA HANNA GRACE", "EEE"],
  ["YANDAVA ARAVINDH", "EEE"],
  ["BUNGA SRILAY", "EEE"],
  ["GUMMIDI SAKETH LOVA VENKATA ABHIRAM RAJU", "EEE"],
  ["DARRU SAI SUJITHA", "EEE"],
  ["MENDA BHUVANESWARI", "EEE"],
  ["KODURU SINDHUJA", "ADPS"],
  ["JUVVALA PRANITHA", "EEE"],
  ["MOHAMMAD HABIBUDDIN", "EEE"],
  ["REDDIPALLI SIVA SAI KRISHNA MOHIT", "CSE"],
];

async function main() {
  const client = postgres(process.env.DATABASE_URL!, { connect_timeout: 15, ssl: "prefer" });
  const db = drizzle(client);

  const rows = PLACED.map(([name, branch], i) => ({
    name,
    branch,
    rollNo: `GEN-MJD26-${String(i + 1).padStart(2, "0")}`, // stable → re-runs are no-ops
    year: YEAR,
    campusType: "On Campus",
    company: COMPANY,
  }));

  // Live DB lacks the unique index on roll_no, so dedupe by lookup instead of ON CONFLICT.
  const existing = new Set(
    (await db.select({ r: students.rollNo }).from(students).where(like(students.rollNo, "GEN-MJD26-%"))).map((x) => x.r),
  );
  const fresh = rows.filter((r) => !existing.has(r.rollNo));
  if (fresh.length) await db.insert(students).values(fresh);
  console.log(`inserted ${fresh.length}/${rows.length} into ${YEAR}`);
  await client.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
