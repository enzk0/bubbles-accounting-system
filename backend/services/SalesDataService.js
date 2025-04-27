import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getSalesDataById = async (id) => {
  return prisma.salesData.findUnique({
    where: { id },
  });
};

export const updateSalesData = async (id, updatedData) => {
  return prisma.salesData.update({
    where: { id },
    data: updatedData,
  });
};