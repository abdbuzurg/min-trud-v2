/*
  Warnings:

  - Added the required column `maritalStatus` to the `JobSeeker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."JobSeeker" ADD COLUMN     "maritalStatus" TEXT NOT NULL;
