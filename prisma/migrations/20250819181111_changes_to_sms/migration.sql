/*
  Warnings:

  - You are about to drop the column `txn_id` on the `SendSMS` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."SendSMS" DROP COLUMN "txn_id";
