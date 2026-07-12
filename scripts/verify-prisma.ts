import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });
  const prisma = new PrismaClient({ adapter });

  const count = await prisma.category.count();
  console.log(`Categories in database: ${count}`);

  await prisma.$disconnect();
  console.log("✅ Connected");
}

main().catch((e) => {
  console.error("❌ Verification failed:", e.message);
  process.exit(1);
});
