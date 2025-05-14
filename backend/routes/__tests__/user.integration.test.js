import request from "supertest";
import { test, expect, describe, vi } from "vitest";
import app from "../../app";
import prisma from "../../client";

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

describe("INTEGRATION TESTS FOR /user/ POST ROUTE", () => {
    test("/user/ POST route should create a user in the database and send an HTTP status code of 201", async () => {
        const response = await request(app)
            .post("/user/")
            .send({
                requester: { id: 1 },
                user: {
                    username: "john_doe",
                    firstName: "John",
                    lastName: "Doe",
                    password: "password123",
                },
            });

        expect(response.statusCode).toBe(201);

        const user = await prisma.user.findUnique({
            where: {
                username: "john_doe",
            },
        });

        expect(user.username).toEqual("john_doe");
        expect(user.firstName).toEqual("John");
        expect(user.lastName).toEqual("Doe");
    });

    test("/user/ POST route should send an HTTP status code of 422 when any of the fields are incmomplete or invalid", async () => {
        const response = await request(app)
            .post("/user/")
            .send({
                requester: { id: 1 },
                user: {
                    username: "",
                    firstName: "John",
                    lastName: null,
                    password: undefined,
                },
            });

        expect(response.statusCode).toBe(422);
    });

    test("/user/ POST route should send an HTTP status code of 500 when there is an attempt to make a duplicate/non-unique user", async () => {
        const response = await request(app)
            .post("/user/")
            .send({
                requester: { id: 1 },
                user: {
                    username: "john_doe",
                    firstName: "John",
                    lastName: "Doe",
                    password: "password123",
                },
            });

        expect(response.statusCode).toBe(500);
    });
});

describe("INTEGRATION TESTS FOR /user/ GET ROUTE", () => {
    test("/user/ POST route should fetch a user in the database with the specified user id and send an HTTP status code of 200", async () => {
        const response = await request(app)
            .get("/user/")
            .send({
                requester: { id: 1 },
                user: { id: 1 },
            });

        expect(response.statusCode).toBe(200);

        const user = await prisma.user.findUnique({
            where: {
                id: 1,
            },
        });

        expect(response.body.id).toEqual(user.id);
        expect(response.body.username).toEqual(user.username);
        expect(response.body.firstName).toEqual(user.firstName);
        expect(response.body.lastName).toEqual(user.lastName);
    });

    test("/user/ POST route should send an HTTP status code of 404 when the queried user does not exist or cannot be found", async () => {
        const response = await request(app)
            .get("/user/")
            .send({
                requester: { id: 1 },
                user: { id: 1999 },
            });

        expect(response.statusCode).toBe(404);
    });

    test("/user/ POST route should send an HTTP status code of 422 when the user id used in the query is invalid", async () => {
        const response = await request(app)
            .get("/user/")
            .send({
                requester: { id: 1 },
                user: { id: null },
            });

        expect(response.statusCode).toBe(422);
    });
});

