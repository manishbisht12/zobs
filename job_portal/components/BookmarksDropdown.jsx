"use client";

import React from 'react';
import { Bookmark, X, MapPin } from 'lucide-react';
import { useJobs } from '../app/contexts/JobsContext';

export default function BookmarksDropdown({ isOpen, onClose }) {
  const { bookmarkedJobs, toggleBookmark } = useJobs();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-20 z-40"
        onClick={onClose}
      />
      
      {/* Dropdown */}
      <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 max-h-[600px] overflow-hidden flex flex-col backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bookmark className="w-5 h-5 text-blue-600" />
            </div>
            <span>Bookmarked Jobs</span>
            {bookmarkedJobs.length > 0 && (
              <span className="bg-blue-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                {bookmarkedJobs.length}
              </span>
            )}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {bookmarkedJobs.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <div className="p-4 bg-gray-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Bookmark className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-base font-medium text-gray-700">No bookmarked jobs yet</p>
              <p className="text-sm mt-2 text-gray-500">Click the bookmark icon on any job to save it</p>
            </div>
          ) : (
            <div className="p-3">
              {bookmarkedJobs.map((job) => (
                <div 
                  key={job.id}
                  className="p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 cursor-pointer group border border-transparent hover:border-gray-100 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors text-base">
                        {job.jobTitle}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1 font-medium">{job.companyName}</p>
                      {job.location && (
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </p>
                      )}
                      {job.salaryMin || job.salaryMax ? (
                        <p className="text-sm font-semibold text-green-600 mt-2">
                          {job.currency || 'USD'} {job.salaryMin || ''}{job.salaryMin && job.salaryMax ? ' - ' : ''}{job.salaryMax || ''}
                        </p>
                      ) : null}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(job);
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 p-1 hover:bg-red-50 rounded-lg"
                    >
                      <Bookmark className="w-5 h-5 fill-current" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}


