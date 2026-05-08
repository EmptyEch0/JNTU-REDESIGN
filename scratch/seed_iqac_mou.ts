import "dotenv/config";
import { db } from "../src/db/index";
import { iqacMous } from "../src/db/schema";

async function main() {
  console.log("🚀 Seeding IQAC MOU...");

  await db.delete(iqacMous);
  
  await db.insert(iqacMous).values({
    title: "MOU with NAT SOFT CORPORATION",
    description: "JNTU University College of Engineering Vizianagaram (JNTUK-UCEV) and Natsoft Corporation have collaborated to set up a Blockchain Center of Excellence (BCoE) to develop skills, create and deliver innovative solutions related to blockchain and its associated digital technologies.\n\nThe MOU partnership intends to set up a center for carrying out any innovation or development of blockchain and its associated technology solutions for the government and private enterprises.\n\nNATSOFT CORPORATION and JNTUK-UCEV will work together in Blockchain and associated emerging technologies to augment the skills and capabilities of the associated faculty members, researchers and students through appropriate learning programs and involvement in projects.\n\nBCoE encourages interactions with the industry and government agencies on key issues faced and to design suitable innovate solutions to address them through Blockchain and associate technologies. The Center will also explore opportunities to offer internships to relevant qualified UCEV students on various blockchain solutions and projects.",
    image: "https://jntugvcev.edu.in/wp-content/uploads/2020/09/mou.jpg"
  });

  console.log("✅ IQAC MOU seeded.");
  process.exit(0);
}

main().catch(console.error);
