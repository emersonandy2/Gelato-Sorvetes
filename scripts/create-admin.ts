import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

async function main() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });
  const prisma = new PrismaClient({ adapter });

  const email = "emersonbataguassu@gmail.com";
  const name = "EmersonAndy";
  const password = "356841";
  const role = "admin";

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: { name, password: hashedPassword, role },
    create: { email, name, password: hashedPassword, role },
  });

  console.log(`Admin created/updated: ${admin.email} (${admin.name})`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
