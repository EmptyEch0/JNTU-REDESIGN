import fs from "node:fs";
import path from "node:path";

const ssrIndexPath = path.resolve("dist/server/_ssr/index.mjs");

if (fs.existsSync(ssrIndexPath)) {
  let content = fs.readFileSync(ssrIndexPath, "utf-8");
  // Replace buggy unused server$1 object definition containing tree-shaken references
  const patched = content.replace(
    /const server\$1\s*=\s*\/\* @__PURE__ \*\/ Object\.freeze\([\s\S]*?Symbol\.toStringTag,\s*\{\s*value:\s*"Module"\s*\}\s*\)\);/g,
    "const server$1 = {};"
  );
  if (patched !== content) {
    fs.writeFileSync(ssrIndexPath, patched, "utf-8");
    console.log("✓ Successfully patched dist/server/_ssr/index.mjs");
  } else {
    console.log("• dist/server/_ssr/index.mjs already patched or pattern not found");
  }
} else {
  console.log("! dist/server/_ssr/index.mjs not found");
}
