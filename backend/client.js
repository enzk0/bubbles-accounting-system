import { PrismaClient } from "@prisma/client";

const databaseUrl =
  process.env.ENVIRONMENT === "testing"
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

export default prisma;
