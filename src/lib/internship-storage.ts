import {
  Candidate,
  CompanySettings,
  SignatorySettings,
  InternshipConfig,
  OfferLetterRecord,
  EmailLog,
  DashboardStats,
} from "@/types/internship";

export const DEFAULT_DOMAINS = [
  "Python Development",
  "Java Development",
  "Web Development",
  "Artificial Intelligence & Machine Learning",
  "Data Analytics",
  "Mobile Application Development",
  "Cloud Architecture & DevOps",
  "Custom Internship Domain",
];

export const DEFAULT_TERMS = [
  {
    id: "term-1",
    title: "1. Internship Responsibilities & Scope of Work",
    content:
      "The intern will actively participate in software development sprints, architectural reviews, technical documentation, and quality assurance processes as directed by the reporting mentor. All assignments must be executed with technical precision, engineering discipline, and adherence to IVR development standards.",
  },
  {
    id: "term-2",
    title: "2. Working Hours & Attendance Requirements",
    content:
      "The intern is required to maintain a minimum of 85% attendance during the internship duration. Core working hours are Monday through Friday, 9:30 AM to 5:30 PM IST (or designated shift hours agreed upon for remote execution). Punctuality in daily standups and weekly sprint retrospectives is mandatory.",
  },
  {
    id: "term-3",
    title: "3. Tasks, Deliverables & Assignment Expectations",
    content:
      "Assigned tasks, technical tickets, and module milestones must be completed and submitted through IVR's designated source code repositories (e.g., GitHub/GitLab) and project tracking portals within prescribed deadlines. Regular peer reviews and performance evaluations will be conducted.",
  },
  {
    id: "term-4",
    title: "4. Confidentiality & Non-Disclosure Agreement (NDA)",
    content:
      "The intern shall hold in strict confidence all proprietary technical data, client specifications, architectural blueprints, algorithms, login credentials, and internal documentation. Unauthorized disclosure, sharing, reproduction, or retention of IVR confidential property is strictly prohibited both during and after the tenure.",
  },
  {
    id: "term-5",
    title: "5. Professional Conduct & Workplace Ethics",
    content:
      "The intern agrees to uphold the highest standard of professional ethics, respect workplace diversity, and adhere to IVR's corporate policies. Any instances of plagiarism, unauthorized external communication, or disciplinary misconduct may result in immediate revocation of the internship.",
  },
  {
    id: "term-6",
    title: "6. Intellectual Property (IP) Provisions",
    content:
      "All source code, software artifacts, inventions, design systems, research papers, diagrams, and documentation created or contributed to by the intern in connection with IVR Tech Solutions shall remain the sole and exclusive intellectual property of IVR Tech Solutions Private Limited.",
  },
  {
    id: "term-7",
    title: "7. Internship Completion & Evaluation Criteria",
    content:
      "Successful completion requires satisfactory delivery of the assigned capstone project module, code review approval by the Reporting Mentor, and formal submission of an Internship Project Report prior to the scheduled completion date.",
  },
  {
    id: "term-8",
    title: "8. Certificate Eligibility Conditions",
    content:
      "An official Certificate of Internship Completion and Letter of Recommendation (if applicable) will be awarded only upon fulfilling the required attendance, positive performance appraisal by the mentor, and successful clearance of all company handover procedures.",
  },
  {
    id: "term-9",
    title: "9. General Stipulations & Stipend Notice",
    content:
      "This appointment is an intensive academic and practical internship. No stipend or monetary remuneration is implied or committed unless explicitly specified in the Internship Program Schedule section of this document. Either party may terminate this internship agreement with five (5) working days written notice.",
  },
];

export const DEFAULT_COMPANY_SETTINGS: CompanySettings = {
  name: "IVR Tech Solutions Private Limited",
  tagline: "Innovation That Builds Tomorrow.",
  logoUrl: "/images/ivr-official-logo.png",
  email: "admin@ivrtechsolution.in",
  phone: "8143177907",
  address: "", // Optional - unconfirmed for publication, hidden when empty
  website: "https://ivrtechsolution.in/",
  registrationNumber: "CIN: U72900TN2024PTC170881",
  brandNavy: "#071B3A",
  brandRoyalBlue: "#0866E8",
  brandGold: "#F5B82E",
  brandWhite: "#FFFFFF",
  terms: DEFAULT_TERMS,
};

export const DEFAULT_SIGNATORY_SETTINGS: SignatorySettings = {
  name: "Indla venkata Gowtham Kumar Reddy",
  designation: "Managing Director",
  email: "admin@ivrtechsolution.in",
  phone: "8143177907",
  signatureUrl: "/images/authorized-signatory.png",
  includeSignatureImage: true,
};

// Initial candidate seed data simulating responses received from Google Form: https://forms.gle/8tN2Dgp7s5pQvGBPA
export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: "cand-1",
    fullName: "Aravindhan Sundar",
    email: "aravindhan.s@gmail.com",
    phone: "9840123456",
    college: "Rajalakshmi Engineering College",
    university: "Anna University",
    degree: "B.Tech",
    department: "Computer Science and Business Systems",
    academicYear: "Final Year (2025-2026)",
    domain: "Python Development",
    applicationDate: "2026-10-24",
    status: "selected",
    source: "google_forms",
    notes: "Applied via Google Form. Strong Python & Django fundamentals.",
  },
  {
    id: "cand-2",
    fullName: "Keerthana M",
    email: "keerthana.m@outlook.com",
    phone: "9884567890",
    college: "Sri Sairam Engineering College",
    university: "Anna University",
    degree: "B.E.",
    department: "Artificial Intelligence and Data Science",
    academicYear: "Third Year (2025-2026)",
    domain: "Artificial Intelligence & Machine Learning",
    applicationDate: "2026-10-25",
    status: "selected",
    source: "google_forms",
    notes: "Hands-on experience in PyTorch and OpenCV.",
  },
  {
    id: "cand-3",
    fullName: "Rohan Varma",
    email: "rohan.varma@gmail.com",
    phone: "9701239874",
    college: "SRM Institute of Science and Technology",
    university: "SRM University",
    degree: "B.Tech",
    department: "Information Technology",
    academicYear: "Final Year (2025-2026)",
    domain: "Web Development",
    applicationDate: "2026-10-26",
    status: "new",
    source: "google_forms",
    notes: "Next.js and Tailwind CSS portfolio submitted.",
  },
  {
    id: "cand-4",
    fullName: "Sneha Reddy",
    email: "sneha.reddy@gmail.com",
    phone: "9123456789",
    college: "Vellore Institute of Technology (VIT Chennai)",
    university: "VIT",
    degree: "B.Tech",
    department: "Computer Science and Engineering",
    academicYear: "Third Year (2025-2026)",
    domain: "Data Analytics",
    applicationDate: "2026-10-27",
    status: "selected",
    source: "google_forms",
    notes: "Proficient in SQL, Power BI, and Pandas.",
  },
  {
    id: "cand-5",
    fullName: "Praveen Kumar",
    email: "praveenkumar.tech@gmail.com",
    phone: "9445123890",
    college: "St. Joseph's College of Engineering",
    university: "Anna University",
    degree: "B.E.",
    department: "Computer Science and Engineering",
    academicYear: "Final Year (2025-2026)",
    domain: "Java Development",
    applicationDate: "2026-10-28",
    status: "new",
    source: "google_forms",
    notes: "Spring Boot, REST APIs and Microservices.",
  },
];

const STORAGE_KEYS = {
  COMPANY: "ivr_company_settings_v2",
  SIGNATORY: "ivr_signatory_settings_v2",
  CANDIDATES: "ivr_candidates_v2",
  OFFERS: "ivr_offer_letters_v2",
  EMAIL_LOGS: "ivr_email_logs_v2",
  SEQUENCE: "ivr_sequence_counter_v2",
  GOOGLE_SHEET_CONFIG: "ivr_google_sheet_config_v2",
};

// Safe LocalStorage access
const isBrowser = typeof window !== "undefined";

export function getCompanySettings(): CompanySettings {
  if (!isBrowser) return DEFAULT_COMPANY_SETTINGS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.COMPANY);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.COMPANY, JSON.stringify(DEFAULT_COMPANY_SETTINGS));
      return DEFAULT_COMPANY_SETTINGS;
    }
    const parsed = JSON.parse(data);
    // Sanitize address: if it's an object or contains "Romaa", reset to ""
    let cleanAddress = "";
    if (typeof parsed.address === "string") {
      cleanAddress = parsed.address.includes("Romaa") ? "" : parsed.address.trim();
    }
    return {
      ...DEFAULT_COMPANY_SETTINGS,
      ...parsed,
      address: cleanAddress,
      terms: Array.isArray(parsed.terms) && parsed.terms.length > 0 ? parsed.terms : DEFAULT_TERMS,
    };
  } catch (e) {
    console.error("Failed to read company settings", e);
    return DEFAULT_COMPANY_SETTINGS;
  }
}

export function saveCompanySettings(settings: CompanySettings): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(STORAGE_KEYS.COMPANY, JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save company settings", e);
  }
}

export function getSignatorySettings(): SignatorySettings {
  if (!isBrowser) return DEFAULT_SIGNATORY_SETTINGS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SIGNATORY);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.SIGNATORY, JSON.stringify(DEFAULT_SIGNATORY_SETTINGS));
      return DEFAULT_SIGNATORY_SETTINGS;
    }
    const parsed = JSON.parse(data);
    return {
      ...DEFAULT_SIGNATORY_SETTINGS,
      ...parsed,
      includeSignatureImage:
        parsed.includeSignatureImage !== undefined ? Boolean(parsed.includeSignatureImage) : true,
    };
  } catch (e) {
    console.error("Failed to read signatory settings", e);
    return DEFAULT_SIGNATORY_SETTINGS;
  }
}

export function saveSignatorySettings(settings: SignatorySettings): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(STORAGE_KEYS.SIGNATORY, JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save signatory settings", e);
  }
}

export function getCandidates(): Candidate[] {
  if (!isBrowser) return INITIAL_CANDIDATES;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(INITIAL_CANDIDATES));
      return INITIAL_CANDIDATES;
    }
    const candidates = JSON.parse(data);
    if (!Array.isArray(candidates) || candidates.length === 0) {
      localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(INITIAL_CANDIDATES));
      return INITIAL_CANDIDATES;
    }
    // Check duplicates
    const emails = new Set<string>();
    const phones = new Set<string>();
    return candidates.map((cand: any, idx: number) => {
      const email = typeof cand?.email === "string" ? cand.email.toLowerCase().trim() : "";
      const phone = typeof cand?.phone === "string" ? cand.phone.trim() : "";
      const isDup = Boolean((email && emails.has(email)) || (phone && phones.has(phone)));
      if (email) emails.add(email);
      if (phone) phones.add(phone);
      return {
        id: cand?.id || `cand-${idx + 1}`,
        fullName: cand?.fullName || "Candidate",
        email: cand?.email || "",
        phone: cand?.phone || "",
        college: cand?.college || "College of Engineering",
        university: cand?.university || "",
        degree: cand?.degree || "B.Tech",
        department: cand?.department || "Computer Science",
        academicYear: cand?.academicYear || "Final Year",
        domain: cand?.domain || "Python Development",
        applicationDate: cand?.applicationDate || new Date().toISOString().split("T")[0],
        status: cand?.status || "selected",
        source: cand?.source || "google_forms",
        notes: cand?.notes,
        isDuplicate: isDup,
      };
    });
  } catch (e) {
    console.error("Failed to load candidates", e);
    return INITIAL_CANDIDATES;
  }
}

export function saveCandidates(candidates: Candidate[]): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));
  } catch (e) {
    console.error("Failed to save candidates", e);
  }
}

export function addOrUpdateCandidate(candidate: Candidate): void {
  const current = getCandidates();
  const index = current.findIndex((c) => c.id === candidate.id);
  if (index >= 0) {
    current[index] = candidate;
  } else {
    current.unshift(candidate);
  }
  saveCandidates(current);
}

export function deleteCandidate(id: string): void {
  const current = getCandidates().filter((c) => c.id !== id);
  saveCandidates(current);
}

export function getOfferLetters(): OfferLetterRecord[] {
  if (!isBrowser) return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.OFFERS);
    if (!data) return [];
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to load offer letters", e);
    return [];
  }
}

export function saveOfferLetters(offers: OfferLetterRecord[]): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(offers));
  } catch (e) {
    console.error("Failed to save offer letters", e);
  }
}

/**
 * Sequential unique reference number generator:
 * Format: IVR/INT/{YEAR}/{0001}
 * Separate sequence per calendar year.
 * Never reuses an issued reference number.
 */
export function getNextReferenceNumber(targetYear?: number): {
  referenceNumber: string;
  year: number;
  sequenceNumber: number;
} {
  const year = targetYear || new Date().getFullYear();
  let sequence = 1;

  if (isBrowser) {
    try {
      const seqData = localStorage.getItem(`${STORAGE_KEYS.SEQUENCE}_${year}`);
      if (seqData) {
        sequence = parseInt(seqData, 10) + 1;
      } else {
        // Also verify against existing stored offers for this year
        const existingOffers = getOfferLetters().filter((o) => o.year === year);
        if (existingOffers.length > 0) {
          const maxSeq = Math.max(...existingOffers.map((o) => o.sequenceNumber || 0));
          sequence = Math.max(sequence, maxSeq + 1);
        }
      }
    } catch (e) {
      console.error("Error reading sequence", e);
    }
  }

  const paddedSeq = String(sequence).padStart(4, "0");
  const referenceNumber = `IVR/INT/${year}/${paddedSeq}`;

  return { referenceNumber, year, sequenceNumber: sequence };
}

export function commitReferenceNumber(year: number, sequence: number): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(`${STORAGE_KEYS.SEQUENCE}_${year}`, String(sequence));
  } catch (e) {
    console.error("Error committing reference sequence", e);
  }
}

export function saveOfferLetter(offer: OfferLetterRecord): void {
  const existing = getOfferLetters();
  const index = existing.findIndex((o) => o.id === offer.id);

  if (index >= 0) {
    existing[index] = {
      ...offer,
      version: (existing[index].version || 1) + 1,
      updatedAt: new Date().toISOString(),
    };
  } else {
    existing.unshift(offer);
    // Commit the sequence counter
    commitReferenceNumber(offer.year, offer.sequenceNumber);
  }

  saveOfferLetters(existing);

  // Update candidate status to offer_generated
  const candidates = getCandidates();
  const cIndex = candidates.findIndex((c) => c.id === offer.candidateId);
  if (cIndex >= 0) {
    candidates[cIndex].status = "offer_generated";
    saveCandidates(candidates);
  }
}

export function getEmailLogs(): EmailLog[] {
  if (!isBrowser) return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EMAIL_LOGS);
    if (!data) return [];
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to load email logs", e);
    return [];
  }
}

export function addEmailLog(log: Omit<EmailLog, "id" | "sentAt">): EmailLog {
  const logs = getEmailLogs();
  const newLog: EmailLog = {
    ...log,
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    sentAt: new Date().toISOString(),
  };
  logs.unshift(newLog);
  if (isBrowser) {
    localStorage.setItem(STORAGE_KEYS.EMAIL_LOGS, JSON.stringify(logs));
  }

  // Update offer and candidate status to offer_sent
  const offers = getOfferLetters();
  const offIndex = offers.findIndex((o) => o.id === log.offerId);
  if (offIndex >= 0) {
    offers[offIndex].status = "sent";
    saveOfferLetters(offers);

    const candidates = getCandidates();
    const candIndex = candidates.findIndex((c) => c.id === offers[offIndex].candidateId);
    if (candIndex >= 0) {
      candidates[candIndex].status = "offer_sent";
      saveCandidates(candidates);
    }
  }

  return newLog;
}

export function updateOfferStatus(
  offerId: string,
  status: "generated" | "sent" | "accepted" | "declined"
): void {
  const offers = getOfferLetters();
  const index = offers.findIndex((o) => o.id === offerId);
  if (index >= 0) {
    offers[index].status = status;
    offers[index].updatedAt = new Date().toISOString();
    saveOfferLetters(offers);

    const candidates = getCandidates();
    const cIndex = candidates.findIndex((c) => c.id === offers[index].candidateId);
    if (cIndex >= 0) {
      if (status === "accepted") candidates[cIndex].status = "accepted";
      else if (status === "declined") candidates[cIndex].status = "declined";
      else if (status === "sent") candidates[cIndex].status = "offer_sent";
      saveCandidates(candidates);
    }
  }
}

export function getDashboardStats(): DashboardStats {
  const candidates = getCandidates();
  const offers = getOfferLetters();

  const totalCandidates = candidates.length;
  const selectedCandidates = candidates.filter((c) => c.status !== "new").length;
  const offersGenerated = offers.length;
  const offersSent = offers.filter((o) => o.status === "sent" || o.status === "accepted").length;
  const offersAccepted = offers.filter((o) => o.status === "accepted").length;
  const offersDeclined = offers.filter((o) => o.status === "declined").length;
  const offersPending = offers.filter((o) => o.status === "generated" || o.status === "sent").length;

  return {
    totalCandidates,
    selectedCandidates,
    offersGenerated,
    offersSent,
    offersAccepted,
    offersPending,
    offersDeclined,
  };
}

export function exportFullDataBackup(): string {
  return JSON.stringify(
    {
      companySettings: getCompanySettings(),
      signatorySettings: getSignatorySettings(),
      candidates: getCandidates(),
      offers: getOfferLetters(),
      emailLogs: getEmailLogs(),
      exportedAt: new Date().toISOString(),
      version: "2.0",
    },
    null,
    2
  );
}

export function importDataBackup(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.companySettings) saveCompanySettings(data.companySettings);
    if (data.signatorySettings) saveSignatorySettings(data.signatorySettings);
    if (Array.isArray(data.candidates)) saveCandidates(data.candidates);
    if (Array.isArray(data.offers)) saveOfferLetters(data.offers);
    if (Array.isArray(data.emailLogs)) {
      if (isBrowser) localStorage.setItem(STORAGE_KEYS.EMAIL_LOGS, JSON.stringify(data.emailLogs));
    }
    return true;
  } catch (e) {
    console.error("Backup import failed", e);
    return false;
  }
}
