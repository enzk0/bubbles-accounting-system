import { test, expect, describe, vi } from "vitest";
import {
    countJobOrders,
    createJobOrder,
    getJobOrder,
} from "../jobOrderController";
import prisma from "../../client";

const mockRequest = (body, user, params, query) => ({
    body: body,
    user: user,
    params: params,
    query: query,
});

const mockResponse = () => {
    const res = {};

    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    res.send = vi.fn().mockReturnValue(res);

    return res;
};

const mockRequestBody = {
    // requester: { id: 1 },
    branch: {
        id: 1,
    },
    customer: {
        firstName: "Vivian",
        lastName: "Banshee",
        address: "Sixth Street",
        phoneNumber: "973 995 4609",
    },
    jobOrder: {
        items: [
            {
                productId: 1,
                productName: "WASH",
                productPrice: 60.0,
                productQuantity: 0,
            },
            {
                productId: 2,
                productName: "DRY",
                productPrice: 70.0,
                productQuantity: 0,
            },
            {
                productId: 3,
                productName: "DETERGENT",
                productPrice: 15.0,
                productQuantity: 0,
            },
            {
                productId: 4,
                productName: "FABCON",
                productPrice: 15.0,
                productQuantity: 0,
            },
            {
                productId: 5,
                productName: "LOAD",
                productPrice: 20.0,
                productQuantity: 0,
            },
            {
                productId: 6,
                productName: "FOLD",
                productPrice: 20.0,
                productQuantity: 0,
            },
            {
                productId: 7,
                productName: "DROPOFF",
                productPrice: 180.0,
                productQuantity: 0,
            },
        ],
    },
};

describe("INTEGRATION TESTS FOR 'createJobOrder()' CONTROLLER", () => {
    test("createJobOrder() should create a jobOrder in the database and send an HTTP status code of 201", async () => {
        const req = mockRequest(mockRequestBody, { id: 1 }, {}, {});

        const res = mockResponse();

        let jobOrder = await createJobOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(typeof jobOrder).toBe("object");

        jobOrder = await prisma.jobOrder.findUnique({
            where: {
                idCode_idNumber: {
                    idCode: jobOrder.idCode,
                    idNumber: jobOrder.idNumber,
                },
            },
            include: {
                jobOrderItems: true,
                customer: true,
            },
        });

        expect(jobOrder.jobOrderItems.length).toEqual(7);
    });

    test("createJobOrder() should send an HTTP status code of 403 when branch information provided points to a inactive branch", async () => {
        const req = mockRequest(
            {
                ...mockRequestBody,
                branch: { id: 8 },
            },
            { id: 1 },
            {},
            {}
        );

        const res = mockResponse();

        let jobOrder = await createJobOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
    });

    test("createJobOrder() should send an HTTP status code of 403 when any of the job order items are inactive", async () => {
        const req = mockRequest(
            {
                ...mockRequestBody,
                jobOrder: {
                    items: [
                        {
                            productId: 1,
                            productName: "WASH",
                            productPrice: 60.0,
                            productQuantity: 0,
                        },
                        {
                            productId: 2,
                            productName: "DRY",
                            productPrice: 70.0,
                            productQuantity: 0,
                        },
                        {
                            productId: 3,
                            productName: "DETERGENT",
                            productPrice: 15.0,
                            productQuantity: 0,
                        },
                        {
                            productId: 4,
                            productName: "FABCON",
                            productPrice: 15.0,
                            productQuantity: 0,
                        },
                        {
                            productId: 5,
                            productName: "LOAD",
                            productPrice: 20.0,
                            productQuantity: 0,
                        },
                        {
                            productId: 8,
                            productName: "PERFUME",
                            productPrice: 50.0,
                            productQuantity: 0,
                        },
                        {
                            productId: 9,
                            productName: "IRON",
                            productPrice: 60.0,
                            productQuantity: 0,
                        },
                    ],
                },
            },
            { id: 1 },
            {},
            {}
        );

        console.log(req.body);

        const res = mockResponse();

        let jobOrder = await createJobOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
    });

    test("createJobOrder() should send an HTTP status code of 404 when branch information provided points to a branch that does not exist", async () => {
        const req = mockRequest(
            {
                ...mockRequestBody,
                branch: { id: 420 },
            },
            { id: 1 },
            {},
            {}
        );

        const res = mockResponse();

        let jobOrder = await createJobOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test("createJobOrder() should send an HTTP status code of 422 when there are less than 7 job order items", async () => {
        const req = mockRequest(
            {
                ...mockRequestBody,
                jobOrder: {
                    items: [
                        {
                            productId: 1,
                            productName: "WASH",
                            productPrice: 60.0,
                            productQuantity: 0,
                        },
                        {
                            productId: 2,
                            productName: "DRY",
                            productPrice: 70.0,
                            productQuantity: 0,
                        },
                        {
                            productId: 3,
                            productName: "DETERGENT",
                            productPrice: 15.0,
                            productQuantity: 0,
                        },
                        {
                            productId: 4,
                            productName: "FABCON",
                            productPrice: 15.0,
                            productQuantity: 0,
                        },
                    ],
                },
            },
            { id: 1 },
            {},
            {}
        );

        console.log(req.body);

        const res = mockResponse();

        let jobOrder = await createJobOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(422);
    });

    test("createJobOrder() should send an HTTP status code of 422 when customer information is incomplete", async () => {
        const req = mockRequest(
            { ...mockRequestBody, customer: {} },
            { id: 1 },
            {},
            {}
        );

        const res = mockResponse();

        let jobOrder = await createJobOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(422);
    });
});

describe("INTEGRATION TESTS FOR 'getJobOrder()' CONTROLLER", () => {
    test("getJobOrder() should send an HTTP status of 200 and send the specified job order from the database", async () => {
        const req = mockRequest(
            {},
            { id: 1 },
            {},
            { idCode: "AB", idNumber: 1 }
        );

        const res = mockResponse();

        const jobOrder = await getJobOrder(req, res);

        console.log(jobOrder);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(jobOrder.idCode).toEqual("AB");
        expect(jobOrder.idNumber).toEqual(1);
    });

    test("getJobOrder() should send an HTTP status of 404 when no job order can be found", async () => {
        const req = mockRequest(
            {},
            { id: 1 },
            {},
            { idCode: "AD", idNumber: 69420 }
        );

        const res = mockResponse();

        await getJobOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });
});

describe("INTEGRATION TESTS FOR 'countJobOrders()' CONTROLLER", () => {
    test("countJobOrders() should send an HTTP status of 200 and send an array of job order grouped by interval from the database", async () => {
        const req = mockRequest({}, { id: 1 }, {}, { interval: "day" });

        const res = mockResponse();

        let jobOrders = await countJobOrders(req, res);

        console.log(jobOrders);

        expect(res.status).toHaveBeenCalledWith(200);
    });
});
