import request from "supertest";
import { test, expect, describe, vi } from "vitest";
import app from "../../app";
import prisma from "../../client";

vi.mock("../../middleware/auth", () => ({
    authenticate: (req, res, next) => {
        req.user = { id: 1 };
        next();
    },
}));

vi.mock("../../middleware/accessControl", () => ({
    checkPrivilege: (privileges) => (req, res, next) => {
        next();
    },
}));

describe("INTEGRATION TESTS FOR /api/user/ POST ROUTE", () => {
    test("/api/user/ POST route should create a user in the database and send an HTTP status code of 201", async () => {
        const response = await request(app)
            .post("/api/user/")
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

    test("/api/user/ POST route should send an HTTP status code of 422 when any of the fields are incmomplete or invalid", async () => {
        const response = await request(app)
            .post("/api/user/")
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

    test("/api/user/ POST route should send an HTTP status code of 500 when there is an attempt to make a duplicate/non-unique user", async () => {
        const response = await request(app)
            .post("/api/user/")
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

describe("INTEGRATION TESTS FOR /api/user/ GET ROUTE", () => {
    test("/api/user/ GET route should fetch a user in the database with the specified user id and send an HTTP status code of 200", async () => {
        const response = await request(app).get("/api/user/1");

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

    test("/api/user/ GET route should send an HTTP status code of 404 when the queried user does not exist or cannot be found", async () => {
        const response = await request(app).get("/api/user/999");

        expect(response.statusCode).toBe(404);
    });

    test("/api/user/ GET route should send an HTTP status code of 422 when the user id used in the query is invalid", async () => {
        const response = await request(app).get("/api/user/asdgkljasd");

        expect(response.statusCode).toBe(422);
    });
});

describe("INTEGRATION TESTS FOR /api/user/self GET ROUTE", () => {
    test("/api/user/self GET route should fetch the requesting user in the database and send an HTTP status code of 200", async () => {
        const response = await request(app).get("/api/user/self");

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

    test("/api/user/self GET route should fetch the requesting user in the database with the users' branch and send an HTTP status code of 200", async () => {
        const response = await request(app).get("/api/user/self?branch=true");

        expect(response.statusCode).toBe(200);

        expect(response.body.branch).toHaveProperty("code");
        expect(response.body.branch).toHaveProperty("name");
        expect(response.body.branch).toHaveProperty("address");
        expect(response.body.branch).toHaveProperty("counter");
        expect(response.body.branch).toHaveProperty("createdAt");
        expect(response.body.branch).toHaveProperty("updatedAt");
    });

    test("/api/user/self GET route should fetch the requesting user in the database with the users' job orders and send an HTTP status code of 200", async () => {
        const response = await request(app).get(
            "/api/user/self?jobOrders=true"
        );

        console.log(response.body);

        expect(response.statusCode).toBe(200);

        response.body.jobOrders.forEach((jobOrder) => {
            expect(jobOrder).toHaveProperty("idCode");
            expect(jobOrder).toHaveProperty("idNumber");
            expect(jobOrder).toHaveProperty("createdAt");
            expect(jobOrder).toHaveProperty("updatedAt");
            expect(jobOrder).toHaveProperty("paidAt");
            expect(jobOrder).toHaveProperty("claimedAt");
            expect(jobOrder).toHaveProperty("isPaid");
            expect(jobOrder).toHaveProperty("isClaimed");
            expect(jobOrder).toHaveProperty("isHidden");
            expect(jobOrder).toHaveProperty("remarks");
            expect(jobOrder).toHaveProperty("branchId");
            expect(jobOrder).toHaveProperty("customerId");
            expect(jobOrder).toHaveProperty("userId");
            expect(jobOrder).toHaveProperty("branch");
            expect(jobOrder).toHaveProperty("user");
            expect(jobOrder).toHaveProperty("customer");
            expect(jobOrder).toHaveProperty("jobOrderItems");
            expect(jobOrder.branchId).toEqual(response.body.branchId);
        });
    });
});

describe("INTEGRATION TESTS FOR /api/user/all GET ROUTE", () => {
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

    test("/api/user/all GET route should get all users in the database and send an HTTP status code of 200", async () => {
        const response = await request(app).get("/api/user/all");

        expect(response.statusCode).toBe(200);

        response.body.forEach((user) => {
            assertUser(user);
        });
    });

    test("/api/user/all GET route should get all users in the database who has a role of employee and send an HTTP status code of 200", async () => {
        const response = await request(app).get("/api/user/all?roleId=2");

        expect(response.statusCode).toBe(200);

        response.body.forEach((user) => {
            assertUser(user);
            expect(user.roleId).toEqual(2);
        });
    });

    test("/api/user/all GET route should get all users in the database who are active and send an HTTP status code of 200", async () => {
        const response = await request(app).get("/api/user/all?isActive=true");

        expect(response.statusCode).toBe(200);

        response.body.forEach((user) => {
            assertUser(user);
            expect(user.isActive).toEqual(true);
        });
    });

    test("/api/user/all GET route should get all users in the database who are inactive and send an HTTP status code of 200", async () => {
        const response = await request(app).get("/api/user/all?isActive=false");

        expect(response.statusCode).toBe(200);

        console.log(response.body);

        response.body.forEach((user) => {
            assertUser(user);
            expect(user.isActive).toEqual(false);
        });
    });

    test("/api/user/all GET route should send an HTTP status code of 404 when no users can be found in the database when a filter is applied", async () => {
        const response = await request(app).get("/api/user/all?roleId=3");

        expect(response.statusCode).toBe(404);
    });
});

describe("INTEGRATION TESTS FOR /api/user/:id PATCH ROUTE", () => {
    test("/api/user/:id PATCH route should edit the specified in the database and send an HTTP status code of 200", async () => {
        const user = await prisma.user.findUnique({
            where: {
                username: "quandale_dingle",
            },
        });

        console.log(user);

        const response = await request(app).patch(`/api/user/${user.id}`).send({
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

    test("/api/user/:id PATCH route should send an HTTP status code of 404 when the user to be updated cannot be found", async () => {
        const response = await request(app).patch("/api/user/2077").send({
            username: "anachiro",
            firstName: "Anachiro",
            lastName: "Grimms",
        });

        expect(response.statusCode).toBe(404);
    });

    test("/api/user/:id PATCH route should send an HTTP status code of 422 when any of the fields are invalid", async () => {
        const response = await request(app).patch("/api/user/1").send({
            username: "",
            firstName: null,
            lastName: undefined,
        });

        expect(response.statusCode).toBe(422);
    });
});

describe("INTEGRATION TESTS FOR /api/user/password PATCH ROUTE", () => {
    test("/api/user/password PATCH route updated the password of a user in the database and send an HTTP status code of 200", async () => {
        const user = await prisma.user.findUnique({
            where: { username: "quandale_dingleberry" },
        });

        const response = await request(app)
            .patch(`/api/user/password/${user.id}`)
            .send({
                password: "pass456",
            });

        expect(response.statusCode).toBe(200);
    });

    test("/api/user/password PATCH route should send an HTTP status code of 404 when the user to be updated cannot be found", async () => {
        const response = await request(app)
            .patch("/api/user/password/2050")
            .send({
                password: "pass456",
            });

        expect(response.statusCode).toBe(404);
    });

    test("/api/user/password PATCH route should send an HTTP status code of 422 when any of the fields are invalid", async () => {
        const response = await request(app)
            .patch("/api/user/password")
            .send({
                requester: { id: 1 },
                user: { id: 1 },
                newPassword: undefined,
            });

        expect(response.statusCode).toBe(422);
    });
});

describe("INTEGRATION TESTS FOR /api/user/ DELETE ROUTE", () => {
    test("/api/user/ DELETE route should deactivate the specified user and send an HTTP status code of 200", async () => {
        const user = await prisma.user.findUnique({
            where: { username: "quandale_dingleberry" },
        });

        const response = await request(app).delete(`/api/user/${user.id}`);

        expect(response.statusCode).toBe(200);

        const found = await prisma.user.findUnique({
            where: {
                username: "quandale_dingleberry",
            },
        });

        expect(found.isActive).toEqual(false);
    });

    test("/api/user/ DELETE route should send an HTTP status code of 404 when the user to be deactivated cannot be found", async () => {
        const response = await request(app).delete("/api/user/2049");

        expect(response.statusCode).toBe(404);
    });
});
