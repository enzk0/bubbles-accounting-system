import { test, expect, describe, vi } from "vitest";
import { createJobOrder } from "../jobOrderController";
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

describe("UNIT TEST SUITE FOR 'createJobOrder()' CONTROLLER", () => {
  test("createJobOrder() should send an HTTP status code of 201 when a job order is successfully created", async () => {
    const req = mockRequest({
      requester: { id: 2 },
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
    });

    const res = mockResponse();

    prismaMock.branch.findUnique.mockResolvedValue({
      id: req.body.branch.id,
      code: "GE",
      name: "Gran Europa",
      address: "Upper Carmen",
      counter: 1,
      createdAt: new Date(),
    });

    prismaMock.jobOrder.create.mockResolvedValue({
      idCode: "GE",
      idNumber: "1",
      branchId: req.body.branch.id,
      customerId: 1,
      userId: req.body.requester.id,
    });

    await createJobOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("createJobOrder() should send a HTTP status code of 404 if queried branch cannot be found", async () => {
    let req = mockRequest({
      requester: {},
      branch: {},
      customer: {
        firstName: "Vivian",
        lastName: "Banshee",
        address: "Sixth Street",
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
    });

    let res = mockResponse();

    prismaMock.branch.findUnique.mockResolvedValue(null);

    await createJobOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("createJobOrder() should send a HTTP status code of 422 if there are less than 7 job order items in the request", async () => {
    const req = mockRequest({
      requester: { id: 2 },
      branch: {
        id: 1,
      },
      customer: {
        firstName: "",
        lastName: "Banshee",
        address: "Sixth Street",
        contactNo: "973 995 4609",
      },
      jobOrder: {
        items: [],
      },
    });

    const res = mockResponse();

    await createJobOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
  });

  test("createJobOrder() should send a HTTP status code of 422 if either the firstName or lastName of the customer is empty", async () => {
    const req = mockRequest({
      requester: { id: 2 },
      branch: {
        id: 1,
      },
      customer: {
        firstName: "Vivian",
        lastName: "Banshee",
        address: "Sixth Street",
        contactNo: "973 995 4609",
      },
      jobOrder: {
        items: [],
      },
    });
    const res = mockResponse();

    await createJobOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
  });

  test("createJobOrder() should send a HTTP status code 500 if an error occurs with the database client", async () => {
    let req = mockRequest({
      requester: {},
      branch: {},
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
    });

    let res = mockResponse();

    prismaMock.branch.findUnique.mockImplementation(() => {
      let error = new Error();
      throw error;
    });

    await createJobOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
