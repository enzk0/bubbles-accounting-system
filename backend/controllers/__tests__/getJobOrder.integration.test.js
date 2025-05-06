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

    const allJobOrders = await getAllJobOrder(req, res);
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(allJobOrders).toBeTypeOf("object");

    const instance1 = allJobOrders[0];
    console.log("result1", instance1);
    
    expect(instance1).toHaveProperty("idCode");
    expect(instance1).toHaveProperty("idNumber");
    expect(instance1).toHaveProperty("createdAt");
    expect(instance1).toHaveProperty("updatedAt");
    expect(instance1).toHaveProperty("paidAt");
    expect(instance1).toHaveProperty("isPaid");
    expect(instance1).toHaveProperty("isClaimed");
    expect(instance1).toHaveProperty("isHidden");
    expect(instance1).toHaveProperty("remarks");
    expect(instance1).toHaveProperty("branchId");
    expect(instance1).toHaveProperty("customerId");
    expect(instance1).toHaveProperty("userId");
    expect(instance1).toHaveProperty("branch");
    expect(instance1).toHaveProperty("customer");
    expect(instance1).toHaveProperty("user");
    expect(instance1).toHaveProperty("jobOrderItems");
  });
});

