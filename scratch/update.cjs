const fs = require('fs');
const path = 'c:/Desktop/projects/JNTU-REDESIGN/src/routes/academics/admissions.tsx';
let content = fs.readFileSync(path, 'utf8');

const startMarker = '{/* Guidelines Selection Column */}';
const endMarker = '{/* Detailed Guidelines for Active Tab */}';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    let newContent = content.substring(0, startIndex) + content.substring(endIndex);
    
    newContent = newContent.replace('<div className="grid lg:grid-cols-3 gap-8">', '<div>');
    newContent = newContent.replace('<div className="lg:col-span-2 space-y-6">', '<div className="space-y-6">');

    fs.writeFileSync(path, newContent);
    console.log('Success');
} else {
    console.log('Failed to find markers');
}
