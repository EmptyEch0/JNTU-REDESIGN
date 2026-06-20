import fs from "fs";
import { config } from "dotenv";
config({ path: ".env" });
import { db } from "../src/db/index";
import { students } from "../src/db/schema";

async function main() {
  const rawData = fs.readFileSync("scratch/students_raw_2018.txt", "utf-8");
  const lines = rawData.split(/\r?\n/);
  
  const parsedStudents = [];
  
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) {
      i++;
      continue;
    }
    
    // Check if line is a number (S.No)
    if (/^\d+$/.test(line)) {
      // It's the start of a record.
      const sNo = line;
      const name = lines[i+1]?.trim() || "Unknown";
      let rollNo = lines[i+2]?.trim();
      let branch = lines[i+3]?.trim() || "Unknown";
      let year = lines[i+4]?.trim() || "Unknown";
      let campusType = lines[i+5]?.trim() || "Unknown";
      let company = lines[i+6]?.trim() || "Unknown";
      
      // Handle the case where Roll No is missing (like student 227)
      if (rollNo === "") {
        rollNo = `Unknown-${sNo}`; // generate dummy roll
      }
      
      parsedStudents.push({
        name,
        rollNo,
        branch,
        year,
        campusType,
        company
      });
      
      i += 7; // advance 7 lines
    } else {
      i++;
    }
  }

  console.log(`Parsed ${parsedStudents.length} students. Example:`, parsedStudents[0]);
  
  // Since rollNo must be unique, check for duplicates
  const uniqueRollNos = new Set();
  const finalStudents = [];
  for (const s of parsedStudents) {
    if (uniqueRollNos.has(s.rollNo)) {
      console.log(`Duplicate Roll No found: ${s.rollNo} for ${s.name}. Making it unique.`);
      s.rollNo = `${s.rollNo}-dup-${Math.floor(Math.random()*1000)}`;
    }
    uniqueRollNos.add(s.rollNo);
    finalStudents.push(s);
  }

  try {
    console.log("Inserting into database...");
    await db.insert(students).values(finalStudents).onConflictDoNothing();
    console.log("Inserted successfully!");
  } catch (err) {
    console.error("Failed to insert:", err);
  }
  
  process.exit(0);
}

main().catch(console.error);
