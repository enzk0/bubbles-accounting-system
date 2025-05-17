import { test, expect, describe, vi } from "vitest";
import {
    countJobOrders,
    createJobOrder,
    getAllJobOrders,
    getJobOrder,
} from "../jobOrderController";
import { prismaMock, customMock } from "../../singleton";

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
    branch: {
        id: 1,
    },
    customer: {
        firstName: "Vivian",
        lastName: "Banshee",
        address: "Nazareth",
        contactNo: "973 995 4609",
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
                productName: "WASH",
                productPrice: 70.0,
                productQuantity: 0,
            },
            {
                productId: 3,
                productName: "WASH",
                productPrice: 15.0,
                productQuantity: 0,
            },
            {
                productId: 4,
                productName: "WASH",
                productPrice: 15.0,
                productQuantity: 0,
            },
            {
                productId: 5,
                productName: "WASH",
                productPrice: 20.0,
                productQuantity: 0,
            },
            {
                productId: 6,
                productName: "WASH",
                productPrice: 20.0,
                productQuantity: 0,
            },
            {
                productId: 7,
                productName: "WASH",
                productPrice: 180.0,
                productQuantity: 0,
            },
        ],
    },
};

describe("UNIT TEST SUITE FOR 'createJobOrder()' CONTROLLER", () => {
    test("createJobOrder() should send an HTTP status code of 201 when a job order is successfully created", async () => {
        const req = mockRequest(mockRequestBody, { id: 1 }, {}, {});

        const res = mockResponse();

        prismaMock.branch.findUnique.mockResolvedValue({
            id: req.body.branch.id,
            code: "GE",
            name: "Gran Europa",
            address: "Upper Carmen",
            counter: 1,
            createdAt: new Date(),
        });

        prismaMock.product.findUnique.mockResolvedValue({
            id: 7,
            name: "WASH",
            price: 180.0,
            isActive: true,
        });

        prismaMock.jobOrder.create.mockResolvedValue({
            idCode: "GE",
            idNumber: "1",
            branchId: req.body.branch.id,
            customerId: 1,
            userId: req.user.id,
        });

        await createJobOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
    });

    test("createJobOrder() should send an HTTP status code of 403 when either branch or product is not active/is deactivated", async () => {
        const req = mockRequest(mockRequestBody, { id: 1 }, {}, {});

        const res = mockResponse();

        prismaMock.branch.findUnique.mockResolvedValue({
            id: req.body.branch.id,
            code: "GE",
            name: "Gran Europa",
            address: "Upper Carmen",
            counter: 1,
            createdAt: new Date(),
            isActive: false,
        });

        prismaMock.product.findUnique.mockResolvedValue({
            id: 7,
            name: "WASH",
            price: 180.0,
            isActive: false,
        });

        prismaMock.jobOrder.create.mockResolvedValue({
            idCode: "GE",
            idNumber: "1",
            branchId: req.body.branch.id,
            customerId: 1,
            userId: req.user.id,
        });

        await createJobOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
    });

    test("createJobOrder() should send a HTTP status code of 404 if queried branch cannot be found", async () => {
        const req = mockRequest(mockRequestBody, { id: 1 }, {}, {});

        const res = mockResponse();

        prismaMock.branch.findUnique.mockResolvedValue(null);

        await createJobOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test("createJobOrder() should send a HTTP status code of 422 if there are less than 7 job order items in the request", async () => {
        const req = mockRequest(
            { ...mockRequestBody, jobOrder: { items: [] } },
            { id: 2 },
            {},
            {}
        );

        const res = mockResponse();

        await createJobOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(422);
    });

    test("createJobOrder() should send a HTTP status code of 422 if either the firstName or lastName of the customer is empty", async () => {
        const req = mockRequest(
            {
                ...mockRequestBody,
                customer: {
                    firstName: "Vivian",
                    lastName: "",
                    address: "Sixth Street",
                    contactNo: "973 995 4609",
                },
            },
            { id: 2 },
            {},
            {}
        );

        const res = mockResponse();

        await createJobOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(422);
    });

    test("createJobOrder() should send a HTTP status code 500 if an error occurs with the database client", async () => {
        const req = mockRequest(mockRequestBody, { id: 1 }, {}, {});

        let res = mockResponse();

        prismaMock.branch.findUnique.mockImplementation(() => {
            let error = new Error();
            throw error;
        });

        await createJobOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});

describe("UNIT TEST SUITE FOR 'getJobOrder()' CONTROLLER", () => {
    test("getJobOrder() should send an HTTP status of 200 and send the specified job order", async () => {
        const req = mockRequest(
            {},
            { id: 1 },
            {},
            { idCode: "AB", idNumber: 1234 }
        );

        const res = mockResponse();

        prismaMock.jobOrder.findUnique.mockResolvedValue({
            idCode: "AB",
            idNumber: 1234,

            createdAt: new Date(),
            updatedAt: new Date(),

            isPaid: false,
            isClaimed: false,
            isHidden: false,
        });

        const jobOrder = await getJobOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    test("getJobOrder() should send an HTTP status of 404 when no job order can be found", async () => {
        const req = mockRequest(
            {},
            { id: 1 },
            {},
            { idCode: "AB", idNumber: 1234 }
        );

        const res = mockResponse();

        prismaMock.jobOrder.findUnique.mockResolvedValue(null);

        await getJobOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test("getJobOrder() should send an HTTP status of 422 when idCode or idNumber is invalid", async () => {
        let req = mockRequest(
            {},
            { id: 1 },
            {},
            { idCode: "", idNumber: 1234 }
        );

        const res = mockResponse();

        let jobOrder = await getJobOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(422);

        req = mockRequest({}, { id: 1 }, {}, { idCode: "AB", idNumber: null });
        jobOrder = await getJobOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(422);

        req = mockRequest({}, { id: 1 }, {}, { idCode: "", idNumber: null });
        jobOrder = await getJobOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(422);
    });

    test("getJobOrder() should send an HTTP status of 500 when an error occurs", async () => {
        const req = mockRequest(
            {},
            { id: 1 },
            {},
            { idCode: "AB", idNumber: 1234 }
        );

        const res = mockResponse();

        prismaMock.jobOrder.findUnique.mockImplementation(() => {
            throw new Error();
        });

        await getJobOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});

describe("UNIT TEST SUITE FOR 'getAllJobOrders()' CONTROLLER", () => {
    test("getAllJobOrders() should send an HTTP status of 200 and send an array of all job orders", async () => {
        const req = mockRequest({}, { id: 1 }, {}, {});

        const res = mockResponse();

        prismaMock.jobOrder.findMany.mockResolvedValue([
            {
                idCode: "AB",
                idNumber: 1234,

                createdAt: new Date(),
                updatedAt: new Date(),

                isPaid: false,
                isClaimed: false,
                isHidden: false,
            },
        ]);

        const jobOrder = await getAllJobOrders(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    test("getAllJobOrders() should send an HTTP status of 404 when no job order can be found", async () => {
        const req = mockRequest({}, { id: 1 }, {}, {});

        const res = mockResponse();

        prismaMock.jobOrder.findMany.mockResolvedValue([]);

        const jobOrder = await getAllJobOrders(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test("getJobOrder() should send an HTTP status of 500 when an error occurs", async () => {
        const req = mockRequest({}, { id: 1 }, {}, {});

        const res = mockResponse();

        prismaMock.jobOrder.findMany.mockImplementation(() => {
            throw new Error();
        });

        await getAllJobOrders(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});

describe("UNIT TEST SUITE FOR 'countJobOrders()' CONTROLLER", () => {
    test("countJobOrders() should send an HTTP status of 200 and send an array of all job orders", async () => {
        const req = mockRequest({}, { id: 1 }, {}, { interval: "daily" });

        const res = mockResponse();

        customMock.jobOrder.groupByDate.mockResolvedValue([
            {
                interval_start: "2024-05-01T00:00:00Z",
                total: 1000,
                total_paid: 700,
                total_unpaid: 300,
                no_of_job_orders: 5,
                no_of_paid: 3,
                no_of_unpaid: 2,
                no_of_claimed: 2,
                no_of_unclaimed: 3,
            },
        ]);

        const jobOrders = await countJobOrders(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    test("countJobOrders() should send an HTTP status of 404 when no job order can be grouped", async () => {
        const req = mockRequest({}, { id: 1 }, {}, { interval: "daily" });

        const res = mockResponse();

        customMock.jobOrder.groupByDate.mockResolvedValue([]);

        const jobOrders = await countJobOrders(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test("countJobOrders() should send an HTTP status of 422 when interval provided is not supported", async () => {
        const req = mockRequest({}, { id: 1 }, {}, { interval: "deliciously" });

        const res = mockResponse();

        customMock.jobOrder.groupByDate.mockResolvedValue([]);

        const jobOrders = await countJobOrders(req, res);

        expect(res.status).toHaveBeenCalledWith(422);
    });

    test("countJobOrders() should send an HTTP status of 500 when an error occurs", async () => {
        const req = mockRequest({}, { id: 1 }, {}, { interval: "deliciously" });

        const res = mockResponse();

        customMock.jobOrder.groupByDate.mockImplementation(() => {
            throw new Error();
        });

        const jobOrders = await countJobOrders(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});
