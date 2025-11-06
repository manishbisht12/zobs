"use client";

import React, { useState } from 'react';
import { Search, Filter, Download, Eye, CheckCircle, XCircle, Clock, FileText, Mail, Phone, MapPin, Calendar } from 'lucide-react';

export default function EmployerApplicationsPage() {
  const [filterStatus, setFilterStatus] = useState('All');

  const applications = [
    { 
      id: 1, 
      name: 'John Doe', 
      job: 'Senior Frontend Developer', 
      status: 'Pending', 
      applied: '2 hours ago',
      email: 'john.doe@example.com',
      phone: '+1 234-567-8900',
      location: 'New York, NY',
      experience: '5 years',
      resume: 'resume.pdf'
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      job: 'Product Designer', 
      status: 'Reviewed', 
      applied: '5 hours ago',
      email: 'jane.smith@example.com',
      phone: '+1 234-567-8901',
      location: 'San Francisco, CA',
      experience: '4 years',
      resume: 'resume.pdf'
    },
    { 
      id: 3, 
      name: 'Mike Johnson', 
      job: 'Backend Engineer', 
      status: 'Interview', 
      applied: '1 day ago',
      email: 'mike.j@example.com',
      phone: '+1 234-567-8902',
      location: 'Austin, TX',
      experience: '6 years',
      resume: 'resume.pdf'
    },
    { 
      id: 4, 
      name: 'Sarah Williams', 
      job: 'Senior Frontend Developer', 
      status: 'Rejected', 
      applied: '2 days ago',
      email: 'sarah.w@example.com',
      phone: '+1 234-567-8903',
      location: 'Seattle, WA',
      experience: '3 years',
      resume: 'resume.pdf'
    },
    { 
      id: 5, 
      name: 'Tom Brown', 
      job: 'DevOps Engineer', 
      status: 'Pending', 
      applied: '3 days ago',
      email: 'tom.b@example.com',
      phone: '+1 234-567-8904',
      location: 'Chicago, IL',
      experience: '7 years',
      resume: 'resume.pdf'
    },
  ];

  const statusFilters = ['All', 'Pending', 'Reviewed', 'Interview', 'Accepted', 'Rejected'];

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      Reviewed: 'bg-blue-100 text-blue-700 border-blue-200',
      Interview: 'bg-purple-100 text-purple-700 border-purple-200',
      Accepted: 'bg-green-100 text-green-700 border-green-200',
      Rejected: 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      Pending: Clock,
      Reviewed: FileText,
      Interview: Calendar,
      Accepted: CheckCircle,
      Rejected: XCircle,
    };
    return icons[status] || Clock;
  };

  const filteredApplications = filterStatus === 'All' 
    ? applications 
    : applications.filter(app => app.status === filterStatus);

  return (
    <>
      {/* Header */}
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

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search applications..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          {statusFilters.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg transition ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">42</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Interview Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">18</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Accepted</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((application) => {
          const StatusIcon = getStatusIcon(application.status);
          
          return (
            <div
              key={application.id}
              className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">{application.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{application.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{application.job}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {application.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {application.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {application.location}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-2 text-sm font-semibold rounded-lg border flex items-center gap-2 ${getStatusColor(application.status)}`}>
                    <StatusIcon className="w-4 h-4" />
                    {application.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Experience: <span className="font-semibold text-gray-900">{application.experience}</span></span>
                  <span>Applied: <span className="font-semibold text-gray-900">{application.applied}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    View Resume
                  </button>
                  {application.status === 'Pending' && (
                    <>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Accept
                      </button>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{' '}
          <span className="font-medium">156</span> applications
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50" disabled>
            Previous
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
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



