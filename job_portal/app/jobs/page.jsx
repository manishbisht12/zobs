"use client";

import React from "react";
import Navbar from "../../components/Navbar";
import Home from "../../components/Home";
export default function Jobs() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center text-3xl font-bold ">
        <Home/>
      </div>
    </>
  );
}
