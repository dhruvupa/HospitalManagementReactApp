import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./NurseDashboard.css"; 

const NurseDashboard = () => {
    const [nurse, setNurse] = useState(null);
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8080/nurse/dashboard", { withCredentials: true });
                console.log("Dashboard Data:", response.data);
                setNurse(response.data.nurse);
                setTasks(response.data.nurseTask);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                navigate("/nurse/login");
            }
        };

        fetchData();
    }, [navigate]);

    const handleLogout = async () => {
        await axios.post("http://localhost:8080/nurse/logout", {}, { withCredentials: true });
        navigate("/");
    };

    if (!nurse) return <p className="loading-text">Loading...</p>;

    return (
        <div className="dashboard-container1">
            {/* Header */}
            
            <div className="dashboard-header">
                <h2 className="dashboard-title">👩‍⚕️ Nurse Dashboard</h2>
                <h3 className="welcome-text">Welcome, {nurse.firstName} {nurse.lastName}!</h3>
            </div>

             {/* Logout Button */}
             <div className="logout-container">
                <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
            </div>

            {/* Assigned Tasks */}
            <div className="card">
                <h3>📝 Assigned Tasks</h3>
                {tasks.length === 0 ? (
                    <p className="no-task-text">No tasks assigned.</p>
                ) : (
                    <ul className="task-list">
                        {tasks.map((task) => (
                            <li key={task.id} className="task-item">
                                <p><strong>Doctor:</strong> {task.doctorFirstName} {task.doctorLastName}</p>
                                <p><strong>Patient:</strong> {task.patientFirstName} {task.patientLastName}</p>
                                <p><strong>Note:</strong> {task.note}</p>
                                <p><strong>Date Assigned:</strong> {new Date(task.createdAt).toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

           
        </div>
    );
};

export default NurseDashboard;