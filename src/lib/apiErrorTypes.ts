export type ApiErrorTag = "VALIDATION" | "INTERNAL";

export type ApiValidationErrors = Record<string, string>;

export interface ApiErrorResponse {
  tag?: ApiErrorTag;
  message?: string;
  errors?: unknown;
  requestId?: string;
}

export const toValidationErrors = (value: unknown): ApiValidationErrors => {
  if (!value || typeof value !== "object") {
    return {};
  }

  const result: ApiValidationErrors = {};
  for (const [key, raw] of Object.entries(value)) {
    if (typeof raw === "string" && raw.trim()) {
      result[key] = raw;
    }
  }

  return result;
};
