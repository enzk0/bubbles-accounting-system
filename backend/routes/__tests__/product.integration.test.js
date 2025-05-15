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
