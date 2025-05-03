import { test, expect, describe, vi, beforeEach, beforeAll } from "vitest";
import { checkPrivilege } from "../accessControl";

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

const mockNext = () => {
    const next = vi.fn();

    return next;
};

describe("INTEGRATION TEST SUITE FOR ACCCESS CONTROL MIDDLEWARE", () => {
    test("middleware returned from checkPrivilege() should call next() when the requesting user queried from the database has the necessary privileges", async () => {
        let req = mockRequest({
            requester: { id: 1 },
        });

        const res = mockResponse();

        const next = mockNext();

        let middleware = checkPrivilege(["employee"]);
        await middleware(req, res, next);

        expect(next).toHaveBeenCalled();

        req = mockRequest({
            requester: { id: 8 },
        });

        middleware = checkPrivilege(["admin"]);
        await middleware(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    test("middleware returned from checkPrivilege() should send and HTTP response of 403 when the requesting user queried from the database does not have the necessary privileges", async () => {
        let req = mockRequest({
            requester: { id: 1 },
        });

        const res = mockResponse();

        const next = mockNext();

        let middleware = checkPrivilege(["admin"]);
        await middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);

        req = mockRequest({
            requester: { id: 8 },
        });

        middleware = checkPrivilege(["employee"]);
        await middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
    });
});
