import prisma from "../client.js";

/**
 * Create a Job Order
 * @param {{
 * idCode: String, 
 * idNumber: int, 
 * isPaid: Boolean, 
 * isClaimed: Boolean,
 * employeeInCharge: String, 
 * remarks: String, 
 * branch: import("@prisma/client").Branch, 
 * branchId: Int, 
 * customer: import("@prisma/client").Customer, 
 * customerId: Int, 
 * user: import("@prisma/client").User, 
 * userID: int,
 * jobOrderItems: import("@prisma/client").JobOrderItem
 * }} jobOrder
 */
async function createJobOrder(jobOrder) {
    const isComplete =
        jobOrder.hasOwnProperty("id");
    
    console.log("Job Order Created! WoW!");
}

export { createJobOrder };