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

describe("INTEGRATION TESTS FOR /api/branch/ POST ROUTE", () => {
    test("/api/branch/ POST route should create a branch in the database and send an HTTP status code of 200 along with a message", async () => {
        const response = await request(app).post("/api/branch/").send({
            code: "LA",
            name: "Lala Land",
            address: "Lala Land",
        });

        console.log(response.body);

        expect(response.statusCode).toBe(201);
    });

    test("/api/branch/ POST route should send an HTTP status code of 500 and send an error message when attempting to create a non-unique branch ", async () => {
        const response = await request(app).post("/api/branch/").send({
            code: "LA",
            name: "Lala Land",
            address: "Lala Land",
        });

        expect(response.statusCode).toBe(500);
    });

    test("/api/branch/ POST route should send an HTTP status code of 422 and send an error message when information provided to create a branch is incomplete", async () => {
        const response = await request(app)
            .post("/api/branch/")
            .send({
                requester: { id: 1 },
                branch: { code: "", name: "", address: "" },
            });

        expect(response.statusCode).toBe(422);
    });
});

describe("INTEGRATION TESTS FOR /api/branch/:id GET ROUTE", () => {
    test("/api/branch/:id GET route should get the queried branch from the database and send an HTTP status code of 200", async () => {
        const response = await request(app).get("/api/branch/1");

        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe(1);
    });

    test("/api/branch/:id GET route should send an HTTP status code of 422 if the provided branchId in the query is null or undefined", async () => {
        const response = await request(app).get("/api/branch/0");

        expect(response.statusCode).toBe(422);
    });

    test("/api/branch/:id GET route should send an HTTP status code of 404 if the provided branchId in the query is null or undefined", async () => {
        const response = await request(app).get("/api/branch/2077");

        expect(response.statusCode).toBe(404);
    });
});

describe("INTEGRATION TESTS FOR /api/branch/all GET ROUTE", () => {
    test("/api/branch/all GET route should get all branches from the database and send an HTTP status code of 200", async () => {
        const response = await request(app).get("/api/branch/all");

        expect(response.statusCode).toBe(200);

        response.body.forEach((branch) => {
            expect(branch).toHaveProperty("name");
            expect(branch).toHaveProperty("address");
            expect(branch).toHaveProperty("code");
            expect(branch).toHaveProperty("id");
            expect(branch).toHaveProperty("counter");
            expect(branch).toHaveProperty("isActive");
            expect(branch).toHaveProperty("createdAt");
            expect(branch).toHaveProperty("updatedAt");
        });

        const branches = await prisma.branch.findMany();

        expect(response.body.length).toEqual(branches.length);
    });

    test("/api/branch/all GET route should get all active branches from the database and send an HTTP status code of 200", async () => {
        const response = await request(app).get(
            "/api/branch/all?isActive=true"
        );

        expect(response.statusCode).toBe(200);

        console.log(response.body);

        const branches = await prisma.branch.findMany({
            where: {
                isActive: true,
            },
        });

        expect(response.body.length).toEqual(branches.length);
    });

    test("/api/branch/all GET route should get all inactive branches from the database and send an HTTP status code of 200", async () => {
        const response = await request(app).get(
            "/api/branch/all?isActive=false"
        );

        expect(response.statusCode).toBe(200);

        console.log(response.body);

        const branches = await prisma.branch.findMany({
            where: {
                isActive: false,
            },
        });

        expect(response.body.length).toEqual(branches.length);
    });
});

describe("INTEGRATION TESTS FOR /api/branch/:id PATCH ROUTE", () => {
    test("/api/branch/:id PATCH route should edit the specified branch and send an HTTP status code of 200", async () => {
        const response = await request(app).patch("/api/branch/1").send({
            name: "Ambrosia",
            address: "Somewhere City",
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

    test("/api/branch/:id PATCH route should send an HTTP status code of 422 when some the fields are either invalid or empty", async () => {
        const response = await request(app).patch("/api/branch/1").send({
            name: "Ambrosia",
            address: "",
        });

        expect(response.statusCode).toBe(422);
    });
});

describe("INTEGRATION TESTS FOR /api/branch/:id DELETE ROUTE", () => {
    test("/api/branch/:id DELETE route should deactivate the specified branch and send an HTTP status code of 200", async () => {
        const response = await request(app).delete("/api/branch/1");

        expect(response.statusCode).toBe(200);

        const branch = await prisma.branch.findUnique({
            where: {
                id: 1,
            },
        });

        expect(branch.isActive).toEqual(false);
    });

    test("/api/branch/id DELETE route should send an HTTP status code of 422 when an invalid branch id is provided", async () => {
        const response = await request(app).delete("/api/branch/0");

        expect(response.statusCode).toBe(422);
    });
});
