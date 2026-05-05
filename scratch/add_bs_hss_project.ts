import { db } from '../src/db/index';
import { rdProjects, rdDepartments } from '../src/db/schema';
import { eq, and } from 'drizzle-orm';

async function main() {
  const deptName = "Department of BS & HSS";
  const dept = await db.query.rdDepartments.findFirst({
    where: eq(rdDepartments.name, deptName)
  });

  if (!dept) {
    console.error("Department not found");
    process.exit(1);
  }

  const projectDetails = {
    deptId: dept.id,
    title: "Diagnosis of ovarian cancer using decision tree classification of trace elemental data obtained by applying ion beam analysis",
    pi: "Dr. G. J. Naga Raju (Young Scientist)",
    agency: "Department of Science and Technology (DST), New Delhi, Govt. of India (DST SR/FTP/PS-139/2011)",
    amount: "Rs. 21.84 L",
    period: "11-12-2013 to 11-12-2016",
    status: "Completed"
  };

  // Check if it already exists to avoid duplication
  const existing = await db.query.rdProjects.findFirst({
    where: and(
      eq(rdProjects.deptId, dept.id),
      eq(rdProjects.title, projectDetails.title)
    )
  });

  if (existing) {
    console.log("Updating existing project...");
    await db.update(rdProjects).set(projectDetails).where(eq(rdProjects.id, existing.id));
  } else {
    console.log("Adding new project...");
    await db.insert(rdProjects).values(projectDetails);
  }

  console.log("✅ Project synchronized successfully!");
  process.exit(0);
}

main().catch(console.error);
