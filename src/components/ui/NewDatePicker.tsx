"use client";

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  clampToMinMax,
  formatDisplay,
  fromStoredValue,
  toStoredValue,
  type StoredDateKind,
} from "../../../lib/date";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { AppLanguage } from "@/i18n/types";

type DateLike = string | Date | number | null;

export interface NewDatePickerProps<TValue = DateLike> {
  value: TValue | null;
  onChange: (value: TValue | null) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  error?: string | boolean;
  name?: string;
  required?: boolean;
  readOnly?: boolean;
  id?: string;
  className?: string;
  storageKind?: StoredDateKind;
}

// Every visible calendar string lives in these dictionaries, keyed by the
// active UI language — independent of the translations.ru.json catalog.
type CalendarLocale = {
  months: readonly string[];
  // Monday-first short weekday names
  weekdays: readonly string[];
  placeholder: string;
  clear: string;
  monthSelect: string;
  yearSelect: string;
  prevMonth: string;
  nextMonth: string;
  dialog: string;
};

const LOCALES: Record<AppLanguage, CalendarLocale> = {
  ru: {
    months: [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь",
    ],
    weekdays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
    placeholder: "Выберите дату",
    clear: "Очистить дату",
    monthSelect: "Выберите месяц",
    yearSelect: "Выберите год",
    prevMonth: "Предыдущий месяц",
    nextMonth: "Следующий месяц",
    dialog: "Выбор даты",
  },
  en: {
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    weekdays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    placeholder: "Select a date",
    clear: "Clear date",
    monthSelect: "Select month",
    yearSelect: "Select year",
    prevMonth: "Previous month",
    nextMonth: "Next month",
    dialog: "Date selection",
  },
  tj: {
    months: [
      "Январ",
      "Феврал",
      "Март",
      "Апрел",
      "Май",
      "Июн",
      "Июл",
      "Август",
      "Сентябр",
      "Октябр",
      "Ноябр",
      "Декабр",
    ],
    weekdays: ["Дш", "Сш", "Чш", "Пш", "Ҷм", "Шб", "Яш"],
    placeholder: "Санаро интихоб кунед",
    clear: "Тоза кардани сана",
    monthSelect: "Моҳро интихоб кунед",
    yearSelect: "Солро интихоб кунед",
    prevMonth: "Моҳи гузашта",
    nextMonth: "Моҳи оянда",
    dialog: "Интихоби сана",
  },
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// Always 6 rows x 7 columns, Monday-first, including outside days.
function buildCalendarGrid(year: number, month: number): Date[] {
  const firstOfMonth = new Date(year, month, 1);
  // getDay(): 0 = Sunday; shift so Monday = 0
  const leadingDays = (firstOfMonth.getDay() + 6) % 7;
  const gridStart = new Date(year, month, 1 - leadingDays);

  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    days.push(
      new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i)
    );
  }
  return days;
}

export default function NewDatePicker<TValue = DateLike>({
  value,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  placeholder,
  label,
  error,
  name,
  required = false,
  readOnly = false,
  id,
  className,
  storageKind = "auto",
}: NewDatePickerProps<TValue>) {
  const { language, translate } = useLanguage();
  const locale = LOCALES[language] ?? LOCALES.ru;
  const generatedId = useId();
  const fieldId = id ?? `new-date-picker-${generatedId}`;
  const errorId = `${fieldId}-error`;
  const popoverId = `${fieldId}-popover`;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const resolvedPlaceholder = placeholder ? translate(placeholder) : locale.placeholder;

  const selectedDate = useMemo(
    () => fromStoredValue(value, storageKind),
    [value, storageKind]
  );

  const currentYear = new Date().getFullYear();
  const minYear = minDate ? minDate.getFullYear() : currentYear - 100;
  const maxYear = maxDate ? maxDate.getFullYear() : currentYear + 20;

  const yearOptions = useMemo(() => {
    const years: number[] = [];
    for (let y = minYear; y <= maxYear; y++) years.push(y);
    return years;
  }, [minYear, maxYear]);

  const initialMonth = useMemo(() => {
    const fallback = clampToMinMax(new Date(), minDate, maxDate) ?? new Date();
    const source = selectedDate ?? fallback;
    return new Date(source.getFullYear(), source.getMonth(), 1);
  }, [maxDate, minDate, selectedDate]);

  const [viewMonth, setViewMonth] = useState<Date>(initialMonth);

  useEffect(() => {
    if (!isOpen) return;
    setViewMonth(initialMonth);
  }, [initialMonth, isOpen]);

  const closePopover = useCallback((focusTrigger: boolean) => {
    setIsOpen(false);
    if (focusTrigger) {
      requestAnimationFrame(() => {
        triggerRef.current?.focus();
      });
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!wrapperRef.current) return;
      if (wrapperRef.current.contains(event.target as Node)) return;
      closePopover(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      closePopover(true);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [closePopover, isOpen]);

  const minDay = useMemo(() => (minDate ? startOfDay(minDate) : null), [minDate]);
  const maxDay = useMemo(() => (maxDate ? startOfDay(maxDate) : null), [maxDate]);

  const isDayDisabled = useCallback(
    (day: Date) => {
      if (minDay && day < minDay) return true;
      if (maxDay && day > maxDay) return true;
      return false;
    },
    [maxDay, minDay]
  );

  const emitValue = useCallback(
    (nextDate: Date | null) => {
      const clamped = clampToMinMax(nextDate, minDate, maxDate);
      const nextValue = toStoredValue(clamped, value, storageKind) as TValue | null;
      onChange(nextValue);
    },
    [maxDate, minDate, onChange, storageKind, value]
  );

  const handleSelect = useCallback(
    (day: Date) => {
      emitValue(day);
      closePopover(true);
    },
    [closePopover, emitValue]
  );

  const handleClear = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      emitValue(null);
      closePopover(true);
    },
    [closePopover, emitValue]
  );

  const moveMonth = useCallback(
    (delta: number) => {
      setViewMonth((prev) => {
        const next = new Date(prev.getFullYear(), prev.getMonth() + delta, 1);
        const minBound = new Date(minYear, 0, 1);
        const maxBound = new Date(maxYear, 11, 1);
        if (next < minBound) return minBound;
        if (next > maxBound) return maxBound;
        return next;
      });
    },
    [maxYear, minYear]
  );

  const gridDays = useMemo(
    () => buildCalendarGrid(viewMonth.getFullYear(), viewMonth.getMonth()),
    [viewMonth]
  );

  const today = startOfDay(new Date());
  const hasValue = Boolean(selectedDate);
  const showClearButton = hasValue && !required && !disabled && !readOnly;
  const hasError = Boolean(error);

  const canGoPrev =
    viewMonth.getFullYear() > minYear || viewMonth.getMonth() > 0;
  const canGoNext =
    viewMonth.getFullYear() < maxYear || viewMonth.getMonth() < 11;

  return (
    <div ref={wrapperRef} className="w-full">
      {label ? (
        <label htmlFor={fieldId} className="mb-2 block text-sm font-semibold text-gray-700">
          {translate(label)}
          {required ? <span className="ml-1 text-red-500">*</span> : null}
        </label>
      ) : null}

      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          id={fieldId}
          name={name}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls={popoverId}
          aria-invalid={hasError}
          aria-describedby={typeof error === "string" ? errorId : undefined}
          disabled={disabled}
          onClick={() => {
            if (readOnly || disabled) return;
            setIsOpen((prev) => !prev);
          }}
          onKeyDown={(event) => {
            if (readOnly || disabled) return;
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setIsOpen(true);
            }
          }}
          className={cn(
            "flex w-full items-center rounded-xl border-2 bg-white px-4 py-3 text-left transition-all duration-200 outline-none",
            "focus:ring-4 focus:ring-green-100",
            hasError ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-green-400",
            showClearButton ? "pr-16" : "pr-12",
            disabled ? "cursor-not-allowed bg-gray-100 text-gray-400" : "cursor-pointer",
            className
          )}
        >
          <span className={cn("block truncate text-sm", hasValue ? "text-gray-900" : "text-gray-400")}>
            {hasValue ? formatDisplay(selectedDate) : resolvedPlaceholder}
          </span>
        </button>

        {showClearButton ? (
          <button
            type="button"
            aria-label={locale.clear}
            onClick={handleClear}
            className="absolute right-10 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-200"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}

        {isOpen && !readOnly && !disabled ? (
          <div
            id={popoverId}
            role="dialog"
            aria-label={locale.dialog}
            className="absolute left-0 top-[calc(100%+8px)] z-50 w-fit max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-3 shadow-xl"
          >
            <div className="mb-2 flex items-center justify-between gap-1">
              <button
                type="button"
                aria-label={locale.prevMonth}
                disabled={!canGoPrev}
                onClick={() => moveMonth(-1)}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200 disabled:cursor-not-allowed disabled:text-gray-300"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2">
                <select
                  aria-label={locale.monthSelect}
                  value={viewMonth.getMonth()}
                  onChange={(event) =>
                    setViewMonth(
                      new Date(viewMonth.getFullYear(), Number(event.target.value), 1)
                    )
                  }
                  className="h-9 rounded-lg border border-gray-200 bg-white px-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-200"
                >
                  {locale.months.map((monthName, index) => (
                    <option key={monthName} value={index}>
                      {monthName}
                    </option>
                  ))}
                </select>
                <select
                  aria-label={locale.yearSelect}
                  value={viewMonth.getFullYear()}
                  onChange={(event) =>
                    setViewMonth(new Date(Number(event.target.value), viewMonth.getMonth(), 1))
                  }
                  className="h-9 rounded-lg border border-gray-200 bg-white px-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-200"
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                aria-label={locale.nextMonth}
                disabled={!canGoNext}
                onClick={() => moveMonth(1)}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200 disabled:cursor-not-allowed disabled:text-gray-300"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-7">
              {locale.weekdays.map((weekday) => (
                <div
                  key={weekday}
                  className="h-8 w-9 text-center text-xs font-medium leading-8 text-gray-500"
                >
                  {weekday}
                </div>
              ))}
            </div>

            <div className="space-y-1">
              {Array.from({ length: 6 }, (_, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7">
                  {gridDays
                    .slice(weekIndex * 7, weekIndex * 7 + 7)
                    .map((day) => {
                      const isOutside = day.getMonth() !== viewMonth.getMonth();
                      const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
                      const isToday = isSameDay(day, today);
                      const dayDisabled = isDayDisabled(day);

                      return (
                        <button
                          key={day.toISOString()}
                          type="button"
                          disabled={dayDisabled}
                          aria-pressed={isSelected}
                          onClick={() => handleSelect(day)}
                          className={cn(
                            "h-9 w-9 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-300",
                            isSelected
                              ? "bg-green-600 text-white hover:bg-green-600"
                              : "text-gray-700 hover:bg-green-50",
                            !isSelected && isOutside && "text-gray-300",
                            isToday && !isSelected && "ring-1 ring-green-500",
                            dayDisabled && "cursor-not-allowed text-gray-300 hover:bg-transparent"
                          )}
                        >
                          {day.getDate()}
                        </button>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {typeof error === "string" ? (
        <p id={errorId} className="mt-1 text-sm text-red-500">
          {translate(error)}
        </p>
      ) : null}
    </div>
  );
}
