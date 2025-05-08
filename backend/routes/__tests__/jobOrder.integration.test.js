import request from "supertest";
import { test, expect, describe, vi } from "vitest";
import app from "../../app.js";

describe("Job Order Routes GET", () => {
  test("Should return a response of 200", async () => {
    const response = await request(app).get("/job-order/get");
    expect(response.statusCode).toBe(200);
  });

    
  test("countAllJobOrder() should return the count of job orders for interval: day", async () => {
    const response = await request(app).get("/user/count").send({ interval: 'day' });
    console.log("response: ", response.body);
    
    expect(response).toHaveProperty("interval_start");
    expect(response).toHaveProperty("total_paid");
    expect(response).toHaveProperty("total_unpaid");
    expect(response).toHaveProperty("no_of_unpaid");
    expect(response).toHaveProperty("total");
    expect(response).toHaveProperty("no_of_job_orders");
    expect(response).toHaveProperty("no_of_paid");
    expect(response).toHaveProperty("no_of_claimed");
    expect(response).toHaveProperty("no_of_unclaimed");
    
    expect(response).toBeTypeOf("object");
  });
});