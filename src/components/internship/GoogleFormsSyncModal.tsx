"use client";

import React, { useState } from "react";
import {
  X,
  FileSpreadsheet,
  Upload,
  Link as LinkIcon,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import {
  GOOGLE_FORM_URL,
  parseExcelOrCsvFile,
  fetchGoogleSheetCsv,
  convertRowsToCandidates,
  ColumnMapping,
  ParsedSpreadsheetResult,
} from "@/lib/google-forms-sync";
import { Candidate } from "@/types/internship";

interface GoogleFormsSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingCandidates: Candidate[];
  onImportComplete: (candidates: Candidate[]) => void;
}

export const GoogleFormsSyncModal: React.FC<GoogleFormsSyncModalProps> = ({
  isOpen,
  onClose,
  existingCandidates,
  onImportComplete,
}) => {
  const [activeTab, setActiveTab] = useState<"sheet" | "file">("sheet");
  const [sheetInput, setSheetInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parsed state
  const [parsedData, setParsedData] = useState<ParsedSpreadsheetResult | null>(null);
  const [mapping, setMapping] = useState<ColumnMapping | null>(null);
  const [previewCandidates, setPreviewCandidates] = useState<Candidate[]>([]);
  const [dupCount, setDupCount] = useState(0);

  if (!isOpen) return null;

  const handleFetchSheet = async () => {
    if (!sheetInput.trim()) {
      setError("Please enter a valid Google Sheet URL or Sheet ID.");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const result = await fetchGoogleSheetCsv(sheetInput);
      processParsedResult(result);
    } catch (err: any) {
      setError(err.message || "Failed to fetch spreadsheet. Make sure sharing is enabled.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setIsLoading(true);
    try {
      const result = await parseExcelOrCsvFile(file);
      processParsedResult(result);
    } catch (err: any) {
      setError(err.message || "Failed to parse file.");
    } finally {
      setIsLoading(false);
    }
  };

  const processParsedResult = (result: ParsedSpreadsheetResult) => {
    setParsedData(result);
    setMapping(result.suggestedMapping);
    const converted = convertRowsToCandidates(
      result.rawRows,
      result.suggestedMapping,
      existingCandidates
    );
    setPreviewCandidates(converted.candidates);
    setDupCount(converted.duplicatesCount);
  };

  const handleMappingChange = (field: keyof ColumnMapping, value: string) => {
    if (!mapping || !parsedData) return;
    const updated = { ...mapping, [field]: value };
    setMapping(updated);
    const converted = convertRowsToCandidates(
      parsedData.rawRows,
      updated,
      existingCandidates
    );
    setPreviewCandidates(converted.candidates);
    setDupCount(converted.duplicatesCount);
  };

  const handleConfirmImport = () => {
    if (previewCandidates.length === 0) return;
    onImportComplete(previewCandidates);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-navy-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Google Forms & Sheets Sync</h2>
              <p className="text-xs text-slate-400">
                Retrieve candidate application responses dynamically
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
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Active Google Form Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-navy-800 to-navy-900 border border-blue-500/30 flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                Connected Google Form
              </span>
              <p className="font-semibold text-white text-sm">
                IVR Internship Application Form
              </p>
              <a
                href={GOOGLE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:underline flex items-center gap-1 mt-0.5"
              >
                {GOOGLE_FORM_URL}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <a
              href={GOOGLE_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              Open Form <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Sync Method Tabs */}
          <div className="flex border-b border-slate-800">
            <button
              onClick={() => setActiveTab("sheet")}
              className={`pb-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
                activeTab === "sheet"
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              <LinkIcon className="w-4 h-4" /> Live Google Sheet Sync
            </button>
            <button
              onClick={() => setActiveTab("file")}
              className={`pb-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
                activeTab === "file"
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              <Upload className="w-4 h-4" /> CSV / XLSX File Upload (Backup)
            </button>
          </div>

          {/* Tab 1: Google Sheet URL */}
          {activeTab === "sheet" && (
            <div className="space-y-3">
              <label className="block text-xs font-medium text-slate-300">
                Google Sheets Response URL or Sheet ID
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://docs.google.com/spreadsheets/d/your-sheet-id/edit"
                  value={sheetInput}
                  onChange={(e) => setSheetInput(e.target.value)}
                  className="flex-1 bg-navy-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleFetchSheet}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  Sync Responses
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Tip: In Google Sheets, click <strong>File &gt; Share &gt; Anyone with the link (Viewer)</strong> or <strong>Share &gt; Publish to web</strong> for seamless automatic sync.
              </p>
            </div>
          )}

          {/* Tab 2: File Upload */}
          {activeTab === "file" && (
            <div className="border-2 border-dashed border-slate-700 hover:border-blue-500/50 rounded-2xl p-6 text-center transition-colors">
              <Upload className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-white">
                Upload Google Forms Response CSV or Excel (.xlsx)
              </p>
              <p className="text-[11px] text-slate-400 mt-1 mb-3">
                Download responses directly from Google Forms / Sheets and drop the file here.
              </p>
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer transition-colors">
                <span>Choose File</span>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Parsed Results & Column Mapper */}
          {parsedData && mapping && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Dynamic Column Mapping ({parsedData.rawRows.length} Submissions Found)
                </h3>
                {dupCount > 0 && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {dupCount} Duplicate(s) Detected
                  </span>
                )}
              </div>

              {/* Column Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 bg-navy-950 p-4 rounded-xl border border-slate-800">
                {[
                  { key: "fullName" as const, label: "Full Name *" },
                  { key: "email" as const, label: "Email Address *" },
                  { key: "phone" as const, label: "Mobile / WhatsApp *" },
                  { key: "college" as const, label: "College Name *" },
                  { key: "university" as const, label: "University Name" },
                  { key: "degree" as const, label: "Degree (e.g. B.Tech)" },
                  { key: "department" as const, label: "Department / Branch" },
                  { key: "academicYear" as const, label: "Academic Year" },
                  { key: "domain" as const, label: "Internship Domain" },
                  { key: "applicationDate" as const, label: "Application Date / Timestamp" },
                ].map((item) => (
                  <div key={item.key}>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      {item.label}
                    </label>
                    <select
                      value={mapping[item.key] || ""}
                      onChange={(e) => handleMappingChange(item.key, e.target.value)}
                      className="w-full bg-navy-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="">-- Ignore / Not in Sheet --</option>
                      {parsedData.headers.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {/* Preview Table */}
              <div>
                <h4 className="text-xs font-semibold text-slate-300 mb-2">
                  Candidates Preview ({previewCandidates.length})
                </h4>
                <div className="max-h-48 overflow-y-auto border border-slate-800 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-navy-950 text-slate-400 text-[11px] sticky top-0">
                      <tr>
                        <th className="p-2 border-b border-slate-800">Name</th>
                        <th className="p-2 border-b border-slate-800">Email</th>
                        <th className="p-2 border-b border-slate-800">Phone</th>
                        <th className="p-2 border-b border-slate-800">College</th>
                        <th className="p-2 border-b border-slate-800">Domain</th>
                        <th className="p-2 border-b border-slate-800">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {previewCandidates.slice(0, 15).map((cand) => (
                        <tr
                          key={cand.id}
                          className={`hover:bg-slate-800/40 ${cand.isDuplicate ? "bg-amber-500/5" : ""}`}
                        >
                          <td className="p-2 font-medium text-white">{cand.fullName}</td>
                          <td className="p-2 text-slate-300">{cand.email}</td>
                          <td className="p-2 text-slate-300">{cand.phone}</td>
                          <td className="p-2 text-slate-400">{cand.college}</td>
                          <td className="p-2 text-blue-400">{cand.domain}</td>
                          <td className="p-2">
                            {cand.isDuplicate ? (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300">
                                Duplicate
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300">
                                Ready
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-slate-800 bg-navy-950">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmImport}
            disabled={previewCandidates.length === 0}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
          >
            <CheckCircle className="w-4 h-4" />
            Import {previewCandidates.length} Candidates
          </button>
        </div>
      </div>
    </div>
  );
};
