import { test, expect, describe, vi, beforeEach, beforeAll } from "vitest";
import { authenticate } from "../auth";
import jwt from "jsonwebtoken";

const mockRequest = (headers, body) => ({
    headers: headers,
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

describe("UNIT TEST SUITE FOR 'authenticate()' MIDDLEWARE", () => {
    let test_token, expired_test_token;

    beforeAll(() => {
        test_token = jwt.sign({ id: 1 }, process.env.ACCESS_TOKEN_SECRET);
        expired_test_token = jwt.sign(
            { id: 1, exp: Math.floor(Date.now() / 1000) - 60 },
            process.env.ACCESS_TOKEN_SECRET
        );
    });

    test("authenticate() should call the next() function when the access token is authenticated", async () => {
        const req = mockRequest(
            {
                authorization: `Bearer ${test_token}`,
            },
            {}
        );

        const res = mockResponse();

        const next = mockNext();

        const user = await authenticate(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(user).toHaveProperty("id");
        expect(user.id).toEqual(1);
    });

    test("authenticate() should send a HTTP status code of 401 if no access token is provided in the authorization header", async () => {
        const req = mockRequest(
            {
                authorization: `Bearer`,
            },
            {}
        );

        const res = mockResponse();

        const next = mockNext();

        await authenticate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
    });

    test("authenticate() should send a HTTP status code of 401 if the access token is invalid/expires", async () => {
        const req = mockRequest(
            {
                authorization: `Bearer ${expired_test_token}`,
            },
            {}
        );

        const res = mockResponse();

        const next = mockNext();

        await authenticate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
    });
});
