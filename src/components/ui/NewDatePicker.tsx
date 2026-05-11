"use client";

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { startOfMonth } from "date-fns";
import { DayPicker, type ClassNames, type Matcher } from "react-day-picker";
import {
  clampToMinMax,
  formatDisplay,
  fromStoredValue,
  toStoredValue,
  type StoredDateKind,
} from "../../../lib/date";
import { useLanguage } from "@/i18n/LanguageProvider";

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

const RU_MONTHS = [
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
] as const;

const RU_WEEKDAYS: Record<number, string> = {
  0: "Вс",
  1: "Пн",
  2: "Вт",
  3: "Ср",
  4: "Чт",
  5: "Пт",
  6: "Сб",
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const dayPickerClassNames: Partial<ClassNames> = {
  root: "w-fit",
  month: "w-fit grid grid-cols-[auto_1fr_auto] items-center gap-y-2",
  month_caption: "col-start-2 row-start-1 mb-0 flex items-center justify-center gap-2",
  caption_label: "hidden",
  dropdowns: "flex items-center gap-2",
  dropdown_root: "relative",
  dropdown:
    "h-9 rounded-lg border border-gray-200 bg-white px-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-200",
  nav: "flex items-center gap-1",
  button_previous:
    "col-start-1 row-start-1 "+
    "inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200",
  button_next:
    "col-start-3 row-start-1 "+
    "inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200",
  month_grid: "col-span-3 row-start-2",
  weekdays: "grid grid-cols-7",
  weekday: "text-center text-xs font-medium text-gray-500",
  weeks: "space-y-1",
  week: "grid grid-cols-7",
  day: "h-9 w-9 p-0 text-center",
  day_button:
    "h-9 w-9 rounded-md text-sm text-gray-700 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-300",
  selected: "bg-green-600 text-white hover:bg-green-600",
  today: "ring-1 ring-green-500",
  outside: "text-gray-300",
  disabled: "cursor-not-allowed text-gray-300",
};

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
  const { translate } = useLanguage();
  const generatedId = useId();
  const fieldId = id ?? `new-date-picker-${generatedId}`;
  const errorId = `${fieldId}-error`;
  const popoverId = `${fieldId}-popover`;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const resolvedPlaceholder = placeholder ?? translate("Выберите дату");

  const selectedDate = useMemo(
    () => fromStoredValue(value, storageKind),
    [value, storageKind]
  );

  const currentYear = new Date().getFullYear();
  const rangeStart = useMemo(() => {
    const defaultStart = new Date(currentYear - 100, 0, 1);
    if (!minDate) return defaultStart;
    return new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  }, [currentYear, minDate]);
  const rangeEnd = useMemo(() => {
    const defaultEnd = new Date(currentYear + 20, 11, 1);
    if (!maxDate) return defaultEnd;
    return new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
  }, [currentYear, maxDate]);

  const initialMonth = useMemo(() => {
    const fallback = clampToMinMax(new Date(), minDate, maxDate) ?? new Date();
    const monthSource = selectedDate ?? fallback;
    return startOfMonth(monthSource);
  }, [maxDate, minDate, selectedDate]);

  const [month, setMonth] = useState<Date>(initialMonth);

  useEffect(() => {
    if (!isOpen) return;
    setMonth(initialMonth);
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

  const disabledDays = useMemo<Matcher[] | undefined>(() => {
    const matchers: Matcher[] = [];
    if (minDate) matchers.push({ before: minDate });
    if (maxDate) matchers.push({ after: maxDate });
    return matchers.length ? matchers : undefined;
  }, [maxDate, minDate]);

  const emitValue = useCallback(
    (nextDate: Date | null) => {
      const clamped = clampToMinMax(nextDate, minDate, maxDate);
      const nextValue = toStoredValue(
        clamped,
        value,
        storageKind
      ) as TValue | null;
      onChange(nextValue);
    },
    [maxDate, minDate, onChange, storageKind, value]
  );

  const handleSelect = useCallback(
    (nextDay: Date | undefined) => {
      if (!nextDay) return;
      emitValue(nextDay);
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

  const hasValue = Boolean(selectedDate);
  const showClearButton = hasValue && !required && !disabled && !readOnly;
  const hasError = Boolean(error);

  return (
    <div ref={wrapperRef} className="w-full">
      {label ? (
        <label htmlFor={fieldId} className="mb-2 block text-sm font-semibold text-gray-700">
          {label}
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
            aria-label={translate("Очистить дату")}
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
            aria-label={translate("Выбор даты")}
            className="absolute left-0 top-[calc(100%+8px)] z-50 w-fit max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-3 shadow-xl"
          >
            <DayPicker
              mode="single"
              weekStartsOn={1}
              captionLayout="dropdown"
              navLayout="around"
              startMonth={rangeStart <= rangeEnd ? rangeStart : rangeEnd}
              endMonth={rangeStart <= rangeEnd ? rangeEnd : rangeStart}
              month={month}
              onMonthChange={setMonth}
              selected={selectedDate ?? undefined}
              onSelect={handleSelect}
              disabled={disabledDays}
              showOutsideDays
              fixedWeeks
              classNames={dayPickerClassNames}
              formatters={{
                formatCaption: (date) => `${translate(RU_MONTHS[date.getMonth()])} ${date.getFullYear()}`,
                formatMonthDropdown: (date) => translate(RU_MONTHS[date.getMonth()]),
                formatWeekdayName: (date) => translate(RU_WEEKDAYS[date.getDay()]),
              }}
              labels={{
                labelMonthDropdown: () => translate("Выберите месяц"),
                labelYearDropdown: () => translate("Выберите год"),
                labelNext: () => translate("Следующий месяц"),
                labelPrevious: () => translate("Предыдущий месяц"),
              }}
            />
          </div>
        ) : null}
      </div>

      {typeof error === "string" ? (
        <p id={errorId} className="mt-1 text-sm text-red-500">
          {error}
        </p>
      ) : null}
    </div>
  );
}
