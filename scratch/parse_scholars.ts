import { db } from "../src/db/index";
import { rdScholars, rdDepartments } from "../src/db/schema";
import fs from "fs";

async function run() {
  const depts = await db.select().from(rdDepartments);
  const deptMap: Record<string, number> = {
    "Computer Science and Engineering": depts.find(d => d.name.includes("Computer Science"))!.id,
    "Electronics and Communication Engineering": depts.find(d => d.name.includes("Electronics & Communication"))!.id,
    "Mechanical Engineering": depts.find(d => d.name.includes("Mechanical"))!.id,
    "Information Technology": depts.find(d => d.name.includes("Information Technology"))!.id,
    "BS & HSS": depts.find(d => d.name.includes("BS & HSS"))!.id,
    "EEE": depts.find(d => d.name.includes("Electrical & Electronics"))!.id,
  };

  const rawData = fs.readFileSync("scratch/scholars_raw.txt", "utf-8");
  
  // Custom parsing logic to handle the user's copy-pasted format
  // For each department, we find the section
  // Then we parse the rows.
  
  let currentDeptId = -1;
  const lines = rawData.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  const scholarsToInsert: any[] = [];
  
  // We'll use a state machine to parse the rows
  let state = 'SCANNING';
  let tempRecord: any = {};
  let fieldIndex = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for department headers
    if (line.includes("Department of Computer Science")) { currentDeptId = deptMap["Computer Science and Engineering"]; state = 'HEADER'; continue; }
    if (line.includes("Department of Electronics and Communication Engineering")) { currentDeptId = deptMap["Electronics and Communication Engineering"]; state = 'HEADER'; continue; }
    if (line.includes("Department of Mechanical Engineering")) { currentDeptId = deptMap["Mechanical Engineering"]; state = 'HEADER'; continue; }
    if (line.includes("Department of Information Technology")) { currentDeptId = deptMap["Information Technology"]; state = 'HEADER'; continue; }
    if (line.includes("Department of BS & HSS")) { currentDeptId = deptMap["BS & HSS"]; state = 'HEADER'; continue; }
    if (line.includes("Department of EEE")) { currentDeptId = deptMap["EEE"]; state = 'HEADER'; continue; }
    
    if (state === 'HEADER') {
      if (line.match(/^S\.?\s*No/i)) {
         // skip header lines
         while(i + 1 < lines.length && !lines[i+1].match(/^\d+\.?$/)) {
           i++;
         }
         state = 'ROWS';
      }
      continue;
    }
    
    if (state === 'ROWS') {
      // If line is a number (S.No)
      if (line.match(/^\d+\.?$/)) {
        // Save previous record
        if (tempRecord.scholarName) {
           scholarsToInsert.push({ ...tempRecord, deptId: currentDeptId });
        }
        tempRecord = {};
        fieldIndex = 0;
        continue;
      }
      
      // We read fields sequentially: 
      // Name, Roll Number, Title, Supervisor, Status
      // Wait, IT department has: Name, Area, Title, Year, University, Status (6 fields)
      // CS, ECE, Mech, BS, EEE have: Name, Roll Number, Title, Supervisor, Status (5 fields)
      
      // Actually, IT department has:
      // 1. Name
      // 2. Area
      // 3. Title
      // 4. Year
      // 5. University
      // 6. Status
      
      if (currentDeptId === deptMap["Information Technology"]) {
        if (fieldIndex === 0) tempRecord.scholarName = line;
        else if (fieldIndex === 1) tempRecord.rollNo = line; // use area as rollNo for now
        else if (fieldIndex === 2) tempRecord.researchTitle = line;
        else if (fieldIndex === 3) tempRecord.regYear = line;
        else if (fieldIndex === 4) tempRecord.supervisor = line; // use university as supervisor
        else if (fieldIndex === 5) tempRecord.status = line;
      } else {
        if (fieldIndex === 0) tempRecord.scholarName = line;
        else if (fieldIndex === 1) tempRecord.rollNo = line === "-" ? "" : line;
        else if (fieldIndex === 2) tempRecord.researchTitle = line;
        else if (fieldIndex === 3) tempRecord.supervisor = line;
        else if (fieldIndex === 4) tempRecord.status = line;
      }
      
      fieldIndex++;
    }
  }
  
  if (tempRecord.scholarName) {
    scholarsToInsert.push({ ...tempRecord, deptId: currentDeptId });
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
      regYear: s.regYear || "",
    });
  }
  console.log("Done inserting scholars!");
  process.exit(0);
}

run();
