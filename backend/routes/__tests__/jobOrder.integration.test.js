import request from "supertest";
import { test, expect, describe, vi } from "vitest";
import app from "../../app.js";

describe("Job Order Routes GET", () => {
  test("Should return a response of 200", async () => {
    const response = await request(app).get("/job-order/get");
    expect(response.statusCode).toBe(200);
  });
});