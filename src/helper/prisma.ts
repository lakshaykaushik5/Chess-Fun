import { PrismaClient } from "@prisma/client";
// import { withAccelerate } from "@prisma/extension-accelerate";

declare global {
  var prisma: PrismaClient | undefined;
}

// Create an extended Prisma client
const prismaClient = new PrismaClient()

// Explicitly define `prisma` to match the extended type
const prisma: PrismaClient = global.prisma ?? prismaClient;

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
