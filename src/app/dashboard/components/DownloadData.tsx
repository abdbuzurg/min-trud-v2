"user client"

import { useState } from "react";

interface Props {
  setDownloadModal: (value: boolean) => void
}

export default function DownloadData({ setDownloadModal }: Props) {
  const [date, setDate] = useState("");
  const [sync1c, setSync1c] = useState(false);
  const [gender, setGender] = useState("all");
  const [country, setCountry] = useState("");
  const [error, setError] = useState("")

  const handleDownload = async () => {
    try {
      const response = await fetch("/api/download-dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          sync1c,
          gender,
          country,
        })
      });

      if (!response.ok) {
        throw new Error("Ошибка при скачивании или данных с таким фильтрами отсутсвуют")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "jobseeker.zip"
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      setError(err.message)
    }
  }
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Фильтры для скачивания</h2>


        <div className="space-y-4">
          {/* Date input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Дата подачи</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 border-gray-200 focus:border-green-400"
            />
          </div>


          {/* Sync 1C checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={sync1c}
              onChange={(e) => setSync1c(e.target.checked)}
              className="w-5 h-5"
              id="sync1c"
            />
            <label htmlFor="sync1c" className="text-sm font-medium text-gray-700">
              Синхронизировано с 1С
            </label>
          </div>


          {/* Gender select */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Пол</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 border-gray-200 focus:border-green-400"
            >
              <option value="all">Все</option>
              <option value="мужской">Мужской</option>
              <option value="женский">Женский</option>
            </select>
          </div>


          {/* Country text input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Страна</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Введите страну"
              className="w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 border-gray-200 focus:border-green-400"
            />
          </div>
        </div>


        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setDownloadModal(false)}
            className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700 font-medium hover:bg-gray-300"
          >
            Отмена
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl bg-[#39B36E] text-white font-medium hover:opacity-95"
          >
            Скачать
          </button>
        </div>
      </div>
    </div>
  )
}
