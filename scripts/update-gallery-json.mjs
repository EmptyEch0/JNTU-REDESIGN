import fs from 'fs';
import path from 'path';

const galleryJsonPath = path.resolve('src/data/jntugv-gallery.json');
const valedictoryDir = path.resolve('local-assets/uploads/2026/09/SIH2026');

const files = fs.readdirSync(valedictoryDir).filter(f => f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg') || f.toLowerCase().endsWith('.png'));

// Sort files so Main.JPG is first, followed by P1170... in natural ascending order
files.sort((a, b) => {
  if (a.toLowerCase().startsWith('main')) return -1;
  if (b.toLowerCase().startsWith('main')) return 1;
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
});

console.log(`Found ${files.length} images for SIH2026.`);

const rawExisting = fs.readFileSync(galleryJsonPath, 'utf-8');
let existing = JSON.parse(rawExisting);

// Filter out any existing SIH2026 items if present
existing = existing.filter(item => !(item.file_path && item.file_path.includes('SIH2026')));

const newItems = files.map((filename, index) => {
  const id = 301 + index;
  const filePath = `uploads/2026/09/SIH2026/${filename}`;
  return {
    id,
    date: '2026-09-16',
    title: 'JNTU-GV CEV successfully completed SIH internal hackthon 2026',
    file_path: filePath,
    description: 'JNTU-GV CEV successfully completed SIH internal hackthon 2026',
    submitted: 'University Admin',
    admin_approval: 'accepted',
    carousel_scrolling: 'yes',
    gallery_scrolling: 'yes',
    imglink: filePath
  };
});

const updated = [...newItems, ...existing];
fs.writeFileSync(galleryJsonPath, JSON.stringify(updated, null, 2), 'utf-8');
console.log(`Successfully updated ${galleryJsonPath} with ${newItems.length} new items. Total items: ${updated.length}`);
