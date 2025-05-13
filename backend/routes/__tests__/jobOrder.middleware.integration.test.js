import request from "supertest";
import jwt from "jsonwebtoken";
import { test, expect, describe, vi } from "vitest";
import app from "../../app";


const testToken = (data) => {
    return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "30m",
    });
};

const testExpiredToken = (data) => {
    return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: -10 });
};

describe("INTEGRATION TESTS FOR /job-order/count GET ROUTE W/ MIDDLEWARE", () => { 
    test("GET /job-order/count if requester is an admin", async () => {
        const token = testToken({ id: 10 });

        const response = await request(app)
            .get("/job-order/count")
            .set("Authorization", `Bearer ${token}`)
            .send({
                interval: "day",
            });
        
        expect(response.statusCode).toBe(200);
    });

    test("GET /job-order/count if requester is not an admin", async () => {
        const token = testToken({ id: 1 });

        const response = await request(app)
            .get("/job-order/count")
            .set("Authorization", `Bearer ${token}`)
            .send({
                interval: "day",
            });
        
        expect(response.statusCode).toBe(403);
    });
});

describe("INTEGRATION TESTS FOR /job-order/count-by-branch GET ROUTE W/ MIDDLEWARE", () => { 
    test("GET /job-order/count-by-branch if requester is an admin", async () => {
        const token = testToken({ id: 10 });

        const response = await request(app)
            .get("/job-order/count-by-branch")
            .set("Authorization", `Bearer ${token}`)
            .send({
                interval: "day",
                branchId: 1,
            });
        
        expect(response.statusCode).toBe(200);
    });

    test("GET /job-order/count-by-branch if requester is not an admin", async () => {
        const token = testToken({ id: 1 });

        const response = await request(app)
            .get("/job-order/count-by-branch")
            .set("Authorization", `Bearer ${token}`)
            .send({
                interval: "day",
                branchId: 1,
            });
        
        expect(response.statusCode).toBe(403);
    });
});

describe("INTEGRATION TESTS FOR /job-order/get GET ROUTE W/ MIDDLEWARE", () => { 
    test("GET /job-order/get if requester is an admin", async () => {
        const token = testToken({ id: 10 });

        const response = await request(app)
            .get("/job-order/get")
            .set("Authorization", `Bearer ${token}`)
            .send({});
        
        expect(response.statusCode).toBe(200);
    });

    test("GET /job-order/get if requester is not an admin", async () => {
        const token = testToken({ id: 1 });

        const response = await request(app)
            .get("/job-order/get")
            .set("Authorization", `Bearer ${token}`)
            .send({});
        
        expect(response.statusCode).toBe(403);
    });
});

describe("INTEGRATION TESTS FOR /job-order/get-by-branch GET ROUTE W/ MIDDLEWARE", () => {
    test("GET /job-order/get-by-branch if requester is an admin", async () => {
        const token = testToken({ id: 10 });

        const response = await request(app)
            .get("/job-order/get-by-branch")
            .set("Authorization", `Bearer ${token}`)
            .send({
                branchId: 1,
            });
        
        expect(response.statusCode).toBe(200);
    });
});