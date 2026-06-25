"use client";

import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  BadgePlus,
  Building2,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

type Organization = {
  id: number;
  nameRu: string;
  nameEn: string;
  nameTj: string;
  phone: string;
  email: string;
  position: number;
};

type FormValues = {
  nameRu: string;
  nameEn: string;
  nameTj: string;
  phone: string;
  email: string;
};

const EMPTY_FORM: FormValues = {
  nameRu: "",
  nameEn: "",
  nameTj: "",
  phone: "",
  email: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FIELD_LABELS: Record<keyof FormValues, string> = {
  nameRu: "Название (русский)",
  nameEn: "Название (английский)",
  nameTj: "Название (таджикский)",
  phone: "Телефон",
  email: "Email",
};

export default function SupportOrganizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formValues, setFormValues] = useState<FormValues>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isReordering, setIsReordering] = useState(false);

  const loadOrganizations = useCallback(async () => {
    try {
      setLoadError(null);
      const response = await axios.get("/api/dashboard/organizations");
      setOrganizations(response.data.data);
    } catch {
      setLoadError("Не удалось загрузить список организаций");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrganizations();
  }, [loadOrganizations]);

  const formTitle = useMemo(
    () => (editingId === null ? "Добавить организацию" : "Редактировать организацию"),
    [editingId]
  );

  const openAddForm = () => {
    setEditingId(null);
    setFormValues(EMPTY_FORM);
    setFormErrors({});
    setIsFormOpen(true);
  };

  const openEditForm = (organization: Organization) => {
    setEditingId(organization.id);
    setFormValues({
      nameRu: organization.nameRu,
      nameEn: organization.nameEn,
      nameTj: organization.nameTj,
      phone: organization.phone,
      email: organization.email,
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormValues(EMPTY_FORM);
    setFormErrors({});
  };

  const validate = (): boolean => {
    const errors: Partial<Record<keyof FormValues, string>> = {};
    (Object.keys(FIELD_LABELS) as Array<keyof FormValues>).forEach((field) => {
      if (!formValues[field].trim()) {
        errors[field] = "Обязательное поле";
      }
    });
    if (!errors.email && !EMAIL_REGEX.test(formValues.email.trim())) {
      errors.email = "Введите корректный email";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      if (editingId === null) {
        await axios.post("/api/dashboard/organizations", formValues);
      } else {
        await axios.put(`/api/dashboard/organizations/${editingId}`, formValues);
      }
      closeForm();
      await loadOrganizations();
    } catch {
      alert("Не удалось сохранить организацию. Попробуйте снова.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (organization: Organization) => {
    const confirmed = window.confirm(
      `Удалить организацию «${organization.nameRu}»?`
    );
    if (!confirmed) return;

    try {
      await axios.delete(`/api/dashboard/organizations/${organization.id}`);
      await loadOrganizations();
    } catch {
      alert("Не удалось удалить организацию. Попробуйте снова.");
    }
  };

  const handleMove = async (index: number, delta: -1 | 1) => {
    const targetIndex = index + delta;
    if (targetIndex < 0 || targetIndex >= organizations.length) return;

    const reordered = [...organizations];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    setOrganizations(reordered);
    setIsReordering(true);
    try {
      const response = await axios.post("/api/dashboard/organizations/reorder", {
        ids: reordered.map((organization) => organization.id),
      });
      setOrganizations(response.data.data);
    } catch {
      alert("Не удалось изменить порядок. Попробуйте снова.");
      await loadOrganizations();
    } finally {
      setIsReordering(false);
    }
  };

  const updateField = (field: keyof FormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <main className="p-3 sm:p-6">
      <section className="mb-5 rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur md:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center gap-2 text-sm text-gray-700">
            <Building2 className="h-4 w-4 text-[#39B36E]" />
            Организации поддержки: <b className="ml-1">{organizations.length}</b>
          </span>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-4 py-2 font-medium text-white hover:opacity-95"
            onClick={openAddForm}
          >
            <BadgePlus className="h-4 w-4" />
            Добавить организацию
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Организации из этого списка отображаются соискателям в анкете и после её отправки.
          Порядок в списке соответствует порядку отображения.
        </p>
      </section>

      {isFormOpen ? (
        <section className="mb-5 rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur md:p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">{formTitle}</h2>
            <button
              type="button"
              aria-label="Закрыть"
              onClick={closeForm}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {(["nameRu", "nameEn", "nameTj"] as const).map((field) => (
              <div key={field}>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  {FIELD_LABELS[field]}
                  <span className="ml-1 text-red-500">*</span>
                </label>
                <textarea
                  value={formValues[field]}
                  onChange={(event) => updateField(field, event.target.value)}
                  rows={2}
                  className={`w-full rounded-xl border-2 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:ring-4 focus:ring-green-100 ${
                    formErrors[field]
                      ? "border-red-300 focus:border-red-400"
                      : "border-gray-200 focus:border-green-400"
                  }`}
                />
                {formErrors[field] ? (
                  <p className="mt-1 text-sm text-red-500">{formErrors[field]}</p>
                ) : null}
              </div>
            ))}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {(["phone", "email"] as const).map((field) => (
                <div key={field}>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">
                    {FIELD_LABELS[field]}
                    <span className="ml-1 text-red-500">*</span>
                  </label>
                  <input
                    type={field === "email" ? "email" : "tel"}
                    value={formValues[field]}
                    onChange={(event) => updateField(field, event.target.value)}
                    className={`w-full rounded-xl border-2 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:ring-4 focus:ring-green-100 ${
                      formErrors[field]
                        ? "border-red-300 focus:border-red-400"
                        : "border-gray-200 focus:border-green-400"
                    }`}
                  />
                  {formErrors[field] ? (
                    <p className="mt-1 text-sm text-red-500">{formErrors[field]}</p>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#39B36E] px-5 py-2 font-medium text-white hover:opacity-95 disabled:opacity-60"
              >
                {isSaving ? "Сохранение..." : "Сохранить"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-2 font-medium text-gray-700 hover:bg-gray-50"
              >
                Отмена
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <section className="rounded-2xl bg-white/90 shadow-sm ring-1 ring-black/5 backdrop-blur">
        {isLoading ? (
          <div className="flex items-center justify-center gap-3 p-10 text-gray-600">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#39B36E] border-t-transparent"></div>
            Загрузка...
          </div>
        ) : loadError ? (
          <div className="p-10 text-center text-red-600">{loadError}</div>
        ) : organizations.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            Организации ещё не добавлены
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="border-b border-gray-200 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">№</th>
                  <th className="px-4 py-3">Название</th>
                  <th className="px-4 py-3">Телефон</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3 text-right">Действия</th>
                </tr>
              </thead>
              <tbody>
                {organizations.map((organization, index) => (
                  <tr key={organization.id} className="border-b border-gray-100 last:border-b-0">
                    <td className="px-4 py-3 align-top">{index + 1}</td>
                    <td className="max-w-md px-4 py-3 align-top">
                      <p className="font-medium text-gray-800">{organization.nameRu}</p>
                      <p className="mt-0.5 text-xs text-gray-500">EN: {organization.nameEn}</p>
                      <p className="text-xs text-gray-500">TJ: {organization.nameTj}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 align-top">{organization.phone}</td>
                    <td className="whitespace-nowrap px-4 py-3 align-top">{organization.email}</td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          aria-label="Переместить вверх"
                          disabled={index === 0 || isReordering}
                          onClick={() => handleMove(index, -1)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-300"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="Переместить вниз"
                          disabled={index === organizations.length - 1 || isReordering}
                          onClick={() => handleMove(index, 1)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-300"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="Редактировать"
                          onClick={() => openEditForm(organization)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-[#2563eb] hover:bg-blue-50"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="Удалить"
                          onClick={() => handleDelete(organization)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
