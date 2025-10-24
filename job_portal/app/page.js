"use client";

import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import Banner from "../components/Banner";
import JobCard from "../components/JobCard";
import { useJobs } from "./contexts/JobsContext";


export default function HomePage() {  // rename from Home → HomePage
  const { jobs } = useJobs();
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Banner />

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-semibold mb-6">Latest Jobs</h2>
          {jobs && jobs.length > 0 ? (
            <div className="grid gap-6">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No jobs posted yet. Post a job to see it here.</p>
          )}
        </section>
        {/* You can add other sections here later if needed */}
       
      </main>
      <Footer />
    </>
  );
}
