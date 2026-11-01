"use client";

import React, { useState } from "react";
import {
  X,
  Download,
  Printer,
  FileCode,
  ZoomIn,
  ZoomOut,
  Mail,
} from "lucide-react";
import { OfferLetterRecord } from "@/types/internship";
import { OfferLetterDocument } from "./OfferLetterDocument";
import { generateOfferLetterPdf, triggerBrowserPrint } from "@/lib/pdf-generator";
import { generateOfferLetterDocx } from "@/lib/docx-generator";

interface LivePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: OfferLetterRecord | null;
  onOpenEmailModal: (offer: OfferLetterRecord) => void;
}

export const LivePreviewModal: React.FC<LivePreviewModalProps> = ({
  isOpen,
  onClose,
  offer,
  onOpenEmailModal,
}) => {
  const [zoom, setZoom] = useState(0.9);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isGeneratingDocx, setIsGeneratingDocx] = useState(false);

  if (!isOpen || !offer || !offer.candidate) return null;

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      const blob = await generateOfferLetterPdf("modal-preview-doc", offer);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = offer.pdfFileName || `${offer.referenceNumber.replace(/\//g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("PDF generation failed", e);
      alert("Failed to render PDF.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadDocx = async () => {
    try {
      setIsGeneratingDocx(true);
      const blob = await generateOfferLetterDocx(offer);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = offer.docxFileName || `${offer.referenceNumber.replace(/\//g, "_")}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("DOCX generation failed", e);
      alert("Failed to generate DOCX.");
    } finally {
      setIsGeneratingDocx(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-navy-950/90 backdrop-blur-md">
      <div className="bg-navy-900 border border-slate-700 rounded-2xl w-full max-w-5xl h-[94vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-navy-950">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">
                  {offer.referenceNumber}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-300">
                  Version {offer.version || 1}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Offer Letter for {offer.candidate.fullName} ({offer.internship.domain})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center bg-navy-900 px-2 py-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
                className="p-1 text-slate-400 hover:text-white"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono text-slate-300 w-12 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom((z) => Math.min(1.3, z + 0.1))}
                className="p-1 text-slate-400 hover:text-white"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={triggerBrowserPrint}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Print"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={handleDownloadDocx}
              disabled={isGeneratingDocx}
              className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 text-xs font-semibold flex items-center gap-1.5"
            >
              <FileCode className="w-4 h-4" />
              <span>{isGeneratingDocx ? "Exporting..." : "DOCX"}</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/30"
            >
              <Download className="w-4 h-4" />
              <span>{isGeneratingPdf ? "Rendering..." : "PDF"}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenEmailModal(offer);
              }}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Body */}
        <div className="flex-1 overflow-auto p-6 bg-slate-900/60 flex justify-center">
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
              transition: "transform 0.15s ease",
              marginBottom: `${(1 - zoom) * -200}px`,
            }}
          >
            <OfferLetterDocument id="modal-preview-doc" offer={offer} />
          </div>
        </div>
      </div>
    </div>
  );
};
