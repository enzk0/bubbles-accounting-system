import { test, expect, describe, vi } from "vitest";
import { createProduct } from "../productController";
import { prismaMock } from "../../singleton";

const mockRequest = (body) => ({
    body: body,
});

const mockResponse = () => {
    const res = {};

    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    res.send = vi.fn().mockReturnValue(res);

    return res;
};

describe("UNIT TEST SUITE FOR 'createProduct()' CONTROLLER", () => {
    test("createProduct should create a product in the database and send a HTTP status code of 201", async () => {
        const req = mockRequest({
            requester: { id: 1 },
            product: { name: "WASH", price: 60.0 },
        });

        const res = mockResponse();

        prismaMock.product.create.mockResolvedValue({
            id: 1,
            name: "WASH",
            price: 60.0,
        });

        const createdProduct = await createProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(typeof createdProduct).toBe("object");
    });

    test("createProduct should send an HTTP status code of 422 if any of the fields are missing", async () => {
        let req = mockRequest({
            requester: { id: 1 },
            product: { name: "", price: 60.0 },
        });

        const res = mockResponse();

        await createProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(422);

        req = mockRequest({
            requester: { id: 1 },
            product: { name: "WASH", price: null },
        });

        await createProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(422);

        req = mockRequest({
            requester: { id: 1 },
            product: { name: "", price: null },
        });

        await createProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(422);
    });

    test("createProduct should send an HTTP status code of 500 when an error occurs with the database client", async () => {
        const req = mockRequest({
            requester: { id: 1 },
            product: { name: "WASH", price: 60.0 },
        });

        const res = mockResponse();

        prismaMock.product.create.mockImplementation(() => {
            throw new Error();
        });

        await createProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});

describe("UNIT TEST SUITE FOR 'getProduct()' CONTROLLER", () => {});

describe("UNIT TEST SUITE FOR 'getActiveProducts()' CONTROLLER", () => {});

describe("UNIT TEST SUITE FOR 'getAllProducts()' CONTROLLER", () => {});

describe("UNIT TEST SUITE FOR 'editProduct()' CONTROLLER", () => {});

describe("UNIT TEST SUITE FOR 'deactivateProduct()' CONTROLLER", () => {});
