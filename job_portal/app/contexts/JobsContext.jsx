"use client"
import { createContext, useContext, useState } from 'react';

const JobsContext = createContext();

export const JobsProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const [hasNewBookmark, setHasNewBookmark] = useState(false);

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
    <JobsContext.Provider value={{ jobs, addJob, bookmarkedJobs, toggleBookmark, isBookmarked, hasNewBookmark, clearNotification }}>
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