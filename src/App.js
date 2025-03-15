
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
import PatientAppointment from './Pages/Appintments/PatientAppointment';
import NurseDashboard from './Pages/Dashboard/NurseDashboard';
import AdminDashboard from './Pages/Dashboard/AdminDashboard';


function App() {
  return (
    <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/patient-dashboard" element={<><Header /><PatientDashboard /></>} />
    <Route path="/doctor-dashboard" element={<><Header /><DoctorDashboard /></>} />
    <Route path="/nurse-dashboard" element={<><Header /><NurseDashboard /></>} />
    <Route path="/admin-dashboard" element={<><Header /><AdminDashboard /></>} />
    <Route path="/doctor/viewAppointments" element={<AppointmentDetails />} />
    <Route path="/patient/viewAppointments" element={<PatientAppointment />} />

  </Routes>
  );
}

export default App;
