import { test, expect, describe, vi } from "vitest";
import {
    createUser,
    deleteUser,
    changePassword,
    assignRole,
    getUser,
} from "../userController";
import { prismaMock } from "../../singleton";
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

describe("UNIT TESTS FOR 'createUser()' CONTROLLER", () => {
    test("createUser() should send a HTTP response code of 201 when a user with a hashed password has been created successfully", async () => {
        const req = mockRequest({
            requester: { id: 1 },
            user: { name: "john_doe", password: "password123" },
        });

        const res = mockResponse();

        const mock = {
            id: 2,
            name: "john_doe",
            createdAt: new Date(),
            roleId: null,
        };

        prismaMock.user.create.mockImplementation((input) => ({
            id: mock.id,
            name: mock.name,
            password: input.data.password,
            createdAt: mock.createdAt,
            roleId: mock.roleId,
        }));

        const created = await createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(201);

        expect(mock.id).toEqual(created.id);
        expect(mock.name).toEqual(created.name);
        expect(mock.createdAt).toEqual(created.createdAt);
        expect(mock.roleId).toEqual(created.roleId);
        expect(
            bcrypt.compareSync(req.body.user.password, created.password)
        ).toBe(true);
    });

    test("createUser() should send a HTTP response code of 422 when either of the fields are incomplete", async () => {
        let req = mockRequest({
            requester: { id: 1 },
            user: { name: "john_doe", password: "" },
        });

        const res = mockResponse();

        await createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(422);

        req = mockRequest({
            requester: { id: 1 },
            user: { name: "", password: "password123" },
        });

        await createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(422);

        req = mockRequest({
            requester: { id: 1 },
            user: { name: "", password: "" },
        });

        await createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(422);
    });
});

describe("UNIT TESTS for 'deleteUser()' CONTROLLER", () => {
    test("deleteUser() should send a HTTP response code of 200 when a user is deleted successfully", async () => {
        let req = mockRequest({
            requester: { id: 1 },
            user: { name: "john_doe" },
        });

        const res = mockResponse();

        const mock = {
            id: 2,
            name: "john_doe",
            password:
                "$2a$12$j82bxfd6gJTHiYJae7nK2.0hJQ.7zQ9luwED1rSYZn.CLai.5HWaC",
            createdAt: new Date(),
            roleId: 1,
        };

        prismaMock.user.delete.mockResolvedValue(mock);

        const user = await deleteUser(req, res);

        expect(res.status).toHaveBeenCalled(200);
        expect(mock).toEqual(user);
    });

    test("deleteUser() should send a HTTP response code of 500 when an error in deleting a user in the database occurs", async () => {
        let req = mockRequest({
            requester: { id: 1 },
            user: { name: "john_doe" },
        });

        const res = mockResponse();

        prismaMock.user.delete.mockImplementation(() => {
            let error = new Error();
            throw error;
        });

        await deleteUser(req, res);

        expect(res.status).toHaveBeenCalled(500);
    });
});

describe("UNIT TESTING FOR 'changePassword()' CONTROLLER", () => {
    test("changePassword() should send a HTTP response code of 200 when a user password has been changed successfully", async () => {
        let req = mockRequest({
            requester: { id: 1 },
            user: { name: "john_doe" },
            newPassword: "newpassword",
        });

        const res = mockResponse();

        prismaMock.user.update.mockImplementation((input) => ({
            password: input.data.password,
        }));

        const updated = await changePassword(req, res);

        expect(res.status).toHaveBeenCalled(200);
        expect(bcrypt.compareSync(req.body.newPassword, updated.password));
    });

    test("changePassword() should send a HTTP response code of 500 when the user to be updated cannot be found", async () => {
        let req = mockRequest({
            requester: { id: 1 },
            user: { name: "jane_doe" },
            newPassword: "newpassword",
        });

        const res = mockResponse();

        prismaMock.user.update.mockImplementation(() => {
            let error = new Error();
            throw error;
        });

        await changePassword(req, res);

        expect(res.status).toHaveBeenCalled(500);
    });

    test("changePassword() should send a HTTP response code of 422 if any of the fields are empty", async () => {
        let req = mockRequest({
            requester: { id: 1 },
            user: { name: "john_doe" },
            newPassword: "",
        });

        const res = mockResponse();

        await changePassword(req, res);

        expect(res.status).toHaveBeenCalledWith(422);

        req = mockRequest({
            requester: { id: 1 },
            user: { name: "" },
            newPassword: "newPassword",
        });

        await changePassword(req, res);

        expect(res.status).toHaveBeenCalledWith(422);

        req = mockRequest({
            requester: { id: 1 },
            user: { name: "" },
            newPassword: "",
        });

        await changePassword(req, res);

        expect(res.status).toHaveBeenCalledWith(422);
    });
});

describe("UNIT TEST SUITE FOR 'assignRole()' CONTROLLER", async () => {
    test("assignRole() should send a HTTP response code of 200 if the user has been successfully assigned a role", async () => {
        let req = mockRequest({
            requester: { id: 1 },
            user: { name: "" },
            role: { id: 0, name: "ADMIN" },
        });

        const res = mockResponse();

        const mock = {
            id: 2,
            name: "john_doe",
            password:
                "$2a$12$ajvYtpQcelZBBZYl.syd6exYqWyIgSLWp.HMrSn2fpISEnjPCOIQ2",
            createdAt: new Date(),
            roleId: 0,
        };

        prismaMock.user.update.mockResolvedValue(mock);

        const updated = await assignRole(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(updated).toEqual(mock);
    });

    test("assignRole() should send a HTTP response code of 500 if the user cannot be found or updated", async () => {
        let req = mockRequest({
            requester: { id: 1 },
            user: { name: "" },
            role: { id: 0, name: "ADMIN" },
        });

        const res = mockResponse();

        prismaMock.user.update.mockImplementation(() => {
            let error = new Error();
            throw error;
        });

        await assignRole(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});

describe("UNIT TEST SUITE FOR 'getUser()' CONTROLLER", async () => {
    test("getUser() should send a HTTP response code of 200 and a json response of a user when a user is found from the database", async () => {
        let req = mockRequest({
            requester: { id: 1 },
            user: { name: "john_doe" },
        });

        const res = mockResponse();

        const mock = {
            id: 2,
            name: "john_doe",
            createdAt: new Date(),
            roleId: 0,
            role: {
                id: 0,
                name: "ADMIN",
            },
        };

        prismaMock.user.findUnique.mockResolvedValue(mock);

        const found = await getUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mock);
        expect(found).toEqual(mock);
    });

    test("getUser() should send a HTTP response code of 404 when a user cannot be found in the database", async () => {
        let req = mockRequest({
            requester: { id: 1 },
            user: { name: "jane_doe" },
        });

        const res = mockResponse();

        prismaMock.user.findUnique.mockResolvedValue(null);

        const found = await getUser(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(found).toEqual(null);
    });

    test("getUser() should send a HTTP response code of 500 when an error occurs with database client", async () => {
        let req = mockRequest({
            requester: { id: 1 },
            user: { name: "jane_doe" },
        });

        const res = mockResponse();

        expect(res.status).toHaveBeenCalledWith(200);
    });
});
