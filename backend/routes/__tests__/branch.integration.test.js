import request from "supertest";
import { test, expect, describe, vi } from "vitest";
import app from "../../app";

describe("/branch/create INTEGRATION TESTS", () => {
    test("/branch/create should create a branch in the database and send an HTTP status code of 200 along with a message", async () => {
        const response = await request(app)
            .post("/branch/create")
            .send({
                requester: { id: 1 },
                branch: { code: "LA", name: "Lala Land", address: "Lala Land" },
            });

        console.log(response.body);

        expect(response.statusCode).toBe(201);
    });

    test("/branch/create should send an HTTP status code of 500 and send an error message when attempting to create a non-unique branch ", async () => {
        const response = await request(app)
            .post("/branch/create")
            .send({
                requester: { id: 1 },
                branch: { code: "LA", name: "Lala Land", address: "Lala Land" },
            });

        console.log(response.body);

        expect(response.statusCode).toBe(500);
    });

    test("/branch/create should send an HTTP status code of 422 and send an error message when information provided to create a branch is incomplete", async () => {
        const response = await request(app)
            .post("/branch/create")
            .send({
                requester: { id: 1 },
                branch: { code: "", name: "", address: "" },
            });

        console.log(response.body);

        expect(response.statusCode).toBe(422);
    });
});

