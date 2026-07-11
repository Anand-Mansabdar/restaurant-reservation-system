import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

/**
 * Provides authentication state and actions to the component tree.
 *
 * On mount, calls GET /auth/me to check if the browser already has a
 * valid JWT cookie (i.e. the user is still logged in from a previous
 * session). This avoids needing localStorage for persistence.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate session on first load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await authService.getMe();
        setUser(res.data.data.user);
      } catch {
        // No valid cookie — user is not logged in, that's fine
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Logs in with email/password. On success the backend sets an httpOnly
   * cookie and returns the user object.
   */
  const login = async (email, password) => {
    const res = await authService.login(email, password);
    setUser(res.data.data.user);
    toast.success(res.data.message || "Login successful");
    return res.data.data.user;
  };

  /**
   * Registers a new customer account.
   */
  const register = async (name, email, password) => {
    const res = await authService.register(name, email, password);
    setUser(res.data.data.user);
    toast.success(res.data.message || "Registration successful");
    return res.data.data.user;
  };

  /**
   * Clears the JWT cookie on the server and resets local state.
   */
  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Even if the server call fails, clear client state
    }
    setUser(null);
    toast.success("Logged out");
  };

  const value = { user, loading, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook for consuming the auth context.
 * Must be used inside an <AuthProvider>.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
