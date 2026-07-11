import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import AppRoutes from "./routes/AppRoutes";

/**
 * App root — wraps the entire application with:
 *  1. BrowserRouter  — client-side routing
 *  2. AuthProvider   — authentication state (cookie-based)
 *  3. Toaster        — toast notifications
 *  4. AppRoutes      — all route definitions
 */
const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;