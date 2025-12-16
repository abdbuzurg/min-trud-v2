import axios from 'axios'
import { JobSeekerFromData } from '../../../types/jobSeeker';

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

  console.log("Sending POST request to 1C");
  console.log("URL:", URL);
  console.log("Request payload:", JSON.stringify(payload, null, 2));

  try {
    const response = await axios.post(URL, payload, {
      headers,
      timeout: 10000,
    });

    console.log("Response status code:", response.status);
    console.log("Response headers:", response.headers);

    let data: any = response.data;

    if (typeof data === "string") {
      const text = data.replace(/^\uFEFF/, ""); // strip BOM
      try {
        const parsed = JSON.parse(text);
        console.log("Response JSON:");
        console.log(JSON.stringify(parsed, null, 2));

        if (parsed.result === 1) {
          console.log("✅ 1C says success:", parsed.message);
          return true;
        } else {
          console.error(
            "❌ 1C returned non-success result:",
            `result=${parsed.result}, message=${parsed.message}`
          );
          return false;
        }
      } catch (e) {
        console.error("Response text (not valid JSON or not parsed):");
        console.error(text);
        return false;
      }
    } else {
      console.log("Response JSON (parsed by axios):");
      console.log(JSON.stringify(data, null, 2));

      if (data.result === 1) {
        console.log("✅ 1C says success:", data.message);
        return true;
      } else {
        // вот здесь твой кейс: { result: 0, message: "Неуспешно" }
        console.error(
          "❌ 1C returned non-success result:",
          `result=${data.result}, message=${data.message}`
        );
        return false;
      }
    }
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error("Request failed with status:", err.response?.status);
      console.error("Headers:", err.response?.headers);

      const body = err.response?.data;
      console.error("Body:", body);

      // Попробуем достать message/result из тела, если сервер 1С всё-таки что-то вернул
      if (typeof body === "string") {
        const text = body.replace(/^\uFEFF/, "");
        try {
          const parsed = JSON.parse(text);
          if (parsed && typeof parsed === "object") {
            console.error(
              "❌ 1C error payload:",
              `result=${parsed.result}, message=${parsed.message}`
            );
          }
        } catch {
          // просто текст, оставляем как есть
        }
      } else if (body && typeof body === "object") {
        const anyBody = body as any;
        if ("result" in anyBody || "message" in anyBody) {
          console.error(
            "❌ 1C error payload:",
            `result=${anyBody.result}, message=${anyBody.message}`
          );
        }
      }
    } else if (err instanceof Error) {
      console.error("Request error:", err.message);
    } else {
      console.error("Unknown error:", err);
    }

    return false;
  }
}
