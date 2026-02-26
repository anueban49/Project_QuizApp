/*
  Warnings:

  - You are about to drop the column `contentId` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the `Content` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `orgArticle` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sumArticle` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_contentId_fkey";

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "contentId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "orgArticle" TEXT NOT NULL,
ADD COLUMN     "sumArticle" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Content";
