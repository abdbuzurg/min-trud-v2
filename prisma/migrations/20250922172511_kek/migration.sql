/*
  Warnings:

  - You are about to drop the column `currentAddress` on the `JobSeeker` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfBirth` on the `JobSeeker` table. All the data in the column will be lost.
  - You are about to drop the column `middlename` on the `JobSeeker` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `JobSeeker` table. All the data in the column will be lost.
  - You are about to drop the column `specialization` on the `JobSeeker` table. All the data in the column will be lost.
  - You are about to drop the column `surname` on the `JobSeeker` table. All the data in the column will be lost.
  - Added the required column `address` to the `JobSeeker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birthDate` to the `JobSeeker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `JobSeeker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `JobSeeker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `middleName` to the `JobSeeker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `speciality` to the `JobSeeker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."JobSeeker" DROP COLUMN "currentAddress",
DROP COLUMN "dateOfBirth",
DROP COLUMN "middlename",
DROP COLUMN "name",
DROP COLUMN "specialization",
DROP COLUMN "surname",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "birthDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "middleName" TEXT NOT NULL,
ADD COLUMN     "speciality" TEXT NOT NULL;
