import { test, expect, describe, vi } from "vitest";
import { PrismaClient } from "@prisma/client";
import { getAllJobOrder, getAllJobOrderByBranch, getJobOrderByIdController } from "../getJobOrder.js";

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

describe("INTEGRATION TESTS FOR 'getJobOrderByIdController()' CONTROLLER", () => { 
  test("getJobOrderByIdController() should return a 200 response and a job order with respective id code and id num", async () => {
    const req = mockRequest({ idCode: 'AB', idNumber: 1 });
    const res = mockResponse();

    const jobOrder = await getJobOrderByIdController(req, res);
    console.log("Result of Job Order Id:", jobOrder);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(jobOrder).toBeTypeOf("object");
    expect(jobOrder).toHaveProperty("idCode");
    expect(jobOrder).toHaveProperty("idNumber");
    expect(jobOrder).toHaveProperty("createdAt");
    expect(jobOrder).toHaveProperty("updatedAt");
    expect(jobOrder).toHaveProperty("paidAt");
    expect(jobOrder).toHaveProperty("isPaid");
    expect(jobOrder).toHaveProperty("isClaimed");
    expect(jobOrder).toHaveProperty("isHidden");
    expect(jobOrder).toHaveProperty("remarks");
    expect(jobOrder).toHaveProperty("branchId");
    expect(jobOrder).toHaveProperty("customerId");
    expect(jobOrder).toHaveProperty("userId");
    expect(jobOrder).toHaveProperty("branch");
    expect(jobOrder).toHaveProperty("customer");
    expect(jobOrder).toHaveProperty("user");
    expect(jobOrder).toHaveProperty("jobOrderItems");
  });

  test("getJobOrderByIdController() should return a 404 response if no job order is found", async () => { 
    const req = mockRequest({ idCode: 'ZZ', idNumber: 9999 });
    const res = mockResponse();

    await getJobOrderByIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "No job order found" });
  });

  test("getJobOrderByIdController() should return a 400 response if idCode or idNumber is not provided", async () => {
    const req = mockRequest({ idCode: null, idNumber: null });
    const res = mockResponse();

    await getJobOrderByIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Job Order ID Code and ID Number is not provided" });
  });;
});

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

describe("INTEGRATION TESTS FOR 'getAllJobOrderByBranch()' CONTROLLER", () => { 
  test("getAllJobOrderByBranch() should return all job orders by branch", async () => {
    const req = mockRequest({ branchId: 1 });
    const res = mockResponse();

    const allJobOrders = await getAllJobOrderByBranch(req, res);
    
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

  test("getAllJobOrderByBranch() should return 400 response if branchId is not provided", async () => {
    const req = mockRequest({ branchId: null });
    const res = mockResponse();

    await getAllJobOrderByBranch(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Branch ID is not provided" });
  });

  test("getAllJobOrderByBranch() should return 404 response if no job orders are found", async () => {
    const req = mockRequest({ branchId: 9999 });
    const res = mockResponse();

    await getAllJobOrderByBranch(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "No job orders found" });
  });
})

