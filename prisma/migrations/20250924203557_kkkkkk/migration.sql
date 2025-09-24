-- AlterTable
ALTER TABLE "public"."JobSeeker" ADD COLUMN     "addressOfBirth" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "desiredCity" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "desiredWorkPlace" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "messengerNumber" TEXT NOT NULL DEFAULT '';
