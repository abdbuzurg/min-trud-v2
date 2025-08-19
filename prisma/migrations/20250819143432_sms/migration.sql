-- CreateTable
CREATE TABLE "public"."SendSMS" (
    "id" SERIAL NOT NULL,
    "txn_id" INTEGER NOT NULL,
    "phoneNumber" TEXT NOT NULL,

    CONSTRAINT "SendSMS_pkey" PRIMARY KEY ("id")
);
