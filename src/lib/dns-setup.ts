import dns from "dns";

try {
  // Use Cloudflare and Google public DNS resolvers which are highly reliable
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
  console.log("DNS Setup: Google & Cloudflare DNS resolvers configured for Node process.");
} catch (err) {
  console.warn("DNS Setup: Failed to set custom DNS servers:", err);
}
