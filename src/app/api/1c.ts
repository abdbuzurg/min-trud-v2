import axios from 'axios'
import { JobSeekerFromData } from '../../../types/jobSeeker';
import { structuredLogger } from "@/lib/structuredLogger";

//URL
const URL = "http://10.10.10.6/vm/hs/base/get_doc";

// Basic Auth credentials
const USERNAME = "Админ"
const PASSWORD = "123"

export interface AdditionalContactInformation {
  fullname: string;
  status: string;
  phone_number: string;
}

export interface LanguageKnowledge {
  language: string;
  level: string;
}

export interface WorkExperienceItem {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
}

export interface EducationItem {
  education: string;
  institution: string;
  specialty: string;
}

export interface Candidate1CPayload {
  firstName: string;
  lastName: string;
  middleName: string;
  birthDate: string;
  tin: string;
  gender: string;
  email: string;
  maritalStatus: string;
  passportCode: string;
  phoneNumber: string;
  messengerNumber: string;
  address: string;
  addressOfBirth: string;
  desiredSalary: string;
  dateOfReadiness: string;
  desiredCountry: string;
  desiredCity: string;
  criminalRecord: string;
  additionalInformation: string;
  createdAt: string;
  updatedAt: string;
  additionalContactInformation: AdditionalContactInformation[];
  knowledgeOfLanguages: LanguageKnowledge[];
  WorkExperience: WorkExperienceItem[];
  education: EducationItem[];
}

function buildBasicAuthHeader(username: string, password: string) {
  const token = Buffer.from(`${username}:${password}`, "utf8").toString("base64");
  return `Basic ${token}`;
}

export function formatDateTo1C(date: string) {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day} 00:00:00.000`;
}

export async function sendTo1C(payload: Candidate1CPayload): Promise<boolean> {
  const authHeader = buildBasicAuthHeader(USERNAME, PASSWORD);

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: authHeader,
  };

  structuredLogger.info("integration.1c.request.start", {
    integration: "1c",
    url: URL,
    method: "POST",
    candidatePhoneNumber: payload.phoneNumber,
  });

  try {
    const response = await axios.post(URL, payload, {
      headers,
      timeout: 10000,
    });

    structuredLogger.info("integration.1c.response", {
      integration: "1c",
      status: response.status,
      candidatePhoneNumber: payload.phoneNumber,
    });

    let data: any = response.data;

    if (typeof data === "string") {
      const text = data.replace(/^\uFEFF/, ""); // strip BOM
      try {
        const parsed = JSON.parse(text);
        if (parsed.result === 1) {
          structuredLogger.info("integration.1c.result", {
            integration: "1c",
            result: parsed.result,
            message: parsed.message,
            candidatePhoneNumber: payload.phoneNumber,
          });
          return true;
        } else {
          structuredLogger.warn("integration.1c.result", {
            integration: "1c",
            result: parsed.result,
            message: parsed.message,
            candidatePhoneNumber: payload.phoneNumber,
          });
          return false;
        }
      } catch (e) {
        structuredLogger.error("integration.1c.parse_error", {
          integration: "1c",
          candidatePhoneNumber: payload.phoneNumber,
          responseSnippet: text.slice(0, 500),
          error: structuredLogger.errorDetails(e),
        });
        return false;
      }
    } else {
      if (data.result === 1) {
        structuredLogger.info("integration.1c.result", {
          integration: "1c",
          result: data.result,
          message: data.message,
          candidatePhoneNumber: payload.phoneNumber,
        });
        return true;
      } else {
        structuredLogger.warn("integration.1c.result", {
          integration: "1c",
          result: data.result,
          message: data.message,
          candidatePhoneNumber: payload.phoneNumber,
        });
        return false;
      }
    }
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const body = err.response?.data;
      structuredLogger.error("integration.1c.request_error", {
        integration: "1c",
        status: err.response?.status,
        candidatePhoneNumber: payload.phoneNumber,
        body: typeof body === "string" ? body.slice(0, 500) : body,
        error: structuredLogger.errorDetails(err),
      });

      // Попробуем достать message/result из тела, если сервер 1С всё-таки что-то вернул
      if (typeof body === "string") {
        const text = body.replace(/^\uFEFF/, "");
        try {
          const parsed = JSON.parse(text);
          if (parsed && typeof parsed === "object") {
            structuredLogger.error("integration.1c.error_payload", {
              integration: "1c",
              result: parsed.result,
              message: parsed.message,
              candidatePhoneNumber: payload.phoneNumber,
            });
          }
        } catch {
          // просто текст, оставляем как есть
        }
      } else if (body && typeof body === "object") {
        const anyBody = body as any;
        if ("result" in anyBody || "message" in anyBody) {
          structuredLogger.error("integration.1c.error_payload", {
            integration: "1c",
            result: anyBody.result,
            message: anyBody.message,
            candidatePhoneNumber: payload.phoneNumber,
          });
        }
      }
    } else if (err instanceof Error) {
      structuredLogger.error("integration.1c.request_error", {
        integration: "1c",
        candidatePhoneNumber: payload.phoneNumber,
        error: structuredLogger.errorDetails(err),
      });
    } else {
      structuredLogger.error("integration.1c.request_error", {
        integration: "1c",
        candidatePhoneNumber: payload.phoneNumber,
        error: structuredLogger.errorDetails(err),
      });
    }

    return false;
  }
}
