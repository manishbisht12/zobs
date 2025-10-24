"use client"
import { createContext, useContext, useState } from 'react';

const JobsContext = createContext();

export const JobsProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);

  const addJob = (job) => {
    const newJob = {
      ...job,
      id: Date.now(),
      postedDate: new Date().toISOString()
    };
    setJobs(prev => [newJob, ...prev]);
  };

  return (
    <JobsContext.Provider value={{ jobs, addJob }}>
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