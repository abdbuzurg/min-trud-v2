import { AdditionalContactInfromation, Education, KnowledgeOfLanguages, WorkExperience } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from 'fs'
import prisma from "../../../../../lib/prisma";
import { AdditionalContactInformation, Candidate1CPayload, EducationItem, formatDateTo1C, LanguageKnowledge, sendTo1C, WorkExperienceItem } from "../../1c";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const phoneNumber = formData.get("phoneNumber") as string
    let phoneForName = (phoneNumber || '').replace(/[^\d+]/g, '') || 'unknown';
    phoneForName = phoneForName.substring(1)

    const uploadRoot = path.join(process.cwd(), "uploads", "jobseekers")

    const extFromType = (type: string | undefined | null): string => {
      switch (type) {
        case "image/jpeg": return "jpg"
        case "image/png": return "png"
        case "application/pdf": return "pdf"
        default: return "bin"
      }
    }

    const saveFromForm = async (key: string, suffix: string) => {
      const file = formData.get(key) as unknown as File | null;
      if (!file) return null;
      // @ts-ignore - Next.js File has arrayBuffer on Edge/Node runtimes
      const buf = Buffer.from(await file.arrayBuffer());
      const ext = extFromType((file as any).type);
      const filename = `${phoneForName}_${suffix}.${ext}`;
      const fullPath = path.join(uploadRoot, filename);
      await fs.writeFile(fullPath, buf);
      return { key, path: fullPath, filename };
    };

    await saveFromForm("photo", "image")
    await saveFromForm("frontPassport", "frontPassport")
    await saveFromForm("backPassport", "backPassport")
    await saveFromForm("recommendationLetter", "recommendation")
    await saveFromForm("diploma", "diploma")

    const certificates = formData.getAll("certificates") as File[] | null;
    const saveCertificates = async (files: File[]) => {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // @ts-ignore - Next.js File has arrayBuffer
        const buf = Buffer.from(await file.arrayBuffer());
        const ext = extFromType((file as any).type);
        const filename = `${phoneForName}_certificate_${i + 1}.${ext}`;
        const fullPath = path.join(uploadRoot, filename);

        await fs.writeFile(fullPath, buf);
      }
    };
    if (certificates) await saveCertificates(certificates)

    const dateOfBirth = formData.get("dateOfBirth") as string
    if (!dateOfBirth) {
      return NextResponse.json({ message: "invalid date of birth" }, { status: 400 })
    }

    const dateOfReadiness = formData.get("dateOfReadiness") as string
    if (!dateOfReadiness) {
      return NextResponse.json({ message: "invalid date of readiness" }, { status: 400 })
    }

    const user = await prisma.user.create({
      data: {
        phoneNumber: phoneForName,
      }
    })
    if (!user) {
      return NextResponse.json({ message: "Указанный номер телефона не совпадает с изначальным номером" }, { status: 400 })
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
      updatedAt: new Date(),
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

    const jobSeekerResult = await prisma.jobSeeker.create({
      data: {
        userId: user.id,
        ...jobSeekerInfo,
      }
    })

    await prisma.additionalContactInfromation.createMany({
      data: [{
        fullname: additionalContacts[0].fullname,
        status: additionalContacts[0].status,
        phoneNumber: additionalContacts[0].phoneNumber,
        jobSeekerId: jobSeekerResult.id,
      }],
    })

    await prisma.education.createMany({
      data: education.map(v => ({
        education: v.education,
        institution: v.institution,
        specialty: v.specialty,
        jobSeekerId: jobSeekerResult.id
      })),
    })

    await prisma.knowledgeOfLanguages.createMany({
      data: knowledgeOfLanguages.map(v => ({
        jobSeekerId: jobSeekerResult.id,
        level: v.level,
        language: v.language,
      })),
    })

    await prisma.workExperience.createMany({
      data: workExperience.map(v => ({ ...v, jobSeekerId: jobSeekerResult.id }))
    })

    const fullUserInfo = await prisma.jobSeeker.findFirst({
      where: {
        userId: user.id,
      },
      include: {
        WorkExperience: true,
        additionalContactInformation: true,
        education: true,
        knowledgeOfLanguages: true,
      }
    })
    if (!fullUserInfo) {
      return NextResponse.json({ 'message': 'Success' }, { status: 200 })
    }

    const profileFor1C: Candidate1CPayload = {
      lastName: fullUserInfo.lastName,
      firstName: fullUserInfo.firstName,
      middleName: fullUserInfo.middleName,
      birthDate: formatDateTo1C(fullUserInfo.birthDate.toDateString()),
      tin: fullUserInfo.tin,
      gender: fullUserInfo.gender,
      email: fullUserInfo.email,
      maritalStatus: fullUserInfo.maritalStatus,
      passportCode: fullUserInfo.passportCode,
      phoneNumber: fullUserInfo.phoneNumber,
      messengerNumber: fullUserInfo.messengerNumber,
      address: fullUserInfo.address,
      addressOfBirth: fullUserInfo.addressOfBirth,
      desiredSalary: fullUserInfo.desiredSalary,
      dateOfReadiness: formatDateTo1C(fullUserInfo.dateOfReadiness.toDateString()),
      desiredCountry: fullUserInfo.desiredCountry,
      desiredCity: fullUserInfo.desiredCity,
      criminalRecord: fullUserInfo.criminalRecord,
      additionalInformation: fullUserInfo.additionalInformation ?? "",
      createdAt: formatDateTo1C(fullUserInfo.createdAt.toDateString()),
      updatedAt: formatDateTo1C(fullUserInfo.updatedAt.toDateString()),
      additionalContactInformation: fullUserInfo.additionalContactInformation.map<AdditionalContactInformation>((val) => ({
        fullname: val.fullname,
        phone_number: val.phoneNumber,
        status: val.status,
      })),
      WorkExperience: fullUserInfo.WorkExperience.map<WorkExperienceItem>((val) => ({
        company: val.workplace,
        position: val.jobTitle,
        startDate: formatDateTo1C(val.dateStart.toDateString()),
        endDate: formatDateTo1C(val.dateEnd?.toDateString() ?? "")
      })),
      education: fullUserInfo.education.map<EducationItem>(val => ({
        education: val.education,
        institution: val.institution,
        specialty: val.specialty,
      })),
      knowledgeOfLanguages: fullUserInfo.knowledgeOfLanguages.map<LanguageKnowledge>(val => ({
        language: val.language,
        level: val.level
      }))
    }

    if (await sendTo1C(profileFor1C)) {
      await prisma.jobSeeker.updateMany({
        where: {
          userId: user.id,
        },
        data: {
          syncedWith1C: true,
        }
      })
    }

    return NextResponse.json({ 'message': 'Success' }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "Failed to save profile" },
      { status: 500 }
    )
  }
}
