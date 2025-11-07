"use client";

import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  MapPin,
  Clock,
  Users,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import api from '../../../../utils/api';
import { toast } from 'react-toastify';

const SALARY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
};

const STATUS_BADGE_STYLES = {
  active: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  closed: 'bg-gray-200 text-gray-700',
  draft: 'bg-slate-200 text-slate-700',
};

const STATUS_OPTIONS = [
  { label: 'All statuses', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Pending', value: 'pending' },
  { label: 'Closed', value: 'closed' },
  { label: 'Draft', value: 'draft' },
];

const JOB_TYPE_OPTIONS = [
  { label: 'All job types', value: '' },
  { label: 'Full-time', value: 'full-time' },
  { label: 'Part-time', value: 'part-time' },
  { label: 'Contract', value: 'contract' },
  { label: 'Internship', value: 'internship' },
  { label: 'Freelance', value: 'freelance' },
];

const WORKPLACE_TYPE_OPTIONS = [
  { label: 'All workplaces', value: '' },
  { label: 'On-site', value: 'on-site' },
  { label: 'Remote', value: 'remote' },
  { label: 'Hybrid', value: 'hybrid' },
];

const formatSalaryRange = (min, max, currency) => {
  if (min == null && max == null) {
    return 'Not specified';
  }

  const symbol = SALARY_SYMBOLS[currency] || '$';

  const formatNumber = (value) =>
    value != null ? `${symbol}${Number(value).toLocaleString()}` : null;

  if (min != null && max != null) {
    return `${formatNumber(min)} - ${formatNumber(max)}`;
  }

  return min != null ? `${formatNumber(min)}+` : `${formatNumber(max)} max`;
};

const formatStatus = (status) => status.charAt(0).toUpperCase() + status.slice(1);

const timeSince = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }

  return 'Just now';
};

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    pendingJobs: 0,
    closedJobs: 0,
    draftJobs: 0,
    totalApplicants: 0,
    totalViews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [workplaceFilter, setWorkplaceFilter] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
  });

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/jobs', {
        params: {
          page,
          limit,
          search: searchTerm,
          status: statusFilter,
          jobType: jobTypeFilter,
          workplaceType: workplaceFilter,
        },
      });

      if (response.data.success) {
        const { jobs: jobList, pagination: pagData, stats: statsData } = response.data.data;
        setJobs(jobList);
        setPagination({
          total: pagData.total,
          pages: pagData.pages,
        });
        if (statsData) {
          setStats(statsData);
        }
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter, jobTypeFilter, workplaceFilter]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setPage(1);
      fetchJobs();
    }, 400);

    return () => clearTimeout(delayDebounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const toggleJobStatus = async (jobId, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'closed' : 'active';

    try {
      const response = await api.patch(`/admin/jobs/${jobId}/status`, {
        status: nextStatus,
      });

      if (response.data.success) {
        toast.success('Job status updated');
        fetchJobs();
      }
    } catch (error) {
      console.error('Error updating job status:', error);
      toast.error(error.response?.data?.message || 'Failed to update job status');
    }
  };

  const deleteJob = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      const response = await api.delete(`/admin/jobs/${jobId}`);
      if (response.data.success) {
        toast.success('Job deleted successfully');
        fetchJobs();
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error(error.response?.data?.message || 'Failed to delete job');
    }
  };

  const totalShowingStart = useMemo(
    () => (jobs.length === 0 ? 0 : (page - 1) * limit + 1),
    [jobs.length, page],
  );

  const totalShowingEnd = useMemo(
    () => Math.min(page * limit, pagination.total),
    [page, limit, pagination.total],
  );

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Jobs Management</h1>
          <p className="text-gray-600">Manage all job postings across the platform</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition shadow-md hover:shadow-lg">
          <Plus className="w-5 h-5" />
          Add Job
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search jobs by title, company or location..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value);
            setPage(1);
          }}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value || 'all-status'} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          value={jobTypeFilter}
          onChange={(event) => {
            setJobTypeFilter(event.target.value);
            setPage(1);
          }}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          {JOB_TYPE_OPTIONS.map((option) => (
            <option key={option.value || 'all-job-type'} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          value={workplaceFilter}
          onChange={(event) => {
            setWorkplaceFilter(event.target.value);
            setPage(1);
          }}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          {WORKPLACE_TYPE_OPTIONS.map((option) => (
            <option key={option.value || 'all-workplace'} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 text-white">
          <p className="text-sm opacity-90 mb-1">Total Jobs</p>
          <p className="text-3xl font-bold">{stats.totalJobs}</p>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-4 text-white">
          <p className="text-sm opacity-90 mb-1">Active Jobs</p>
          <p className="text-3xl font-bold">{stats.activeJobs}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-xl p-4 text-white">
          <p className="text-sm opacity-90 mb-1">Pending Review</p>
          <p className="text-3xl font-bold">{stats.pendingJobs}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 text-white">
          <p className="text-sm opacity-90 mb-1">Total Applicants</p>
          <p className="text-3xl font-bold">{stats.totalApplicants?.toLocaleString?.() ?? stats.totalApplicants}</p>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No jobs found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Company
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
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{job.jobTitle}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {timeSince(job.createdAt)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{job.companyName || job.employer?.companyName || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{job.employer?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        {formatSalaryRange(job.salaryMin, job.salaryMax, job.currency)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {job.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-2">
                        <Eye className="w-4 h-4 text-gray-400" />
                        {job.views?.toLocaleString?.() ?? job.views}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full flex items-center gap-1 w-fit">
                        <Users className="w-4 h-4" />
                        {job.applications?.toLocaleString?.() ?? job.applications}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        STATUS_BADGE_STYLES[job.status] || 'bg-gray-200 text-gray-700'
                      }`}>
                        {formatStatus(job.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleJobStatus(job._id, job.status)}
                          className={`p-2 rounded-lg transition ${
                            job.status === 'active'
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={job.status === 'active' ? 'Mark as closed' : 'Mark as active'}
                        >
                          {job.status === 'active' ? (
                            <XCircle className="w-5 h-5" />
                          ) : (
                            <CheckCircle className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => deleteJob(job._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete job"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && jobs.length > 0 && (
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium">{totalShowingStart}</span> to{' '}
            <span className="font-medium">{totalShowingEnd}</span> of{' '}
            <span className="font-medium">{pagination.total}</span> results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {[...Array(pagination.pages)].map((_, index) => {
              const pageNum = index + 1;
              if (
                pageNum === 1 ||
                pageNum === pagination.pages ||
                (pageNum >= page - 1 && pageNum <= page + 1)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-4 py-2 rounded-lg transition ${
                      page === pageNum ? 'bg-gray-900 text-white' : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }
              if (pageNum === page - 2 || pageNum === page + 2) {
                return (
                  <span key={pageNum} className="px-2 py-2">
                    ...
                  </span>
                );
              }
              return null;
            })}
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, pagination.pages))}
              disabled={page === pagination.pages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}

