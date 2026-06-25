export type OrganizationInput = {
  nameRu: string;
  nameEn: string;
  nameTj: string;
  phone: string;
  email: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const REQUIRED_FIELDS: Array<keyof OrganizationInput> = [
  "nameRu",
  "nameEn",
  "nameTj",
  "phone",
  "email",
];

export function parseOrganizationInput(
  body: unknown
): { data: OrganizationInput } | { errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const source = (body ?? {}) as Record<string, unknown>;
  const data = {} as OrganizationInput;

  for (const field of REQUIRED_FIELDS) {
    const raw = source[field];
    const value = typeof raw === "string" ? raw.trim() : "";
    if (!value) {
      errors[field] = "Обязательное поле";
      continue;
    }
    data[field] = value;
  }

  if (!errors.email && !EMAIL_REGEX.test(data.email)) {
    errors.email = "Введите корректный email";
  }

  return Object.keys(errors).length > 0 ? { errors } : { data };
}
