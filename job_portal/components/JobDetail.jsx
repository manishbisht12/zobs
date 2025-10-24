"use client";

import React, { useState } from 'react';
import { Bookmark, Send, MapPin } from 'lucide-react';

export default function JobDetail({ job }) {
  const [saved, setSaved] = useState(false);

  if (!job) {
    return (
      <div className="p-6 bg-white rounded-lg shadow border border-gray-200">
        <p className="text-gray-600">Select a job to see details here.</p>
      </div>
    );
  }

  const handleBookmark = () => setSaved(s => !s);

  const handleApply = () => {
    if (job.contactEmail) {
      window.location.href = `mailto:${job.contactEmail}?subject=Application for ${encodeURIComponent(job.jobTitle || '')}`;
      return;
    }
    if (job.companyWebsite) {
      window.open(job.companyWebsite, '_blank');
      return;
    }
    alert('No application contact provided for this job.');
  };

  return (
    <aside className="p-6 bg-white rounded-lg shadow border border-gray-200">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-gray-900">{job.jobTitle}</h2>
          <p className="text-sm text-gray-700 mt-1">{job.companyName}</p>
          <p className="text-sm text-gray-600 mt-2 flex items-center gap-2"><MapPin className="w-4 h-4" />{job.location}</p>
        </div>
        <div className="flex-shrink-0 text-right">
          {job.salaryMin || job.salaryMax ? (
            <p className="text-lg font-medium text-gray-800">{job.currency || 'USD'} {job.salaryMin || ''}{job.salaryMin && job.salaryMax ? ' - ' : ''}{job.salaryMax || ''}</p>
          ) : null}
          <p className="text-sm text-gray-500 mt-1">{job.jobType} • {job.workplaceType}</p>
        </div>
      </div>

      {job.description && (
        <section className="mt-6 text-gray-700">
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="whitespace-pre-wrap">{job.description}</p>
        </section>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4">
        {job.responsibilities && (
          <div>
            <h4 className="font-medium">Responsibilities</h4>
            <p className="text-gray-600 mt-1">{job.responsibilities}</p>
          </div>
        )}

        {job.requirements && (
          <div>
            <h4 className="font-medium">Requirements</h4>
            <p className="text-gray-600 mt-1">{job.requirements}</p>
          </div>
        )}

        {job.benefits && (
          <div>
            <h4 className="font-medium">Benefits</h4>
            <p className="text-gray-600 mt-1">{job.benefits}</p>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={handleApply} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
            <Send className="w-4 h-4" />
            <span>Apply</span>
          </button>

          {job.contactEmail && (
            <a href={`mailto:${job.contactEmail}`} className="text-sm text-gray-600">{job.contactEmail}</a>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button onClick={handleBookmark} className={`text-gray-600 hover:text-gray-800 ${saved ? 'text-blue-600' : ''}`}>
            <Bookmark className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
