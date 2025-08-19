"use client"

import axios from "axios"
import { useFormik } from "formik"
import { useRouter } from "next/navigation"

export default function Login() {
  const router = useRouter()

  const form = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async(values) => {
      try {
        const response = await axios.post('api/login', { email: values.email, password: values.password })
        const data = response.data
        if (data.message == "success") {
          router.push('/dashboard')
        }
      } catch(error) {
        console.error(error)
        alert("Неправильный email или пароль")
      }
    }
  })

  return (
    <body className="bg-[#98FF78]">
      <div className="items-center h-[100vh] w-[100vw] justify-center grid place-items-center">
        <form onSubmit={form.handleSubmit} className="flex flex-col gap-y-2 m-auto w-[500px] bg-white  rounded-md px-4 py-2">
          <p className="font-bold text-xl">Вход</p>
          <div className="flex-1 flex flex-col gap-y-2">
            <label htmlFor="name" className="text-lg">Email</label>
            <input
              className={`px-2 py-1 border rounded-md outline-none border-[#98FF78]`}
              type="text"
              name="email"
              id="email"
              value={form.values.email}
              onChange={form.handleChange}
            />
          </div>
          <div className="flex-1 flex flex-col gap-y-2">
            <label htmlFor="name" className="text-lg">Пароль</label>
            <input
              className={`px-2 py-1 border rounded-md outline-none border-[#98FF78]`}
              type="password"
              name="password"
              id="password"
              value={form.values.password}
              onChange={form.handleChange}
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-4 py-2 bg-[#98FF78] rounded-md cursor-pointer"
            >
              Вход
            </button>
          </div>
        </form>
      </div>
    </body>
  )
}
