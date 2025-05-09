import prisma from '../client.js';

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
