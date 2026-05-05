import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlPath = path.join(__dirname, 'students.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const rows = html.match(/<tr>(.*?)<\/tr>/gs);
const students = [];
const studentMap = new Map();

rows.forEach((row, index) => {
    if (index === 0) return; // Header
    const cells = row.match(/<td.*?>(.*?)<\/td>/gs);
    if (!cells || cells.length < 7) return;

    const name = cells[1].replace(/<.*?>/g, '').trim();
    const rollNo = cells[2].replace(/<.*?>/g, '').trim();
    const branch = cells[3].replace(/<.*?>/g, '').trim();
    const year = cells[4].replace(/<.*?>/g, '').trim();
    const campusType = cells[5].replace(/<.*?>/g, '').trim();
    const company = cells[6].replace(/<.*?>/g, '').trim();

    // Check if rollNo is already in studentMap
    if (studentMap.has(rollNo)) {
        const existing = studentMap.get(rollNo);
        // Append company if not already there
        if (!existing.company.includes(company)) {
            existing.company += ", " + company;
        }
    } else {
        const student = { name, rollNo, branch, year, campusType, company };
        students.push(student);
        studentMap.set(rollNo, student);
    }
});

console.log(JSON.stringify(students, null, 2));
