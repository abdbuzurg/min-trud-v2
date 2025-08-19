"use client"

import { useFormik } from "formik"
import Image from "next/image"
import { Fragment, useEffect, useId, useState } from "react"
import Select from "react-select"
import * as yup from "yup"
import { JobSeekerProfile } from "../../../../jobseeker"
import axios from "axios"


const languageOptions = [
  {
    label: "Русский",
    value: "Русский",
  },
  {
    label: "Английский",
    value: "Английский",
  },
  {
    label: "Корейский",
    value: "Корейский",
  },
  {
    label: "Арабский",
    value: "Арабский",
  },
  {
    label: "Другое",
    value: "Другое",
  },
]

const understandingOfLanguageOptions = [
  {
    label: "Отлично",
    value: "Отлично",
  },
  {
    label: "Хорошо",
    value: "Хорошо",
  },
  {
    label: "Удовлетворительно",
    value: "Удовлетворительно",
  },
  {
    label: "со словарем",
    value: "со словарем",
  },
]

const educationLevelOptions = [
  {
    label: "Высшее",
    value: "Высшее",
  },
  {
    label: "Средняя специальность",
    value: "Средняя специальность",
  },
  {
    label: "Профессиональное техническое",
    value: "Профессиональное техническое",
  },
  {
    label: "Другое",
    value: "Другое",
  },
]

const countriesOptions = [
  {
    "value": "Австралия",
    "label": "Австралия"
  },
  {
    "value": "Австрия",
    "label": "Австрия"
  },
  {
    "value": "Азербайджан",
    "label": "Азербайджан"
  },
  {
    "value": "Албания",
    "label": "Албания"
  },
  {
    "value": "Алжир",
    "label": "Алжир"
  },
  {
    "value": "Ангола",
    "label": "Ангола"
  },
  {
    "value": "Андорра",
    "label": "Андорра"
  },
  {
    "value": "Антигуа и Барбуда",
    "label": "Антигуа и Барбуда"
  },
  {
    "value": "Аргентина",
    "label": "Аргентина"
  },
  {
    "value": "Армения",
    "label": "Армения"
  },
  {
    "value": "Афганистан",
    "label": "Афганистан"
  },
  {
    "value": "Багамы",
    "label": "Багамы"
  },
  {
    "value": "Бангладеш",
    "label": "Бангладеш"
  },
  {
    "value": "Барбадос",
    "label": "Барбадос"
  },
  {
    "value": "Бахрейн",
    "label": "Бахрейн"
  },
  {
    "value": "Беларусь",
    "label": "Беларусь"
  },
  {
    "value": "Белиз",
    "label": "Белиз"
  },
  {
    "value": "Бельгия",
    "label": "Бельгия"
  },
  {
    "value": "Бенин",
    "label": "Бенин"
  },
  {
    "value": "Болгария",
    "label": "Болгария"
  },
  {
    "value": "Боливия",
    "label": "Боливия"
  },
  {
    "value": "Босния и Герцеговина",
    "label": "Босния и Герцеговина"
  },
  {
    "value": "Ботсвана",
    "label": "Ботсвана"
  },
  {
    "value": "Бразилия",
    "label": "Бразилия"
  },
  {
    "value": "Бруней-Даруссалам",
    "label": "Бруней-Даруссалам"
  },
  {
    "value": "Буркина-Фасо",
    "label": "Буркина-Фасо"
  },
  {
    "value": "Бурунди",
    "label": "Бурунди"
  },
  {
    "value": "Бутан",
    "label": "Бутан"
  },
  {
    "value": "Вануату",
    "label": "Вануату"
  },
  {
    "value": "Ватикан",
    "label": "Ватикан"
  },
  {
    "value": "Великобритания",
    "label": "Великобритания"
  },
  {
    "value": "Венгрия",
    "label": "Венгрия"
  },
  {
    "value": "Венесуэла",
    "label": "Венесуэла"
  },
  {
    "value": "Восточный Тимор",
    "label": "Восточный Тимор"
  },
  {
    "value": "Вьетнам",
    "label": "Вьетнам"
  },
  {
    "value": "Габон",
    "label": "Габон"
  },
  {
    "value": "Гаити",
    "label": "Гаити"
  },
  {
    "value": "Гайана",
    "label": "Гайана"
  },
  {
    "value": "Гамбия",
    "label": "Гамбия"
  },
  {
    "value": "Гана",
    "label": "Гана"
  },
  {
    "value": "Гватемала",
    "label": "Гватемала"
  },
  {
    "value": "Гвинея",
    "label": "Гвинея"
  },
  {
    "value": "Гвинея-Бисау",
    "label": "Гвинея-Бисау"
  },
  {
    "value": "Германия",
    "label": "Германия"
  },
  {
    "value": "Гондурас",
    "label": "Гондурас"
  },
  {
    "value": "Гренада",
    "label": "Гренада"
  },
  {
    "value": "Греция",
    "label": "Греция"
  },
  {
    "value": "Грузия",
    "label": "Грузия"
  },
  {
    "value": "Дания",
    "label": "Дания"
  },
  {
    "value": "Джибути",
    "label": "Джибути"
  },
  {
    "value": "Доминика",
    "label": "Доминика"
  },
  {
    "value": "Доминиканская Республика",
    "label": "Доминиканская Республика"
  },
  {
    "value": "Египет",
    "label": "Египет"
  },
  {
    "value": "Замбия",
    "label": "Замбия"
  },
  {
    "value": "Зимбабве",
    "label": "Зимбабве"
  },
  {
    "value": "Израиль",
    "label": "Израиль"
  },
  {
    "value": "Индия",
    "label": "Индия"
  },
  {
    "value": "Индонезия",
    "label": "Индонезия"
  },
  {
    "value": "Иордания",
    "label": "Иордания"
  },
  {
    "value": "Ирак",
    "label": "Ирак"
  },
  {
    "value": "Иран",
    "label": "Иран"
  },
  {
    "value": "Ирландия",
    "label": "Ирландия"
  },
  {
    "value": "Исландия",
    "label": "Исландия"
  },
  {
    "value": "Испания",
    "label": "Испания"
  },
  {
    "value": "Италия",
    "label": "Италия"
  },
  {
    "value": "Йемен",
    "label": "Йемен"
  },
  {
    "value": "Кабо-Верде",
    "label": "Кабо-Верде"
  },
  {
    "value": "Казахстан",
    "label": "Казахстан"
  },
  {
    "value": "Камбоджа",
    "label": "Камбоджа"
  },
  {
    "value": "Камерун",
    "label": "Камерун"
  },
  {
    "value": "Канада",
    "label": "Канада"
  },
  {
    "value": "Катар",
    "label": "Катар"
  },
  {
    "value": "Кения",
    "label": "Кения"
  },
  {
    "value": "Кипр",
    "label": "Кипр"
  },
  {
    "value": "Киргизия",
    "label": "Киргизия"
  },
  {
    "value": "Кирибати",
    "label": "Кирибати"
  },
  {
    "value": "Китай",
    "label": "Китай"
  },
  {
    "value": "Колумбия",
    "label": "Колумбия"
  },
  {
    "value": "Коморы",
    "label": "Коморы"
  },
  {
    "value": "Конго, Демократическая Республика",
    "label": "Конго, Демократическая Республика"
  },
  {
    "value": "Конго, Республика",
    "label": "Конго, Республика"
  },
  {
    "value": "Коста-Рика",
    "label": "Коста-Рика"
  },
  {
    "value": "Кот-д'Ивуар",
    "label": "Кот-д'Ивуар"
  },
  {
    "value": "Куба",
    "label": "Куба"
  },
  {
    "value": "Кувейт",
    "label": "Кувейт"
  },
  {
    "value": "Лаос",
    "label": "Лаос"
  },
  {
    "value": "Латвия",
    "label": "Латвия"
  },
  {
    "value": "Лесото",
    "label": "Лесото"
  },
  {
    "value": "Либерия",
    "label": "Либерия"
  },
  {
    "value": "Ливан",
    "label": "Ливан"
  },
  {
    "value": "Ливия",
    "label": "Ливия"
  },
  {
    "value": "Литва",
    "label": "Литва"
  },
  {
    "value": "Лихтенштейн",
    "label": "Лихтенштейн"
  },
  {
    "value": "Люксембург",
    "label": "Люксембург"
  },
  {
    "value": "Маврикий",
    "label": "Маврикий"
  },
  {
    "value": "Мавритания",
    "label": "Мавритания"
  },
  {
    "value": "Мадагаскар",
    "label": "Мадагаскар"
  },
  {
    "value": "Малави",
    "label": "Малави"
  },
  {
    "value": "Малайзия",
    "label": "Малайзия"
  },
  {
    "value": "Мали",
    "label": "Мали"
  },
  {
    "value": "Мальдивы",
    "label": "Мальдивы"
  },
  {
    "value": "Мальта",
    "label": "Мальта"
  },
  {
    "value": "Марокко",
    "label": "Марокко"
  },
  {
    "value": "Маршалловы Острова",
    "label": "Маршалловы Острова"
  },
  {
    "value": "Мексика",
    "label": "Мексика"
  },
  {
    "value": "Микронезия",
    "label": "Микронезия"
  },
  {
    "value": "Мозамбик",
    "label": "Мозамбик"
  },
  {
    "value": "Молдова",
    "label": "Молдова"
  },
  {
    "value": "Монако",
    "label": "Монако"
  },
  {
    "value": "Монголия",
    "label": "Монголия"
  },
  {
    "value": "Мьянма",
    "label": "Мьянма"
  },
  {
    "value": "Намибия",
    "label": "Намибия"
  },
  {
    "value": "Науру",
    "label": "Науру"
  },
  {
    "value": "Непал",
    "label": "Непал"
  },
  {
    "value": "Нигер",
    "label": "Нигер"
  },
  {
    "value": "Нигерия",
    "label": "Нигерия"
  },
  {
    "value": "Нидерланды",
    "label": "Нидерланды"
  },
  {
    "value": "Никарагуа",
    "label": "Никарагуа"
  },
  {
    "value": "Новая Зеландия",
    "label": "Новая Зеландия"
  },
  {
    "value": "Норвегия",
    "label": "Норвегия"
  },
  {
    "value": "Объединенные Арабские Эмираты",
    "label": "Объединенные Арабские Эмираты"
  },
  {
    "value": "Оман",
    "label": "Оман"
  },
  {
    "value": "Пакистан",
    "label": "Пакистан"
  },
  {
    "value": "Палау",
    "label": "Палау"
  },
  {
    "value": "Палестина",
    "label": "Палестина"
  },
  {
    "value": "Панама",
    "label": "Панама"
  },
  {
    "value": "Папуа — Новая Гвинея",
    "label": "Папуа — Новая Гвинея"
  },
  {
    "value": "Парагвай",
    "label": "Парагвай"
  },
  {
    "value": "Перу",
    "label": "Перу"
  },
  {
    "value": "Польша",
    "label": "Польша"
  },
  {
    "value": "Португалия",
    "label": "Португалия"
  },
  {
    "value": "Россия",
    "label": "Россия"
  },
  {
    "value": "Руанда",
    "label": "Руанда"
  },
  {
    "value": "Румыния",
    "label": "Румыния"
  },
  {
    "value": "Сальвадор",
    "label": "Сальвадор"
  },
  {
    "value": "Самоа",
    "label": "Самоа"
  },
  {
    "value": "Сан-Марино",
    "label": "Сан-Марино"
  },
  {
    "value": "Сан-Томе и Принсипи",
    "label": "Сан-Томе и Принсипи"
  },
  {
    "value": "Саудовская Аравия",
    "label": "Саудовская Аравия"
  },
  {
    "value": "Северная Корея",
    "label": "Северная Корея"
  },
  {
    "value": "Северная Македония",
    "label": "Северная Македония"
  },
  {
    "value": "Сейшелы",
    "label": "Сейшелы"
  },
  {
    "value": "Сенегал",
    "label": "Сенегал"
  },
  {
    "value": "Сент-Винсент и Гренадины",
    "label": "Сент-Винсент и Гренадины"
  },
  {
    "value": "Сент-Китс и Невис",
    "label": "Сент-Китс и Невис"
  },
  {
    "value": "Сент-Люсия",
    "label": "Сент-Люсия"
  },
  {
    "value": "Сербия",
    "label": "Сербия"
  },
  {
    "value": "Сингапур",
    "label": "Сингапур"
  },
  {
    "value": "Сирия",
    "label": "Сирия"
  },
  {
    "value": "Словакия",
    "label": "Словакия"
  },
  {
    "value": "Словения",
    "label": "Словения"
  },
  {
    "value": "Соединенные Штаты Америки",
    "label": "Соединенные Штаты Америки"
  },
  {
    "value": "Соломоновы Острова",
    "label": "Соломоновы Острова"
  },
  {
    "value": "Сомали",
    "label": "Сомали"
  },
  {
    "value": "Судан",
    "label": "Судан"
  },
  {
    "value": "Суринам",
    "label": "Суринам"
  },
  {
    "value": "Сьерра-Леоне",
    "label": "Сьерра-Леоне"
  },
  {
    "value": "Таджикистан",
    "label": "Таджикистан"
  },
  {
    "value": "Таиланд",
    "label": "Таиланд"
  },
  {
    "value": "Танзания",
    "label": "Танзания"
  },
  {
    "value": "Того",
    "label": "Того"
  },
  {
    "value": "Тонга",
    "label": "Тонга"
  },
  {
    "value": "Тринидад и Тобаго",
    "label": "Тринидад и Тобаго"
  },
  {
    "value": "Тувалу",
    "label": "Тувалу"
  },
  {
    "value": "Тунис",
    "label": "Тунис"
  },
  {
    "value": "Туркменистан",
    "label": "Туркменистан"
  },
  {
    "value": "Турция",
    "label": "Турция"
  },
  {
    "value": "Уганда",
    "label": "Уганда"
  },
  {
    "value": "Узбекистан",
    "label": "Узбекистан"
  },
  {
    "value": "Украина",
    "label": "Украина"
  },
  {
    "value": "Уругвай",
    "label": "Уругвай"
  },
  {
    "value": "Фиджи",
    "label": "Фиджи"
  },
  {
    "value": "Филиппины",
    "label": "Филиппины"
  },
  {
    "value": "Финляндия",
    "label": "Финляндия"
  },
  {
    "value": "Франция",
    "label": "Франция"
  },
  {
    "value": "Хорватия",
    "label": "Хорватия"
  },
  {
    "value": "Центральноафриканская Республика",
    "label": "Центральноафриканская Республика"
  },
  {
    "value": "Чад",
    "label": "Чад"
  },
  {
    "value": "Черногория",
    "label": "Черногория"
  },
  {
    "value": "Чехия",
    "label": "Чехия"
  },
  {
    "value": "Чили",
    "label": "Чили"
  },
  {
    "value": "Швейцария",
    "label": "Швейцария"
  },
  {
    "value": "Швеция",
    "label": "Швеция"
  },
  {
    "value": "Шри-Ланка",
    "label": "Шри-Ланка"
  },
  {
    "value": "Эквадор",
    "label": "Эквадор"
  },
  {
    "value": "Экваториальная Гвинея",
    "label": "Экваториальная Гвинея"
  },
  {
    "value": "Эритрея",
    "label": "Эритрея"
  },
  {
    "value": "Эсватини",
    "label": "Эсватини"
  },
  {
    "value": "Эстония",
    "label": "Эстония"
  },
  {
    "value": "Эфиопия",
    "label": "Эфиопия"
  },
  {
    "value": "Южная Африка",
    "label": "Южная Африка"
  },
  {
    "value": "Южная Корея",
    "label": "Южная Корея"
  },
  {
    "value": "Южный Судан",
    "label": "Южный Судан"
  },
  {
    "value": "Ямайка",
    "label": "Ямайка"
  },
  {
    "value": "Япония",
    "label": "Япония"
  }
]

export default function JobSeekerProfileView() {

  const [currentStage, setCurrentStage] = useState(1)

  const [formData, setFormData] = useState<FormData | null>(null)
  const form = useFormik<JobSeekerProfile>({
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
      currentAddress: "",
      additionalContacts: [],
      knowledgeOfLanguages: [],
      criminalRecord: "",
      dateOfReadiness: null,
      desiredCity: "",
      desiredCountry: "",
      desiredSalary: 0,
      desiredWorkplace: "",
      diploma: null,
      education: "",
      educationOther: "",
      image: null,
      passport: null,
      recomendationLetters: null,
      specialization: "",
      workExperience: [],
      agreement: false,
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
      currentAddress: yup.string().required("required"),
      additionalContacts: yup.array().min(1).of(
        yup.object().shape({
          fullname: yup.string().required("required"),
          status: yup.string().required("required"),
          otherStatus: yup.string().when('status', {
            is: (value: string) => value == "Другое",
            then: (schema) => schema.required("required"),
            otherwise: (schema) => schema.optional()
          }),
          phoneNumber: yup.string().required("required").matches(
            /^[0-9-+\s]+$/,
            'Invalid messenger number',
          ),
        }),
      ),
      knowledgeOfLanguages: yup.array().min(1).of(
        yup.object().shape({
          language: yup.string().required("required"),
          level: yup.string().required("required"),
          otherLanguage: yup.string().when('language', {
            is: (value: string) => value == "Другое",
            then: (schema) => schema.required("required"),
            otherwise: (schema) => schema.optional()
          })
        })
      ),
      education: yup.string().required("required"),
      educationOther: yup.string().when('education', {
        is: (value: string) => value == "Другое",
        then: (schema) => schema.required("required"),
        otherwise: (schema) => schema.optional(),
      }),
      specialization: yup.string().required("required"),
      workExperience: yup.array().min(1).of(
        yup.object().shape({
          jobTitle: yup.string().required("required"),
          workplace: yup.string().required("required"),
          dateStart: yup.date().required("required"),
          dateEnd: yup.date().required("required"),
        })
      ),
      desiredSalary: yup.number().min(1).required("required"),
      dateOfReadiness: yup.date().required("required"),
      desiredCountry: yup.string().required("required"),
      desiredCity: yup.string().required("required"),
      desiredWorkplace: yup.string().required("required"),
      criminalRecord: yup.string().required("required"),
      passport: yup.mixed().required("required"),
      image: yup.mixed().required("required"),
      diploma: yup.mixed().required("required"),
      recomendationLetters: yup.mixed().required("required")
    }),
    onSubmit: async (values) => {
      console.log(currentStage)

      const formData = new FormData()
      formData.set("image", values.image!)
      formData.set("passport", values.passport!)
      formData.set("diploma", values.diploma!)
      formData.set("recomendationLetters", values.recomendationLetters!)
      formData.set("name", values.name)
      formData.set("surname", values.surname)
      formData.set("middlename", values.middlename)
      formData.set("dateOfBirth", values.dateOfBirth!.toString())
      formData.set("tin", values.tin)
      formData.set("gender", values.gender)
      formData.set("email", values.email)
      formData.set("passportCode", values.passportCode)
      formData.set("countryOfBirth", values.countryOfBirth)
      formData.set("addressOfBirth", values.addressOfBirth)
      formData.set("phoneNumber", values.phoneNumber)
      formData.set("messengerNumber", values.messengerNumber)
      formData.set("currentAddress", values.currentAddress)
      formData.set("education", values.education == "" ? values.educationOther : values.education)
      formData.set("specialization", values.specialization)
      formData.set("desiredSalary", values.desiredSalary.toString())
      formData.set("dateOfReadiness", values.dateOfReadiness!.toString())
      formData.set("desiredCountry", values.desiredCountry)
      formData.set("desiredCity", values.desiredCity)
      formData.set("desiredWorkplace", values.desiredWorkplace)
      formData.set("criminalRecord", values.criminalRecord)
      const additionalContacts = values.additionalContacts.map(v => ({
        ...v,
        status: v.status == "Другое" ? v.otherStatus : v.status,
      }))
      formData.set("additionalContacts", JSON.stringify(additionalContacts))
      const knowledgeOfLanguages = values.knowledgeOfLanguages.map((v) => ({
        ...v,
        language: v.language == "Другое" ? v.otherLanguage : v.language,
      }))
      formData.set("knowledgeOfLanguages", JSON.stringify(knowledgeOfLanguages))
      formData.set("workExperience", JSON.stringify(values.workExperience))

      try {
        const response = await axios.post(`api/send-sms`, {
          phoneNumber: values.phoneNumber,
        })
        const { code } = response.data
        setServerCode(code)
        setFormData(formData)
      } catch (error) {
        console.log(error)
        alert("Призошла ошибка попробуйте заполнить форму по позже")
      }
    }
  })

  const addAdditionalContactInformation = () => {
    form.setFieldValue("additionalContacts", [
      ...form.values.additionalContacts,
      {
        fullname: "",
        status: "",
        otherStatus: "",
        phoneNumber: ""
      }
    ])
  }

  const removeAdditionalContactInfromation = (index: number) => {
    const allInfo = form.values.additionalContacts
    form.setFieldValue("additionalContacts", allInfo.filter((_, i) => i != index))
  }

  const addKnowledgeOfLanguage = () => {
    form.setFieldValue("knowledgeOfLanguages", [
      ...form.values.knowledgeOfLanguages,
      {
        language: "",
        level: "",
        otherLanguage: "",
      }
    ])
  }

  const removeKnowledgeOfLanguage = (index: number) => {
    const languages = form.values.knowledgeOfLanguages
    form.setFieldValue("knowledgeOfLanguages", languages.filter((_, i) => i != index))
  }

  const addWorkExperience = () => {
    form.setFieldValue("workExperience", [
      ...form.values.workExperience,
      {
        jobTitle: "",
        workplace: "",
        dateStart: null,
        dateEnd: null,
      }
    ])
  }

  const removeWorkExperience = (index: number) => {
    const workExperiences = form.values.workExperience
    form.setFieldValue("workExperience", workExperiences.filter((_, i) => i != index))
  }

  const [serverCode, setServerCode] = useState("1")
  const [code, setCode] = useState("")
  useEffect(() => {
    if (code == serverCode) {
      setCurrentStage(6)
      axios.post(`api/job-seeker`, formData)
    }
  }, [code])

  return (
    <body className="bg-[#98FF78]">
      <div className=" items-center h-[100vh] w-[100vw] justify-center grid place-items-center">
        <div className="flex flex-col gap-y-2 m-auto md:w-[768px] lg:w-[1024px] py-2 bg-white rounded-xl">
          <p className="text-2xl font-bold text-center">Профиль соискателя работы</p>
          <form onSubmit={form.handleSubmit}>
            <div id="seeker-profile" className={`flex flex-col gap-y-2 px-6 ${currentStage != 1 && 'hidden'}`}>
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
                      placeholder="Иваныч"
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
                  type="button"
                  onClick={async () => {
                    const errors = await form.validateForm()
                    const fields = ["name", "surname", "middlename", "dateOfBirth", "tin", "gender", "email", "passportCode", "countryOfBirth", "addressOfBirth", "phoneNumber", "messengerNumber", "image"]
                    const errorCheck = fields.filter((v: string) => {
                      if (v in errors) {
                        form.setFieldError(v, "required")
                        form.setFieldTouched(v)
                        return true
                      }
                    })
                    console.log(errorCheck)
                    if (errorCheck.length == 0) {
                      setCurrentStage(2)
                    }
                  }}
                >
                  Далее
                </button>
              </div>
            </div>
            <div id="seeker-extra-data" className={`flex flex-col gap-y-2 px-6 ${currentStage != 2 && 'hidden'}`}>
              {/* CURRENT ADDRESS */}
              <div className="flex flex-col gap-y-2">
                <label htmlFor="currentAddress">Адрес</label>
                <input
                  className={`px-2 py-1 border rounded-md outline-none ${(form.errors.currentAddress && form.touched.currentAddress) ? "border-red-500" : "border-[#98FF78]"}`}
                  type="text"
                  name="currentAddress"
                  id="currentAddress"
                  placeholder="Область/Город/Район/Джамоат/Дехот"
                  value={form.values.currentAddress}
                  onChange={form.handleChange}
                />
              </div>
              <div className="flex justify-between items-center">
                <p className={`font-bold text-xl ${(form.errors.additionalContacts && form.touched.additionalContacts) ? "text-red-500" : "text-black"}`}>Дополнительное контактное лицо</p>
                <span className="text-2xl font-bold text-[#98FF78] rounded-full cursor-pointer" onClick={addAdditionalContactInformation}>+</span>
              </div>
              <div className="flex flex-col gap-y-2">
                {form.values.additionalContacts.map((v, i) => (
                  <Fragment key={i}>
                    <hr className="border-2 border-[#98FF78]" />
                    <div className="flex flex-col gap-y-2">
                      <div className="flex flex-col gap-y-2">
                        <div className="flex justify-between items-center">
                          <label htmlFor={`${i}_additionalContactFullname`}>ФИО</label>
                          <span className="text-2xl font-bold text-red-500 rounded-full cursor-pointer" onClick={() => removeAdditionalContactInfromation(i)}>-</span>
                        </div>
                        <input
                          //  @ts-ignore 
                          className={`px-2 py-1 border rounded-md outline-none ${(form.errors.additionalContacts && Array.isArray(form.errors.additionalContacts) && form.errors.additionalContacts[i]?.fullname && form.touched.additionalContacts) ? "border-red-500" : "border-[#98FF78]"}`}
                          type="text"
                          name={`additionalContacts[${i}].fullname`}
                          id={`${i}_additionalContactFullname`}
                          value={form.values.additionalContacts[i].fullname}
                          onChange={form.handleChange}
                        />
                      </div>
                      <div className="flex flex-col gap-y-2">
                        {/* @ts-ignore */}
                        <label className={`${(form.errors.additionalContacts && Array.isArray(form.errors.additionalContacts) && form.errors.additionalContacts[i]?.status && form.touched.additionalContacts) ? "text-red-500" : "text-black"}`}>Статус</label>
                        <div className="flex flex-col gap-y-2">
                          <div className="flex gap-x-3 flex-wrap md:flex-nowrap md:gap-x-0 md:justify-between">
                            <div className="flex gap-x-1">
                              <input
                                className="w-5 h-5 border border-[#98FF78] rounded-md outline-none"
                                type="radio"
                                name={`additionalContacts[${i}].status`}
                                id={`additionalContacts[${i}].status.father`}
                                value="Отец"
                                checked={form.values.additionalContacts[i].status == "Отец"}
                                onChange={form.handleChange}
                              />
                              <label htmlFor={`additionalContacts[${i}].status.father`}>Отец</label>
                            </div>
                            <div className="flex gap-x-1">
                              <input
                                className="w-5 h-5 border border-[#98FF78] rounded-md outline-none"
                                type="radio"
                                name={`additionalContacts[${i}].status`}
                                id={`additionalContacts[${i}].status.mother`}
                                value="Мать"
                                checked={form.values.additionalContacts[i].status == "Мать"}
                                onChange={form.handleChange}
                              />
                              <label htmlFor={`additionalContacts[${i}].status.mother`}>Мать</label>
                            </div>
                            <div className="flex gap-x-1">
                              <input
                                className="w-5 h-5 border border-[#98FF78] rounded-md outline-none"
                                type="radio"
                                name={`additionalContacts[${i}].status`}
                                id={`additionalContacts[${i}].status.wife`}
                                value="Жена"
                                checked={form.values.additionalContacts[i].status == "Жена"}
                                onChange={form.handleChange}
                              />
                              <label htmlFor={`additionalContacts[${i}].status.wife`}>Жена</label>
                            </div>
                            <div className="flex gap-x-1">
                              <input
                                className="w-5 h-5 border border-[#98FF78] rounded-md outline-none"
                                type="radio"
                                name={`additionalContacts[${i}].status`}
                                id={`additionalContacts[${i}].status.brother`}
                                value="Брат"
                                checked={form.values.additionalContacts[i].status == "Брат"}
                                onChange={form.handleChange}
                              />
                              <label htmlFor={`additionalContacts[${i}].status.brother`}>Брат</label>
                            </div>
                            <div className="flex gap-x-1">
                              <input
                                className="w-5 h-5 border border-[#98FF78] rounded-md outline-none"
                                type="radio"
                                name={`additionalContacts[${i}].status`}
                                id={`additionalContacts[${i}].status.sister`}
                                value="Сестра"
                                checked={form.values.additionalContacts[i].status == "Сестра"}
                                onChange={form.handleChange}
                              />
                              <label htmlFor={`additionalContacts[${i}].status.sister`}>Сестра</label>
                            </div>
                            <div className="flex gap-x-1">
                              <input
                                className="w-5 h-5 border border-[#98FF78] rounded-md outline-none"
                                type="radio"
                                name={`additionalContacts[${i}].status`}
                                id={`additionalContacts[${i}].status.other`}
                                value="Другое"
                                checked={form.values.additionalContacts[i].status == "Другое"}
                                onChange={form.handleChange}
                              />
                              <label htmlFor={`additionalContacts[${i}].status.other`}>Другое</label>
                            </div>
                          </div>
                          {form.values.additionalContacts[i].status == "Другое" &&
                            <input
                              // @ts-ignore
                              className={`px-2 py-1 border rounded-md outline-none ${(form.errors.additionalContacts && Array.isArray(form.errors.additionalContacts) && form.errors.additionalContacts[i]?.otherStatus && form.touched.additionalContacts) ? "border-red-500" : "border-[#98FF78]"}`}
                              type="text"
                              name={`additionalContacts[${i}].otherStatus`}
                              id={`${i}_additionalContactOtherStatus`}
                              value={form.values.additionalContacts[i].otherStatus}
                              onChange={form.handleChange}
                            />
                          }
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col gap-y-2">
                        <label htmlFor="name" className="text-lg">Мобильный номер</label>
                        <input
                          // @ts-ignore
                          className={`px-2 py-1 border rounded-md outline-none ${(form.errors.additionalContacts && Array.isArray(form.errors.additionalContacts) && form.errors.additionalContacts[i]?.phoneNumber && form.touched.additionalContacts) ? "border-red-500" : "border-[#98FF78]"}`}
                          type="text"
                          name={`additionalContacts[${i}].phoneNumber`}
                          id={`additionalContacts[${i}].phoneNumber`}
                          value={form.values.additionalContacts[i].phoneNumber}
                          onChange={form.handleChange}
                        />
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <p className={`font-bold text-xl ${(form.errors.knowledgeOfLanguages && form.touched.knowledgeOfLanguages) ? "text-red-500" : "text-black"}`}>Знание языков</p>
                <span className="text-2xl font-bold text-[#98FF78] rounded-full cursor-pointer" onClick={addKnowledgeOfLanguage}>+</span>
              </div>
              <div className="flex flex-col gap-y-2">
                {form.values.knowledgeOfLanguages.map((v, i) => (
                  <Fragment key={i}>
                    <hr className="border-2 border-[#98FF78]" />
                    <div className="flex gap-x-4 items-center">
                      <div className="flex-1 flex flex-col gap-y-2">
                        <div className="flex flex-col gap-y-2">
                          {/* @ts-ignore */}
                          <label className={`${(form.errors.knowledgeOfLanguages && Array.isArray(form.errors.knowledgeOfLanguages) && (form.errors.knowledgeOfLanguages[i]?.language || form.errors.knowledgeOfLanguages[i]?.otherLanguage) && form.touched.knowledgeOfLanguages) ? "text-red-500" : "text-black"}`}>Язык</label>
                          <div className="flex-1">
                            <Select
                              className="basic-single-select"
                              classNamePrefix="select"
                              isMulti={false}
                              isClearable={true}
                              isSearchable={true}
                              menuPosition="fixed"
                              placeholder="Выберите язык"
                              name={`knowledgeOfLanguagesLangugeSelect[${i}]`}
                              options={languageOptions}
                              value={{
                                value: form.values.knowledgeOfLanguages[i].language,
                                label: form.values.knowledgeOfLanguages[i].language
                              }}
                              onChange={(value) => {
                                const languages = form.values.knowledgeOfLanguages
                                languages[i] = { ...languages[i], language: value?.value ?? "" }
                                form.setFieldValue("knowledgeOfLanguages", languages)
                              }}
                            />
                          </div>
                          {form.values.knowledgeOfLanguages[i].language == "Другое" &&
                            <input
                              // @ts-ignore
                              className={`px-2 py-1 border  rounded-md outline-none ${(form.errors.knowledgeOfLanguages && Array.isArray(form.errors.knowledgeOfLanguages) && form.errors.knowledgeOfLanguages[i]?.otherLanguage && form.touched.additionalContacts) ? "border-red-500" : "border-[#98FF78]"}`}
                              type="text"
                              name={`knowledgeOfLanguages[${i}].otherLanguage`}
                              id={`knowledgeOfLanguages[${i}].otherLanguage`}
                              value={form.values.knowledgeOfLanguages[i].otherLanguage}
                              onChange={form.handleChange}
                            />
                          }
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col gap-y-2">
                        {/* @ts-ignore */}
                        <label className={`${(form.errors.knowledgeOfLanguages && Array.isArray(form.errors.knowledgeOfLanguages) && (form.errors.knowledgeOfLanguages[i]?.language || form.errors.knowledgeOfLanguages[i]?.level) && form.touched.knowledgeOfLanguages) ? "text-red-500" : "text-black"}`}>Уровень владения</label>
                        <div>
                          <Select
                            className="basic-single-select"
                            classNamePrefix="select"
                            isMulti={false}
                            isClearable={true}
                            isSearchable={true}
                            menuPosition="fixed"
                            placeholder="Выберите язык"
                            name={`knowledgeOfLanguagesLangugeSelect[${i}]`}
                            options={understandingOfLanguageOptions}
                            value={{
                              value: form.values.knowledgeOfLanguages[i].level,
                              label: form.values.knowledgeOfLanguages[i].level
                            }}
                            onChange={(value) => {
                              const level = form.values.knowledgeOfLanguages
                              level[i] = { ...level[i], level: value?.value ?? "" }
                              form.setFieldValue("knowledgeOfLanguages", level)
                            }}
                          />
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-red-500 rounded-full cursor-pointer" onClick={() => removeKnowledgeOfLanguage(i)}>-</span>
                    </div>
                  </Fragment>
                ))}
              </div>
              <div className="flex justify-between mt-2">
                <button
                  className="text-black px-6 py-2 rounded-2xl bg-[#98FF78] font-bold cursor-pointer"
                  type="button"
                  onClick={() => setCurrentStage(1)}
                >
                  Назад
                </button>
                <button
                  className="text-black px-6 py-2 rounded-2xl bg-[#98FF78] font-bold cursor-pointer"
                  type="button"
                  onClick={async () => {
                    const errors = await form.validateForm()
                    let errorCount = 0
                    if ("currentAddress" in errors) {
                      form.setFieldError("currentAddress", "required")
                      form.setFieldTouched("currentAddress")
                      errorCount++
                    }

                    if ("additionalContacts" in errors) {
                      form.setFieldError("additionalContacts", "required")
                      form.setFieldTouched("additionalContacts")
                      errorCount++
                    }
                    if (errors.additionalContacts && Array.isArray(errors.additionalContacts) && errors.additionalContacts.length > 0) {
                      const additionalContactsFields = ["fullname", "status", "otherStatus", "phoneNumber"]
                      errors.additionalContacts.map((v, i) => {
                        if (!v) return true
                        if (typeof v === "string") return false
                        const errorCheck = additionalContactsFields.filter((field) => {
                          if (field in v) {
                            form.setFieldError(`additionalContacts[${i}].${field}`, "required")
                            form.setFieldTouched(`additionalContacts[${i}].${field}`)
                          }
                        })
                        if (errorCheck.length > 1) {
                          errorCount++
                        }
                        return true
                      })
                    }

                    if ("knowledgeOfLanguages" in errors) {
                      form.setFieldError("knowledgeOfLanguages", "required")
                      form.setFieldTouched("knowledgeOfLanguages")
                      errorCount++
                    }
                    if (errors.knowledgeOfLanguages && Array.isArray(errors.knowledgeOfLanguages) && errors.knowledgeOfLanguages.length > 0) {
                      const knowledgeOfLanguagesFields = ["language", "level", "otherLanguage"]
                      errors.knowledgeOfLanguages.map((v, i) => {
                        if (!v) return true
                        if (typeof v === "string") return false
                        const errorCheck = knowledgeOfLanguagesFields.filter((field) => {
                          if (field in v) {
                            form.setFieldError(`knowledgeOfLanguages[${i}].${field}`, "required")
                            form.setFieldTouched(`knowledgeOfLanguages[${i}].${field}`)
                          }
                        })
                        if (errorCheck.length > 1) {
                          errorCount++
                        }
                        return true
                      })
                    }
                    if (errorCount == 0) {
                      setCurrentStage(3)
                    }
                  }}
                >
                  Далее
                </button>
              </div>
            </div>
            <div id="seeker-professional-activity" className={`flex flex-col gap-y-2 px-6 ${currentStage != 3 && 'hidden'}`}>
              <div className="flex-1 flex flex-col gap-y-2">
                <label htmlFor="name" className={`${(form.errors.education && form.touched.education) ? "text-red-500" : "text-black"}`}>Образование</label>
                <div>
                  <Select
                    isMulti={false}
                    isClearable={true}
                    isSearchable={true}
                    options={educationLevelOptions}
                    instanceId="education-id"
                    value={{
                      value: form.values.education,
                      label: form.values.education
                    }}
                    onChange={(value) => {
                      form.setFieldValue("education", value?.value ?? "")
                    }}
                  />
                </div>
                {form.values.education == "Другое" &&
                  <input
                    className={`px-2 py-1 border rounded-md outline-none ${(form.errors.educationOther && form.touched.educationOther) ? "border-red-500" : "border-[#98FF78]"}`}
                    type="text"
                    name={`educationOther`}
                    id={`educationOther`}
                    value={form.values.educationOther}
                    onChange={form.handleChange}
                  />
                }
              </div>
              <div className="flex flex-col gap-y-2">
                <label htmlFor="specialization">Специальность</label>
                <input
                  className={`px-2 py-1 border rounded-md outline-none ${(form.errors.specialization && form.touched.specialization) ? "border-red-500" : "border-[#98FF78]"}`}
                  type="text"
                  name="specialization"
                  id="specialization"
                  placeholder="Инженер / Сварщик / Экономист / Филолог и тд"
                  value={form.values.specialization}
                  onChange={form.handleChange}
                />
              </div>
              <div className="flex justify-between items-center">
                <p className={`font-bold text-xl ${(form.errors.workExperience && form.touched.workExperience) ? "text-red-500" : "text-black"}`}>Опыт работы</p>
                <span className="text-2xl font-bold text-[#98FF78] rounded-full cursor-pointer" onClick={addWorkExperience}>+</span>
              </div>
              <div className="flex flex-col gap-y-2">
                {form.values.workExperience.map((v, i) => (
                  <Fragment key={i}>
                    <hr className="border-2 border-[#98FF78]" />
                    <div className="flex flex-col gap-y-2">
                      <div className="flex flex-col gap-y-2">
                        <div className="flex justify-between items-center">
                          <label htmlFor={`${i}_workExperience`}>Должность</label>
                          <span className="text-2xl font-bold text-red-500 rounded-full cursor-pointer" onClick={() => removeWorkExperience(i)}>-</span>
                        </div>
                        <input
                          // @ts-ignore
                          className={`px-2 py-1 border  rounded-md outline-none ${(form.errors.workExperience && Array.isArray(form.errors.workExperience) && form.errors.workExperience[i]?.jobTitle && form.touched.workExperience) ? "border-red-500" : "border-[#98FF78]"}`}
                          type="text"
                          name={`workExperience[${i}].jobTitle`}
                          id={`${i}_workExperience`}
                          value={form.values.workExperience[i].jobTitle}
                          onChange={form.handleChange}
                        />
                      </div>
                      <div className="flex flex-col gap-y-2">
                        <label htmlFor={`${i}_workExperience`}>Компания</label>
                        <input
                          // @ts-ignore
                          className={`px-2 py-1 border  rounded-md outline-none ${(form.errors.workExperience && Array.isArray(form.errors.workExperience) && form.errors.workExperience[i]?.workplace && form.touched.workExperience) ? "border-red-500" : "border-[#98FF78]"}`}
                          type="text"
                          name={`workExperience[${i}].workplace`}
                          id={`${i}_workExperience`}
                          value={form.values.workExperience[i].workplace}
                          onChange={form.handleChange}
                        />
                      </div>
                      <div className="flex flex-col gap-y-2">
                        <label htmlFor={`${i}_workExperience`}>Период Работы</label>
                        <div className="flex gap-x-5">
                          <div className="flex-1 flex flex-col gap-y-2">
                            <label htmlFor={`workExperience[${i}].dateStart`}>От</label>
                            <input
                              // @ts-ignore
                              className={`px-2 py-1 border  rounded-md outline-none ${(form.errors.workExperience && Array.isArray(form.errors.workExperience) && form.errors.workExperience[i]?.dateStart && form.touched.workExperience) ? "border-red-500" : "border-[#98FF78]"}`}
                              type="date"
                              name={`workExperience[${i}].dateStart`}
                              id={`${i}_workExperience`}
                              value={form.values.workExperience[i].dateStart?.toString() ?? 0}
                              onChange={form.handleChange}
                            />
                          </div>
                          <div className="flex-1 flex flex-col gap-y-2">
                            <label htmlFor={`workExperience[${i}].dateEnd`}>До</label>
                            <input
                              // @ts-ignore
                              className={`px-2 py-1 border  rounded-md outline-none ${(form.errors.workExperience && Array.isArray(form.errors.workExperience) && form.errors.workExperience[i]?.dateEnd && form.touched.workExperience) ? "border-red-500" : "border-[#98FF78]"}`}
                              type="date"
                              name={`workExperience[${i}].dateEnd`}
                              id={`${i}_workExperience`}
                              value={form.values.workExperience[i].dateEnd?.toString() ?? 0}
                              onChange={form.handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
              <div className="flex justify-between mt-2">
                <button
                  className="text-black px-6 py-2 rounded-2xl bg-[#98FF78] font-bold cursor-pointer"
                  type="button"
                  onClick={() => setCurrentStage(2)}
                >
                  Назад
                </button>
                <button
                  className="text-black px-6 py-2 rounded-2xl bg-[#98FF78] font-bold cursor-pointer"
                  type="button"
                  onClick={async () => {
                    const errors = await form.validateForm()
                    const stage3Fields = ["education", "educationOther", "specialization", "workExperience"]
                    let errorCount = 0
                    stage3Fields.filter(field => {
                      if (field in errors) {
                        form.setFieldError(`${field}`, "required")
                        form.setFieldTouched(`${field}`)
                        errorCount++
                      }
                    })
                    if (errors.workExperience && Array.isArray(errors.workExperience) && errors.workExperience.length > 0) {
                      const workExperienceFields = ["jobTitle", "workplace", "dateStart", "dateEnd"]
                      errors.workExperience.map((v, i) => {
                        if (!v) return true
                        if (typeof v === "string") return false
                        workExperienceFields.filter((field) => {
                          if (field in v) {
                            form.setFieldError(`workExperience[${i}].${field}`, "required")
                            form.setFieldTouched(`workExperience[${i}].${field}`)
                            errorCount++
                          }
                        })

                        return true
                      })
                    }
                    if (errorCount == 0) {
                      setCurrentStage(4)
                    }
                  }}
                >
                  Далее
                </button>
              </div>
            </div>
            <div id="seeker-extra-data-part2" className={`flex flex-col gap-y-2 px-6 ${currentStage != 4 && 'hidden'}`}>
              <div className="flex flex-col gap-y-2 md:flex-row md:gap-y-0 md:gap-x-4">
                {/* Desired Salary */}
                <div className="flex-1 flex flex-col gap-y-2">
                  <label htmlFor="desiredSalary" className="text-lg">Желаемая зарплата</label>
                  <input
                    className={`px-2 py-1 border rounded-md outline-none ${(form.errors.desiredSalary && form.touched.desiredCountry) ? "border-red-500" : "border-[#98FF78]"}`}
                    type="number"
                    name="desiredSalary"
                    id="desiredSalary"
                    value={form.values.desiredSalary}
                    onChange={form.handleChange}
                  />
                </div>
                {/* DATE OF READINESS */}
                <div className="flex-1 flex flex-col gap-y-2">
                  <label htmlFor="dateOfReadiness" className="text-lg">Дата готовности к выезду</label>
                  <input
                    className={`px-2 py-1 border rounded-md outline-none ${(form.errors.dateOfReadiness && form.touched.dateOfReadiness) ? "border-red-500" : "border-[#98FF78]"}`}
                    type="date"
                    name="dateOfReadiness"
                    id="dateOfReadiness"
                    value={form.values.dateOfReadiness?.toString() ?? 0}
                    onChange={form.handleChange}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-y-2 md:flex-row md:gap-y-0 md:gap-x-4">
                {/* DESIRED COUNTRY */}
                <div className="flex-1 flex flex-col gap-y-2">
                  <label htmlFor="desiredCountry" className={`text-lg ${(form.errors.desiredCountry && form.touched.desiredCountry) ? "text-red-500" : "text-black"}`}>Предпочитаемая страна</label>
                  <div>
                    <Select
                      id="desiredCountry"
                      isMulti={false}
                      isClearable={true}
                      isSearchable={true}
                      menuPosition="fixed"
                      name={`selectCountry`}
                      instanceId="desired-country-id"
                      options={countriesOptions}
                      value={{
                        value: form.values.desiredCountry,
                        label: form.values.desiredCountry,
                      }}
                      onChange={(value) => {
                        form.setFieldValue("desiredCountry", value?.value ?? "")
                      }}
                    />
                  </div>
                </div>
                {/* DESIRED CITY */}
                <div className="flex-1 flex flex-col gap-y-2">
                  <label htmlFor="desiredCity" className="text-lg">Предпочитаемый город</label>
                  <input
                    className={`h-[38px] px-2 py-1 border rounded-md outline-none ${(form.errors.desiredCity && form.touched.desiredCity) ? "border-red-500" : "border-[#98FF78]"}`}
                    type="text"
                    name="desiredCity"
                    id="desiredCity"
                    value={form.values.desiredCity}
                    onChange={form.handleChange}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-y-2 md:flex-row md:gap-y-0 md:gap-x-4 items-center">
                {/* DESIRED WORKPLACE */}
                <div className="flex-1 flex flex-col gap-y-2">
                  <label htmlFor="desiredWorkplace" className="text-lg">Предпочитаемая работа</label>
                  <input
                    className={`px-2 py-1 border rounded-md outline-none ${(form.errors.desiredWorkplace && form.touched.desiredWorkplace) ? "border-red-500" : "border-[#98FF78]"}`}
                    type="text"
                    name="desiredWorkplace"
                    id="desiredWorkplace"
                    value={form.values.desiredWorkplace}
                    onChange={form.handleChange}
                  />
                </div>
                {/* CRIMINAL RECORD */}
                <div className="flex-1 flex flex-col gap-y-2">
                  <label htmlFor="criminalRecord" className={`text-lg ${(form.errors.criminalRecord && form.touched.criminalRecord) ? "text-red-500" : "text-black"}`}>Наличие судимости</label>
                  <div className="flex gap-x-5">
                    <div className="flex gap-x-1 justify-between">
                      <input
                        className="w-5 h-5 border border-[#98FF78] rounded-md outline-none"
                        type="radio"
                        name="criminalRecord"
                        id="criminalRecordYes"
                        value={"Да"}
                        checked={form.values.criminalRecord == "Да"}
                        onChange={form.handleChange}
                      />
                      <label htmlFor="criminalRecordYes">Да</label>
                    </div>
                    <div className="flex gap-x-1 justify-between">
                      <input
                        className="w-5 h-5 border border-[#98FF78] rounded-md outline-none"
                        type="radio"
                        name="criminalRecord"
                        id="criminalRecordNo"
                        value={"Нет"}
                        checked={form.values.criminalRecord == "Нет"}
                        onChange={form.handleChange}
                      />
                      <label htmlFor="criminalRecordNo">Нет</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-y-2">
                <p className="text-lg">Паспорт</p>
                <label
                  className={`cursor-pointer text-center border-2  p-4 flex flex-col ${(form.errors.passport && form.touched.passport) ? "border-red-500" : "border-[#98FF78]"}`}
                  htmlFor="passport"
                >
                  {!form.values.passport
                    ?
                    <>
                      <p>Загрузите копию паспорта</p>
                      <p>Размер файла  не более 5 МБ</p>
                    </>
                    :
                    <p>Паспорт получен</p>
                  }
                </label>
                <input type="file" name="passport" id="passport" className="hidden" onChange={(e) => {
                  if (e.target.files) {
                    form.setFieldValue("passport", e.target.files[0])
                  }
                }} />
              </div>
              <div className="flex flex-col gap-y-2">
                <p className="text-lg">Диплом</p>
                <label
                  className={`cursor-pointer text-center border-2  p-4 flex flex-col ${(form.errors.diploma && form.touched.diploma) ? "border-red-500" : "border-[#98FF78]"}`}
                  htmlFor="diploma"
                >
                  {!form.values.diploma
                    ?
                    <>
                      <p>Загрузите копию Диплома</p>
                      <p>Размер файла  не более 5 МБ</p>
                    </>
                    :
                    <p>Диплом получен</p>
                  }
                </label>
                <input type="file" name="diploma" id="diploma" className="hidden" onChange={(e) => {
                  if (e.target.files) {
                    form.setFieldValue("diploma", e.target.files[0])
                  }
                }} />
              </div>
              <div className="flex flex-col gap-y-2">
                <p className="text-lg">Рекомендательные письма</p>
                <label
                  className={`cursor-pointer text-center border-2  p-4 flex flex-col ${(form.errors.recomendationLetters && form.touched.recomendationLetters) ? "border-red-500" : "border-[#98FF78]"}`}
                  htmlFor="recomendationLetters"
                >
                  {!form.values.recomendationLetters
                    ?
                    <p>Размер файла  не более 5 МБ</p>
                    :
                    <p>Письма получены</p>
                  }
                </label>
                <input type="file" name="recomendationLetters" id="recomendationLetters" className="hidden" onChange={e => {
                  if (e.target.files) {
                    form.setFieldValue("recomendationLetters", e.target.files[0])
                  }
                }} />
              </div>
              <hr className="border-2 border-[#98FF78]" />
              <div className="flex flex-col gap-y-2">
                <div className="flex gap-x-2">
                  <input
                    type="checkbox"
                    value={1}
                    name="agreement"
                    id="agreement"
                    onChange={form.handleChange}
                    className="w-5 h-5 border border-[#98FF78] rounded-md outline-none"
                  />
                  <label htmlFor="agreement">Я согласен(на) на обработку персональных данных (ссылка на полный текст согласия) и ознакомлен(а) с [политикой конфиденциальности](ссылка на политику).</label>
                </div>
                <div>
                  <div className="flex justify-between mt-2">
                    <button
                      className="text-black px-6 py-2 rounded-2xl bg-[#98FF78] font-bold cursor-pointer"
                      type="button"
                      onClick={() => setCurrentStage(3)}
                    >
                      Назад
                    </button>
                    <button
                      className={`text-black px-6 py-2 rounded-2xl bg-[#98FF78] font-bold ${form.values.agreement ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                      disabled={!form.values.agreement}
                      type="button"
                      onClick={() => {
                        setCurrentStage(5)
                        form.submitForm()
                      }}
                    >
                      Завершить
                    </button>
                  </div>
                </div>
                <p className="text-center text-xs opacity-40">Регистрация и заполнение анкеты не гарантирует трудоустройство и выезд за границу. Окончательное решение принимает работодатель и/или компетентные органы.</p>
              </div>
            </div>
            <div id="seeker-verification" className={`flex flex-col gap-y-2 px-6 ${currentStage != 5 && 'hidden'}`}>
              <div className="flex justify-center flex-col gap-y-2">
                <label>На ваш номер ({form.values.phoneNumber}) отправлен СМС код</label>
                <input
                  className={`px-2 py-1 border rounded-md outline-none ${(form.errors.name && form.touched.name) ? "border-red-500" : "border-[#98FF78]"}`}
                  type="number"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <button type="button" onClick={() => setCurrentStage(4)}>back</button>
              </div>
            </div>
            <div id="seeker-profile-saving" className={`flex flex-col gap-y-2 px-6 ${currentStage != 6 && 'hidden'}`}>
              <div className="w-full flex justify-center py-5 items-center gap-x-10">
                <div className="w-20 h-20 rounded-full animate-spin border-4 border-solid border-green-500 border-t-transparent"></div>
                <p>Идёт сохранения данных</p>
              </div>
              <div className="flex justify-center gap-x-10 items-center py-5">
                <Image
                  width={100}
                  height={100}
                  src="tick.svg"
                  alt="tick"
                />
                <p>Ваш профиль принят</p>
              </div>
              <div className="flex justify-center gap-x-10 items-center py-5">
                <Image
                  width={100}
                  height={100}
                  src="error.svg"
                  alt="error"
                />
                <p>Ошибка при сохранения профиля</p>
              </div>
              <button type="button" onClick={() => setCurrentStage(4)}>BACK</button>
            </div>
          </form>
        </div >
      </div >
    </body>
  )
}