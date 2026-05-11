/*
  Warnings:

  - You are about to drop the `Points` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Points";
