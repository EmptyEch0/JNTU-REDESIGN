import { queryChatbot } from "../src/funcs/site.server";

async function main() {
  console.log("Testing chatbot handler...");
  const result = await queryChatbot({
    data: {
      messages: [
        { role: "user", content: "who is the principal?" }
      ]
    }
  });
  console.log("\nChatbot reply:", result.reply);
  process.exit(0);
}

main().catch(console.error);
