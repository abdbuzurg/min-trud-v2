import { useFormik } from "formik"
import { Dispatch, SetStateAction } from "react"
import * as yup from "yup"

interface SeekerMainInformationShape {
  name: string
  surname: string
  middlename: string
  dateOfBirth: Date | null
  tin: string
  gender: string
  email: string
  passportCode: string
  countryOfBirth: string
  addressOfBirth: string
  phoneNumber: string
  messengerNumber: string
  image: File | null
}

interface Props {
  setCurrentStage: Dispatch<SetStateAction<number>>
  isCurrentStage: boolean
}

export default function SeekerMainInformation({
  setCurrentStage,
  isCurrentStage,
}: Props) {

  const form = useFormik<SeekerMainInformationShape>({
    initialValues: {
      name: "",
      surname: "",
      middlename: "",
      dateOfBirth: null,
      tin: "",
      gender: "",
      email: "",
      passportCode: "",
      countryOfBirth: "",
      addressOfBirth: "",
      phoneNumber: "",
      messengerNumber: "",
      image: null,
    },
    validationSchema: yup.object({
      name: yup.string().required("required"),
      surname: yup.string().required("required"),
      middlename: yup.string().required("required"),
      dateOfBirth: yup.date().required("required"),
      tin: yup.string().required("required").length(9, "required"),
      gender: yup.string().required("required"),
      email: yup.string().email().required("required"),
      passportCode: yup.string().required("required").test('passport-code-test', 'wrong-passport code', (value) => {
        return (value.startsWith("A") || value.startsWith("А")) && value.length == 9
      }),
      countryOfBirth: yup.string().required("required"),
      addressOfBirth: yup.string().required("required"),
      phoneNumber: yup.string().required("required").matches(
        /^[0-9-+\s]+$/,
        'Invalid phone number',
      ),
      messengerNumber: yup.string().required("required").matches(
        /^[0-9-+\s]+$/,
        'Invalid messenger number',
      ),
    }),
    onSubmit: (values) => {
      setCurrentStage(2)
    }
  })

  return (
    <div id="seeker-profile" className={`flex flex-col gap-y-2 px-6 ${isCurrentStage && 'hidden'}`}>
      <div className="flex flex-col gap-y-2 md:flex-row md:gap-x-4 md:items-center">
        {/* IMAGE */}
        <div className="flex-1">
          <label
            className={`cursor-pointer text-center border-2  p-4 flex flex-col ${(form.errors.image && form.touched.image) ? "border-red-500" : "border-[#98FF78]"}`}
            htmlFor="image"
          >
            {!form.values.image
              ?
              <>
                <p>Загрузить фото</p>
                <p>Размер файла  не более 1 МБ,</p>
                <p>Размер не более: 1920x500.</p>
                <p>Форматы  .jpg и .png </p>
              </>
              :
              <p>Фото получено</p>
            }
          </label>
          <input type="file" name="image" id="image" className="hidden" onChange={(e) => {
            if (e.target.files) {
              form.setFieldValue("image", e.target.files[0])
            }
          }} />
        </div>
        <div className="flex-1 flex flex-col gap-y-2">
          {/* NAME */}
          <div className="flex-1 flex flex-col gap-y-2">
            <label htmlFor="name" className="text-lg">Имя</label>
            <input
              className={`px-2 py-1 border rounded-md outline-none ${(form.errors.name && form.touched.name) ? "border-red-500" : "border-[#98FF78]"}`}
              type="text"
              name="name"
              id="name"
              placeholder="Иван"
              value={form.values.name}
              onChange={form.handleChange}
            />
          </div>
          {/* SURNAME */}
          <div className="flex-1 flex flex-col gap-y-2">
            <label htmlFor="name" className="text-lg">Фамилия</label>
            <input
              className={`px-2 py-1 border rounded-md outline-none ${(form.errors.surname && form.touched.surname) ? "border-red-500" : "border-[#98FF78]"}`}
              type="text"
              name="surname"
              id="surname"
              placeholder="Иванов"
              value={form.values.surname}
              onChange={form.handleChange}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col-reverse gap-y-2 md:flex-row md:gap-x-4 md:items-center">
        {/* DATE OF BIRTH */}
        <div className="flex-1 flex flex-col gap-y-2">
          <label htmlFor="dateOfBirth" className="text-lg">Дата рождения</label>
          <input
            className={`px-2 py-1 border rounded-md outline-none ${(form.errors.dateOfBirth && form.touched.dateOfBirth) ? "border-red-500" : "border-[#98FF78]"}`}
            type="date"
            name="dateOfBirth"
            id="dateOfBirth"
            value={form.values.dateOfBirth?.toString() ?? 0}
            onChange={form.handleChange}
          />
        </div>
        {/* MIDDLENAME */}
        <div className="flex-1 flex flex-col gap-y-2">
          <label htmlFor="middlename" className="text-lg">Отчество</label>
          <input
            className={`px-2 py-1 border rounded-md outline-none ${(form.errors.middlename && form.touched.middlename) ? "border-red-500" : "border-[#98FF78]"}`}
            type="text"
            name="middlename"
            id="middlename"
            placeholder="Иваныч"
            value={form.values.middlename}
            onChange={form.handleChange}
          />
        </div>
      </div>
      <div className="flex flex-col-reverse gap-y-2 md:flex-row md:gap-x-4 md:items-center">
        {/* TIN */}
        <div className="flex-1 flex flex-col gap-y-2">
          <label htmlFor="tin" className="text-lg">ИНН</label>
          <input
            className={`px-2 py-1 border rounded-md outline-none ${(form.errors.tin && form.touched.tin) ? "border-red-500" : "border-[#98FF78]"}`}
            type="text"
            name="tin"
            id="tin"
            placeholder="0123456789"
            value={form.values.tin}
            onChange={form.handleChange}
          />
        </div>
        {/* GENDER */}
        <div className="flex-1 flex flex-col gap-y-2">
          <label htmlFor="gender" className={`text-lg ${(form.errors.gender && form.touched.gender) ? "text-red-500" : "text-black"}`}>Пол</label>
          <div className="flex gap-x-5 items-center">
            <div className="flex gap-x-2 items-center">
              <input
                className="w-5 h-5 border border-[#98FF78] rounded-md outline-none"
                type="radio"
                name="gender"
                id="gender_male"
                value="мужской"
                checked={form.values.gender == "мужской"}
                onChange={form.handleChange}
              />
              <label htmlFor="gender_male">Мужской</label>
            </div>
            <div className="flex gap-x-2 items-center">
              <input
                className="w-5 h-5 border border-[#98FF78] rounded-md outline-none"
                type="radio"
                name="gender"
                id="gender_female"
                value="женский"
                checked={form.values.gender == "женский"}
                onChange={form.handleChange}
              />
              <label htmlFor="gender_female">Женский</label>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col-reverse gap-y-2 md:flex-row md:gap-x-4">
        {/* EMAIL */}
        <div className="flex-1 flex flex-col gap-y-2">
          <label htmlFor="email" className="text-lg">Эл. почта</label>
          <input
            className={`px-2 py-1 border rounded-md outline-none ${(form.errors.email && form.touched.email) ? "border-red-500" : "border-[#98FF78]"}`}
            type="text"
            name="email"
            id="email"
            placeholder="ivanov_ivan@mail.ru"
            value={form.values.email}
            onChange={form.handleChange}
          />
        </div>
        {/* Passport Code */}
        <div className="flex-1 flex flex-col gap-y-2">
          <label htmlFor="passportCode" className="text-lg">Серия Паспорта</label>
          <input
            className={`px-2 py-1 border rounded-md outline-none ${(form.errors.passportCode && form.touched.passportCode) ? "border-red-500" : "border-[#98FF78]"}`}
            type="text"
            name="passportCode"
            id="passportCode"
            value={form.values.passportCode}
            onChange={form.handleChange}
          />
        </div>
      </div>
      <div className="flex flex-col-reverse gap-y-2 md:flex-row md:gap-x-4">
        {/* Country of birth */}
        <div className="flex-1 flex flex-col gap-y-2">
          <label htmlFor="countryOfBirth" className="text-lg">Место рождения(страна)</label>
          <input
            className={`px-2 py-1 border rounded-md outline-none ${(form.errors.countryOfBirth && form.touched.countryOfBirth) ? "border-red-500" : "border-[#98FF78]"}`}
            type="text"
            name="countryOfBirth"
            id="countryOfBirth"
            placeholder="Страна"
            value={form.values.countryOfBirth}
            onChange={form.handleChange}
          />
        </div>
        {/* Address Of birth */}
        <div className="flex-1 flex flex-col gap-y-2">
          <label htmlFor="addressOfBirth" className="text-lg">Место рождения(адрес)</label>
          <input
            className={`px-2 py-1 border rounded-md outline-none ${(form.errors.addressOfBirth && form.touched.addressOfBirth) ? "border-red-500" : "border-[#98FF78]"}`}
            type="text"
            name="addressOfBirth"
            id="addressOfBirth"
            value={form.values.addressOfBirth}
            onChange={form.handleChange}
          />
        </div>
      </div>
      <div className="flex flex-col-reverse gap-y-2 md:flex-row md:gap-x-4">
        {/* Phone number */}
        <div className="flex-1 flex flex-col gap-y-2">
          <label htmlFor="phoneNumber" className="text-lg">Моб. телефон</label>
          <input
            className={`px-2 py-1 border rounded-md outline-none ${(form.errors.phoneNumber && form.touched.phoneNumber) ? "border-red-500" : "border-[#98FF78]"}`}
            type="text"
            name="phoneNumber"
            id="phoneNumber"
            placeholder="+992123456789"
            value={form.values.phoneNumber}
            onChange={form.handleChange}
          />
        </div>
        {/* Messenger number */}
        <div className="flex-1 flex flex-col gap-y-2">
          <label htmlFor="messengerNumber" className="text-lg">WhatsApp/Telegram</label>
          <input
            className={`px-2 py-1 border rounded-md outline-none ${(form.errors.messengerNumber && form.touched.messengerNumber) ? "border-red-500" : "border-[#98FF78]"}`}
            type="text"
            name="messengerNumber"
            id="messengerNumber"
            placeholder="+992123456789"
            value={form.values.messengerNumber}
            onChange={form.handleChange}
          />
        </div>
      </div>
      <div className="flex justify-end mt-2">
        <button
          className="text-black px-6 py-2 rounded-2xl bg-[#98FF78] font-bold cursor-pointer"
          type="submit"
        >
          Далее
        </button>
      </div>
    </div>
  )
}
