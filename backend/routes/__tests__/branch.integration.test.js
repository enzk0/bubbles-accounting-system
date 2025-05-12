import request from "supertest";
import { test, expect, describe, vi } from "vitest";
import app from "../../app";

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

describe("INTEGRATION TESTS FOR /branch/ POST ROUTE W/O MIDDLEWARE", () => {
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

