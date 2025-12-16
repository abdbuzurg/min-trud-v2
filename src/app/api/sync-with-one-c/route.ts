import { NextRequest } from "next/server";
import prisma from "../../../../lib/prisma";
import { AdditionalContactInformation, Candidate1CPayload, EducationItem, formatDateTo1C, LanguageKnowledge, sendTo1C, WorkExperienceItem } from "../1c";

export async function GET(request: NextRequest) {

  try {
    const seekers = await prisma.jobSeeker.findMany({
      where: {
        syncedWith1C: false,
      },
      include: {
        WorkExperience: true,
        additionalContactInformation: true,
        education: true,
        knowledgeOfLanguages: true
      }
    })

    for (const seeker of seekers) {
      const profileFor1C: Candidate1CPayload = {
        lastName: seeker.lastName,
        firstName: seeker.firstName,
        middleName: seeker.middleName,
        birthDate: formatDateTo1C(seeker.birthDate.toDateString()),
        tin: seeker.tin,
        gender: seeker.gender,
        email: seeker.email,
        maritalStatus: seeker.maritalStatus,
        passportCode: seeker.passportCode,
        phoneNumber: seeker.phoneNumber,
        messengerNumber: seeker.messengerNumber,
        address: seeker.address,
        addressOfBirth: seeker.addressOfBirth,
        desiredSalary: seeker.desiredSalary,
        dateOfReadiness: formatDateTo1C(seeker.dateOfReadiness.toDateString()),
        desiredCountry: seeker.desiredCountry,
        desiredCity: seeker.desiredCity,
        criminalRecord: seeker.criminalRecord,
        additionalInformation: seeker.additionalInformation ?? "",
        createdAt: formatDateTo1C(seeker.createdAt.toDateString()),
        updatedAt: formatDateTo1C(seeker.updatedAt.toDateString()),
        additionalContactInformation: seeker.additionalContactInformation.map<AdditionalContactInformation>((val) => ({
          fullname: val.fullname,
          phone_number: val.phoneNumber,
          status: val.status,
        })),
        WorkExperience: seeker.WorkExperience.map<WorkExperienceItem>((val) => ({
          company: val.workplace,
          position: val.jobTitle,
          startDate: formatDateTo1C(val.dateStart.toDateString()),
          endDate: formatDateTo1C(val.dateEnd?.toDateString() ?? "")
        })),
        education: seeker.education.map<EducationItem>(val => ({
          education: val.education,
          institution: val.institution,
          specialty: val.specialty,
        })),
        knowledgeOfLanguages: seeker.knowledgeOfLanguages.map<LanguageKnowledge>(val => ({
          language: val.language,
          level: val.level
        }))
      }

      if (await sendTo1C(profileFor1C)) {
        await prisma.jobSeeker.updateMany({
          where: {
            id: seeker.id,
          },
          data: {
            syncedWith1C: true,
          }
        })
      }
    }

  } catch {
    return
  }
}
