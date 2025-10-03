import React from "react";
import { X, UserRound, Phone, MapPin, Briefcase, GraduationCap, Plane, Pencil } from "lucide-react";
import { JobSeekerAPIResult } from "./DashboardUpdated";
import Link from "next/link";

export default function SeekerModal({
  employee,
  onClose,
}: {
  employee: JobSeekerAPIResult;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-xl ring-1 ring-black/5">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div className="flex items-start gap-3">
            <div className="h-20 w-20 rounded-full bg-[#39B36E] grid place-items-center text-white">
              <img
                src={`/api/files/${employee.phoneNumber[0] == "+" ? employee.phoneNumber.substring(1) : employee.phoneNumber}_image`}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <div className="font-semibold text-gray-900">
                {employee.lastName} {employee.firstName} {employee.middleName || ""}
              </div>
              <div>
                <Link
                  href={`/dashboard/edit-job-seeker/${employee.phoneNumber[0] == "+" ? employee.phoneNumber.substring(1) : employee.phoneNumber}`}
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-full bg-red-500 text-white px-3 py-1.5 text-sm font-medium hover:opacity-95"
                >
                  <Pencil className="h-4 w-4" />
                  Изменить
                </Link>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full grid place-items-center text-gray-500 hover:bg-gray-100"
            aria-label="Закрыть"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left column */}
            <div className="space-y-5">
              <SectionTitle icon={<UserRound className="h-4 w-4" />}>Личная информация</SectionTitle>
              <InfoRows
                rows={[
                  { label: "Дата рождения:", value: formatDate(employee.birthDate.toString()) },
                  { label: "ИНН:", value: employee.tin },
                  { label: "Пол:", value: employee.gender },
                  { label: "Серия паспорта:", value: employee.passportCode },
                ]}
              />

              <SectionTitle icon={<MapPin className="h-4 w-4" />}>Место рождения</SectionTitle>
              <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-700">
                {employee.addressOfBirth}
              </div>

              <SectionTitle icon={<MapPin className="h-4 w-4" />}>Адрес</SectionTitle>
              <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-700">
                {employee.address}
              </div>

              <SectionTitle icon={<Briefcase className="h-4 w-4" />}>Трудовая информация</SectionTitle>
              {WorkExperienceInfoRow(employee.WorkExperience)}
            </div>

            {/* Right column */}
            <div className="space-y-5">
              <SectionTitle icon={<Phone className="h-4 w-4" />}>Контактная информация</SectionTitle>
              <InfoRows
                rows={[
                  {
                    label: "Email:",
                    value: (
                      <a href={`mailto:${employee.email || "komrons96@gmail.com"}`} className="text-[#2563eb] hover:underline">
                        {employee.email || "komrons96@gmail.com"}
                      </a>
                    ),
                  },
                  { label: "Мобильный:", value: employee.phoneNumber },
                  { label: "Whatsapp/Telegram", value: employee.messengerNumber },
                  {
                    label: "Доп.",
                    value: (
                      <span>
                        ФИО - {employee.additionalContactInformation[0].fullname}, Статус - {employee.additionalContactInformation[0].status}, Мобильный номер - {employee.additionalContactInformation[0].phoneNumber}
                      </span>
                    ),
                  },
                ]}
              />

              <SectionTitle icon={<GraduationCap className="h-4 w-4" />}>Образование и навыки</SectionTitle>
              <InfoRows rows={[
                { label: "Образование:", value: employee.education.map((v) => `Категория - ${v.education}, Университет - ${v.institution}, Cпециальность - ${v.specialty}`).join(", ") },
                { label: "Языки:", value: employee.knowledgeOfLanguages.map(v => `${v.language}(${v.level})`).join(", ") }
              ]}
              />

              <SectionTitle icon={<Plane className="h-4 w-4" />}>Информация о выезде</SectionTitle>
              <InfoRows rows={[
                { label: "Готовность к выезду:", value: formatDate(employee.dateOfReadiness.toString()) },
                { label: "Предпочитаемая страна:", value: employee.desiredCountry },
                { label: "Предпочитаемый город:", value: employee.desiredCity },
                { label: "Предпочитаемая зарплата", value: employee.desiredSalary }
              ]}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-between text-sm">
            <div className="inline-flex items-center gap-3">
              <span className="text-gray-700">Наличие судимости:</span>
              <span className={`inline-flex items-center gap-2 rounded-full ${employee.syncedWith1C ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-700"} px-3 py-1 ring-1 ring-gray-200`}>
                <span className="h-2 w-2 rounded-full bg-gray-400" /> {employee.criminalRecord.toString()}
              </span>
            </div>
            <div className="inline-flex items-center p-3">
              <span className="text-gray-700">Синхронизация с 1С:</span>
              <span className={`inline-flex items-center gap-2 rounded-full ${employee.syncedWith1C ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-700"}  px-3 py-1 ring-1 ring-emerald-100`}>
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> {employee.syncedWith1C ? "Включена" : "Отключена"}
              </span>
            </div>
          </div>
        </div>
      </div >
    </div >
  );
}

function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <h3 className="flex items-center gap-2 text-gray-800 font-semibold">
      <span className="text-[#39B36E]">{icon}</span>
      {children}
    </h3>
  );
}

function WorkExperienceInfoRow(
  workExperience: {
    jobTitle: string;
    workplace: string;
    dateStart: Date;
    dateEnd: Date;
    id: number;
    jobSeekerId: number;
  }[]
) {
  return (
    <div>
      {workExperience.map((v, i) => (
        <div key={i} className="grid grid-cols-2 gap-3 text-sm py-1.5 border-b-gray-700">
          <div className="text-gray-500">Компания</div>
          <div className="text-gray-900">{v.workplace}</div>
          <div className="text-gray-500">Позиция</div>
          <div className="text-gray-900">{v.jobTitle}</div>
          <div className="text-gray-500">Период</div>
          <div className="text-gray-900">{formatDate(v.dateStart.toString())} - {!v.dateEnd ? "текущее время" : formatDate(v.dateEnd.toString())}</div>
        </div>
      ))}
    </div>
  )
}

function InfoRows({ rows }: { rows: { label: string; value?: React.ReactNode }[] }) {
  return (
    <div>
      {rows.map((r, i) => (
        <div key={i} className="grid grid-cols-2 gap-3 text-sm py-1.5">
          <div className="text-gray-500">{r.label}</div>
          <div className="text-gray-900">{r.value || "—"}</div>
        </div>
      ))}
    </div>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

