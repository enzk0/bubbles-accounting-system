import { PrismaClient } from "@prisma/client";
import prisma from "../client.js";

const custom = new PrismaClient().$extends({
    model: {
      jobOrder: {
        async getByBranch(branchID) {
          const query = `
          SELECT
            jo."idCode" AS "jobOrderIdCode",
            jo."idNumber" AS "jobOrderIdNumber",
            jo."createdAt" AS "jobOrderCreatedAt",
            jo."paidAt" AS "jobOrderPaidAt",
            jo."claimedAt" AS "jobOrderClaimedAt",
            jo."isPaid" AS "jobOrderIsPaid",
            jo."isClaimed" AS "jobOrderIsClaimed",
            jo."employeeInCharge",
            jo."remarks",
            b."id" AS "branchId",
            b."code" AS "branchCode",
            b."name" AS "branchName",
            b."address" AS "branchAddress",
            c."id" AS "customerId",
            c."name" AS "customerName",
            c."address" AS "customerAddress",
            c."contactNo" AS "customerContactNo",
            u."id" AS "userId",
            u."name" AS "adminName",
            r."name" AS "adminRole",
            joi."id" AS "jobOrderItemId",
            joi."productName",
            joi."productPrice",
            joi."productQuantity",
            p."id" AS "productId",
            p."name" AS "originalProductName",
            p."price" AS "originalProductPrice"
        FROM "JobOrder" jo
        JOIN "Branch" b ON jo."branchId" = b."id"
        JOIN "Customer" c ON jo."customerId" = c."id"
        JOIN "User" u ON jo."userId" = u."id"
        LEFT JOIN "Role" r ON u."roleId" = r."id"
        LEFT JOIN "JobOrderItem" joi ON joi."jobOrderIdCode" = jo."idCode" AND joi."jobOrderIdNumber" = jo."idNumber"
        LEFT JOIN "Product" p ON joi."productId" = p."id"
        WHERE 
            jo."isHidden" = false
            AND jo."branchId" = ${branchID}
        ORDER BY jo."createdAt" DESC;
        `;
        
          return prisma.$queryRawUnsafe(query);
        },
    },
  },
});

export async function getJobOrder(req, res) {
  const { branchId } = req.body;

  try {
    const jobOrders = await custom.jobOrder.getByBranch(branchId);
    
    if ( jobOrders == null || jobOrders == undefined) {
      console.log("No job orders found");
      return res.status(404).json({ error: "No job orders found" });
    }
    
    if (jobOrders.length === 0) {
      return res.status(404).json({ error: "No job orders found" });
    }

    const result = jobOrders;

    return result
  } catch (error) {
    console.error("Error getting job orders:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}