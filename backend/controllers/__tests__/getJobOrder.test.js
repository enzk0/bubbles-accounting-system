import { test, expect, describe, vi } from "vitest";
import { getAllJobOrder, getAllJobOrderByBranch, getJobOrderByIdController} from "../getJobOrder.js";
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

describe("getJobOrderByIdController", () => { 
  test("getJobOrderByIdController() should return a 500 response if function reads undefined when querying database", async () => {
    const req = mockRequest({ idCode: 'ZZ', idNumber: 9999 });
    const res = mockResponse();

    await getJobOrderByIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
  });

  test("getJobOrderByIdController() should return a 400 response if idCode or idNumber is not provided", async () => {
    const req = mockRequest({ idCode: null, idNumber: null });
    const res = mockResponse();

    await getJobOrderByIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Job Order ID Code and ID Number is not provided" });
  });

  test("getJobOrderByIdController() should return a 400 response if idCode is not provided", async () => {
    const req = mockRequest({ idCode: null, idNumber: 1 });
    const res = mockResponse();

    await getJobOrderByIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Job Order ID Code is not provided" });
  });

  test("getJobOrderByIdController() should return a 400 response if idNumber is not provided", async () => {
    const req = mockRequest({ idCode: "AB", idNumber: null });
    const res = mockResponse();

    await getJobOrderByIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Job Order ID Number is not provided" });
  });
})


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

  test("getAllJobOrderByBranch() should return 400 response if branchId is not provided", async () => {
    const req = mockRequest({branchId: null});
    const res = mockResponse();

    await getAllJobOrderByBranch(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Branch ID is not provided" });
  });
})