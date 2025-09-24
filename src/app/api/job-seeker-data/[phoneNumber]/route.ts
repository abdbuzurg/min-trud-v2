
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from "@/app/secret";
import prisma from "../../../../../lib/prisma";
import { JobSeekerFromData } from "../../../../../types/jobSeeker";

type TokenPayload = JwtPayload & {
  phoneNumber: string;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ phoneNumber: string }> }
) {

  const { phoneNumber } = await params
  const noCache = {
    "Cache-Control": "no-store, max-age=0",
    Pragma: "no-cache",
    Expires: "0",
  };

  let token: string | null = null;
  const auth = request.headers.get("authorization") || request.headers.get("Authorization")
  if (auth?.startsWith("Bearer ")) {
    token = auth.slice("Bearer ".length).trim()
  }

  if (!token) {
    return NextResponse.json(
      { valid: false, error: "Вы не авторизованы" },
      { status: 401, headers: noCache }
    )
  }

  let tokenPhoneNumber = ""
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload

    if (!decoded?.phoneNumber || typeof decoded.phoneNumber !== "string") {
      return NextResponse.json(
        { valid: false, error: "Неправильные данные в токене" },
        { status: 400, headers: noCache }
      );
    }

    tokenPhoneNumber = decoded.phoneNumber
  } catch (err: any) {
    const message =
      err?.name === "TokenExpiredError"
        ? "Token has expired."
        : err?.name === "JsonWebTokenError"
          ? "Invalid token."
          : "Failed to verify token.";

    return NextResponse.json({ valid: false, error: message }, { status: 401, headers: noCache });
  }

  if (tokenPhoneNumber != phoneNumber) {
    return NextResponse.json({ valid: false, error: "Несовпадение номеров" }, { status: 401, headers: noCache });
  }

  const user = await prisma.user.findFirst({
    where: {
      phoneNumber: phoneNumber
    }
  })
  if (!user) {
    return NextResponse.json({ valid: false, error: "Пользователь с таким номером не существует" }, { status: 500, headers: noCache });
  }

  const jobSeekerData = await prisma.jobSeeker.findFirst({
    where: {
      userId: user.id,
    }
  })
  if (!jobSeekerData) {
    return NextResponse.json({ valid: false, error: "У данного пользователя не создан еще профиль" }, { status: 500, headers: noCache });
  }

  const additionalContactInformation = await prisma.additionalContactInfromation.findMany({
    where: {
      jobSeekerId: jobSeekerData.id,
    }
  })
  if (!additionalContactInformation) {
    return NextResponse.json({ profile: null, status: "Успех" }, { status: 200 })
  }

  const languages = await prisma.knowledgeOfLanguages.findMany({
    where: {
      jobSeekerId: jobSeekerData.id,
    }
  })
  if (!languages) {
    return NextResponse.json({ profile: null, status: "Успех" }, { status: 200 })
  }

  const workExperience = await prisma.workExperience.findMany({
    where: {
      jobSeekerId: jobSeekerData.id,
    }
  })
  if (!workExperience) {
    return NextResponse.json({ profile: null, status: "Успех" }, { status: 200 })
  }

  const result: JobSeekerFromData = {
    lastName: jobSeekerData.lastName,
    firstName: jobSeekerData.firstName,
    middleName: jobSeekerData.middleName,
    birthDate: jobSeekerData.birthDate.toString(),
    passportCode: jobSeekerData.passportCode,
    maritalStatus: jobSeekerData.maritalStatus,
    tin: jobSeekerData.tin,
    phone: jobSeekerData.phoneNumber,
    email: jobSeekerData.email,
    gender: jobSeekerData.gender,
    address: jobSeekerData.address,
    additionalContact: additionalContactInformation.length != 0,
    contactRelation: additionalContactInformation[0].status,
    contactRelationOther: "",
    contactName: additionalContactInformation[0].fullname,
    contactPhone: additionalContactInformation[0].phoneNumber,
    education: jobSeekerData.education,
    educationOther: jobSeekerData.education,
    institution: jobSeekerData.institution,
    specialty: jobSeekerData.speciality,
    languages: languages.map((v) => ({
      language: v.language,
      languageOther: v.language,
      level: v.level
    })),
    workExperience: workExperience.map(v => ({
      company: v.workplace,
      position: v.jobTitle,
      endDate: v.dateEnd.toString(),
      startDate: v.dateStart.toString(),
      responsibilities: "",
    })),
    desiredCountry: jobSeekerData.desiredCountry,
    desiredCity: jobSeekerData.desiredCity,
    addressOfBirth: jobSeekerData.addressOfBirth,
    desiredWorkPlace: jobSeekerData.desiredWorkPlace,
    messengerNumber: jobSeekerData.messengerNumber,
    expectedSalary: jobSeekerData.desiredSalary,
    additionalInfo: jobSeekerData.additionalInformation ?? "",
    criminalRecord: jobSeekerData.criminalRecord,
    dateOfReadiness: jobSeekerData.dateOfReadiness.toString()
  }

  return NextResponse.json({ profile: result, status: "Успех" }, { status: 200 })
}
