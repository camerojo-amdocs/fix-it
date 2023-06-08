import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./Dashboard";
import LoginPage from "./LoginPage";

function App() {
  return (
    <Routes>
      <Route path="Dashboard" element={<Dashboard />} />
      <Route path="/" element={<LoginPage />} />
    </Routes>
  );
}
export default App;
