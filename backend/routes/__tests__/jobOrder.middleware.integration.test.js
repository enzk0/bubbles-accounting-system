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

describe("INTEGRATION TESTS FOR /api/job-order/count GET ROUTE W/ MIDDLEWARE", () => {
    test("/api/job-order/count GET route should send an HTTP status code of 200 if user is an admin", async () => {
        const token = testToken({ id: 10 });

        const response = await request(app)
            .get("/api/job-order/count?interval=day")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
    });

    test("/api/job-order/count GET route should send an HTTP status code of 403 if user is not an admin", async () => {
        const token = testToken({ id: 1 });

        const response = await request(app)
            .get("/api/job-order/count?interval=day")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(403);
    });

    test("/api/job-order/count GET route should send an HTTP status code of 401 token is expired", async () => {
        const token = testExpiredToken({ id: 10 });

        const response = await request(app)
            .get("/api/job-order/count?interval=day")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(401);
    });
});
