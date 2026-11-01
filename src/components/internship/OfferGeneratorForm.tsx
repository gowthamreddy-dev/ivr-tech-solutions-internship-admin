"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Download,
  Printer,
  Mail,
  Save,
  CheckCircle2,
  Calendar,
  User,
  Building,
  Briefcase,
  Clock,
  DollarSign,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileCode,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import {
  Candidate,
  CompanySettings,
  SignatorySettings,
  InternshipConfig,
  OfferLetterRecord,
  InternshipDomain,
} from "@/types/internship";
import {
  DEFAULT_DOMAINS,
  getNextReferenceNumber,
  saveOfferLetter,
} from "@/lib/internship-storage";
import { OfferLetterDocument } from "./OfferLetterDocument";
import { generateOfferLetterPdf, triggerBrowserPrint } from "@/lib/pdf-generator";
import { generateOfferLetterDocx } from "@/lib/docx-generator";

interface OfferGeneratorFormProps {
  initialCandidate?: Candidate | null;
  candidates: Candidate[];
  companySettings: CompanySettings;
  signatorySettings: SignatorySettings;
  onOfferSaved: (offer: OfferLetterRecord) => void;
  onOpenEmailModal: (offer: OfferLetterRecord) => void;
  onBackToCandidates?: () => void;
}

export const OfferGeneratorForm: React.FC<OfferGeneratorFormProps> = ({
  initialCandidate,
  candidates,
  companySettings,
  signatorySettings,
  onOfferSaved,
  onOpenEmailModal,
  onBackToCandidates,
}) => {
  // Current candidate
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(
    initialCandidate?.id || candidates[0]?.id || ""
  );

  const fallbackCandidate: Candidate = useMemo(
    () => ({
      id: "cand-default",
      fullName: "Selected Candidate",
      email: "candidate@ivrtechsolution.in",
      phone: "8143177907",
      college: "Engineering College",
      university: "",
      degree: "B.Tech",
      department: "Computer Science",
      academicYear: "Final Year",
      domain: "Python Development",
      applicationDate: new Date().toISOString().split("T")[0],
      status: "selected",
      source: "manual",
    }),
    []
  );

  const selectedCandidate = useMemo(() => {
    return (
      (candidates && candidates.find((c) => c.id === selectedCandidateId)) ||
      initialCandidate ||
      (candidates && candidates[0]) ||
      fallbackCandidate
    );
  }, [candidates, selectedCandidateId, initialCandidate, fallbackCandidate]);

  // Current year & reference number
  const year = new Date().getFullYear();
  const nextRef = useMemo(() => getNextReferenceNumber(year), [year]);

  // Offer meta
  const [referenceNumber, setReferenceNumber] = useState(nextRef.referenceNumber);
  const [sequenceNumber, setSequenceNumber] = useState(nextRef.sequenceNumber);
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);

  // Helper to get default role from domain
  const getDefaultRoleForDomain = (domain: string) => {
    if (domain.includes("Python")) return "Python Development Intern";
    if (domain.includes("Java")) return "Java Development Intern";
    if (domain.includes("Web")) return "Full Stack Web Development Intern";
    if (domain.includes("AI") || domain.includes("Machine Learning"))
      return "AI & Machine Learning Engineering Intern";
    if (domain.includes("Data")) return "Data Analytics & Engineering Intern";
    if (domain.includes("Mobile")) return "Mobile Application Development Intern";
    if (domain.includes("Cloud")) return "Cloud & DevOps Engineering Intern";
    return `${domain} Intern`;
  };

  // Internship config state
  const [internship, setInternship] = useState<InternshipConfig>(() => {
    const domain = selectedCandidate?.domain || "Python Development";
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)
      .toISOString()
      .split("T")[0];
    const endDate = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate() + 7)
      .toISOString()
      .split("T")[0];

    return {
      domain,
      role: getDefaultRoleForDomain(domain),
      duration: "2 Months",
      startDate,
      endDate,
      mode: "Remote",
      batch: `Batch Nov-${year}`,
      reportingMentor: "Lead Technical Architect",
      reportingManager: `${signatorySettings.name} (${signatorySettings.designation})`,
      workingHours: "Monday to Friday, 9:30 AM to 5:30 PM IST (Flexible)",
      stipend: "", // Optional, do not promise stipend unless admin enters one
      additionalInstructions:
        "Intern will undergo mandatory Git workflow training and architecture sprint onboarding during the first week.",
    };
  });

  // When candidate changes, update domain and role
  useEffect(() => {
    if (selectedCandidate) {
      const domain = selectedCandidate.domain || "Python Development";
      setInternship((prev) => ({
        ...prev,
        domain,
        role: getDefaultRoleForDomain(domain),
      }));
    }
  }, [selectedCandidate]);

  // Preview zoom
  const [previewZoom, setPreviewZoom] = useState<number>(0.9);
  const [activeTab, setActiveTab] = useState<"form" | "preview" | "split">("split");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isGeneratingDocx, setIsGeneratingDocx] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Active constructed offer record for preview
  const currentOfferRecord: OfferLetterRecord = useMemo(() => {
    return {
      id: `offer-${Date.now()}`,
      referenceNumber,
      year,
      sequenceNumber,
      issueDate,
      candidateId: selectedCandidate?.id || "cand-1",
      candidate: selectedCandidate || candidates[0],
      internship,
      companySnapshot: companySettings,
      signatorySnapshot: signatorySettings,
      version: 1,
      generatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "generated",
      pdfFileName: `IVR_Offer_Letter_${(selectedCandidate?.fullName || "Candidate").replace(/\s+/g, "_")}_${referenceNumber.replace(/\//g, "_")}.pdf`,
      docxFileName: `IVR_Offer_Letter_${(selectedCandidate?.fullName || "Candidate").replace(/\s+/g, "_")}_${referenceNumber.replace(/\//g, "_")}.docx`,
    };
  }, [
    referenceNumber,
    year,
    sequenceNumber,
    issueDate,
    selectedCandidate,
    internship,
    companySettings,
    signatorySettings,
    candidates,
  ]);

  // Actions
  const handleSaveOffer = () => {
    saveOfferLetter(currentOfferRecord);
    onOfferSaved(currentOfferRecord);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      const blob = await generateOfferLetterPdf("live-offer-document", currentOfferRecord);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = currentOfferRecord.pdfFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      handleSaveOffer();
    } catch (e) {
      console.error("PDF generation error", e);
      alert("Error generating PDF. Please ensure all details are filled.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadDocx = async () => {
    try {
      setIsGeneratingDocx(true);
      const blob = await generateOfferLetterDocx(currentOfferRecord);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = currentOfferRecord.docxFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      handleSaveOffer();
    } catch (e) {
      console.error("DOCX generation error", e);
      alert("Error generating DOCX document.");
    } finally {
      setIsGeneratingDocx(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-4 bg-navy-900/90 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-3">
          {onBackToCandidates && (
            <button
              onClick={onBackToCandidates}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-blue-400">
                {referenceNumber}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300">
                Sequential Number Reserved
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Generating official offer for:{" "}
              <strong className="text-white">{selectedCandidate?.fullName}</strong>
            </p>
          </div>
        </div>

        {/* View Switcher & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Layout buttons */}
          <div className="hidden sm:flex items-center bg-navy-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab("form")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === "form"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Form
            </button>
            <button
              onClick={() => setActiveTab("split")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === "split"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === "preview"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Document Preview
            </button>
          </div>

          {/* Print */}
          <button
            onClick={triggerBrowserPrint}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Print Document"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Download DOCX */}
          <button
            onClick={handleDownloadDocx}
            disabled={isGeneratingDocx}
            className="px-3 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <FileCode className="w-4 h-4" />
            <span>{isGeneratingDocx ? "Generating..." : "DOCX (Word)"}</span>
          </button>

          {/* Download PDF */}
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isGeneratingPdf ? "Rendering PDF..." : "Download PDF"}</span>
          </button>

          {/* Save to History */}
          <button
            onClick={handleSaveOffer}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {saveSuccess ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saveSuccess ? "Saved!" : "Save Offer"}</span>
          </button>

          {/* Email Offer */}
          <button
            onClick={() => {
              handleSaveOffer();
              onOpenEmailModal(currentOfferRecord);
            }}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-purple-600/20 transition-all"
          >
            <Mail className="w-4 h-4" />
            <span>Email Candidate</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Form + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: CONFIGURATION FORM */}
        {(activeTab === "form" || activeTab === "split") && (
          <div
            className={`space-y-4 ${
              activeTab === "split" ? "lg:col-span-5" : "lg:col-span-12"
            }`}
          >
            {/* Candidate Selector */}
            <div className="p-4 bg-navy-900 border border-slate-800 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" />
                <span>1. Candidate Selection</span>
              </h3>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Select Candidate from Pipeline
                </label>
                <select
                  value={selectedCandidateId}
                  onChange={(e) => setSelectedCandidateId(e.target.value)}
                  className="w-full bg-navy-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  {candidates.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} — {c.domain} ({c.college})
                    </option>
                  ))}
                </select>
              </div>

              {selectedCandidate && (
                <div className="p-3 bg-navy-950 rounded-xl border border-slate-800/80 text-xs space-y-1 text-slate-300">
                  <p className="font-bold text-white">{selectedCandidate.fullName}</p>
                  <p className="text-[11px] text-slate-400">
                    {selectedCandidate.degree} - {selectedCandidate.department}
                  </p>
                  <p className="text-[11px] text-slate-400">{selectedCandidate.college}</p>
                  <p className="text-[11px] text-blue-400 font-mono">
                    {selectedCandidate.email} | +91 {selectedCandidate.phone}
                  </p>
                </div>
              )}
            </div>

            {/* Reference & Issue Date */}
            <div className="p-4 bg-navy-900 border border-slate-800 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <span>2. Document Numbering & Issue Date</span>
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Unique Offer Reference *
                  </label>
                  <input
                    type="text"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="w-full bg-navy-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-blue-400 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Issue Date *</label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full bg-navy-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Internship Configuration */}
            <div className="p-4 bg-navy-900 border border-slate-800 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-400" />
                <span>3. Internship Program Configuration</span>
              </h3>

              <div className="space-y-3 text-xs">
                {/* Domain & Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Internship Domain *
                    </label>
                    <select
                      value={internship.domain}
                      onChange={(e) => {
                        const newDomain = e.target.value;
                        setInternship({
                          ...internship,
                          domain: newDomain,
                          role: getDefaultRoleForDomain(newDomain),
                        });
                      }}
                      className="w-full bg-navy-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      {DEFAULT_DOMAINS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Designated Role Title *
                    </label>
                    <input
                      type="text"
                      value={internship.role}
                      onChange={(e) => setInternship({ ...internship, role: e.target.value })}
                      className="w-full bg-navy-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Duration & Mode */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Internship Duration *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1 Month, 2 Months, 3 Months"
                      value={internship.duration}
                      onChange={(e) => setInternship({ ...internship, duration: e.target.value })}
                      className="w-full bg-navy-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Execution Mode *
                    </label>
                    <select
                      value={internship.mode}
                      onChange={(e) =>
                        setInternship({
                          ...internship,
                          mode: e.target.value as "Remote" | "On-site" | "Hybrid",
                        })
                      }
                      className="w-full bg-navy-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="Remote">Remote</option>
                      <option value="On-site">On-site</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Start Date *</label>
                    <input
                      type="date"
                      value={internship.startDate}
                      onChange={(e) => setInternship({ ...internship, startDate: e.target.value })}
                      className="w-full bg-navy-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">End Date *</label>
                    <input
                      type="date"
                      value={internship.endDate}
                      onChange={(e) => setInternship({ ...internship, endDate: e.target.value })}
                      className="w-full bg-navy-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Batch & Working Hours */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Batch Code *</label>
                    <input
                      type="text"
                      value={internship.batch}
                      onChange={(e) => setInternship({ ...internship, batch: e.target.value })}
                      className="w-full bg-navy-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Working Hours *
                    </label>
                    <input
                      type="text"
                      value={internship.workingHours}
                      onChange={(e) =>
                        setInternship({ ...internship, workingHours: e.target.value })
                      }
                      className="w-full bg-navy-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Mentors */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Reporting Mentor *
                    </label>
                    <input
                      type="text"
                      value={internship.reportingMentor}
                      onChange={(e) =>
                        setInternship({ ...internship, reportingMentor: e.target.value })
                      }
                      className="w-full bg-navy-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Reporting Manager *
                    </label>
                    <input
                      type="text"
                      value={internship.reportingManager}
                      onChange={(e) =>
                        setInternship({ ...internship, reportingManager: e.target.value })
                      }
                      className="w-full bg-navy-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Stipend (Optional) */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Stipend (Optional — Leave blank for Unpaid/Academic)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹5,000 / month or Performance-based"
                    value={internship.stipend}
                    onChange={(e) => setInternship({ ...internship, stipend: e.target.value })}
                    className="w-full bg-navy-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Prompt Rule: Do not promise a stipend unless you explicitly enter one.
                  </p>
                </div>

                {/* Additional Instructions */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Additional Instructions / Provisions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={internship.additionalInstructions || ""}
                    onChange={(e) =>
                      setInternship({ ...internship, additionalInstructions: e.target.value })
                    }
                    className="w-full bg-navy-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RIGHT COLUMN: REALISTIC A4 CORPORATE DOCUMENT PREVIEW */}
        {(activeTab === "preview" || activeTab === "split") && (
          <div
            className={`space-y-3 ${
              activeTab === "split" ? "lg:col-span-7" : "lg:col-span-12"
            }`}
          >
            {/* Preview Toolbar */}
            <div className="flex items-center justify-between p-3 bg-navy-900 border border-slate-800 rounded-xl text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <span>Live A4 Letterhead Preview (A4 Portrait • 210 × 297mm)</span>
              </span>

              {/* Zoom controls */}
              <div className="flex items-center gap-1.5 bg-navy-950 px-2 py-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setPreviewZoom((z) => Math.max(0.5, z - 0.1))}
                  className="p-1 text-slate-400 hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono text-slate-300 w-12 text-center">
                  {Math.round(previewZoom * 100)}%
                </span>
                <button
                  onClick={() => setPreviewZoom((z) => Math.min(1.3, z + 0.1))}
                  className="p-1 text-slate-400 hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewZoom(0.9)}
                  className="p-1 text-slate-400 hover:text-white text-[10px] ml-1"
                  title="Reset Zoom"
                >
                  100%
                </button>
              </div>
            </div>

            {/* Document Render Container with Zoom & Scroll */}
            <div className="overflow-auto max-h-[85vh] p-4 bg-slate-900/60 rounded-2xl border border-slate-800 flex justify-center shadow-inner">
              <div
                style={{
                  transform: `scale(${previewZoom})`,
                  transformOrigin: "top center",
                  transition: "transform 0.15s ease",
                  marginBottom: `${(1 - previewZoom) * -200}px`,
                }}
              >
                <OfferLetterDocument
                  id="live-offer-document"
                  offer={currentOfferRecord}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
