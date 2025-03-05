
import './App.css';
import Header from './Pages/Header/Header';

import React from "react";
import { Routes, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import DoctorDashboard from "./Pages/Dashboard/DoctorDashboard";
import AppointmentDetails from "./Pages/Appintments/AppointmentDetails";
import PatientDashboard from "./Pages/Dashboard/PatientDashboard";
// Dummy dashboards
//const PatientDashboard = () => <h2>🏥 Patient Dashboard</h2>;
//const DoctorDashboard = () => <h2>🩺 Doctor Dashboard</h2>;
const NurseDashboard = () => <h2>💉 Nurse Dashboard</h2>;

function App() {
  return (
    <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/patient-dashboard" element={<><Header /><PatientDashboard /></>} />
    <Route path="/doctor-dashboard" element={<><Header /><DoctorDashboard /></>} />
    <Route path="/nurse-dashboard" element={<><Header /><NurseDashboard /></>} />
    <Route path="/doctor/viewAppointments" element={<AppointmentDetails />} />

  </Routes>
  );
}

export default App;
