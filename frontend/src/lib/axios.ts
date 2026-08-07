import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect on 401 if we're NOT on the login/register page
    // and the request was NOT a login/register attempt
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const url = error.config?.url || "";
      const isAuthRoute = url.includes("/auth/login") || url.includes("/auth/register");
      const isOnLoginPage = window.location.pathname === "/login" || window.location.pathname === "/register";

      if (!isAuthRoute && !isOnLoginPage) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
