"use client";

import React from "react";
import Navbar from "../../components/Navbar";
import Home from "../../components/Home";
import Banner from "../../components/Banner";
export default function Jobs() {
  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center mt-10 ">
        <Home/>
       
      </div>
       <Banner/>
    </>
  );
}

