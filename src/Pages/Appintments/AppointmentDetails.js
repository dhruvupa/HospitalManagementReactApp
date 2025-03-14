import React, { useState, useEffect } from "react";
//import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig"; // Axios instance
import "./AppointmentDetails.css"; // Import CSS for styling

const AppointmentDetails = () => {
    const [appointments, setAppointments] = useState([]);
    const [nurses, setNurses] = useState([]); // State to store nurses
    const [assignments, setAssignments] = useState({}); // State to manage nurse assignment and comments
    const [filter, setFilter] = useState("current"); // Default to "current" bookings
    //const navigate = useNavigate();

    // Fetch appointments and nurses based on filter
    useEffect(() => {
        api.get(`/doctor/viewAppointments?filter=${filter}`)
            .then(response => setAppointments(response.data))
            .catch(error => console.error("Error fetching appointments:", error));

        api.get("/nurse/nurses")
            .then(response => {
                setNurses(response.data);
                console.log("Nurses data:", response.data);
            })
            .catch(error => console.error("Error fetching nurses:", error));
    }, [filter]);

    // Function to handle accepting an appointment
    const handleAccept = async (appointmentId) => {
        try {
            await api.post("/doctor/acceptAppointment", null, { params: { appointmentId } });
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
            await api.post("/doctor/rejectAppointment", null, { params: { appointmentId } });
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
            await api.post("/doctor/completeAppointment", null, { params: { appointmentId } });
            setAppointments(prev => prev.map(appt =>
                appt.id === appointmentId ? { ...appt, status: "Completed" } : appt
            ));
        } catch (error) {
            console.error("Error completing appointment:", error);
        }
    };

    // Function to handle assigning a nurse and adding a comment
    const handleAssignNurseAndComment = async (appointment) => {
        const assignment = assignments[appointment.id]; 

        if (!assignment?.nurseId || !assignment?.comment) {
            alert("Please select a nurse and enter a comment.");
            return;
        }

        const requestData = {
            patientId: Number(appointment.patientId),  
            nurseId: Number(assignment.nurseId),
            comment: assignment.comment
        };

        console.log("Sending Request Payload:", requestData);

        try {
            const response = await api.post("/doctor/assignNurseAndComment", requestData);
            console.log("Response:", response.data);

            setAssignments(prev => {
                const newState = { ...prev };
                delete newState[appointment.id]; 
                return newState;
            });

            alert("Nurse assigned and comment saved successfully!");
        } catch (error) {
            console.error("Error assigning nurse and saving comment:", error.response?.data || error);
            alert("Failed to assign nurse and save comment.");
        }
    };

    return (
        <div className="appointments-container">
            <h2>Your Appointments</h2>

            {/* Filter Buttons */}
            <div className="filter-buttons">
                <button
                    className={filter === "current" ? "active" : ""}
                    onClick={() => setFilter("current")}
                >
                    Current Bookings
                </button>
                <button
                    className={filter === "past" ? "active" : ""}
                    onClick={() => setFilter("past")}
                >
                    Past Bookings
                </button>
                {filter === "past" && (
                    <>
                        <button
                            className={filter === "rejected" ? "active" : ""}
                            onClick={() => setFilter("rejected")}
                        >
                            Rejected
                        </button>
                        <button
                            className={filter === "completed" ? "active" : ""}
                            onClick={() => setFilter("completed")}
                        >
                            Completed
                        </button>
                    </>
                )}
            </div>

            {/* Appointment List */}
            <div className="appointments-list">
                {appointments.length === 0 ? (
                    <p className="no-appointments">No appointments available.</p>
                ) : (
                    appointments.map((appointment) => (
                        <div
                            key={appointment.id}
                            className={`appointment-card ${appointment.status.toLowerCase()}`}
                        >
                            <p><strong>Patient:</strong> {appointment.patientName}</p>
                            <p><strong>Doctor:</strong> {appointment.doctorName}</p>
                            <p><strong>Date & Time:</strong> {appointment.appointmentDate}</p>
                            <p><strong>Status:</strong>
                                <span className={`status-badge ${appointment.status.toLowerCase()}`}>
                                    {appointment.status}
                                </span>
                            </p>

                            {/* Actions based on status */}
                            {appointment.status.toLowerCase() === "scheduled" && (
                                <div className="action-buttons">
                                    <button className="accept-btn" onClick={() => handleAccept(appointment.id)}>
                                        Accept
                                    </button>
                                    <button className="reject-btn" onClick={() => handleReject(appointment.id)}>
                                        Reject
                                    </button>
                                </div>
                            )}

                            {/* Nurse Assignment and Comment Section for Accepted Appointments */}
                            {appointment.status.toLowerCase() === "accepted" && (
                                <div className="assignment-section">
                                    <select
                                        value={assignments[appointment.id]?.nurseId || ''}
                                        onChange={(e) => {
                                            setAssignments(prev => ({
                                                ...prev,
                                                [appointment.id]: { 
                                                    ...prev[appointment.id],
                                                    nurseId: e.target.value 
                                                }
                                            }));
                                        }}
                                    >
                                        <option value="">Select a Nurse</option>
                                        {nurses.map(nurse => (
                                            <option key={nurse.id} value={nurse.id}>
                                                {nurse.firstName} {nurse.lastName}
                                            </option>
                                        ))}
                                    </select>

                                    <textarea
                                        placeholder="Enter comment..."
                                        value={assignments[appointment.id]?.comment || ''}
                                        onChange={(e) => setAssignments(prev => ({
                                            ...prev,
                                            [appointment.id]: { 
                                                ...prev[appointment.id],
                                                comment: e.target.value 
                                            }
                                        }))}
                                    />

                                    <button className="assign-btn" onClick={() => handleAssignNurseAndComment(appointment)}>
                                        Assign Nurse & Save Comment
                                    </button>
                                </div>
                            )}

                            {appointment.status.toLowerCase() === "accepted" && (
                                <button className="complete-btn" onClick={() => handleComplete(appointment.id)}>
                                    Mark as Completed
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AppointmentDetails;
