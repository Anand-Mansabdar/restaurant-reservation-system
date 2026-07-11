import axios from "axios";

/**
 * Axios instance pre-configured for the backend API.
 *
 * - baseURL comes from the VITE_API_URL env variable.
 * - withCredentials ensures the browser sends/receives the httpOnly
 *   "token" cookie that the backend sets on login/register.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
