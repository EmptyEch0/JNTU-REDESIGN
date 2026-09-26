import fs from "node:fs";
import path from "node:path";

const dirs = [
  "public/images/faculty/civil",
  "public/images/faculty/mech",
  "public/images/faculty/ece",
  "public/images/faculty/met",
  "public/uploads/departments/faculty_photos/ece",
  "public/uploads/departments/faculty_photos/mech",
  "public/uploads/departments/faculty_photos/met",
  "public/uploads/departments/faculty_photos/civil",
];
dirs.forEach((d) => fs.mkdirSync(d, { recursive: true }));

const copyMap = [
  // Civil
  {
    src: "local-assets/uploads/2020/07/CIVIL-1-D.-Jagan-Mohan.jpg",
    dest: "public/images/faculty/civil/CIVIL-1-D.-Jagan-Mohan.jpg",
  },
  {
    src: "local-assets/uploads/2020/07/CIVIL-2-R.-Balamurali-krishna.jpg",
    dest: "public/images/faculty/civil/CIVIL-2-R.-Balamurali-krishna.jpg",
  },
  {
    src: "local-assets/uploads/2020/07/CIVIL-4-Ch.Giridhar-Kumar.jpg",
    dest: "public/images/faculty/civil/CIVIL-4-Ch.Giridhar-Kumar.jpg",
  },
  {
    src: "local-assets/uploads/2020/07/CIVIL-5-T.S.D.Phanindranath.jpg",
    dest: "public/images/faculty/civil/CIVIL-5-T.S.D.Phanindranath.jpg",
  },
  // Dr. K. Srinivasa Prasad (Mech & Met HOD)
  {
    src: "local-assets/uploads/2020/07/6.Mr_.K.-Srinivasa-Prasad.jpg",
    dest: "public/images/faculty/mech/dr-k-srinivasa-prasad.jpg",
  },
  {
    src: "local-assets/uploads/2020/07/6.Mr_.K.-Srinivasa-Prasad.jpg",
    dest: "public/images/faculty/met/dr-k-srinivasa-prasad.jpg",
  },
  {
    src: "local-assets/uploads/2020/07/6.Mr_.K.-Srinivasa-Prasad.jpg",
    dest: "public/images/faculty/mech/dr--k--srinivasa-prasad.jpg",
  },
  // Dr. G. Appala Naidu (ECE & Civil HOD)
  {
    src: "local-assets/uploads/2020/07/ECE-6-G.Appalanaidu.jpg",
    dest: "public/images/faculty/ece/dr-g-appala-naidu.jpg",
  },
  {
    src: "local-assets/uploads/2020/07/ECE-6-G.Appalanaidu.jpg",
    dest: "public/images/faculty/civil/dr-g-appala-naidu.jpg",
  },
  {
    src: "local-assets/uploads/2020/07/ECE-6-G.Appalanaidu.jpg",
    dest: "public/images/faculty/ece/gottapu-appala-naidu.jpeg",
  },
  {
    src: "local-assets/uploads/2020/07/ECE-6-G.Appalanaidu.jpg",
    dest: "public/images/faculty/ece/gottapu-appala-naidu.jpg",
  },
  // Dr. G. Swami Naidu
  {
    src: "local-assets/uploads/2020/07/METAL-1-Dr.-G.Swami-Naidu.jpg",
    dest: "public/images/faculty/mech/dr-g-swami-naidu.jpg",
  },
];

copyMap.forEach((item) => {
  if (fs.existsSync(item.src)) {
    fs.copyFileSync(item.src, item.dest);
    console.log("Copied:", item.src, "->", item.dest);
  } else {
    console.log("Missing src:", item.src);
  }
});
