"use client";

import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

import { useJobs } from "./contexts/JobsContext";


export default function HomePage() {  // rename from Home → HomePage
  const { jobs } = useJobs();
  return (
    <>
      <Navbar />
      <main>
        <Hero />
       
      </main>
      <Footer />
    </>
  );
}
