import { test, expect, describe, vi } from "vitest";
import { getAllJobOrder, getAllJobOrderByBranch } from "../getJobOrder.js";
import prismaMock from "../../singleton.js";

vi.mock("../../client", () => ({
  default: {
    jobOrder: {
      findMany: vi.fn(),
    },
  },
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
});

describe("getAllJobOrderByBranch", () => { 
  test("getAllJobOrderByBranch() should return 404 response if database is empty", async () => {
    const req = mockRequest({ branchId: 1 });
    const res = mockResponse();

    await getAllJobOrderByBranch(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "No job orders found" });
  });
})