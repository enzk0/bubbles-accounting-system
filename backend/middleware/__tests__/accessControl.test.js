import { test, expect, describe, vi, beforeEach, beforeAll } from "vitest";
import { prismaMock } from "../../singleton";
import { checkPrivilege } from "../accessControl";

const mockRequest = (body, user) => ({
    body: body,
    user: user,
});

const mockResponse = () => {
    const res = {};

    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    res.send = vi.fn().mockReturnValue(res);

    return res;
};

const mockNext = () => {
    const next = vi.fn();

    return next;
};

describe("UNIT TEST SUITE FOR `checkPrivilege()` MIDDLEWARE", () => {
    test("checkPrivilege() should call next() when the user has specified privileges", async () => {
        const req = mockRequest({}, { id: 1 });

        const res = mockResponse();

        const next = mockNext();

        prismaMock.user.findUnique.mockResolvedValue({
            id: 1,
            role: {
                id: 2,
                privileges: [
                    { id: 1, name: "create_job_order" },
                    { id: 2, name: "edit_job_order" },
                    { id: 3, name: "get_job_order" },
                    { id: 4, name: "delete_job_order" },
                ],
            },
        });

        let middleware = checkPrivilege([
            "create_job_order",
            "edit_job_order",
            "get_job_order",
            "delete_job_order",
        ]);
        await middleware(req, res, next);

        expect(next).toHaveBeenCalled();

        prismaMock.user.findUnique.mockResolvedValue({
            id: 1,
            role: {
                id: 2,
                privileges: [{ id: 2, name: "employee" }],
            },
        });

        middleware = checkPrivilege(["employee"]);
        await middleware(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    test("checkPrivilege() should send an HTTP status code of 403 when the user does not have the specified privileges", async () => {
        const req = mockRequest({}, { id: 2 });

        const res = mockResponse();

        const next = mockNext();

        prismaMock.user.findUnique.mockResolvedValue({
            id: 2,
            role: {
                id: 2,
                privileges: [{ id: 2, name: "employee" }],
            },
        });

        const middleware = checkPrivilege(["admin"]);
        await middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
    });

    test("checkPrivilege() should send an HTTP status code of 404 when the user does not exist in the database", async () => {
        const req = mockRequest({}, { id: 2 });

        const res = mockResponse();

        const next = mockNext();

        prismaMock.user.findUnique.mockResolvedValue(null);

        const middleware = checkPrivilege(["admin"]);
        await middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test("checkPrivilege() should send an HTTP status code of 500 when an error with the database client occurs", async () => {
        const req = mockRequest({}, { id: 2 });

        const res = mockResponse();

        const next = mockNext();

        prismaMock.user.findUnique.mockResolvedValue(() => {
            let error = new Error();
            throw error;
        });

        const middleware = checkPrivilege(["admin"]);
        await middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});
