const fs = require('fs');
const path = 'c:/Desktop/projects/JNTU-REDESIGN/src/routes/academics/examination.tsx';
let content = fs.readFileSync(path, 'utf8');

// For Notifications Tab
const notifStartMarker = '{/* Left Side: Search, Form, & Fee Guidelines */}';
const notifEndMarker = '{/* Right Side: Notifications List */}';
const notifStartIndex = content.indexOf(notifStartMarker);
const notifEndIndex = content.indexOf(notifEndMarker);

if (notifStartIndex !== -1 && notifEndIndex !== -1) {
    content = content.substring(0, notifStartIndex) + content.substring(notifEndIndex);
} else {
    console.log("Could not find notifications markers");
}

// For Results Tab
const resultsStartMarker = '{/* Left Side: Search & Check Results Form */}';
const resultsEndMarker = '{/* Right Side: Results List */}';
const resultsStartIndex = content.indexOf(resultsStartMarker);
const resultsEndIndex = content.indexOf(resultsEndMarker);

if (resultsStartIndex !== -1 && resultsEndIndex !== -1) {
    content = content.substring(0, resultsStartIndex) + content.substring(resultsEndIndex);
} else {
    console.log("Could not find results markers");
}

// Replace grid classes
content = content.replaceAll('<div className="grid lg:grid-cols-3 gap-8">', '<div>');
content = content.replaceAll('<div className="lg:col-span-2">', '<div>');

fs.writeFileSync(path, content);
console.log('Success');
