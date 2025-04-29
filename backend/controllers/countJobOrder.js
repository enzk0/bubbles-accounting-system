const custom = new PrismaClient().$extends({
  model: {
    jobOrder: {
      async groupByDate(interval) {
        const query = `
          SELECT 
            DATE_TRUNC('${interval}', "JobOrder"."createdAt") AS interval_start, 
            SUM("JobOrderItem"."productPrice"  "JobOrderItem"."productQuantity") AS total, 
            COALESCE(
              SUM("JobOrderItem"."productPrice"  "JobOrderItem"."productQuantity"), 0
            ) AS total, 
            COALESCE(
              SUM("JobOrderItem"."productPrice"  "JobOrderItem"."productQuantity") FILTER (WHERE "JobOrder"."isPaid" = true), 0
            ) AS total_paid, 
            COALESCE(
              SUM("JobOrderItem"."productPrice"  "JobOrderItem"."productQuantity") FILTER (WHERE "JobOrder"."isPaid" = false), 0
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
    },
  },
});
