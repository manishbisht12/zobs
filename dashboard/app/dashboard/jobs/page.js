"use client";

import React from 'react';
import { Search, Filter, MoreVertical, Plus, Eye, Edit, Trash2, DollarSign, MapPin, Clock } from 'lucide-react';

export default function JobsPage() {
  const jobs = [
    { id: 1, title: 'Senior Frontend Developer', company: 'Tech Corp', applicants: 45, status: 'Active', salary: '$80K-$120K', location: 'Remote', posted: '2 days ago' },
    { id: 2, title: 'Product Designer', company: 'Design Studio', applicants: 32, status: 'Active', salary: '$70K-$100K', location: 'New York', posted: '3 days ago' },
    { id: 3, title: 'Backend Engineer', company: 'StartupXYZ', applicants: 67, status: 'Active', salary: '$90K-$130K', location: 'San Francisco', posted: '5 days ago' },
    { id: 4, title: 'Marketing Manager', company: 'Growth Co', applicants: 28, status: 'Closed', salary: '$60K-$85K', location: 'Chicago', posted: '1 week ago' },
    { id: 5, title: 'Data Scientist', company: 'Data Labs', applicants: 91, status: 'Active', salary: '$100K-$150K', location: 'Seattle', posted: '1 day ago' },
    { id: 6, title: 'DevOps Engineer', company: 'Cloud Systems', applicants: 54, status: 'Pending', salary: '$85K-$115K', location: 'Austin', posted: '4 days ago' },
  ];

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Jobs Management</h1>
          <p className="text-gray-600">Manage all job postings</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition shadow-md hover:shadow-lg">
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
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
          <Filter className="w-5 h-5 text-gray-600" />
          Filter
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <p className="text-sm opacity-90 mb-1">Total Jobs</p>
          <p className="text-3xl font-bold">1,234</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
          <p className="text-sm opacity-90 mb-1">Active Jobs</p>
          <p className="text-3xl font-bold">856</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 text-white">
          <p className="text-sm opacity-90 mb-1">Pending</p>
          <p className="text-3xl font-bold">89</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <p className="text-sm opacity-90 mb-1">Total Applicants</p>
          <p className="text-3xl font-bold">5,432</p>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Job Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Salary
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Location
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
                <tr key={job.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{job.title}</div>
                      <div className="text-sm text-gray-500">{job.company}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {job.posted}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      {job.salary}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {job.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {job.applicants}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      job.status === 'Active' ? 'bg-green-100 text-green-700' :
                      job.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {job.status}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing <span className="font-medium">1</span> to <span className="font-medium">6</span> of{' '}
          <span className="font-medium">1,234</span> results
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50" disabled>
            Previous
          </button>
          <button className="px-4 py-2 bg-gray-900 text-white rounded-lg">1</button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">2</button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">3</button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            Next
          </button>
        </div>
      </div>
    </>
  );
}

