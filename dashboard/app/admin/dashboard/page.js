"use client";

import React from 'react';
import { Users, Briefcase, DollarSign, TrendingUp, Activity } from 'lucide-react';

export default function AdminDashboardPage() {
  const stats = [
    { title: 'Total Users', value: '2,543', change: '+12%', icon: Users, color: 'blue' },
    { title: 'Active Jobs', value: '1,234', change: '+8%', icon: Briefcase, color: 'green' },
    { title: 'Revenue', value: '$45,678', change: '+23%', icon: DollarSign, color: 'purple' },
    { title: 'Growth', value: '34%', change: '+5%', icon: TrendingUp, color: 'orange' },
  ];

  const recentActivities = [
    { user: 'John Doe', action: 'Posted a new job', time: '2 minutes ago', type: 'success' },
    { user: 'Jane Smith', action: 'Updated profile', time: '15 minutes ago', type: 'info' },
    { user: 'Mike Johnson', action: 'Applied for job', time: '1 hour ago', type: 'warning' },
    { user: 'Sarah Williams', action: 'Created account', time: '2 hours ago', type: 'success' },
    { user: 'Tom Brown', action: 'Deleted listing', time: '3 hours ago', type: 'error' },
  ];

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-600 border-blue-200',
            green: 'bg-green-100 text-green-600 border-green-200',
            purple: 'bg-purple-100 text-purple-600 border-purple-200',
            orange: 'bg-orange-100 text-orange-600 border-orange-200',
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

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Chart Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Revenue Chart</h2>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-200">
            <div className="text-center">
              <Activity className="w-16 h-16 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-600 font-medium">Chart will be displayed here</p>
              <p className="text-gray-500 text-sm">Integration with chart library needed</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-700 font-medium">Today's Visitors</span>
              <span className="text-2xl font-bold text-blue-600">156</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-gray-700 font-medium">Applications</span>
              <span className="text-2xl font-bold text-green-600">89</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <span className="text-gray-700 font-medium">Pending Review</span>
              <span className="text-2xl font-bold text-purple-600">12</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <span className="text-gray-700 font-medium">Avg. Response</span>
              <span className="text-2xl font-bold text-orange-600">2.3h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
          <button className="text-gray-900 hover:text-gray-700 font-medium text-sm">
            View All
          </button>
        </div>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => {
            const typeClasses = {
              success: 'bg-green-100 text-green-600',
              info: 'bg-blue-100 text-blue-600',
              warning: 'bg-yellow-100 text-yellow-600',
              error: 'bg-red-100 text-red-600',
            };
            
            return (
              <div
                key={index}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition"
              >
                <div className={`w-2 h-2 rounded-full ${typeClasses[activity.type]}`} />
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{activity.user}</p>
                  <p className="text-gray-600 text-sm">{activity.action}</p>
                </div>
                <span className="text-gray-500 text-sm">{activity.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}



