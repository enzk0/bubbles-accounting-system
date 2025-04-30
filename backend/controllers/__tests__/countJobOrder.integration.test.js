import { test, expect, describe, vi } from "vitest";
import { PrismaClient } from "@prisma/client";
import { countJobOrder } from "../countJobOrder.js"; 

const prisma = new PrismaClient();

// Mock Express req/res objects
const mockRequest = (body) => ({
  body: body,
});
const mockResponse = () => { 
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("INTEGRATION TESTS FOR 'countJobOrder()' CONTROLLER", () => {
  // We're using the seeded database, so no need for beforeEach/afterEach setup

  test("countJobOrder() should return the count of job orders for interval: day", async () => {
    const req = mockRequest({
      interval: "day",
    });
    const res = mockResponse();

    const result = await countJobOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();

    expect(result).toHaveProperty("interval_start");
    expect(result).toHaveProperty("total");
    expect(result).toHaveProperty("total_paid");
    expect(result).toHaveProperty("total_unpaid");
    expect(result).toHaveProperty("no_of_unpaid");
    expect(result).toHaveProperty("no_of_job_orders");
    expect(result).toHaveProperty("no_of_paid");
    expect(result).toHaveProperty("no_of_claimed");
    expect(result).toHaveProperty("no_of_unclaimed");
    
    expect(result).toBeTypeOf("object");
  });

  test("countJobOrder() should return the count of job orders for interval: week", async () => {
    const req = mockRequest({
      interval: "week",
    });
    const res = mockResponse();

    const result = await countJobOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();

    expect(result).toHaveProperty("interval_start");
    expect(result).toHaveProperty("total");
    expect(result).toHaveProperty("total_paid");
    expect(result).toHaveProperty("total_unpaid");
    expect(result).toHaveProperty("no_of_unpaid");
    expect(result).toHaveProperty("no_of_job_orders");
    expect(result).toHaveProperty("no_of_paid");
    expect(result).toHaveProperty("no_of_claimed");
    expect(result).toHaveProperty("no_of_unclaimed");

    expect(result).toBeTypeOf("object");
  }
  );

  test("countJobOrder() should return the count of job orders for interval: month", async () => {
    const req = mockRequest({
      interval: "month",
    });
    const res = mockResponse();

    const result = await countJobOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();

    expect(result).toHaveProperty("interval_start");
    expect(result).toHaveProperty("total");
    expect(result).toHaveProperty("total_paid");
    expect(result).toHaveProperty("total_unpaid");
    expect(result).toHaveProperty("no_of_unpaid");
    expect(result).toHaveProperty("no_of_job_orders");
    expect(result).toHaveProperty("no_of_paid");
    expect(result).toHaveProperty("no_of_claimed");
    expect(result).toHaveProperty("no_of_unclaimed");

    expect(result).toBeTypeOf("object");
  });
  
  test("countJobOrder() should return the count of job orders for interval: year", async () => {
    const req = mockRequest({
      interval: "year",
    });
    const res = mockResponse();

    const result = await countJobOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();

    expect(result).toHaveProperty("interval_start");
    expect(result).toHaveProperty("total");
    expect(result).toHaveProperty("total_paid");
    expect(result).toHaveProperty("total_unpaid");
    expect(result).toHaveProperty("no_of_unpaid");
    expect(result).toHaveProperty("no_of_job_orders");
    expect(result).toHaveProperty("no_of_paid");
    expect(result).toHaveProperty("no_of_claimed");
    expect(result).toHaveProperty("no_of_unclaimed");

    expect(result).toBeTypeOf("object");
  });
});