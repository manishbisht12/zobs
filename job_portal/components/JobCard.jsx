"use client";

import React from 'react';
import { MapPin } from 'lucide-react';

export default function JobCard({ job, onClick, selected }) {
  return (
    <article
      onClick={onClick}
      role="button"
      tabIndex={0}
      className={`bg-white rounded-lg shadow-sm border p-4 w-full cursor-pointer transition ${
        selected ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:shadow'
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{job.jobTitle || 'Untitled Role'}</h3>
          <p className="text-sm text-gray-600 mt-1 flex items-center gap-2"><MapPin className="w-4 h-4"/>{job.location || '—'}</p>
        </div>
        <div className="text-right">
          {job.salaryMin || job.salaryMax ? (
            <p className="text-sm font-medium text-gray-800">{job.currency || 'USD'} {job.salaryMin || ''}{job.salaryMin && job.salaryMax ? ' - ' : ''}{job.salaryMax || ''}</p>
          ) : null}
          <p className="text-xs text-gray-500 mt-1">{job.jobType} • {job.workplaceType}</p>
        </div>
      </div>

      {job.description ? (
        <p className="text-gray-700 mt-3 text-sm line-clamp-2">{job.description}</p>
      ) : null}

      <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
        <span>Openings: {job.numberOfOpenings || '1'}</span>
        <span>Posted: {job.postedDate ? new Date(job.postedDate).toLocaleDateString() : '—'}</span>
      </div>
    </article>
  );
}
