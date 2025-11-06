"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, Users, Eye, TrendingUp, FileText, Clock, CheckCircle, XCircle, BarChart3 } from 'lucide-react';

export default function EmployerDashboardPage() {
  const router = useRouter();
  const stats = [
    { title: 'Active Jobs', value: '12', change: '+3', icon: Briefcase, color: 'blue' },
    { title: 'Total Applications', value: '156', change: '+24', icon: Users, color: 'green' },
    { title: 'Job Views', value: '2.4K', change: '+18%', icon: Eye, color: 'purple' },
    { title: 'Conversion Rate', value: '6.5%', change: '+1.2%', icon: TrendingUp, color: 'orange' },
  ];

  const recentJobs = [
    { id: 1, title: 'Senior Frontend Developer', applications: 45, status: 'Active', posted: '2 days ago' },
    { id: 2, title: 'Product Designer', applications: 32, status: 'Active', posted: '3 days ago' },
    { id: 3, title: 'Backend Engineer', applications: 67, status: 'Active', posted: '5 days ago' },
    { id: 4, title: 'Marketing Manager', applications: 28, status: 'Closed', posted: '1 week ago' },
  ];

  const recentApplications = [
    { id: 1, name: 'John Doe', job: 'Senior Frontend Developer', status: 'Pending', applied: '2 hours ago' },
    { id: 2, name: 'Jane Smith', job: 'Product Designer', status: 'Reviewed', applied: '5 hours ago' },
    { id: 3, name: 'Mike Johnson', job: 'Backend Engineer', status: 'Interview', applied: '1 day ago' },
    { id: 4, name: 'Sarah Williams', job: 'Senior Frontend Developer', status: 'Rejected', applied: '2 days ago' },
  ];

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Employer Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your job postings.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-gray-100 text-gray-900 border-gray-200',
            green: 'bg-gray-100 text-gray-900 border-gray-200',
            purple: 'bg-gray-100 text-gray-900 border-gray-200',
            orange: 'bg-gray-100 text-gray-900 border-gray-200',
          };
          
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg border ${colorClasses[stat.color]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Jobs and Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Jobs */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Job Postings</h2>
            <button className="text-gray-900 hover:text-gray-700 font-medium text-sm">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentJobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition border border-gray-100"
              >
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Briefcase className="w-5 h-5 text-gray-900" />
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 font-medium mb-1">{job.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {job.applications} applications
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {job.posted}
                    </span>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  job.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {job.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
            <button className="text-gray-900 hover:text-gray-700 font-medium text-sm">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentApplications.map((application) => {
              const statusIcons = {
                Pending: Clock,
                Reviewed: FileText,
                Interview: CheckCircle,
                Rejected: XCircle,
              };
              const statusColors = {
                Pending: 'bg-yellow-100 text-yellow-700',
                Reviewed: 'bg-gray-100 text-gray-700',
                Interview: 'bg-green-100 text-green-700',
                Rejected: 'bg-red-100 text-red-700',
              };
              const StatusIcon = statusIcons[application.status] || Clock;
              
              return (
                <div
                  key={application.id}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition border border-gray-100"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">{application.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 font-medium mb-1">{application.name}</h3>
                    <p className="text-sm text-gray-600">{application.job}</p>
                    <p className="text-xs text-gray-500 mt-1">{application.applied}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusIcon className={`w-4 h-4 ${statusColors[application.status]?.split(' ')[1] || 'text-gray-600'}`} />
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[application.status] || 'bg-gray-100 text-gray-700'}`}>
                      {application.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => router.push('/employer/jobs/post')}
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
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition">
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



