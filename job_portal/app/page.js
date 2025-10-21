"use client";

import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        {/* You can add other sections here later if needed */}
      </main>
      <Footer />
    </>
  );
}
