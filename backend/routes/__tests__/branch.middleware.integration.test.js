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

describe("INTEGRATION TESTS FOR /branch/ POST ROUTE W/ MIDDLEWARE", () => {
    test("/branch/ POST route should create a branch in the database and send an HTTP status code of 200 along with a message if the user is admin", async () => {
        const token = testToken({ id: 10 });

        const response = await request(app)
            .post("/branch/")
            .set("Authorization", `Bearer ${token}`)
            .send({
                branch: { code: "PS", name: "Persian", address: "Persia" },
            });

        expect(response.statusCode).toBe(201);
    });

    test("/branch/ POST route should send an HTTP status code of 403 and an error message if user is not admin", async () => {
        const token = testToken({ id: 1 });

        const response = await request(app)
            .post("/branch/")
            .set("Authorization", `Bearer ${token}`)
            .send({
                branch: { code: "PS", name: "Persian", address: "Persia" },
            });

        expect(response.statusCode).toBe(403);
    });

    test("/branch/ POST route should send an HTTP status code of 403 and an error message if the token is expired", async () => {
        const token = testExpiredToken({ id: 10 });

        const response = await request(app)
            .post("/branch/")
            .set("Authorization", `Bearer ${token}`)
            .send({
                branch: { code: "PS", name: "Persian", address: "Persia" },
            });

        expect(response.statusCode).toBe(403);
    });
});
