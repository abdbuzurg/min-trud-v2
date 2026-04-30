import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { AdditionalContactInfromation, Education, KnowledgeOfLanguages, WorkExperience } from "@prisma/client";
import { promises as fs } from 'fs';
import path from 'path';
import { withApiLogging } from "@/lib/withApiLogging";
import { structuredLogger } from "@/lib/structuredLogger";
import {
  collectRequiredFieldErrors,
  getRequiredStringField,
  hasValidationErrors,
  parseJsonFormField,
  validationErrorResponse,
} from "@/lib/jobSeekerApiForm";

const uploadsDir = path.join(process.cwd(), 'uploads', 'jobseekers');

async function handleFileUpload(
  formData: FormData,
  key: string,
  suffix: string,
  phoneNumber: string
): Promise<string | null> {
  // 1. Get the file from FormData and validate it
  const file = formData.get(key);

  // If no file is associated with the key, or if it's not a File object, return null.
  if (!file || !(file instanceof File)) {
    return null;
  }

  const filenameWithoutExt = `${phoneNumber}_${suffix}`;

  // 2. Ensure the target directory exists
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
  } catch (error) {
    structuredLogger.error("api.update-job-seeker-profile.upload_dir_failed", {
      tag: "INTERNAL",
      key,
      error: structuredLogger.errorDetails(error),
    });
    throw new Error('Could not create storage directory.');
  }

  // 3. Delete any existing file with the same base name
  try {
    const existingFiles = await fs.readdir(uploadsDir);
    for (const existingFile of existingFiles) {
      if (path.parse(existingFile).name === filenameWithoutExt) {
        await fs.unlink(path.join(uploadsDir, existingFile));
        break; // Assume only one match and stop searching
      }
    }
  } catch (error) {
    structuredLogger.error("api.update-job-seeker-profile.delete_existing_file_failed", {
      tag: "INTERNAL",
      key,
      filenameWithoutExt,
      error: structuredLogger.errorDetails(error),
    });
  }

  // 4. Save the new file
  const fileExtension = path.extname(file.name);
  const newFilename = `${filenameWithoutExt}${fileExtension}`;
  const newFilePath = path.join(uploadsDir, newFilename);

  // Convert the File object to a Node.js Buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    await fs.writeFile(newFilePath, buffer);
    return newFilename; // Return the name of the created file
  } catch (error) {
    structuredLogger.error("api.update-job-seeker-profile.write_file_failed", {
      tag: "INTERNAL",
      key,
      filename: newFilename,
      error: structuredLogger.errorDetails(error),
    });
    throw new Error('Could not save the new file.');
  }
}

const deleteOldCertificates = async (phoneForName: string) => {
  const files = await fs.readdir(uploadsDir);

  const certFiles = files.filter(f => f.startsWith(`${phoneForName}_certificate_`));
  for (const file of certFiles) {
    await fs.unlink(path.join(uploadsDir, file));
  }
};

const saveCertificates = async (phoneForName: string, certs: File[]) => {
  for (let i = 0; i < certs.length; i++) {
    const file = certs[i];
    // @ts-ignore (Next.js File has arrayBuffer)
    const buf = Buffer.from(await file.arrayBuffer());
    const ext = file.type === "application/pdf" ? "pdf" : "bin"; // adjust if needed
    const filename = `${phoneForName}_certificate_${i + 1}.${ext}`;
    const fullPath = path.join(uploadsDir, filename);

    await fs.writeFile(fullPath, buf);
  }
};

async function postUpdateJobSeekerProfile(request: NextRequest) {
  try {
    const formData = await request.formData()
    const phoneNumber = formData.get("verificationPhoneNumber") as string
    const phoneForName = (phoneNumber || '').replace(/[^\d+]/g, '') || 'unknown';

    const fieldErrors = collectRequiredFieldErrors(formData)

    if (hasValidationErrors(fieldErrors)) {
      return validationErrorResponse("Проверьте заполнение формы", fieldErrors)
    }

    await handleFileUpload(formData, 'photo', 'image', phoneForName)
    await handleFileUpload(formData, 'frontPassport', 'frontPassport', phoneForName)
    await handleFileUpload(formData, 'backPassport', 'backPassport', phoneForName)
    await handleFileUpload(formData, 'diploma', 'diploma', phoneForName)
    await handleFileUpload(formData, 'recommendationLetter', 'recommendation', phoneForName)
    const certificates = formData.getAll("certificates") as File[];
    if (certificates.length > 0) {
      await deleteOldCertificates(phoneForName);
      const savedCertificates = await saveCertificates(phoneForName, certificates);
    }

    const dateOfBirth = getRequiredStringField(formData, "dateOfBirth")
    if (!dateOfBirth) {
      return validationErrorResponse("Некорректная дата рождения", {
        birthDate: "Обязательное поле",
      })
    }

    const dateOfReadiness = getRequiredStringField(formData, "dateOfReadiness")
    if (!dateOfReadiness) {
      return validationErrorResponse("Некорректная дата готовности", {
        dateOfReadiness: "Обязательное поле",
      })
    }

    const user = await prisma.user.findFirst({
      where: {
        phoneNumber: phoneNumber,
      }
    })
    if (!user) {
      return validationErrorResponse("Указанный номер телефона не совпадает с изначальным номером", {
        phone: "Проверьте номер телефона",
      })
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

    const additionalContactsResult = parseJsonFormField<AdditionalContactInfromation[]>(
      formData,
      {
        formKey: "additionalContacts",
        missingMessage: "Отсутствуют контактные данные",
        missingErrors: {
          contactName: "Обязательное поле",
          contactPhone: "Обязательное поле",
          contactRelation: "Обязательное поле",
        },
        invalidMessage: "Некорректные контактные данные",
        invalidErrors: {
          contactName: "Проверьте значение",
          contactPhone: "Проверьте значение",
          contactRelation: "Проверьте значение",
        },
      }
    )
    if (additionalContactsResult.response) {
      return additionalContactsResult.response
    }
    const additionalContacts = additionalContactsResult.data

    const educationResult = parseJsonFormField<Education[]>(formData, {
      formKey: "education",
      missingMessage: "Отсутствуют данные об образовании",
      missingErrors: {
        education_0: "Обязательное поле",
      },
      invalidMessage: "Некорректные данные об образовании",
      invalidErrors: {
        education_0: "Проверьте значение",
      },
    })
    if (educationResult.response) {
      return educationResult.response
    }
    const education = educationResult.data

    const knowledgeOfLanguagesResult = parseJsonFormField<KnowledgeOfLanguages[]>(formData, {
      formKey: "knowledgeOfLanguages",
      missingMessage: "Отсутствуют данные о языках",
      missingErrors: {
        language_0: "Обязательное поле",
      },
      invalidMessage: "Некорректные данные о языках",
      invalidErrors: {
        language_0: "Проверьте значение",
      },
    })
    if (knowledgeOfLanguagesResult.response) {
      return knowledgeOfLanguagesResult.response
    }
    let knowledgeOfLanguages = knowledgeOfLanguagesResult.data

    const workExperienceResult = parseJsonFormField<WorkExperience[]>(formData, {
      formKey: "workExperience",
      missingMessage: "Отсутствуют данные об опыте работы",
      missingErrors: {
        company_0: "Обязательное поле",
      },
      invalidMessage: "Некорректные данные об опыте работы",
      invalidErrors: {
        company_0: "Проверьте значение",
      },
    })
    if (workExperienceResult.response) {
      return workExperienceResult.response
    }
    let workExperience = workExperienceResult.data

    const jobSeeker = await prisma.jobSeeker.findFirst({
      where: {
        userId: user.id,
      }
    })
    if (!jobSeeker) {
      return validationErrorResponse("Профиль соискателя не найден", {
        phone: "Профиль не найден",
      })
    }
    await prisma.jobSeeker.updateMany({
      data: {
        ...jobSeekerInfo,
        syncedWith1C: false,
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
    structuredLogger.error("api.update-job-seeker-profile.post.internal_error", {
      tag: "INTERNAL",
      error: structuredLogger.errorDetails(error),
    })
    return NextResponse.json(
      { tag: "INTERNAL", message: "Failed to save profile" },
      { status: 500 }
    )
  }
}

export const POST = withApiLogging("api.update-job-seeker-profile.post", postUpdateJobSeekerProfile);
