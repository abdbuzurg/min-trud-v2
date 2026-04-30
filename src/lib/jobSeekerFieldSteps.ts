import type { ApiValidationErrors } from "./apiErrorTypes";

const fieldStepMap: Record<string, number> = {
  lastName: 1,
  firstName: 1,
  middleName: 1,
  birthDate: 1,
  gender: 1,
  passportCode: 1,
  maritalStatus: 1,
  tin: 1,
  phone: 2,
  messengerNumber: 2,
  email: 2,
  address: 2,
  addressOfBirth: 2,
  contactRelation: 2,
  contactRelationOther: 2,
  contactName: 2,
  contactPhone: 2,
  desiredCountry: 6,
  desiredCity: 6,
  dateOfReadiness: 6,
  expectedSalary: 6,
  photoFile: 7,
};

const prefixedStepMap: Array<{ prefix: string; step: number }> = [
  { prefix: "education_", step: 3 },
  { prefix: "educationOther_", step: 3 },
  { prefix: "institution_", step: 3 },
  { prefix: "specialty_", step: 3 },
  { prefix: "language_", step: 4 },
  { prefix: "languageOther_", step: 4 },
  { prefix: "level_", step: 4 },
  { prefix: "company_", step: 5 },
  { prefix: "position_", step: 5 },
  { prefix: "startDate_", step: 5 },
];

export const getStepForFieldError = (field: string): number | null => {
  if (fieldStepMap[field]) {
    return fieldStepMap[field];
  }

  const match = prefixedStepMap.find(({ prefix }) => field.startsWith(prefix));
  if (match) {
    return match.step;
  }

  return null;
};

export const getFirstValidationErrorStep = (
  errors: ApiValidationErrors
): number | null => {
  for (const field of Object.keys(errors)) {
    const step = getStepForFieldError(field);
    if (step !== null) {
      return step;
    }
  }

  return null;
};
