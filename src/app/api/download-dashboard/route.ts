import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import archiver from "archiver"; // npm i archiver
import ExcelJS from "exceljs";   // npm i exceljs
import { PassThrough } from "stream";
import prisma from "../../../../lib/prisma";

const uploadDir = path.join(process.cwd(), "uploads", "jobseekers");

function formatDate(iso: string) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

export async function POST(req: NextRequest) {
  try {
    const { dateStart, dateEnd } = await req.json();

    // 1. Query DB with filters
    const seekers = await prisma.jobSeeker.findMany({
      where: {
        createdAt: {
          gte: dateStart ? new Date(dateStart) : undefined,
          lte: dateEnd ? new Date(dateEnd) : undefined,
        }
      },
      include: {
        additionalContactInformation: true,
        knowledgeOfLanguages: true,
        WorkExperience: true,
        education: true,
      },
    });

    if (seekers.length === 0) {
      return NextResponse.json({ error: "По данному фильтру нет данных" }, { status: 404 });
    }

    const phoneNumbers = await prisma.user.findMany({
      select: {
        phoneNumber: true,
      },
      where: {
        id: {
          in: seekers.map(v => v.userId)
        }
      }
    })

    // 3. Create Excel file with seekers data
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Соискатели");

    sheet.columns = [
      { header: "Имя", key: "firstName", width: 20 },
      { header: "Фамилия", key: "lastName", width: 20 },
      { header: "Отчество", key: "middleName", width: 20 },
      { header: "Дата рождения", key: "birthDate", width: 15 },
      // { header: "ИНН", key: "tin", width: 20 },
      { header: "Пол", key: "gender", width: 15 },
      // { header: "Email", key: "email", width: 30 },
      // { header: "Семейное положение", key: "maritalStatus", width: 50 },
      // { header: "Серия Паспорта", key: "passportCode", width: 20 },
      { header: "Номер телефона", key: "phoneNumber", width: 20 },
      // { header: "Whatapp/Telegram", key: "messengerNumber", width: 20 },
      // { header: "Адрес рождения", key: "addressOfBirth", width: 50 },
      // { header: "Адрес проживания", key: "address", width: 50 },
      // { header: "Дополнительная контактная информация", key: "additionalContacts", width: 35 },
      // { header: "Образование", key: "education", width: 100 },
      // { header: "Языки", key: "languages", width: 100 },
      // { header: "Трудовая информация", key: "workExperience", width: 100 },
      // { header: "Готовность к выезду", key: "dateOfReadiness", width: 20 },
      // { header: "Предпочитаема страна", key: "desiredCountry", width: 25 },
      // { header: "Предпочитаемый город", key: "desiredCity", width: 25 },
      // { header: "Предпочитаемое место работы", key: "desiredWorkPlace", width: 30 },
      // { header: "Предпочитаемая зарплата", key: "desiredSalary", width: 20 },
      // { header: "Наличие судимости", key: "criminalRecord", width: 20 },
      // { header: "Дополнительная информация", key: "additionalInformation", width: 100 },
      // { header: "Синхронизация с 1С", key: "syncedWith1C", width: 20 },
      // { header: "Дата создания", key: "createdAt", width: 20 },
      // { header: "Дата обновления", key: "updatedAt", width: 20 },
    ];

    // Add rowsc
    seekers.forEach((row) => {
      sheet.addRow({
        firstName: row.firstName,
        lastName: row.lastName,
        middleName: row.middleName,
        birthDate: row.birthDate,
        // tin: row.tin,
        gender: row.gender,
        // email: row.email,
        // maritalStatus: row.maritalStatus,
        // passportCode: row.passportCode,
        phoneNumber: row.phoneNumber,
        // messengerNumber: row.messengerNumber,
        // address: row.address,
        // addressOfBirth: row.addressOfBirth,
        // desiredSalary: row.desiredSalary,
        // dateOfReadiness: row.dateOfReadiness,
        // desiredCountry: row.desiredCountry,
        // desiredCity: row.desiredCity,
        // criminalRecord: row.criminalRecord,
        // syncedWith1C: row.syncedWith1C ? "Да" : "Нет",
        // createdAt: row.createdAt,
        // education: row.education.map((v) => {
        //   return `Категория - ${v.education}, Университет - ${v.institution}, Cпециальность - ${v.specialty}`
        // }).join("\n"),
        // additionalContacts: row.additionalContactInformation.map((v) => {
        //   return `ФИО - ${v.fullname}, Статус - ${v.status}, Номер - ${v.phoneNumber}`
        // }).join("\n"),
        // workExperience: row.WorkExperience.map((v) => {
        //   return `Компания - ${v.workplace}, Позиция - ${v.jobTitle} , Период: ${formatDate(v.dateStart.toString())} - ${!v.dateEnd ? "" : formatDate(v.dateEnd.toString())}`
        // }).join("\n"),
        // languages: row.knowledgeOfLanguages.map((v) => {
        //   return `${v.language}(${v.level})`
        // }).join(", ")
      });
    });

    // Save to buffer
    const excelUint8 = await workbook.xlsx.writeBuffer();
    const excelBuffer = Buffer.from(excelUint8);

    const archive = archiver("zip", { zlib: { level: 9 } })

    const stream = new ReadableStream({
      start(controller) {
        archive.on("data", (chunk) => controller.enqueue(chunk))
        archive.on("end", () => controller.close());
        archive.on("error", (err) => controller.error(err));

        // Add Excel file
        archive.append(Buffer.from(excelBuffer), { name: "jobseekers.xlsx" });

        // Add user files
        fs.readdirSync(uploadDir).forEach((file) => {
          const phoneMatch = phoneNumbers.find((s) => file.startsWith(`${s.phoneNumber}_`));
          if (phoneMatch) {
            archive.file(path.join(uploadDir, file), { name: file });
          }
        });

        archive.finalize();
      },
    })

    return new NextResponse(stream as any, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename=\"jobseekers.zip\"`,
      },
    });
  } catch (err) {
    console.error("Download error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

