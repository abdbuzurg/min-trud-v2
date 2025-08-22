import { AdditionalContactInfromation, KnowledgeOfLanguages } from "@/generated/prisma"
import { useFormik } from "formik"
import { Dispatch, Fragment, SetStateAction } from "react"
import Select from "react-select"

interface Props {
  setCurrentStage: Dispatch<SetStateAction<number>>
  isCurrentStage: boolean
}

interface SeekerExtraData {
  currentAddress: string
  additionalContacts: AdditionalContactInfromation[],
  knowledgeOfLanguages: KnowledgeOfLanguages[],
}

export default function SeekerExtraData({
  setCurrentStage,
  isCurrentStage,
}: Props) {

  const form = useFormik<SeekerExtraData>({
    initialValues: {
      currentAddress: "",
      additionalContacts: [],
      knowledgeOfLanguages: [],
    },
    onSubmit: () => setCurrentStage(3),
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

  return (
    <div id="seeker-extra-data" className={`flex flex-col gap-y-2 px-6 ${isCurrentStage && 'hidden'}`}>
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
        {form.values.additionalContacts.map((_, i) => (
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
  )
}
