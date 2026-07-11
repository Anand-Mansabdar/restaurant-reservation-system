import "./Loader.css";

/**
 * A simple full-area loading spinner.
 * Used by ProtectedRoute while auth state is being resolved,
 * and by pages while fetching data.
 */
const Loader = () => {
  return (
    <div className="loader-container">
      <div className="spinner" />
    </div>
  );
};

export default Loader;
