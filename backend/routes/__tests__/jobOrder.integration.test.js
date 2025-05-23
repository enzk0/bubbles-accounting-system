import request from "supertest";
import { test, expect, describe, vi } from "vitest";
import app from "../../app.js";

vi.mock("../../middleware/auth", () => ({
    authenticate: (req, res, next) => {
        req.user = { id: 1 };
        next();
    },
}));

vi.mock("../../middleware/accessControl", () => ({
    checkPrivilege: (privileges) => (req, res, next) => {
        next();
    },
}));

const jobOrderTestData = {
    requester: { id: 1 },
    branch: {
        id: 2,
    },
    customer: {
        firstName: "Vivian",
        lastName: "Banshee",
        address: "Sixth Street",
        phoneNumber: "973 995 4609",
    },
    jobOrder: {
        items: [
            {
                productId: 1,
                productName: "WASH",
                productPrice: 60.0,
                productQuantity: 0,
            },
            {
                productId: 2,
                productName: "DRY",
                productPrice: 70.0,
                productQuantity: 0,
            },
            {
                productId: 3,
                productName: "DETERGENT",
                productPrice: 15.0,
                productQuantity: 0,
            },
            {
                productId: 4,
                productName: "FABCON",
                productPrice: 15.0,
                productQuantity: 0,
            },
            {
                productId: 5,
                productName: "LOAD",
                productPrice: 20.0,
                productQuantity: 0,
            },
            {
                productId: 6,
                productName: "FOLD",
                productPrice: 20.0,
                productQuantity: 0,
            },
            {
                productId: 7,
                productName: "DROPOFF",
                productPrice: 180.0,
                productQuantity: 0,
            },
        ],
    },
};

describe("INTEGRATION TESTS FOR /api/job-order/ POST ROUTE", () => {
    test("/api/job-order/ POST ROUTE should send a HTTP status code of 201 and create a jobOrder in the database", async () => {
        const response = await request(app, {})
            .post("/api/job-order/")
            .send(jobOrderTestData);

        console.log("/api/job-order/ response.body: ", response.body);

        expect(response.statusCode).toBe(201);
    });

    test("/api/job-order/ POST ROUTE should send a HTTP status code of 403 when the branch information provided points to an inactive branch", async () => {
        const response = await request(app)
            .post("/api/job-order/")
            .send({
                ...jobOrderTestData,
                branch: { id: 8 },
            });

        expect(response.statusCode).toBe(403);
    });

    test("/api/job-order/ POST ROUTE should send a HTTP status code of 403 when any of the job order items are inactive products", async () => {
        const response = await request(app)
            .post("/api/job-order/")
            .send({
                ...jobOrderTestData,
                jobOrder: {
                    items: [
                        {
                            productId: 1,
                            productName: "WASH",
                            productPrice: 60.0,
                            productQuantity: 0,
                        },
                        {
                            productId: 2,
                            productName: "DRY",
                            productPrice: 70.0,
                            productQuantity: 0,
                        },
                        {
                            productId: 3,
                            productName: "DETERGENT",
                            productPrice: 15.0,
                            productQuantity: 0,
                        },
                        {
                            productId: 4,
                            productName: "FABCON",
                            productPrice: 15.0,
                            productQuantity: 0,
                        },
                        {
                            productId: 5,
                            productName: "LOAD",
                            productPrice: 20.0,
                            productQuantity: 0,
                        },
                        {
                            productId: 8,
                            productName: "PERFUME",
                            productPrice: 50.0,
                            productQuantity: 0,
                        },
                        {
                            productId: 9,
                            productName: "IRON",
                            productPrice: 60.0,
                            productQuantity: 0,
                        },
                    ],
                },
            });

        expect(response.statusCode).toBe(403);
    });

    test("/api/job-order/ POST ROUTE should send a HTTP status code of 404 when the branch information provided points to a non-existent branch", async () => {
        const response = await request(app)
            .post("/api/job-order/")
            .send({
                ...jobOrderTestData,
                branch: { id: 727 },
            });

        expect(response.statusCode).toBe(404);
    });

    test("/api/job-order/ POST ROUTE should send a HTTP status code of 422 when there are less than 7 job order items", async () => {
        const response = await request(app)
            .post("/api/job-order/")
            .send({
                ...jobOrderTestData,
                jobOrder: {
                    items: [
                        {
                            productId: 1,
                            productName: "WASH",
                            productPrice: 60.0,
                            productQuantity: 0,
                        },
                        {
                            productId: 2,
                            productName: "DRY",
                            productPrice: 70.0,
                            productQuantity: 0,
                        },
                        {
                            productId: 3,
                            productName: "DETERGENT",
                            productPrice: 15.0,
                            productQuantity: 0,
                        },
                        {
                            productId: 4,
                            productName: "FABCON",
                            productPrice: 15.0,
                            productQuantity: 0,
                        },
                    ],
                },
            });

        expect(response.statusCode).toBe(422);
    });

    test("/api/job-order/ POST ROUTE should send a HTTP status code of 422 when customer information is incomplete", async () => {
        const response = await request(app)
            .post("/api/job-order/")
            .send({
                ...jobOrderTestData,
                customer: {},
            });

        expect(response.statusCode).toBe(422);
    });
});

describe("INTEGRATION TESTS FOR /api/job-order/ GET ROUTE", () => {
    test("/api/job-order/ GET ROUTE should send a HTTP status code of 200 and fetches the specified job order from the database", async () => {
        const response = await request(app).get(
            "/api/job-order/?idCode=AB&idNumber=1"
        );

        expect(response.statusCode).toBe(200);
        expect(response.body.idCode).toEqual("AB");
        expect(response.body.idNumber).toEqual(1);
    });

    test("/api/job-order/ GET ROUTE should send a HTTP status code of 422 when either the idCode or idNumber is invalid", async () => {
        let response = await request(app).get(
            "/api/job-order/?idCode=&idNumber=1"
        );

        expect(response.statusCode).toBe(422);

        response = await request(app).get(
            "/api/job-order/?idCode=AB&idNumber="
        );

        expect(response.statusCode).toBe(422);

        response = await request(app).get("/api/job-order/?idCode=&idNumber=");

        expect(response.statusCode).toBe(422);
    });
});

describe("INTEGRATION TESTS FOR /api/job-order/status/ PATCH ROUTE", () => {
    test("/api/job-order/status/ PATCH ROUTE should send a HTTP status code of 200 and modifies that status of the specified job order from the database", async () => {
        const response = await request(app)
            .patch("/api/job-order/status?idCode=AB&idNumber=2")
            .send({ isPaid: true });

        expect(response.statusCode).toBe(200);
    });

    test("/api/job-order/status/ PATCH ROUTE should send a HTTP status code of 422 when either the idCode or idNumber is invalid", async () => {
        let response = await request(app)
            .patch("/api/job-order/status?idCode=&idNumber=2")
            .send({ isPaid: false });

        expect(response.statusCode).toBe(422);

        response = await request(app)
            .patch("/api/job-order/status?idCodeAB=&idNumber=")
            .send({ isPaid: false });

        expect(response.statusCode).toBe(422);

        response = await request(app)
            .patch("/api/job-order/status?idCode=&idNumber=")
            .send({ isPaid: false });

        expect(response.statusCode).toBe(422);
    });

    test("/api/job-order/status/ PATCH ROUTE should send a HTTP status code of 422 type of isPaid or isClaimed is not boolean", async () => {
        let response = await request(app)
            .patch("/api/job-order/status?idCode=AB&idNumber=2")
            .send({ isPaid: 100 });

        expect(response.statusCode).toBe(422);

        response = await request(app)
            .patch("/api/job-order/status?idCode=AB&idNumber=2")
            .send({ isClaimed: "true" });

        expect(response.statusCode).toBe(422);
    });
});

describe("INTEGRATION TESTS FOR /api/job-order/all GET ROUTE", () => {
    const assertJobOrder = (jobOrder) => {
        expect(jobOrder).toHaveProperty("idCode");
        expect(jobOrder).toHaveProperty("idNumber");
        expect(jobOrder).toHaveProperty("createdAt");
        expect(jobOrder).toHaveProperty("updatedAt");
        expect(jobOrder).toHaveProperty("paidAt");
        expect(jobOrder).toHaveProperty("claimedAt");
        expect(jobOrder).toHaveProperty("isPaid");
        expect(jobOrder).toHaveProperty("isClaimed");
        expect(jobOrder).toHaveProperty("isHidden");
        expect(jobOrder).toHaveProperty("remarks");
        expect(jobOrder).toHaveProperty("branchId");
        expect(jobOrder).toHaveProperty("customerId");
        expect(jobOrder).toHaveProperty("userId");
        expect(jobOrder).toHaveProperty("branch");
        expect(jobOrder).toHaveProperty("user");
        expect(jobOrder).toHaveProperty("customer");
        expect(jobOrder).toHaveProperty("jobOrderItems");
    };

    test("/api/job-order/all GET ROUTE should send a HTTP status code of 200 and get all job orders from the database", async () => {
        const response = await request(app).get("/api/job-order/all");

        expect(response.statusCode).toBe(200);

        response.body.forEach((jobOrder) => {
            assertJobOrder(jobOrder);
        });
    });

    test("/api/job-order/all GET ROUTE should send a HTTP status code of 200 and get all job orders where isHidden is false from the database", async () => {
        const response = await request(app).get(
            "/api/job-order/all?isHidden=false"
        );

        expect(response.statusCode).toBe(200);

        console.log("isHidden = false Job Orders: ", response.body.length);

        response.body.forEach((jobOrder) => {
            assertJobOrder(jobOrder);
            expect(jobOrder.isHidden).toEqual(false);
        });
    });

    test("/api/job-order/all GET ROUTE should send a HTTP status code of 200 and get all job orders where branchId is 1 from the database", async () => {
        const response = await request(app).get(
            "/api/job-order/all?branchId=1"
        );

        expect(response.statusCode).toBe(200);

        console.log("branchId = 1 Job Orders: ", response.body.length);

        response.body.forEach((jobOrder) => {
            assertJobOrder(jobOrder);
            expect(jobOrder.branchId).toEqual(1);
        });
    });

    test("/api/job-order/all GET ROUTE should send a HTTP status code of 200 and get all job orders where userId is 1 from the database", async () => {
        const response = await request(app).get("/api/job-order/all?userId=1");

        expect(response.statusCode).toBe(200);

        console.log("userId = 1 Job Orders: ", response.body.length);

        response.body.forEach((jobOrder) => {
            assertJobOrder(jobOrder);
            expect(jobOrder.userId).toEqual(1);
        });
    });
});

describe("INTEGRATION TESTS FOR /api/job-order/all GET ROUTE", () => {
    const assertJobOrder = (jobOrder) => {
        expect(jobOrder).toHaveProperty("idCode");
        expect(jobOrder).toHaveProperty("idNumber");
        expect(jobOrder).toHaveProperty("createdAt");
        expect(jobOrder).toHaveProperty("updatedAt");
        expect(jobOrder).toHaveProperty("paidAt");
        expect(jobOrder).toHaveProperty("claimedAt");
        expect(jobOrder).toHaveProperty("isPaid");
        expect(jobOrder).toHaveProperty("isClaimed");
        expect(jobOrder).toHaveProperty("isHidden");
        expect(jobOrder).toHaveProperty("remarks");
        expect(jobOrder).toHaveProperty("branchId");
        expect(jobOrder).toHaveProperty("customerId");
        expect(jobOrder).toHaveProperty("userId");
        expect(jobOrder).toHaveProperty("branch");
        expect(jobOrder).toHaveProperty("user");
        expect(jobOrder).toHaveProperty("customer");
        expect(jobOrder).toHaveProperty("jobOrderItems");
    };

    test("/api/job-order/assigned GET ROUTE should send a HTTP status code of 200 and get the job orders assigned to the user from the database", async () => {
        const response = await request(app).get("/api/job-order/assigned");

        expect(response.statusCode).toBe(200);

        response.body.forEach((jobOrder) => {
            assertJobOrder(jobOrder);
            expect(jobOrder.userId).toEqual(1);
        });
    });

    test("/api/job-order/assigned GET ROUTE should send a HTTP status code of 200 and get the ongoing job orders assigned to the user from the database", async () => {
        const response = await request(app).get(
            "/api/job-order/assigned?isOngoing=true"
        );

        expect(response.statusCode).toBe(200);

        console.log("isHidden = false Job Orders: ", response.body.length);

        response.body.forEach((jobOrder) => {
            assertJobOrder(jobOrder);
            expect(jobOrder.isPaid).toEqual(false);
            expect(jobOrder.isClaimed).toEqual(false);
            expect(jobOrder.userId).toEqual(1);
        });
    });

    test("/api/job-order/assigned GET ROUTE should send a HTTP status code of 200 and get the completed job orders assigned to the user from the database", async () => {
        const response = await request(app).get(
            "/api/job-order/assigned?isOngoing=false"
        );

        expect(response.statusCode).toBe(200);

        console.log("isHidden = false Job Orders: ", response.body.length);

        response.body.forEach((jobOrder) => {
            assertJobOrder(jobOrder);
            expect(jobOrder.isPaid).toEqual(true);
            expect(jobOrder.isClaimed).toEqual(true);
            expect(jobOrder.userId).toEqual(1);
        });
    });
});

describe("INTEGRATION TESTS FOR /api/job-order/count GET ROUTE", () => {
    const assertSummary = (summary) => {
        expect(summary).toHaveProperty("interval_start");
        expect(summary).toHaveProperty("total_unpaid");
        expect(summary).toHaveProperty("no_of_unpaid");
        expect(summary).toHaveProperty("total_paid");
        expect(summary).toHaveProperty("total");
        expect(summary).toHaveProperty("no_of_job_orders");
        expect(summary).toHaveProperty("no_of_paid");
        expect(summary).toHaveProperty("no_of_claimed");
        expect(summary).toHaveProperty("no_of_unclaimed");
    };

    test("/api/job-order/count GET routes should send an HTTP status code of 200 and return a summary of job orders in daily granularity", async () => {
        const response = await request(app).get(
            "/api/job-order/count?interval=day"
        );

        expect(response.statusCode).toBe(200);

        response.body.forEach((summary) => {
            assertSummary(summary);
        });
    });

    test("/api/job-order/count GET routes should send an HTTP status code of 200 and return a summary of job orders in weekly granularity", async () => {
        const response = await request(app).get(
            "/api/job-order/count?interval=week"
        );

        expect(response.statusCode).toBe(200);

        response.body.forEach((summary) => {
            assertSummary(summary);
        });
    });

    test("/api/job-order/count GET routes should send an HTTP status code of 200 and return a summary of job orders in monthly granularity", async () => {
        const response = await request(app).get(
            "/api/job-order/count?interval=month"
        );

        expect(response.statusCode).toBe(200);

        response.body.forEach((summary) => {
            assertSummary(summary);
        });
    });

    test("/api/job-order/count GET routes should send an HTTP status code of 200 and return a summary of job orders in yearly granularity", async () => {
        const response = await request(app).get(
            "/api/job-order/count?interval=year"
        );

        expect(response.statusCode).toBe(200);

        response.body.forEach((summary) => {
            assertSummary(summary);
        });
    });

    test("/api/job-order/count GET routes should send an HTTP status code of 422 when interval is invalid", async () => {
        let response = await request(app).get(
            "/api/job-order/count?interval=minute"
        );

        expect(response.statusCode).toBe(422);

        response = await request(app).get("/api/job-order/count");

        expect(response.statusCode).toBe(422);

        response = await request(app).get(
            "/api/job-order/count?interval=skibidi"
        );

        expect(response.statusCode).toBe(422);
    });
});
