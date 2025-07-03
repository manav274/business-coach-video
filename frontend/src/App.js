import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Header,
  Dashboard,
  CourseDetails,
  CourseProvider
} from "./components";

function App() {
  return (
    <div className="App">
      <CourseProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/course/:courseId" element={<CourseDetails />} />
            </Routes>
          </div>
        </BrowserRouter>
      </CourseProvider>
    </div>
  );
}

export default App;