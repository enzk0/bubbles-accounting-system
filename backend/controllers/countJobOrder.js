import { PrismaClient } from "@prisma/client";
import prisma from "../client.js";


const custom = new PrismaClient().$extends({
    model: {
      jobOrder: {
        async groupByDate(interval) {
          const query = `
          SELECT 
            DATE_TRUNC('${interval}', "JobOrder"."createdAt") AS interval_start, 
            SUM("JobOrderItem"."productPrice" * "JobOrderItem"."productQuantity") AS total, 
            COALESCE(
              SUM("JobOrderItem"."productPrice" * "JobOrderItem"."productQuantity"), 0
            ) AS total, 
            COALESCE(
              SUM("JobOrderItem"."productPrice" * "JobOrderItem"."productQuantity") FILTER (WHERE "JobOrder"."isPaid" = true), 0
            ) AS total_paid, 
            COALESCE(
              SUM("JobOrderItem"."productPrice" * "JobOrderItem"."productQuantity") FILTER (WHERE "JobOrder"."isPaid" = false), 0
            ) AS total_unpaid, 
            COUNT(DISTINCT ("JobOrder"."idCode", "JobOrder"."idNumber")) as no_of_job_orders, 
            COUNT(DISTINCT ("JobOrder"."idCode", "JobOrder"."idNumber")) FILTER (WHERE "JobOrder"."isPaid" = true) as no_of_paid, 
            COUNT(DISTINCT ("JobOrder"."idCode", "JobOrder"."idNumber")) FILTER (WHERE "JobOrder"."isPaid" = false) as no_of_unpaid, 
            COUNT(DISTINCT ("JobOrder"."idCode", "JobOrder"."idNumber")) FILTER (WHERE "JobOrder"."isClaimed" = true) as no_of_claimed, 
            COUNT(DISTINCT ("JobOrder"."idCode", "JobOrder"."idNumber")) FILTER (WHERE "JobOrder"."isClaimed" = false) as no_of_unclaimed 
          FROM "JobOrder" 
          JOIN "JobOrderItem" ON 
            "JobOrderItem"."jobOrderIdCode" = "JobOrder"."idCode" AND 
            "JobOrderItem"."jobOrderIdNumber" = "JobOrder"."idNumber" 
          GROUP BY DATE_TRUNC('${interval}', "JobOrder"."createdAt") 
          ORDER BY interval_start
        `;
          
          return prisma.$queryRawUnsafe(query);
        },

        async groupByDateByBranch(interval, branchId) {
          const query = `
          SELECT 
            DATE_TRUNC('${interval}', "JobOrder"."createdAt") AS interval_start, 
            COALESCE(
              SUM("JobOrderItem"."productPrice" * "JobOrderItem"."productQuantity"), 0
            ) AS total, 
            COALESCE(
              SUM("JobOrderItem"."productPrice" * "JobOrderItem"."productQuantity") FILTER (WHERE "JobOrder"."isPaid" = true), 0
            ) AS total_paid, 
            COALESCE(
              SUM("JobOrderItem"."productPrice" * "JobOrderItem"."productQuantity") FILTER (WHERE "JobOrder"."isPaid" = false), 0
            ) AS total_unpaid, 
            SUM("JobOrderItem"."productPrice" * "JobOrderItem"."productQuantity") AS total, 
            COUNT(DISTINCT ("JobOrder"."idCode", "JobOrder"."idNumber")) as no_of_job_orders, 
            COUNT(DISTINCT ("JobOrder"."idCode", "JobOrder"."idNumber")) FILTER (WHERE "JobOrder"."isPaid" = true) as no_of_paid, 
            COUNT(DISTINCT ("JobOrder"."idCode", "JobOrder"."idNumber")) FILTER (WHERE "JobOrder"."isPaid" = false) as no_of_unpaid, 
            COUNT(DISTINCT ("JobOrder"."idCode", "JobOrder"."idNumber")) FILTER (WHERE "JobOrder"."isClaimed" = true) as no_of_claimed, 
            COUNT(DISTINCT ("JobOrder"."idCode", "JobOrder"."idNumber")) FILTER (WHERE "JobOrder"."isClaimed" = false) as no_of_unclaimed 
          FROM "JobOrder" 
          JOIN "JobOrderItem" ON 
            "JobOrderItem"."jobOrderIdCode" = "JobOrder"."idCode" AND 
            "JobOrderItem"."jobOrderIdNumber" = "JobOrder"."idNumber" 
          WHERE "JobOrder"."branchId" = ${branchId} 
          GROUP BY DATE_TRUNC('${interval}', "JobOrder"."createdAt") 
          ORDER BY interval_start
        `;
          return prisma.$queryRawUnsafe(query);
      },
    },
  },
});

export async function countJobOrder(req, res) {
  const { interval } = req.body;

  if (!interval) {
    return res.status(400).json({ error: "Interval is required" });
  }
  if (interval !== "day" && interval !== "week" && interval !== "month" && interval !== "year") {
    return res.status(400).json({ error: "Interval must be day, week, month, or year." });
  }

  try {
    const jobOrderCount = await custom.jobOrder.groupByDate(interval);

    if ( jobOrderCount == null || jobOrderCount == undefined) {
      console.log("No job orders found");
      return res.status(404).json({ error: "No job orders found" });
    }

    if (jobOrderCount.length === 0) {
      console.log("No job orders found");
      return res.status(404).json({ error: "No job orders found" });
    }

    const { interval_start, total, total_paid, total_unpaid, no_of_job_orders, no_of_paid, no_of_unpaid, no_of_claimed, no_of_unclaimed } = jobOrderCount[0];
    
    const result = {
      interval_start: interval_start,
      total: parseFloat(total), //round up to 2 decimal places
      total_paid: parseFloat(total_paid),
      total_unpaid: parseFloat(total_unpaid),
      no_of_job_orders: parseInt(no_of_job_orders),
      no_of_paid: parseInt(no_of_paid),
      no_of_unpaid: parseInt(no_of_unpaid),
      no_of_claimed: parseInt(no_of_claimed),
      no_of_unclaimed: parseInt(no_of_unclaimed),
    }
    res.status(200).json(result);
    
    console.log(res.status);
    return result
  } catch (error) {
    console.error("Error counting job orders:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

  export async function countJobOrderByBranch(req, res) {
    const { interval, branchId } = req.body;

    if (!interval && !branchId) {
      return res.status(400).json({ error: "Interval and BranchID is required" })
    } else if (!interval) {
      return res.status(400).json({ error: "Interval is required" });
    } else if (!branchId) {
      return res.status(400).json({ error: "BranchID is required" });
    }

    if (interval !== "day" && interval !== "week" && interval !== "month" && interval !== "year") {
      return res.status(400).json({ error: "Interval must be day, week, month, or year." });
    }

    if (!Number.isInteger(branchId)) {
      return res.status(400).json({ error: "Branch ID must be a number." });
    }

    try {
      const jobOrderCount = await custom.jobOrder.groupByDateByBranch(interval, branchId);
      
      if (jobOrderCount == null || jobOrderCount == undefined) {
            console.log("No job orders found");
            return res.status(404).json({ error: "No job orders found" });
      }
      
      if (jobOrderCount.length === 0) {
        console.log("No job orders found");
        return res.status(404).json({ error: "No job orders found" });
      }
      ``
      const { interval_start, total, total_paid, total_unpaid, no_of_job_orders, no_of_paid, no_of_unpaid, no_of_claimed, no_of_unclaimed } = jobOrderCount[0];

      const result = {
      interval_start: interval_start,
      total: parseFloat(total), //round up to 2 decimal places
      total_paid: parseFloat(total_paid),
      total_unpaid: parseFloat(total_unpaid),
      no_of_job_orders: parseInt(no_of_job_orders),
      no_of_paid: parseInt(no_of_paid),
      no_of_unpaid: parseInt(no_of_unpaid),
      no_of_claimed: parseInt(no_of_claimed),
      no_of_unclaimed: parseInt(no_of_unclaimed),
      }
      res.status(200).json(result);
      console.log(result)
      
      return result
    } catch (error) {
      console.error("Error counting job orders:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
}

