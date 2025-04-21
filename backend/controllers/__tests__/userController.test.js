import { test, expect, describe, vi } from "vitest";
import { createUser, deleteUser } from "../userController";
import { prismaMock } from "../../singleton";
import bcrypt from "bcrypt";

describe("UNIT TESTS FOR 'createUser()' CONTROLLER", () => {
    const mockRequest = (body) => ({
        body: body,
    });

    const mockResponse = () => {
        const res = {};

        res.status = vi.fn().mockReturnValue(res);
        res.json = vi.fn().mockReturnValue(res);

        return res;
    };

    test("createUser() should create a user with a hashed password", async () => {
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

    test("createUser() should send an error code when either of the fields are incomplete", async () => {
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
    const mockRequest = (body) => ({
        body: body,
    });

    const mockResponse = () => {
        const res = {};

        res.status = vi.fn().mockReturnValue(res);
        res.json = vi.fn().mockReturnValue(res);

        return res;
    };

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
