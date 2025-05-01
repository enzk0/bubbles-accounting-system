/*
  Warnings:

  - Added the required column `branchId` to the `JobOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerId` to the `JobOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `JobOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobOrder" ADD COLUMN     "branchId" INTEGER NOT NULL,
ADD COLUMN     "customerId" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "JobOrderItem" ADD COLUMN     "jobOrderIdCode" TEXT,
ADD COLUMN     "jobOrderIdNumber" INTEGER;

-- AddForeignKey
ALTER TABLE "JobOrder" ADD CONSTRAINT "JobOrder_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobOrder" ADD CONSTRAINT "JobOrder_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobOrder" ADD CONSTRAINT "JobOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobOrderItem" ADD CONSTRAINT "JobOrderItem_jobOrderIdCode_jobOrderIdNumber_fkey" FOREIGN KEY ("jobOrderIdCode", "jobOrderIdNumber") REFERENCES "JobOrder"("idCode", "idNumber") ON DELETE SET NULL ON UPDATE CASCADE;
