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
        return res.status(422);
    }

    if (jobOrder.items.length < 7) {
        return res.status(422);
    }

    try {
        const branchFound = await prisma.branch.findUnique({
            where: {
                id: branch.id,
            },
        });

        if (branchFound === null || !branchFound) {
            return res.status(404);
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

        res.status(201);
        return createdJobOrder;
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: error });
    }
}
