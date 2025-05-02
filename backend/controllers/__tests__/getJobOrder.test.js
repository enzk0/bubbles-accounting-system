import { test, expect, describe, vi } from "vitest";
import { getJobOrder } from "../getJobOrder.js";
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

describe("getJobOrder", () => { 

  test("getJobOrder() should return 404 response if database is empty", async () => {
    const req = mockRequest({ branchID: "1" });
    const res = mockResponse();

    await getJobOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "No job orders found" });
  });
});