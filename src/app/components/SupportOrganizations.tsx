"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { LifeBuoy, Mail, Phone, X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { AppLanguage } from "@/i18n/types";

export type SupportOrganization = {
  id: number;
  nameRu: string;
  nameEn: string;
  nameTj: string;
  phone: string;
  email: string;
};

export function useSupportOrganizations(): SupportOrganization[] {
  const [organizations, setOrganizations] = useState<SupportOrganization[]>([]);

  useEffect(() => {
    let isMounted = true;
    axios
      .get("/api/organizations")
      .then((response) => {
        if (isMounted && Array.isArray(response.data?.data)) {
          setOrganizations(response.data.data);
        }
      })
      .catch(() => {
        // The support panel is auxiliary: a failed load simply hides it.
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return organizations;
}

function organizationName(
  organization: SupportOrganization,
  language: AppLanguage
): string {
  if (language === "en") return organization.nameEn || organization.nameRu;
  if (language === "tj") return organization.nameTj || organization.nameRu;
  return organization.nameRu;
}

function OrganizationItems({
  organizations,
  language,
}: {
  organizations: SupportOrganization[];
  language: AppLanguage;
}) {
  return (
    <ul className="space-y-4">
      {organizations.map((organization) => (
        <li
          key={organization.id}
          className="rounded-xl border border-green-100 bg-green-50/60 p-3 text-sm"
        >
          <p className="font-medium text-gray-800">
            {organizationName(organization, language)}
          </p>
          <p className="mt-1.5 flex items-center gap-1.5 text-gray-600">
            <Phone className="h-3.5 w-3.5 shrink-0 text-green-600" />
            <a href={`tel:${organization.phone}`} className="hover:text-green-700">
              {organization.phone}
            </a>
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-gray-600">
            <Mail className="h-3.5 w-3.5 shrink-0 text-green-600" />
            <a href={`mailto:${organization.email}`} className="break-all hover:text-green-700">
              {organization.email}
            </a>
          </p>
        </li>
      ))}
    </ul>
  );
}

export function OrganizationContactsList({
  organizations,
}: {
  organizations: SupportOrganization[];
}) {
  const { language, translate } = useLanguage();

  if (organizations.length === 0) return null;

  return (
    <div className="mb-6 rounded-xl bg-green-50 p-4 text-left">
      <p className="mb-3 text-sm font-semibold text-gray-800">
        {translate("Организации поддержки")}
      </p>
      <ul className="max-h-44 space-y-3 overflow-y-auto pr-1">
        {organizations.map((organization) => (
          <li key={organization.id} className="text-sm">
            <p className="font-medium text-gray-800">
              {organizationName(organization, language)}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-gray-600">
              <Phone className="h-3.5 w-3.5 shrink-0 text-green-600" />
              <a href={`tel:${organization.phone}`} className="hover:text-green-700">
                {organization.phone}
              </a>
            </p>
            <p className="flex items-center gap-1.5 text-gray-600">
              <Mail className="h-3.5 w-3.5 shrink-0 text-green-600" />
              <a href={`mailto:${organization.email}`} className="break-all hover:text-green-700">
                {organization.email}
              </a>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Renders two variants:
//  - xl and up: a sticky column placed by the parent right next to the form card;
//  - below xl: a floating corner button opening a bottom sheet.
export function SupportOrganizationsPanel({
  organizations,
}: {
  organizations: SupportOrganization[];
}) {
  const { language, translate } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  // The side card hangs off the form's right edge without affecting the
  // form's centered layout, so it only fits from the 2xl breakpoint.
  useEffect(() => {
    if (window.matchMedia("(min-width: 1536px)").matches) {
      setIsOpen(true);
    }
  }, []);

  if (organizations.length === 0) return null;

  const panelHeader = (
    <div className="mb-3 flex items-center justify-between">
      <p className="flex items-center gap-2 font-semibold text-gray-800">
        <LifeBuoy className="h-5 w-5 text-green-600" />
        {translate("Поддержка")}
      </p>
      <button
        type="button"
        aria-label={translate("Закрыть")}
        onClick={() => setIsOpen(false)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop: card hanging off the form's right edge (absolute, so the
          centered form layout is untouched), sticky while scrolling */}
      <div className="pointer-events-none absolute left-full top-0 ml-4 hidden h-full w-72 2xl:block">
        <div className="pointer-events-auto sticky top-8">
          {isOpen ? (
            <aside
              role="complementary"
              aria-label={translate("Поддержка")}
              className="max-h-[80vh] overflow-y-auto rounded-2xl border border-green-100 bg-white p-4 shadow-xl shadow-green-100"
            >
              {panelHeader}
              <OrganizationItems organizations={organizations} language={language} />
            </aside>
          ) : (
            <button
              type="button"
              aria-label={translate("Поддержка")}
              onClick={() => setIsOpen(true)}
              className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-200 transition-all duration-200 hover:from-green-600 hover:to-emerald-700 hover:shadow-xl"
            >
              <LifeBuoy className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>

      {/* Below 2xl: floating button and bottom sheet */}
      <div className="2xl:hidden">
        {isOpen ? (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/40"
              onClick={() => setIsOpen(false)}
            />
            <aside
              role="complementary"
              aria-label={translate("Поддержка")}
              className="fixed inset-x-0 bottom-0 z-40 max-h-[70vh] overflow-y-auto rounded-t-2xl border border-green-100 bg-white p-4 shadow-2xl"
            >
              {panelHeader}
              <OrganizationItems organizations={organizations} language={language} />
            </aside>
          </>
        ) : (
          <button
            type="button"
            aria-label={translate("Поддержка")}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-4 right-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-200 transition-all duration-200 hover:from-green-600 hover:to-emerald-700 hover:shadow-xl"
          >
            <LifeBuoy className="h-6 w-6" />
          </button>
        )}
      </div>
    </>
  );
}
