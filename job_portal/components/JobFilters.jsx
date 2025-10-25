// "use client";

// import React, { useMemo } from "react";
// import { Search, MapPin, Briefcase, DollarSign, Clock, Filter, X } from "lucide-react";

// export default function JobFilters({
//   jobs,
//   searchQuery,
//   setSearchQuery,
//   locationFilter,
//   setLocationFilter,
//   jobTypeFilter,
//   setJobTypeFilter,
//   salaryRangeFilter,
//   setSalaryRangeFilter,
//   experienceFilter,
//   setExperienceFilter,
//   showFilters,
//   setShowFilters,
//   clearAllFilters
// }) {

//   const uniqueLocations = useMemo(() => {
//     if (!jobs) return [];
//     return [...new Set(jobs.map(job => job.location).filter(Boolean))];
//   }, [jobs]);

//   const uniqueJobTypes = useMemo(() => {
//     if (!jobs) return [];
//     return [...new Set(jobs.map(job => job.type || job.jobType).filter(Boolean))];
//   }, [jobs]);

//   const activeFiltersCount = [searchQuery, locationFilter, jobTypeFilter, salaryRangeFilter, experienceFilter]
//     .filter(f => f !== "").length;

//   return (
//     <div className={`bg-white rounded-lg shadow-md p-6 mb-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//           <Filter size={20} className="text-blue-600" />
//           Filter Jobs
//         </h2>
//         {activeFiltersCount > 0 && (
//           <button
//             onClick={clearAllFilters}
//             className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
//           >
//             <X size={16} />
//             Clear All
//           </button>
//         )}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//         {/* Search Input */}
//         <div className="relative col-span-1 md:col-span-2 lg:col-span-1">
//           <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
//             <input
//               type="text"
//               placeholder="Job title or company"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900"
//             />
//           </div>
//         </div>

//         {/* Location Filter */}
//         <div className="relative">
//           <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
//           <div className="relative">
//             <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
//             <select
//               value={locationFilter}
//               onChange={(e) => setLocationFilter(e.target.value)}
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-gray-700"
//             >
//               <option value="" disabled hidden>All Locations</option>
//               {uniqueLocations.map((loc) => (
//                 <option key={loc} value={loc}>{loc}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Job Type Filter */}
//         <div className="relative">
//           <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
//           <div className="relative">
//             <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
//             <select
//               value={jobTypeFilter}
//               onChange={(e) => setJobTypeFilter(e.target.value)}
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-gray-700"
//             >
//               <option value="" disabled hidden>All Types</option>
//               {uniqueJobTypes.map((type) => (
//                 <option key={type} value={type}>{type}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Salary Range Filter */}
//         <div className="relative">
//           <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
//           <div className="relative">
//             <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
//             <select
//               value={salaryRangeFilter}
//               onChange={(e) => setSalaryRangeFilter(e.target.value)}
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-gray-700"
//             >
//               <option value="" disabled hidden>All Salaries</option>
//               <option value="0-50k">$0 - $50k</option>
//               <option value="50k-100k">$50k - $100k</option>
//               <option value="100k-150k">$100k - $150k</option>
//               <option value="150k+">$150k+</option>
//             </select>
//           </div>
//         </div>

//         {/* Experience Filter */}
//         <div className="relative">
//           <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
//           <div className="relative">
//             <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
//             <select
//               value={experienceFilter}
//               onChange={(e) => setExperienceFilter(e.target.value)}
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-gray-700"
//             >
//               <option value="" disabled hidden>Experience</option>
//               <option value="entry">Entry Level</option>
//               <option value="mid">Mid Level</option>
//               <option value="senior">Senior Level</option>
//               <option value="lead">Lead</option>
//             </select>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import React, { useMemo } from "react";
import { Search, MapPin, Briefcase, DollarSign, Clock, Filter, X } from "lucide-react";

export default function JobFilters({
  jobs,
  searchQuery,
  setSearchQuery,
  locationFilter,
  setLocationFilter,
  jobTypeFilter,
  setJobTypeFilter,
  salaryRangeFilter,
  setSalaryRangeFilter,
  experienceFilter,
  setExperienceFilter,
  showFilters,
  clearAllFilters,
  filteredJobsCount,
  totalJobsCount
}) {

  // Extract unique locations from jobs
  const uniqueLocations = useMemo(() => {
    if (!jobs) return [];
    const locations = jobs
      .map(job => job.location)
      .filter(location => location && location.trim() !== "");
    return [...new Set(locations)].sort();
  }, [jobs]);

  // Extract unique job types from jobs
  const uniqueJobTypes = useMemo(() => {
    if (!jobs) return [];
    const types = jobs
      .map(job => job.type || job.jobType)
      .filter(type => type && type.trim() !== "");
    return [...new Set(types)].sort();
  }, [jobs]);

  const activeFiltersCount = [
    searchQuery, 
    locationFilter, 
    jobTypeFilter, 
    salaryRangeFilter, 
    experienceFilter
  ].filter(f => f !== "").length;

  return (
    <>
      <div className={`bg-white rounded-lg shadow-md p-6 mb-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Filter size={20} className="text-blue-600" />
            Filter Jobs
          </h2>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 transition"
            >
              <X size={16} />
              Clear All
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search Input */}
          <div className="relative col-span-1 md:col-span-2 lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
                size={18} 
              />
              <input
                type="text"
                placeholder="Job title or company"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition placeholder-gray-400 text-gray-900"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Location Filter */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <div className="relative">
              <MapPin 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
                size={18} 
              />
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white text-gray-900 cursor-pointer transition"
              >
                <option value="">All Locations</option>
                {uniqueLocations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Job Type Filter */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Type
            </label>
            <div className="relative">
              <Briefcase 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
                size={18} 
              />
              <select
                value={jobTypeFilter}
                onChange={(e) => setJobTypeFilter(e.target.value)}
                className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white text-gray-900 cursor-pointer transition"
              >
                <option value="">All Types</option>
                {uniqueJobTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Salary Range Filter */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salary Range
            </label>
            <div className="relative">
              <DollarSign 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
                size={18} 
              />
              <select
                value={salaryRangeFilter}
                onChange={(e) => setSalaryRangeFilter(e.target.value)}
                className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white text-gray-900 cursor-pointer transition"
              >
                <option value="">All Salaries</option>
                <option value="0-50k">$0 - $50k</option>
                <option value="50k-100k">$50k - $100k</option>
                <option value="100k-150k">$100k - $150k</option>
                <option value="150k+">$150k+</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Experience Filter */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience
            </label>
            <div className="relative">
              <Clock 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
                size={18} 
              />
              <select
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(e.target.value)}
                className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white text-gray-900 cursor-pointer transition"
              >
                <option value="">All Levels</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
                <option value="lead">Lead</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredJobsCount}</span> of{" "}
            <span className="font-semibold text-gray-900">{totalJobsCount}</span> jobs
            {activeFiltersCount > 0 && (
              <span className="ml-2 text-blue-600">
                ({activeFiltersCount} {activeFiltersCount === 1 ? 'filter' : 'filters'} active)
              </span>
            )}
          </p>
        </div>
      </div>
    </>
  );
}