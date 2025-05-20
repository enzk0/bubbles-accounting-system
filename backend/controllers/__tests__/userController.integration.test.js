import { test, expect, describe, vi } from "vitest";
import {
    createUser,
    deactivateUser,
    editPassword,
    getUser,
    getAllUsers,
    editUser,
    getSelf,
} from "../userController";
import prisma from "../../client";
import bcrypt from "bcrypt";

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

describe("INTEGRATION TESTS BETWEEN USER CONTROLLERS AND DATABASE", () => {
    test("createUser() should create a User in the database", async () => {
        const req = mockRequest({
            user: {
                username: "john_doe",
                firstName: "John",
                lastName: "Doe",
                password: "password123",
            },
        });

        const res = mockResponse();

        const created = await createUser(req, res);

        console.log(created);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(typeof created).toBe("object");
        expect(created.username).toBe(req.body.user.username);
        expect(
            bcrypt.compareSync(req.body.user.password, created.password)
        ).toBe(true);

        const found = await prisma.user.findUnique({
            where: {
                username: created.username,
            },
        });

        expect(created).toEqual(found);
    });

    test("editPassword() should change the password of a User in the database", async () => {
        const req = mockRequest(
            {
                password: "pass456",
            },
            {},
            { id: "11" },
            {}
        );

        const res = mockResponse();

        const updated = await editPassword(req, res);

        console.log(updated);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(typeof updated).toBe("object");
        expect(updated.id).toBe(parseInt(req.params.id));
        expect(bcrypt.compareSync(req.body.password, updated.password)).toBe(
            true
        );

        const found = await prisma.user.findUnique({
            where: {
                username: updated.username,
            },
        });

        expect(updated).toEqual(found);
    });

    test("editUser() should update fields/information about a user in a database that is not the password", async () => {
        const req = mockRequest(
            {
                username: "jane_doe",
                firstName: "Jane",
                lastName: "Doe",
                branchId: 1,
                roleId: 2,
            },
            {},
            { id: "11" },
            {}
        );

        const res = mockResponse();

        const updated = await editUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(updated.username).toEqual(req.body.username);
    });

    test("getUser() should get/fetch a User in the database via their id", async () => {
        const req = mockRequest({}, {}, { id: "11" }, {});

        const res = mockResponse();

        const found = await getUser(req, res);

        console.log(found);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(typeof found).toBe("object");
        expect(found.id).toEqual(parseInt(req.params.id));
    });

    test("getSelf() should get/fetch the requesting User from the database", async () => {
        const req = mockRequest({}, { id: 1 }, {}, {});

        const res = mockResponse();

        const found = await getSelf(req, res);

        console.log(found);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(typeof found).toBe("object");
        expect(found.id).toEqual(parseInt(req.user.id));
    });

    test("getAllUsers() should get/fetch all Users in the database", async () => {
        const req = mockRequest({}, {}, {}, {});

        const res = mockResponse();

        const found = await getAllUsers(req, res);

        console.log(found);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(typeof found).toBe("object");
        expect(found.length).toBeGreaterThan(0);
    });

    test("getAllUsers() should get/fetch all active users in the database when isActive filter is true", async () => {
        const req = mockRequest({}, {}, {}, { isActive: "true" });

        const res = mockResponse();

        const found = await getAllUsers(req, res);

        console.log(found);

        expect(res.status).toHaveBeenCalledWith(200);

        const users = await prisma.user.findMany({
            where: { isActive: true },
        });

        users.forEach((user) => {
            expect(user.isActive).toEqual(true);
        });
    });

    test("getAllUsers() should get/fetch all active users in the database when isActive filter is true", async () => {
        const req = mockRequest({}, {}, {}, { isActive: "false" });

        const res = mockResponse();

        const found = await getAllUsers(req, res);

        console.log(found);

        expect(res.status).toHaveBeenCalledWith(200);

        const users = await prisma.user.findMany({
            where: { isActive: false },
        });

        console.log(users);

        users.forEach((user) => {
            expect(user.isActive).toEqual(false);
        });
    });

    test("getAllUsers() should get/fetch all users in the specified branch from the database when branchId is defined in the reqest query", async () => {
        const req = mockRequest({}, {}, {}, { branchId: "1" });

        const res = mockResponse();

        const found = await getAllUsers(req, res);

        console.log(found);

        expect(res.status).toHaveBeenCalledWith(200);

        const users = await prisma.user.findMany({
            where: { branchId: 1 },
        });

        console.log(users);

        users.forEach((user) => {
            expect(user.branchId).toEqual(1);
        });
    });

    test("deactivateUser() should delete a User in the database", async () => {
        const req = mockRequest({}, {}, { id: "11" }, {});

        console.log(req.params);

        const res = mockResponse();

        const updated = await deactivateUser(req, res);

        console.log(updated);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(typeof updated).toBe("object");
        expect(updated.id).toBe(parseInt(req.params.id));

        const found = await prisma.user.findUnique({
            where: { id: parseInt(req.params.id) },
        });

        expect(found.isActive).toEqual(false);
    });
});
