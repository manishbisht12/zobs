"use client"
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../../utils/api';

const JobsContext = createContext();

export const JobsProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const [hasNewBookmark, setHasNewBookmark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await api.get('/jobs');
        if (response.data.success) {
          // Transform API data to match frontend format
          const transformedJobs = response.data.data.jobs.map(job => ({
            id: job._id,
            title: job.jobTitle,
            company: job.companyName,
            location: job.location,
            type: job.jobType,
            workplaceType: job.workplaceType,
            experience: job.experience,
            salary: job.salaryMin && job.salaryMax 
              ? `${job.currency} ${job.salaryMin} - ${job.salaryMax}`
              : job.salaryMin 
              ? `${job.currency} ${job.salaryMin}+`
              : 'Not specified',
            salaryMin: job.salaryMin,
            salaryMax: job.salaryMax,
            currency: job.currency,
            description: job.description,
            skills: job.skills || [],
            category: job.category,
            postedDate: job.createdAt,
            employer: job.employer,
            ...job // Include all other fields
          }));
          setJobs(transformedJobs);
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError(err.message || 'Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const addJob = (job) => {
    const newJob = {
      ...job,
      id: Date.now(),
      postedDate: new Date().toISOString()
    };
    setJobs(prev => [newJob, ...prev]);
  };

  const toggleBookmark = (job) => {
    setBookmarkedJobs(prev => {
      const isBookmarked = prev.some(bj => bj.id === job.id);
      if (isBookmarked) {
        return prev.filter(bj => bj.id !== job.id);
      } else {
        setHasNewBookmark(true); // Show notification when bookmarking
        return [...prev, job];
      }
    });
  };

  const isBookmarked = (jobId) => {
    return bookmarkedJobs.some(bj => bj.id === jobId);
  };

  const clearNotification = () => {
    setHasNewBookmark(false);
  };

  return (
    <JobsContext.Provider value={{ 
      jobs, 
      addJob, 
      bookmarkedJobs, 
      toggleBookmark, 
      isBookmarked, 
      hasNewBookmark, 
      clearNotification,
      loading,
      error
    }}>
      {children}
    </JobsContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error('useJobs must be used within JobsProvider');
  }
  return context;
};