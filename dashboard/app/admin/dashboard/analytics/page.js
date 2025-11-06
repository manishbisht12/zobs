"use client";

import React from 'react';
import { TrendingUp, Users, Briefcase, DollarSign, Eye, MousePointer, Calendar } from 'lucide-react';

export default function AnalyticsPage() {
  const metrics = [
    { label: 'Total Views', value: '125.4K', change: '+12.5%', icon: Eye, color: 'blue' },
    { label: 'Unique Visitors', value: '89.2K', change: '+8.3%', icon: Users, color: 'green' },
    { label: 'Conversion Rate', value: '4.2%', change: '+2.1%', icon: TrendingUp, color: 'purple' },
    { label: 'Click Rate', value: '18.9%', change: '+5.7%', icon: MousePointer, color: 'orange' },
  ];

  const topJobs = [
    { id: 1, title: 'Senior Frontend Developer', views: 3421, applications: 89, conversion: '2.6%' },
    { id: 2, title: 'Product Designer', views: 2890, applications: 67, conversion: '2.3%' },
    { id: 3, title: 'Backend Engineer', views: 2567, applications: 54, conversion: '2.1%' },
    { id: 4, title: 'Data Scientist', views: 2345, applications: 48, conversion: '2.0%' },
    { id: 5, title: 'Marketing Manager', views: 1890, applications: 39, conversion: '2.1%' },
  ];

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Reports</h1>
          <p className="text-gray-600">Track performance and insights</p>
        </div>
        <div className="flex gap-4">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Last year</option>
          </select>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <Calendar className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const colorClasses = {
            blue: 'from-blue-500 to-blue-600',
            green: 'from-green-500 to-green-600',
            purple: 'from-purple-500 to-purple-600',
            orange: 'from-orange-500 to-orange-600',
          };
          
          return (
            <div
              key={index}
              className={`bg-gradient-to-br ${colorClasses[metric.color]} text-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  {metric.change}
                </span>
              </div>
              <h3 className="text-white/80 text-sm font-medium mb-1">{metric.label}</h3>
              <p className="text-3xl font-bold">{metric.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts and Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Traffic Overview</h2>
          <div className="h-80 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-200">
            <div className="text-center">
              <TrendingUp className="w-20 h-20 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 font-medium text-lg">Analytics Chart</p>
              <p className="text-gray-500 text-sm">Integration with analytics library needed</p>
            </div>
          </div>
        </div>

        {/* Top Jobs */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Top Performing Jobs</h2>
          <div className="space-y-4">
            {topJobs.map((job) => (
              <div key={job.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900">{job.title}</h3>
                  <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
                    {job.conversion}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-gray-500 mb-1">Views</p>
                    <p className="text-gray-900 font-semibold">{job.views.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Applications</p>
                    <p className="text-gray-900 font-semibold">{job.applications}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Summary</h2>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Avg. Session Duration</span>
                <span className="text-gray-900 font-bold">4m 32s</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '76%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Bounce Rate</span>
                <span className="text-gray-900 font-bold">32.4%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Mobile Users</span>
                <span className="text-gray-900 font-bold">68.9%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '69%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Desktop Users</span>
                <span className="text-gray-900 font-bold">31.1%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full" style={{ width: '31%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}



