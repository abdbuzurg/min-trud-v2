import { format } from "date-fns";
import { ru } from "date-fns/locale";

const DATE_ONLY_ISO_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const ISO_DATE_TIME_REGEX = /^\d{4}-\d{2}-\d{2}T/;
const RU_DATE_REGEX = /^\d{2}\.\d{2}\.\d{4}$/;
const JS_DATE_STRING_REGEX = /^[A-Za-z]{3}\s[A-Za-z]{3}\s\d{1,2}\s\d{4}/;

export type StoredDateKind =
  | "auto"
  | "date-object"
  | "timestamp"
  | "date-only-iso"
  | "iso-datetime"
  | "js-date-string"
  | "russian-date"
  | "string";

function isValidDate(value: Date | null | undefined): value is Date {
  if (!value) return false;
  return !Number.isNaN(value.getTime());
}

function parseDateOnlyIso(value: string): Date | null {
  if (!DATE_ONLY_ISO_REGEX.test(value)) return null;

  const [yearRaw, monthRaw, dayRaw] = value.split("-");
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return null;

  const result = new Date(year, month - 1, day);
  if (
    result.getFullYear() !== year ||
    result.getMonth() !== month - 1 ||
    result.getDate() !== day
  ) {
    return null;
  }

  return result;
}

function parseRuDate(value: string): Date | null {
  if (!RU_DATE_REGEX.test(value)) return null;

  const [dayRaw, monthRaw, yearRaw] = value.split(".");
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return null;

  const result = new Date(year, month - 1, day);
  if (
    result.getFullYear() !== year ||
    result.getMonth() !== month - 1 ||
    result.getDate() !== day
  ) {
    return null;
  }

  return result;
}

function formatDateOnlyIso(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function detectStoredDateKind(value: unknown): StoredDateKind {
  if (value instanceof Date) return "date-object";
  if (typeof value === "number") return "timestamp";

  if (typeof value === "string") {
    const normalized = value.trim();
    if (!normalized) return "string";
    if (DATE_ONLY_ISO_REGEX.test(normalized)) return "date-only-iso";
    if (ISO_DATE_TIME_REGEX.test(normalized)) return "iso-datetime";
    if (RU_DATE_REGEX.test(normalized)) return "russian-date";
    if (JS_DATE_STRING_REGEX.test(normalized)) return "js-date-string";

    const parsed = new Date(normalized);
    if (isValidDate(parsed)) return "js-date-string";
    return "string";
  }

  return "auto";
}

export function fromStoredValue(
  value: unknown,
  kind: StoredDateKind = "auto"
): Date | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const resolvedKind = kind === "auto" ? detectStoredDateKind(value) : kind;

  if (resolvedKind === "date-object" && value instanceof Date) {
    return isValidDate(value) ? new Date(value) : null;
  }

  if (resolvedKind === "timestamp" && typeof value === "number") {
    const parsed = new Date(value);
    return isValidDate(parsed) ? parsed : null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  if (!normalized) return null;

  if (resolvedKind === "date-only-iso") {
    return parseDateOnlyIso(normalized);
  }

  if (resolvedKind === "russian-date") {
    return parseRuDate(normalized);
  }

  const parsed = new Date(normalized);
  return isValidDate(parsed) ? parsed : null;
}

export function parseInput(value: unknown): Date | null {
  return fromStoredValue(value);
}

export function toStoredValue(
  date: Date | null,
  sourceValue?: unknown,
  kind: StoredDateKind = "auto"
): string | Date | number | null {
  const resolvedKind =
    kind === "auto"
      ? detectStoredDateKind(sourceValue)
      : kind;

  if (!date || !isValidDate(date)) {
    if (
      resolvedKind === "date-only-iso" ||
      resolvedKind === "iso-datetime" ||
      resolvedKind === "js-date-string" ||
      resolvedKind === "russian-date" ||
      resolvedKind === "string"
    ) {
      return "";
    }
    return null;
  }

  if (resolvedKind === "date-object") {
    return new Date(date);
  }

  if (resolvedKind === "timestamp") {
    return date.getTime();
  }

  if (resolvedKind === "date-only-iso") {
    return formatDateOnlyIso(date);
  }

  if (resolvedKind === "iso-datetime") {
    return date.toISOString();
  }

  if (resolvedKind === "russian-date") {
    return format(date, "dd.MM.yyyy", { locale: ru });
  }

  return date.toString();
}

export function formatDisplay(date: Date | null): string {
  if (!isValidDate(date)) return "";
  return format(date, "dd.MM.yyyy", { locale: ru });
}

export function clampToMinMax(
  date: Date | null,
  min?: Date,
  max?: Date
): Date | null {
  if (!isValidDate(date)) return null;

  const minTime = isValidDate(min) ? min.getTime() : null;
  const maxTime = isValidDate(max) ? max.getTime() : null;
  const value = date.getTime();

  if (minTime !== null && value < minTime) return new Date(minTime);
  if (maxTime !== null && value > maxTime) return new Date(maxTime);
  return date;
}
