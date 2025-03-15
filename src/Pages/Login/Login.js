import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";

const Login = () => {
  const [role, setRole] = useState("patient");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = {
      firstName: username.split(" ")[0], // Assuming input is "John Doe"
      lastName: username.split(" ")[1] || "", // Handle single-word names
    };

    try {
      const response = await fetch(`http://localhost:8080/${role}/loginSuccess`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data based on role
        if (role === "doctor") {
          localStorage.setItem("loggedInUser", JSON.stringify(data.doctor));
        } else if (role === "patient") {
          localStorage.setItem("loggedInUser", JSON.stringify(data.patient));
        } else if (role === "nurse") {
          localStorage.setItem("loggedInUser", JSON.stringify(data.nurse));
        } else if (role === "admin") {
          localStorage.setItem("loggedInUser", JSON.stringify(data.admin));
        }

        // Navigate to the respective dashboard
        navigate(`/${role}-dashboard`);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="text-center">🏥 Hospital Management System</h2>
        <form onSubmit={handleLogin}>
          {/* Role Selection */}
          <div className="mb-3">
            <label className="form-label">Login as:</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
              <option value="admin">Admin</option> {/* Added Admin */}
            </select>
          </div>

          {/* Username Field */}
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Login Button */}
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
