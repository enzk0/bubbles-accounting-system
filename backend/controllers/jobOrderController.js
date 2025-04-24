import prisma from "../client";

export async function createJobOrder(req, res) {
  const { requester, branch, customer, jobOrder } = req.body;

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
        employeeInCharge: jobOrder.employeeInCharge,
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

    for (const item of jobOrder.items) {
      const job_order_item = await prisma.jobOrderItem.create({
        data: {
          productName: item.name,
          productPrice: item.price,
          productQuantity: item.quantity,
          product: {
            connect: { id: item.id },
          },
          JobOrder: {
            connect: {
              idCode_idNumber: {
                idCode: createdJobOrder.idCode,
                idNumber: createdJobOrder.idNumber,
              },
            },
          },
        },
      });
    }

    await prisma.branch.update({
      where: {
        id: branchFound.id,
      },
      data: {
        counter: {
          increment: 1,
        },
      },
    });
  } catch (error) {
    return res.status(500);
  }

  res.status(201);
}
