import fs from 'fs';
const content = fs.readFileSync('d:/jntugv/JNTU-REDESIGN/src/db/schema.ts', 'utf-8');
const regex = /export const (\w+) = pgTable/g;
let match;
while ((match = regex.exec(content)) !== null) {
  console.log(match[1]);
}
