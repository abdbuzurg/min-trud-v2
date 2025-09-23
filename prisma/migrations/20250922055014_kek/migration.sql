/*
  Warnings:

  - Added the required column `code` to the `SendSMS` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."JobSeeker" ALTER COLUMN "additionalInformation" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."SendSMS" ADD COLUMN     "code" TEXT NOT NULL;
