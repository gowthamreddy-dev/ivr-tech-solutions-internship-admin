"use client";

import React, { useState } from "react";
import {
  X,
  Settings,
  Building2,
  UserCheck,
  FileText,
  Palette,
  Save,
  RotateCcw,
  Upload,
  CheckCircle2,
  Trash2,
  Plus,
  ShieldAlert,
} from "lucide-react";
import { CompanySettings, SignatorySettings } from "@/types/internship";
import {
  DEFAULT_COMPANY_SETTINGS,
  DEFAULT_SIGNATORY_SETTINGS,
} from "@/lib/internship-storage";

interface CompanySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  companySettings: CompanySettings;
  signatorySettings: SignatorySettings;
  onSaveCompanySettings: (settings: CompanySettings) => void;
  onSaveSignatorySettings: (settings: SignatorySettings) => void;
}

export const CompanySettingsModal: React.FC<CompanySettingsModalProps> = ({
  isOpen,
  onClose,
  companySettings,
  signatorySettings,
  onSaveCompanySettings,
  onSaveSignatorySettings,
}) => {
  const [activeTab, setActiveTab] = useState<"company" | "signatory" | "terms" | "branding">("signatory");

  // Local state for editing
  const [company, setCompany] = useState<CompanySettings>({ ...companySettings });
  const [signatory, setSignatory] = useState<SignatorySettings>({ ...signatorySettings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveCompanySettings(company);
    onSaveSignatorySettings(signatory);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleResetDefaults = () => {
    if (confirm("Reset company and signatory settings back to verified official defaults?")) {
      setCompany({ ...DEFAULT_COMPANY_SETTINGS });
      setSignatory({ ...DEFAULT_SIGNATORY_SETTINGS });
    }
  };

  const handleCustomLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCompany({ ...company, logoUrl: event.target.result as string });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCustomSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSignatory({
          ...signatory,
          signatureUrl: event.target.result as string,
          includeSignatureImage: true,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleTermChange = (index: number, field: "title" | "content", value: string) => {
    const updated = [...company.terms];
    updated[index] = { ...updated[index], [field]: value };
    setCompany({ ...company, terms: updated });
  };

  const handleAddTerm = () => {
    const newTerm = {
      id: `term-${Date.now()}`,
      title: `${company.terms.length + 1}. New Policy Clause`,
      content: "Enter corporate terms and conditions details here...",
    };
    setCompany({ ...company, terms: [...company.terms, newTerm] });
  };

  const handleDeleteTerm = (index: number) => {
    const updated = company.terms.filter((_, i) => i !== index);
    setCompany({ ...company, terms: updated });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-navy-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Company & Signatory Settings</h2>
              <p className="text-xs text-slate-400">
                Configure corporate identity, authorized signatory, and legal terms
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 px-6 gap-2 bg-navy-950/60">
          {[
            { id: "signatory" as const, label: "Authorized Signatory", icon: UserCheck },
            { id: "company" as const, label: "Company Profile", icon: Building2 },
            { id: "terms" as const, label: "Offer Letter Terms", icon: FileText },
            { id: "branding" as const, label: "Branding & Colors", icon: Palette },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
                  isActive
                    ? "border-blue-500 text-blue-400 bg-blue-500/5"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* TAB 1: AUTHORIZED SIGNATORY */}
          {activeTab === "signatory" && (
            <div className="space-y-5">
              {/* Notice regarding company seal policy */}
              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 flex items-start gap-3">
                <ShieldAlert className="w-4 h-4 mt-0.5 text-blue-400 shrink-0" />
                <div className="text-[11px] leading-relaxed">
                  <p className="font-bold text-white">Official IVR Signatory Policy</p>
                  <p>
                    IVR Tech Solutions currently does not use a company seal or stamp. All generated offer letters contain strictly the authorized signatory section with an optional genuine signature image.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Authorized Signatory Full Name *
                  </label>
                  <input
                    type="text"
                    value={signatory.name}
                    onChange={(e) => setSignatory({ ...signatory, name: e.target.value })}
                    className="w-full bg-navy-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    placeholder="Indla venkata Gowtham Kumar Reddy"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Designation / Title *
                  </label>
                  <input
                    type="text"
                    value={signatory.designation}
                    onChange={(e) => setSignatory({ ...signatory, designation: e.target.value })}
                    className="w-full bg-navy-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    placeholder="Managing Director"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Official Signatory Email *
                  </label>
                  <input
                    type="email"
                    value={signatory.email}
                    onChange={(e) => setSignatory({ ...signatory, email: e.target.value })}
                    className="w-full bg-navy-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    placeholder="admin@ivrtechsolution.in"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Official Contact Number *
                  </label>
                  <input
                    type="text"
                    value={signatory.phone}
                    onChange={(e) => setSignatory({ ...signatory, phone: e.target.value })}
                    className="w-full bg-navy-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    placeholder="8143177907"
                  />
                </div>
              </div>

              {/* Signature Image Configuration */}
              <div className="p-4 rounded-xl bg-navy-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">Signature Image Configuration</h4>
                    <p className="text-[11px] text-slate-400">
                      Signature image is optional. If toggled off, a clean blank signature line is rendered.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={signatory.includeSignatureImage}
                      onChange={(e) =>
                        setSignatory({ ...signatory, includeSignatureImage: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {signatory.includeSignatureImage && (
                  <div className="pt-2 flex items-center gap-6">
                    <div className="p-3 bg-white rounded-xl border border-slate-300 shadow-inner flex items-center justify-center w-48 h-20">
                      {signatory.signatureUrl ? (
                        <img
                          src={signatory.signatureUrl}
                          alt="Signature Preview"
                          className="max-h-16 max-w-full object-contain"
                        />
                      ) : (
                        <span className="text-slate-400 text-[10px]">No signature uploaded</span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Custom Signature</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCustomSignatureUpload}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setSignatory({
                            ...signatory,
                            signatureUrl: "/images/authorized-signatory.png",
                          })
                        }
                        className="block text-[11px] text-blue-400 hover:underline"
                      >
                        Reset to Official Uploaded Signature
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: COMPANY PROFILE */}
          {activeTab === "company" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Company Legal Name</label>
                  <input
                    type="text"
                    value={company.name}
                    onChange={(e) => setCompany({ ...company, name: e.target.value })}
                    className="w-full bg-navy-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Company Tagline</label>
                  <input
                    type="text"
                    value={company.tagline}
                    onChange={(e) => setCompany({ ...company, tagline: e.target.value })}
                    className="w-full bg-navy-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Official Company Email</label>
                  <input
                    type="email"
                    value={company.email}
                    onChange={(e) => setCompany({ ...company, email: e.target.value })}
                    className="w-full bg-navy-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Official Contact Number</label>
                  <input
                    type="text"
                    value={company.phone}
                    onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                    className="w-full bg-navy-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Website URL</label>
                  <input
                    type="text"
                    value={company.website}
                    onChange={(e) => setCompany({ ...company, website: e.target.value })}
                    className="w-full bg-navy-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Registration / CIN</label>
                  <input
                    type="text"
                    value={company.registrationNumber || ""}
                    onChange={(e) => setCompany({ ...company, registrationNumber: e.target.value })}
                    className="w-full bg-navy-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-medium">
                    Registered Office Address (Optional)
                  </label>
                  <span className="text-[10px] text-slate-500">
                    Leave blank if not yet confirmed for publication
                  </span>
                </div>
                <textarea
                  rows={2}
                  placeholder="No confirmed public office address currently. Leave empty to omit from offer letters and documents."
                  value={company.address || ""}
                  onChange={(e) => setCompany({ ...company, address: e.target.value })}
                  className="w-full bg-navy-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  IVR Tech Solutions currently operates without a published physical office location. This field is optional and completely hidden from generated offer letters, website, and templates when empty.
                </p>
              </div>

              {/* Logo Preview & Custom Upload */}
              <div className="p-4 rounded-xl bg-navy-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white rounded-xl border border-slate-300 w-32 h-14 flex items-center justify-center">
                    <img
                      src={company.logoUrl || "/images/ivr-official-logo.png"}
                      alt="Logo Preview"
                      className="max-h-12 w-auto object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">Official IVR Brand Logo</h4>
                    <p className="text-[11px] text-slate-400">
                      Crisp transparent high-resolution original logo
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer">
                    <Upload className="w-3.5 h-3.5 inline mr-1" />
                    <span>Change Logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCustomLogoUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setCompany({ ...company, logoUrl: "/images/ivr-official-logo.png" })
                    }
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TERMS & CONDITIONS */}
          {activeTab === "terms" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">
                    Default Offer Letter Clauses ({company.terms.length})
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Clauses appear on the generated letter. All clauses are editable.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddTerm}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Clause
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {company.terms.map((term, index) => (
                  <div
                    key={term.id}
                    className="p-3.5 rounded-xl bg-navy-950 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={term.title}
                        onChange={(e) => handleTermChange(index, "title", e.target.value)}
                        className="flex-1 bg-navy-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-bold text-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteTerm(index)}
                        className="p-1 text-slate-500 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={term.content}
                      onChange={(e) => handleTermChange(index, "content", e.target.value)}
                      className="w-full bg-navy-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: BRANDING & COLORS */}
          {activeTab === "branding" && (
            <div className="space-y-4">
              <p className="text-slate-400 text-xs">
                Official IVR Corporate Brand Palette for letterhead and generated documents.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { key: "brandNavy" as const, label: "Navy Blue (Primary)", value: company.brandNavy },
                  { key: "brandRoyalBlue" as const, label: "Royal Blue (Accent)", value: company.brandRoyalBlue },
                  { key: "brandGold" as const, label: "Gold (Highlight)", value: company.brandGold },
                  { key: "brandWhite" as const, label: "White (Background)", value: company.brandWhite },
                ].map((item) => (
                  <div key={item.key} className="p-3 bg-navy-950 border border-slate-800 rounded-xl space-y-2">
                    <div
                      className="h-10 rounded-lg border border-white/20"
                      style={{ backgroundColor: item.value }}
                    />
                    <label className="block text-[11px] font-semibold text-slate-300">
                      {item.label}
                    </label>
                    <input
                      type="text"
                      value={company[item.key]}
                      onChange={(e) => setCompany({ ...company, [item.key]: e.target.value })}
                      className="w-full bg-navy-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-slate-800 bg-navy-950">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Official Defaults</span>
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Saved Successfully!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Configuration</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
