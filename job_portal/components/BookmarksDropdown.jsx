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
      <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[600px] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-blue-600" />
            Bookmarked Jobs
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {bookmarkedJobs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bookmark className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No bookmarked jobs yet</p>
              <p className="text-xs mt-1">Click the bookmark icon on any job to save it</p>
            </div>
          ) : (
            <div className="p-2">
              {bookmarkedJobs.map((job) => (
                <div 
                  key={job.id}
                  className="p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {job.jobTitle}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">{job.companyName}</p>
                      {job.location && (
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </p>
                      )}
                      {job.salaryMin || job.salaryMax ? (
                        <p className="text-sm font-medium text-gray-800 mt-2">
                          {job.currency || 'USD'} {job.salaryMin || ''}{job.salaryMin && job.salaryMax ? ' - ' : ''}{job.salaryMax || ''}
                        </p>
                      ) : null}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(job);
                      }}
                      className="text-gray-400 hover:text-blue-600 transition-colors flex-shrink-0"
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


