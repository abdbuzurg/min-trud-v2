'use client'

import { useFormik } from "formik";
import { Lock, Phone } from "lucide-react"
import { useState } from "react";
import * as Yup from 'yup'

export default function LoginForm() {

  const form = useFormik({
    initialValues: {
      phoneNumber: "",
      password: "",
    },
    validationSchema: Yup.object({
      phoneNumber: Yup.string().required("Номер телефона обязателен"),
      password: Yup.string().required("Пароль обязателен")
    }),
    onSubmit: () => { }
  })
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
      return `+(${match[1]}) ${match[2]}-${match[3]}-${match[4]}-${match[5]}`;
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 12) {
      setPhoneNumber(value);
      form.setFieldValue("phoneNumber", value)
    }
  };

  return (
    <form onSubmit={form.handleSubmit} className="flex flex-col gap-y-4">
      <div className="group">
        <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
          <Phone size={16} className="mr-2 text-green-500" />
          Номер телефона
        </label>
        <div className="relative">
          <input
            type="tel"
            value={formatPhoneNumber(form.values.phoneNumber)}
            onChange={handlePhoneChange}
            placeholder="+7 (999) 123-45-67"
            className="w-full px-4 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none bg-gray-50 focus:bg-white text-lg"
            required
          />
          <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          {form.errors.phoneNumber && form.touched.phoneNumber &&
            <p className="text-red-600">{form.errors.phoneNumber}</p>
          }
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
            value={form.values.password}
            onChange={form.handleChange}
            placeholder="Последний код полученный по СМС"
            className="w-full px-4 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none bg-gray-50 focus:bg-white text-lg"
            required
          />
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          {form.errors.password && form.touched.password &&
            <p className="text-red-600">{form.errors.password}</p>
          }
        </div>
      </div>
      <div className="flex items-center justify-center">
        <button
          className="cursor-pointer flex items-center justify-center px-6 py-4 font-semibold rounded-xl transition-all duration-200 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300"
          type="submit"
        >Войти в профиль</button>
      </div>
    </form>
  )
}
