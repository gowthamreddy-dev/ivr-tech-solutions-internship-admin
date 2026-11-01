import * as XLSX from "xlsx";
import { Candidate, InternshipDomain } from "@/types/internship";

export const GOOGLE_FORM_URL = "https://forms.gle/8tN2Dgp7s5pQvGBPA";

export interface ColumnMapping {
  fullName: string;
  email: string;
  phone: string;
  college: string;
  university: string;
  degree: string;
  department: string;
  academicYear: string;
  domain: string;
  applicationDate: string;
}

export interface ParsedSpreadsheetResult {
  headers: string[];
  rawRows: Record<string, any>[];
  suggestedMapping: ColumnMapping;
}

// Intelligent column header detection
export function autoDetectColumnMapping(headers: string[]): ColumnMapping {
  const findMatch = (keywords: string[]): string => {
    for (const kw of keywords) {
      const match = headers.find((h) => h.toLowerCase().includes(kw.toLowerCase()));
      if (match) return match;
    }
    return "";
  };

  return {
    fullName: findMatch(["full name", "name", "candidate name", "student name"]) || headers[1] || "",
    email: findMatch(["email", "mail", "email address"]) || "",
    phone: findMatch(["phone", "mobile", "contact", "whatsapp", "number"]) || "",
    college: findMatch(["college", "institution", "institute", "campus"]) || "",
    university: findMatch(["university", "univ", "board"]) || "",
    degree: findMatch(["degree", "course", "qualification", "program"]) || "",
    department: findMatch(["department", "branch", "stream", "dept", "specialization"]) || "",
    academicYear: findMatch(["year", "academic year", "batch", "passing year", "semester"]) || "",
    domain: findMatch(["domain", "track", "role", "field", "area of interest", "internship domain"]) || "",
    applicationDate: findMatch(["timestamp", "date", "applied", "submission date"]) || "",
  };
}

export async function parseExcelOrCsvFile(file: File): Promise<ParsedSpreadsheetResult> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const rawData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, {
    header: 1,
    defval: "",
  });

  if (!rawData || rawData.length === 0) {
    throw new Error("The uploaded file appears to be empty.");
  }

  const rawHeaders = (rawData[0] as any[]).map((h) => String(h).trim()).filter(Boolean);
  const rows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: "" });

  return {
    headers: rawHeaders,
    rawRows: rows,
    suggestedMapping: autoDetectColumnMapping(rawHeaders),
  };
}

export async function fetchGoogleSheetCsv(sheetUrlOrId: string): Promise<ParsedSpreadsheetResult> {
  let sheetId = sheetUrlOrId.trim();

  // Extract Sheet ID from URL if full URL is pasted
  const match = sheetId.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match) {
    sheetId = match[1];
  }

  // Google Sheets public CSV export link
  const exportUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

  const response = await fetch(exportUrl);
  if (!response.ok) {
    // Try gviz endpoint as fallback
    const gvizUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
    const gvizResp = await fetch(gvizUrl);
    if (!gvizResp.ok) {
      throw new Error(
        "Could not access Google Sheet. Please ensure the Google Sheet is shared with 'Anyone with the link can view' or publish it to the web."
      );
    }
    const csvText = await gvizResp.text();
    return parseCsvText(csvText);
  }

  const csvText = await response.text();
  return parseCsvText(csvText);
}

export function parseCsvText(csvText: string): ParsedSpreadsheetResult {
  const workbook = XLSX.read(csvText, { type: "string" });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const rawHeaders: string[] = XLSX.utils
    .sheet_to_json<any[]>(worksheet, { header: 1 })[0]
    ?.map((h: any) => String(h).trim()) || [];
  const rows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: "" });

  return {
    headers: rawHeaders,
    rawRows: rows,
    suggestedMapping: autoDetectColumnMapping(rawHeaders),
  };
}

export function convertRowsToCandidates(
  rawRows: Record<string, any>[],
  mapping: ColumnMapping,
  existingCandidates: Candidate[]
): { candidates: Candidate[]; duplicatesCount: number; newCount: number } {
  const existingEmails = new Set(
    existingCandidates.map((c) => (c.email || "").toLowerCase().trim()).filter(Boolean)
  );
  const existingPhones = new Set(
    existingCandidates.map((c) => (c.phone || "").replace(/\D/g, "")).filter(Boolean)
  );

  let duplicatesCount = 0;
  let newCount = 0;

  const candidates: Candidate[] = rawRows.map((row, index) => {
    const email = String(row[mapping.email] || "").trim();
    const phone = String(row[mapping.phone] || "").trim();
    const cleanedPhone = phone.replace(/\D/g, "");

    const isDup = Boolean(
      (email && existingEmails.has(email.toLowerCase())) ||
      (cleanedPhone && existingPhones.has(cleanedPhone))
    );

    if (isDup) {
      duplicatesCount++;
    } else {
      newCount++;
      if (email) existingEmails.add(email.toLowerCase());
      if (cleanedPhone) existingPhones.add(cleanedPhone);
    }

    // Standardize domain
    const rawDomain = String(row[mapping.domain] || "Python Development").trim();
    let standardizedDomain: InternshipDomain = "Python Development";
    if (/python/i.test(rawDomain)) standardizedDomain = "Python Development";
    else if (/java/i.test(rawDomain)) standardizedDomain = "Java Development";
    else if (/web|full\s*stack|frontend|react/i.test(rawDomain)) standardizedDomain = "Web Development";
    else if (/ai|machine\s*learning|ml|deep\s*learning/i.test(rawDomain))
      standardizedDomain = "Artificial Intelligence & Machine Learning";
    else if (/data|analytics|bi|power\s*bi/i.test(rawDomain))
      standardizedDomain = "Data Analytics";
    else if (/mobile|android|flutter|ios/i.test(rawDomain))
      standardizedDomain = "Mobile Application Development";
    else if (rawDomain) standardizedDomain = rawDomain;

    const appDate = row[mapping.applicationDate]
      ? new Date(row[mapping.applicationDate]).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];

    return {
      id: `cand-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`,
      fullName: String(row[mapping.fullName] || "Candidate").trim(),
      email,
      phone,
      college: String(row[mapping.college] || "Engineering College").trim(),
      university: String(row[mapping.university] || "").trim(),
      degree: String(row[mapping.degree] || "B.Tech / B.E.").trim(),
      department: String(row[mapping.department] || "Computer Science").trim(),
      academicYear: String(row[mapping.academicYear] || "Final Year").trim(),
      domain: standardizedDomain,
      applicationDate: appDate,
      status: "new",
      source: "google_forms",
      isDuplicate: isDup,
      notes: isDup ? "Duplicate detected with matching email/phone." : undefined,
    };
  });

  return { candidates, duplicatesCount, newCount };
}
