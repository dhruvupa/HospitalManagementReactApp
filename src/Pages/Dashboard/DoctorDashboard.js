import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./DoctorDashboard.css";

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [shiftStart, setShiftStart] = useState("");
  const [shiftEnd, setShiftEnd] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8080/doctor/dashboard", { withCredentials: true })
      .then(response => setDoctor(response.data))
      .catch(error => {
        console.error("Error fetching doctor:", error);
        navigate("/doctor/login");
      });
  }, [navigate]);

  useEffect(() => {
    if (doctor) {
      axios.get("http://localhost:8080/doctor/getAvailableTimeSlots", { withCredentials: true })
        .then(response => setAvailableTimeSlots(response.data))
        .catch(error => console.error("Error fetching available time slots:", error));
    }
  }, [doctor]);

  const handleUpdateShift = async (e) => {
    e.preventDefault();
    const shiftData = { shiftStart, shiftEnd };
    try {
      await axios.post("http://localhost:8080/doctor/updateShift", shiftData, { withCredentials: true });
      alert("Shift timings updated successfully!");
    } catch (error) {
      console.error("Error updating shift timings:", error);
      alert("Failed to update shift timings.");
    }
  };

  const handleLogout = async () => {
    await axios.post("http://localhost:8080/doctor/logout", {}, { withCredentials: true });
    navigate("/doctor/login");
  };

  if (!doctor) return <p>Loading...</p>;

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>🏥 HMS</h2>
        <ul>
          <li><Link to="/doctor-dashboard">Dashboard</Link></li>
          <li><Link to="/doctor/viewAppointments">Appointments</Link></li>
          <li><Link to="/doctor/profile">Profile</Link></li>
        </ul>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h2>🩺 Doctor Dashboard</h2>
        <h3>Welcome, Dr. {doctor.firstName} {doctor.lastName}!</h3>

        {/* Shift Timings Card */}
        <div className="card">
          <h3>🕒 Update Shift Timings</h3>
          <form onSubmit={handleUpdateShift}>
            <input type="time" value={shiftStart} onChange={(e) => setShiftStart(e.target.value)} required />
            <input type="time" value={shiftEnd} onChange={(e) => setShiftEnd(e.target.value)} required />
            <button type="submit">Update Shift</button>
          </form>
        </div>

        {/* Available Time Slots Card */}
        <div className="card">
          <h3>📅 Available Time Slots</h3>
          <ul>
            {availableTimeSlots.length > 0 ? (
              availableTimeSlots.map((slot, index) => <li key={index}>{slot}</li>)
            ) : (
              <p>No available time slots.</p>
            )}
          </ul>
        </div>

        {/* View Appointments Button */}
        <div className="card">
          <Link to="/doctor/viewAppointments">
            <button type="button">View Appointments</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;