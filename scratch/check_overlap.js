import fs from 'fs';

function parseHtml(path) {
    const html = fs.readFileSync(path, 'utf-8');
    const rows = html.match(/<tr>(.*?)<\/tr>/gs);
    const students = [];
    for (const row of rows) {
        const cells = row.match(/<div class="mtr-cell-content">(.*?)<\/div>/gs);
        if (!cells || cells.length < 7) continue;
        const name = cells[1].replace(/<[^>]*>/g, '').trim();
        const rollNo = cells[2].replace(/<[^>]*>/g, '').trim();
        if (name === 'Student Name' || !rollNo) continue;
        students.push(rollNo);
    }
    return new Set(students);
}

const s1 = parseHtml('scratch/students.html');
const s2 = parseHtml('scratch/students_2019_2020.html');

const overlap = [...s1].filter(r => s2.has(r));
console.log('Overlap:', overlap);
