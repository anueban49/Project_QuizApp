/*
  Warnings:

  - You are about to drop the column `conversationId` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the `Conversation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_conversationId_fkey";

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "conversationId";

-- DropTable
DROP TABLE "Conversation";
