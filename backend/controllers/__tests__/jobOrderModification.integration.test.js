import {
  test,
  expect,
  describe,
  beforeAll,
  vi,
} from 'vitest';
import request from "supertest";
import app from "../../index.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("INTEGRATION TEST: jobOrderModification() for admin and employee", () => {
  let branch;
  let jobAdmin, jobEmp1, jobEmp2, jobEmp3;

  beforeAll(async () => {
    // Clean up database with proper order due to FK constraints
    await prisma.jobOrderItem.deleteMany();
    await prisma.jobOrder.deleteMany();
    await prisma.branch.deleteMany();

    // Create test branch with required 'code'
    branch = await prisma.branch.create({
      data: {
        name: "Test Branch",
        code: "TEST-BRANCH", // <-- REQUIRED FIELD
      },
    });

    // Create job orders for test cases
    jobAdmin = await prisma.jobOrder.create({
      data: {
        idCode: "TEST-ADMIN-001",
        idNumber: 1,
        isPaid: false,
        isClaimed: false,
        remarks: "Initial",
        customerName: "Admin Customer",
        branchId: branch.id,
      },
    });

    jobEmp1 = await prisma.jobOrder.create({
      data: {
        idCode: "TEST-EMP-001",
        idNumber: 2,
        isPaid: false,
        isClaimed: false,
        customerName: "Employee Customer 1",
        branchId: branch.id,
      },
    });

    jobEmp2 = await prisma.jobOrder.create({
      data: {
        idCode: "TEST-EMP-002",
        idNumber: 3,
        isPaid: true,
        isClaimed: true,
        customerName: "Blocked",
        branchId: branch.id,
      },
    });

    jobEmp3 = await prisma.jobOrder.create({
      data: {
        idCode: "TEST-EMP-003",
        idNumber: 4,
        isPaid: false,
        isClaimed: false,
        customerName: "Protected",
        branchId: branch.id,
      },
    });
  });

  // ... your test cases follow here
});
