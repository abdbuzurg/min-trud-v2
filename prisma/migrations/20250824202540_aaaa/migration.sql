/*
  Warnings:

  - You are about to drop the column `addressOfBirth` on the `JobSeeker` table. All the data in the column will be lost.
  - You are about to drop the column `countryOfBirth` on the `JobSeeker` table. All the data in the column will be lost.
  - You are about to drop the column `desiredCity` on the `JobSeeker` table. All the data in the column will be lost.
  - You are about to drop the column `desiredWorkplace` on the `JobSeeker` table. All the data in the column will be lost.
  - You are about to drop the column `messengerNumber` on the `JobSeeker` table. All the data in the column will be lost.
  - Added the required column `additionalInformation` to the `JobSeeker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."JobSeeker" DROP COLUMN "addressOfBirth",
DROP COLUMN "countryOfBirth",
DROP COLUMN "desiredCity",
DROP COLUMN "desiredWorkplace",
DROP COLUMN "messengerNumber",
ADD COLUMN     "additionalInformation" TEXT NOT NULL;
