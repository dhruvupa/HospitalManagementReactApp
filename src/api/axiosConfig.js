import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true, // Ensures cookies are sent with every request
});

export default api;
