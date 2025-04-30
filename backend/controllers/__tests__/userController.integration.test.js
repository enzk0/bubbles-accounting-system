import { test, expect, describe, vi } from "vitest";
import {
    createUser,
    deleteUser,
    editPassword,
    getUser,
    getAllUsers,
    editUser,
} from "../userController";
import prisma from "../../client";
import bcrypt from "bcrypt";

const mockRequest = (body) => ({
    body: body,
});

const mockResponse = () => {
    const res = {};

    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);

    return res;
};

describe("INTEGRATION TESTS BETWEEN USER CONTROLLERS AND DATABASE", () => {
    test("createUser() should create a User in the database", async () => {
        const req = mockRequest({
            requester: { id: 1 },
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
        const req = mockRequest({
            requester: { id: 1 },
            user: { username: "john_doe" },
            newPassword: "pass456",
        });

        const res = mockResponse();

        const updated = await editPassword(req, res);

        console.log(updated);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(typeof updated).toBe("object");
        expect(updated.username).toBe(req.body.user.username);
        expect(bcrypt.compareSync(req.body.newPassword, updated.password)).toBe(
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
        const req = mockRequest({
            requester: { id: 1 },
            user: { username: "john_doe" },
            edit: {
                username: "jane_doe",
                firstName: "Jane",
                lastName: "Doe",
                branchId: 1,
                roleId: 2,
            },
        });

        const res = mockResponse();

        const updated = await editUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(updated.username).toEqual(req.body.edit.username);
    });

    test("getUser() should get/fetch a User in the database via their name", async () => {
        const req = mockRequest({
            requester: { id: 1 },
            user: { username: "jane_doe" },
        });

        const res = mockResponse();

        const found = await getUser(req, res);

        console.log(found);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(typeof found).toBe("object");
        expect(found.username).toEqual(req.body.user.username);
    });

    test("getAllUsers() should get/fetch all Users in the database", async () => {
        const req = mockRequest({
            requester: { id: 1 },
        });

        const res = mockResponse();

        const found = await getAllUsers(req, res);

        console.log(found);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(typeof found).toBe("object");
        expect(found.length).toBeGreaterThan(0);
    });

    test("deleteUser() should delete a User in the database", async () => {
        const req = mockRequest({
            requester: { id: 1 },
            user: { username: "jane_doe" },
        });

        const res = mockResponse();

        const deleted = await deleteUser(req, res);

        console.log(deleted);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(typeof deleted).toBe("object");
        expect(deleted.username).toBe(req.body.user.username);

        const found = await prisma.user.findUnique({
            where: {
                username: req.body.user.username,
            },
        });

        expect(found).toEqual(null);
    });
});
