// "use client";

// import React from "react";
// import Navbar from "../../components/Navbar";
// import Footer from "../../components/Footer";
// import Banner from "../../components/Banner";
// import JobCard from "../../components/JobCard";
// import JobDetail from "../../components/JobDetail";
// import { useJobs } from "../contexts/JobsContext";
// import Home from "../../components/Home";
// import { useState } from 'react';

// export default function Jobs() {
//   const { jobs } = useJobs();
//   const [selectedJobId, setSelectedJobId] = useState(jobs && jobs[0] ? jobs[0].id : null);

//   const selectedJob = jobs.find(j => j.id === selectedJobId) || null;

//   return (
//     <>
//       <Navbar />
//        <div className="w-full pt-10 flex items-center justify-center">
//         <Home />
//       </div>
//         <Banner />
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <h1 className="text-2xl font-semibold mb-6">Jobs</h1>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="md:col-span-2 space-y-4">
//             {jobs && jobs.length > 0 ? (
//               jobs.map((job) => (
//                 <JobCard
//                   key={job.id}
//                   job={job}
//                   selected={selectedJobId === job.id}
//                   onClick={() => setSelectedJobId(job.id)}
//                 />
//               ))
//             ) : (
//               <div className="py-20 text-center text-gray-600">
//                 <p className="mb-4">No jobs posted yet.</p>
//                 <p>Post a job to see it listed here.</p>
//               </div>
//             )}
//           </div>

//           <div className="md:col-span-1">
//             <JobDetail job={selectedJob} />
//           </div>
//         </div>
//       </main>

    
//       <Footer />
//     </>
//   );
// }



"use client";

import React, { useState, useMemo, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Banner from "../../components/Banner";
import JobCard from "../../components/JobCard";
import JobDetail from "../../components/JobDetail";
import JobFilters from "../../components/JobFilters";
import { useJobs } from "../contexts/JobsContext";
import Home from "../../components/Home";
import { Filter, X } from "lucide-react";

export default function Jobs() {
  const { jobs } = useJobs();
  const [selectedJobId, setSelectedJobId] = useState(jobs && jobs[0] ? jobs[0].id : null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [salaryRangeFilter, setSalaryRangeFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Filter jobs based on all criteria
  const filteredJobs = useMemo(() => {
    if (!jobs) return [];

    return jobs.filter(job => {
      // Search query filter - handles multiple property name variations
      const matchesSearch = searchQuery === "" || (() => {
        const query = searchQuery.toLowerCase().trim();
        
        // Get all possible property names for title
        const title = (
          job.title || 
          job.jobTitle || 
          job.position || 
          job.role || 
          ""
        ).toLowerCase();
        
        // Get all possible property names for company
        const company = (
          job.company || 
          job.companyName || 
          job.employer || 
          job.organization ||
          ""
        ).toLowerCase();
        
        // Get description
        const description = (
          job.description || 
          job.jobDescription || 
          job.details ||
          ""
        ).toLowerCase();
        
        return title.includes(query) || 
               company.includes(query) || 
               description.includes(query);
      })();

      // Location filter
      const matchesLocation = locationFilter === "" || 
        (job.location || "").toLowerCase().includes(locationFilter.toLowerCase());

      // Job type filter
      const matchesJobType = jobTypeFilter === "" || 
        (job.type || job.jobType || "") === jobTypeFilter;

      // Salary range filter
      const matchesSalary = salaryRangeFilter === "" || (() => {
        const salaryString = job.salary || job.salaryRange || "";
        const salary = parseInt(salaryString.replace(/[^0-9]/g, '') || '0');
        
        switch(salaryRangeFilter) {
          case "0-50k": return salary > 0 && salary < 50000;
          case "50k-100k": return salary >= 50000 && salary < 100000;
          case "100k-150k": return salary >= 100000 && salary < 150000;
          case "150k+": return salary >= 150000;
          default: return true;
        }
      })();

      // Experience filter
      const matchesExperience = experienceFilter === "" || 
        (job.experience || "").toLowerCase().includes(experienceFilter.toLowerCase());

      return matchesSearch && matchesLocation && matchesJobType && matchesSalary && matchesExperience;
    });
  }, [jobs, searchQuery, locationFilter, jobTypeFilter, salaryRangeFilter, experienceFilter]);

  // Update selected job when filters change
  useEffect(() => {
    if (filteredJobs.length > 0 && !filteredJobs.find(j => j.id === selectedJobId)) {
      setSelectedJobId(filteredJobs[0].id);
    } else if (filteredJobs.length === 0) {
      setSelectedJobId(null);
    }
  }, [filteredJobs, selectedJobId]);

  const selectedJob = filteredJobs.find(j => j.id === selectedJobId) || null;

  const clearAllFilters = () => {
    setSearchQuery("");
    setLocationFilter("");
    setJobTypeFilter("");
    setSalaryRangeFilter("");
    setExperienceFilter("");
  };

  const activeFiltersCount = [
    searchQuery, 
    locationFilter, 
    jobTypeFilter, 
    salaryRangeFilter, 
    experienceFilter
  ].filter(f => f !== "").length;

  return (
    <>
      <Navbar />
      <div className="w-full pt-10 flex items-center justify-center">
        <Home />
      </div>
      <Banner />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with mobile filter toggle */}
        <div className="flex items-center justify-between mb-6">
          {/* <h1 className="text-2xl font-semibold text-black">Jobs</h1> */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Filter size={18} />
            Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </button>
        </div>

        {/* Filters Component */}
        <JobFilters
          jobs={jobs}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          locationFilter={locationFilter}
          setLocationFilter={setLocationFilter}
          jobTypeFilter={jobTypeFilter}
          setJobTypeFilter={setJobTypeFilter}
          salaryRangeFilter={salaryRangeFilter}
          setSalaryRangeFilter={setSalaryRangeFilter}
          experienceFilter={experienceFilter}
          setExperienceFilter={setExperienceFilter}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          clearAllFilters={clearAllFilters}
          filteredJobsCount={filteredJobs.length}
          totalJobsCount={jobs?.length || 0}
        />

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Search: {searchQuery}
                <button onClick={() => setSearchQuery("")} className="hover:text-blue-900">
                  <X size={14} />
                </button>
              </span>
            )}
            {locationFilter && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Location: {locationFilter}
                <button onClick={() => setLocationFilter("")} className="hover:text-blue-900">
                  <X size={14} />
                </button>
              </span>
            )}
            {jobTypeFilter && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Type: {jobTypeFilter}
                <button onClick={() => setJobTypeFilter("")} className="hover:text-blue-900">
                  <X size={14} />
                </button>
              </span>
            )}
            {salaryRangeFilter && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Salary: {salaryRangeFilter}
                <button onClick={() => setSalaryRangeFilter("")} className="hover:text-blue-900">
                  <X size={14} />
                </button>
              </span>
            )}
            {experienceFilter && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Experience: {experienceFilter}
                <button onClick={() => setExperienceFilter("")} className="hover:text-blue-900">
                  <X size={14} />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {filteredJobs && filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  selected={selectedJobId === job.id}
                  onClick={() => setSelectedJobId(job.id)}
                />
              ))
            ) : (
              <div className="py-20 text-center text-gray-600 bg-white rounded-lg shadow-md">
                <p className="mb-4 text-lg font-semibold">No jobs found</p>
                {activeFiltersCount > 0 ? (
                  <>
                    <p className="mb-4">Try adjusting your filters to see more results.</p>
                    <button
                      onClick={clearAllFilters}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Clear All Filters
                    </button>
                  </>
                ) : (
                  <p>No jobs posted yet.</p>
                )}
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