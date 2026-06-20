async function run() {
  const res = await fetch("http://localhost:8080/src/auth/auth.server.ts");
  const text = await res.text();
  console.log("Response starts with:");
  console.log(text.split("\n").slice(0, 50).join("\n"));
}
run();
