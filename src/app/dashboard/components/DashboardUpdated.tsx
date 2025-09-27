"use client"

import React, { useEffect, useMemo, useState } from "react";
import { Users, Calendar, X, CloudSun, Eye, Download } from "lucide-react";
import SeekerModal from "./SeekerModal";
import axios from "axios";
import { JobSeeker } from "@/generated/prisma";
import DownloadData from "./DownloadData";

export interface JobSeekerAPIResult extends JobSeeker {
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
export default function EmployeeListPage() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [selected, setSelected] = useState<JobSeekerAPIResult | null>(null)
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [synced, setSynced] = useState(0)
  const [tableData, setTableData] = useState<JobSeekerAPIResult[]>([])
  const [downloadModal, setDownloadModal] = useState(false)

  const clearFilters = () => {
    setStart("");
    setEnd("");
  };

  useEffect(() => {
    axios.get<{ data: JobSeekerAPIResult[], count: number, count1C: number }>('api/job-seeker-table', { params: { page: page } })
      .then(response => {
        setTableData(response.data.data)
        setTotal(response.data.count)
        setSynced(response.data.count1C)
      })
  }, [])

  useEffect(() => {
    axios.get<{ data: JobSeekerAPIResult[], count: number }>('api/job-seeker-table', {
      params: {
        page: page,
        dateStart: start,
        dateEnd: end,
      }
    }).then(response => {
      setTableData(response.data.data)
    })
  }, [page, end, start])

  return (
    <div className="bg-[#F2FFF4]">
      {/* Top bar */}
      <header className="bg-[#39B36E] text-white px-6 py-3 font-semibold shadow-sm">
        Министерство Труда
      </header>

      <main className="p-6">
        {/* Filters Card (no search by request) */}
        <section className="bg-white/90 backdrop-blur rounded-2xl shadow-sm ring-1 ring-black/5 p-4 md:p-5 mb-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-700">
              <span className="inline-flex items-center gap-2">
                <Users className="h-4 w-4 text-[#39B36E]" />
                Всего соискателей: <b className="ml-1">{total}</b>
              </span>
              <span className="inline-flex items-center gap-2">
                <CloudSun className="h-4 w-4 text-[#39B36E]" />
                Синхронизировано с 1С: <b className="ml-1">{synced}</b>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <DateInput label="Начало" value={start} onChange={setStart} />
              <DateInput label="Конец" value={end} onChange={setEnd} />

              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-500 text-white px-4 py-2 font-medium hover:opacity-95"
              >
                <X className="h-4 w-4" />
                Очистить
              </button>

              <button className="inline-flex items-center gap-2 rounded-xl bg-[#2563eb] text-white px-4 py-2 font-medium hover:opacity-95">
                <CloudSun className="h-4 w-4" />
                Синхронизация с 1С
              </button>

              <button
                className="inline-flex items-center gap-2 rounded-xl bg-[#2563eb] text-white px-4 py-2 font-medium hover:opacity-95"
                onClick={() => setDownloadModal(true)}
              >
                <Download className="h-4 w-4" />
                Скачать
              </button>
            </div>
          </div>
        </section>
        {downloadModal && <DownloadData setDownloadModal={setDownloadModal} />}

        {/* Table */}
        <section className="bg-white/90 backdrop-blur rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-[#EAF7ED] text-gray-700">
                  {[
                    "имя",
                    "фамилия",
                    "отчество",
                    "дата рождения",
                    "пол",
                    "мобильный номер",
                    "синхронизация с 1С",
                    "подробнее",
                  ].map((h) => (
                    <th key={h} className="text-left font-semibold tracking-wide px-5 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((e, idx) => (
                  <tr key={e.id} className="border-t border-gray-100">
                    <td className="px-5 py-4 text-gray-800">{e.firstName}</td>
                    <td className="px-5 py-4 text-gray-800">{e.lastName}</td>
                    <td className="px-5 py-4 text-gray-800">{e.middleName}</td>
                    <td className="px-5 py-4 text-gray-800">{formatDate(e.birthDate.toString())}</td>
                    <td className="px-5 py-4 text-gray-800">{e.gender}</td>
                    <td className="px-5 py-4 text-gray-800">{e.phoneNumber}</td>
                    <td className="px-5 py-4">
                      {e.syncedWith1C ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 ring-1 ring-emerald-100">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Включена
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 text-gray-700 px-3 py-1 ring-1 ring-gray-200">
                          <span className="h-2 w-2 rounded-full bg-gray-400" /> Отключена
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        className="inline-flex items-center gap-2 rounded-full bg-[#39B36E] text-white px-3 py-1.5 text-sm font-medium hover:opacity-95"
                        onClick={() => {
                          setOpen(true)
                          setSelected(e)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                        Подробнее
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </section>
        <div className="flex items-center justify-end bg-gradient-to-br from-green-50 to-emerald-50 px-6 py-4">
          <div className="flex gap-2">
            <button
              className="cursor-pointer rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              onClick={() => {
                setPage(page - 1)
              }}
              disabled={page - 1 == 0}
            >
              Назад
            </button>
            <button
              className="cursor-pointer rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              onClick={() => {
                setPage(page + 1)
              }}
              disabled={page * 10 > total}
            >
              Следующий
            </button>
          </div>
        </div>
        {open && selected && (
          <SeekerModal employee={selected} onClose={() => setOpen(false)} />
        )}
      </main>
    </div>
  );
}

function DateInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-700">
      <span className="hidden md:block">{label}</span>
      <div className="relative">
        <Calendar className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none w-[160px] md:w-[170px] rounded-xl border border-gray-200 pl-9 pr-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#39B36E]/30 focus:border-[#39B36E]"
        />
      </div>
    </label>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

