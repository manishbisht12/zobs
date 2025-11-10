"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Users,
  Eye,
  TrendingUp,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
} from "lucide-react";
import api from "@/utils/api";

const formatRelativeTime = (dateString) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "—";
  const diffMs = Date.now() - date.getTime();
  if (diffMs < 0) return date.toLocaleDateString();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString();
};

const STATUS_META = {
  pending: {
    color: "bg-yellow-100 text-yellow-700",
    icon: Clock,
    label: "Pending",
  },
  reviewed: {
    color: "bg-gray-100 text-gray-700",
    icon: FileText,
    label: "Reviewed",
  },
  interview: {
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
    label: "Interview",
  },
  rejected: {
    color: "bg-red-100 text-red-700",
    icon: XCircle,
    label: "Rejected",
  },
  accepted: {
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
    label: "Accepted",
  },
};

export default function EmployerDashboardPage() {
  const router = useRouter();
  const [jobStats, setJobStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    draftJobs: 0,
    closedJobs: 0,
    totalViews: 0,
    totalApplicants: 0,
  });
  const [applicationStats, setApplicationStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    interview: 0,
    accepted: 0,
    rejected: 0,
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [jobsResponse, jobStatsResponse, applicationStatsResponse] = await Promise.all([
        api.get("/employer/jobs?page=1&limit=5"),
        api.get("/employer/jobs/stats"),
        api.get("/employer/applications/stats"),
      ]);

      const jobsData = jobsResponse?.data?.data?.jobs || [];
      const jobStatsData = jobStatsResponse?.data?.data?.stats || {};
      const applicationStatsData = applicationStatsResponse?.data?.data?.stats || {};
      const recentApps = applicationStatsResponse?.data?.data?.recentApplications || [];

      setRecentJobs(jobsData);
      setJobStats({
        totalJobs: jobStatsData.totalJobs || 0,
        activeJobs: jobStatsData.activeJobs || 0,
        draftJobs: jobStatsData.draftJobs || 0,
        closedJobs: jobStatsData.closedJobs || 0,
        totalViews: jobStatsData.totalViews || 0,
        totalApplicants: jobStatsData.totalApplications || 0,
      });
      setApplicationStats({
        total: applicationStatsData.total || 0,
        pending: applicationStatsData.pending || 0,
        reviewed: applicationStatsData.reviewed || 0,
        interview: applicationStatsData.interview || 0,
        accepted: applicationStatsData.accepted || 0,
        rejected: applicationStatsData.rejected || 0,
      });
      setRecentApplications(recentApps);
      setError("");
    } catch (err) {
      console.error("Failed to load employer dashboard:", err);
      setError(err.message || "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const statsCards = useMemo(
    () => [
      {
        title: "Active Jobs",
        value: jobStats.activeJobs,
        change: `${jobStats.totalJobs} total`,
        icon: Briefcase,
        color: "blue",
      },
      {
        title: "Total Applications",
        value: applicationStats.total,
        change: `${applicationStats.pending} pending`,
        icon: Users,
        color: "green",
      },
      {
        title: "Job Views",
        value: jobStats.totalViews,
        change: `Active ${jobStats.activeJobs}`,
        icon: Eye,
        color: "purple",
      },
      {
        title: "Conversion Rate",
        value:
          jobStats.totalViews > 0
            ? `${((applicationStats.total / jobStats.totalViews) * 100).toFixed(1)}%`
            : "0%",
        change: `${applicationStats.accepted} accepted`,
        icon: TrendingUp,
        color: "orange",
      },
    ],
    [jobStats, applicationStats]
  );

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Employer Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your job postings.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: "bg-blue-50 border-blue-200",
            green: "bg-green-50 border-green-200",
            purple: "bg-purple-50 border-purple-200",
            orange: "bg-orange-50 border-orange-200",
          };

          return (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-md border ${colorClasses[stat.color]} p-6 hover:shadow-lg transition-shadow`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white rounded-lg border border-gray-100">
                  <Icon className="w-6 h-6 text-gray-900" />
                </div>
                <span className="text-sm font-semibold text-gray-600 bg-white border border-gray-200 px-3 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Job Postings</h2>
            <button
              onClick={() => router.push("/employer/jobs")}
              className="text-gray-900 hover:text-gray-700 font-medium text-sm"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {loading ? (
              <p className="text-gray-600 text-sm">Loading jobs...</p>
            ) : recentJobs.length === 0 ? (
              <p className="text-gray-600 text-sm">No recent job postings.</p>
            ) : (
              recentJobs.map((job) => (
                <div
                  key={job._id}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition border border-gray-100"
                >
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <Briefcase className="w-5 h-5 text-gray-900" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 font-medium mb-1">{job.jobTitle}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {job.applications || 0} applications
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatRelativeTime(job.createdAt)}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      job.status === "active"
                        ? "bg-green-100 text-green-700"
                        : job.status === "draft"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {job.status ? job.status.charAt(0).toUpperCase() + job.status.slice(1) : "—"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
            <button
              onClick={() => router.push("/employer/applications")}
              className="text-gray-900 hover:text-gray-700 font-medium text-sm"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {loading ? (
              <p className="text-gray-600 text-sm">Loading applications...</p>
            ) : recentApplications.length === 0 ? (
              <p className="text-gray-600 text-sm">No recent applications.</p>
            ) : (
              recentApplications.map((application) => {
                const statusMeta = STATUS_META[application.status] || STATUS_META.pending;
                const StatusIcon = statusMeta.icon || Clock;
                return (
                  <div
                    key={application._id}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition border border-gray-100"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">
                        {application.applicantName?.charAt(0)?.toUpperCase() || "A"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 font-medium mb-1">{application.applicantName}</h3>
                      <p className="text-sm text-gray-600">{application.job?.jobTitle || "—"}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatRelativeTime(application.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusIcon className="w-4 h-4 text-gray-600" />
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusMeta.color}`}>
                        {statusMeta.label}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => router.push("/employer/jobs/post")}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition"
          >
            <div className="p-2 bg-gray-100 rounded-lg">
              <Briefcase className="w-5 h-5 text-gray-900" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">Post New Job</p>
              <p className="text-sm text-gray-600">Create a new job listing</p>
            </div>
          </button>
          <button
            onClick={() => router.push("/employer/applications")}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition"
          >
            <div className="p-2 bg-gray-100 rounded-lg">
              <Users className="w-5 h-5 text-gray-900" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">Review Applications</p>
              <p className="text-sm text-gray-600">View pending applications</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition">
            <div className="p-2 bg-gray-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-gray-900" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">View Analytics</p>
              <p className="text-sm text-gray-600">Check job performance</p>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}



