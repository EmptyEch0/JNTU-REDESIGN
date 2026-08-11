import fs from 'fs';
import path from 'path';

const targetFile = 'd:/jntugv/JNTU-REDESIGN/node_modules/onnxruntime-web/dist/ort-web.min.js';

if (fs.existsSync(targetFile)) {
  console.log("Found onnxruntime-web bundle.");
  let content = fs.readFileSync(targetFile, 'utf-8');
  if (content.includes('//# sourceMappingURL=ort-web.min.js.map')) {
    content = content.replace('//# sourceMappingURL=ort-web.min.js.map', '// Removed sourceMappingURL due to malformed onnx sourcemap');
    fs.writeFileSync(targetFile, content, 'utf-8');
    console.log("Successfully removed sourceMappingURL reference!");
  } else {
    console.log("sourceMappingURL is already removed or not found.");
  }
} else {
  console.log("onnxruntime-web bundle file not found at " + targetFile);
}
