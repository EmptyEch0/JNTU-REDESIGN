import fs from 'fs';

const html = fs.readFileSync('scratch/students_2019_2020.html', 'utf-8');

const rows = html.match(/<tr>(.*?)<\/tr>/gs);

const students = [];

for (const row of rows) {
    const cells = row.match(/<div class="mtr-cell-content">(.*?)<\/div>/gs);
    if (!cells || cells.length < 7) continue;

    let name = cells[1].replace(/<[^>]*>/g, '').trim();
    let rollNo = cells[2].replace(/<[^>]*>/g, '').trim();
    let branch = cells[3].replace(/<[^>]*>/g, '').trim();
    let year = cells[4].replace(/<[^>]*>/g, '').trim();
    let campusType = cells[5].replace(/<[^>]*>/g, '').trim();
    let company = cells[6].replace(/<[^>]*>/g, '').trim();

    // Clean up special characters
    company = company.replace(/–/g, '-').replace(/—/g, '-').replace(/[^\x00-\x7F]/g, '');

    if (name === 'Student Name' || !rollNo) continue;

    students.push({ name, rollNo, branch, year, campusType, company });
}

// Merge duplicates by rollNo
const mergedStudents = {};

for (const s of students) {
    if (mergedStudents[s.rollNo]) {
        // Merge companies
        const existingCompanies = mergedStudents[s.rollNo].company.split(', ').map(c => c.trim());
        if (!existingCompanies.includes(s.company)) {
            mergedStudents[s.rollNo].company += `, ${s.company}`;
        }
    } else {
        mergedStudents[s.rollNo] = s;
    }
}

const finalStudents = Object.values(mergedStudents);

fs.writeFileSync('scratch/students_2019_2020.json', JSON.stringify(finalStudents, null, 2), 'utf-8');
console.log(`Unique students: ${finalStudents.length}`);
