-- CreateTable
CREATE TABLE "public"."JobSeeker" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "middlename" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "tin" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passportCode" TEXT NOT NULL,
    "countryOfBirth" TEXT NOT NULL,
    "addressOfBirth" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "messengerNumber" TEXT NOT NULL,
    "currentAddress" TEXT NOT NULL,
    "education" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "desiredSalary" TEXT NOT NULL,
    "dateOfReadiness" TIMESTAMP(3) NOT NULL,
    "desiredCountry" TEXT NOT NULL,
    "desiredCity" TEXT NOT NULL,
    "desiredWorkplace" TEXT NOT NULL,
    "criminalRecord" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobSeeker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AdditionalContactInfromation" (
    "id" SERIAL NOT NULL,
    "jobSeekerId" INTEGER NOT NULL,
    "fullname" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,

    CONSTRAINT "AdditionalContactInfromation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."KnowledgeOfLanguages" (
    "id" SERIAL NOT NULL,
    "jobSeekerId" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "level" TEXT NOT NULL,

    CONSTRAINT "KnowledgeOfLanguages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WorkExperience" (
    "id" SERIAL NOT NULL,
    "jobSeekerId" INTEGER NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "workplace" TEXT NOT NULL,
    "dateStart" TIMESTAMP(3) NOT NULL,
    "dateEnd" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."AdditionalContactInfromation" ADD CONSTRAINT "AdditionalContactInfromation_jobSeekerId_fkey" FOREIGN KEY ("jobSeekerId") REFERENCES "public"."JobSeeker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."KnowledgeOfLanguages" ADD CONSTRAINT "KnowledgeOfLanguages_jobSeekerId_fkey" FOREIGN KEY ("jobSeekerId") REFERENCES "public"."JobSeeker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkExperience" ADD CONSTRAINT "WorkExperience_jobSeekerId_fkey" FOREIGN KEY ("jobSeekerId") REFERENCES "public"."JobSeeker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
