import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset } from "vitest-mock-extended";
import { beforeEach, vi } from "vitest";
import prisma from "./client";

console.log("Setting up singleton for mocking");

vi.mock("./client.js", () => ({
  __esModule: true,
  default: mockDeep(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

/** @type {import('vitest-mock-extended').DeepMockProxy<PrismaClient>} */
export const prismaMock = prisma;
