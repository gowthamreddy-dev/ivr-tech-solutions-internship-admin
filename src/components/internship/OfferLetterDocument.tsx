"use client";

import React from "react";
import Image from "next/image";
import { OfferLetterRecord } from "@/types/internship";

interface OfferLetterDocumentProps {
  offer: OfferLetterRecord;
  id?: string;
  className?: string;
}

export const OfferLetterDocument: React.FC<OfferLetterDocumentProps> = ({
  offer,
  id = "offer-letter-document",
  className = "",
}) => {
  if (!offer || !offer.candidate) {
    return (
      <div
        id={id}
        className="bg-white text-slate-800 p-12 text-center rounded-2xl shadow-xl mx-auto"
        style={{ width: "210mm", minHeight: "297mm" }}
      >
        <p className="font-semibold text-sm">Document preview is preparing...</p>
      </div>
    );
  }

  const { candidate, internship, companySnapshot: company, signatorySnapshot: signatory } = offer;

  const formattedDate = offer.issueDate
    ? new Date(offer.issueDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-IN");

  const formattedStartDate = internship?.startDate
    ? new Date(internship.startDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  const formattedEndDate = internship?.endDate
    ? new Date(internship.endDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  const displayAddress =
    typeof company?.address === "string" && company.address.trim() ? company.address.trim() : "";

  return (
    <div
      id={id}
      className={`bg-white text-slate-900 font-sans shadow-2xl mx-auto print:shadow-none print:m-0 print:w-full ${className}`}
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "16mm 18mm",
        boxSizing: "border-box",
        fontSize: "13.5px",
        lineHeight: "1.55",
        color: "#0f172a",
        backgroundColor: "#ffffff",
      }}
    >
      {/* 1. CORPORATE LETTERHEAD */}
      <header className="border-b-2 border-[#0866E8] pb-4 mb-5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3.5">
            <div className="relative w-28 h-14 flex items-center justify-center">
              <img
                src={company.logoUrl || "/images/ivr-official-logo.png"}
                alt={company.name}
                className="max-h-14 w-auto object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-[#071B3A] leading-tight">
                {company.name}
              </h1>
              <p className="text-xs font-semibold text-[#0866E8] tracking-wide mt-0.5">
                {company.tagline}
              </p>
            </div>
          </div>

          {/* Company Contact Details */}
          <div className="text-right text-[11px] text-slate-600 leading-snug">
            <p className="font-semibold text-slate-800">{company.website}</p>
            <p>{company.email}</p>
            <p>+91 {company.phone}</p>
            {company.registrationNumber && (
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                {company.registrationNumber}
              </p>
            )}
          </div>
        </div>

        {/* Gold Accent Bar */}
        <div className="h-0.5 w-full bg-gradient-to-r from-[#071B3A] via-[#F5B82E] to-[#0866E8] mt-3" />
      </header>

      {/* 2. REFERENCE NUMBER & DATE STRIP */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-5 text-xs">
        <div>
          <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
            Reference No:
          </span>{" "}
          <span className="font-bold font-mono text-[#071B3A] text-[13px]">
            {offer.referenceNumber}
          </span>
          {offer.version > 1 && (
            <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-[#0866E8] rounded font-semibold text-[10px]">
              v{offer.version}
            </span>
          )}
        </div>
        <div>
          <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
            Date of Issue:
          </span>{" "}
          <span className="font-bold text-slate-900">{formattedDate}</span>
        </div>
      </div>

      {/* 3. DOCUMENT TITLE */}
      <div className="text-center my-4">
        <h2 className="text-lg font-extrabold uppercase tracking-wider text-[#071B3A] inline-block border-b-2 border-[#F5B82E] pb-1">
          Internship Offer & Appointment Letter
        </h2>
      </div>

      {/* 4. CANDIDATE ADDRESS BLOCK */}
      <div className="mb-4 bg-slate-50/80 border border-slate-200/80 rounded-lg p-3 text-xs leading-relaxed">
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">
          To Candidate:
        </p>
        <p className="font-bold text-sm text-[#071B3A]">{candidate.fullName}</p>
        <p className="text-slate-700 font-medium">
          {candidate.degree} - {candidate.department} ({candidate.academicYear})
        </p>
        <p className="text-slate-600">
          {candidate.college}
          {candidate.university ? `, ${candidate.university}` : ""}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-slate-500 text-[11px]">
          <span>Email: <strong className="text-slate-700">{candidate.email}</strong></span>
          <span>Contact: <strong className="text-slate-700">+91 {candidate.phone}</strong></span>
        </div>
      </div>

      {/* 5. FORMAL SELECTION ANNOUNCEMENT */}
      <div className="mb-4 text-xs leading-relaxed text-justify">
        <p className="font-bold text-[#071B3A] text-sm mb-1.5">
          Dear {candidate.fullName},
        </p>
        <p>
          Following your application and successful review of your technical credentials for our Corporate Internship Program, we are delighted to formally offer you an appointment as an{" "}
          <strong className="text-[#0866E8] font-bold">{internship.role}</strong> at{" "}
          <strong className="text-[#071B3A]">{company.name}</strong>.
        </p>
        <p className="mt-1">
          During this internship, you will be engaged in enterprise software engineering tasks, practical technology stacks, and industry-grade sprint workflows designed to sharpen your engineering skills and contribute to our mission of delivering forward-thinking digital solutions.
        </p>
      </div>

      {/* 6. INTERNSHIP SPECIFICATIONS TABLE */}
      <div className="mb-5 overflow-hidden rounded-lg border border-slate-200">
        <div className="bg-[#071B3A] text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center justify-between">
          <span>Internship Program Specifications</span>
          <span className="text-[#F5B82E] text-[11px]">Batch: {internship.batch}</span>
        </div>
        <table className="w-full text-left text-xs border-collapse">
          <tbody>
            <tr className="border-b border-slate-100 hover:bg-slate-50/50">
              <td className="p-2 font-bold text-slate-600 bg-slate-50/60 w-1/3">Internship Domain</td>
              <td className="p-2 font-bold text-[#0866E8]">{internship.domain}</td>
            </tr>
            <tr className="border-b border-slate-100 hover:bg-slate-50/50">
              <td className="p-2 font-bold text-slate-600 bg-slate-50/60">Designated Role</td>
              <td className="p-2 font-medium text-slate-900">{internship.role}</td>
            </tr>
            <tr className="border-b border-slate-100 hover:bg-slate-50/50">
              <td className="p-2 font-bold text-slate-600 bg-slate-50/60">Duration & Tenure</td>
              <td className="p-2 font-medium text-slate-900">
                <span className="font-bold">{internship.duration}</span> (From{" "}
                <span className="font-semibold text-[#071B3A]">{formattedStartDate}</span> to{" "}
                <span className="font-semibold text-[#071B3A]">{formattedEndDate}</span>)
              </td>
            </tr>
            <tr className="border-b border-slate-100 hover:bg-slate-50/50">
              <td className="p-2 font-bold text-slate-600 bg-slate-50/60">Execution Mode</td>
              <td className="p-2 font-medium text-slate-900">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700">
                  {internship.mode}
                </span>
              </td>
            </tr>
            <tr className="border-b border-slate-100 hover:bg-slate-50/50">
              <td className="p-2 font-bold text-slate-600 bg-slate-50/60">Reporting Mentor & Manager</td>
              <td className="p-2 font-medium text-slate-900">
                Mentor: <span className="font-semibold">{internship.reportingMentor}</span> | Manager:{" "}
                <span className="font-semibold">{internship.reportingManager}</span>
              </td>
            </tr>
            <tr className="border-b border-slate-100 hover:bg-slate-50/50">
              <td className="p-2 font-bold text-slate-600 bg-slate-50/60">Working Hours</td>
              <td className="p-2 font-medium text-slate-900">{internship.workingHours}</td>
            </tr>
            <tr className="hover:bg-slate-50/50">
              <td className="p-2 font-bold text-slate-600 bg-slate-50/60">Stipend / Remuneration</td>
              <td className="p-2 font-medium">
                {internship.stipend ? (
                  <span className="text-[#0866E8] font-bold">{internship.stipend}</span>
                ) : (
                  <span className="text-slate-500 italic">
                    Academic Internship (Unpaid / Performance-Based Project Incentives)
                  </span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 7. TERMS AND CONDITIONS SECTION */}
      <div className="mb-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#071B3A] mb-2.5 pb-1 border-b border-slate-200">
          Terms & Conditions of Internship
        </h3>
        <div className="space-y-2.5 text-[11.5px] leading-relaxed text-slate-700 text-justify">
          {company.terms.map((term) => (
            <div key={term.id}>
              <p className="font-bold text-[#071B3A] text-xs mb-0.5">{term.title}</p>
              <p>{term.content}</p>
            </div>
          ))}
          {internship.additionalInstructions && (
            <div>
              <p className="font-bold text-[#071B3A] text-xs mb-0.5">
                Special Domain Instructions
              </p>
              <p>{internship.additionalInstructions}</p>
            </div>
          )}
        </div>
      </div>

      {/* 8. ACCEPTANCE AND AUTHORIZED SIGNATORY SECTION (STRICTLY TOGETHER, NO SEAL!) */}
      <div
        className="mt-6 pt-4 border-t-2 border-slate-200 page-break-inside-avoid"
        style={{ pageBreakInside: "avoid" }}
      >
        <div className="grid grid-cols-2 gap-8 items-start">
          {/* Candidate Acceptance Box */}
          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50 text-xs">
            <p className="font-bold text-[#071B3A] mb-1">Candidate Acceptance Undertaking</p>
            <p className="text-[11px] text-slate-600 italic mb-4 leading-normal">
              I have read, understood, and accept this internship offer together with the terms and conditions stated herein.
            </p>
            <div className="pt-6 border-b border-slate-400 mb-2">
              <span className="text-[10px] text-slate-400 font-medium">Candidate Signature</span>
            </div>
            <p className="font-bold text-slate-800 text-[11px]">{candidate.fullName}</p>
            <p className="text-[10px] text-slate-500">Date: ________________________</p>
          </div>

          {/* Authorized Signatory Box (NO SEAL!) */}
          <div className="text-left text-xs pl-2">
            <p className="font-bold text-[#071B3A] text-xs uppercase tracking-wide mb-1">
              For {company.name}
            </p>

            {/* Signature image if uploaded, or clean blank line */}
            <div className="h-16 flex items-end mb-1">
              {signatory.includeSignatureImage && signatory.signatureUrl ? (
                <img
                  src={signatory.signatureUrl}
                  alt="Authorized Signatory"
                  className="max-h-14 max-w-[170px] object-contain"
                  style={{ mixBlendMode: "multiply" }}
                />
              ) : (
                <div className="w-48 border-b-2 border-slate-800 pb-0.5">
                  <span className="text-[10px] text-slate-400">Authorized Signature</span>
                </div>
              )}
            </div>

            <div className="w-48 border-b border-slate-300 mb-1.5" />

            {/* Signatory Details */}
            <p className="font-bold text-sm text-[#071B3A] leading-tight">
              {signatory.name}
            </p>
            <p className="text-xs font-semibold text-[#0866E8] leading-tight mt-0.5">
              {signatory.designation}
            </p>
            <p className="text-[11px] font-medium text-slate-700 leading-tight">
              {company.name}
            </p>
            <div className="text-[10.5px] text-slate-500 mt-1 space-y-0.5">
              <p>Email: <span className="text-slate-700 font-medium">{signatory.email}</span></p>
              <p>Contact: <span className="text-slate-700 font-medium">+91 {signatory.phone}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* 9. DOCUMENT FOOTER */}
      <footer className="mt-6 pt-3 border-t border-slate-200 text-[10px] text-slate-500 text-center leading-relaxed">
        <p className="font-medium text-slate-600">
          {company.name}
          {displayAddress ? ` • Registered Office: ${displayAddress}` : ""}
        </p>
        <p className="text-slate-400 mt-0.5">
          This is an official document generated under the authority of {company.name}.
          Confidential & Proprietary.
        </p>
      </footer>
    </div>
  );
};
