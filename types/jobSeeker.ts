export interface JobSeekerFromData {
  // Личная информация
  lastName: string;
  firstName: string;
  middleName: string;
  birthDate: string;
  gender: string;
  passportCode: string;
  maritalStatus: string;
  tin: string

  // Контактная информация
  phone: string;
  email: string;
  address: string;
  additionalContact: boolean;
  contactRelation: string;
  contactRelationOther: string;
  contactName: string;
  contactPhone: string;

  // Образование
  education: string;
  educationOther: string;
  institution: string;
  specialty: string;

  // Языки
  languages: Array<LanguagesForm>;

  // Опыт работы
  workExperience: Array<WorkExperienceForm>;

  // Предпочтения
  preferredCountry: string;
  expectedSalary: string;
  additionalInfo: string;
  criminalRecord: string
  dateOfReadiness: string
}

export interface LanguagesForm {
  language: string
  languageOther: string
  level: string
}

export interface WorkExperienceForm {
  company: string
  position: string
  startDate: string
  endDate: string
}
