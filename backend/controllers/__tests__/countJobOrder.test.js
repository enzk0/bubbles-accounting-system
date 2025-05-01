import { test, expect, describe, vi } from "vitest";
import { countJobOrder, countJobOrderByBranch } from "../countJobOrder.js";
import prisma from "../../client";

// Mock the prisma client and its extensions
vi.mock("../../client", () => ({
  default: {
    $queryRawUnsafe: vi.fn(),
    $extends: vi.fn().mockReturnValue({
      jobOrder: {
        groupByDate: vi.fn(),
        groupByDateByBranch: vi.fn()
      }
    })
  }
}));

const mockRequest = (body) => ({
  body: body,
});

const mockResponse = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("UNIT test for 'countJobOrder()' controller", () => { 
  test("countJobOrder() should return the count of job orders for interval: day", async () => { 
    const req = mockRequest({
      interval: "day",
    });

    const res = mockResponse();

    const mockJobOrderCount = [{
      interval_start: new Date("2025-04-28T00:00:00Z"),
      total: 180,
      total_paid: 0,
      total_unpaid: 180,
      no_of_job_orders: 30,
      no_of_paid: 0,
      no_of_unpaid: 30,
      no_of_claimed: 0,
      no_of_unclaimed: 30,
    }];

    // Mock the custom extension method to return our test data
    const mockCustom = {
      jobOrder: {
        groupByDate: vi.fn().mockResolvedValue(mockJobOrderCount)
      }
    };

    // Replace the implementation of $extends
    prisma.$extends.mockReturnValue(mockCustom);

    await countJobOrder(req, res);
    // Verify response
    expect(res.status).toHaveBeenCalledWith(200);
  });
});