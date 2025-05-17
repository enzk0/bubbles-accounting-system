import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function findJobOrderById(id) {
  return prisma.jobOrder.findUnique({ where: { id: parseInt(id) } });
}

async function updateJobOrder(id, data) {
  return prisma.jobOrder.update({
    where: { id: parseInt(id) },
    data,
  });
}

export { findJobOrderById, updateJobOrder };
