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

  test("countJobOrder() should return 400 if interval is missing", async () => {
    const req = mockRequest({});
    const res = mockResponse();

    await countJobOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Interval is required" });
  });

  test("countJobOrder() should return 500 if database query fails", async () => {
    const req = mockRequest({
      interval: "day"
    });
    const res = mockResponse();

    // Mock the custom extension method to throw an error
    const mockCustom = {
      jobOrder: {
        groupByDate: vi.fn().mockRejectedValue(new Error("Database error"))
      }
    };

    // Replace the implementation of $extends
    prisma.$extends.mockReturnValue(mockCustom);

    await countJobOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
  });
});

describe("UNIT test for 'countJobOrderByBranch()' controller", () => {
  test("countJobOrderByBranch() should return the count of job orders for a specific branch", async () => {
    const req = mockRequest({
      interval: "day",
      branchId: 1
    });

    const res = mockResponse();

    const mockJobOrderCount = [{
      interval_start: new Date("2025-04-28T00:00:00Z"),
      total: 100,
      total_paid: 80,
      total_unpaid: 20,
      no_of_job_orders: 15,
      no_of_paid: 10,
      no_of_unpaid: 5,
      no_of_claimed: 8,
      no_of_unclaimed: 7,
    }];

    // Mock the custom extension method to return our test data
    const mockCustom = {
      jobOrder: {
        groupByDateByBranch: vi.fn().mockResolvedValue(mockJobOrderCount)
      }
    };

    // Replace the implementation of $extends
    prisma.$extends.mockReturnValue(mockCustom);

    await countJobOrderByBranch(req, res);

    // Verify the custom extension was called with correct parameters
    expect(mockCustom.jobOrder.groupByDateByBranch).toHaveBeenCalledWith("day", 1);
    
    // Verify response
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      interval_start: mockJobOrderCount[0].interval_start,
      total: mockJobOrderCount[0].total,
      total_paid: mockJobOrderCount[0].total_paid,
      total_unpaid: mockJobOrderCount[0].total_unpaid,
      no_of_job_orders: mockJobOrderCount[0].no_of_job_orders,
      no_of_paid: mockJobOrderCount[0].no_of_paid,
      no_of_unpaid: mockJobOrderCount[0].no_of_unpaid,
      no_of_claimed: mockJobOrderCount[0].no_of_claimed,
      no_of_unclaimed: mockJobOrderCount[0].no_of_unclaimed
    });
  });

  test("countJobOrderByBranch() should return 400 if interval is missing", async () => {
    const req = mockRequest({ branchId: 1 });
    const res = mockResponse();

    await countJobOrderByBranch(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Interval is required" });
  });

  test("countJobOrderByBranch() should return 400 if branchId is missing", async () => {
    const req = mockRequest({ interval: "day" });
    const res = mockResponse();

    await countJobOrderByBranch(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "BranchID is required" });
  });

  test("countJobOrderByBranch() should return 400 if both interval and branchId are missing", async () => {
    const req = mockRequest({});
    const res = mockResponse();

    await countJobOrderByBranch(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Interval and BranchID is required" });
  });

  test("countJobOrderByBranch() should return 500 if database query fails", async () => {
    const req = mockRequest({
      interval: "day",
      branchId: 1
    });
    const res = mockResponse();

    // Mock the custom extension method to throw an error
    const mockCustom = {
      jobOrder: {
        groupByDateByBranch: vi.fn().mockRejectedValue(new Error("Database error"))
      }
    };

    // Replace the implementation of $extends
    prisma.$extends.mockReturnValue(mockCustom);

    await countJobOrderByBranch(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
  });
});