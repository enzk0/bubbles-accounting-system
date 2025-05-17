import { test, expect, describe, vi } from "vitest";
import {
    createUser,
    editPassword,
    editUser,
    getUser,
    getAllUsers,
    deactivateUser,
} from "../userController";
import { prismaMock } from "../../singleton";
import bcrypt from "bcrypt";

const mockRequest = (user, body, params) => ({
    user: user,
    body: body,
    params: params,
});

const mockResponse = () => {
    const res = {};

    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    res.send = vi.fn().mockReturnValue(res);

    return res;
};

describe("UNIT TESTS FOR 'createUser()' CONTROLLER", () => {
    test("createUser() should send a HTTP response code of 201 when a user with a hashed password has been created successfully", async () => {
        const req = mockRequest(
            { id: 1 },
            {
                user: {
                    username: "john_doe",
                    firstName: "John",
                    lastName: "Doe",
                    password: "password123",
                },
            },
            {}
        );

        const res = mockResponse();

        const mock = {
            id: 2,
            name: "john_doe",
            firstName: "John",
            lastName: "Doe",
            createdAt: new Date(),
            updatedAt: new Date(),
            roleId: null,
        };

        prismaMock.user.create.mockImplementation((input) => ({
            id: mock.id,
            name: mock.name,
            firstName: mock.firstName,
            lastName: mock.lastName,
            password: input.data.password,
            createdAt: mock.createdAt,
            updatedAt: mock.updatedAt,
            roleId: mock.roleId,
        }));

        const created = await createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(
            bcrypt.compareSync(req.body.user.password, created.password)
        ).toBe(true);
    });

    test("createUser() should send a HTTP response code of 422 when either of the fields are incomplete", async () => {
        let req = mockRequest(
            { id: 1 },
            {
                user: {
                    username: "john_doe",
                    firstName: "John",
                    lastName: "Doe",
                    password: "",
                },
            },
            {}
        );

        const res = mockResponse();

        await createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(422);

        req = mockRequest(
            { id: 1 },
            {
                user: {
                    username: "",
                    firstName: "John",
                    lastName: "Doe",
                    password: "password123",
                },
            },
            {}
        );

        await createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(422);

        req = mockRequest(
            { id: 1 },
            {
                user: {
                    username: "john_doe",
                    firstName: "",
                    lastName: "Doe",
                    password: "password123",
                },
            },
            {}
        );

        await createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(422);

        req = mockRequest(
            { id: 1 },
            {
                user: {
                    username: "john_doe",
                    firstName: "John",
                    lastName: "",
                    password: "password123",
                },
            },
            {}
        );

        await createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(422);
    });

    test("createUser() should send a HTTP response code of 500 if an error with the database client occurs", async () => {
        const req = mockRequest(
            { id: 1 },
            {
                user: {
                    username: "john_doe",
                    firstName: "John",
                    lastName: "Doe",
                    password: "password123",
                },
            },
            {}
        );

        const res = mockResponse();

        prismaMock.user.create.mockImplementation((input) => {
            let error = new Error();
            throw new Error();
        });

        const created = await createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});

describe("UNIT TESTS for 'deactivateUser()' CONTROLLER", () => {
    test("deactivateUser() should send a HTTP response code of 200 when a user is deleted successfully", async () => {
        const req = mockRequest(
            { id: 1 },
            {
                user: { id: 2 },
            },
            {}
        );

        const res = mockResponse();

        const mock = {
            id: 2,
            username: "john_doe",
            firstName: "John",
            lastName: "John",
            password:
                "$2a$12$j82bxfd6gJTHiYJae7nK2.0hJQ.7zQ9luwED1rSYZn.CLai.5HWaC",
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: false,
            roleId: 1,
        };

        prismaMock.user.update.mockResolvedValue(mock);

        const user = await deactivateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(mock).toEqual(user);
    });

    test("deactivateUser() should send a HTTP response code of 500 when an error in deleting a user in the database occurs", async () => {
        const req = mockRequest(
            { id: 1 },
            {
                user: { id: 2 },
            },
            {}
        );

        const res = mockResponse();

        prismaMock.user.update.mockImplementation(() => {
            let error = new Error();
            throw error;
        });

        await deactivateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});

describe("UNIT TEST SUITE FOR 'editUser()' CONTROLLER", () => {
    test("editUser() should send a HTTP response code of 200 when a user's information has been successfully updated (password not included)", async () => {
        let req = mockRequest(
            { id: 1 },
            {
                user: { id: 2 },
                edit: {
                    username: "jane_doe",
                    firstName: "Jane",
                    lastName: "Doe",
                    roleId: 2,
                    branchId: 1,
                },
            },
            {}
        );

        const res = mockResponse();

        prismaMock.user.update.mockResolvedValue({
            id: 2,
            username: "jane_doe",
            firstName: "Jane",
            lastName: "Doe",
            password:
                "$2a$12$SlHOdt4sN8Ef/kJeZYDdH.rwOp0TZBnaGr.3BB1.EPxQrjwV8tF9m",
            createdAt: new Date(),
            updatedAt: new Date(),
            roleId: 2,
            branchId: 1,
        });

        const updated = await editUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    test("editUser() should send a HTTP response code of 422 when the username, firstName, and lastName fields are empty", async () => {
        let req = mockRequest(
            { id: 1 },
            {
                user: { id: 2 },
                edit: {
                    username: "",
                    firstName: "",
                    lastName: "",
                    roleId: 2,
                    branchId: 1,
                },
            },
            {}
        );

        const res = mockResponse();

        await editUser(req, res);

        expect(res.status).toHaveBeenCalledWith(422);

        req = mockRequest(
            { id: 1 },
            {
                user: { id: 2 },
                edit: {
                    username: "jane_doe",
                    firstName: "",
                    lastName: "",
                    roleId: 2,
                    branchId: 1,
                },
            },
            {}
        );

        await editUser(req, res);

        expect(res.status).toHaveBeenCalledWith(422);

        req = mockRequest(
            { id: 1 },
            {
                user: { id: 2 },
                edit: {
                    username: "",
                    firstName: "jane",
                    lastName: "",
                    roleId: 2,
                    branchId: 1,
                },
            },
            {}
        );

        await editUser(req, res);

        expect(res.status).toHaveBeenCalledWith(422);

        req = mockRequest(
            { id: 1 },
            {
                user: { id: 2 },
                edit: {
                    username: "",
                    firstName: "",
                    lastName: "doe",
                    roleId: 2,
                    branchId: 1,
                },
            },
            {}
        );

        await editUser(req, res);

        expect(res.status).toHaveBeenCalledWith(422);
    });

    test("editUser() should send a HTTP response code of 500 when an error in the database client occurs", async () => {
        const req = mockRequest(
            { id: 1 },
            {
                user: { id: 2 },
                edit: {
                    username: "jane_doe",
                    firstName: "Jane",
                    lastName: "Doe",
                    roleId: 2,
                    branchId: 1,
                },
            },
            {}
        );

        const res = mockResponse();

        prismaMock.user.findUnique.mockImplementation(() => {
            let error = new Error();
            throw error;
        });

        await editUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        prismaMock.user.findUnique.mockResolvedValue({
            id: 2,
            username: "jane_doe",
            firstName: "Jane",
            lastName: "Doe",
            password:
                "$2a$12$SlHOdt4sN8Ef/kJeZYDdH.rwOp0TZBnaGr.3BB1.EPxQrjwV8tF9m",
            createdAt: new Date(),
            updatedAt: new Date(),
            roleId: 2,
            branchId: 1,
        });

        prismaMock.user.update.mockImplementation(() => {
            let error = new Error();
            throw error;
        });

        await editUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});

describe("UNIT TESTING FOR 'editPassword()' CONTROLLER", () => {
    test("editPassword() should send a HTTP response code of 200 when a user password has been changed successfully", async () => {
        const req = mockRequest(
            { id: 1 },
            {
                user: { id: 2, password: "password123" },
                newPassword: "newpassword",
            },
            {}
        );

        const res = mockResponse();

        prismaMock.user.findUnique.mockImplementation(() => ({
            password:
                "$2a$10$uHpKY9.QqmFBYX9sECtaj.1/6ReyfujejGt6ddypHQDKVFbe471uu",
        }));

        prismaMock.user.update.mockImplementation((input) => ({
            password: input.data.password,
        }));

        const updated = await editPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(bcrypt.compareSync(req.body.newPassword, updated.password));
    });

    test("editPassword() should send a HTTP response code of 500 when the user to be updated cannot be found", async () => {
        let req = mockRequest(
            { id: 1 },
            {
                user: { id: 2, password: "password123" },
                newPassword: "newpassword",
            },
            {}
        );

        const res = mockResponse();

        prismaMock.user.update.mockImplementation(() => {
            let error = new Error();
            throw error;
        });

        await editPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    test("editPassword() should send a HTTP response code of 422 if any of the fields are empty", async () => {
        let req = mockRequest(
            { id: 1 },
            {
                user: { id: 2 },
                newPassword: "",
            },
            {}
        );

        const res = mockResponse();

        await editPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(422);

        req = mockRequest(
            { id: 1 },
            {
                user: { id: null },
                newPassword: "newPassword",
            },
            {}
        );

        await editPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(422);

        req = mockRequest(
            { id: 1 },
            {
                user: { id: null },
                newPassword: "",
            },
            {}
        );

        await editPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(422);
    });
});

describe("UNIT TEST SUITE FOR 'getUser()' CONTROLLER", async () => {
    test("getUser() should send a HTTP response code of 200 and a json response of a user when a user is found from the database", async () => {
        let req = mockRequest({ id: 1 }, {}, { id: 2 });

        const res = mockResponse();

        const mock = {
            id: 2,
            name: "john_doe",
            firstName: "John",
            lastName: "Doe",
            createdAt: new Date(),
            updatedAt: new Date(),
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
        let req = mockRequest({ id: 1 }, {}, { id: 2 });

        const res = mockResponse();

        prismaMock.user.findUnique.mockResolvedValue(null);

        const found = await getUser(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(found).toEqual(null);
    });

    test("getUser() should send a HTTP response code of 500 when an error occurs with database client", async () => {
        let req = mockRequest({ id: 1 }, {}, { id: 2 });

        const res = mockResponse();

        prismaMock.user.findUnique.mockImplementation(() => {
            let error = new Error();
            throw error;
        });

        await getUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});

describe("UNIT TEST SUITE FOR 'getAllUsers()' CONTROLLER", () => {
    test("getAllUsers() should send a HTTP response of code 200 when it can send a response containing an array of all users", async () => {
        let req = mockRequest({
            requester: { id: 1 },
        });

        const res = mockResponse();

        const mock = [
            {
                user: {
                    id: 1,
                    username: "admin",
                    roleId: 0,
                },
            },
            {
                user: {
                    id: 2,
                    username: "employee",
                    roleId: 1,
                },
            },
        ];

        prismaMock.user.findMany.mockResolvedValue(mock);

        const found = await getAllUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([
            {
                user: {
                    id: 1,
                    username: "admin",
                    roleId: 0,
                },
            },
            {
                user: {
                    id: 2,
                    username: "employee",
                    roleId: 1,
                },
            },
        ]);
        expect(found).toEqual(mock);
    });

    test("getAllUsers() should send a HTTP response code of 404 when no users can be found and should also send a json where users is an empty array", async () => {
        let req = mockRequest({
            requester: { id: 1 },
        });

        let res = mockResponse();

        const mock = [];

        prismaMock.user.findMany.mockResolvedValue(mock);

        const found = await getAllUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            users: [],
        });
        expect(found).toEqual(mock);
    });

    test("getAllUsers() should send a HTTP response code of 500 when an error occurs with the database client", async () => {
        let req = mockRequest({
            requester: { id: 1 },
        });

        let res = mockResponse();

        prismaMock.user.findMany.mockImplementation(() => {
            let error = new Error();
            throw error;
        });

        const found = getAllUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});
