import {
  test,
  expect,
  describe,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
  vi,
} from "vitest";
import request from "supertest";
import express from "express";
import salesRoutes from "../routes/salesRoutes.js";
import * as jobOrderService from "../services/jobOrderService.js";

// Mocked service
vi.mock("../services/jobOrderService.js", () => ({
  findJobOrderById: vi.fn((id) => {
    if (id === '1') {
      return Promise.resolve({ id: 1, isPaid: false, isClaimed: false });
    }
    return Promise.resolve(null);
  }),
  updateJobOrder: vi.fn((id, data) => Promise.resolve({ id: 1, ...data })),
}));

// Express app setup
const app = express();
app.use(express.json());
app.use('/api', salesRoutes);

describe("Employee Controller - Job Order Modification", () => {
  beforeAll(() => {
    // Setup once before all tests (if needed)
  });

  afterAll(() => {
    // Cleanup after all tests (if needed)
  });

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Optional cleanup after each test
  });

  test("should allow employee to toggle isPaid", async () => {
    const res = await request(app)
      .patch("/api/employee/job-orders/1")
      .set("role", "employee")
      .send({ isPaid: true });

    expect(res.status).toBe(200);
    expect(res.body.updatedJob.isPaid).toBe(true);
  });

  test("should prevent employee from modifying when both isPaid and isClaimed are true", async () => {
    jobOrderService.findJobOrderById.mockResolvedValueOnce({
      id: 1,
      isPaid: true,
      isClaimed: true,
    });

    const res = await request(app)
      .patch("/api/employee/job-orders/1")
      .set("role", "employee")
      .send({ isPaid: false });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Cannot modify when both isPaid and isClaimed are true");
  });

  test("should forbid employee from editing other fields", async () => {
    const res = await request(app)
      .patch("/api/employee/job-orders/1")
      .set("role", "employee")
      .send({ customerName: "Hacker" });

    expect(res.status).toBe(200);
    expect(res.body.updatedJob.customerName).toBeUndefined();
  });
});
