"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  FileCheck2,
  Send,
  CheckCircle,
  Clock,
  XCircle,
  Building2,
  Settings,
  Mail,
  Download,
  Upload,
  RefreshCw,
  Plus,
  Shield,
  ExternalLink,
  ChevronRight,
  FileSpreadsheet,
  ArrowUpRight,
  Lock,
  Unlock,
} from "lucide-react";
import {
  Candidate,
  CompanySettings,
  SignatorySettings,
  OfferLetterRecord,
  DashboardStats,
  EmailLog,
} from "@/types/internship";
import {
  getCandidates,
  saveCandidates,
  addOrUpdateCandidate,
  deleteCandidate,
  getCompanySettings,
  saveCompanySettings,
  getSignatorySettings,
  saveSignatorySettings,
  getOfferLetters,
  saveOfferLetters,
  updateOfferStatus,
  getEmailLogs,
  getDashboardStats,
  exportFullDataBackup,
  importDataBackup,
} from "@/lib/internship-storage";
import { CandidateManager } from "@/components/internship/CandidateManager";
import { OfferGeneratorForm } from "@/components/internship/OfferGeneratorForm";
import { OfferHistoryTable } from "@/components/internship/OfferHistoryTable";
import { CompanySettingsModal } from "@/components/internship/CompanySettingsModal";
import { GoogleFormsSyncModal } from "@/components/internship/GoogleFormsSyncModal";
import { EmailDispatchModal } from "@/components/internship/EmailDispatchModal";
import { LivePreviewModal } from "@/components/internship/LivePreviewModal";
import { GOOGLE_FORM_URL } from "@/lib/google-forms-sync";

export default function InternshipGeneratorPage() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<
    "overview" | "candidates" | "generator" | "history" | "email_logs"
  >("overview");

  // Admin lock/unlock state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [adminPin, setAdminPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [isClientReady, setIsClientReady] = useState(false);

  // Core state loaded from persistence
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [offers, setOffers] = useState<OfferLetterRecord[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [companySettings, setCompanySettings] = useState<CompanySettings>(() => getCompanySettings());
  const [signatorySettings, setSignatorySettings] = useState<SignatorySettings>(() =>
    getSignatorySettings()
  );
  const [stats, setStats] = useState<DashboardStats>({
    totalCandidates: 0,
    selectedCandidates: 0,
    offersGenerated: 0,
    offersSent: 0,
    offersAccepted: 0,
    offersPending: 0,
    offersDeclined: 0,
  });

  // Modals state
  const [isCompanySettingsOpen, setIsCompanySettingsOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Active selections
  const [selectedCandidateForOffer, setSelectedCandidateForOffer] = useState<Candidate | null>(
    null
  );
  const [activeOfferForAction, setActiveOfferForAction] = useState<OfferLetterRecord | null>(null);

  // Load data on mount
  const refreshData = () => {
    try {
      const loadedCandidates = getCandidates();
      const loadedOffers = getOfferLetters();
      const loadedLogs = getEmailLogs();
      const loadedCompany = getCompanySettings();
      const loadedSignatory = getSignatorySettings();
      const loadedStats = getDashboardStats();

      setCandidates(loadedCandidates);
      setOffers(loadedOffers);
      setEmailLogs(loadedLogs);
      setCompanySettings(loadedCompany);
      setSignatorySettings(loadedSignatory);
      setStats(loadedStats);
    } catch (e) {
      console.error("Error refreshing data", e);
    }
  };

  useEffect(() => {
    setIsClientReady(true);
    refreshData();
  }, []);

  // Handlers
  const handleSelectCandidateToGenerate = (candidate: Candidate) => {
    setSelectedCandidateForOffer(candidate);
    setActiveTab("generator");
  };

  const handleUpdateCandidate = (candidate: Candidate) => {
    addOrUpdateCandidate(candidate);
    refreshData();
  };

  const handleDeleteCandidate = (id: string) => {
    if (confirm("Are you sure you want to delete this candidate record?")) {
      deleteCandidate(id);
      refreshData();
    }
  };

  const handleImportCandidates = (newCandidates: Candidate[]) => {
    const combined = [...newCandidates, ...candidates];
    saveCandidates(combined);
    refreshData();
  };

  const handleSaveOffer = (offer: OfferLetterRecord) => {
    refreshData();
  };

  const handleOpenEmailModal = (offer: OfferLetterRecord) => {
    setActiveOfferForAction(offer);
    setIsEmailModalOpen(true);
  };

  const handleOpenPreviewModal = (offer: OfferLetterRecord) => {
    setActiveOfferForAction(offer);
    setIsPreviewModalOpen(true);
  };

  const handleUpdateOfferStatus = (
    offerId: string,
    status: "generated" | "sent" | "accepted" | "declined"
  ) => {
    updateOfferStatus(offerId, status);
    refreshData();
  };

  const handleExportBackup = () => {
    const backupJson = exportFullDataBackup();
    const blob = new Blob([backupJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `IVR_Internship_Backup_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const success = importDataBackup(event.target.result as string);
        if (success) {
          refreshData();
          alert("Backup successfully restored!");
        } else {
          alert("Invalid backup file format.");
        }
      }
    };
    reader.readAsText(file);
  };

  if (!isClientReady) {
    return (
      <div className="min-h-screen bg-navy-950 text-white flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-medium">Loading IVR Document Suite...</p>
        </div>
      </div>
    );
  }

  // Authentication gate if locked
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4">
        <div className="bg-navy-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">IVR Document Suite</h1>
            <p className="text-xs text-slate-400 mt-1">
              Restricted Corporate Document Automation Access
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (adminPin === "ivr2026" || adminPin === "8143177907" || adminPin === "admin") {
                setIsAuthenticated(true);
                setPinError(false);
              } else {
                setPinError(true);
              }
            }}
            className="space-y-3"
          >
            <input
              type="password"
              placeholder="Enter Admin PIN (e.g. ivr2026)"
              value={adminPin}
              onChange={(e) => setAdminPin(e.target.value)}
              className="w-full bg-navy-950 border border-slate-700 rounded-xl px-4 py-3 text-center text-sm text-white tracking-widest placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            {pinError && (
              <p className="text-red-400 text-xs">Incorrect PIN. Try default: ivr2026</p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all"
            >
              Unlock Administration Suite
            </button>
            <button
              type="button"
              onClick={() => setIsAuthenticated(true)}
              className="text-xs text-slate-400 hover:text-slate-300 block w-full mt-2"
            >
              Quick Access Demo Mode
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col">
      {/* Top Corporate App Header */}
      <header className="sticky top-0 z-40 bg-navy-950/95 backdrop-blur-xl border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between flex-wrap gap-4">
          {/* Logo & Application Title */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 group focus:outline-none"
              title="Return to Main Website"
            >
              <div className="h-9 w-20 flex items-center justify-center">
                <img
                  src={companySettings.logoUrl || "/images/ivr-official-logo.png"}
                  alt="IVR Logo"
                  className="max-h-9 w-auto object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-extrabold text-sm text-white">IVR TECH</span>
                  <span className="font-bold text-sm text-blue-400">SOLUTIONS</span>
                </div>
                <span className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
                  Internship Offer Letter Suite
                </span>
              </div>
            </Link>

            <span className="h-5 w-px bg-slate-800 hidden md:block" />

            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-300">
              <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
              <span>Official Document Engine v2.0</span>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSyncModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Google Forms Sync</span>
            </button>

            <button
              onClick={() => setIsCompanySettingsOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Settings className="w-3.5 h-3.5 text-blue-400" />
              <span>Company Settings</span>
            </button>

            <div className="relative group">
              <button
                onClick={handleExportBackup}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Download JSON Backup"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            <a
              href="https://ivrtechsolution.in"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-navy-900 hover:bg-navy-800 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Open Official Corporate Website"
            >
              <span>Official Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            </a>
          </div>
        </div>

        {/* Executive Tab Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto space-x-1 py-1.5 border-t border-slate-800/80">
          {[
            { id: "overview" as const, label: "Dashboard & Analytics", icon: Shield },
            {
              id: "candidates" as const,
              label: `Candidate Pipeline (${candidates.length})`,
              icon: Users,
            },
            {
              id: "generator" as const,
              label: "Offer Letter Generator",
              icon: FileCheck2,
            },
            {
              id: "history" as const,
              label: `Document Archive (${offers.length})`,
              icon: Clock,
            },
            {
              id: "email_logs" as const,
              label: `Email Logs (${emailLogs.length})`,
              icon: Mail,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* TAB 1: OVERVIEW & DASHBOARD */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="rounded-3xl p-6 bg-gradient-to-r from-blue-950/60 via-navy-900 to-navy-950 border border-blue-500/20 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Official MNC Letterhead Engine
                  </span>
                  <span className="text-xs text-slate-400">• Year {new Date().getFullYear()}</span>
                </div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  {companySettings.name}
                </h1>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Automated corporate offer letter generation, dynamic Google Sheets candidate synchronization, tamper-evident sequential numbering (<span className="text-blue-400 font-mono font-bold">IVR/INT/{new Date().getFullYear()}/0001</span>), and instant PDF/DOCX dispatch.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setIsSyncModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Sync Google Form</span>
                </button>
                <button
                  onClick={() => setActiveTab("generator")}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-2 border border-white/10 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Generate New Offer</span>
                </button>
              </div>
            </div>

            {/* Dashboard Statistics KPI Cards */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Key Performance Indicators (KPIs)
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
                {[
                  {
                    label: "Total Candidates",
                    value: stats.totalCandidates,
                    icon: Users,
                    color: "text-blue-400",
                    bg: "bg-blue-500/10 border-blue-500/20",
                  },
                  {
                    label: "Selected",
                    value: stats.selectedCandidates,
                    icon: CheckCircle,
                    color: "text-amber-400",
                    bg: "bg-amber-500/10 border-amber-500/20",
                  },
                  {
                    label: "Offers Generated",
                    value: stats.offersGenerated,
                    icon: FileCheck2,
                    color: "text-cyan-400",
                    bg: "bg-cyan-500/10 border-cyan-500/20",
                  },
                  {
                    label: "Offers Sent",
                    value: stats.offersSent,
                    icon: Send,
                    color: "text-purple-400",
                    bg: "bg-purple-500/10 border-purple-500/20",
                  },
                  {
                    label: "Accepted",
                    value: stats.offersAccepted,
                    icon: CheckCircle,
                    color: "text-emerald-400",
                    bg: "bg-emerald-500/10 border-emerald-500/20",
                  },
                  {
                    label: "Pending",
                    value: stats.offersPending,
                    icon: Clock,
                    color: "text-slate-300",
                    bg: "bg-slate-500/10 border-slate-500/20",
                  },
                  {
                    label: "Declined",
                    value: stats.offersDeclined,
                    icon: XCircle,
                    color: "text-red-400",
                    bg: "bg-red-500/10 border-red-500/20",
                  },
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border ${stat.bg} flex flex-col justify-between transition-all hover:scale-[1.02]`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-300">
                          {stat.label}
                        </span>
                        <Icon className={`w-4 h-4 ${stat.color}`} />
                      </div>
                      <p className={`text-2xl font-black mt-2 ${stat.color}`}>
                        {stat.value}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions & Overview Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Connected Google Form Widget */}
              <div className="p-5 rounded-2xl bg-navy-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-blue-400" />
                    <span>Google Form Integration</span>
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300">
                    Live Link
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Candidate responses submitted to the official Google Form can be retrieved in real time through the connected Google Sheets spreadsheet.
                </p>
                <div className="p-3 bg-navy-950 rounded-xl border border-slate-800 text-xs">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Target Form URL</p>
                  <a
                    href={GOOGLE_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline flex items-center gap-1 font-mono text-[11px] mt-0.5"
                  >
                    {GOOGLE_FORM_URL}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => setIsSyncModalOpen(true)}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sync Responses Now</span>
                  </button>
                </div>
              </div>

              {/* Authorized Signatory Widget */}
              <div className="p-5 rounded-2xl bg-navy-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-400" />
                    <span>Authorized Signatory</span>
                  </h3>
                  <button
                    onClick={() => setIsCompanySettingsOpen(true)}
                    className="text-xs text-blue-400 hover:underline"
                  >
                    Edit Details
                  </button>
                </div>
                <div className="p-3 bg-navy-950 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                  <p className="font-bold text-white">{signatorySettings.name}</p>
                  <p className="text-blue-400 font-medium">{signatorySettings.designation}</p>
                  <p className="text-slate-400 text-[11px]">{companySettings.name}</p>
                  <p className="text-slate-400 text-[11px]">
                    Email: {signatorySettings.email} | Contact: +91 {signatorySettings.phone}
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                      {signatorySettings.includeSignatureImage ? "Signature Image Active" : "Clean Line Only"}
                    </span>
                    <span className="text-emerald-400 font-semibold">No Seal / Stamp (MNC Standard)</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsCompanySettingsOpen(true)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Configure Signatory & Terms</span>
                </button>
              </div>

              {/* Recent Dispatched Offers Widget */}
              <div className="p-5 rounded-2xl bg-navy-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span>Recent Offers</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab("history")}
                    className="text-xs text-blue-400 hover:underline"
                  >
                    View All ({offers.length})
                  </button>
                </div>
                <div className="space-y-2">
                  {offers.slice(0, 3).map((offer) => (
                    <div
                      key={offer.id}
                      onClick={() => handleOpenPreviewModal(offer)}
                      className="p-2.5 bg-navy-950 hover:bg-slate-850 rounded-xl border border-slate-800 cursor-pointer transition-colors flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-white">{offer.candidate.fullName}</p>
                        <p className="font-mono text-[11px] text-blue-400">
                          {offer.referenceNumber}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                  ))}
                  {offers.length === 0 && (
                    <div className="p-4 text-center text-xs text-slate-500">
                      No offer letters generated yet. Select a candidate below to create one.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Candidate Table Preview */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">
                  Active Candidate Pipeline ({candidates.length})
                </h3>
                <button
                  onClick={() => setActiveTab("candidates")}
                  className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Open Full Candidate Pipeline</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <CandidateManager
                candidates={candidates}
                onSelectCandidate={handleSelectCandidateToGenerate}
                onUpdateCandidate={handleUpdateCandidate}
                onDeleteCandidate={handleDeleteCandidate}
                onOpenSyncModal={() => setIsSyncModalOpen(true)}
              />
            </div>
          </div>
        )}

        {/* TAB 2: CANDIDATE PIPELINE */}
        {activeTab === "candidates" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Candidate Application Management</h2>
                <p className="text-xs text-slate-400">
                  Search, review, filter, and select candidates from Google Forms responses
                </p>
              </div>
            </div>
            <CandidateManager
              candidates={candidates}
              onSelectCandidate={handleSelectCandidateToGenerate}
              onUpdateCandidate={handleUpdateCandidate}
              onDeleteCandidate={handleDeleteCandidate}
              onOpenSyncModal={() => setIsSyncModalOpen(true)}
            />
          </div>
        )}

        {/* TAB 3: OFFER LETTER GENERATOR */}
        {activeTab === "generator" && (
          <div className="space-y-4">
            <OfferGeneratorForm
              initialCandidate={selectedCandidateForOffer}
              candidates={candidates}
              companySettings={companySettings}
              signatorySettings={signatorySettings}
              onOfferSaved={handleSaveOffer}
              onOpenEmailModal={handleOpenEmailModal}
              onBackToCandidates={() => setActiveTab("candidates")}
            />
          </div>
        )}

        {/* TAB 4: DOCUMENT ARCHIVE & HISTORY */}
        {activeTab === "history" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Offer Letter Archive & Tracking</h2>
                <p className="text-xs text-slate-400">
                  Sequential reference numbers, regeneration version control, and multi-format exports
                </p>
              </div>
              <button
                onClick={() => setActiveTab("generator")}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create New Offer</span>
              </button>
            </div>
            <OfferHistoryTable
              offers={offers}
              onPreviewOffer={handleOpenPreviewModal}
              onSendEmail={handleOpenEmailModal}
              onUpdateStatus={handleUpdateOfferStatus}
            />
          </div>
        )}

        {/* TAB 5: EMAIL DISPATCH LOGS */}
        {activeTab === "email_logs" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white">Email Delivery Audit Logs</h2>
              <p className="text-xs text-slate-400">
                Complete history of dispatched internship offer letters and candidate communications
              </p>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-navy-900/60 shadow-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-navy-950 text-slate-400 text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5 border-b border-slate-800">Timestamp</th>
                    <th className="p-3.5 border-b border-slate-800">Reference No</th>
                    <th className="p-3.5 border-b border-slate-800">Recipient</th>
                    <th className="p-3.5 border-b border-slate-800">Subject</th>
                    <th className="p-3.5 border-b border-slate-800">Delivery Status</th>
                    <th className="p-3.5 border-b border-slate-800">Audit Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {emailLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 text-slate-400 whitespace-nowrap">
                        {new Date(log.sentAt).toLocaleString("en-IN")}
                      </td>
                      <td className="p-3.5 font-mono font-bold text-blue-400">
                        {log.referenceNumber}
                      </td>
                      <td className="p-3.5">
                        <p className="font-bold text-white">{log.recipientName}</p>
                        <p className="text-slate-400 text-[11px]">{log.recipientEmail}</p>
                      </td>
                      <td className="p-3.5 text-slate-300 max-w-xs truncate">
                        {log.subject}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {log.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-400 text-[11px]">
                        {log.notes || "Sent via corporate dispatcher"}
                      </td>
                    </tr>
                  ))}
                  {emailLogs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500 text-xs">
                        No email dispatch records found yet. Dispatched emails will be logged here.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* MODALS */}
      {/* 1. Google Forms Sync Modal */}
      <GoogleFormsSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        existingCandidates={candidates}
        onImportComplete={handleImportCandidates}
      />

      {/* 2. Company Settings Modal */}
      <CompanySettingsModal
        isOpen={isCompanySettingsOpen}
        onClose={() => setIsCompanySettingsOpen(false)}
        companySettings={companySettings}
        signatorySettings={signatorySettings}
        onSaveCompanySettings={(s) => {
          setCompanySettings(s);
          saveCompanySettings(s);
        }}
        onSaveSignatorySettings={(s) => {
          setSignatorySettings(s);
          saveSignatorySettings(s);
        }}
      />

      {/* 3. Email Dispatch Modal */}
      <EmailDispatchModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        offer={activeOfferForAction}
        onEmailSent={refreshData}
      />

      {/* 4. Live Preview Modal */}
      <LivePreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        offer={activeOfferForAction}
        onOpenEmailModal={handleOpenEmailModal}
      />
    </div>
  );
}
