/*
  Warnings:

  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PermissionToRole` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `Branch` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_PermissionToRole" DROP CONSTRAINT "_PermissionToRole_A_fkey";

-- DropForeignKey
ALTER TABLE "_PermissionToRole" DROP CONSTRAINT "_PermissionToRole_B_fkey";

-- AlterTable
ALTER TABLE "Branch" ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "counter" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "JobOrder" ADD COLUMN     "isHidden" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "isPaid" SET DEFAULT false,
ALTER COLUMN "isClaimed" SET DEFAULT false;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Permission";

-- DropTable
DROP TABLE "_PermissionToRole";
