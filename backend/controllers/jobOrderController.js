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
                user: {
                    omit: {
                        password: true,
                    },
                },
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

export async function getAssignedJobOrders(req, res) {
    const { isOngoing } = req.query;
    const { id } = req.user;

    let filter = {};

    if (isOngoing !== undefined) {
        if (isOngoing === "true") {
            filter.OR = [{ isPaid: false }, { isClaimed: false }];
        }

        if (isOngoing === "false") {
            filter = {
                ...filter,
                isPaid: true,
                isClaimed: true,
            };
        }
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
        });

        const found = await prisma.jobOrder.findMany({
            where: {
                ...filter,
                userId: user.id,
                branchId: user.branchId,
            },
            include: {
                branch: true,
                customer: true,
                user: {
                    omit: {
                        password: true,
                    },
                },
                jobOrderItems: true,
            },
            orderBy: {
                idNumber: "desc",
            },
        });

        if (found.length === 0 || found === null || found === undefined) {
            return res
                .status(404)
                .send({ message: "No job orders could be found" });
        }

        const processed = found.map((jobOrder) => {
            const total = jobOrder.jobOrderItems.reduce(
                (sum, jobOrderItem) =>
                    sum +
                    jobOrderItem.productPrice * jobOrderItem.productQuantity,
                0
            );
            return {
                ...jobOrder,
                total: total,
            };
        });

        res.status(200).json(processed);
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
        isPaid,
        isClaimed,
        isHidden,
        isOngoing,
    } = req.query;

    let filter = {};

    if (rawBranchId !== undefined && Number(rawBranchId) !== NaN) {
        filter.branchId = parseInt(rawBranchId);
    }

    if (rawUserId !== undefined && Number(rawUserId) !== NaN) {
        filter.userId = parseInt(rawUserId);
    }

    if (rawCustomerId !== undefined && Number(rawCustomerId) !== NaN) {
        filter.customerId = parseInt(rawCustomerId);
    }

    if (isPaid !== undefined) {
        filter.isPaid = isPaid === "true";
    }

    if (isClaimed !== undefined) {
        filter.isClaimed = isClaimed === "true";
    }

    if (isHidden !== undefined) {
        filter.isHidden = isHidden === "true";
    }

    if (isOngoing !== undefined) {
        if (isOngoing === "true") {
            filter.OR = [{ isPaid: false }, { isClaimed: false }];
        }
    }

    console.log(filter);

    try {
        const found = await prisma.jobOrder.findMany({
            where: filter,
            include: {
                branch: true,
                customer: true,
                user: {
                    omit: {
                        password: true,
                    },
                },
                jobOrderItems: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        if (found.length === 0 || found === null || found === undefined) {
            return res
                .status(404)
                .send({ message: "No job orders could be found" });
        }

        const processed = found.map((jobOrder) => {
            console.log(jobOrder.jobOrderItems);
            const total = jobOrder.jobOrderItems.reduce(
                (sum, jobOrderItem) =>
                    sum +
                    jobOrderItem.productPrice * jobOrderItem.productQuantity,
                0
            );
            return {
                ...jobOrder,
                total: total,
            };
        });

        res.status(200).json(processed);
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

    let filter = {};

    if (rawBranchId !== undefined && Number(rawBranchId) !== NaN) {
        filter.branchId = parseInt(rawBranchId);
    }

    if (rawUserId !== undefined && Number(rawUserId) !== NaN) {
        filter.userId = parseInt(rawUserId);
    }

    if (rawCustomerId !== undefined && Number(rawCustomerId) !== NaN) {
        filter.customerId = parseInt(rawCustomerId);
    }

    console.log(filter);

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

        const parsed = found.map((obj) =>
            Object.fromEntries(
                Object.entries(obj).map(([key, value]) => [
                    key,
                    typeof value === "bigint" ? Number(value) : value,
                ])
            )
        );

        res.status(200).json(parsed);
        return parsed;
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "An error has occurred with the database client",
            error: error,
        });
    }
}

export async function editJobOrderStatus(req, res) {
    const { isPaid, isClaimed } = req.body;
    const { idCode, idNumber: rawIdNumber } = req.query;
    const idNumber = parseInt(rawIdNumber);

    let data = {};

    if (!idCode || !idNumber) {
        return res
            .status(422)
            .send({ message: "idCode and idNumber provided is invalid" });
    }

    if (isPaid !== undefined) {
        if (typeof isPaid !== "boolean") {
            return res
                .status(422)
                .send({ message: "The provided isPaid status is invalid" });
        }

        data.isPaid = isPaid;

        if (isPaid === true) {
            data.paidAt = new Date();
        } else {
            data.paidAt = null;
        }
    }

    if (isClaimed !== undefined) {
        if (typeof isClaimed !== "boolean") {
            return res
                .status(422)
                .send({ message: "The provided isClaimed status is invalid" });
        }

        data.isClaimed = isClaimed;

        if (isClaimed === true) {
            data.claimedAt = new Date();
        } else {
            data.claimedAt = null;
        }
    }

    console.log(data);

    try {
        const found = await prisma.jobOrder.findUnique({
            where: {
                idCode_idNumber: {
                    idCode: idCode,
                    idNumber: idNumber,
                },
            },
        });

        if (found.isPaid === true && found.isClaimed === true) {
            return res.status(403).send({
                message: "Cannot edit the status of a completed job order",
            });
        }

        const edited = await prisma.jobOrder.update({
            where: {
                idCode_idNumber: {
                    idCode: idCode,
                    idNumber: idNumber,
                },
            },
            data: data,
        });

        res.status(200).send({
            message: "Job Order Status has been successfully edited",
        });
        return edited;
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "An error has occurred with the database client",
            error: error,
        });
    }
}

export async function countAssignedJobOrders(req, res) {
    const { id } = req.user;
    const { interval } = req.query;

    let filter = {};

    const validIntervals = ["day", "week", "month", "quarter", "year"];

    if (!validIntervals.includes(interval)) {
        return res
            .status(422)
            .send({ message: "Provided interval is not valid" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
        });

        filter = {
            ...filter,
            userId: user.id,
            branchId: user.branchId,
        };

        const found = await custom.jobOrder.groupByDate(interval, filter);

        if (found.length === 0 || found === null || found === undefined) {
            return res
                .status(404)
                .send({ message: "No job orders can be grouped/summarized" });
        }

        const parsed = found.map((obj) =>
            Object.fromEntries(
                Object.entries(obj).map(([key, value]) => [
                    key,
                    typeof value === "bigint" ? Number(value) : value,
                ])
            )
        );

        res.status(200).json(parsed[0]);
        return parsed[0];
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "An error has occurred with the database client",
            error: error,
        });
    }
}
