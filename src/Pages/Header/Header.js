import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Header = () => {
  const [loggedInUser, setLoggedInUser] = useState("");

  // Retrieve logged-in user from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user) {
      setLoggedInUser(`${user.firstName} ${user.lastName}`);
    }
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        {/* Logo / Title */}
        <Link className="navbar-brand" to="/">
          🏥 Hospital Management System
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
             
          </ul>

          {/* Logged-in User */}
          <span className="navbar-text ms-3">
            👤 Welcome, <strong>{loggedInUser || "Guest"}</strong>
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Header;