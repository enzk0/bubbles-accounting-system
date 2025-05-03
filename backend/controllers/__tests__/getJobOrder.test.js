import { test, expect, describe, vi } from "vitest";
import { getAllJobOrder } from "../getJobOrder.js";
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

describe("getAllJobOrder", () => { 

  test("getAllJobOrder() should return 404 response if database is empty", async () => {
    const req = mockRequest({ branchId: 1 });
    const res = mockResponse();

    await getAllJobOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "No job orders found" });
  });

  test("getAllJobOrder() should return 400 response if branchID is undeclared", async () => {
    const req = mockRequest({ branchId: null });
    const res = mockResponse();

    await getAllJobOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "No Branch ID declared." });
  });
});