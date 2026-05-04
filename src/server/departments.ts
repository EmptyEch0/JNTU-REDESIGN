import { createServerFn } from "@tanstack/react-start";
import { sql } from "@/lib/db";

export type Department = {
  id: number;
  name: string;
  hod: string;
  description: string;
  image: string;
};

export const getDepartments = createServerFn({ method: "GET" }).handler(async () => {
  const rows = await sql<Department[]>`
    SELECT id, name, hod, description, image
    FROM departments
    ORDER BY name ASC
  `;

  return rows;
});
