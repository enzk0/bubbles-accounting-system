import { test, expect, describe, vi } from "vitest";
import {
    createBranch,
    getBranch,
    getAllBranches,
    editBranch,
    deactivateBranch,
} from "../branchController";
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

describe("INTEGRATION TESTS FOR BRANCH CONTROLLER", () => {
    test("createBranch() should create a branch in the database and send an HTTP status code of 201", async () => {
        const req = mockRequest(
            {
                code: "OT",
                name: "Outpost",
                address: "Ark Outpost",
            },
            { id: 1 }
        );

        const res = mockResponse();

        const createdBranch = await createBranch(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(typeof createdBranch).toBe("object");

        const foundBranch = await prisma.branch.findUnique({
            where: {
                id: createdBranch.id,
            },
        });

        expect(typeof foundBranch).toBe("object");
        expect(foundBranch.id).toEqual(createdBranch.id);
    });

    test("createBranch() should throw an error if there are missing required fields and send an HTTP status code of 422", async () => {
        const req = mockRequest(
            {
                code: "OT",
                name: "",
                address: "Ark Outpost",
            },
            { id: 1 }
        );

        const res = mockResponse();

        const createdBranch = await createBranch(req, res);

        expect(res.status).toHaveBeenCalledWith(422);
    });

    test("getBranch() should get the queried branch from the database and send an HTTP status code of 200", async () => {
        const req = mockRequest({}, { id: 1 }, { id: "1" }, {});

        const res = mockResponse();

        const foundBranch = await getBranch(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.any(Object));
        expect(typeof foundBranch).toBe("object");
        expect(foundBranch.id).toEqual(parseInt(req.params.id));
    });

    test("getBranch() should send an HTTP status code of 422 if the provided branchId in the query is null or undefined", async () => {
        const req = mockRequest({}, { id: 1 }, { id: 0 }, {});

        const res = mockResponse();

        const foundBranch = await getBranch(req, res);

        expect(res.status).toHaveBeenCalledWith(422);
    });

    test("getAllBranches() should get all the branches in the database and send an HTTP status code of 200", async () => {
        const req = mockRequest({}, { id: 1 }, {}, {});

        const res = mockResponse();

        const foundBranches = await getAllBranches(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.any(Array));
        expect(typeof foundBranches).toBe("object");
    });

    test("getAllBranches() should get all inactive branches in the database and send an HTTP status code of 200", async () => {
        const req = mockRequest({}, { id: 1 }, {}, { isActive: "false" });

        const res = mockResponse();

        const foundBranches = await getAllBranches(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.any(Array));
        expect(typeof foundBranches).toBe("object");

        for (const branch of foundBranches) {
            console.log(branch);
            expect(branch.isActive).toEqual(false);
        }
    });

    test("getAllBranches() should get all active branches in the database and send an HTTP status code of 200", async () => {
        const req = mockRequest({}, { id: 1 }, {}, { isActive: "true" });

        const res = mockResponse();

        const foundBranches = await getAllBranches(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.any(Array));
        expect(typeof foundBranches).toBe("object");

        for (const branch of foundBranches) {
            console.log(branch);
            expect(branch.isActive).toEqual(true);
        }
    });

    test("editBranch() should update a branch in the database and send an HTTP status code of 200", async () => {
        const req = mockRequest(
            {
                name: "Ambrosia",
                address: "Somewhere City",
            },
            { id: 1 },
            { id: "1" },
            {}
        );

        const res = mockResponse();

        const updatedBranch = await editBranch(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(typeof updatedBranch).toBe("object");

        const foundBranch = await prisma.branch.findUnique({
            where: {
                id: updatedBranch.id,
            },
        });

        expect(foundBranch.id).toEqual(updatedBranch.id);
    });

    test("editBranch() should send an HTTP status code of 422 when some of the fields in the query are empty ", async () => {
        const req = mockRequest(
            {
                name: "",
                address: "Somewhere City",
            },
            { id: 1 },
            { id: "1" },
            {}
        );

        const res = mockResponse();

        const updatedBranch = await editBranch(req, res);

        expect(res.status).toHaveBeenCalledWith(422);
    });

    test("deactivateBranch() should deactivate the queried branch from the database and send an HTTP status code of 200", async () => {
        const req = mockRequest({}, { id: 1 }, { id: 1 }, {});

        const res = mockResponse();

        const updatedBranch = await deactivateBranch(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(typeof updatedBranch).toBe("object");
        expect(updatedBranch.isActive).toEqual(false);

        const foundBranch = await prisma.branch.findUnique({
            where: {
                id: updatedBranch.id,
            },
        });

        expect(foundBranch.id).toEqual(updatedBranch.id);
    });
});
