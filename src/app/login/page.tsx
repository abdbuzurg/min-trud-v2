"use client"

import axios from "axios"
import { useRouter } from "next/navigation"
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ShieldCheck, Mail, Lock, ArrowRight } from "lucide-react";

// Minimal validation: required fields, basic email format, and short password length check
const LoginSchema = Yup.object({
  email: Yup.string().email("Введите корректный email").required("Обязательное поле"),
  password: Yup.string().min(6, "Минимум 6 символов").required("Обязательное поле"),
});

export default function LoginPage() {
  const router = useRouter()
  return (
    <div className="bg-[#F2FFF4] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / Icon */}
        <div className="flex justify-center mb-6">
          <div className="h-12 w-12 rounded-2xl bg-[#39B36E] grid place-items-center shadow-sm">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Вход в систему</h1>
          <p className="mt-2 text-sm text-gray-500">
            Введите email и пароль для входа в систему
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-sm ring-1 ring-black/5 p-6">
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={async (values) => {
              try {
                const response = await axios.post('api/login', { email: values.email, password: values.password })
                const data = response.data
                if (data.message == "success") {
                  router.push('/dashboard')
                }
              } catch (error) {
                alert("Неправильный email или пароль")
              }
            }}
          >
            {({ isSubmitting, isValid, dirty }) => (
              <Form className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39B36E]">
                      <Mail className="h-5 w-5" />
                    </span>
                    <Field
                      type="email"
                      name="email"
                      placeholder="example@email.com"
                      className="w-full rounded-xl border border-gray-200 pl-10 pr-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#39B36E]/30 focus:border-[#39B36E] transition"
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="mt-1 text-xs text-rose-600"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Пароль
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39B36E]">
                      <Lock className="h-5 w-5" />
                    </span>
                    <Field
                      type="password"
                      name="password"
                      placeholder="•••••••"
                      className="w-full rounded-xl border border-gray-200 pl-10 pr-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#39B36E]/30 focus:border-[#39B36E] transition"
                    />
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="mt-1 text-xs text-rose-600"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting || !(isValid && dirty)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gray-200 text-gray-700 font-medium py-3 disabled:opacity-60 disabled:cursor-not-allowed transition enabled:bg-[#39B36E] enabled:text-white enabled:hover:opacity-95"
                >
                  Войти
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Form>
            )}
          </Formik>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-4">
          Нажимая "Войти", вы соглашаетесь с {" "}
          <a href="#" className="underline hover:no-underline text-[#39B36E]">
            условиями использования
          </a>
        </p>
      </div>
    </div >
  );
}


