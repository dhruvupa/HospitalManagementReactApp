import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./PatientAppointment.css"; // Import CSS for styling

const PatientAppointment = () => {
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    // Fetch appointments data
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get("http://localhost:8080/patient/viewAppointments", { withCredentials: true });
                setAppointments(response.data.appointments);
            } catch (error) {
                console.error("Error fetching appointments:", error);
                navigate("/patient/login");
            }
        };

        fetchAppointments();
    }, [navigate]);

    // Fetch time slots for rescheduling (excluding the current slot)
    const fetchTimeSlots = async (doctorId, currentSlot) => {
        if (!doctorId) return;

        try {
            const response = await axios.get(`http://localhost:8080/patient/getTimeSlots?doctorId=${doctorId}`, { withCredentials: true });

            // Ensure the date formats match before filtering
            const filteredSlots = response.data.filter(slot => slot !== currentSlot);
            console.log("Fetched Time Slots:", filteredSlots); // Debugging
            setTimeSlots(filteredSlots);
        } catch (error) {
            console.error("Error fetching time slots:", error);
            setErrorMessage("Error fetching time slots. Please try again.");
        }
    };

    // Handle appointment selection for rescheduling
    const handleSelectAppointment = (appointment) => {
        console.log("Selected Appointment:", appointment); // Debugging
        setSelectedAppointment(appointment);
        // Fetch time slots excluding the current appointment's slot
        fetchTimeSlots(appointment.doctorId, appointment.appointmentDate);
    };

    // Handle time slot selection for rescheduling
    const handleSlotSelection = (slot) => {
        setSelectedSlot(slot);
        setErrorMessage("");
    };

    // Handle cancel appointment
    const handleCancelAppointment = async (appointmentId) => {
        try {
            await axios.post(`http://localhost:8080/patient/cancelAppointment?appointmentId=${appointmentId}`, {}, { withCredentials: true });
            setAppointments(prev => prev.map(appt => 
                appt.id === appointmentId ? { ...appt, status: "Cancelled" } : appt
            ));
            alert("Appointment cancelled successfully!");
        } catch (error) {
            console.error("Error cancelling appointment:", error);
            setErrorMessage("Failed to cancel appointment. Please try again.");
        }
    };

    // Handle reschedule appointment
    const handleRescheduleAppointment = async () => {
        if (!selectedAppointment || !selectedSlot) {
            setErrorMessage("Please select a time slot.");
            return;
        }

        try {
            await axios.post(
                `http://localhost:8080/patient/rescheduleAppointment?appointmentId=${selectedAppointment.id}&newTimeSlot=${selectedSlot}`,
                {}, // Empty body
                { withCredentials: true }
            );

            // Update appointment list with new time slot
            setAppointments(prev =>
                prev.map(appt =>
                    appt.id === selectedAppointment.id
                        ? { ...appt, status: "Rescheduled", appointmentDate: selectedSlot }
                        : appt
                )
            );

            alert("Appointment rescheduled successfully!");
            setSelectedAppointment(null);
            setSelectedSlot(""); // Reset selection
        } catch (error) {
            console.error("Error rescheduling appointment:", error);
            setErrorMessage("Failed to reschedule appointment. Please try again.");
        }
    };

    return (
        <div className="view-appointments-container">
            <h2>Your Appointments</h2>

            {/* Appointments List */}
            <div className="appointments-list">
                {appointments.length === 0 ? (
                    <p>No appointments available.</p>
                ) : (
                    <ul>
                        {appointments.map((appointment) => (
                            <li key={appointment.id} className="appointment-card">
                                <p><strong>Doctor:</strong> {appointment.doctorName}</p>
                                <p><strong>Date & Time:</strong> {appointment.appointmentDate}</p>
                                <p><strong>Status:</strong> {appointment.status}</p>
                                {appointment.status.toLowerCase() === "scheduled" && (
                                    <div className="action-buttons">
                                        <button onClick={() => handleSelectAppointment(appointment)}>Reschedule</button>
                                        <button onClick={() => handleCancelAppointment(appointment.id)}>Cancel</button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Reschedule Appointment Modal */}
            {selectedAppointment && (
                <>
                    <div className="modal-overlay" onClick={() => setSelectedAppointment(null)}></div>
                    <div className="modal">
                        <h3>Reschedule Appointment</h3>

                        {/* Display Available Time Slots */}
                        <div className="time-slot">
                            {timeSlots.length > 0 ? (
                                timeSlots.map((slot) => (
                                    <button
                                        key={slot}
                                        type="button"
                                        className={selectedSlot === slot ? "selected" : ""}
                                        onClick={() => handleSlotSelection(slot)}
                                    >
                                        {slot}
                                    </button>
                                ))
                            ) : (
                                <p>No available slots found.</p>
                            )}
                        </div>

                        <div className="error-message">{errorMessage}</div>

                        <button onClick={handleRescheduleAppointment} disabled={!selectedSlot}>
                            Reschedule
                        </button>
                        <button onClick={() => setSelectedAppointment(null)}>Cancel</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default PatientAppointment;