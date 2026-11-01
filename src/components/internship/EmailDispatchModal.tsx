"use client";

import React, { useState } from "react";
import {
  X,
  Mail,
  Send,
  Paperclip,
  CheckCircle2,
  AlertTriangle,
  Copy,
  ExternalLink,
  Download,
  Settings,
  Sparkles,
  Key,
} from "lucide-react";
import { OfferLetterRecord, SmtpConfig } from "@/types/internship";
import { addEmailLog, getCompanySettings, saveCompanySettings } from "@/lib/internship-storage";
import { generateOfferLetterPdf } from "@/lib/pdf-generator";

interface EmailDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: OfferLetterRecord | null;
  onEmailSent?: () => void;
}

export const EmailDispatchModal: React.FC<EmailDispatchModalProps> = ({
  isOpen,
  onClose,
  offer,
  onEmailSent,
}) => {
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showSmtpConfig, setShowSmtpConfig] = useState(false);

  // Load existing company settings
  const companySettings = getCompanySettings();
  const [smtpConfig, setSmtpConfig] = useState<SmtpConfig>(() => {
    return (
      companySettings.smtp || {
        host: "smtppro.zoho.in",
        port: 465,
        secure: true,
        user: "admin@ivrtechsolution.in",
        pass: "",
        fromName: "IVR Tech Solutions",
      }
    );
  });

  if (!isOpen || !offer || !offer.candidate) return null;

  const candidate = offer.candidate;
  const company = offer.companySnapshot || companySettings;

  const defaultSubject = `Internship Offer Letter – IVR Tech Solutions Private Limited`;
  const defaultBody = `Dear ${candidate.fullName},

Congratulations!

We are pleased to inform you that you have been selected for the internship program at ${company.name}.

Please find your official internship offer letter attached (${offer.referenceNumber}).

Kindly review the offer details and confirm your acceptance.

We look forward to welcoming you to IVR Tech Solutions.

Regards,
HR / Internship Coordination Team
${company.name}.
Email: ${company.email}
Phone: +91 ${company.phone}
Website: ${company.website}`;

  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState(defaultBody);

  // Helper to convert blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Helper to trigger PDF download to user's device
  const downloadOfferPdf = async (): Promise<Blob> => {
    // Generate PDF from live preview or temporary element
    const elementId = document.getElementById("live-offer-document")
      ? "live-offer-document"
      : document.getElementById("modal-preview-doc")
      ? "modal-preview-doc"
      : "offer-letter-document";

    const blob = await generateOfferLetterPdf(elementId, offer);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = offer.pdfFileName || `${offer.referenceNumber.replace(/\//g, "_")}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return blob;
  };

  // 1. DIRECT SMTP DISPATCH (WITH PDF ATTACHMENT)
  const handleSendViaSmtp = async () => {
    setErrorMessage(null);
    setIsSending(true);

    try {
      // 1. Generate PDF blob and base64
      let pdfBase64 = "";
      try {
        const elementId = document.getElementById("live-offer-document")
          ? "live-offer-document"
          : document.getElementById("modal-preview-doc")
          ? "modal-preview-doc"
          : "offer-letter-document";
        const pdfBlob = await generateOfferLetterPdf(elementId, offer);
        pdfBase64 = await blobToBase64(pdfBlob);
      } catch (err) {
        console.warn("Could not capture DOM PDF directly, continuing with text email", err);
      }

      // Save updated smtp config if user entered password
      if (smtpConfig.pass) {
        saveCompanySettings({ ...companySettings, smtp: smtpConfig });
      }

      // 2. Dispatch to backend API
      const response = await fetch("/api/send-offer-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail: candidate.email,
          recipientName: candidate.fullName,
          subject,
          body,
          pdfBase64,
          pdfFileName: offer.pdfFileName,
          smtpConfig,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.needsAuth) {
          setShowSmtpConfig(true);
          setErrorMessage(
            "Zoho Mail / SMTP password not yet saved. Please enter your Zoho Mail App Password below or use 1-click Zoho Mail / Gmail dispatch."
          );
        } else {
          setErrorMessage(data.error || "Failed to deliver email through SMTP server.");
        }
        setIsSending(false);
        return;
      }

      // Successfully delivered
      addEmailLog({
        offerId: offer.id,
        referenceNumber: offer.referenceNumber,
        recipientEmail: candidate.email,
        recipientName: candidate.fullName,
        subject,
        status: "sent",
        notes: `Delivered via direct SMTP (${smtpConfig.user}) to ${candidate.email} with PDF attached. MessageID: ${data.messageId}`,
      });

      setIsSending(false);
      setSendSuccess(true);
      if (onEmailSent) onEmailSent();

      setTimeout(() => {
        setSendSuccess(false);
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error("Email send error", err);
      setErrorMessage(err.message || "Failed to deliver email. Check network or SMTP details.");
      setIsSending(false);
    }
  };

  // 2. ONE-CLICK ZOHO MAIL COMPOSE (OPENS ZOHO MAIL WITH PDF DOWNLOADED)
  const handleOpenZohoMail = async () => {
    // Download the PDF so it's ready in Downloads bar
    try {
      await downloadOfferPdf();
    } catch (e) {
      console.warn("PDF auto-download warning", e);
    }

    // Zoho Mail compose URL
    const zohoUrl = `https://mail.zoho.in/zm/#mail/compose/to=${encodeURIComponent(
      candidate.email
    )}&subject=${encodeURIComponent(subject)}&content=${encodeURIComponent(body)}`;

    window.open(zohoUrl, "_blank");

    addEmailLog({
      offerId: offer.id,
      referenceNumber: offer.referenceNumber,
      recipientEmail: candidate.email,
      recipientName: candidate.fullName,
      subject,
      status: "delivered",
      notes: "Dispatched via Zoho Mail Web Composer (PDF automatically downloaded for attachment)",
    });

    if (onEmailSent) onEmailSent();
  };

  // 3. ONE-CLICK GMAIL COMPOSE
  const handleOpenGmail = async () => {
    try {
      await downloadOfferPdf();
    } catch (e) {
      console.warn("PDF auto-download warning", e);
    }

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      candidate.email
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.open(gmailUrl, "_blank");

    addEmailLog({
      offerId: offer.id,
      referenceNumber: offer.referenceNumber,
      recipientEmail: candidate.email,
      recipientName: candidate.fullName,
      subject,
      status: "delivered",
      notes: "Dispatched via Gmail Web Composer (PDF automatically downloaded for attachment)",
    });

    if (onEmailSent) onEmailSent();
  };

  // 4. SYSTEM DEFAULT MAIL CLIENT (MAILTO)
  const handleOpenMailto = () => {
    const mailtoUrl = `mailto:${candidate.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;

    addEmailLog({
      offerId: offer.id,
      referenceNumber: offer.referenceNumber,
      recipientEmail: candidate.email,
      recipientName: candidate.fullName,
      subject,
      status: "delivered",
      notes: "Opened in default system mail client",
    });

    if (onEmailSent) onEmailSent();
  };

  const handleCopyBody = () => {
    navigator.clipboard.writeText(body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-navy-950/90 backdrop-blur-md overflow-y-auto">
      <div className="bg-navy-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl text-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-navy-950">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Email Offer Letter to Candidate
              </h2>
              <p className="text-xs text-slate-400">
                Direct dispatch to <strong className="text-white">{candidate.fullName}</strong> ({candidate.email})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Quick 1-Click Launch Bar (Zoho Mail & Gmail) */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-950/60 via-navy-800 to-purple-950/40 border border-blue-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Instant 1-Click Web Mail Dispatch</span>
              </span>
              <span className="text-[10px] text-blue-300">Auto-downloads PDF & fills email</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              {/* Zoho Mail Button */}
              <button
                type="button"
                onClick={handleOpenZohoMail}
                className="py-2 px-3 rounded-lg bg-[#0066cc]/30 hover:bg-[#0066cc]/50 border border-blue-400/40 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>📬 Open in Zoho Mail</span>
              </button>

              {/* Gmail Button */}
              <button
                type="button"
                onClick={handleOpenGmail}
                className="py-2 px-3 rounded-lg bg-red-600/25 hover:bg-red-600/40 border border-red-500/40 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>📧 Open in Gmail</span>
              </button>

              {/* Default Mail Client */}
              <button
                type="button"
                onClick={handleOpenMailto}
                className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>💻 Default Mail App</span>
              </button>
            </div>
          </div>

          {/* Recipient */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">To (Candidate Email)</label>
            <input
              type="text"
              readOnly
              value={`${candidate.fullName} <${candidate.email}>`}
              className="w-full bg-navy-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 font-medium text-xs"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">Email Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-navy-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Body */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-400 font-medium">Email Message Body</label>
              <button
                type="button"
                onClick={handleCopyBody}
                className="text-[11px] text-blue-400 hover:underline flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? "Copied to Clipboard!" : "Copy Text"}</span>
              </button>
            </div>
            <textarea
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full bg-navy-950 border border-slate-700 rounded-xl p-3 text-white font-sans text-xs focus:outline-none focus:border-blue-500 leading-relaxed"
            />
          </div>

          {/* Attachment Card & Quick PDF Download */}
          <div className="p-3 bg-navy-950 border border-slate-800 rounded-xl flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-purple-400" />
              <div>
                <p className="text-xs font-semibold text-white">
                  {offer.pdfFileName || `${offer.referenceNumber.replace(/\//g, "_")}.pdf`}
                </p>
                <p className="text-[10px] text-slate-400">
                  A4 Corporate Offer Letter Document
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={downloadOfferPdf}
              className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
            >
              <Download className="w-3 h-3" />
              <span>Download PDF File</span>
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">Dispatch Notification</p>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Collapsible Direct SMTP Configuration */}
          <div className="border border-slate-800 rounded-xl p-3 bg-navy-950/80 space-y-2">
            <button
              type="button"
              onClick={() => setShowSmtpConfig(!showSmtpConfig)}
              className="w-full flex items-center justify-between text-[11px] text-slate-300 hover:text-white"
            >
              <span className="flex items-center gap-1.5 font-semibold">
                <Key className="w-3.5 h-3.5 text-blue-400" />
                <span>Automated Server SMTP Settings (Zoho Mail / Custom)</span>
              </span>
              <span className="text-blue-400">{showSmtpConfig ? "Hide" : "Configure"}</span>
            </button>

            {showSmtpConfig && (
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                <div>
                  <label className="text-slate-400 block mb-0.5">SMTP Host</label>
                  <input
                    type="text"
                    value={smtpConfig.host}
                    onChange={(e) => setSmtpConfig({ ...smtpConfig, host: e.target.value })}
                    className="w-full bg-navy-900 border border-slate-700 rounded px-2.5 py-1 text-white"
                    placeholder="smtppro.zoho.in"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-0.5">SMTP Port</label>
                  <input
                    type="number"
                    value={smtpConfig.port}
                    onChange={(e) =>
                      setSmtpConfig({ ...smtpConfig, port: Number(e.target.value) })
                    }
                    className="w-full bg-navy-900 border border-slate-700 rounded px-2.5 py-1 text-white"
                    placeholder="465"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-0.5">Sender Username / Email</label>
                  <input
                    type="email"
                    value={smtpConfig.user}
                    onChange={(e) => setSmtpConfig({ ...smtpConfig, user: e.target.value })}
                    className="w-full bg-navy-900 border border-slate-700 rounded px-2.5 py-1 text-white"
                    placeholder="admin@ivrtechsolution.in"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-0.5">
                    Zoho App Password / SMTP Password
                  </label>
                  <input
                    type="password"
                    value={smtpConfig.pass}
                    onChange={(e) => setSmtpConfig({ ...smtpConfig, pass: e.target.value })}
                    className="w-full bg-navy-900 border border-slate-700 rounded px-2.5 py-1 text-white"
                    placeholder="Enter App Password from Zoho"
                  />
                </div>
                <div className="sm:col-span-2 text-[10px] text-slate-400">
                  Tip: In Zoho Mail, go to <strong>My Account &gt; Security &gt; App Passwords &gt; Generate New Password</strong> for secure automated sending.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-t border-slate-800 bg-navy-950">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSendViaSmtp}
              disabled={isSending}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
            >
              {sendSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Email Sent & Logged!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{isSending ? "Sending via Server..." : "Send Automated Email"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
