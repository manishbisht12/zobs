"use client";

import React, { useState, useEffect } from 'react';
import { Search, Users as UsersIcon, Briefcase, MoreVertical, CheckCircle, XCircle, Trash2, Eye } from 'lucide-react';
import api from '../../../../utils/api';
import { toast } from 'react-toastify';

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'employers'
  const [users, setUsers] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userStats, setUserStats] = useState({ total: 0 });
  const [employerStats, setEmployerStats] = useState({ total: 0 });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users', {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          search: searchTerm,
        },
      });

      if (response.data.success) {
        setUsers(response.data.data.users);
        const paginationData = response.data.data.pagination;
        setPagination(prev => ({
          ...prev,
          ...paginationData,
        }));
        // Update user stats for tab badge
        setUserStats({ total: paginationData.total });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Fetch employers
  const fetchEmployers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/employers', {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          search: searchTerm,
        },
      });

      if (response.data.success) {
        setEmployers(response.data.data.employers);
        const paginationData = response.data.data.pagination;
        setPagination(prev => ({
          ...prev,
          ...paginationData,
        }));
        // Update employer stats for tab badge
        setEmployerStats({ total: paginationData.total });
      }
    } catch (error) {
      console.error('Error fetching employers:', error);
      toast.error('Failed to fetch employers');
    } finally {
      setLoading(false);
    }
  };

  // Toggle user status
  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const response = await api.patch(`/admin/users/${userId}/status`, {
        isActive: !currentStatus,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  // Toggle employer status
  const toggleEmployerStatus = async (employerId, currentStatus) => {
    try {
      const response = await api.patch(`/admin/employers/${employerId}/status`, {
        isActive: !currentStatus,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchEmployers();
      }
    } catch (error) {
      console.error('Error updating employer status:', error);
      toast.error('Failed to update employer status');
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await api.delete(`/admin/users/${userId}`);

      if (response.data.success) {
        toast.success('User deleted successfully');
        fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  // Delete employer
  const deleteEmployer = async (employerId) => {
    if (!confirm('Are you sure you want to delete this employer?')) return;

    try {
      const response = await api.delete(`/admin/employers/${employerId}`);

      if (response.data.success) {
        toast.success('Employer deleted successfully');
        fetchEmployers();
      }
    } catch (error) {
      console.error('Error deleting employer:', error);
      toast.error('Failed to delete employer');
    }
  };

  // Fetch initial counts for both tabs
  useEffect(() => {
    const fetchInitialCounts = async () => {
      try {
        // Fetch user count
        const userResponse = await api.get('/admin/users', {
          params: { page: 1, limit: 1 },
        });
        if (userResponse.data.success) {
          setUserStats({ total: userResponse.data.data.pagination.total });
        }

        // Fetch employer count
        const employerResponse = await api.get('/admin/employers', {
          params: { page: 1, limit: 1 },
        });
        if (employerResponse.data.success) {
          setEmployerStats({ total: employerResponse.data.data.pagination.total });
        }
      } catch (error) {
        console.error('Error fetching initial counts:', error);
      }
    };

    fetchInitialCounts();
  }, []);

  // Effect to fetch data when tab changes
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else {
      fetchEmployers();
    }
  }, [activeTab, pagination.page, searchTerm]);

  const currentData = activeTab === 'users' ? users : employers;

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Users Management</h1>
            <p className="text-gray-600">Manage all registered users and employers</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => {
              setActiveTab('users');
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors relative ${
              activeTab === 'users'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <UsersIcon className="w-5 h-5" />
            Job Seekers
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              activeTab === 'users' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
            }`}>
              {userStats.total}
            </span>
          </button>
          <button
            onClick={() => {
              setActiveTab('employers');
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors relative ${
              activeTab === 'employers'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            Employers
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              activeTab === 'employers' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
            }`}>
              {employerStats.total}
            </span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={`Search ${activeTab === 'users' ? 'users' : 'employers'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : currentData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No {activeTab} found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {activeTab === 'users' ? 'User' : 'Employer'}
                  </th>
                  {activeTab === 'employers' && (
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Company
                    </th>
                  )}
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold">{item.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.email}</div>
                        </div>
                      </div>
                    </td>
                    {activeTab === 'employers' && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.companyName || 'N/A'}</div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.phone || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        item.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => 
                            activeTab === 'users' 
                              ? toggleUserStatus(item._id, item.isActive)
                              : toggleEmployerStatus(item._id, item.isActive)
                          }
                          className={`p-2 rounded-lg transition ${
                            item.isActive 
                              ? 'text-red-600 hover:bg-red-50' 
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={item.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {item.isActive ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                        </button>
                        <button
                          onClick={() => 
                            activeTab === 'users' 
                              ? deleteUser(item._id)
                              : deleteEmployer(item._id)
                          }
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
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
      {!loading && currentData.length > 0 && (
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span> of{' '}
            <span className="font-medium">{pagination.total}</span> results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {[...Array(pagination.pages)].map((_, index) => {
              const pageNum = index + 1;
              // Show first page, last page, current page and pages around it
              if (
                pageNum === 1 ||
                pageNum === pagination.pages ||
                (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                    className={`px-4 py-2 rounded-lg transition ${
                      pagination.page === pageNum
                        ? 'bg-gray-900 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              } else if (
                pageNum === pagination.page - 2 ||
                pageNum === pagination.page + 2
              ) {
                return <span key={pageNum} className="px-2 py-2">...</span>;
              }
              return null;
            })}
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.pages}
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



