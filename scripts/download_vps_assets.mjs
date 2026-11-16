import fs from "node:fs";
import path from "node:path";
import http from "node:http";

const urls = [
  // NIRF Documents
  "http://89.116.134.182:8080/wp-content/uploads/2021/02/NIRF2021_JNTUK-University-College-of-Engineering-Vizianagaram.pdf",
  "http://89.116.134.182:8080/wp-content/uploads/2016/12/University-College-of-Engineering20200214-.pdf",
  "http://89.116.134.182:8080/wp-content/uploads/2016/12/All-Report-MHRD-National-Institutional-Ranking-Framework-NIRF-O.pdf",
  "http://89.116.134.182:8080/wp-content/uploads/2016/12/All-Report-MHRD-National-Institutional-Ranking-Framework-NIRF.pdf",
  "http://89.116.134.182:8080/wp-content/uploads/2017/01/NIRF-2017-Documents-Set-Final.zip",
  "http://89.116.134.182:8080/wp-content/uploads/2022/03/NIRF2022_JNTUK-University-College-of-Engineering-Vizianagaram.pdf",
  "http://89.116.134.182:8080/wp-content/uploads/2026/04/NIRF-DCS-REPORT-JNTU-GV-COLLEGE-OF-ENGINEERING-VIZIANAGARAM-A-2026.pdf",

  // AICTE Documents
  "http://89.116.134.182:8080/wp-content/uploads/2024/07/Three-Year-Approval-Letter-2024-2025.pdf",
  "http://89.116.134.182:8080/wp-content/uploads/2024/06/EOA-Report-2024-2025.pdf",
  "http://89.116.134.182:8080/wp-content/uploads/2023/05/EOA-Report-2023-24.pdf",
  "http://89.116.134.182:8080/wp-content/uploads/2022/07/EOA-Report-22-23.pdf",
  "http://89.116.134.182:8080/wp-content/uploads/2021/07/EOA-Report_21-22.pdf",
  "http://89.116.134.182:8080/wp-content/uploads/2017/02/EOA_Report-2020-21.pdf",
  "http://89.116.134.182:8080/wp-content/uploads/2017/02/EOA-Report-2019-20.pdf",
  "http://89.116.134.182:8080/wp-content/uploads/2017/02/EOA-Report-2018-19.pdf",
  "http://89.116.134.182:8080/wp-content/uploads/2017/02/EOA-Report-2017-18.pdf",
  "http://89.116.134.182:8080/wp-content/uploads/2017/02/EOA-Report-2016-17-1.pdf",
  "http://89.116.134.182:8080/wp-content/uploads/2017/02/EOA-Report-2015-16-1.pdf",
  "http://89.116.134.182:8080/wp-content/uploads/2017/02/Letter-Of-Approval-2014-15-1.pdf",
  "http://89.116.134.182:8080/wp-content/uploads/2017/02/Students-Grievance-Appeal-Monitoring-Cell.pdf",
];

function downloadFile(url) {
  return new Promise((resolve, reject) => {
    // Extract path after /wp-content/uploads/
    const match = url.match(/\/wp-content\/uploads\/(.+)$/);
    if (!match) {
      return reject(new Error("Cannot parse URL: " + url));
    }
    const relPath = match[1];

    const targetPaths = [
      path.join(process.cwd(), "local-assets", "uploads", relPath),
      path.join(process.cwd(), "public", "local-assets", "uploads", relPath),
    ];

    for (const targetPath of targetPaths) {
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    }

    const req = http.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed with status ${res.statusCode} for ${url}`));
      }

      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        const buffer = Buffer.concat(chunks);
        for (const targetPath of targetPaths) {
          fs.writeFileSync(targetPath, buffer);
        }
        console.log(`✅ Downloaded [${buffer.length} bytes] -> ${relPath}`);
        resolve({ relPath, size: buffer.length });
      });
    });

    req.on("error", (err) => reject(err));
  });
}

async function main() {
  console.log(`Starting download of ${urls.length} files from VPS...`);
  let successCount = 0;
  for (const url of urls) {
    try {
      await downloadFile(url);
      successCount++;
    } catch (err) {
      console.error(`❌ Error downloading ${url}:`, err.message);
    }
  }
  console.log(`\nDownload completed: ${successCount} / ${urls.length} files successfully saved.`);
}

main();
