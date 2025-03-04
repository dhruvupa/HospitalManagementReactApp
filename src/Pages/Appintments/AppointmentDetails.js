import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig"; // Axios instance

const AppointmentDetails = () => {
    const [appointments, setAppointments] = useState([]);
    const [filter, setFilter] = useState("current"); // Default to "current" bookings
    const navigate = useNavigate();

    // Fetch appointments based on filter
    useEffect(() => {
        api.get(`/doctor/viewAppointments?filter=${filter}`)
            .then(response => setAppointments(response.data))
            .catch(error => console.error("Error fetching appointments:", error));
    }, [filter]);

    // Function to handle accepting an appointment
    const handleAccept = async (appointmentId) => {
        try {
            await api.post("/doctor/acceptAppointment", { appointmentId });
            setAppointments(prev => prev.map(appt => 
                appt.id === appointmentId ? { ...appt, status: "Accepted" } : appt
            ));
        } catch (error) {
            console.error("Error accepting appointment:", error);
        }
    };

    // Function to handle rejecting an appointment
    const handleReject = async (appointmentId) => {
        try {
            await api.post("/doctor/rejectAppointment", { appointmentId });
            setAppointments(prev => prev.map(appt => 
                appt.id === appointmentId ? { ...appt, status: "Rejected" } : appt
            ));
        } catch (error) {
            console.error("Error rejecting appointment:", error);
        }
    };

    // Function to mark appointment as completed
    const handleComplete = async (appointmentId) => {
        try {
            await api.post("/doctor/completeAppointment", { appointmentId });
            setAppointments(prev => prev.map(appt => 
                appt.id === appointmentId ? { ...appt, status: "Completed" } : appt
            ));
        } catch (error) {
            console.error("Error completing appointment:", error);
        }
    };

    // Function to navigate to detailed appointment view
    const handleAppointmentClick = (appointmentId) => {
        navigate(`/doctor/appointment/${appointmentId}`);
    };

    return (
        <div className="appointments-container">
            <h2>Your Appointments</h2>

            {/* Filter Buttons */}
            <div className="filter-buttons">
                <button className={filter === "current" ? "active" : ""} onClick={() => setFilter("current")}>Current Bookings</button>
                <button className={filter === "past" ? "active" : ""} onClick={() => setFilter("past")}>Past Bookings</button>
                {filter === "past" && (
                    <>
                        <button className={filter === "rejected" ? "active" : ""} onClick={() => setFilter("rejected")}>Rejected</button>
                        <button className={filter === "completed" ? "active" : ""} onClick={() => setFilter("completed")}>Completed</button>
                    </>
                )}
            </div>

            {/* Appointment List */}
            <div className="appointments-list">
                {appointments.length === 0 ? (
                    <p>No appointments available.</p>
                ) : (
                    appointments.map((appointment) => (
                        <div key={appointment.id} className={`appointment-card ${appointment.status.toLowerCase()}`} onClick={() => handleAppointmentClick(appointment.id)}>
                            <p><strong>Patient:</strong> {appointment.patientName}</p>
                            <p><strong>Doctor:</strong> {appointment.doctorName}</p>
                            <p><strong>Date & Time:</strong> {appointment.appointmentDate}</p>
                            <p><strong>Status:</strong> {appointment.status}</p>

                            {/* Actions based on status */}
                            {appointment.status === "Scheduled" && (
                                <div>
                                    <button className="accept-btn" onClick={() => handleAccept(appointment.id)}>Accept</button>
                                    <button className="reject-btn" onClick={() => handleReject(appointment.id)}>Reject</button>
                                </div>
                            )}
                            {appointment.status === "Accepted" && (
                                <button className="complete-btn" onClick={() => handleComplete(appointment.id)}>Mark as Completed</button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AppointmentDetails;
