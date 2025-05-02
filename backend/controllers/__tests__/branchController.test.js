import { test, expect, describe, vi } from "vitest";
import { createBranch } from "../branchController";
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

describe("UNIT TEST SUITE FOR 'createBranch()' CONTROLLER", () => {
  test("createBranch() should send an HTTP status code of 201 when a branch has been successfully created", async () => {
    const req = mockRequest({
      requester: { id: 1 },
      branch: { code: "OT", name: "Outpost", address: "Ark Outpost" },
    });

    const res = mockResponse();

    prismaMock.branch.create.mockResolvedValue({
      id: 1,
      code: "OT",
      name: "Outpost",
      address: "Ark Outpost",
      createdAt: new Date(),
      updatedAt: new Date(),
      counter: 1,
    });

    await createBranch(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("createBranch() should send an HTTP status code of 422 when some or all fields are empty", async () => {
    let req = mockRequest({
      requester: { id: 1 },
      branch: { code: "", name: "", address: "" },
    });

    const res = mockResponse();

    await createBranch(req, res);

    expect(res.status).toHaveBeenCalledWith(422);

    req = mockRequest({
      requester: { id: 1 },
      branch: { code: "", name: "Outpost", address: "Ark Outpost" },
    });

    await createBranch(req, res);

    expect(res.status).toHaveBeenCalledWith(422);

    req = mockRequest({
      requester: { id: 1 },
      branch: { code: "OT", name: "", address: "Ark Outpost" },
    });

    await createBranch(req, res);

    expect(res.status).toHaveBeenCalledWith(422);

    req = mockRequest({
      requester: { id: 1 },
      branch: { code: "OT", name: "Outpost", address: "" },
    });

    await createBranch(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
  });

  test("createBranch() should send an HTTP status code of 500 when an error with the database client occurs", async () => {
    const req = mockRequest({
      requester: { id: 1 },
      branch: { code: "OT", name: "Outpost", address: "Ark Outpost" },
    });

    const res = mockResponse();

    prismaMock.branch.create.mockImplementation(() => {
      let error = new Error();
      throw error;
    });

    await createBranch(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
