import fs from "node:fs";
import path from "node:path";

function patchFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, "utf-8");
  let modified = false;

  // Replace missing tree-shaken identifier references with undefined inside object literals
    const patchedRefs = content
    .replace(/(?<![\w$])(?<!as )createRequestHandler(?=,|\s*\n)/g, "createRequestHandler: undefined")
    .replace(/(?<![\w$])(?<!as )transformPipeableStreamWithRouter(?=,|\s*\n)/g, "transformPipeableStreamWithRouter: undefined")
    .replace(/(?<![\w$])(?<!as )transformReadableStreamWithRouter(?=,|\s*\n)/g, "transformReadableStreamWithRouter: undefined");
  if (patchedRefs !== content) {
    content = patchedRefs;
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, "utf-8");
    console.log(`✓ Successfully patched ${path.relative(process.cwd(), filePath)}`);
  }
}

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith(".mjs") || entry.name.endsWith(".js"))) {
      patchFile(fullPath);
    }
  }
}

const serverDir = path.resolve("dist/server");
if (fs.existsSync(serverDir)) {
  scanDir(serverDir);
} else {
  console.log("! dist/server directory not found");
}
