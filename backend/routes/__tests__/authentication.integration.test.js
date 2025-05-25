import request from "supertest";
import { test, expect, describe, vi, beforeAll, afterAll } from "vitest";
import app from "../../app";
import prisma from "../../client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

vi.mock("../../middleware/api/auth/login", () => ({
    authenticate: (req, res, next) => {
        next();
    },
}));

vi.mock("../../middleware/accessControl", () => ({
    checkPrivilege: (privileges) => (req, res, next) => {
        next();
    },
}));

describe("INTEGRATION TESTS FOR /api/auth/login/employee POST ROUTE", () => {
    test("/api/auth/login/employee POST route should send a HTTP status code of 200 and send a jwt token containing an employee user's id upon successful login", async () => {
        const response = await request(app)
            .post("/api/auth/login/employee")
            .send({
                username: "cinderella",
                password: "password",
            });

        expect(response.statusCode).toBe(200);

        const token = response.body.accessToken;
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await prisma.user.findUnique({
            where: {
                username: "cinderella",
            },
        });

        expect(decoded.id).toEqual(user.id);
    });

    test("/api/auth/login/employee POST route should send an HTTP status code of 401 when the incorrect password is used to authenticate the user", async () => {
        const response = await request(app)
            .post("/api/auth/login/employee")
            .send({
                username: "cinderella",
                password: "beautiful",
            });

        expect(response.statusCode).toBe(401);
    });

    test("/api/auth/login/employee POST route should send an HTTP status code of 403 when a non-employee account is used to login", async () => {
        const response = await request(app)
            .post("/api/auth/login/employee")
            .send({
                username: "grave",
                password: "password",
            });

        expect(response.statusCode).toBe(403);
    });

    test("/api/auth/login/employee POST route should send an HTTP status code of 404 if the non-existent admin account is used to login", async () => {
        const response = await request(app)
            .post("/api/auth/login/employee")
            .send({
                username: "SKK",
                password: "password",
            });

        expect(response.statusCode).toBe(404);
    });
});

describe("INTEGRATION TESTS FOR /api/auth/login/admin POST ROUTE", () => {
    test("/api/auth/login/admin POST route should send a HTTP status code of 200 and send a jwt token containing an employee user's id upon successful login", async () => {
        const response = await request(app).post("/api/auth/login/admin").send({
            username: "grave",
            password: "password",
        });

        expect(response.statusCode).toBe(200);

        const token = response.body.accessToken;
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await prisma.user.findUnique({
            where: {
                username: "grave",
            },
        });

        expect(decoded.id).toEqual(user.id);
    });

    test("/api/auth/login/admin POST route should send an HTTP status code of 401 when the incorrect password is used to authenticate the user", async () => {
        const response = await request(app).post("/api/auth/login/admin").send({
            username: "grave",
            password: "beautiful",
        });

        expect(response.statusCode).toBe(401);
    });

    test("/api/auth/login/admin POST route should send an HTTP status code of 403 when a non-employee account is used to login", async () => {
        const response = await request(app).post("/api/auth/login/admin").send({
            username: "cinderella",
            password: "password",
        });

        expect(response.statusCode).toBe(403);
    });

    test("/api/auth/login/admin POST route should send an HTTP status code of 404 if the non-existent admin account is used to login", async () => {
        const response = await request(app).post("/api/auth/login/admin").send({
            username: "SKK",
            password: "password",
        });

        expect(response.statusCode).toBe(404);
    });
});
