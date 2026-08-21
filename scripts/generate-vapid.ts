import webpush from "web-push";
import fs from "fs";
import path from "path";

const envPath = path.resolve(process.cwd(), ".env");
let envContent = "";
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, "utf-8");
}

if (envContent.includes("VAPID_PUBLIC_KEY") && envContent.includes("VAPID_PRIVATE_KEY")) {
  console.log("VAPID keys already present in .env");
  const pubMatch = envContent.match(/VAPID_PUBLIC_KEY=['"]?([^'"\n\r]+)['"]?/);
  const privMatch = envContent.match(/VAPID_PRIVATE_KEY=['"]?([^'"\n\r]+)['"]?/);
  console.log("Public Key:", pubMatch ? pubMatch[1] : "(not parsed)");
  console.log("Private Key:", privMatch ? privMatch[1] : "(not parsed)");
} else {
  console.log("Generating new VAPID keys...");
  const vapidKeys = webpush.generateVAPIDKeys();

  const toAppend = `
# Web Push Notifications (VAPID)
VAPID_PUBLIC_KEY="${vapidKeys.publicKey}"
VAPID_PRIVATE_KEY="${vapidKeys.privateKey}"
VAPID_SUBJECT="mailto:admin@jntugvcev.edu.in"
VITE_VAPID_PUBLIC_KEY="${vapidKeys.publicKey}"
`;

  fs.appendFileSync(envPath, toAppend);
  console.log("Successfully generated and saved VAPID keys to .env!");
  console.log("Public Key:", vapidKeys.publicKey);
  console.log("Private Key:", vapidKeys.privateKey);
}
