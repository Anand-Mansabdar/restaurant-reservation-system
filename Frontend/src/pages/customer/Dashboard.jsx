import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import * as reservationService from "../../services/reservationService";
import ReservationCard from "../../components/ReservationCard/ReservationCard";
import Loader from "../../components/Loader/Loader";

/**
 * Customer Dashboard
 *
 * Shows:
 *  - Upcoming (Booked) reservations as cards
 *  - Quick action links to book or view all reservations
 */
const Dashboard = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await reservationService.getMyReservations();
        setReservations(res.data.data.reservations);
      } catch {
        toast.error("Failed to load reservations");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  // Only show upcoming booked reservations on the dashboard
  const upcoming = reservations.filter((r) => r.status === "Booked");

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this reservation?")) return;
    try {
      await reservationService.cancelReservation(id);
      setReservations((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: "Cancelled" } : r))
      );
      toast.success("Reservation cancelled");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel");
    }
  };

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/customer/book" className="btn btn-primary">
          Book a Table
        </Link>
        <Link to="/customer/reservations" className="btn btn-outline">
          View All Reservations
        </Link>
      </div>

      {/* Upcoming Reservations */}
      <h2>Upcoming Reservations</h2>

      {loading ? (
        <Loader />
      ) : upcoming.length === 0 ? (
        <div className="empty-state">
          <p>No upcoming reservations.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {upcoming.map((r) => (
            <ReservationCard
              key={r._id}
              reservation={r}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
