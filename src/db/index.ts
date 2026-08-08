import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

// For query purposes with 15s connect timeout to allow serverless Neon cold starts to wake up successfully
const client = postgres(connectionString, {
  connect_timeout: 15,
});
export const db = drizzle(client, { schema });
