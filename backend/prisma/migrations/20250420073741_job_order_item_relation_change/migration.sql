/*
  Warnings:

  - Made the column `jobOrderIdCode` on table `JobOrderItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `jobOrderIdNumber` on table `JobOrderItem` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "JobOrderItem" DROP CONSTRAINT "JobOrderItem_jobOrderIdCode_jobOrderIdNumber_fkey";

-- AlterTable
ALTER TABLE "JobOrderItem" ALTER COLUMN "jobOrderIdCode" SET NOT NULL,
ALTER COLUMN "jobOrderIdNumber" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "JobOrderItem" ADD CONSTRAINT "JobOrderItem_jobOrderIdCode_jobOrderIdNumber_fkey" FOREIGN KEY ("jobOrderIdCode", "jobOrderIdNumber") REFERENCES "JobOrder"("idCode", "idNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
