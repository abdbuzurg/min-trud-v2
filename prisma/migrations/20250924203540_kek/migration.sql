/*
  Warnings:

  - You are about to drop the column `addressOfBirth` on the `JobSeeker` table. All the data in the column will be lost.
  - You are about to drop the column `desiredCity` on the `JobSeeker` table. All the data in the column will be lost.
  - You are about to drop the column `desiredWorkPlace` on the `JobSeeker` table. All the data in the column will be lost.
  - You are about to drop the column `messengerNumber` on the `JobSeeker` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."JobSeeker" DROP COLUMN "addressOfBirth",
DROP COLUMN "desiredCity",
DROP COLUMN "desiredWorkPlace",
DROP COLUMN "messengerNumber";
