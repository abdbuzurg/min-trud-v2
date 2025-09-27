import { AdditionalContactInfromation, JobSeeker, KnowledgeOfLanguages, WorkExperience } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import path from "path";
import { promises as fs } from 'fs'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const phoneNumber = formData.get("verificationPhoneNumber") as string
    const phoneForName = (phoneNumber || '').replace(/[^\d+]/g, '') || 'unknown';

    const uploadRoot = path.join(process.cwd(), "uploads", "jobseekers")

    const extFromType = (type: string | undefined | null): string => {
      switch (type) {
        case "image/jpeg": return "jpg"
        case "image/png": return "png"
        case "image/webp": return "webp"
        case "image/gif": return "gif"
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

    const certificates = formData.getAll("certificates") as File[];

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

    await saveCertificates(certificates)

    const dateOfBirth = formData.get("dateOfBirth") as string
    if (!dateOfBirth) {
      return NextResponse.json({ message: "invalid date of birth" }, { status: 400 })
    }

    const dateOfReadiness = formData.get("dateOfReadiness") as string
    if (!dateOfReadiness) {
      return NextResponse.json({ message: "invalid date of readiness" }, { status: 400 })
    }

    const user = await prisma.user.findFirst({
      where: {
        phoneNumber: phoneNumber,
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
      education: formData.get("education") as string,
      institution: formData.get("institution") as string,
      speciality: formData.get("specialization") as string,
      desiredSalary: formData.get("desiredSalary") as string,
      dateOfReadiness: new Date(dateOfReadiness),
      desiredCountry: formData.get("desiredCountry") as string,
      desiredCity: formData.get("desiredCity") as string,
      desiredWorkPlace: formData.get("desiredWorkPlace") as string,
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

    knowledgeOfLanguages = knowledgeOfLanguages.map(v => ({ ...v, jobSeekerId: jobSeekerResult.id }))
    await prisma.knowledgeOfLanguages.createMany({
      data: knowledgeOfLanguages.map((v) => ({
        language: v.language,
        level: v.level,
        jobSeekerId: v.jobSeekerId,
      }))
    })

    workExperience = workExperience.map(v => ({ ...v, jobSeekerId: jobSeekerResult.id }))
    await prisma.workExperience.createMany({
      data: workExperience.map(v => ({
        ...v,
        dateStart: new Date(v.dateStart),
        dateEnd: new Date(v.dateEnd)
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
