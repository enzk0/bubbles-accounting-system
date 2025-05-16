import prisma from "../client";

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
    const { requester, branch, customer, jobOrder } = req.body;

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
                    connect: { id: requester.id },
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
