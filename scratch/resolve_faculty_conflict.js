import fs from 'fs';

const filePath = 'd:/jntugv/JNTU-REDESIGN/src/routes/academics/faculty.tsx';
const content = fs.readFileSync(filePath, 'utf-8');
const separator = content.split('\r\n').length > 1 ? '\r\n' : '\n';
const lines = content.split(separator);

console.log(`Original lines count: ${lines.length}`);

let startIdx = -1;
let endIdx = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('{/* Tab Contents */}') && startIdx === -1) {
    startIdx = i;
  }
  if (lines[i].includes('>>>>>>> origin/main') && endIdx === -1) {
    endIdx = i;
  }
}

console.log(`Found startIdx: ${startIdx} (Line ${startIdx + 1}): "${lines[startIdx]}"`);
console.log(`Found endIdx: ${endIdx} (Line ${endIdx + 1}): "${lines[endIdx]}"`);

if (startIdx !== -1 && endIdx !== -1 && startIdx < endIdx) {
  // Delete lines from startIdx to endIdx (inclusive)
  lines.splice(startIdx, endIdx - startIdx + 1);
  console.log(`New lines count: ${lines.length}`);
  
  fs.writeFileSync(filePath, lines.join(separator), 'utf-8');
  console.log('Successfully resolved conflict block dynamically!');
} else {
  console.error('Indices not found or invalid, aborting!');
}
