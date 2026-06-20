import { db } from "../src/db/index";
import { rdScholars, rdDepartments } from "../src/db/schema";
import fs from "fs";
import { parse } from "csv-parse/sync";

async function run() {
  const depts = await db.select().from(rdDepartments);
  const deptMap: Record<string, number> = {
    "Computer Science Engineering": depts.find(d => d.name.includes("Computer Science"))!.id,
    "Electronics & Communication Engineering": depts.find(d => d.name.includes("Electronics & Communication"))!.id,
    "Mechanical Engineering": depts.find(d => d.name.includes("Mechanical"))!.id,
    "Information Technology": depts.find(d => d.name.includes("Information Technology"))!.id,
    "BS & HSS": depts.find(d => d.name.includes("BS & HSS"))!.id,
    "Electrical & Electronics Engineering": depts.find(d => d.name.includes("Electrical & Electronics"))!.id,
    "Civil Engineering": depts.find(d => d.name.includes("Civil"))!.id,
  };

  const rawData = fs.readFileSync("scratch/scholars_correct.csv", "utf-8");
  const records = parse(rawData, {
    columns: true,
    skip_empty_lines: true,
  });
  
  const scholarsToInsert: any[] = [];
  
  for (const record of records) {
    if (record["Scholar Name"] && record["Scholar Name"] !== "No scholars listed for this department yet.") {
      scholarsToInsert.push({
        deptId: deptMap[record["Department"]],
        scholarName: record["Scholar Name"],
        rollNo: record["Roll Number"] || "",
        supervisor: record["Supervisor"] || "",
        researchTitle: record["Research Title"] || "",
        status: record["Status"] || "",
      });
    }
  }
  
  console.log(`Parsed ${scholarsToInsert.length} scholars. Inserting...`);
  await db.delete(rdScholars);
  for (const s of scholarsToInsert) {
    await db.insert(rdScholars).values({
      deptId: s.deptId,
      scholarName: s.scholarName,
      rollNo: s.rollNo || "",
      researchTitle: s.researchTitle || "",
      supervisor: s.supervisor || "",
      status: s.status || "",
    });
  }
  console.log("Done inserting correct scholars!");
  process.exit(0);
}

run();
