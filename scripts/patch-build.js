import fs from "node:fs";
import path from "node:path";

function patchFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, "utf-8");
  let modified = false;

  // 1. Replace server$1 object definition if present
  const patchedServer1 = content.replace(
    /const server\$1\s*=\s*\/\* @__PURE__ \*\/ Object\.freeze\([\s\S]*?Symbol\.toStringTag,\s*\{\s*value:\s*"Module"\s*\}\s*\)\);/g,
    "const server$1 = {};"
  );
  if (patchedServer1 !== content) {
    content = patchedServer1;
    modified = true;
  }

  // 2. Replace shorthand references if present in object literals or exports
  const patchedRefs = content
    .replace(/createRequestHandler,/g, "createRequestHandler: undefined,")
    .replace(/transformPipeableStreamWithRouter,/g, "transformPipeableStreamWithRouter: undefined,")
    .replace(/transformReadableStreamWithRouter,/g, "transformReadableStreamWithRouter: undefined,");

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
