"use client"

import { JobSeeker } from "@/generated/prisma"
import axios from "axios"
import { useEffect, useState } from "react"

interface JobSeekerAPIResult extends JobSeeker {
  knowledgeOfLanguages: {
    language: string;
    level: string;
    id: number;
    jobSeekerId: number;
  }[];
  WorkExperience: {
    jobTitle: string;
    workplace: string;
    dateStart: Date;
    dateEnd: Date;
    id: number;
    jobSeekerId: number;
  }[];
  additionalContactInformation: {
    phoneNumber: string;
    fullname: string;
    status: string;
    id: number;
    jobSeekerId: number;
  }[];
}

export default function DashboardView() {

  const [count, setCount] = useState(0)
  const [filter, setFilter] = useState<{ dateStart: string, dateEnd: string, page: number }>({
    dateStart: "",
    dateEnd: "",
    page: 1,
  })
  const [tableData, setTableData] = useState<JobSeekerAPIResult[]>([])
  useEffect(() => {
    axios.get<{ data: JobSeekerAPIResult[], count: number }>('api/job-seeker-table', { params: { page: filter.page } })
      .then(response => {
        setTableData(response.data.data)
        setCount(response.data.count)
      })
  }, [])

  useEffect(() => {
    axios.get<{ data: JobSeekerAPIResult[], count: number }>('api/job-seeker-table', {
      params: {
        page: filter.page,
        dateStart: filter.dateStart,
        dateEnd: filter.dateEnd,
      }
    }).then(response => {
      setTableData(response.data.data)
      setCount(response.data.count)
    })
  }, [filter])

  return (
    <div className="w-full px-6">
      <div className="px-4 py-8 sm:px-8">
        <div className="flex gap-x-4 items-center">
          <div className="flex gap-x-2 py-4 items-center">
            <label htmlFor="dateStart">Начало</label>
            <input
              className={`px-2 py-1 border rounded-md outline-none border-[#98FF78]`}
              type="date"
              name="dateStart"
              id="dateStart"
              value={filter.dateStart}
              onChange={(e) => setFilter({ ...filter, dateStart: e.target.value })}
            />
          </div>
          <div className="flex gap-x-2 py-4 items-center">
            <label htmlFor="dateEnd">Конец</label>
            <input
              className={`px-2 py-1 border rounded-md outline-none border-[#98FF78]`}
              type="date"
              name="dateEnd"
              id="dateEnd"
              value={filter.dateEnd}
              onChange={(e) => setFilter({ ...filter, dateEnd: e.target.value })}
            />
          </div>
          <div className="flex gap-x-2">
            <button
              type="button"
              className="bg-red-500 px-4 py-2 font-bold rounded text-white cursor-pointer"
              onClick={() => {
                setFilter({ dateEnd: "", dateStart: "", page: 1 })
              }}
            >
              Очистить
            </button>
            <button
              className="bg-blue-500 px-4 py-2 font-bold rounded text-white cursor-pointer"
              type="button"
            >Синхронизация с 1С</button>
          </div>
        </div>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full">
            <thead className="border-b bg-gray-50 text-sm">
              <tr>
                <th scope="col" className="px-6 py-4 text-left font-medium text-gray-600">Имя</th>
                <th scope="col" className="px-6 py-4 text-left font-medium text-gray-600">Фамилия</th>
                <th scope="col" className="px-6 py-4 text-left font-medium text-gray-600">Отчество</th>
                <th scope="col" className="px-6 py-4 text-left font-medium text-gray-600">Дата Рождения</th>
                <th scope="col" className="px-6 py-4 text-left font-medium text-gray-600">ИНН</th>
                <th scope="col" className="px-6 py-4 text-left font-medium text-gray-600">Пол</th>
                <th scope="col" className="px-6 py-4 text-left font-medium text-gray-600">Email</th>
                <th scope="col" className="px-6 py-4 text-left font-medium text-gray-600">Серия Паспорта</th>
                <th scope="col" className="px-6 py-4 text-left font-medium text-gray-600">Место рождения(Старан)</th>
                <th scope="col" className="px-6 py-4 text-left font-medium text-gray-600">Место рождения</th>
                <th scope="col" className="px-6 py-4 text-left font-medium text-gray-600">Мобильный номер</th>
                <th scope="col" className="px-6 py-4 text-left font-medium text-gray-600">WhatsApp/Telegram</th>
                <th scope="col" className="px-6 py-4 text-left font-medium text-gray-600">Текущий Адрес</th>
                <th scope="col" className="px-6 py-4 text-left font-medium text-gray-600">Допольнительные контактное лицо</th>
                <th scope="col" className="px-6 py-4 text-left font-medium text-gray-600">Знание языков</th>
                <th scope="col" className="px-6 py-4 text-left font-medium text-gray-600">Образование</th>
                <th scope="col" className="px-6 py-4 text-left font-medium text-gray-600">Специализация</th>
                <th scope="col" className="px-6 py-4 text-left font-medium text-gray-600">Опыт работы</th>
                <th scope="col" className="px-6 py-4 text-left font-medium text-gray-600">Желаемая зарплата</th>
                <th scope="col" className="px-6 py-4 text-left font-medium text-gray-600">Дата готовности к выезду</th>
                <th scope="col" className="px-6 py-4 text-left font-medium text-gray-600">Предпочитаемая страна</th>
                <th scope="col" className="px-6 py-4 text-left font-medium text-gray-600">Предпочитаемый город</th>
                <th scope="col" className="px-6 py-4 text-left font-medium text-gray-600">Предпочитаемая работа</th>
                <th scope="col" className="px-6 py-4 text-left font-medium text-gray-600">Наличие судимости</th>
                <th scope="col" className="px-6 py-4 text-left font-medium text-gray-600">Синхронизация с 1С</th>
              </tr>
            </thead>
            <tbody className="divide-y bg-white text-sm">
              {tableData.map((v, i) => (
                <tr key={i}>
                  <td className="px-6 py-4">{v.name}</td>
                  <td className="px-6 py-4">{v.surname}</td>
                  <td className="px-6 py-4">{v.middlename}</td>
                  <td className="px-6 py-4">{v.dateOfBirth!.toString().substring(0, 10)}</td>
                  <td className="px-6 py-4">{v.tin}</td>
                  <td className="px-6 py-4">{v.gender}</td>
                  <td className="px-6 py-4">{v.email}</td>
                  <td className="px-6 py-4">{v.passportCode}</td>
                  <td className="px-6 py-4">{v.countryOfBirth}</td>
                  <td className="px-6 py-4">{v.addressOfBirth}</td>
                  <td className="px-6 py-4">{v.phoneNumber}</td>
                  <td className="px-6 py-4">{v.messengerNumber}</td>
                  <td className="px-6 py-4">{v.currentAddress}</td>
                  <td className="px-6 py-4 w-[270px] flex flex-col gap-y-2">
                    {v.additionalContactInformation.map((ac, i) => (
                      <div className="flex flex-col gap-y-1" key={i}>
                        <p>ФИО - {ac.fullname}</p>
                        <p>Статус - {ac.status}</p>
                        <p>Мобильный номер - {ac.phoneNumber}</p>
                        <hr />
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-4 w-[250px]">
                    {v.knowledgeOfLanguages.map((lang, i) => (
                      <div key={i} className="flex">
                        {lang.language} - {lang.level}
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-4">{v.education}</td>
                  <td className="px-6 py-4">{v.specialization}</td>
                  <td className="px-6 py-4 flex flex-col gapy-2">
                    {v.WorkExperience.map((we, i) => (
                      <div className="flex flex-col gap-y-1" key={i}>
                        <p>{we.workplace}</p>
                        <p>{we.jobTitle}</p>
                        <p>{we.dateStart.toString().substring(0, 10)} - {we.dateEnd.toString().substring(0, 10)}</p>
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-4">{v.desiredSalary}</td>
                  <td className="px-6 py-4">{v.dateOfReadiness.toString().substring(0, 10)}</td>
                  <td className="px-6 py-4">{v.desiredCountry}</td>
                  <td className="px-6 py-4">{v.desiredCity}</td>
                  <td className="px-6 py-4">{v.desiredWorkplace}</td>
                  <td className="px-6 py-4">{v.criminalRecord}</td>
                  <td className="px-6 py-4">{v.syncedWith1C ? "ДА" : "НЕТ"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between bg-white px-6 py-4">
          <span className="text-sm text-gray-600">
            Показваю <span className="font-semibold">{(filter.page - 1) * 10 + 1}</span> до <span className="font-semibold">{filter.page * 10 > count ? count : filter.page * 10}</span> из <span className="font-semibold">{count}</span> Результатов
          </span>

          <div className="flex gap-2">
            <button
              className="cursor-pointer rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              onClick={() => {
                setFilter({...filter, page: filter.page - 1})
              }}
              disabled={filter.page - 1 == 0}
            >
              Назад
            </button>
            <button 
              className="cursor-pointer rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              onClick={() => {
                setFilter({...filter, page: filter.page + 1})
              }}
              disabled={filter.page * 10 > count}
            >
              Следующий
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
