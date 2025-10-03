import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { JobSeekerFromData } from "../../../../../types/jobSeeker";
import { AdditionalContactInfromation, Education, KnowledgeOfLanguages, WorkExperience } from "@/generated/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const phoneNumber = searchParams.get("phoneNumber")
  if (!phoneNumber) {
    return NextResponse.json({ valid: false, error: "Не указан номер телефона" }, { status: 404 })
  }

  const user = await prisma.user.findFirst({
    where: {
      phoneNumber: phoneNumber
    }
  })
  if (!user) {
    return NextResponse.json({ valid: false, error: "Пользователь с таким номером не существует" }, { status: 500 });
  }

  const jobSeekerData = await prisma.jobSeeker.findFirst({
    where: {
      userId: user.id,
    }
  })
  if (!jobSeekerData) {
    return NextResponse.json({ valid: false, error: "У данного пользователя не создан еще профиль" }, { status: 500 });
  }

  const additionalContactInformation = await prisma.additionalContactInfromation.findMany({
    where: {
      jobSeekerId: jobSeekerData.id,
    }
  })
  if (!additionalContactInformation) {
    return NextResponse.json({ profile: null, status: "Успех" }, { status: 200 })
  }

  const education = await prisma.education.findMany({
    where: {
      jobSeekerId: jobSeekerData.id,
    }
  })

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
    education: education.map((v) => ({
      education: v.education,
      educationOther: v.education,
      institution: v.institution,
      specialty: v.specialty,
    })),
    languages: languages.map((v) => ({
      language: v.language,
      languageOther: v.language,
      level: v.level
    })),
    workExperience: workExperience.map(v => ({
      company: v.workplace,
      position: v.jobTitle,
      endDate: v.dateEnd?.toString() ?? "",
      startDate: v.dateStart.toString(),
    })),
    desiredCountry: jobSeekerData.desiredCountry,
    desiredCity: jobSeekerData.desiredCity,
    addressOfBirth: jobSeekerData.addressOfBirth,
    messengerNumber: jobSeekerData.messengerNumber,
    expectedSalary: jobSeekerData.desiredSalary,
    additionalInfo: jobSeekerData.additionalInformation ?? "",
    criminalRecord: jobSeekerData.criminalRecord,
    dateOfReadiness: jobSeekerData.dateOfReadiness.toString()
  }

  return NextResponse.json({ profile: result, status: "Успех" }, { status: 200 })
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const phoneNumber = formData.get("phoneNumber") as string
    let phoneForName = (phoneNumber || '').replace(/[^\d+]/g, '') || 'unknown';
    phoneForName = phoneForName.substring(1)

    const user = await prisma.user.findFirst({
      where: {
        phoneNumber: phoneForName,
      }
    })
    if (!user) {
      return NextResponse.json({ message: "Указанный номер телефона не совпадает с изначальным номером" }, { status: 400 })
    }

    const dateOfBirth = formData.get("dateOfBirth") as string
    if (!dateOfBirth) {
      return NextResponse.json({ message: "invalid date of birth" }, { status: 400 })
    }

    const dateOfReadiness = formData.get("dateOfReadiness") as string
    if (!dateOfReadiness) {
      return NextResponse.json({ message: "invalid date of readiness" }, { status: 400 })
    }

    const jobSeekerInfo = {
      firstName: formData.get("name") as string,
      lastName: formData.get("surname") as string,
      middleName: formData.get("middlename") as string,
      birthDate: new Date(dateOfBirth),
      tin: formData.get("tin") as string,
      gender: formData.get("gender") as string,
      email: formData.get("email") as string,
      passportCode: formData.get("passportCode") as string,
      maritalStatus: formData.get("maritalStatus") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      messengerNumber: formData.get("messengerNumber") as string,
      address: formData.get("address") as string,
      addressOfBirth: formData.get("addressOfBirth") as string,
      desiredSalary: formData.get("desiredSalary") as string,
      dateOfReadiness: new Date(dateOfReadiness),
      desiredCountry: formData.get("desiredCountry") as string,
      desiredCity: formData.get("desiredCity") as string,
      criminalRecord: formData.get("criminalRecord") as string,
      additionalInformation: formData.get("additionalInformation") as string,
      syncedWith1C: false,
      createdAt: new Date(),
    }

    const additionalContactsFormData = formData.get("additionalContacts") as string | null
    if (!additionalContactsFormData) {
      return NextResponse.json({ message: "Additional contacts missing" }, { status: 400 })
    }

    let additionalContacts: AdditionalContactInfromation[] = []
    try {
      additionalContacts = JSON.parse(additionalContactsFormData)
    } catch (error) {
      return NextResponse.json({ message: "Invalid JSON for additional information" }, { status: 400 })
    }

    const educationFormData = formData.get("education") as string | null
    if (!educationFormData) {
      return NextResponse.json({ message: "Education missing" }, { status: 400 })
    }

    let education: Education[] = []
    try {
      education = JSON.parse(educationFormData)
    } catch (error) {
      return NextResponse.json({ message: "Invalid JSON for education" }, { status: 400 })
    }

    const knowledgeOfLanguagesFormData = formData.get("knowledgeOfLanguages") as string | null
    if (!knowledgeOfLanguagesFormData) {
      return NextResponse.json({ message: "Knowledge of languages missing" }, { status: 400 })
    }

    let knowledgeOfLanguages: KnowledgeOfLanguages[] = []
    try {
      knowledgeOfLanguages = JSON.parse(knowledgeOfLanguagesFormData)
    } catch (error) {
      return NextResponse.json({ message: "Invalid JSON for knowledge of languages" }, { status: 400 })
    }

    const workExperienceFormData = formData.get("workExperience") as string | null
    if (!workExperienceFormData) {
      return NextResponse.json({ message: "Work experience missing" }, { status: 400 })
    }

    let workExperience: WorkExperience[] = []
    try {
      workExperience = JSON.parse(workExperienceFormData)
    } catch (error) {
      return NextResponse.json({ message: "Invalid JSON for work experience" }, { status: 400 })
    }

    const jobSeeker = await prisma.jobSeeker.findFirst({
      where: {
        userId: user.id,
      }
    })
    if (!jobSeeker) {
      return NextResponse.json({ message: "No job seeker profile with given user" }, { status: 400 })
    }
    await prisma.jobSeeker.updateMany({
      data: {
        ...jobSeekerInfo,
      },
      where: {
        id: jobSeeker.id,
      }
    })

    await prisma.additionalContactInfromation.deleteMany({
      where: {
        jobSeekerId: jobSeeker.id,
      }
    })
    await prisma.additionalContactInfromation.createMany({
      data: [{
        fullname: additionalContacts[0].fullname,
        status: additionalContacts[0].status,
        phoneNumber: additionalContacts[0].phoneNumber,
        jobSeekerId: jobSeeker.id,
      }],
    })

    await prisma.education.deleteMany({
      where: {
        jobSeekerId: jobSeeker.id,
      }
    })
    await prisma.education.createMany({
      data: education.map(v => ({
        education: v.education,
        institution: v.institution,
        specialty: v.specialty,
        jobSeekerId: jobSeeker.id
      })),
    })

    knowledgeOfLanguages = knowledgeOfLanguages.map(v => ({ ...v, jobSeekerId: jobSeeker.id }))
    await prisma.knowledgeOfLanguages.deleteMany({
      where: {
        jobSeekerId: jobSeeker.id,
      }
    })
    await prisma.knowledgeOfLanguages.createMany({
      data: knowledgeOfLanguages.map((v) => ({
        language: v.language,
        level: v.level,
        jobSeekerId: v.jobSeekerId,
      }))
    })

    workExperience = workExperience.map(v => ({ ...v, jobSeekerId: jobSeeker.id }))
    await prisma.workExperience.deleteMany({
      where: {
        jobSeekerId: jobSeeker.id,
      }
    })
    await prisma.workExperience.createMany({
      data: workExperience.map(v => ({
        ...v,
        dateStart: new Date(v.dateStart),
        dateEnd: !v.dateEnd ? null : new Date(v.dateEnd),
      }))
    })

    return NextResponse.json({ 'message': 'Success' }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "Failed to save profile" },
      { status: 500 }
    )
  }
}
