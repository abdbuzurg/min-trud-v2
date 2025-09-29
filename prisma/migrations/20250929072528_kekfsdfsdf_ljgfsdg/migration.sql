/*
  Warnings:

  - You are about to drop the column `desiredWorkPlace` on the `JobSeeker` table. All the data in the column will be lost.
  - You are about to drop the column `education` on the `JobSeeker` table. All the data in the column will be lost.
  - You are about to drop the column `institution` on the `JobSeeker` table. All the data in the column will be lost.
  - You are about to drop the column `speciality` on the `JobSeeker` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."JobSeeker" DROP COLUMN "desiredWorkPlace",
DROP COLUMN "education",
DROP COLUMN "institution",
DROP COLUMN "speciality",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."WorkExperience" ALTER COLUMN "dateEnd" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."Education" (
    "id" SERIAL NOT NULL,
    "jobSeekerId" INTEGER NOT NULL,
    "education" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "specailty" TEXT NOT NULL,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Education" ADD CONSTRAINT "Education_jobSeekerId_fkey" FOREIGN KEY ("jobSeekerId") REFERENCES "public"."JobSeeker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
