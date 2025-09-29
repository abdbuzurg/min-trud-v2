/*
  Warnings:

  - You are about to drop the column `specailty` on the `Education` table. All the data in the column will be lost.
  - Added the required column `specialty` to the `Education` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Education" DROP COLUMN "specailty",
ADD COLUMN     "specialty" TEXT NOT NULL;
