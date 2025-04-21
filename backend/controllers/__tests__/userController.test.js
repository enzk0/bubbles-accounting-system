import { test, expect, describe, vi } from "vitest";
import {
    createUser,
    deleteUser,
    changePassword,
    assignRole,
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
            userInformation: { name: "john_doe", password: "password123" },
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

        const user = await createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(201);

        expect(mock.id).toEqual(user.id);
        expect(mock.name).toEqual(user.name);
        expect(mock.createdAt).toEqual(user.createdAt);
        expect(mock.roleId).toEqual(user.roleId);
        expect(
            bcrypt.compareSync(req.body.userInformation.password, user.password)
        ).toBe(true);
    });

    test("createUser() should send a HTTP response code of 422 when either of the fields are incomplete", async () => {
        let req = mockRequest({
            requester: { id: 1 },
            userInformation: { name: "john_doe", password: "" },
        });

        const res = mockResponse();

        await createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(422);

        req = mockRequest({
            requester: { id: 1 },
            userInformation: { name: "", password: "password123" },
        });

        await createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(422);

        req = mockRequest({
            requester: { id: 1 },
            userInformation: { name: "", password: "" },
        });

        await createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(422);
    });
});

describe("UNIT TESTS for 'deleteUser()' CONTROLLER", () => {
    test("deleteUser() should send a HTTP response code of 200 when a user is deleted successfully", async () => {
        let req = mockRequest({
            requester: { id: 1 },
            userInformation: { name: "john_doe" },
        });

        const res = mockResponse();

        const mock = {
            id: 2,
            name: "john_doe",
            password:
                "$2a$12$j82bxfd6gJTHiYJae7nK2.0hJQ.7zQ9luwED1rSYZn.CLai.5HWaC",
            createdAt: new Date(),
            roleId: null,
        };

        prismaMock.user.delete.mockResolvedValue(mock);

        const user = await deleteUser(req, res);

        expect(res.status).toHaveBeenCalled(200);
        expect(mock).toEqual(user);
    });

    test("deleteUser() should send a HTTP response code of 500 when an error in deleting a user in the database occurs", async () => {
        let req = mockRequest({
            requester: { id: 1 },
            userInformation: { name: "john_doe" },
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
            userInformation: { name: "john_doe", password: "newpassword" },
        });

        const res = mockResponse();

        prismaMock.user.update.mockImplementation((input) => ({
            password: input.data.password,
        }));

        const user = await changePassword(req, res);

        expect(res.status).toHaveBeenCalled(200);
        expect(
            bcrypt.compareSync(req.body.userInformation.password, user.password)
        );
    });

    test("changePassword() should send a HTTP response code of 500 when the user to be updated cannot be found", async () => {
        let req = mockRequest({
            requester: { id: 1 },
            userInformation: { name: "jane_doe", password: "newpassword" },
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
            userInformation: { name: "john_doe", password: "" },
        });

        const res = mockResponse();

        await changePassword(req, res);

        expect(res.status).toHaveBeenCalledWith(422);

        req = mockRequest({
            requester: { id: 1 },
            userInformation: { name: "", password: "newpassword" },
        });

        await changePassword(req, res);

        expect(res.status).toHaveBeenCalledWith(422);

        req = mockRequest({
            requester: { id: 1 },
            userInformation: { name: "", password: "" },
        });

        await changePassword(req, res);

        expect(res.status).toHaveBeenCalledWith(422);
    });
});

describe("UNIT TEST SUITE FOR 'assignRole()' CONTROLLER", async () => {
    test("assignRole() should send a HTTP response code of 200 if the user has been successfully assigned a role", async () => {
        let req = mockRequest({
            requester: { id: 1 },
            userInformation: { name: "" },
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

        const user = await assignRole(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(user).toEqual(user);
    });

    test("assignRole() should send a HTTP response code of 500 if the user cannot be found or updated", async () => {
        let req = mockRequest({
            requester: { id: 1 },
            userInformation: { name: "" },
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
