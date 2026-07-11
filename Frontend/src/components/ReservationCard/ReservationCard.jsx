import "./ReservationCard.css";

/**
 * Displays a single reservation in a card format.
 *
 * Props:
 *  - reservation: { _id, date, timeSlot, guests, status, table: { tableNumber } }
 *  - onCancel: optional callback(id) — shown only for "Booked" reservations
 */
const ReservationCard = ({ reservation, onCancel }) => {
  const formattedDate = new Date(reservation.date).toLocaleDateString();

  return (
    <div className="card reservation-card">
      <div className="reservation-card-info">
        <p>
          <strong>Date:</strong> {formattedDate}
        </p>
        <p>
          <strong>Time:</strong> {reservation.timeSlot}
        </p>
        <p>
          <strong>Guests:</strong> {reservation.guests}
        </p>
        <p>
          <strong>Table:</strong>{" "}
          {reservation.table ? reservation.table.tableNumber : "—"}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`badge badge-${reservation.status.toLowerCase()}`}
          >
            {reservation.status}
          </span>
        </p>
      </div>

      {onCancel && reservation.status === "Booked" && (
        <button
          className="btn btn-danger btn-sm"
          onClick={() => onCancel(reservation._id)}
        >
          Cancel
        </button>
      )}
    </div>
  );
};

export default ReservationCard;
