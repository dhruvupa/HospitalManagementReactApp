import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./PatientDashboard.css"; // Import CSS for styling

const PatientDashboard = () => {
    const [patient, setPatient] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    // Fetch patient and doctors data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const patientResponse = await axios.get("http://localhost:8080/patient/dashboard", { withCredentials: true });
                console.log("Patient Data:", patientResponse.data.patient); // Log patient data
                setPatient(patientResponse.data.patient);

                const doctorsResponse = await axios.get("http://localhost:8080/patient/dashboard", { withCredentials: true });
                console.log("Doctors Data:", doctorsResponse.data.doctors); // Log doctors data
                setDoctors(doctorsResponse.data.doctors);
            } catch (error) {
                console.error("Error fetching data:", error);
                navigate("/patient/login");
            }
        };

        fetchData();
    }, [navigate]);

    // Fetch time slots for selected doctor
    const fetchTimeSlots = async (doctorId) => {
        if (!doctorId) {
            setTimeSlots([]);
            setSelectedSlot("");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8080/patient/getTimeSlots?doctorId=${doctorId}`, { withCredentials: true });
            setTimeSlots(response.data);
        } catch (error) {
            console.error("Error fetching time slots:", error);
            setErrorMessage("Error fetching time slots. Please try again.");
        }
    };

    // Handle doctor selection
    const handleDoctorChange = (e) => {
        const doctorId = e.target.value;
        setSelectedDoctor(doctorId);
        fetchTimeSlots(doctorId);
    };

    // Handle time slot selection
    const handleSlotSelection = (slot) => {
        setSelectedSlot(slot);
        setErrorMessage("");
    };

    // Handle appointment booking
    const handleBookAppointment = async (e) => {
        e.preventDefault();
    
        if (!selectedDoctor) {
            setErrorMessage("Please select a doctor.");
            return;
        }
    
        if (!selectedSlot) {
            setErrorMessage("Please select a time slot.");
            return;
        }
 
    
        try {
            const response = await axios.post(
                `http://localhost:8080/patient/bookAppointment?doctorId=${selectedDoctor}&timeSlot=${selectedSlot}`,
                {}, // Empty body
                { withCredentials: true }
            );
            console.log("Appointment Booking Response:", response.data); // Debugging
            alert("Appointment booked successfully!");
            navigate("/patient-dashboard");
        } catch (error) {
            console.error("Error booking appointment:", error);
            setErrorMessage("Booking failed. Please try again.");
        }
    };

    const handleLogout = async () => {
        await axios.post("http://localhost:8080/patient/logout", {}, { withCredentials: true });
        navigate("/patient/login");
    };

    if (!patient) return <p>Loading...</p>;

    return (
        <div className="dashboard-container">
             
            
            {/* Main Content */}
            <div className="main-content">
                <h2>👤 Patient Dashboard</h2>
                <h3>Welcome, {patient.firstName} {patient.lastName}!</h3>

                {/* Book Appointment Card */}
                <div className="card">
                    <h3>📅 Book Appointment</h3>
                    <form onSubmit={handleBookAppointment}>
                        <select value={selectedDoctor} onChange={handleDoctorChange} required>
                            <option value="">Select Doctor</option>
                            {doctors.map((doctor) => (
                                <option key={doctor.id} value={doctor.id}>
                                    {doctor.firstName} {doctor.lastName} ({doctor.specialization})
                                </option>
                            ))}
                        </select>
                        <div className="time-slot">
                            {timeSlots.map((slot) => (
                                <button
                                    key={slot}
                                    type="button"
                                    className={selectedSlot === slot ? "selected" : ""}
                                    onClick={() => handleSlotSelection(slot)}
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>
                        <input type="hidden" value={selectedSlot} />
                        <div className="error-message">{errorMessage}</div>
                        <button type="submit">Book Appointment</button>
                    </form>
                </div>

                {/* View Appointments Button */}
                <div className="card">
                    <Link to="/patient/viewAppointments">
                        <button type="button">View Appointments</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;