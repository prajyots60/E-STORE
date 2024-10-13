import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.mode === "development" ? "http://localhost:5000/api" : "/api",   // Replace with your backend URL
  withCredentials: true,  // send cookies with requests
});

export default axiosInstance;