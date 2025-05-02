import { test, expect, describe, vi } from "vitest";
import { countJobOrder, countJobOrderByBranch } from "../countJobOrder.js";
import prismaMock from "../../singleton.js";

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
  test("countJobOrder() should return 404 response as there are no instances in the database", async () => { 
    const req = mockRequest({ interval: "day" });
    const res = mockResponse();

    await countJobOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "No job orders found" });
  });

  test("countJobOrder() should return 400 response for undeclared interval", async () => { 
    const req = mockRequest({ interval: "" });
    const res = mockResponse();

    await countJobOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Interval is required" });
  });

  test("countJobOrder() should return 400 response for invalid interval", async () => { 
    const req = mockRequest({ interval: "wow" });
    const res = mockResponse();

    await countJobOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Interval must be day, week, month, or year." });
  });
});

describe("UNIT test for 'countJobOrderByBranch()' controller", () => { 

  test("countJobOrderByBranch() should return 404 response as there are no instances in the database", async () => { 
    const req = mockRequest({ interval: "day", branchId: 1 });
    const res = mockResponse();

    await countJobOrderByBranch(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "No job orders found" });
  });
})