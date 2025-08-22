export interface JobSeekerProfile {
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
  recomendationLetters: File | null
  agreement: boolean
}

export interface AdditionalContactInfromation {
  fullname: string
  status: string
  otherStatus: string
  phoneNumber: string
}

export interface KnowledgeOfLanguages {
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
