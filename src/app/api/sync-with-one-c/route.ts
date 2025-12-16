import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { AdditionalContactInformation, Candidate1CPayload, EducationItem, formatDateTo1C, LanguageKnowledge, sendTo1C, WorkExperienceItem } from "../1c";

export async function GET(request: NextRequest) {
  const seekers = await prisma.jobSeeker.findMany({
    where: { syncedWith1C: false },
    include: {
      WorkExperience: true,
      additionalContactInformation: true,
      education: true,
      knowledgeOfLanguages: true,
    },
  });

  let successCount = 0;
  let failureCount = 0;
  const errors: { id: number; message: string }[] = [];

  for (const seeker of seekers) {
    try {
      // тут твой маппинг seeker -> Candidate1CPayload
      const payload: Candidate1CPayload = {
        firstName: seeker.firstName,
        lastName: seeker.lastName,
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
        createdAt: seeker.createdAt,
        updatedAt: seeker.updatedAt,
        additionalContactInformation: seeker.additionalContactInformation.map(
          (c) => ({
            fullname: c.fullname,
            status: c.status,
            phone_number: c.phoneNumber,
          })
        ),
        knowledgeOfLanguages: seeker.knowledgeOfLanguages.map((l) => ({
          language: l.language,
          level: l.level,
        })),
        WorkExperience: seeker.WorkExperience.map((w) => ({
          company: w.workplace,
          position: w.jobTitle,
          startDate: formatDateTo1C(w.dateStart.toDateString()),
          endDate: formatDateTo1C(w.dateEnd?.toDateString() ?? ""),
        })),
        education: seeker.education.map((e) => ({
          education: e.education,
          institution: e.institution,
          specialty: e.specialty,
        })),
      };

      const ok = await sendTo1C(payload);

      if (ok) {
        await prisma.jobSeeker.update({
          where: { id: seeker.id },
          data: { syncedWith1C: true },
        });
        successCount++;
      } else {
        failureCount++;
        errors.push({
          id: seeker.id,
          message: "1С вернул result = 0 (Неуспешно)",
        });
      }
    } catch (err: any) {
      failureCount++;
      console.error("Ошибка при синхронизации seeker", seeker.id, err);
      errors.push({
        id: seeker.id,
        message: err?.message ?? "Неизвестная ошибка",
      });
    }
  }

  // ОТВЕТ ТОЛЬКО ПОСЛЕ ЦИКЛА
  return NextResponse.json(
    {
      status:
        failureCount === 0
          ? "Все профили успешно синхронизированы"
          : "Часть профилей не синхронизирована",
      successCount,
      failureCount,
      errors,
    },
    {
      status: failureCount === 0 ? 200 : 207, // или 200/500 как тебе удобнее
    }
  );
}
