import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as reservationService from "../../services/reservationService";
import Loader from "../../components/Loader/Loader";

/**
 * My Reservations — displays all of the customer's reservations in a table.
 * Allows cancelling reservations that are still "Booked".
 */
const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await reservationService.getMyReservations();
        setReservations(res.data.data.reservations);
      } catch {
        toast.error("Failed to load reservations");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

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

  if (loading) return <Loader />;

  return (
    <div>
      <h1>My Reservations</h1>

      {reservations.length === 0 ? (
        <div className="empty-state">
          <p>You have no reservations yet.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Guests</th>
                <th>Table</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r._id}>
                  <td>{new Date(r.date).toLocaleDateString()}</td>
                  <td>{r.timeSlot}</td>
                  <td>{r.guests}</td>
                  <td>{r.table ? r.table.tableNumber : "—"}</td>
                  <td>
                    <span
                      className={`badge badge-${r.status.toLowerCase()}`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td>
                    {r.status === "Booked" ? (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleCancel(r._id)}
                      >
                        Cancel
                      </button>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyReservations;
