import fs from 'fs';

const files = [
  'd:/jntugv/JNTU-REDESIGN/src/routes/academics/examination.tsx',
  'd:/jntugv/JNTU-REDESIGN/src/routes/academics/faculty.tsx'
];

for (const file of files) {
  console.log(`=== File: ${file} ===`);
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    if (line.includes('<<<<<<<') || line.includes('=======') || line.includes('>>>>>>>')) {
      console.log(`Line ${index + 1}: ${line.trim()}`);
    }
  });
}
