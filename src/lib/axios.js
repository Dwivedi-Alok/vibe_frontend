import axios from "axios";
export const axiosInstance= axios.create({
    // baseURL: api",
    baseURL: "https://vibe-backend-5bmf.onrender.com/api",
    // baseURL: "http://localhost:5001/api",
    withCredentials: true,
})