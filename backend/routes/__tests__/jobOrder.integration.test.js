import request from "supertest";
import { test, expect, describe, vi } from "vitest";
import app from "../../app.js";

vi.mock("../../middleware/auth", () => ({
  authenticate: (req, res, next) => {
      next();
  },
}));

vi.mock("../../middleware/accessControl", () => ({
  checkPrivilege: (privileges) => (req, res, next) => {
      next();
  },
}));

describe("/count GET route", () => {
  test("Should return a response of 200", async () => {
    const response = await request(app).get("/job-order/get");
    expect(response.statusCode).toBe(200);
  });

  test("countAllJobOrder() should return the count of job orders for interval: day", async () => {
    const response = await request(app).get("/job-order/count").send({ interval: 'day' });
    console.log("response: ", response.body);
    
    expect(response.statusCode).toBe(200);

    expect(response.body).toHaveProperty("interval_start");
    expect(response.body).toHaveProperty("total_unpaid");
    expect(response.body).toHaveProperty("no_of_unpaid");
    expect(response.body).toHaveProperty("total_paid");
    expect(response.body).toHaveProperty("total");
    expect(response.body).toHaveProperty("no_of_job_orders");
    expect(response.body).toHaveProperty("no_of_paid");
    expect(response.body).toHaveProperty("no_of_claimed");
    expect(response.body).toHaveProperty("no_of_unclaimed");
    
    expect(response.body).toBeTypeOf("object");
  });

  test("countJobOrder() should return the count of job orders for interval: week", async () => {
    const response = await request(app).get("/job-order/count").send({ interval: 'week' });
    console.log("response: ", response.body);

    expect(response.statusCode).toBe(200);

    expect(response.body).toHaveProperty("interval_start");
    expect(response.body).toHaveProperty("total");
    expect(response.body).toHaveProperty("total_paid");
    expect(response.body).toHaveProperty("total_unpaid");
    expect(response.body).toHaveProperty("no_of_unpaid");
    expect(response.body).toHaveProperty("no_of_job_orders");
    expect(response.body).toHaveProperty("no_of_paid");
    expect(response.body).toHaveProperty("no_of_claimed");
    expect(response.body).toHaveProperty("no_of_unclaimed");

    expect(response.body).toBeTypeOf("object");
  }
  );

  test("countJobOrder() should return the count of job orders for interval: month", async () => {
    const response = await request(app).get("/job-order/count").send({ interval: 'month' });
    console.log("response: ", response.body);

    expect(response.statusCode).toBe(200);
  
    expect(response.body).toHaveProperty("interval_start");
    expect(response.body).toHaveProperty("total");
    expect(response.body).toHaveProperty("total_paid");
    expect(response.body).toHaveProperty("total_unpaid");
    expect(response.body).toHaveProperty("no_of_unpaid");
    expect(response.body).toHaveProperty("no_of_job_orders");
    expect(response.body).toHaveProperty("no_of_paid");
    expect(response.body).toHaveProperty("no_of_claimed");
    expect(response.body).toHaveProperty("no_of_unclaimed");

    expect(response.body).toBeTypeOf("object");
  });

  test("countJobOrder() should return the count of job orders for interval: year", async () => {
    const response = await request(app).get("/job-order/count").send({ interval: 'year' });
    console.log("response: ", response.body);

    expect(response.statusCode).toBe(200);

    expect(response.body).toHaveProperty("interval_start");
    expect(response.body).toHaveProperty("total");
    expect(response.body).toHaveProperty("total_paid");
    expect(response.body).toHaveProperty("total_unpaid");
    expect(response.body).toHaveProperty("no_of_unpaid");
    expect(response.body).toHaveProperty("no_of_job_orders");
    expect(response.body).toHaveProperty("no_of_paid");
    expect(response.body).toHaveProperty("no_of_claimed");
    expect(response.body).toHaveProperty("no_of_unclaimed");

    expect(response.body).toBeTypeOf("object");
  });

  test("countJobOrder() should return 400 if interval is not provided", async () => {
    const response = await request(app).get("/job-order/count").send({ interval: '' });
    console.log("response: ", response.body);
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Interval is required");
  });

  test("countJobOrder() should return 400 if interval is not valid", async () => {
    const response = await request(app).get("/job-order/count").send({ interval: "OogaBooga" });
    console.log("response: ", response.body);
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Interval must be day, week, month, or year.");
  });
});

describe("/get GET route", () => { 
  test("Should return a response of 200", async () => {
    const response = await request(app).get("/job-order/get");
    expect(response.statusCode).toBe(200);
  });

  test("getAllJobOrder() should return all job orders", async () => {
    const response = await request(app).get("/job-order/get");
    console.log("response: ", response.body);
    
    expect(response.statusCode).toBe(200);

    expect(response.body).toBeTypeOf("object");
  });
});

describe("/get GET route", () => { 
  test("Should return a response of 200", async () => {
    const response = await request(app).get("/job-order/get");
    expect(response.statusCode).toBe(200);
  });

  test("getAllJobOrder() should return all job orders", async () => { 
    const response = await request(app).get("/job-order/get");
    console.log("All Job Order response: ", response.body);
    
    expect(response.statusCode).toBe(200);

    expect(response.body).toBeTypeOf("object");

    response.body.jobOrders.forEach((jobOrder) => {
      expect(jobOrder).toHaveProperty("idCode");
      expect(jobOrder).toHaveProperty("idNumber");
      expect(jobOrder).toHaveProperty("createdAt");
      expect(jobOrder).toHaveProperty("updatedAt");
    });
  })
});