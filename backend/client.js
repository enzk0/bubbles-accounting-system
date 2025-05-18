import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const queryContents = `
    COALESCE(SUM("JobOrderItem"."productPrice" * "JobOrderItem"."productQuantity"), 0) AS total,

    COALESCE(SUM("JobOrderItem"."productPrice" * "JobOrderItem"."productQuantity") FILTER (WHERE "JobOrder"."isPaid" = true), 0) AS total_paid,

    COALESCE(SUM("JobOrderItem"."productPrice" * "JobOrderItem"."productQuantity") FILTER (WHERE "JobOrder"."isPaid" = false), 0) AS total_unpaid,

    COUNT(DISTINCT ("JobOrder"."idCode", "JobOrder"."idNumber")) AS no_of_job_orders,

    COUNT(DISTINCT ("JobOrder"."idCode", "JobOrder"."idNumber")) FILTER (WHERE "JobOrder"."isPaid" = true) AS no_of_paid,

    COUNT(DISTINCT ("JobOrder"."idCode", "JobOrder"."idNumber")) FILTER (WHERE "JobOrder"."isPaid" = false) AS no_of_unpaid,

    COUNT(DISTINCT ("JobOrder"."idCode", "JobOrder"."idNumber")) FILTER (WHERE "JobOrder"."isClaimed" = true) AS no_of_claimed,

    COUNT(DISTINCT ("JobOrder"."idCode", "JobOrder"."idNumber")) FILTER (WHERE "JobOrder"."isClaimed" = false) AS no_of_unclaimed
`;

const custom = new PrismaClient().$extends({
    model: {
        jobOrder: {
            async groupByDate(interval, filter) {
                const conditions = [];
                const values = [];
                let paramIndex = 1;

                if (filter.branchId) {
                    conditions.push(`"JobOrder"."branchId" = $${paramIndex++}`);
                    values.push(filter.branchId);
                }

                if (filter.userId) {
                    conditions.push(`"JobOrder"."userId" = $${paramIndex++}`);
                    values.push(filter.userId);
                }

                if (filter.customerId) {
                    conditions.push(
                        `"JobOrder"."customerId" = $${paramIndex++}`
                    );
                    values.push(filter.customerId);
                }

                const whereClause = conditions.length
                    ? `WHERE ${conditions.join(" AND ")}`
                    : "";

                const query = `
                    SELECT 
                        DATE_TRUNC($${paramIndex}, "JobOrder"."createdAt") AS interval_start, 
                        ${queryContents}
                    FROM "JobOrder"
                    JOIN "JobOrderItem" ON 
                        "JobOrderItem"."jobOrderIdCode" = "JobOrder"."idCode" AND
                        "JobOrderItem"."jobOrderIdNumber" = "JobOrder"."idNumber"
                    ${whereClause}
                    GROUP BY DATE_TRUNC($${paramIndex}, "JobOrder"."createdAt")
                    ORDER BY interval_start
                `;

                values.push(interval);
                return prisma.$queryRawUnsafe(query, ...values);
            },
        },
    },
});

export default prisma;

export { prisma, custom };
