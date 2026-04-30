import { NextResponse } from "next/server";

export type ValidationErrors = Record<string, string>;

type RequiredFieldDefinition = {
  formKey: string;
  errorKey: string;
};

type JsonFieldParseOptions = {
  formKey: string;
  missingMessage: string;
  missingErrors: ValidationErrors;
  invalidMessage: string;
  invalidErrors: ValidationErrors;
};

const REQUIRED_FIELD_MESSAGE = "Обязательное поле";

export const defaultRequiredJobSeekerFields: ReadonlyArray<RequiredFieldDefinition> = [
  { formKey: "name", errorKey: "firstName" },
  { formKey: "surname", errorKey: "lastName" },
  { formKey: "tin", errorKey: "tin" },
  { formKey: "gender", errorKey: "gender" },
  { formKey: "passportCode", errorKey: "passportCode" },
  { formKey: "maritalStatus", errorKey: "maritalStatus" },
  { formKey: "phoneNumber", errorKey: "phone" },
  { formKey: "messengerNumber", errorKey: "messengerNumber" },
  { formKey: "email", errorKey: "email" },
  { formKey: "address", errorKey: "address" },
  { formKey: "addressOfBirth", errorKey: "addressOfBirth" },
  { formKey: "desiredCountry", errorKey: "desiredCountry" },
  { formKey: "desiredCity", errorKey: "desiredCity" },
  { formKey: "desiredSalary", errorKey: "expectedSalary" },
];

export const validationErrorResponse = (
  message: string,
  errors: ValidationErrors
) => {
  return NextResponse.json(
    { tag: "VALIDATION", message, errors },
    { status: 400 }
  );
};

export const hasValidationErrors = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};

export const collectRequiredFieldErrors = (
  formData: FormData,
  fields: ReadonlyArray<RequiredFieldDefinition> = defaultRequiredJobSeekerFields
): ValidationErrors => {
  const errors: ValidationErrors = {};

  for (const field of fields) {
    const value = formData.get(field.formKey);
    if (typeof value !== "string" || !value.trim()) {
      errors[field.errorKey] = REQUIRED_FIELD_MESSAGE;
    }
  }

  return errors;
};

export const getRequiredStringField = (
  formData: FormData,
  formKey: string
): string | null => {
  const value = formData.get(formKey);
  if (typeof value !== "string" || !value) {
    return null;
  }

  return value;
};

type ParsedJsonFieldResult<T> =
  | { data: T; response?: never }
  | { response: Response; data?: never };

export const parseJsonFormField = <T>(
  formData: FormData,
  options: JsonFieldParseOptions
): ParsedJsonFieldResult<T> => {
  const rawValue = getRequiredStringField(formData, options.formKey);

  if (!rawValue) {
    return {
      response: validationErrorResponse(options.missingMessage, options.missingErrors),
    };
  }

  try {
    return {
      data: JSON.parse(rawValue) as T,
    };
  } catch {
    return {
      response: validationErrorResponse(options.invalidMessage, options.invalidErrors),
    };
  }
};
