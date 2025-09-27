"use client"

import React, { useEffect, useState } from 'react';
import {
  User,
  Phone,
  GraduationCap,
  Briefcase,
  Languages,
  Globe,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Save, FileText
} from 'lucide-react';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ru } from 'date-fns/locale';
import axios from 'axios';
import { AdditionalContactInfromation, KnowledgeOfLanguages, WorkExperience } from '../../../../jobseeker';
import { useRouter } from 'next/navigation';
import { JobSeekerFromData } from '../../../../types/jobSeeker';

registerLocale('ru', ru)


const countries = ["Афганистан", "Албания", "Алжир", "Андорра", "Ангола", "Антигуа и Барбуда", "Аргентина", "Армения", "Австралия", "Австрия", "Азербайджан", "Багамы", "Бахрейн", "Бангладеш", "Барбадос", "Беларусь", "Бельгия", "Белиз", "Бенин", "Бутан", "Боливия", "Босния и Герцеговина", "Ботсвана", "Бразилия", "Бруней", "Болгария", "Буркина-Фасо", "Бурунди", "Кабо-Верде", "Камбоджа", "Камерун", "Канада", "Центральноафриканская Республика", "Чад", "Чили", "Китай", "Колумбия", "Коморы", "Конго", "Коста-Рика", "Хорватия", "Куба", "Кипр", "Чехия", "Демократическая Республика Конго", "Дания", "Джибути", "Доминика", "Доминиканская Республика", "Эквадор", "Египет", "Сальвадор", "Экваториальная Гвинея", "Эритрея", "Эстония", "Эсватини", "Эфиопия", "Фиджи", "Финляндия", "Франция", "Габон", "Гамбия", "Грузия", "Германия", "Гана", "Греция", "Гренада", "Гватемала", "Гвинея", "Гвинея-Бисау", "Гайана", "Гаити", "Ватикан", "Гондурас", "Венгрия", "Исландия", "Индия", "Индонезия", "Иран", "Ирак", "Ирландия", "Израиль", "Италия", "Ямайка", "Япония", "Иордания", "Казахстан", "Кения", "Кирибати", "Кувейт", "Киргизия", "Лаос", "Латвия", "Ливан", "Лесото", "Либерия", "Ливия", "Лихтенштейн", "Литва", "Люксембург", "Мадагаскар", "Малави", "Малайзия", "Мальдивы", "Мали", "Мальта", "Маршалловы Острова", "Мавритания", "Маврикий", "Мексика", "Микронезия", "Молдова", "Монако", "Монголия", "Черногория", "Марокко", "Мозамбик", "Мьянма", "Намибия", "Науру", "Непал", "Нидерланды", "Новая Зеландия", "Никарагуа", "Нигер", "Нигерия", "КНДР", "Северная Македония", "Норвегия", "Оман", "Пакистан", "Палау", "Палестина", "Панама", "Папуа — Новая Гвинея", "Парагвай", "Перу", "Филиппины", "Польша", "Португалия", "Катар", "Румыния", "Россия", "Руанда", "Сент-Китс и Невис", "Сент-Люсия", "Сент-Винсент и Гренадины", "Самоа", "Сан-Марино", "Сан-Томе и Принсипи", "Саудовская Аравия", "Сенегал", "Сербия", "Сейшельские Острова", "Сьерра-Леоне", "Сингапур", "Словакия", "Словения", "Соломоновы Острова", "Сомали", "Южная Африка", "Южная Корея", "Южный Судан", "Испания", "Шри-Ланка", "Судан", "Суринам", "Швеция", "Швейцария", "Сирия", "Таджикистан", "Танзания", "Таиланд", "Восточный Тимор", "Того", "Тонга", "Тринидад и Тобаго", "Тунис", "Турция", "Туркмения", "Тувалу", "Уганда", "Украина", "ОАЭ", "Великобритания", "США", "Уругвай", "Узбекистан", "Вануату", "Венесуэла", "Вьетнам", "Йемен", "Замбия", "Зимбабве"];

interface Props {
  phoneNumber: string
}

const JobSeekerForm = ({ phoneNumber }: Props) => {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [countryQuery, setCountryQuery] = useState('')

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [frontPassportFile, setFrontPassportFile] = useState<File | null>(null);
  const [backPassportFile, setBackPassportFile] = useState<File | null>(null)
  const [diplomaFile, setDiplomaFile] = useState<File | null>(null)
  const [recommendationLetterFile, setRecommendationLetterFile] = useState<File | null>(null);
  const [certificates, setCertificates] = useState<File[] | null>(null)

  const [agreement, setAgreement] = useState(false)

  const [formData, setFormData] = useState<JobSeekerFromData>({
    lastName: '',
    firstName: '',
    middleName: '',
    birthDate: '',
    gender: '',
    passportCode: '',
    maritalStatus: '',
    tin: '',
    phone: '',
    messengerNumber: '',
    email: '',
    address: '',
    addressOfBirth: '',
    additionalContact: false,
    contactRelation: '',
    contactRelationOther: '',
    contactName: '',
    contactPhone: '',
    education: '',
    educationOther: '',
    institution: '',
    specialty: '',
    languages: [{
      language: '',
      languageOther: '',
      level: ''
    }],
    workExperience: [{
      company: '',
      position: '',
      startDate: '',
      endDate: '',
    }],
    desiredCountry: '',
    desiredCity: '',
    desiredWorkPlace: '',
    expectedSalary: '',
    additionalInfo: '',
    criminalRecord: '',
    dateOfReadiness: '',
  }
  );

  const steps = [
    { id: 1, title: 'Личная информация', icon: User },
    { id: 2, title: 'Контакты', icon: Phone },
    { id: 3, title: 'Образование', icon: GraduationCap },
    { id: 4, title: 'Языки', icon: Languages },
    { id: 5, title: 'Опыт работы', icon: Briefcase },
    { id: 6, title: 'Предпочтения', icon: Globe },
    { id: 7, title: 'Документы', icon: FileText }
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!(formData.lastName ?? '').trim()) newErrors.lastName = 'Обязательное поле';
        if (!(formData.firstName ?? '').trim()) newErrors.firstName = 'Обязательное поле';
        if (!(formData.birthDate ?? '').trim()) newErrors.birthDate = 'Обязательное поле';
        if (!formData.gender) newErrors.gender = 'Обязательное поле';
        if (!(formData.passportCode ?? '').trim()) newErrors.passportCode = 'Обязательное поле';
        if (!formData.maritalStatus) newErrors.maritalStatus = 'Обязательное поле';
        if (!formData.tin) newErrors.tin = 'Обязательное поле';
        break;
      case 2:
        if (!(formData.phone ?? '').trim()) newErrors.phone = 'Обязательное поле';
        if (!(formData.messengerNumber ?? '').trim()) newErrors.messengerNumber = 'Обязательное поле';
        if (!(formData.email ?? '').trim()) newErrors.email = 'Обязательное поле';
        if (!(formData.address ?? '').trim()) newErrors.address = 'Обязательное поле';
        if (!(formData.addressOfBirth ?? '').trim()) newErrors.addressOfBirth = 'Обязательное поле';
        if (!formData.contactRelation) newErrors.contactRelation = 'Обязательное поле';
        if (formData.contactRelation === 'другое' && !(formData.contactRelationOther ?? '').trim()) {
          newErrors.contactRelationOther = 'Обязательное поле';
        }
        if (!(formData.contactName ?? '').trim()) newErrors.contactName = 'Обязательное поле';
        if (!(formData.contactPhone ?? '').trim()) newErrors.contactPhone = 'Обязательное поле';
        break;
      case 3:
        if (!formData.education) newErrors.education = 'Обязательное поле';
        if (formData.education === 'другое' && !(formData.educationOther ?? '').trim()) {
          newErrors.educationOther = 'Обязательное поле';
        }
        if (!(formData.institution ?? '').trim()) newErrors.institution = 'Обязательное поле';
        if (!(formData.specialty ?? '').trim()) newErrors.specialty = 'Обязательное поле';
        break;
      case 4:
        formData.languages.forEach((lang, index) => {
          if (!lang.language) newErrors[`language_${index}`] = 'Обязательное поле';
          if (lang.language === 'другое' && !lang.languageOther.trim()) {
            newErrors[`languageOther_${index}`] = 'Обязательное поле';
          }
          if (!lang.level) newErrors[`level_${index}`] = 'Обязательное поле';
        });
        break;
      case 5:
        formData.workExperience.forEach((exp, index) => {
          if (!exp.company.trim()) newErrors[`company_${index}`] = 'Обязательное поле';
          if (!exp.position.trim()) newErrors[`position_${index}`] = 'Обязательное поле';
          if (!exp.startDate.trim()) newErrors[`startDate_${index}`] = 'Обязательное поле';
          if (!exp.endDate.trim()) newErrors[`endDate_${index}`] = 'Обязательное поле';
        });
        break;
      case 6:
        if (!(formData.desiredCountry ?? '').trim()) newErrors.desiredCountry = 'Обязательное поле';
        if (!(formData.desiredCity ?? '').trim()) newErrors.desiredCity = 'Обязательное поле';
        if (!(formData.dateOfReadiness ?? '').trim()) newErrors.dateOfReadiness = 'Обязательное поле';
        if (!(formData.desiredWorkPlace ?? '').trim()) newErrors.desiredWorkPlace = 'Обязательное поле';
        if (!(formData.expectedSalary ?? '').trim()) newErrors.expectedSalary = 'Обязательное поле';
        break;

      case 7:
        if (!photoFile) newErrors.photoFile = 'Загрузите фотографию';
        if (!frontPassportFile) newErrors.frontPassportFile = 'Загрузите переднюю сторону паспорта'; if (!backPassportFile) newErrors.backPassportFile = 'Загрузите заднюю сторону паспорта';
        if (!diplomaFile) newErrors.diplomaFile = 'Загрузите диплом';
        if (!recommendationLetterFile) newErrors.recommendationLetterFile = 'Загрузите рекомендательное письмо';
        if (!certificates) newErrors.certificates = 'Загрузите сертификаты';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const canNavigateToStep = (targetStep: number): boolean => {
    if (targetStep <= currentStep) return true;

    for (let step = 1; step < targetStep; step++) {
      if (!validateStep(step)) return false;
    }
    return true;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleLanguageChange = (index: number, field: string, value: string) => {
    const newLanguages = [...formData.languages];
    newLanguages[index] = { ...newLanguages[index], [field]: value };
    setFormData(prev => ({ ...prev, languages: newLanguages }));

    const errorKey = `${field}_${index}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const handleWorkExperienceChange = (index: number, field: string, value: string) => {
    const newExperience = [...formData.workExperience];
    newExperience[index] = { ...newExperience[index], [field]: value };
    setFormData(prev => ({ ...prev, workExperience: newExperience }));

    const errorKey = `${field}_${index}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const addLanguage = () => {
    setFormData(prev => ({
      ...prev,
      languages: [...prev.languages, { language: '', languageOther: '', level: '' }]
    }));
  };

  const removeLanguage = (index: number) => {
    if (formData.languages.length > 1) {
      const newLanguages = formData.languages.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, languages: newLanguages }));
    }
  };

  const addWorkExperience = () => {
    setFormData(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, {
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        responsibilities: ''
      }]
    }));
  };

  const removeWorkExperience = (index: number) => {
    if (formData.workExperience.length > 1) {
      const newExperience = formData.workExperience.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, workExperience: newExperience }));
    }
  };

  const syncDesiredCountry = (list: string[]) => {
    handleInputChange('desiredCountry', list.join(", "))
  }

  const handleCountrySearch = (value: string) => {
    setCountryQuery(value);

    if (value.trim()) {
      const filtered = countries
        .filter(c => c.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 10);
      setFilteredCountries(filtered);
      setShowCountryDropdown(true);
    } else {
      setFilteredCountries([]);
      setShowCountryDropdown(false);
    }
  };

  const selectCountry = (country: string) => {
    if (!selectedCountries.includes(country)) {
      const updated = [...selectedCountries, country];
      setSelectedCountries(updated);
      syncDesiredCountry(updated);
    }
    setCountryQuery('');
    setShowCountryDropdown(false);
  };

  const removeCountry = (country: string) => {
    const updated = selectedCountries.filter(c => c !== country);
    setSelectedCountries(updated);
    syncDesiredCountry(updated);
  };

  const handleTabClick = (stepId: number) => {
    if (canNavigateToStep(stepId)) {
      setCurrentStep(stepId);
    } else {
      validateStep(currentStep);
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const sendForm = async (formData: globalThis.FormData): Promise<boolean> => {
    try {
      await axios.post(`api/job-seeker`, formData).then(res => res.data)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    const data = new FormData()

    if (photoFile) data.set('photo', photoFile);
    if (frontPassportFile) data.set('frontPassport', frontPassportFile);
    if (backPassportFile) data.set('backPassport', backPassportFile);
    if (diplomaFile) data.set('diploma', diplomaFile);
    if (recommendationLetterFile) data.set('recommendationLetter', recommendationLetterFile);
    if (certificates && certificates.length > 0) {
      certificates.forEach((file) => {
        data.append("certificates", file);
        // formData.append(`certificates[${index}]`, file);
      });
    }
    data.set("verificationPhoneNumber", phoneNumber)
    data.set("name", formData.firstName)
    data.set("surname", formData.lastName)
    data.set("middlename", formData.middleName)
    data.set("dateOfBirth", formData.birthDate)
    data.set("tin", formData.tin)
    data.set("passportCode", formData.passportCode)
    data.set("maritalStatus", formData.maritalStatus)
    data.set("gender", formData.gender)
    data.set("phoneNumber", formData.phone)
    data.set("messengerNumber", formData.messengerNumber)
    data.set("address", formData.address)
    data.set("addressOfBirth", formData.addressOfBirth)
    data.set("email", formData.email)
    const additionalContactInformation: AdditionalContactInfromation[] = [
      {
        fullname: formData.contactName,
        phoneNumber: formData.contactPhone,
        status: formData.contactRelation == "другое" ? formData.contactRelationOther : formData.contactRelation,
        otherStatus: "",
      }
    ]
    data.set("additionalContacts", JSON.stringify(additionalContactInformation))
    data.set("education", formData.education == 'другое' ? formData.educationOther : formData.education)
    data.set("institution", formData.institution)
    data.set("specialization", formData.specialty)
    const knowledgeOfLanguages: KnowledgeOfLanguages[] = formData.languages.map<KnowledgeOfLanguages>((v) => ({
      level: v.level,
      language: v.language == 'другое' ? v.languageOther : v.language,
      otherLanguage: "",
    }))
    data.set("knowledgeOfLanguages", JSON.stringify(knowledgeOfLanguages))
    const workExperience: WorkExperience[] = formData.workExperience.map<WorkExperience>(v => ({
      jobTitle: v.position,
      workplace: v.company,
      dateStart: new Date(v.startDate),
      dateEnd: new Date(v.endDate),
    }))
    data.set("workExperience", JSON.stringify(workExperience))
    data.set("desiredCountry", formData.desiredCountry)
    data.set("desiredCity", formData.desiredCity)
    data.set("desiredWorkPlace", formData.desiredWorkPlace)
    data.set("dateOfReadiness", formData.dateOfReadiness)
    data.set("desiredSalary", formData.expectedSalary)
    data.set("criminalRecord", formData.criminalRecord)
    data.set("additionalInformation", formData.additionalInfo)

    if (await sendForm(data)) {
      setIsSubmitted(true)
    }
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Фамилия *
          </label>
          <input
            type="text"
            value={(formData.lastName ?? '')}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none ${errors.lastName ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-green-400'
              }`}
            placeholder="Каримов"
          />
          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Имя *
          </label>
          <input
            type="text"
            value={(formData.firstName ?? '')}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none ${errors.firstName ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-green-400'
              }`}
            placeholder="Азиз"
          />
          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Отчество
          </label>
          <input
            type="text"
            value={(formData.middleName ?? '')}
            onChange={(e) => handleInputChange('middleName', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none"
            placeholder="Азизович"
          />
        </div>


        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            ИНН *
          </label>
          <input
            type="text"
            value={(formData.tin ?? '')}
            onChange={(e) => handleInputChange('tin', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none ${errors.firstName ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-green-400'
              }`}
            placeholder="1234567"
          />
          {errors.tin && <p className="text-red-500 text-sm mt-1">{errors.tin}</p>}
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Дата рождения *
          </label>
          <DatePicker
            locale="ru"
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none ${errors.birthDate ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-green-400'
              }`}
            placeholderText='мм/дд/гггг'
            wrapperClassName='w-full'

            selected={formData.birthDate == '' ? null : new Date(formData.birthDate)}
            onChange={(date) => setFormData({ ...formData, birthDate: date?.toString() ?? '' })}
          />
          {errors.birthDate && <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Пол *
          </label>
          <select
            value={(formData.gender ?? '')}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none ${errors.gender ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-green-400'
              }`}
          >
            <option value="">Выберите пол</option>
            <option value="мужской">Мужской</option>
            <option value="женский">Женский</option>
          </select>
          {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Код паспорта *
          </label>
          <input
            type="text"
            value={(formData.passportCode ?? '')}
            onChange={(e) => handleInputChange('passportCode', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none ${errors.citizenship ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-green-400'
              }`}
            placeholder="A012345678"
          />
          {errors.passportCode && <p className="text-red-500 text-sm mt-1">{errors.passportCode}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Семейное положение *
          </label>
          <select
            value={(formData.maritalStatus ?? '')}
            onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none ${errors.maritalStatus ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-green-400'
              }`}
          >
            <option value="">Выберите статус</option>
            <option value="холост/не замужем">Холост/Не замужем</option>
            <option value="женат/замужем">Женат/Замужем</option>
            <option value="разведен/разведена">Разведен/Разведена</option>
            <option value="вдовец/вдова">Вдовец/Вдова</option>
          </select>
          {errors.maritalStatus && <p className="text-red-500 text-sm mt-1">{errors.maritalStatus}</p>}
        </div>
      </div>
    </div>
  );

  const renderContactInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Телефон *
          </label>
          <input
            type="tel"
            value={(formData.phone ?? '')}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none ${errors.phone ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-green-400'
              }`}
            placeholder="+7 (999) 123-45-67"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            value={(formData.email ?? '')}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none ${errors.email ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-green-400'
              }`}
            placeholder="example@email.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Whatapp/Telegram
          </label>
          <input
            type="tel"
            value={(formData.messengerNumber ?? '')}
            onChange={(e) => handleInputChange('messengerNumber', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none ${errors.messengerNumber ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-green-400'
              }`}
            placeholder="+7 (999) 123-45-67"
          />
          {errors.messengerNumber && <p className="text-red-500 text-sm mt-1">{errors.messengerNumber}</p>}
        </div>

      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Адрес рождения *
        </label>
        <textarea
          value={(formData.addressOfBirth ?? '')}
          onChange={(e) => handleInputChange('addressOfBirth', e.target.value)}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none resize-none ${errors.addressOfBirth ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-green-400'
            }`}
          rows={3}
          placeholder="Введите полный адрес рождения"
        />
        {errors.addressOfBirth && <p className="text-red-500 text-sm mt-1">{errors.addressOfBirth}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Адрес проживания *
        </label>
        <textarea
          value={(formData.address ?? '')}
          onChange={(e) => handleInputChange('address', e.target.value)}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none resize-none ${errors.address ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-green-400'
            }`}
          rows={3}
          placeholder="Введите полный адрес проживания"
        />
        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
      </div>

      <div className="space-y-4">
        <span className="text-2xl font-semibold text-gray-700">
          Добавить дополнительное контактное лицо
        </span>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Статус контактного лица *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {['родитель', 'супруг/супруга', 'родственник', 'друг'].map((status) => (
              <label key={status} className="flex items-center">
                <input
                  type="radio"
                  name="contactRelation"
                  value={status}
                  checked={formData.contactRelation === status}
                  onChange={(e) => handleInputChange('contactRelation', e.target.value)}
                  className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700 capitalize">{status}</span>
              </label>
            ))}
          </div>
          {errors.contactRelation && <p className="text-red-500 text-sm mt-1">{errors.contactRelation}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ФИО контактного лица *
            </label>
            <input
              type="text"
              value={(formData.contactName ?? '')}
              onChange={(e) => handleInputChange('contactName', e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none ${errors.contactName ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-green-400'
                }`}
              placeholder="Введите ФИО"
            />
            {errors.contactName && <p className="text-red-500 text-sm mt-1">{errors.contactName}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Телефон контактного лица *
            </label>
            <input
              type="tel"
              value={(formData.contactPhone ?? '')}
              onChange={(e) => handleInputChange('contactPhone', e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none ${errors.contactPhone ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-green-400'
                }`}
              placeholder="+7 (999) 123-45-67"
            />
            {errors.contactPhone && <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>}
          </div>
        </div>
      </div>
    </div >
  );

  const renderEducation = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Уровень образования *
        </label>
        <select
          value={(formData.education ?? '')}
          onChange={(e) => handleInputChange('education', e.target.value)}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none ${errors.education ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-green-400'
            }`}
        >
          <option value="">Выберите уровень образования</option>
          <option value="высшее">Высшее</option>
          <option value="средняя специальность">Средняя специальность</option>
          <option value="профессиональное техническое">Профессиональное техническое</option>
          <option value="другое">Другое</option>
        </select>
        {errors.education && <p className="text-red-500 text-sm mt-1">{errors.education}</p>}
      </div>

      {formData.education === 'другое' && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Укажите уровень образования *
          </label>
          <input
            type="text"
            value={(formData.educationOther ?? '')}
            onChange={(e) => handleInputChange('educationOther', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none ${errors.educationOther ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-green-400'
              }`}
            placeholder="Введите уровень образования"
          />
          {errors.educationOther && <p className="text-red-500 text-sm mt-1">{errors.educationOther}</p>}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Учебное заведение *
        </label>
        <input
          type="text"
          value={(formData.institution ?? '')}
          onChange={(e) => handleInputChange('institution', e.target.value)}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none ${errors.institution ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-green-400'
            }`}
          placeholder="Название учебного заведения"
        />
        {errors.institution && <p className="text-red-500 text-sm mt-1">{errors.institution}</p>}
      </div>


      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Специальность *
        </label>
        <input
          type="text"
          value={(formData.specialty ?? '')}
          onChange={(e) => handleInputChange('specialty', e.target.value)}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none ${errors.specialty ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-green-400'
            }`}
          placeholder="Введите специальность"
        />
        {errors.specialty && <p className="text-red-500 text-sm mt-1">{errors.specialty}</p>}
      </div>
    </div>
  );

  const renderLanguages = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Знание языков</h3>
        <button
          type="button"
          onClick={addLanguage}
          className="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
        >
          <Plus size={16} className="mr-2" />
          Добавить язык
        </button>
      </div>

      {formData.languages.map((language, index) => (
        <div key={index} className="bg-gray-50 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-700">Язык {index + 1}</h4>
            {formData.languages.length > 1 && (
              <button
                type="button"
                onClick={() => removeLanguage(index)}
                className="text-red-500 hover:text-red-700 transition-colors duration-200"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Язык *
              </label>
              <select
                value={(language.language ?? '')}
                onChange={(e) => handleLanguageChange(index, 'language', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none ${errors[`language_${index}`] ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-green-400'
                  }`}
              >
                <option value="">Выберите язык</option>
                <option value="русский">Русский</option>
                <option value="английский">Английский</option>
                <option value="корейский">Корейский</option>
                <option value="арабский">Арабский</option>
                <option value="другое">Другое</option>
              </select>
              {errors[`language_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`language_${index}`]}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Уровень владения *
              </label>
              <select
                value={(language.level ?? '')}
                onChange={(e) => handleLanguageChange(index, 'level', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none ${errors[`level_${index}`] ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-green-400'
                  }`}
              >
                <option value="">Выберите уровень</option>
                <option value="отлично">Отлично</option>
                <option value="хорошо">Хорошо</option>
                <option value="удовлетворительно">Удовлетворительно</option>
                <option value="со словарем">Со словарем</option>
              </select>
              {errors[`level_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`level_${index}`]}</p>}
            </div>
          </div>

          {language.language === 'другое' && (
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Укажите язык *
              </label>
              <input
                type="text"
                value={(language.languageOther ?? '')}
                onChange={(e) => handleLanguageChange(index, 'languageOther', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none ${errors[`languageOther_${index}`] ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-green-400'
                  }`}
                placeholder="Введите название языка"
              />
              {errors[`languageOther_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`languageOther_${index}`]}</p>}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderWorkExperience = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Опыт работы</h3>
        <button
          type="button"
          onClick={addWorkExperience}
          className="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
        >
          <Plus size={16} className="mr-2" />
          Добавить опыт
        </button>
      </div>

      {formData.workExperience.map((experience, index) => (
        <div key={index} className="bg-gray-50 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-700">Опыт работы {index + 1}</h4>
            {formData.workExperience.length > 1 && (
              <button
                type="button"
                onClick={() => removeWorkExperience(index)}
                className="text-red-500 hover:text-red-700 transition-colors duration-200"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Компания *
                </label>
                <input
                  type="text"
                  value={(experience.company ?? '')}
                  onChange={(e) => handleWorkExperienceChange(index, 'company', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none ${errors[`company_${index}`] ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-green-400'
                    }`}
                  placeholder="Название компании"
                />
                {errors[`company_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`company_${index}`]}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Должность *
                </label>
                <input
                  type="text"
                  value={(experience.position ?? '')}
                  onChange={(e) => handleWorkExperienceChange(index, 'position', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none ${errors[`position_${index}`] ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-green-400'
                    }`}
                  placeholder="Ваша должность"
                />
                {errors[`position_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`position_${index}`]}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Дата начала работы *
                </label>

                <DatePicker
                  locale="ru"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none ${errors.birthDate ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-green-400'
                    }`}
                  placeholderText='мм/дд/гггг'
                  wrapperClassName='w-full'
                  selected={experience.startDate == '' ? null : new Date(experience.startDate)}
                  onChange={(date) => handleWorkExperienceChange(index, 'startDate', date?.toString() ?? '')}
                />

                {errors[`startDate_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`startDate_${index}`]}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Дата окончания работы *
                </label>
                <DatePicker
                  locale="ru"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none ${errors.birthDate ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-green-400'
                    }`}
                  placeholderText='мм/дд/гггг'
                  wrapperClassName='w-full'
                  selected={experience.endDate == '' ? null : new Date(experience.endDate)}
                  onChange={(date) => handleWorkExperienceChange(index, 'endDate', date?.toString() ?? '')}
                />
                {errors[`endDate_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`endDate_${index}`]}</p>}
              </div>
            </div>

          </div>
        </div>
      ))}
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-6">
      <div className="relative">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Предпочитаемая страна работы *
        </label>
        {/* Selected countries as chips */}
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedCountries.map((c) => (
            <span
              key={c}
              className="inline-flex items-center px-3 py-1 rounded-full border text-sm bg-green-50 text-green-700"
            >
              {c}
              <button
                type="button"
                onClick={() => removeCountry(c)}
                className="ml-2 leading-none focus:outline-none hover:opacity-70 cursor-pointer"
                aria-label={`Удалить ${c}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <input
          type="text"
          value={countryQuery}
          onChange={(e) => handleCountrySearch(e.target.value)}
          onFocus={() => {
            if (countryQuery.trim()) {
              const filtered = countries
                .filter(c => c.toLowerCase().includes(countryQuery.toLowerCase()))
                .slice(0, 10);
              setFilteredCountries(filtered);
              setShowCountryDropdown(true);
            }
          }}
          onBlur={() => setTimeout(() => setShowCountryDropdown(false), 200)}
          className="w-full px-4 py-3 border-2 rounded-xl /* keep your existing focus/invalid classes here */"
          placeholder={selectedCountries.length ? 'Добавьте ещё страны' : 'Начните вводить название страны'}
        />

        {errors.desiredCountry && (
          <p className="text-red-500 text-sm mt-1">{errors.desiredCountry}</p>
        )}

        {showCountryDropdown && filteredCountries.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
            {filteredCountries.map((country, index) => (
              <button
                key={index}
                type="button"
                onClick={() => selectCountry(country)}
                className="w-full px-4 py-3 text-left hover:bg-green-50 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
              >
                {country}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Предпочитаемый город*
          </label>
          <input
            type="text"
            value={(formData.desiredCity ?? '')}
            onChange={(e) => handleInputChange('desiredCity', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none ${errors.desiredCity ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-green-400'
              }`}
            placeholder="Москва, Новосибирск, Санкт-Питербург"
          />
          {errors.desiredCity && <p className="text-red-500 text-sm mt-1">{errors.desiredCity}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Дата готовности к выезду
          </label>
          <DatePicker
            locale="ru"
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none ${errors.dateOfReadiness ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-green-400'
              }`}
            placeholderText='мм/дд/гггг'
            wrapperClassName='w-full'
            selected={formData.dateOfReadiness == '' ? null : new Date(formData.dateOfReadiness)}
            onChange={(date) => handleInputChange('dateOfReadiness', date?.toString() ?? '')}
          />
          {errors.dateOfReadiness && <p className="text-red-500 text-sm mt-1">{errors.dateOfReadiness}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Предпочитаемое место работы
          </label>
          <input
            type="text"
            value={(formData.desiredWorkPlace ?? '')}
            onChange={(e) => handleInputChange('desiredWorkPlace', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none ${errors.desiredWorkPlace ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-green-400'
              }`}
            placeholder="Москва, Новосибирск, Санкт-Питербург"
          />
          {errors.desiredWorkPlace && <p className="text-red-500 text-sm mt-1">{errors.desiredWorkPlace}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Ожидаемая зарплата(в сомони) *
          </label>
          <input
            type="text"
            value={(formData.expectedSalary ?? '')}
            onChange={(e) => handleInputChange('expectedSalary', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none ${errors.expectedSalary ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-green-400'
              }`}
            placeholder="Например: 6000"
          />
          {errors.expectedSalary && <p className="text-red-500 text-sm mt-1">{errors.expectedSalary}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Наличие судимости
          </label>
          <select
            value={(formData.criminalRecord ?? '')}
            onChange={(e) => handleInputChange('criminalRecord', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none ${errors.gender ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-green-400'
              }`}
          >
            <option value="">Наличие судимости</option>
            <option value="да">Да</option>
            <option value="нет">Нет</option>
          </select>
          {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Дополнительная информация
        </label>
        <textarea
          value={(formData.additionalInfo ?? '')}
          onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none resize-none"
          rows={4}
          placeholder="Расскажите о себе, своих навыках, достижениях..."
        />
      </div>
    </div>
  );


  const renderDocument = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Фотография (изображение) *
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 ${errors.photoFile ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-green-400'
            }`}
        />
        {errors.photoFile && <p className="text-red-500 text-sm mt-1">{errors.photoFile}</p>}
        {photoFile && <p className="text-sm text-gray-600 mt-2">Выбран файл: {photoFile.name}</p>}
      </div>

      <div className="flex gap-x-2 w-full">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Фронтальная сторона паспорта (скан/фото) *
          </label>
          <input
            type="file"
            accept="image/png,image/jpeg,application/pdf"
            onChange={(e) => setFrontPassportFile(e.target.files?.[0] || null)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 ${errors.frontPassportFile ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-green-400'
              }`}
          />
          {errors.frontPassportFile && <p className="text-red-500 text-sm mt-1">{errors.frontPassportFile}</p>}
          {frontPassportFile && <p className="text-sm text-gray-600 mt-2">Выбран файл: {frontPassportFile.name}</p>}
        </div>
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Задняя сторона паспорта (скан/фото) *
          </label>
          <input
            type="file"
            accept="image/png,image/jpeg,application/pdf"
            onChange={(e) => setBackPassportFile(e.target.files?.[0] || null)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 ${errors.backPassportFile ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-green-400'
              }`}
          />
          {errors.backPassportFile && <p className="text-red-500 text-sm mt-1">{errors.backPassportFile}</p>}
          {backPassportFile && <p className="text-sm text-gray-600 mt-2">Выбран файл: {backPassportFile.name}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Диплом
        </label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setDiplomaFile(e.target.files?.[0] || null)}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 ${errors.diplomaFile ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-green-400'
            }`}
        />
        {errors.diplomaFile && <p className="text-red-500 text-sm mt-1">{errors.diplomaFile}</p>}
        {diplomaFile && <p className="text-sm text-gray-600 mt-2">Выбран файл: {diplomaFile.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Рекомендательное письмо *
        </label>
        <input
          type="file"
          accept="application/pdf,image/*"
          onChange={(e) => setRecommendationLetterFile(e.target.files?.[0] || null)}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 ${errors.recommendationLetterFile ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-green-400'
            }`}
        />
        {errors.recommendationLetterFile && <p className="text-red-500 text-sm mt-1">{errors.recommendationLetterFile}</p>}
        {recommendationLetterFile && <p className="text-sm text-gray-600 mt-2">Выбран файл: {recommendationLetterFile.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Сертификаты
        </label>
        <input
          type="file"
          accept="application/pdf"
          multiple
          onChange={(e) => setCertificates(Array.from(e.target.files || []))}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 ${errors.certificates ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-green-400'
            }`}
        />
        {errors.certificates && <p className="text-red-500 text-sm mt-1">{errors.certificates}</p>}
        {certificates && certificates?.length > 0 && (
          <ul className="mt-2 text-sm text-gray-600 list-disc pl-4">
            {certificates.map((file, idx) => (
              <li key={idx}>{file.name}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex gap-x-3 items-center">
        <input
          className="w-8 h-8"
          type="checkbox"
          onChange={(() => setAgreement(!agreement))}
          checked={agreement}
        />
        <span>
          Я согласен(на) на обработку персональных данных (ссылка на полный текст согласия) и ознакомлен(а) с [политикой конфиденциальности](ссылка на политику).
        </span>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return renderPersonalInfo();
      case 2: return renderContactInfo();
      case 3: return renderEducation();
      case 4: return renderLanguages();
      case 5: return renderWorkExperience();
      case 6: return renderPreferences();
      case 7: return renderDocument();
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Message */}
        {isSubmitted && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-2xl">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-4">
                <Save className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Заявка отправлена!
              </h2>
              <p className="text-gray-600 mb-6">
                Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.
              </p>
              <button
                onClick={() => {
                  router.push("/seeker")
                }}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
              >
                Закрыть
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Профиль соискателя работы
          </h1>
          <p className="text-gray-600">
            Заполните все разделы для создания полного профиля
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-xl shadow-green-100 mb-8 p-6 border border-green-100">
          <div className="flex flex-wrap justify-center gap-2">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isAccessible = step.id <= currentStep;

              return (
                <button
                  key={step.id}
                  onClick={() => handleTabClick(step.id)}
                  disabled={!isAccessible}
                  className={`flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-200'
                    : isAccessible
                      ? 'bg-white text-gray-700 hover:bg-green-50 border border-gray-200'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                    }`}
                >
                  <Icon size={18} className="mr-2" />
                  <span className="hidden sm:inline">{step.title}</span>
                  <span className="sm:hidden">{step.id}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-xl shadow-green-100 p-8 border border-green-100">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {steps.find(s => s.id === currentStep)?.title}
            </h2>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevStep}
              disabled={currentStep === 1}
              className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              <ChevronLeft size={20} className="mr-2" />
              Назад
            </button>

            {currentStep === steps.length ? (
              <button
                onClick={handleSubmit}
                disabled={!agreement}
                className={agreement
                  ? "flex items-center px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 transition-all duration-200"
                  : "flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 bg-gray-200 text-gray-700 hover:bg-gray-300"
                }
              >
                <Save size={20} className="mr-2" />
                Отправить заявку
              </button>
            ) : (
              <button
                onClick={handleNextStep}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 transition-all duration-200"
              >
                Далее
                <ChevronRight size={20} className="ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerForm;
