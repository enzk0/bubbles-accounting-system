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

describe("INTEGRATION TESTS FOR /branch/ POST ROUTE", () => {
    test("/branch/ POST route should create a branch in the database and send an HTTP status code of 200 along with a message", async () => {
        const response = await request(app)
            .post("/branch/")
            .send({
                requester: { id: 1 },
                branch: { code: "LA", name: "Lala Land", address: "Lala Land" },
            });

        console.log(response.body);

        expect(response.statusCode).toBe(201);
    });

    test("/branch/ POST route should send an HTTP status code of 500 and send an error message when attempting to create a non-unique branch ", async () => {
        const response = await request(app)
            .post("/branch/")
            .send({
                requester: { id: 1 },
                branch: { code: "LA", name: "Lala Land", address: "Lala Land" },
            });

        expect(response.statusCode).toBe(500);
    });

    test("/branch/ POST route should send an HTTP status code of 422 and send an error message when information provided to create a branch is incomplete", async () => {
        const response = await request(app)
            .post("/branch/")
            .send({
                requester: { id: 1 },
                branch: { code: "", name: "", address: "" },
            });

        expect(response.statusCode).toBe(422);
    });
});

describe("INTEGRATION TESTS FOR /branch/ GET ROUTE", () => {
    test("/branch/ GET route should get the queried branch from the database and send an HTTP status code of 200", async () => {
        const response = await request(app)
            .get("/branch/")
            .send({
                requester: { id: 1 },
                branch: { id: 1 },
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe(1);
    });

    test("/branch/ GET route should send an HTTP status code of 422 if the provided branchId in the query is null or undefined", async () => {
        const response = await request(app)
            .get("/branch/")
            .send({
                requester: { id: 1 },
                branch: { id: null },
            });

        expect(response.statusCode).toBe(422);
    });

    test("/branch/ GET route should send an HTTP status code of 404 if the provided branchId in the query is null or undefined", async () => {
        const response = await request(app)
            .get("/branch/")
            .send({
                requester: { id: 1 },
                branch: { id: 2077 },
            });

        expect(response.statusCode).toBe(404);
    });
});

describe("INTEGRATION TESTS FOR /branch/all GET ROUTE", () => {
    test("/branch/all GET route should get all branches from the database and send an HTTP status code of 200", async () => {
        const response = await request(app)
            .get("/branch/all")
            .send({
                requester: { id: 1 },
                filter: {},
            });

        expect(response.statusCode).toBe(200);

        console.log(response.body);

        const branches = await prisma.branch.findMany();

        expect(response.body.length).toEqual(branches.length);
    });

    test("/branch/all GET route should get all active branches from the database and send an HTTP status code of 200", async () => {
        const response = await request(app)
            .get("/branch/all")
            .send({
                requester: { id: 1 },
                filter: { isActive: true },
            });

        expect(response.statusCode).toBe(200);

        console.log(response.body);

        const branches = await prisma.branch.findMany({
            where: {
                isActive: true,
            },
        });

        expect(response.body.length).toEqual(branches.length);
    });

    test("/branch/all GET route should get all inactive branches from the database and send an HTTP status code of 200", async () => {
        const response = await request(app)
            .get("/branch/all")
            .send({
                requester: { id: 1 },
                filter: { isActive: false },
            });

        expect(response.statusCode).toBe(200);

        console.log(response.body);

        const branches = await prisma.branch.findMany({
            where: {
                isActive: false,
            },
        });

        expect(response.body.length).toEqual(branches.length);
    });

    test("/branch/all GET route should send an HTTP status code of 500 when the fields in the filter are invalid", async () => {
        const response = await request(app)
            .get("/branch/all")
            .send({
                requester: { id: 1 },
                filter: { isPresent: false },
            });

        expect(response.statusCode).toBe(500);
    });
});

describe("INTEGRATION TESTS FOR /branch/ PATCH ROUTE", () => {
    test("/branch/ PATCH route should edit the specified branch and send an HTTP status code of 200", async () => {
        const response = await request(app)
            .patch("/branch/")
            .send({
                requester: { id: 1 },
                branch: { id: 1 },
                edit: { name: "Ambrosia", address: "Somewhere City" },
            });

        expect(response.statusCode).toBe(200);

        console.log(response.body);

        const branch = await prisma.branch.findUnique({
            where: {
                id: 1,
            },
        });

        expect(branch.name).toEqual("Ambrosia");
        expect(branch.address).toEqual("Somewhere City");
    });

    test("/branch/ PATCH route should send an HTTP status code of 422 when some the fields are either invalid or empty", async () => {
        const response = await request(app)
            .patch("/branch/")
            .send({
                requester: { id: 1 },
                branch: { id: 1 },
                edit: { name: "Ambrosia", address: "" },
            });

        expect(response.statusCode).toBe(422);
    });
});

describe("INTEGRATION TESTS FOR /branch/ DELETE ROUTE", () => {
    test("/branch/ DELETE route should deactivate the specified branch and send an HTTP status code of 200", async () => {
        const response = await request(app)
            .delete("/branch/")
            .send({
                requester: { id: 1 },
                branch: { id: 1 },
            });

        expect(response.statusCode).toBe(200);

        const branch = await prisma.branch.findUnique({
            where: {
                id: 1,
            },
        });

        expect(branch.isActive).toEqual(false);
    });

    test("/branch/ DELETE route should send an HTTP status code of 422 when an invalid branch id is provided", async () => {
        const response = await request(app)
            .delete("/branch/")
            .send({
                requester: { id: 1 },
                branch: { id: null },
            });

        expect(response.statusCode).toBe(422);
    });
});
