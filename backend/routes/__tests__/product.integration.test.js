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

describe.only("INTEGRATION TESTS FOR /product/ POST ROUTE", () => {
    test("/product/ POST route should create a product in the database and send an HTTP status code of 201 along with a message", async () => {
        const response = await request(app).post("/product/").send({
            name: "WASHING",
            price: 60.0,
        });

        expect(response.statusCode).toBe(201);
    });

    test("/product/ POST route should send an HTTP status code of 422 and send an error message when information provided to create a product is incomplete", async () => {
        const response = await request(app).post("/product/").send({
            name: "",
            price: 60.0,
        });

        expect(response.statusCode).toBe(422);
    });

    test("/product/ POST route should send an HTTP status code of 500 and send an error message when attempting to create a non-unique branch ", async () => {
        const response = await request(app).post("/product/").send({
            name: "WASH",
            price: 60.0,
        });

        expect(response.statusCode).toBe(500);
    });
});

describe.only("INTEGRATION TESTS FOR /product/ GET ROUTE", () => {
    test("/product/ GET route should get the queried product from the database and send an HTTP status code of 200", async () => {
        const response = await request(app).get("/product/1");

        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe(1);
    });

    test("/product/ GET route should send an HTTP status code of 422 if the provided productId in the query is null or undefined", async () => {
        const response = await request(app).get("/product/-1");

        expect(response.statusCode).toBe(422);
    });

    test("/product/ GET route should send an HTTP status code of 404 if the queried product cannot be found", async () => {
        const response = await request(app).get("/product/2077");

        expect(response.statusCode).toBe(404);
    });
});

describe("INTEGRATION TESTS FOR /product/all GET ROUTE", () => {
    test("/product/all GET route should get all products from the database and send an HTTP status code of 200", async () => {
        const response = await request(app)
            .get("/product/all")
            .send({
                requester: { id: 1 },
            });

        expect(response.statusCode).toBe(200);

        response.body.forEach((branch) => {
            expect(branch).toHaveProperty("id");
            expect(branch).toHaveProperty("name");
            expect(branch).toHaveProperty("price");
            expect(branch).toHaveProperty("isActive");
            expect(branch).toHaveProperty("createdAt");
            expect(branch).toHaveProperty("updatedAt");
        });

        const products = await prisma.product.findMany();

        expect(response.body.length).toEqual(products.length);
    });

    test("/product/all GET route should get all active products from the database and send an HTTP status code of 200", async () => {
        const response = await request(app)
            .get("/product/all")
            .send({
                requester: { id: 1 },
                filter: { isActive: true },
            });

        expect(response.statusCode).toBe(200);

        const products = await prisma.product.findMany({
            where: {
                isActive: true,
            },
        });

        expect(response.body.length).toEqual(products.length);
    });

    test("/product/all GET route should get all inactive products from the database and send an HTTP status code of 200", async () => {
        const response = await request(app)
            .get("/product/all")
            .send({
                requester: { id: 1 },
                filter: { isActive: false },
            });

        expect(response.statusCode).toBe(200);

        const products = await prisma.product.findMany({
            where: {
                isActive: false,
            },
        });

        expect(response.body.length).toEqual(products.length);
    });

    test("/product/all GET route should send an HTTP status code of 500 when the fields in the filter are invalid", async () => {
        const response = await request(app)
            .get("/product/all")
            .send({
                requester: { id: 1 },
                filter: { isPresent: false },
            });

        expect(response.statusCode).toBe(500);
    });
});

describe("INTEGRATION TESTS FOR /product/ PATCH ROUTE", () => {
    test("/product/ PATCH route should edit the specified product and send an HTTP status code of 200", async () => {
        const response = await request(app)
            .patch("/product/")
            .send({
                requester: { id: 1 },
                product: { id: 1 },
                edit: { name: "WASH", price: 90.0 },
            });

        expect(response.statusCode).toBe(200);

        console.log(response.body);

        const product = await prisma.product.findUnique({
            where: {
                id: 1,
            },
        });

        expect(product.price).toEqual(90.0);
    });

    test("/product/ PATCH route should send an HTTP status code of 422 when some the fields are either invalid or empty", async () => {
        const response = await request(app)
            .patch("/product/")
            .send({
                requester: { id: 1 },
                product: { id: 1 },
                edit: { name: "", price: null },
            });

        expect(response.statusCode).toBe(422);
    });
});

describe("INTEGRATION TESTS FOR /product/ DELETE ROUTE", () => {
    test("/product/ DELETE route should deactivate the specified product and send an HTTP status code of 200", async () => {
        let product = await prisma.product.findUnique({
            where: {
                name: "WASHING",
            },
        });

        const response = await request(app)
            .delete("/product/")
            .send({
                requester: { id: 1 },
                product: { id: product.id },
            });

        expect(response.statusCode).toBe(200);

        product = await prisma.product.findUnique({
            where: {
                id: product.id,
            },
        });

        expect(product.isActive).toEqual(false);
    });

    test("/product/ DELETE route should send an HTTP status code of 422 when an invalid product id is provided", async () => {
        const response = await request(app)
            .delete("/product/")
            .send({
                requester: { id: 1 },
                product: { id: null },
            });

        expect(response.statusCode).toBe(422);
    });
});
