import { test, expect, describe, vi } from "vitest";
import { PrismaClient } from "@prisma/client";
import { getAllJobOrder, getAllJobOrderByBranch } from "../getJobOrder.js";


const prisma = new PrismaClient();

const mockRequest = (body) => ({
  body: body,
});
const mockResponse = () => { 
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("INTEGRATION TESTS FOR 'getAllJobOrder()' CONTROLLER", () => {
  test("getAllJobOrder() should return all job orders", async () => {
    const req = mockRequest({});
    const res = mockResponse();

    const result = await getAllJobOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();

    expect(result).toBeTypeOf("object");
  });

  // test("getAllJobOrder() should return all job orders by branch", async () => {
  //   const req = mockRequest({
  //     branch_id: "1",
  //   });
  //   const res = mockResponse();

  //   const result = await getAllJobOrderByBranch(req, res);

  //   expect(res.status).toHaveBeenCalledWith(200);
  //   expect(res.json).toHaveBeenCalled();

  //   expect(result).toBeTypeOf("object");
  // });
});

