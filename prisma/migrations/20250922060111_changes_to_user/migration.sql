/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `SendSMS` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - Added the required column `userId` to the `SendSMS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."SendSMS" DROP COLUMN "phoneNumber",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "email",
ADD COLUMN     "phoneNumber" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."SendSMS" ADD CONSTRAINT "SendSMS_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
