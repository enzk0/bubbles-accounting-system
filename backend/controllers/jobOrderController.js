import prisma, { custom } from "../client.js";
import { PrismaClient } from "@prisma/client";

async function incrementBranchCounter(branchId) {
    await prisma.branch.update({
        where: {
            id: branchId,
        },
        data: {
            counter: {
                increment: 1,
            },
        },
    });
}

async function createJobOrderItems(
    jobOrderIdCode,
    jobOrderIdNumber,
    jobOrderItems
) {
    for (const item of jobOrderItems) {
        try {
            const job_order_item = await prisma.jobOrderItem.create({
                data: {
                    productName: item.productName,
                    productPrice: item.productPrice,
                    productQuantity: item.productQuantity,
                    product: {
                        connect: { id: item.productId },
                    },
                    jobOrder: {
                        connect: {
                            idCode_idNumber: {
                                idCode: jobOrderIdCode,
                                idNumber: jobOrderIdNumber,
                            },
                        },
                    },
                },
            });
        } catch (error) {
            console.log(error);
        }
    }
}

export async function createJobOrder(req, res) {
    const user = req.user;
    const { branch, customer, jobOrder } = req.body;

    if (!customer.firstName || !customer.lastName) {
        return res
            .status(422)
            .send({ message: "Required Customer Information is incomplete" });
    }

    if (jobOrder.items.length < 7) {
        return res
            .status(422)
            .send({ message: "The job order is missing job order items" });
    }

    try {
        const branchFound = await prisma.branch.findUnique({
            where: {
                id: branch.id,
            },
        });

        if (branchFound === null || !branchFound) {
            return res.status(404).send({
                message:
                    "The branch the job order is to be assigned to cannot be found",
            });
        }

        if (branchFound.isActive === false) {
            return res.status(403).send({
                message:
                    "The branch the job order is to be assigned to is inactive",
            });
        }

        for (const item of jobOrder.items) {
            const product = await prisma.product.findUnique({
                where: {
                    id: item.productId,
                },
            });

            if (product.isActive === false) {
                return res.status(403).send({
                    message:
                        "The product of a job order item of the job order is inactive",
                });
            }
        }

        const createdJobOrder = await prisma.jobOrder.create({
            data: {
                idCode: branchFound.code,
                idNumber: branchFound.counter,
                remarks: jobOrder.remarks,
                branch: {
                    connect: { id: branchFound.id },
                },
                customer: {
                    create: customer,
                },
                user: {
                    connect: { id: user.id },
                },
            },
        });

        await createJobOrderItems(
            createdJobOrder.idCode,
            createdJobOrder.idNumber,
            jobOrder.items
        );

        await incrementBranchCounter(branchFound.id);

        res.status(201).send({
            message: "Job Order has been successfully created",
        });
        return createdJobOrder;
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "An error has occurred with the database client",
            error: error,
        });
    }
}

export async function getJobOrder(req, res) {
    const { idCode, idNumber: rawIdNumber } = req.query;
    const idNumber = parseInt(rawIdNumber);

    if (!idCode || !idNumber) {
        return res
            .status(422)
            .send({ message: "idCode and idNumber provided is invalid" });
    }

    try {
        const found = await prisma.jobOrder.findUnique({
            where: {
                idCode_idNumber: {
                    idCode: idCode,
                    idNumber: idNumber,
                },
            },
            include: {
                branch: true,
                customer: true,
                user: true,
                jobOrderItems: true,
            },
        });

        if (found === null || found === undefined) {
            return res
                .status(404)
                .send({ message: "Job Order could not be found" });
        }

        res.status(200).json(found);
        return found;
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "An error has occurred with the database client",
            error: error,
        });
    }
}

export async function getAllJobOrders(req, res) {
    const {
        branchId: rawBranchId,
        userId: rawUserId,
        customerId: rawCustomerId,
    } = req.query;

    const branchId = parseInt(rawBranchId);
    const userId = parseInt(rawUserId);
    const customerId = parseInt(rawCustomerId);

    let filter = {};

    if (branchId !== undefined && branchId !== NaN) {
        filter.branchId = branchId;
    }

    if (userId !== undefined && userId !== NaN) {
        filter.userId = userId;
    }

    if (customerId !== undefined && customerId !== NaN) {
        filter.customerId = customerId;
    }

    try {
        const found = await prisma.jobOrder.findMany({
            where: filter,
            include: {
                branch: true,
                customer: true,
                user: true,
                jobOrderItems: true,
            },
        });

        if (found.length === 0 || found === null || found === undefined) {
            return res
                .status(404)
                .send({ message: "No job orders could be found" });
        }

        res.status(200).json(found);
        return found;
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "An error has occurred with the database client",
            error: error,
        });
    }
}

export async function countJobOrders(req, res) {
    const {
        interval,
        branchId: rawBranchId,
        userId: rawUserId,
        customerId: rawCustomerId,
    } = req.query;

    const branchId = parseInt(rawBranchId);
    const userId = parseInt(rawUserId);
    const customerId = parseInt(rawCustomerId);

    let filter = {};

    if (branchId !== undefined && branchId !== NaN) {
        filter.branchId = branchId;
    }

    if (userId !== undefined && userId !== NaN) {
        filter.userId = userId;
    }

    if (customerId !== undefined && customerId !== NaN) {
        filter.customerId = customerId;
    }

    const validIntervals = ["day", "week", "month", "quarter", "year"];

    if (!validIntervals.includes(interval)) {
        return res
            .status(422)
            .send({ message: "Provided interval is not valid" });
    }

    try {
        const found = await custom.jobOrder.groupByDate(interval, filter);

        if (found.length === 0 || found === null || found === undefined) {
            return res
                .status(404)
                .send({ message: "No job orders can be grouped/summarized" });
        }

        res.status(200).json(found);
        return found;
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "An error has occurred with the database client",
            error: error,
        });
    }
}
