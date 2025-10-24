"use client";

import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Banner from "../../components/Banner";
import JobCard from "../../components/JobCard";
import JobDetail from "../../components/JobDetail";
import { useJobs } from "../contexts/JobsContext";
import Home from "../../components/Home";
import { useState } from 'react';

export default function Jobs() {
  const { jobs } = useJobs();
  const [selectedJobId, setSelectedJobId] = useState(jobs && jobs[0] ? jobs[0].id : null);

  const selectedJob = jobs.find(j => j.id === selectedJobId) || null;

  return (
    <>
      <Navbar />
       <div className="w-full pt-10 flex items-center justify-center">
        <Home />
      </div>
        <Banner />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold mb-6">Jobs</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {jobs && jobs.length > 0 ? (
              jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  selected={selectedJobId === job.id}
                  onClick={() => setSelectedJobId(job.id)}
                />
              ))
            ) : (
              <div className="py-20 text-center text-gray-600">
                <p className="mb-4">No jobs posted yet.</p>
                <p>Post a job to see it listed here.</p>
              </div>
            )}
          </div>

          <div className="md:col-span-1">
            <JobDetail job={selectedJob} />
          </div>
        </div>
      </main>

    
      <Footer />
    </>
  );
}

