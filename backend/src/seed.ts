import bcrypt from "bcryptjs";
import { prisma } from "./lib/prisma";

const users = [
  {
    name: "Admin User",
    email: "admin@fundsroom.com",
    password: "Admin@123",
    role: "ADMIN" as const,
  },
  {
    name: "Sales User",
    email: "sales@fundsroom.com",
    password: "Sales@123",
    role: "SALES" as const,
  },
  {
    name: "Warehouse User",
    email: "warehouse@fundsroom.com",
    password: "Warehouse@123",
    role: "WAREHOUSE" as const,
  },
  {
    name: "Accounts User",
    email: "accounts@fundsroom.com",
    password: "Accounts@123",
    role: "ACCOUNTS" as const,
  },
];

async function main() {
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        password: hashedPassword,
        role: user.role,
      },
      create: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role,
      },
    });
  }

  console.log("All test users created successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });