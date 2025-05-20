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
        const response = await request(app).get("/user/1");

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
        const response = await request(app).get("/user/999");

        expect(response.statusCode).toBe(404);
    });

    test("/user/ GET route should send an HTTP status code of 422 when the user id used in the query is invalid", async () => {
        const response = await request(app).get("/user/asdgkljasd");

        expect(response.statusCode).toBe(422);
    });
});

describe("INTEGRATION TESTS FOR /user/all GET ROUTE", () => {
    const assertUser = (user) => {
        expect(user).toHaveProperty("id");
        expect(user).toHaveProperty("username");
        expect(user).toHaveProperty("firstName");
        expect(user).toHaveProperty("lastName");
        expect(user).toHaveProperty("password");
        expect(user).toHaveProperty("createdAt");
        expect(user).toHaveProperty("updatedAt");
        expect(user).toHaveProperty("isActive");
    };

    test("/user/all GET route should get all users in the database and send an HTTP status code of 200", async () => {
        const response = await request(app).get("/user/all");

        expect(response.statusCode).toBe(200);

        response.body.forEach((user) => {
            assertUser(user);
        });
    });

    test("/user/all GET route should get all users in the database who has a role of employee and send an HTTP status code of 200", async () => {
        const response = await request(app).get("/user/all?roleId=2");

        expect(response.statusCode).toBe(200);

        response.body.forEach((user) => {
            assertUser(user);
            expect(user.roleId).toEqual(2);
        });
    });

    test("/user/all GET route should get all users in the database who are active and send an HTTP status code of 200", async () => {
        const response = await request(app).get("/user/all?isActive=true");

        expect(response.statusCode).toBe(200);

        response.body.forEach((user) => {
            assertUser(user);
            expect(user.isActive).toEqual(true);
        });
    });

    test("/user/all GET route should get all users in the database who are inactive and send an HTTP status code of 200", async () => {
        const response = await request(app).get("/user/all?isActive=false");

        expect(response.statusCode).toBe(200);

        console.log(response.body);

        response.body.forEach((user) => {
            assertUser(user);
            expect(user.isActive).toEqual(false);
        });
    });

    test("/user/all GET route should send an HTTP status code of 404 when no users can be found in the database when a filter is applied", async () => {
        const response = await request(app).get("/user/all?roleId=3");

        expect(response.statusCode).toBe(404);
    });
});

describe("INTEGRATION TESTS FOR /user/:id PATCH ROUTE", () => {
    test("/user/:id PATCH route should edit the specified in the database and send an HTTP status code of 200", async () => {
        const user = await prisma.user.findUnique({
            where: {
                username: "quandale_dingle",
            },
        });

        console.log(user);

        const response = await request(app).patch(`/user/${user.id}`).send({
            username: "quandale_dingleberry",
            firstName: "Quandale",
            lastName: "Dingleberry",
            roleId: 1,
            branchId: 2,
        });

        const updated = await prisma.user.findUnique({
            where: { id: user.id },
        });

        expect(response.statusCode).toBe(200);

        expect(updated.username).toEqual("quandale_dingleberry");
        expect(updated.firstName).toEqual("Quandale");
        expect(updated.lastName).toEqual("Dingleberry");
        expect(updated.roleId).toEqual(1);
        expect(updated.branchId).toEqual(2);
    });

    test("/user/:id PATCH route should send an HTTP status code of 404 when the user to be updated cannot be found", async () => {
        const response = await request(app).patch("/user/2077").send({
            username: "anachiro",
            firstName: "Anachiro",
            lastName: "Grimms",
        });

        expect(response.statusCode).toBe(404);
    });

    test("/user/:id PATCH route should send an HTTP status code of 422 when any of the fields are invalid", async () => {
        const response = await request(app).patch("/user/1").send({
            username: "",
            firstName: null,
            lastName: undefined,
        });

        expect(response.statusCode).toBe(422);
    });
});

describe("INTEGRATION TESTS FOR /user/password PATCH ROUTE", () => {
    test("/user/password PATCH route updated the password of a user in the database and send an HTTP status code of 200", async () => {
        const user = await prisma.user.findUnique({
            where: { username: "quandale_dingleberry" },
        });

        const response = await request(app)
            .patch(`/user/password/${user.id}`)
            .send({
                password: "pass456",
            });

        expect(response.statusCode).toBe(200);
    });

    test("/user/password PATCH route should send an HTTP status code of 404 when the user to be updated cannot be found", async () => {
        const response = await request(app).patch("/user/password/2050").send({
            password: "pass456",
        });

        expect(response.statusCode).toBe(404);
    });

    test("/user/password PATCH route should send an HTTP status code of 422 when any of the fields are invalid", async () => {
        const response = await request(app)
            .patch("/user/password")
            .send({
                requester: { id: 1 },
                user: { id: 1 },
                newPassword: undefined,
            });

        expect(response.statusCode).toBe(422);
    });
});

describe("INTEGRATION TESTS FOR /user/ DELETE ROUTE", () => {
    test("/user/ DELETE route should deactivate the specified user and send an HTTP status code of 200", async () => {
        const user = await prisma.user.findUnique({
            where: { username: "quandale_dingleberry" },
        });

        const response = await request(app).delete(`/user/${user.id}`);

        expect(response.statusCode).toBe(200);

        const found = await prisma.user.findUnique({
            where: {
                username: "quandale_dingleberry",
            },
        });

        expect(found.isActive).toEqual(false);
    });

    test("/user/ DELETE route should send an HTTP status code of 404 when the user to be deactivated cannot be found", async () => {
        const response = await request(app).delete("/user/2049");

        expect(response.statusCode).toBe(404);
    });
});
