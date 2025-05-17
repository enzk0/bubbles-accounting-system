import { test, expect, describe, vi, beforeEach } from "vitest";
import { adminLogin, employeeLogin, login } from "../authenticationController";
import { prismaMock } from "../../singleton";
import bcrypt from "bcrypt";

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

describe("UNIT TEST SUITE 'login()' CONTROLLER", () => {
    test("login() should send an HTTP response of 200 and a jwt access token when the user has been successfully authenticated", async () => {
        const req = mockRequest({
            username: "user123",
            password: "password456",
        });

        const res = mockResponse();

        prismaMock.user.findUnique.mockResolvedValue({
            id: 2,
            username: "user123",
            firstName: "John",
            lastName: "Doe",
            password:
                "$2a$10$9IZROxxaSXKpNE7ZYZxfReWVvRZlk2mi4R4xMeUAt/.V73vDeVmPG",
            createdAt: new Date(),
            roleId: 2,
        });

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            accessToken: expect.any(String),
        });
    });

    test("login() should send an HTTP response of 401 when the incorrect password is used to authenticate the user", async () => {
        const req = mockRequest({
            username: "user123",
            password: "pass123",
        });

        const res = mockResponse();

        prismaMock.user.findUnique.mockResolvedValue({
            id: 2,
            username: "user123",
            firstName: "John",
            lastName: "Doe",
            password:
                "$2a$10$9IZROxxaSXKpNE7ZYZxfReWVvRZlk2mi4R4xMeUAt/.V73vDeVmPG",
            createdAt: new Date(),
            roleId: 2,
        });

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
    });

    test("login() should send an  user: { HTTP response of 500 when an error in the database client has occurred", async () => {
        const req = mockRequest({
            username: "use27",
            password: "password456",
        });

        const res = mockResponse();

        prismaMock.user.findUnique.mockImplementation(() => {
            let error = new Error();
            throw error;
        });

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});

describe("UNIT TESTS FOR 'adminLogin() CONTROLLER'", () => {
    test("adminLogin() should send an HTTP response of 404 when a user with the specified username cannot be found", async () => {
        const req = mockRequest({
            username: "use27",
            password: "password456",
        });

        const res = mockResponse();

        prismaMock.user.findUnique.mockResolvedValue(null);

        await adminLogin(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test("adminLogin() should send an HTTP response of 403 when logging in with a deactivated user", async () => {
        const req = mockRequest({
            username: "use27",
            password: "password456",
        });

        const res = mockResponse();

        prismaMock.user.findUnique.mockResolvedValue({
            id: 2,
            username: "user123",
            firstName: "John",
            lastName: "Doe",
            password:
                "$2a$10$9IZROxxaSXKpNE7ZYZxfReWVvRZlk2mi4R4xMeUAt/.V73vDeVmPG",
            createdAt: new Date(),
            isActive: false,
            roleId: 2,
        });

        await adminLogin(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
    });

    test("adminLogin() should send an HTTP status code of 403 when a non-admin account is used to login", async () => {
        const req = mockRequest({
            username: "user123",
            password: "password456",
        });

        const res = mockResponse();

        prismaMock.user.findUnique.mockResolvedValue({
            id: 2,
            username: "user123",
            firstName: "John",
            lastName: "Doe",
            password:
                "$2a$10$9IZROxxaSXKpNE7ZYZxfReWVvRZlk2mi4R4xMeUAt/.V73vDeVmPG",
            createdAt: new Date(),
            roleId: 2,
        });

        await adminLogin(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
    });
});

describe("UNIT TESTS FOR 'employeeLogin() CONTROLLER'", () => {
    test("employeeLogin() should send an HTTP response of 404 when a user with the specified username cannot be found", async () => {
        const req = mockRequest({
            username: "use27",
            password: "password456",
        });

        const res = mockResponse();

        prismaMock.user.findUnique.mockResolvedValue(null);

        await employeeLogin(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test("employeeLogin() should send an HTTP response of 403 when logging in with a deactivated user", async () => {
        const req = mockRequest({
            username: "use27",
            password: "password456",
        });

        const res = mockResponse();

        prismaMock.user.findUnique.mockResolvedValue({
            id: 2,
            username: "user123",
            firstName: "John",
            lastName: "Doe",
            password:
                "$2a$10$9IZROxxaSXKpNE7ZYZxfReWVvRZlk2mi4R4xMeUAt/.V73vDeVmPG",
            createdAt: new Date(),
            isActive: false,
            roleId: 2,
        });

        await employeeLogin(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
    });

    test("employeeLogin() should send an HTTP status code of 403 when a non-employee account is used to login", async () => {
        const req = mockRequest({
            username: "user123",
            password: "password456",
        });

        const res = mockResponse();

        prismaMock.user.findUnique.mockResolvedValue({
            id: 2,
            username: "user123",
            firstName: "John",
            lastName: "Doe",
            password:
                "$2a$10$9IZROxxaSXKpNE7ZYZxfReWVvRZlk2mi4R4xMeUAt/.V73vDeVmPG",
            createdAt: new Date(),
            roleId: 1,
        });

        await employeeLogin(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
    });
});
