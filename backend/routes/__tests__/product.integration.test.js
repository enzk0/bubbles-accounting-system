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

describe("INTEGRATION TESTS FOR /product/ POST ROUTE", () => {
    test("/product/ POST route should create a product in the database and send an HTTP status code of 201 along with a message", async () => {
        const response = await request(app)
            .post("/product/")
            .send({
                requester: { id: 1 },
                product: { name: "WASHING", price: 60.0 },
            });

        expect(response.statusCode).toBe(201);
    });

    test("/product/ POST route should send an HTTP status code of 422 and send an error message when information provided to create a product is incomplete", async () => {
        const response = await request(app)
            .post("/product/")
            .send({
                requester: { id: 1 },
                product: { name: "", price: 60.0 },
            });

        expect(response.statusCode).toBe(422);
    });

    test("/product/ POST route should send an HTTP status code of 500 and send an error message when attempting to create a non-unique branch ", async () => {
        const response = await request(app)
            .post("/product/")
            .send({
                requester: { id: 1 },
                product: { name: "WASH", price: 60.0 },
            });

        expect(response.statusCode).toBe(500);
    });
});

describe("INTEGRATION TESTS FOR /product/ GET ROUTE", () => {
    test("/product/ GET route should get the queried product from the database and send an HTTP status code of 200", async () => {
        const response = await request(app)
            .get("/product/")
            .send({
                requester: { id: 1 },
                product: { id: 1 },
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe(1);
    });

    test("/product/ GET route should send an HTTP status code of 422 if the provided productId in the query is null or undefined", async () => {
        const response = await request(app)
            .get("/product/")
            .send({
                requester: { id: 1 },
                product: { id: null },
            });

        expect(response.statusCode).toBe(422);
    });

    test("/product/ GET route should send an HTTP status code of 404 if the queried product cannot be found", async () => {
        const response = await request(app)
            .get("/product/")
            .send({
                requester: { id: 1 },
                product: { id: 2077 },
            });

        expect(response.statusCode).toBe(404);
    });
});
