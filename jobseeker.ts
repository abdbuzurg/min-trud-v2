export interface JobSeekerProfile {
  name: string
  surname: string
  middlename: string
  dateOfBirth: Date | null
  tin: string
  gender: string
  email: string
  passportCode: string
  phoneNumber: string
  currentAddress: string
  additionalContacts: AdditionalContactInfromation[]
  knowledgeOfLanguages: KnowledgeOfLanguages[]
  education: string
  specialization: string
  workExperience: WorkExperience[]
  desiredSalary: number
  dateOfReadiness: Date | null
  desiredCountry: string
  criminalRecord: string
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

export interface WorkExperience {
  jobTitle: string
  workplace: string
  dateStart: Date | null
  dateEnd: Date | null
}
