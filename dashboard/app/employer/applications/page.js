"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";
import api from "@/utils/api";

const STATUS_FILTERS = ["All", "Pending", "Reviewed", "Interview", "Accepted", "Rejected"];

const STATUS_META = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: Clock,
  },
  reviewed: {
    label: "Reviewed",
    color: "bg-gray-100 text-gray-700 border-gray-200",
    icon: FileText,
  },
  interview: {
    label: "Interview",
    color: "bg-purple-100 text-purple-700 border-purple-200",
    icon: Calendar,
  },
  accepted: {
    label: "Accepted",
    color: "bg-green-100 text-green-700 border-green-200",
    icon: CheckCircle,
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: XCircle,
  },
};

const toDisplayStatus = (status) => STATUS_META[status]?.label || status?.charAt(0)?.toUpperCase() + status?.slice(1) || "Pending";

const formatDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return date.toLocaleString();
};

export default function EmployerApplicationsPage() {
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    interview: 0,
    accepted: 0,
    rejected: 0,
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  const fetchApplications = useCallback(
    async ({ page = 1, status = "All", search = "" } = {}) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", page);
        params.set("limit", 10);
        if (status && status !== "All") {
          params.set("status", status.toLowerCase());
        }
        if (search && search.trim()) {
          params.set("search", search.trim());
        }

        const { data } = await api.get(`/employer/applications?${params.toString()}`);
        const applicationsData = data?.data?.applications || [];
        const paginationData = data?.data?.pagination || {};

        setApplications(applicationsData);
        setPagination({
          page: paginationData.page || page,
          pages: paginationData.pages || 1,
          total: paginationData.total || applicationsData.length,
          limit: paginationData.limit || 10,
        });
        setError("");
      } catch (err) {
        console.error("Failed to fetch applications:", err);
        setError(err.message || "Unable to load applications right now.");
        setApplications([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get("/employer/applications/stats");
      const statsData = data?.data?.stats || {};
      const recentData = data?.data?.recentApplications || [];
      setStats({
        total: statsData.total || 0,
        pending: statsData.pending || 0,
        reviewed: statsData.reviewed || 0,
        interview: statsData.interview || 0,
        accepted: statsData.accepted || 0,
        rejected: statsData.rejected || 0,
      });
      setRecentApplications(recentData);
    } catch (err) {
      console.error("Failed to fetch application stats:", err);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchApplications({ page: 1, status: filterStatus, search: searchTerm });
    }, 350);
    return () => clearTimeout(handler);
  }, [filterStatus, searchTerm, fetchApplications]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleStatusChange = async (applicationId, status) => {
    try {
      setUpdatingStatusId(applicationId);
      await api.put(`/employer/applications/${applicationId}/status`, { status });
      setApplications((prev) =>
        prev.map((application) =>
          application._id === applicationId ? { ...application, status } : application
        )
      );
      fetchStats();
    } catch (err) {
      console.error("Failed to update application status:", err);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.pages || loading) return;
    fetchApplications({ page });
  };

  const handleViewResume = (resumeUrl) => {
    if (!resumeUrl) return;
    window.open(resumeUrl, "_blank", "noopener");
  };

  const statsCards = useMemo(
    () => [
      { label: "Total Applications", value: stats.total, icon: FileText, tone: "gray" },
      { label: "Pending Review", value: stats.pending, icon: Clock, tone: "yellow" },
      { label: "Interview Scheduled", value: stats.interview, icon: Calendar, tone: "purple" },
      { label: "Accepted", value: stats.accepted, icon: CheckCircle, tone: "green" },
    ],
    [stats]
  );

  const showingRange = useMemo(() => {
    if (applications.length === 0) {
      return { start: 0, end: 0 };
    }
    const start = (pagination.page - 1) * pagination.limit + 1;
    const end = Math.min(pagination.page * pagination.limit, pagination.total);
    return { start, end };
  }, [applications.length, pagination]);

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Applications</h1>
          <p className="text-gray-600">Review and manage applications for your job postings</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
          <Download className="w-5 h-5" />
          Export
        </button>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                filterStatus === status
                  ? "bg-gray-900 text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {statsCards.map((card) => {
          const Icon = card.icon;
          const toneClasses = {
            gray: "bg-white border-gray-200",
            yellow: "bg-yellow-50 border-yellow-200",
            purple: "bg-purple-50 border-purple-200",
            green: "bg-green-50 border-green-200",
          };
          return (
            <div key={card.label} className={`bg-white rounded-xl shadow-md border ${toneClasses[card.tone]} p-4`}>
          <div className="flex items-center justify-between">
            <div>
                  <p className="text-sm text-gray-600 mb-1">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
                  <Icon className="w-6 h-6 text-gray-900" />
          </div>
        </div>
            </div>
          );
        })}
            </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 text-center text-gray-600">
            Loading applications...
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 text-center text-gray-600">
            No applications found.
          </div>
        ) : (
          applications.map((application) => {
            const statusMeta = STATUS_META[application.status] || STATUS_META.pending;
            const StatusIcon = statusMeta.icon || Clock;
            const applicantInitial = application.applicantName?.charAt(0)?.toUpperCase() || "A";
          return (
            <div
                key={application._id}
              className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition"
            >
                <div className="flex items-start justify-between mb-4 gap-4">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-lg">
                      {applicantInitial}
                  </div>
                  <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{application.applicantName}</h3>
                      <p className="text-sm text-gray-600 mb-2">{application.job?.jobTitle || "—"}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                          {application.applicantEmail}
                      </span>
                        {application.applicantPhone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                            {application.applicantPhone}
                      </span>
                        )}
                        {application.job?.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                            {application.job.location}
                      </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-4 py-2 text-sm font-semibold rounded-lg border flex items-center gap-2 ${statusMeta.color}`}
                  >
                    <StatusIcon className="w-4 h-4" />
                    {toDisplayStatus(application.status)}
                  </span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm text-gray-600">
                    <span>
                      Applied:
                      <span className="font-semibold text-gray-900 ml-1">{formatDateTime(application.createdAt)}</span>
                    </span>
                    {application.coverLetter && (
                      <span className="text-gray-500 max-w-xl">
                        <span className="font-semibold text-gray-900">Cover Letter:</span> {application.coverLetter}
                      </span>
                    )}
              </div>

                <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewResume(application.resumeUrl)}
                      disabled={!application.resumeUrl}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 disabled:opacity-50"
                    >
                    <Eye className="w-4 h-4" />
                    View Resume
                  </button>
                    {application.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleStatusChange(application._id, "accepted")}
                          disabled={updatingStatusId === application._id}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50"
                        >
                        <CheckCircle className="w-4 h-4" />
                        Accept
                      </button>
                        <button
                          onClick={() => handleStatusChange(application._id, "rejected")}
                          disabled={updatingStatusId === application._id}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50"
                        >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
          })
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-gray-600">
          {applications.length > 0 ? (
            <span>
              Showing <span className="font-medium">{showingRange.start}</span> to{" "}
              <span className="font-medium">{showingRange.end}</span> of{" "}
              <span className="font-medium">{pagination.total}</span> applications
            </span>
          ) : (
            <span>No applications to display</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            disabled={loading || pagination.page === 1}
          >
            Previous
          </button>
          <span className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            disabled={loading || pagination.page === pagination.pages}
          >
            Next
          </button>
        </div>
      </div>

      {recentApplications.length > 0 && (
        <div className="mt-10 bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Applications</h2>
          <div className="space-y-3">
            {recentApplications.map((application) => {
              const statusMeta = STATUS_META[application.status] || STATUS_META.pending;
              const StatusIcon = statusMeta.icon || Clock;
              return (
                <div
                  key={application._id}
                  className="flex items-center justify-between gap-4 py-3 border-b last:border-b-0 border-gray-100"
                >
                  <div>
                    <p className="font-medium text-gray-900">{application.applicantName}</p>
                    <p className="text-sm text-gray-600">{application.job?.jobTitle || "—"}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">{formatDateTime(application.createdAt)}</span>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusMeta.color}`}>
                      <StatusIcon className="w-3 h-3 inline-block mr-1" />
                      {toDisplayStatus(application.status)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}



