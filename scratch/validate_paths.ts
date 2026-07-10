import postgres from "postgres";

const connectionString = "postgresql://neondb_owner:npg_VumPW7fSI0JO@ep-lingering-mountain-aom9cqy0-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function main() {
  const sql = postgres(connectionString);

  try {
    const tablesAndCols = [
      { table: "hostel_content", idCol: "id", imgCol: "officer_image" },
      { table: "hostel_images", idCol: "id", imgCol: "url" },
      { table: "dispensary_content", idCol: "id", imgCol: "img" },
      { table: "dispensary_people", idCol: "id", imgCol: "img" },
      { table: "dispensary_images", idCol: "id", imgCol: "url" },
      { table: "sports_content", idCol: "id", imgCol: "img" },
      { table: "sports_images", idCol: "id", imgCol: "url" },
      { table: "library_content", idCol: "id", imgCol: "img" },
      { table: "library_images", idCol: "id", imgCol: "url" },
      { table: "eng_meta", idCol: "id", imgCol: "img" },
      { table: "music_people", idCol: "id", imgCol: "img" },
      { table: "music_images", idCol: "id", imgCol: "url" }
    ];

    for (const { table, idCol, imgCol } of tablesAndCols) {
      console.log(`Checking table ${table}...`);
      // Select all rows
      const rows = await sql`SELECT ${sql(idCol)}, ${sql(imgCol)} FROM ${sql(table)}`;
      for (const row of rows) {
        const val = row[imgCol];
        if (typeof val === "string") {
          const trimmed = val.trim();
          if (trimmed !== val) {
            console.log(`Table ${table} (ID ${row[idCol]}): Trimming value from ${JSON.stringify(val)} to ${JSON.stringify(trimmed)}`);
            await sql`UPDATE ${sql(table)} SET ${sql(imgCol)} = ${trimmed} WHERE ${sql(idCol)} = ${row[idCol]}`;
          } else {
            console.log(`Table ${table} (ID ${row[idCol]}): ${JSON.stringify(val)} (already clean)`);
          }
        }
      }
    }
  } catch (err) {
    console.error("Error running DB validation:", err);
  } finally {
    await sql.end();
  }
}

main();
