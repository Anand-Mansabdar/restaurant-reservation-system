import api from "./api";

/**
 * POST /auth/register
 * Creates a new customer account. The backend sets the JWT cookie automatically.
 */
export const register = (name, email, password) => {
  return api.post("/auth/register", { name, email, password });
};

/**
 * POST /auth/login
 * Authenticates a user. The backend sets the JWT cookie automatically.
 */
export const login = (email, password) => {
  return api.post("/auth/login", { email, password });
};

/**
 * POST /auth/logout
 * Clears the httpOnly JWT cookie on the server.
 */
export const logout = () => {
  return api.post("/auth/logout");
};

/**
 * GET /auth/me
 * Returns the currently authenticated user from the cookie.
 * Used to rehydrate AuthContext on page refresh.
 */
export const getMe = () => {
  return api.get("/auth/me");
};
