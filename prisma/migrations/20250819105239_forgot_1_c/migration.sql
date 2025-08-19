/*
  Warnings:

  - Added the required column `syncedWith1C` to the `JobSeeker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."JobSeeker" ADD COLUMN     "syncedWith1C" BOOLEAN NOT NULL;
