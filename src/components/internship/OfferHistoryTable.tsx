"use client";

import React, { useState } from "react";
import {
  Search,
  FileText,
  Download,
  Mail,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  FileCode,
} from "lucide-react";
import { OfferLetterRecord } from "@/types/internship";
import { generateOfferLetterDocx } from "@/lib/docx-generator";

interface OfferHistoryTableProps {
  offers: OfferLetterRecord[];
  onPreviewOffer: (offer: OfferLetterRecord) => void;
  onSendEmail: (offer: OfferLetterRecord) => void;
  onUpdateStatus: (offerId: string, status: "generated" | "sent" | "accepted" | "declined") => void;
}

export const OfferHistoryTable: React.FC<OfferHistoryTableProps> = ({
  offers,
  onPreviewOffer,
  onSendEmail,
  onUpdateStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isExportingDocx, setIsExportingDocx] = useState<string | null>(null);

  const filteredOffers = (offers || []).filter((o) => {
    if (!o) return false;
    const ref = o.referenceNumber || "";
    const name = o.candidate?.fullName || "";
    const email = o.candidate?.email || "";
    const domain = o.internship?.domain || "";
    const batch = o.internship?.batch || "";
    const matchesSearch =
      ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDownloadDocx = async (offer: OfferLetterRecord) => {
    try {
      setIsExportingDocx(offer.id);
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
      console.error("Failed to generate docx", e);
      alert("Failed to export DOCX. Please try again.");
    } finally {
      setIsExportingDocx(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ref number, candidate name, domain, batch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-navy-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-navy-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Document Statuses ({offers.length})</option>
          <option value="generated">Generated (Pending Dispatch)</option>
          <option value="sent">Dispatched / Sent</option>
          <option value="accepted">Accepted by Candidate</option>
          <option value="declined">Declined</option>
        </select>
      </div>

      {/* Offers Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-navy-900/60 shadow-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-navy-950 text-slate-400 text-[11px] uppercase tracking-wider">
            <tr>
              <th className="p-3.5 border-b border-slate-800">Reference No</th>
              <th className="p-3.5 border-b border-slate-800">Candidate</th>
              <th className="p-3.5 border-b border-slate-800">Domain & Batch</th>
              <th className="p-3.5 border-b border-slate-800">Issue Date</th>
              <th className="p-3.5 border-b border-slate-800">Version</th>
              <th className="p-3.5 border-b border-slate-800">Status</th>
              <th className="p-3.5 border-b border-slate-800 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredOffers.map((offer) => (
              <tr key={offer.id} className="hover:bg-slate-800/40 transition-colors">
                {/* Reference */}
                <td className="p-3.5">
                  <span className="font-mono font-bold text-blue-400">
                    {offer.referenceNumber}
                  </span>
                </td>

                {/* Candidate */}
                <td className="p-3.5">
                  <p className="font-bold text-white text-xs">{offer.candidate.fullName}</p>
                  <p className="text-[11px] text-slate-400">{offer.candidate.email}</p>
                  <p className="text-[10px] text-slate-500 truncate max-w-[200px]">
                    {offer.candidate.college}
                  </p>
                </td>

                {/* Domain & Batch */}
                <td className="p-3.5">
                  <p className="font-medium text-slate-200">{offer.internship.domain}</p>
                  <p className="text-[11px] text-slate-400">Batch: {offer.internship.batch}</p>
                </td>

                {/* Issue Date */}
                <td className="p-3.5 text-slate-300">
                  {new Date(offer.issueDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>

                {/* Version */}
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                    v{offer.version || 1}
                  </span>
                </td>

                {/* Status Dropdown */}
                <td className="p-3.5">
                  <select
                    value={offer.status}
                    onChange={(e) =>
                      onUpdateStatus(
                        offer.id,
                        e.target.value as "generated" | "sent" | "accepted" | "declined"
                      )
                    }
                    className={`text-[11px] font-semibold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                      offer.status === "accepted"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        : offer.status === "sent"
                        ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                        : offer.status === "declined"
                        ? "bg-red-500/20 text-red-300 border-red-500/30"
                        : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                    }`}
                  >
                    <option value="generated" className="bg-navy-900 text-white">Generated</option>
                    <option value="sent" className="bg-navy-900 text-white">Sent</option>
                    <option value="accepted" className="bg-navy-900 text-white">Accepted</option>
                    <option value="declined" className="bg-navy-900 text-white">Declined</option>
                  </select>
                </td>

                {/* Actions */}
                <td className="p-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onPreviewOffer(offer)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Preview Document"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDownloadDocx(offer)}
                      disabled={isExportingDocx === offer.id}
                      className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 transition-colors"
                      title="Download Word Document (.DOCX)"
                    >
                      <FileCode className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onSendEmail(offer)}
                      className="p-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 transition-colors"
                      title="Email Offer Letter"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOffers.length === 0 && (
          <div className="p-10 text-center">
            <FileText className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-slate-400 text-xs">
              No offer letter records match your filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
