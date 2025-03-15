import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Register.css';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('Male');
    const [contactInfo, setContactInfo] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const patientData = {
            firstName,
            lastName,
            dateOfBirth,
            gender,
            contactInfo
        };

        try {
            const response = await axios.post('http://localhost:8080/patient/registerSuccess', patientData);
            if (response.status === 200) {
                alert("Registration Successful!");
                navigate('/');
            }
        } catch (error) {
            console.error("Registration failed:", error);
            setErrorMessage("Registration failed. Please try again.");
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2 className="text-center">🏥 Patient Registration</h2>
                {errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">First Name</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Enter first name"
                            value={firstName} 
                            onChange={(e) => setFirstName(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Last Name</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Enter last name"
                            value={lastName} 
                            onChange={(e) => setLastName(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Date of Birth</label>
                        <input 
                            type="date" 
                            className="form-control" 
                            value={dateOfBirth} 
                            onChange={(e) => setDateOfBirth(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Gender</label>
                        <select 
                            className="form-select" 
                            value={gender} 
                            onChange={(e) => setGender(e.target.value)} 
                            required
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Contact Info</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Enter contact info"
                            value={contactInfo} 
                            onChange={(e) => setContactInfo(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Register
                    </button>
                </form>
                <div className="text-center mt-3">
                    Already have an account? <a href="/Patient/patient/login">Login here</a>
                </div>
            </div>
        </div>
    );
};

export default Register;
