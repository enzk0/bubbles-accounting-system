import request from "supertest";
import { test, expect, describe, vi } from "vitest";
import app from "../../app.js";

vi.mock("../../middleware/auth", () => ({
    authenticate: (req, res, next) => {
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

describe("INTEGRATION TESTS FOR /job-order/ POST ROUTE", () => {
    test("/job-order/ POST ROUTE should send a HTTP status code of 201 and create a jobOrder in the database", async () => {
        const response = await request(app)
            .post("/job-order/")
            .send(jobOrderTestData);

        console.log("/job-order/ response.body: ", response.body);

        expect(response.statusCode).toBe(201);
    });

    test("/job-order/ POST ROUTE should send a HTTP status code of 403 when the branch information provided points to an inactive branch", async () => {
        const response = await request(app)
            .post("/job-order/")
            .send({
                ...jobOrderTestData,
                branch: { id: 8 },
            });

        expect(response.statusCode).toBe(403);
    });

    test("/job-order/ POST ROUTE should send a HTTP status code of 403 when any of the job order items are inactive products", async () => {
        const response = await request(app)
            .post("/job-order/")
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

    test("/job-order/ POST ROUTE should send a HTTP status code of 404 when the branch information provided points to a non-existent branch", async () => {
        const response = await request(app)
            .post("/job-order/")
            .send({
                ...jobOrderTestData,
                branch: { id: 727 },
            });

        expect(response.statusCode).toBe(404);
    });

    test("/job-order/ POST ROUTE should send a HTTP status code of 422 when there are less than 7 job order items", async () => {
        const response = await request(app)
            .post("/job-order/")
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

    test("/job-order/ POST ROUTE should send a HTTP status code of 422 when customer information is incomplete", async () => {
        const response = await request(app)
            .post("/job-order/")
            .send({
                ...jobOrderTestData,
                customer: {},
            });

        expect(response.statusCode).toBe(422);
    });
});

describe.only("INTEGRATION TEST FOR /job-order/ GET ROUTE", () => {
    test("/job-order/ GET ROUTE should send a HTTP status code of 200 and fetches the specified job order from the database", async () => {
        const response = await request(app).get(
            "/job-order/?idCode=AB&idNumber=1"
        );

        expect(response.statusCode).toBe(200);
        expect(response.body.idCode).toEqual("AB");
        expect(response.body.idNumber).toEqual(1);
    });

    test("/job-order/ GET ROUTE should send a HTTP status code of 422 when either the idCode or idNumber is invalid", async () => {
        let response = await request(app).get("/job-order/?idCode=&idNumber=1");

        expect(response.statusCode).toBe(422);

        response = await request(app).get("/job-order/?idCode=AB&idNumber=");

        expect(response.statusCode).toBe(422);

        response = await request(app).get("/job-order/?idCode=&idNumber=");

        expect(response.statusCode).toBe(422);
    });
});

//tests for summarizing the job order
describe("/count GET route", () => {
    test("Should return a response of 200", async () => {
        const response = await request(app).get("/job-order/get");
        expect(response.statusCode).toBe(200);
    });

    test("countAllJobOrder() should return the count of job orders for interval: day", async () => {
        const response = await request(app)
            .get("/job-order/count")
            .send({ interval: "day" });
        console.log("response: ", response.body);

        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveProperty("interval_start");
        expect(response.body).toHaveProperty("total_unpaid");
        expect(response.body).toHaveProperty("no_of_unpaid");
        expect(response.body).toHaveProperty("total_paid");
        expect(response.body).toHaveProperty("total");
        expect(response.body).toHaveProperty("no_of_job_orders");
        expect(response.body).toHaveProperty("no_of_paid");
        expect(response.body).toHaveProperty("no_of_claimed");
        expect(response.body).toHaveProperty("no_of_unclaimed");

        expect(response.body).toBeTypeOf("object");
    });

    test("countJobOrder() should return the count of job orders for interval: week", async () => {
        const response = await request(app).get("/job-order/count").send({
            interval: "week",
        });
        console.log("response: ", response.body);

        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveProperty("interval_start");
        expect(response.body).toHaveProperty("total");
        expect(response.body).toHaveProperty("total_paid");
        expect(response.body).toHaveProperty("total_unpaid");
        expect(response.body).toHaveProperty("no_of_unpaid");
        expect(response.body).toHaveProperty("no_of_job_orders");
        expect(response.body).toHaveProperty("no_of_paid");
        expect(response.body).toHaveProperty("no_of_claimed");
        expect(response.body).toHaveProperty("no_of_unclaimed");

        expect(response.body).toBeTypeOf("object");
    });

    test("countJobOrder() should return the count of job orders for interval: month", async () => {
        const response = await request(app).get("/job-order/count").send({
            interval: "month",
        });
        console.log("response: ", response.body);

        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveProperty("interval_start");
        expect(response.body).toHaveProperty("total");
        expect(response.body).toHaveProperty("total_paid");
        expect(response.body).toHaveProperty("total_unpaid");
        expect(response.body).toHaveProperty("no_of_unpaid");
        expect(response.body).toHaveProperty("no_of_job_orders");
        expect(response.body).toHaveProperty("no_of_paid");
        expect(response.body).toHaveProperty("no_of_claimed");
        expect(response.body).toHaveProperty("no_of_unclaimed");

        expect(response.body).toBeTypeOf("object");
    });

    test("countJobOrder() should return the count of job orders for interval: year", async () => {
        const response = await request(app).get("/job-order/count").send({
            interval: "year",
        });
        console.log("response: ", response.body);

        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveProperty("interval_start");
        expect(response.body).toHaveProperty("total");
        expect(response.body).toHaveProperty("total_paid");
        expect(response.body).toHaveProperty("total_unpaid");
        expect(response.body).toHaveProperty("no_of_unpaid");
        expect(response.body).toHaveProperty("no_of_job_orders");
        expect(response.body).toHaveProperty("no_of_paid");
        expect(response.body).toHaveProperty("no_of_claimed");
        expect(response.body).toHaveProperty("no_of_unclaimed");

        expect(response.body).toBeTypeOf("object");
    });

    test("countJobOrder() should return 400 if interval is not provided", async () => {
        const response = await request(app).get("/job-order/count").send({
            interval: "",
        });
        console.log("response: ", response.body);
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toBe("Interval is required");
    });

    test("countJobOrder() should return 400 if interval is not valid", async () => {
        const response = await request(app).get("/job-order/count").send({
            interval: "OogaBooga",
        });
        console.log("response: ", response.body);
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toBe(
            "Interval must be day, week, month, or year."
        );
    });
});

//tests for getting all job orders by branch
describe("/get-by-branch/ GET route", () => {
    test("Should return a repsonse of 200", async () => {
        const response = await request(app)
            .get("/job-order/get-by-branch/")
            .send({
                branchId: 1,
            });
        expect(response.statusCode).toBe(200);
    });

    test("getAllJobOrderByBranch() should return all job orders by branch", async () => {
        const response = await request(app)
            .get("/job-order/get-by-branch/")
            .send({
                branchId: 1,
            });
        console.log("All Job Order by Branch response: ", response.body);
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeTypeOf("object");

        response.body.result.forEach((jobOrder) => {
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
        });
    });
});

describe("/count-by-branch GET route", () => {
    test("Should return a response of 200", async () => {
        const response = await request(app)
            .get("/job-order/count-by-branch")
            .send({
                branchId: 1,
                interval: "day",
            });
        expect(response.statusCode).toBe(200);
    });

    test("countJobOrderByBranch() should return the count of job orders by branch by day", async () => {
        const response = await request(app)
            .get("/job-order/count-by-branch")
            .send({
                branchId: 1,
                interval: "day",
            });
        console.log("Count by Branch response: ", response.body);
        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveProperty("interval_start");
        expect(response.body).toHaveProperty("total_unpaid");
        expect(response.body).toHaveProperty("no_of_unpaid");
        expect(response.body).toHaveProperty("total_paid");
        expect(response.body).toHaveProperty("total");
        expect(response.body).toHaveProperty("no_of_job_orders");
        expect(response.body).toHaveProperty("no_of_paid");
        expect(response.body).toHaveProperty("no_of_claimed");
        expect(response.body).toHaveProperty("no_of_unclaimed");

        expect(response.body).toBeTypeOf("object");
    });

    test("countJobOrderByBranch() should return the count of job orders by branch by week", async () => {
        const response = await request(app)
            .get("/job-order/count-by-branch")
            .send({
                branchId: 1,
                interval: "week",
            });
        console.log("Count by Branch response: ", response.body);
        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveProperty("interval_start");
        expect(response.body).toHaveProperty("total_unpaid");
        expect(response.body).toHaveProperty("no_of_unpaid");
        expect(response.body).toHaveProperty("total_paid");
        expect(response.body).toHaveProperty("total");
        expect(response.body).toHaveProperty("no_of_job_orders");
        expect(response.body).toHaveProperty("no_of_paid");
        expect(response.body).toHaveProperty("no_of_claimed");
        expect(response.body).toHaveProperty("no_of_unclaimed");

        expect(response.body).toBeTypeOf("object");
    });

    test("countJobOrderByBranch() should return the count of job orders by branch by month", async () => {
        const response = await request(app)
            .get("/job-order/count-by-branch")
            .send({
                branchId: 1,
                interval: "month",
            });
        console.log("Count by Branch response: ", response.body);
        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveProperty("interval_start");
        expect(response.body).toHaveProperty("total_unpaid");
        expect(response.body).toHaveProperty("no_of_unpaid");
        expect(response.body).toHaveProperty("total_paid");
        expect(response.body).toHaveProperty("total");
        expect(response.body).toHaveProperty("no_of_job_orders");
        expect(response.body).toHaveProperty("no_of_paid");
        expect(response.body).toHaveProperty("no_of_claimed");
        expect(response.body).toHaveProperty("no_of_unclaimed");

        expect(response.body).toBeTypeOf("object");
    });

    test("countJobOrderByBranch() should return the count of job orders by branch by year", async () => {
        const response = await request(app)
            .get("/job-order/count-by-branch")
            .send({
                branchId: 1,
                interval: "year",
            });
        console.log("Count by Branch response: ", response.body);
        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveProperty("interval_start");
        expect(response.body).toHaveProperty("total_unpaid");
        expect(response.body).toHaveProperty("no_of_unpaid");
        expect(response.body).toHaveProperty("total_paid");
        expect(response.body).toHaveProperty("total");
        expect(response.body).toHaveProperty("no_of_job_orders");
        expect(response.body).toHaveProperty("no_of_paid");
        expect(response.body).toHaveProperty("no_of_claimed");
        expect(response.body).toHaveProperty("no_of_unclaimed");

        expect(response.body).toBeTypeOf("object");
    });

    test("countJobOrder() should return 400 if branchId and interval is not provided", async () => {
        const response = await request(app)
            .get("/job-order/count-by-branch")
            .send({
                branchId: "",
                interval: "",
            });
        console.log("response: ", response.body);
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toBe("Interval and BranchID is required");
    });

    test("countJobOrder() should return 400 if branchId provided", async () => {
        const response = await request(app)
            .get("/job-order/count-by-branch")
            .send({
                branchId: "",
                interval: "day",
            });
        console.log("response: ", response.body);
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toBe("BranchID is required");
    });

    test("countJobOrder() should return 400 if interval is not provided", async () => {
        const response = await request(app)
            .get("/job-order/count-by-branch")
            .send({
                branchId: 1,
                interval: "",
            });
        console.log("response: ", response.body);
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toBe("Interval is required");
    });

    test("countJobOrder() should return 400 if branchId is not an integer", async () => {
        const response = await request(app)
            .get("/job-order/count-by-branch")
            .send({
                branchId: "affidavitofloss",
                interval: "day",
            });
        console.log("response: ", response.body);
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toBe("Branch ID must be an integer.");
    });

    test("countJobOrder() should return 400 if interval is incorrect", async () => {
        const response = await request(app)
            .get("/job-order/count-by-branch")
            .send({
                branchId: 1,
                interval: "OogaBooga",
            });
        console.log("response: ", response.body);
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toBe(
            "Interval must be day, week, month, or year."
        );
    });

    test("countJobOrder() should return 400 if interval is not valid and branchId is not an integer", async () => {
        const response = await request(app)
            .get("/job-order/count-by-branch")
            .send({
                branchId: "affidavitofloss",
                interval: "OogaBooga",
            });
        console.log("response: ", response.body);
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toBe(
            "Interval must be day, week, month, or year and BranchID must be an integer."
        );
    });
});

//tests for getting all job orders
describe("/get GET route", () => {
    test("Should return a response of 200", async () => {
        const response = await request(app).get("/job-order/get");
        expect(response.statusCode).toBe(200);
    });

    test("getAllJobOrder() should return all job orders", async () => {
        const response = await request(app).get("/job-order/get");
        console.log("All Job Order response: ", response.body);

        expect(response.statusCode).toBe(200);

        expect(response.body).toBeTypeOf("object");

        response.body.jobOrders.forEach((jobOrder) => {
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
        });
    });
});
