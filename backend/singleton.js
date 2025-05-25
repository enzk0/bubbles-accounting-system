import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset } from "vitest-mock-extended";
import { beforeEach, vi } from "vitest";
import prisma, { custom } from "./client";

console.log("Setting up singleton for mocking");

vi.mock("./client.js", () => ({
    __esModule: true,
    custom: mockDeep(),
    prisma: mockDeep(),
    default: mockDeep(),
}));

beforeEach(() => {
    mockReset(prismaMock);
    mockReset(customMock);
});

/** @type {import('vitest-mock-extended').DeepMockProxy<PrismaClient>} */
const prismaMock = prisma;

/** @type {import('vitest-mock-extended').DeepMockProxy<PrismaClient>} */
const customMock = custom;

export { prismaMock, customMock };
