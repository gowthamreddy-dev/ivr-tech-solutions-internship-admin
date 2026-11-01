"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  UserPlus,
  FileCheck,
  Edit2,
  Trash2,
  AlertCircle,
  Building,
  GraduationCap,
  Mail,
  Phone,
  Calendar,
  X,
} from "lucide-react";
import { Candidate, CandidateStatus } from "@/types/internship";
import { DEFAULT_DOMAINS } from "@/lib/internship-storage";

interface CandidateManagerProps {
  candidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
  onUpdateCandidate: (candidate: Candidate) => void;
  onDeleteCandidate: (id: string) => void;
  onOpenSyncModal: () => void;
}

export const CandidateManager: React.FC<CandidateManagerProps> = ({
  candidates,
  onSelectCandidate,
  onUpdateCandidate,
  onDeleteCandidate,
  onOpenSyncModal,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Edit / Add modal state
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New candidate form state
  const [newCandidate, setNewCandidate] = useState<Partial<Candidate>>({
    fullName: "",
    email: "",
    phone: "",
    college: "",
    university: "",
    degree: "B.Tech",
    department: "Computer Science and Engineering",
    academicYear: "Final Year (2025-2026)",
    domain: "Python Development",
    applicationDate: new Date().toISOString().split("T")[0],
    status: "new",
    source: "manual",
  });

  const filteredCandidates = (candidates || []).filter((c) => {
    if (!c) return false;
    const name = c.fullName || "";
    const email = c.email || "";
    const phone = c.phone || "";
    const college = c.college || "";
    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phone.includes(searchQuery) ||
      college.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = selectedDomain === "all" || c.domain === selectedDomain;
    const matchesStatus = selectedStatus === "all" || c.status === selectedStatus;
    return matchesSearch && matchesDomain && matchesStatus;
  });

  const getStatusBadge = (status: CandidateStatus) => {
    switch (status) {
      case "offer_generated":
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">Offer Generated</span>;
      case "offer_sent":
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">Offer Sent</span>;
      case "accepted":
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Accepted</span>;
      case "declined":
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-500/20 text-red-300 border border-red-500/30">Declined</span>;
      case "selected":
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">Selected</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-500/20 text-slate-300 border border-slate-500/30">New Applicant</span>;
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCandidate) return;
    onUpdateCandidate(editingCandidate);
    setEditingCandidate(null);
  };

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidate.fullName || !newCandidate.email) return;
    const cand: Candidate = {
      id: `cand-manual-${Date.now()}`,
      fullName: newCandidate.fullName || "",
      email: newCandidate.email || "",
      phone: newCandidate.phone || "",
      college: newCandidate.college || "",
      university: newCandidate.university || "",
      degree: newCandidate.degree || "B.Tech",
      department: newCandidate.department || "Computer Science",
      academicYear: newCandidate.academicYear || "Final Year",
      domain: newCandidate.domain || "Python Development",
      applicationDate: newCandidate.applicationDate || new Date().toISOString().split("T")[0],
      status: (newCandidate.status as CandidateStatus) || "selected",
      source: "manual",
      notes: newCandidate.notes,
    };
    onUpdateCandidate(cand);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Search & Actions Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex flex-1 gap-2 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search candidate by name, email, phone, college..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-navy-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Domain Filter */}
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="bg-navy-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Domains ({candidates.length})</option>
            {DEFAULT_DOMAINS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-navy-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="selected">Selected</option>
            <option value="offer_generated">Offer Generated</option>
            <option value="offer_sent">Offer Sent</option>
            <option value="accepted">Accepted</option>
            <option value="declined">Declined</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSyncModal}
            className="px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>Sync Google Form</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-blue-600/20 transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Candidate</span>
          </button>
        </div>
      </div>

      {/* Candidates List / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCandidates.map((candidate) => (
          <div
            key={candidate.id}
            className={`rounded-2xl p-4 border transition-all flex flex-col justify-between ${
              candidate.isDuplicate
                ? "bg-amber-950/20 border-amber-500/40 hover:border-amber-400"
                : "bg-navy-900/90 border-slate-800 hover:border-blue-500/50"
            }`}
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-bold text-white text-sm leading-tight">
                    {candidate.fullName}
                  </h3>
                  <p className="text-xs text-blue-400 font-medium mt-0.5">
                    {candidate.domain}
                  </p>
                </div>
                {getStatusBadge(candidate.status)}
              </div>

              {/* Duplicate Notice */}
              {candidate.isDuplicate && (
                <div className="mb-2 px-2 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg text-[10px] text-amber-300 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>Duplicate email or phone detected</span>
                </div>
              )}

              {/* Details */}
              <div className="space-y-1.5 text-xs text-slate-300 my-3">
                <div className="flex items-center gap-2 text-slate-400">
                  <GraduationCap className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">
                    {candidate.degree} - {candidate.department}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Building className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{candidate.college}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{candidate.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Phone className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span>+91 {candidate.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <Calendar className="w-3 h-3 shrink-0" />
                  <span>Applied: {candidate.applicationDate}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 mt-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditingCandidate(candidate)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Edit Candidate Details"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteCandidate(candidate.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Delete Candidate"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => onSelectCandidate(candidate)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Generate Offer</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCandidates.length === 0 && (
        <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl bg-navy-950/40">
          <p className="text-slate-400 text-sm">No candidates match your current search or filters.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedDomain("all");
              setSelectedStatus("all");
            }}
            className="mt-3 text-xs text-blue-400 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Edit Candidate Modal */}
      {editingCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md">
          <div className="bg-navy-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-white text-base">Edit Candidate Information</h3>
              <button
                onClick={() => setEditingCandidate(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingCandidate.fullName}
                  onChange={(e) =>
                    setEditingCandidate({ ...editingCandidate, fullName: e.target.value })
                  }
                  className="w-full bg-navy-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editingCandidate.email}
                    onChange={(e) =>
                      setEditingCandidate({ ...editingCandidate, email: e.target.value })
                    }
                    className="w-full bg-navy-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editingCandidate.phone}
                    onChange={(e) =>
                      setEditingCandidate({ ...editingCandidate, phone: e.target.value })
                    }
                    className="w-full bg-navy-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">College Name</label>
                <input
                  type="text"
                  value={editingCandidate.college}
                  onChange={(e) =>
                    setEditingCandidate({ ...editingCandidate, college: e.target.value })
                  }
                  className="w-full bg-navy-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Degree</label>
                  <input
                    type="text"
                    value={editingCandidate.degree}
                    onChange={(e) =>
                      setEditingCandidate({ ...editingCandidate, degree: e.target.value })
                    }
                    className="w-full bg-navy-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Department</label>
                  <input
                    type="text"
                    value={editingCandidate.department}
                    onChange={(e) =>
                      setEditingCandidate({ ...editingCandidate, department: e.target.value })
                    }
                    className="w-full bg-navy-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Internship Domain</label>
                  <select
                    value={editingCandidate.domain}
                    onChange={(e) =>
                      setEditingCandidate({ ...editingCandidate, domain: e.target.value })
                    }
                    className="w-full bg-navy-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  >
                    {DEFAULT_DOMAINS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Status</label>
                  <select
                    value={editingCandidate.status}
                    onChange={(e) =>
                      setEditingCandidate({
                        ...editingCandidate,
                        status: e.target.value as CandidateStatus,
                      })
                    }
                    className="w-full bg-navy-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="new">New</option>
                    <option value="selected">Selected</option>
                    <option value="offer_generated">Offer Generated</option>
                    <option value="offer_sent">Offer Sent</option>
                    <option value="accepted">Accepted</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingCandidate(null)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Candidate Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md">
          <div className="bg-navy-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-white text-base">Add New Candidate Manually</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveNew} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={newCandidate.fullName}
                  onChange={(e) => setNewCandidate({ ...newCandidate, fullName: e.target.value })}
                  className="w-full bg-navy-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Email Address *</label>
                  <input
                    type="email"
                    placeholder="candidate@gmail.com"
                    value={newCandidate.email}
                    onChange={(e) => setNewCandidate({ ...newCandidate, email: e.target.value })}
                    className="w-full bg-navy-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    placeholder="9876543210"
                    value={newCandidate.phone}
                    onChange={(e) => setNewCandidate({ ...newCandidate, phone: e.target.value })}
                    className="w-full bg-navy-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">College Name *</label>
                <input
                  type="text"
                  placeholder="College of Engineering..."
                  value={newCandidate.college}
                  onChange={(e) => setNewCandidate({ ...newCandidate, college: e.target.value })}
                  className="w-full bg-navy-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Degree</label>
                  <input
                    type="text"
                    value={newCandidate.degree}
                    onChange={(e) => setNewCandidate({ ...newCandidate, degree: e.target.value })}
                    className="w-full bg-navy-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Department</label>
                  <input
                    type="text"
                    value={newCandidate.department}
                    onChange={(e) =>
                      setNewCandidate({ ...newCandidate, department: e.target.value })
                    }
                    className="w-full bg-navy-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Domain</label>
                  <select
                    value={newCandidate.domain}
                    onChange={(e) => setNewCandidate({ ...newCandidate, domain: e.target.value })}
                    className="w-full bg-navy-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  >
                    {DEFAULT_DOMAINS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Status</label>
                  <select
                    value={newCandidate.status}
                    onChange={(e) =>
                      setNewCandidate({ ...newCandidate, status: e.target.value as CandidateStatus })
                    }
                    className="w-full bg-navy-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="selected">Selected</option>
                    <option value="new">New</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg"
                >
                  Add Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
