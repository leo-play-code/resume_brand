export interface Experience {
  company: string;
  companyEn?: string;
  role: string;
  /** Format: "YYYY.MM — YYYY.MM" or "YYYY.MM — Present" */
  period: string;
  description: string[];
  type: "work" | "education";
}

export const experiences: Experience[] = [];
