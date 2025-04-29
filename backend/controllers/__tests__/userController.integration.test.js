import { test, expect, describe, vi } from "vitest";
import {
    createUser,
    deleteUser,
    changePassword,
    assignRole,
    getUser,
    getAllUsers,
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
            user: { name: "john_doe", password: "password123" },
        });

        const res = mockResponse();

        const created = await createUser(req, res);

        console.log(created);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(typeof created).toBe("object");
        expect(created.name).toBe(req.body.user.name);
        expect(
            bcrypt.compareSync(req.body.user.password, created.password)
        ).toBe(true);

        const found = await prisma.user.findUnique({
            where: {
                name: created.name,
            },
        });

        expect(created).toEqual(found);
    });

    test("changePassword() should change the password of a User in the database", async () => {
        const req = mockRequest({
            requester: { id: 1 },
            user: { name: "john_doe", password: "password123" },
            newPassword: "pass456",
        });

        const res = mockResponse();

        const updated = await changePassword(req, res);

        console.log(updated);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(typeof updated).toBe("object");
        expect(updated.name).toBe(req.body.user.name);
        expect(bcrypt.compareSync(req.body.newPassword, updated.password)).toBe(
            true
        );

        const found = await prisma.user.findUnique({
            where: {
                name: updated.name,
            },
        });

        expect(updated).toEqual(found);
    });

    test("assignRole() should update the roleId field of a specified User in the database", async () => {
        const req = mockRequest({
            requester: { id: 1 },
            user: { name: "john_doe" },
            role: { id: 1 },
        });

        const res = mockResponse();

        const updated = await assignRole(req, res);

        console.log("Assigned Role: ", updated);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(typeof updated).toBe("object");
        expect(updated.roleId).toEqual(req.body.role.id);
    });

    test("getUser() should get/fetch a User in the database via their name", async () => {
        const req = mockRequest({
            requester: { id: 1 },
            user: { name: "john_doe" },
        });

        const res = mockResponse();

        const found = await getUser(req, res);

        console.log(found);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(typeof found).toBe("object");
        expect(found.name).toEqual(req.body.user.name);
    });

    test("getAllUsers() should get/fetch all Users in the database", async () => {
        const req = mockRequest({
            requester: { id: 1 },
            user: { name: "john_doe" },
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
            user: { name: "john_doe" },
        });

        const res = mockResponse();

        const deleted = await deleteUser(req, res);

        console.log(deleted);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(typeof deleted).toBe("object");
        expect(deleted.name).toBe(req.body.user.name);

        const found = await prisma.user.findUnique({
            where: {
                name: req.body.user.name,
            },
        });

        expect(found).toEqual(null);
    });
});
