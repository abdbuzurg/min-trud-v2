import { AdditionalContactInfromation, KnowledgeOfLanguages, WorkExperience } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    console.log(formData)

    const dateOfBirth = formData.get("dateOfBirth") as string
    if (!dateOfBirth) {
      return NextResponse.json({ message: "invalid date of birth" }, { status: 400 })
    }

    const dateOfReadiness = formData.get("dateOfReadiness") as string
    if (!dateOfReadiness) {
      return NextResponse.json({ message: "invalid date of readiness" }, { status: 400 })
    }

    const jobSeekerInfo = {
      name: formData.get("name") as string,
      surname: formData.get("surname") as string,
      middlename: formData.get("middlename") as string,
      dateOfBirth: new Date(dateOfBirth),
      tin: formData.get("tin") as string,
      gender: formData.get("gender") as string,
      email: formData.get("email") as string,
      passportCode: formData.get("passportCode") as string,
      maritalStatus: formData.get("maritalStatus") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      currentAddress: formData.get("currentAddress") as string,
      education: formData.get("education") as string,
      specialization: formData.get("specialization") as string,
      desiredSalary: formData.get("desiredSalary") as string,
      dateOfReadiness: new Date(dateOfReadiness),
      desiredCountry: formData.get("desiredCountry") as string,
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
    console.log(additionalContacts)

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

    // const image = formData.get("image") as File | null
    // const passport = formData.get("passport") as File | null
    // const diploma = formData.get("diploma") as File | null
    // const recomendationLetters = formData.get("recomendationLetters") as File | null

    // const files = [image, passport, diploma, recomendationLetters]
    // if (files.some(file => file === null)) {
    //   return NextResponse.json({ "message": "4 files at least are required" }, { status: 400 })
    // }

    let phoneNumber: string = jobSeekerInfo.phoneNumber
    if (phoneNumber.startsWith("+")) {
      phoneNumber = phoneNumber.substring(1)
    }
    // for (const file of files) {
    //   if (file) {
    //     const buffer = Buffer.from(await file.arrayBuffer());

    //     const extension = file.name.split(".") 
    //     // Generate a unique filename to avoid overwriting files
    //     const filename = `${jobSeekerInfo.phoneNumber}-${jobSeekerInfo.surname}-${jobSeekerInfo.name}-${jobSeekerInfo.middlename}.${extension[extension.length - 1]}`;

    //     // Define the path to save the file
    //     const savePath = path.join(process.cwd(), 'public/uploads', filename);

    //     // Write the file to the specified directory. [5]
    //     await writeFile(savePath, buffer);
    //   }
    // }

    const jobSeekerResult = await prisma.jobSeeker.create({
      data: {
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
