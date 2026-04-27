'use client'

import { Lock, Phone } from "lucide-react"
import { useState } from "react"

type FormErrors = {
  phoneNumber?: string
  password?: string
}

export default function LoginForm() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<FormErrors>({})

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    const match = cleaned.match(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/)
    if (match) {
      return `+(${match[1]}) ${match[2]}-${match[3]}-${match[4]}-${match[5]}`
    }
    return value
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    if (value.length <= 12) {
      setPhoneNumber(value)
    }
  }

  const validate = (): boolean => {
    const nextErrors: FormErrors = {}
    if (!phoneNumber.trim()) {
      nextErrors.phoneNumber = "Номер телефона обязателен"
    }
    if (!password.trim()) {
      nextErrors.password = "Пароль обязателен"
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validate()) {
      return
    }

    // TODO: Wire seeker login submit when backend contract is finalized.
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
      <div className="group">
        <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
          <Phone size={16} className="mr-2 text-green-500" />
          Номер телефона
        </label>
        <div className="relative">
          <input
            type="tel"
            value={formatPhoneNumber(phoneNumber)}
            onChange={handlePhoneChange}
            placeholder="+7 (999) 123-45-67"
            className="w-full px-4 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none bg-gray-50 focus:bg-white text-lg"
            required
          />
          <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          {errors.phoneNumber ? (
            <p className="text-red-600">{errors.phoneNumber}</p>
          ) : null}
        </div>
      </div>
      <div className="group">
        <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
          <Lock size={16} className="mr-2 text-green-500" />
          Пароль
        </label>
        <div className="relative">
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Последний код полученный по СМС"
            className="w-full px-4 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none bg-gray-50 focus:bg-white text-lg"
            required
          />
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          {errors.password ? (
            <p className="text-red-600">{errors.password}</p>
          ) : null}
        </div>
      </div>
      <div className="flex items-center justify-center">
        <button
          className="cursor-pointer flex items-center justify-center px-6 py-4 font-semibold rounded-xl transition-all duration-200 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300"
          type="submit"
        >
          Войти в профиль
        </button>
      </div>
    </form>
  )
}

