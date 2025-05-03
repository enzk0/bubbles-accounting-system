import { test, expect, describe, vi } from "vitest";
import { createJobOrder } from "../jobOrderController";
import prisma from "../../client";

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

describe("INTEGRATION TEST SUITE FOR `jobOrder` CONTROLLERS", () => {
    test("createJobOrder() should create a jobOrder in the database", async () => {
        const req = mockRequest({
            requester: { id: 1 },
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
        });

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
});
