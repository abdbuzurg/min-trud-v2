"use client"

import { useFormik } from "formik"
import { Fragment, useState } from "react"
import Select from "react-select"

interface JobSeekerProfile {
  image: File | null
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
  currentAddress: string
  additionalContacts: AdditionalContactInfromation[]
  knowledgeOfLanguages: KnowledgeOfLanguages[]
  education: string
  educationOther: string
  specialization: string
  workExperience: WorkExperience[]
  desiredSalary: number
  dateOfReadiness: Date | null
  desiredCountry: string
  desiredCity: string
  desiredWorkplace: string
  criminalRecord: string
  passport: File | null
  diploma: File | null
  recomendationLetters: File[] | null
  agreement: boolean
}

interface AdditionalContactInfromation {
  fullname: string
  status: string
  otherStatus: string
  phoneNumber: string
}

interface KnowledgeOfLanguages {
  language: string
  level: string
  otherLanguage: string
}

interface WorkExperience {
  jobTitle: string
  workplace: string
  dateStart: Date | null
  dateEnd: Date | null
}

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

export default function JobSeekerProfile() {

  const [currentStage, setCurrentStage] = useState(1)

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
      dateOfReadiness: new Date(),
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
    onSubmit: (values) => {
      console.log(values)
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

  return (
    <div className="bg-[#98FF78] items-center h-[100vh] w-[100vw] justify-center py-20">
      <div className="flex flex-col gap-y-2 m-auto md:w-[768px] lg:w-[1024px] py-2 bg-white rounded-xl">
        <p className="text-2xl font-bold text-center">Профиль соискателя работы</p>
        <form onSubmit={form.handleSubmit}>
          <div id="seeker-profile" className={`flex flex-col gap-y-2 px-6 ${currentStage != 1 && 'hidden'}`}>
            <div className="flex flex-col gap-y-2 md:flex-row md:gap-x-4 md:items-center">
              {/* IMAGE */}
              <div className="flex-1">
                <label
                  className="text-center border-2 border-[#98FF78] px-4 py-2 flex flex-col"
                  htmlFor="imageUpload"
                >
                  <p>Загрузить фото</p>
                  <p>Размер файла  не более 1 МБ,</p>
                  <p>Размер не более: 1920x500.</p>
                  <p>Форматы  .jpg и .png </p>
                </label>
                <input type="file" name="imageUpload" id="imageUpload" className="hidden" />
              </div>
              <div className="flex-1 flex flex-col gap-y-2">
                {/* NAME */}
                <div className="flex-1 flex flex-col gap-y-2">
                  <label htmlFor="name" className="text-lg">Имя</label>
                  <input
                    className="px-2 py-1 border border-[#98FF78] rounded-md outline-none"
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
                    className="px-2 py-1 border border-[#98FF78] rounded-md outline-none"
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
                  className="px-2 py-1 border border-[#98FF78] rounded-md outline-none"
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
                  className="px-2 py-1 border border-[#98FF78] rounded-md outline-none"
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
                  className="px-2 py-1 border border-[#98FF78] rounded-md outline-none"
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
                <label htmlFor="gender" className="text-lg">Пол</label>
                <div className="flex gap-x-5 items-center">
                  <div className="flex gap-x-2 items-center">
                    <input
                      className="w-5 h-5 border border-[#98FF78] rounded-md outline-none"
                      type="checkbox"
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
                      type="checkbox"
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
                  className="px-2 py-1 border border-[#98FF78] rounded-md outline-none"
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
                  className="px-2 py-1 border border-[#98FF78] rounded-md outline-none"
                  type="text"
                  name="passportCode"
                  id="passportCode"
                  value={form.values.passportCode}
                  onChange={form.handleChange}
                />
              </div>
            </div>
            <div className="flex flex-col-reverse gap-y-2 md:flex-row md:gap-x-4">
              {/* Phone number */}
              <div className="flex-1 flex flex-col gap-y-2">
                <label htmlFor="phoneNumber" className="text-lg">Моб. телефон</label>
                <input
                  className="px-2 py-1 border border-[#98FF78] rounded-md outline-none"
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
                <label htmlFor="messengerCode" className="text-lg">WhatsApp/Telegram</label>
                <input
                  className="px-2 py-1 border border-[#98FF78] rounded-md outline-none"
                  type="text"
                  name="messengerCode"
                  id="messengerCode"
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
                onClick={() => setCurrentStage(2)}
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
                className="px-2 py-1 border border-[#98FF78] rounded-md outline-none"
                type="text"
                name="currentAddress"
                id="currentAddress"
                placeholder="Область/Город/Район/Джамоат/Дехот"
                value={form.values.currentAddress}
                onChange={form.handleChange}
              />
            </div>
            <div className="flex justify-between items-center">
              <p className="font-bold text-xl">Дополнительное контактное лицо</p>
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
                        className="px-2 py-1 border border-[#98FF78] rounded-md outline-none"
                        type="text"
                        name={`additionalContacts[${i}].fullname`}
                        id={`${i}_additionalContactFullname`}
                        placeholder="Область/Город/Район/Джамоат/Дехот"
                        value={form.values.additionalContacts[i].fullname}
                        onChange={form.handleChange}
                      />
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <label>Статус</label>
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
                            className="px-2 py-1 border border-[#98FF78] rounded-md outline-none"
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
                        className="px-2 py-1 border border-[#98FF78] rounded-md outline-none"
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
              <p className="font-bold text-xl">Знание языков</p>
              <span className="text-2xl font-bold text-[#98FF78] rounded-full cursor-pointer" onClick={addKnowledgeOfLanguage}>+</span>
            </div>
            <div className="flex flex-col gap-y-2">
              {form.values.knowledgeOfLanguages.map((v, i) => (
                <Fragment key={i}>
                  <hr className="border-2 border-[#98FF78]" />
                  <div className="flex gap-x-4 items-center">
                    <div className="flex-1 flex flex-col gap-y-2">
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
                          className="px-2 py-1 border border-[#98FF78] rounded-md outline-none"
                          type="text"
                          name={`knowledgeOfLanguages[${i}].otherLanguage`}
                          id={`knowledgeOfLanguages[${i}].otherLanguage`}
                          value={form.values.knowledgeOfLanguages[i].otherLanguage}
                          onChange={form.handleChange}
                        />
                      }
                    </div>
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
                onClick={() => setCurrentStage(3)}
              >
                Далее
              </button>
            </div>
          </div>
          <div id="seeker-professional-activity" className={`flex flex-col gap-y-2 px-6 ${currentStage != 3 && 'hidden'}`}>
            <div className="flex-1 flex flex-col gap-y-2">
              <label htmlFor="name" className="text-lg">Образование</label>
              <div>
                <Select
                  isMulti={false}
                  isClearable={true}
                  isSearchable={true}
                  options={educationLevelOptions}
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
                  className="px-2 py-1 border border-[#98FF78] rounded-md outline-none"
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
                className="px-2 py-1 border border-[#98FF78] rounded-md outline-none"
                type="text"
                name="specialization"
                id="specialization"
                placeholder="Инженер / Сварщик / Экономист / Филолог и тд"
                value={form.values.specialization}
                onChange={form.handleChange}
              />
            </div>
            <div className="flex justify-between items-center">
              <p className="font-bold text-xl">Опыт работы</p>
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
                        className="px-2 py-1 border border-[#98FF78] rounded-md outline-none"
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
                        className="px-2 py-1 border border-[#98FF78] rounded-md outline-none"
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
                            className="px-2 py-1 border border-[#98FF78] rounded-md outline-none"
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
                            className="px-2 py-1 border border-[#98FF78] rounded-md outline-none"
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
                onClick={() => setCurrentStage(4)}
              >
                Далее
              </button>
            </div>
          </div>
          <div id="sekker-extra-data-part2" className={`flex flex-col gap-y-2 px-6 ${currentStage != 4 && 'hidden'}`}>
            <div className="flex flex-col gap-y-2 md:flex-row md:gap-y-0 md:gap-x-4">
              {/* Desired Salary */}
              <div className="flex-1 flex flex-col gap-y-2">
                <label htmlFor="desiredSalary" className="text-lg">Желаемая зарплата</label>
                <input
                  className="px-2 py-1 border border-[#98FF78] rounded-md outline-none"
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
                  className="px-2 py-1 border border-[#98FF78] rounded-md outline-none"
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
                <label htmlFor="desiredSalary" className="text-lg">Желаемая зарплата</label>
                <div>
                  <Select
                    className="basic-single-select"
                    classNamePrefix="select"
                    isMulti={false}
                    isClearable={true}
                    isSearchable={true}
                    menuPosition="fixed"
                    name={`selectCountry`}
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
                  className="h-[38px] px-2 py-1 border border-[#98FF78] rounded-md outline-none"
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
                  className="px-2 py-1 border border-[#98FF78] rounded-md outline-none"
                  type="number"
                  name="desiredWorkplace"
                  id="desiredWorkplace"
                  value={form.values.desiredWorkplace}
                  onChange={form.handleChange}
                />
              </div>
              {/* CRIMINAL RECORD */}
              <div className="flex-1 flex flex-col gap-y-2">
                <label htmlFor="criminalRecord" className="text-lg">Наличие судимости</label>
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
                className="text-center border-2 border-[#98FF78] px-4 py-2 flex flex-col"
                htmlFor="passport"
              >
                <p>Загрузите копию паспорта</p>
                <p>Размер файла  не более 5 МБ</p>
              </label>
              <input type="file" name="passport" id="passport" className="hidden" />
            </div>
            <div className="flex flex-col gap-y-2">
              <p className="text-lg">Диплом</p>
              <label
                className="text-center border-2 border-[#98FF78] px-4 py-2 flex flex-col"
                htmlFor="diploma"
              >
                <p>Загрузите копию Диплома</p>
                <p>Размер файла  не более 5 МБ</p>
              </label>
              <input type="file" name="diploma" id="diploma" className="hidden" />
            </div>
            <div className="flex flex-col gap-y-2">
              <p className="text-lg">Рекомендательные письма</p>
              <label
                className="text-center border-2 border-[#98FF78] px-4 py-2 flex flex-col"
                htmlFor="recommendationLetters"
              >
                <p>Размер файла  не более 5 МБ</p>
              </label>
              <input type="file" name="recommendationLetters" id="recommendationLetters" className="hidden" />
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
                    type="submit"
                    disabled={!form.values.agreement}
                  >
                    Завершить
                  </button>
                </div>
              </div>
              <p className="text-center text-xs opacity-40">Регистрация и заполнение анкеты не гарантирует трудоустройство и выезд за границу. Окончательное решение принимает работодатель и/или компетентные органы.</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}