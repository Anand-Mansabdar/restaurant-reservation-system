import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as adminService from "../../services/adminService";
import Loader from "../../components/Loader/Loader";

/**
 * Admin — All Reservations page.
 *
 * Features:
 *  - Date filter (optional)
 *  - Table showing all reservation details
 *  - Status update (Booked → Completed)
 *  - Cancel button (soft delete)
 */
const AllReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("");

  const fetchReservations = async (date) => {
    setLoading(true);
    try {
      const res = await adminService.getAllReservations(date || undefined);
      setReservations(res.data.data.reservations);
    } catch {
      toast.error("Failed to load reservations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleDateFilter = () => {
    fetchReservations(dateFilter);
  };

  const handleClearFilter = () => {
    setDateFilter("");
    fetchReservations();
  };

  const handleMarkCompleted = async (id) => {
    try {
      await adminService.updateReservation(id, { status: "Completed" });
      setReservations((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: "Completed" } : r))
      );
      toast.success("Reservation marked as completed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this reservation?")) return;
    try {
      await adminService.deleteReservation(id);
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
      <h1>All Reservations</h1>

      {/* Date filter */}
      <div className="filter-bar">
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
        <button className="btn btn-primary btn-sm" onClick={handleDateFilter}>
          Filter
        </button>
        {dateFilter && (
          <button className="btn btn-outline btn-sm" onClick={handleClearFilter}>
            Clear
          </button>
        )}
      </div>

      {loading ? (
        <Loader />
      ) : reservations.length === 0 ? (
        <div className="empty-state">
          <p>No reservations found.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Date</th>
                <th>Time</th>
                <th>Guests</th>
                <th>Table</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r._id}>
                  <td>{r.customer ? r.customer.name : "—"}</td>
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
                    {r.status === "Booked" && (
                      <>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => handleMarkCompleted(r._id)}
                          style={{ marginRight: "0.25rem" }}
                        >
                          Complete
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCancel(r._id)}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {r.status !== "Booked" && "—"}
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

export default AllReservations;
