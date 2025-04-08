import axios from "axios";

const axiosInstance = axios.create({
   baseURL: process.env.NEXT_PUBLIC_API_URL || "https://author-server.onrender.com/api",
   withCredentials: true,
   headers: {
      "Content-Type": "application/json",
   },
});

export default axiosInstance;
