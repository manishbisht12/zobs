"use client";

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Plus, Eye, Edit, Trash2, DollarSign, MapPin, Clock, Users, AlertCircle } from 'lucide-react';
import api from '@/utils/api';

const formatStatusLabel = (status) => {
  if (!status) return 'Unknown';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const getStatusClasses = (status) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-700';
    case 'pending':
      return 'bg-yellow-100 text-yellow-700';
    case 'draft':
      return 'bg-blue-100 text-blue-700';
    case 'closed':
      return 'bg-gray-200 text-gray-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const formatSalaryRange = (job) => {
  if (!job) return 'Not specified';

  const currency = job.currency || 'USD';
  const formatter = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const hasMin = typeof job.salaryMin === 'number' && !Number.isNaN(job.salaryMin);
  const hasMax = typeof job.salaryMax === 'number' && !Number.isNaN(job.salaryMax);

  if (hasMin && hasMax) {
    return `${currency} ${formatter.format(job.salaryMin)} - ${formatter.format(job.salaryMax)}`;
  }

  if (hasMin) {
    return `${currency} ${formatter.format(job.salaryMin)}+`;
  }

  if (hasMax) {
    return `${currency} up to ${formatter.format(job.salaryMax)}`;
  }

  return 'Not specified';
};

const formatRelativeDate = (dateString) => {
  if (!dateString) return '—';

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '—';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  if (diffMs < 0) {
    return date.toLocaleDateString();
  }

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    if (diffHours <= 1) return 'Just now';
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  }

  if (diffDays === 1) {
    return '1 day ago';
  }

  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  return date.toLocaleDateString();
};

export default function EmployerJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    draftJobs: 0,
    closedJobs: 0,
    totalViews: 0,
    totalApplicants: 0,
  });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);

    try {
      const [{ data: jobsPayload }, { data: statsPayload }] = await Promise.all([
        api.get(`/employer/jobs?page=${page}&limit=${limit}`),
        api.get('/employer/jobs/stats'),
      ]);

      const jobsData = jobsPayload?.data?.jobs ?? [];
      const paginationData = jobsPayload?.data?.pagination ?? null;
      const statsData = statsPayload?.data?.stats ?? {};

      setJobs(jobsData);
      setPagination({
        page: paginationData?.page ?? page,
        limit: paginationData?.limit ?? limit,
        total: paginationData?.total ?? jobsData.length,
        pages:
          paginationData?.pages ??
          Math.max(1, Math.ceil((paginationData?.total ?? jobsData.length) / (paginationData?.limit ?? limit))),
      });
      setStats({
        totalJobs: statsData.totalJobs ?? 0,
        activeJobs: statsData.activeJobs ?? 0,
        draftJobs: statsData.draftJobs ?? 0,
        closedJobs: statsData.closedJobs ?? 0,
        totalViews: statsData.totalViews ?? 0,
        totalApplicants: statsData.totalApplications ?? 0,
      });
      setError('');
    } catch (err) {
      console.error('Failed to load employer jobs:', err);
      setError(err.message || 'Unable to load jobs right now. Please try again later.');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  const filteredJobs = useMemo(() => {
    if (!searchTerm.trim()) return jobs;

    const term = searchTerm.toLowerCase();
    return jobs.filter((job) =>
      [job.jobTitle, job.location, job.companyName]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term))
    );
  }, [jobs, searchTerm]);

  const currentPage = pagination?.page ?? 1;
  const totalPages = pagination?.pages ?? 1;
  const totalResults = pagination?.total ?? filteredJobs.length;
  const showingStart = filteredJobs.length
    ? (currentPage - 1) * (pagination?.limit ?? filteredJobs.length) + 1
    : 0;
  const showingEnd = filteredJobs.length ? showingStart + filteredJobs.length - 1 : 0;
  const hasSearchTerm = Boolean(searchTerm.trim());

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || loading) return;
    fetchData(page, pagination?.limit ?? 10);
  };

  const handleRetry = () => {
    fetchData(currentPage, pagination?.limit ?? 10);
  };

  const statCards = [
    { label: 'Total Jobs', value: stats.totalJobs },
    { label: 'Active Jobs', value: stats.activeJobs },
    { label: 'Draft Jobs', value: stats.draftJobs },
    { label: 'Total Applicants', value: stats.totalApplicants },
  ];

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Job Postings</h1>
          <p className="text-gray-600">Manage your job listings and track their performance</p>
        </div>
        <button
          onClick={() => router.push('/employer/jobs/post')}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Post New Job
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50" disabled>
          <Filter className="w-5 h-5 text-gray-600" />
          Filter
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-4 border border-gray-200 shadow-md">
            <p className="text-sm text-gray-600 mb-1">{card.label}</p>
            <p className="text-3xl font-bold text-gray-900">{loading ? '—' : card.value}</p>
          </div>
        ))}
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Job Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Salary
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Applicants
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                    Loading jobs...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10">
                    <div className="flex flex-col items-center gap-3 text-sm text-red-600">
                      <AlertCircle className="w-6 h-6" />
                      <p>{error}</p>
                      <button
                        onClick={handleRetry}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                      >
                        Try again
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-600">
                    <div className="flex flex-col items-center gap-3">
                      <p>{hasSearchTerm ? 'No jobs match your search.' : 'You have not posted any jobs yet.'}</p>
                      {!hasSearchTerm && (
                        <button
                          onClick={() => router.push('/employer/jobs/post')}
                          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
                        >
                          Post your first job
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job._id || job.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{job.jobTitle}</div>
                        <div className="text-xs text-gray-500">{job.companyName}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {formatRelativeDate(job.createdAt)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        {formatSalaryRange(job)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {job.location || '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-2">
                        <Eye className="w-4 h-4 text-gray-400" />
                        {job.views ?? 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1 w-fit">
                        <Users className="w-4 h-4" />
                        {job.applications ?? 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusClasses(job.status)}`}>
                        {formatStatusLabel(job.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button className="text-gray-600 hover:text-gray-900 transition p-1 hover:bg-gray-100 rounded">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 transition p-1 hover:bg-gray-100 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-700 transition p-1 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-gray-600">
          {filteredJobs.length > 0 ? (
            <span>
              Showing <span className="font-medium">{showingStart}</span> to <span className="font-medium">{showingEnd}</span> of{' '}
              <span className="font-medium">{totalResults}</span> results
            </span>
          ) : (
            <span>No results to display</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            disabled={loading || currentPage === 1}
          >
            Previous
          </button>
          <span className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            disabled={loading || currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}






