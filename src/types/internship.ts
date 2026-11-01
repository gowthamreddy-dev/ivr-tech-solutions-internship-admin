export type InternshipDomain =
  | "Python Development"
  | "Java Development"
  | "Web Development"
  | "Artificial Intelligence & Machine Learning"
  | "Data Analytics"
  | "Mobile Application Development"
  | string;

export type InternshipMode = "Remote" | "On-site" | "Hybrid";

export type CandidateStatus =
  | "new"
  | "selected"
  | "offer_generated"
  | "offer_sent"
  | "accepted"
  | "declined";

export interface Candidate {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  college: string;
  university?: string;
  degree: string;
  department: string;
  academicYear: string;
  domain: InternshipDomain;
  applicationDate: string;
  status: CandidateStatus;
  source: "google_forms" | "csv_import" | "manual";
  notes?: string;
  isDuplicate?: boolean;
}

export interface InternshipConfig {
  domain: InternshipDomain;
  role: string;
  duration: string;
  startDate: string;
  endDate: string;
  mode: InternshipMode;
  batch: string;
  reportingMentor: string;
  reportingManager: string;
  workingHours: string;
  stipend: string;
  additionalInstructions?: string;
}

export interface OfferTerm {
  id: string;
  title: string;
  content: string;
}

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromName: string;
}

export interface CompanySettings {
  name: string;
  tagline: string;
  logoUrl: string;
  email: string;
  phone: string;
  address?: string; // Optional - hidden on documents and web when empty
  website: string;
  registrationNumber?: string;
  brandNavy: string;
  brandRoyalBlue: string;
  brandGold: string;
  brandWhite: string;
  terms: OfferTerm[];
  smtp?: SmtpConfig;
}

export interface SignatorySettings {
  name: string;
  designation: string;
  email: string;
  phone: string;
  signatureUrl: string;
  includeSignatureImage: boolean;
}

export interface EmailLog {
  id: string;
  offerId: string;
  referenceNumber: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  sentAt: string;
  status: "sent" | "delivered" | "failed";
  notes?: string;
}

export interface OfferLetterRecord {
  id: string;
  referenceNumber: string; // e.g. IVR/INT/2026/0001
  year: number;
  sequenceNumber: number;
  issueDate: string;
  candidateId: string;
  candidate: Candidate;
  internship: InternshipConfig;
  companySnapshot: CompanySettings;
  signatorySnapshot: SignatorySettings;
  version: number;
  generatedAt: string;
  updatedAt: string;
  status: "generated" | "sent" | "accepted" | "declined";
  pdfFileName: string;
  docxFileName: string;
}

export interface DashboardStats {
  totalCandidates: number;
  selectedCandidates: number;
  offersGenerated: number;
  offersSent: number;
  offersAccepted: number;
  offersPending: number;
  offersDeclined: number;
}
