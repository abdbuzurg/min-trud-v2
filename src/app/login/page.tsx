"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { ShieldCheck, Mail, Lock, ArrowRight } from "lucide-react";

type LoginFormErrors = {
  email?: string;
  password?: string;
};

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormReady = useMemo(() => {
    return email.trim().length > 0 && password.trim().length > 0;
  }, [email, password]);

  const validate = (): LoginFormErrors => {
    const nextErrors: LoginFormErrors = {};
    const emailTrimmed = email.trim();
    const passwordTrimmed = password.trim();

    if (!emailTrimmed) {
      nextErrors.email = "Обязательное поле";
    } else if (!isValidEmail(emailTrimmed)) {
      nextErrors.email = "Введите корректный email";
    }

    if (!passwordTrimmed) {
      nextErrors.password = "Обязательное поле";
    } else if (passwordTrimmed.length < 6) {
      nextErrors.password = "Минимум 6 символов";
    }

    return nextErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post("api/login", { email, password });
      const data = response.data;
      if (data.message === "success") {
        router.push("/dashboard");
      } else {
        alert("Неправильный email или пароль");
      }
    } catch {
      alert("Неправильный email или пароль");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F2FFF4] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="h-12 w-12 rounded-2xl bg-[#39B36E] grid place-items-center shadow-sm">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Вход в систему</h1>
          <p className="mt-2 text-sm text-gray-500">
            Введите email и пароль для входа в систему
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-sm ring-1 ring-black/5 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39B36E]">
                  <Mail className="h-5 w-5" />
                </span>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="example@email.com"
                  className="w-full rounded-xl border border-gray-200 pl-10 pr-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#39B36E]/30 focus:border-[#39B36E] transition"
                />
              </div>
              {errors.email ? (
                <div className="mt-1 text-xs text-rose-600">{errors.email}</div>
              ) : null}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Пароль
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39B36E]">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="•••••••"
                  className="w-full rounded-xl border border-gray-200 pl-10 pr-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#39B36E]/30 focus:border-[#39B36E] transition"
                />
              </div>
              {errors.password ? (
                <div className="mt-1 text-xs text-rose-600">{errors.password}</div>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isFormReady}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gray-200 text-gray-700 font-medium py-3 disabled:opacity-60 disabled:cursor-not-allowed transition enabled:bg-[#39B36E] enabled:text-white enabled:hover:opacity-95"
            >
              Войти
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          Нажимая "Войти", вы соглашаетесь с{" "}
          <a href="#" className="underline hover:no-underline text-[#39B36E]">
            условиями использования
          </a>
        </p>
      </div>
    </div>
  );
}

