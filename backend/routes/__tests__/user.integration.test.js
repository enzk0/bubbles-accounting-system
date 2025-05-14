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
                    username: "quandale_dingle",
                    firstName: "Quandale",
                    lastName: "Dingle",
                    password: "password123",
                },
            });

        expect(response.statusCode).toBe(201);

        const user = await prisma.user.findUnique({
            where: {
                username: "quandale_dingle",
            },
        });

        expect(user.username).toEqual("quandale_dingle");
        expect(user.firstName).toEqual("Quandale");
        expect(user.lastName).toEqual("Dingle");
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
                    username: "quandale_dingle",
                    firstName: "Quandale",
                    lastName: "Dingle",
                    password: "password123",
                },
            });

        expect(response.statusCode).toBe(500);
    });
});

describe("INTEGRATION TESTS FOR /user/ GET ROUTE", () => {
    test("/user/ GET route should fetch a user in the database with the specified user id and send an HTTP status code of 200", async () => {
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

    test("/user/ GET route should send an HTTP status code of 404 when the queried user does not exist or cannot be found", async () => {
        const response = await request(app)
            .get("/user/")
            .send({
                requester: { id: 1 },
                user: { id: 1999 },
            });

        expect(response.statusCode).toBe(404);
    });

    test("/user/ GET route should send an HTTP status code of 422 when the user id used in the query is invalid", async () => {
        const response = await request(app)
            .get("/user/")
            .send({
                requester: { id: 1 },
                user: { id: null },
            });

        expect(response.statusCode).toBe(422);
    });
});

describe("INTEGRATION TESTS FOR /user/all GET ROUTE", () => {
    test("/user/all GET route should get all users in the database and send an HTTP status code of 200", async () => {
        const response = await request(app)
            .get("/user/all")
            .send({
                requester: { id: 1 },
            });

        expect(response.statusCode).toBe(200);

        response.body.forEach((user) => {
            expect(user).toHaveProperty("id");
            expect(user).toHaveProperty("username");
            expect(user).toHaveProperty("firstName");
            expect(user).toHaveProperty("lastName");
            expect(user).toHaveProperty("password");
            expect(user).toHaveProperty("createdAt");
            expect(user).toHaveProperty("updatedAt");
            expect(user).toHaveProperty("isActive");
        });
    });

    test("/user/all GET route should get all users in the database who has a role of employee and send an HTTP status code of 200", async () => {
        const response = await request(app)
            .get("/user/all")
            .send({
                requester: { id: 1 },
                filter: { roleId: 2 },
            });

        expect(response.statusCode).toBe(200);

        response.body.forEach((user) => {
            expect(user).toHaveProperty("id");
            expect(user).toHaveProperty("username");
            expect(user).toHaveProperty("firstName");
            expect(user).toHaveProperty("lastName");
            expect(user).toHaveProperty("password");
            expect(user).toHaveProperty("createdAt");
            expect(user).toHaveProperty("updatedAt");
            expect(user).toHaveProperty("isActive");
            expect(user.roleId).toEqual(2);
        });
    });

    test("/user/all GET route should send an HTTP status code of 404 when no users can be found in the database when a filter is applied", async () => {
        const response = await request(app)
            .get("/user/all")
            .send({
                requester: { id: 1 },
                filter: { roleId: 3 },
            });

        expect(response.statusCode).toBe(404);
    });

    test("/user/all GET route should send an HTTP status code of 500 when the filter provided is invalid", async () => {
        const response = await request(app)
            .get("/user/all")
            .send({
                requester: { id: 1 },
                filter: { parentId: 2 },
            });

        expect(response.statusCode).toBe(500);
    });
});

describe("INTEGRATION TESTS FOR /user/ PATCH ROUTE", () => {
    test("/user/ PATCH route should get all users in the database and send an HTTP status code of 200", async () => {
        const response = await request(app)
            .patch("/user/")
            .send({
                requester: { id: 1 },
                user: { username: "quandale_dingle" },
                edit: {
                    username: "quandale_dingleberry",
                    firstName: "Quandale",
                    lastName: "Dingleberry",
                    roleId: 1,
                    branchId: 2,
                },
            });

        const updated = await prisma.user.findUnique({
            where: { username: "quandale_dingleberry" },
        });

        expect(response.statusCode).toBe(200);

        expect(updated.username).toEqual("quandale_dingleberry");
        expect(updated.firstName).toEqual("Quandale");
        expect(updated.lastName).toEqual("Dingleberry");
        expect(updated.roleId).toEqual(1);
        expect(updated.branchId).toEqual(2);
    });

    test("/user/ PATCH route should send an HTTP status code of 404 when the user to be updated cannot be found", async () => {
        const response = await request(app)
            .patch("/user/")
            .send({
                requester: { id: 1 },
                user: { id: 2050 },
                edit: {
                    username: "anachiro",
                    firstName: "Anachiro",
                    lastName: "Grimms",
                },
            });

        expect(response.statusCode).toBe(404);
    });

    test("/user/ PATCH route should send an HTTP status code of 422 when any of the fields are invalid", async () => {
        const response = await request(app)
            .patch("/user/")
            .send({
                requester: { id: 1 },
                user: { id: 1 },
                edit: {
                    username: "",
                    firstName: null,
                    lastName: undefined,
                },
            });

        expect(response.statusCode).toBe(422);
    });
});
