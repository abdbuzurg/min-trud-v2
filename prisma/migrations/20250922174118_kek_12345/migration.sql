/*
  Warnings:

  - Added the required column `institution` to the `JobSeeker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."JobSeeker" ADD COLUMN     "institution" TEXT NOT NULL;
