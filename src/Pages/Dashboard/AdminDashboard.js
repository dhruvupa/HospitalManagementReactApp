import React, { useState, useEffect } from "react";

const AdminDashboard = () => {
  const [view, setView] = useState("home");
  const [doctors, setDoctors] = useState([]);
  const [nurses, setNurses] = useState([]);

  useEffect(() => {
    if (view === "viewDoctors") fetchDoctors();
    if (view === "viewNurses") fetchNurses();
  }, [view]);

  // Fetch Doctors
  const fetchDoctors = async () => {
    try {
      const response = await fetch("http://localhost:8080/admin/listDoctors");
      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  // Fetch Nurses
  const fetchNurses = async () => {
    try {
      const response = await fetch("http://localhost:8080/admin/listNurses");
      const data = await response.json();
      setNurses(data);
    } catch (error) {
      console.error("Error fetching nurses:", error);
    }
  };

  // Logout Function
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/admin/logout", { method: "POST" });
      alert("Logged out successfully");
      window.location.href = "/admin-login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-blue-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <button className="w-full py-2 px-4 bg-blue-700 hover:bg-blue-600 rounded my-2" onClick={() => setView("addDoctor")}>
          Add Doctor
        </button>
        <button className="w-full py-2 px-4 bg-blue-700 hover:bg-blue-600 rounded my-2" onClick={() => setView("addNurse")}>
          Add Nurse
        </button>
        <button className="w-full py-2 px-4 bg-blue-700 hover:bg-blue-600 rounded my-2" onClick={() => setView("viewDoctors")}>
          View Doctors
        </button>
        <button className="w-full py-2 px-4 bg-blue-700 hover:bg-blue-600 rounded my-2" onClick={() => setView("viewNurses")}>
          View Nurses
        </button>
        <button className="w-full py-2 px-4 bg-red-600 hover:bg-red-500 rounded my-2" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Content Section */}
      <div className="w-3/4 p-6">
        {view === "home" && <h2 className="text-2xl font-bold">Welcome to Admin Dashboard</h2>}
        {view === "addDoctor" && <AddDoctor />}
        {view === "addNurse" && <AddNurse />}
        {view === "viewDoctors" && <DoctorList doctors={doctors} />}
        {view === "viewNurses" && <NurseList nurses={nurses} />}
      </div>
    </div>
  );
};

// Add Doctor Component
const AddDoctor = () => {
  const [doctor, setDoctor] = useState({ firstName: "", lastName: "", specialization: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/admin/addDoctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doctor),
      });

      if (response.ok) {
        alert("Doctor added successfully!");
      } else {
        alert("Failed to add doctor");
      }
    } catch (error) {
      console.error("Error adding doctor:", error);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Add Doctor</h3>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <input type="text" placeholder="First Name" required className="input" onChange={(e) => setDoctor({ ...doctor, firstName: e.target.value })} />
        <input type="text" placeholder="Last Name" required className="input" onChange={(e) => setDoctor({ ...doctor, lastName: e.target.value })} />
        <input type="text" placeholder="Specialization" required className="input" onChange={(e) => setDoctor({ ...doctor, specialization: e.target.value })} />
        <button type="submit" className="btn">Add Doctor</button>
      </form>
    </div>
  );
};

// Add Nurse Component
const AddNurse = () => {
  const [nurse, setNurse] = useState({ firstName: "", lastName: "", department: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/admin/addNurse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nurse),
      });

      if (response.ok) {
        alert("Nurse added successfully!");
      } else {
        alert("Failed to add nurse");
      }
    } catch (error) {
      console.error("Error adding nurse:", error);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Add Nurse</h3>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <input type="text" placeholder="First Name" required className="input" onChange={(e) => setNurse({ ...nurse, firstName: e.target.value })} />
        <input type="text" placeholder="Last Name" required className="input" onChange={(e) => setNurse({ ...nurse, lastName: e.target.value })} />
        <input type="text" placeholder="Department" required className="input" onChange={(e) => setNurse({ ...nurse, department: e.target.value })} />
        <button type="submit" className="btn">Add Nurse</button>
      </form>
    </div>
  );
};

// Doctor List Component
const DoctorList = ({ doctors }) => (
  <div>
    <h3 className="text-xl font-bold mb-4">Doctors List</h3>
    <ul>
      {doctors.length > 0 ? doctors.map((doc, index) => (
        <li key={index} className="border p-2">{doc.firstName} {doc.lastName} - {doc.specialization}</li>
      )) : <p>No doctors found</p>}
    </ul>
  </div>
);

// Nurse List Component
const NurseList = ({ nurses }) => (
  <div>
    <h3 className="text-xl font-bold mb-4">Nurses List</h3>
    <ul>
      {nurses.length > 0 ? nurses.map((nurse, index) => (
        <li key={index} className="border p-2">{nurse.firstName} {nurse.lastName} - {nurse.department}</li>
      )) : <p>No nurses found</p>}
    </ul>
  </div>
);

export default AdminDashboard;
