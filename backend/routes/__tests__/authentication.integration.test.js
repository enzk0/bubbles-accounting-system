import request from "supertest";
import { test, expect, describe, vi, beforeAll, afterAll } from "vitest";
import app from "../../app";
import prisma from "../../client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

describe("INTEGRATION TESTS FOR /auth/employee POST ROUTE", () => {
    test("/auth/employee POST route should send a HTTP status code of 200 and send a jwt token containing an employee user's id upon successful login", async () => {
        const response = await request(app)
            .post("/auth/employee")
            .send({
                user: { username: "cinderella", password: "password" },
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

    test("/auth/employee POST route should send an HTTP status code of 401 when the incorrect password is used to authenticate the user", async () => {
        const response = await request(app)
            .post("/auth/employee")
            .send({
                user: { username: "cinderella", password: "beautiful" },
            });

        expect(response.statusCode).toBe(401);
    });

    test("/auth/employee POST route should send an HTTP status code of 403 when a non-employee account is used to login", async () => {
        const response = await request(app)
            .post("/auth/employee")
            .send({
                user: { username: "grave", password: "password" },
            });

        expect(response.statusCode).toBe(403);
    });

    test("/auth/employee POST route should send an HTTP status code of 404 if the non-existent admin account is used to login", async () => {
        const response = await request(app)
            .post("/auth/employee")
            .send({
                user: { username: "SKK", password: "password" },
            });

        expect(response.statusCode).toBe(404);
    });
});

describe("INTEGRATION TESTS FOR /auth/admin POST ROUTE", () => {
    test("/auth/admin POST route should send a HTTP status code of 200 and send a jwt token containing an employee user's id upon successful login", async () => {
        const response = await request(app)
            .post("/auth/admin")
            .send({
                user: { username: "grave", password: "password" },
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

    test("/auth/admin POST route should send an HTTP status code of 401 when the incorrect password is used to authenticate the user", async () => {
        const response = await request(app)
            .post("/auth/admin")
            .send({
                user: { username: "grave", password: "beautiful" },
            });

        expect(response.statusCode).toBe(401);
    });

    test("/auth/admin POST route should send an HTTP status code of 403 when a non-employee account is used to login", async () => {
        const response = await request(app)
            .post("/auth/admin")
            .send({
                user: { username: "cinderella", password: "password" },
            });

        expect(response.statusCode).toBe(403);
    });

    test("/auth/admin POST route should send an HTTP status code of 404 if the non-existent admin account is used to login", async () => {
        const response = await request(app)
            .post("/auth/admin")
            .send({
                user: { username: "SKK", password: "password" },
            });

        expect(response.statusCode).toBe(404);
    });
});
