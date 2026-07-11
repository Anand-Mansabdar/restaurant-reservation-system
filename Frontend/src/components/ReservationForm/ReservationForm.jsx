import { useForm } from "react-hook-form";

/**
 * The 8 time slots defined by the backend's reservation model.
 * Kept in sync manually — if the backend adds slots, update this array.
 */
const TIME_SLOTS = [
  "11:00-12:00",
  "12:00-13:00",
  "13:00-14:00",
  "14:00-15:00",
  "18:00-19:00",
  "19:00-20:00",
  "20:00-21:00",
  "21:00-22:00",
];

/**
 * Reusable reservation booking form (date, timeSlot, guests).
 *
 * Props:
 *  - onSubmit(data): called with { date, timeSlot, guests }
 *  - isSubmitting: disables the button while a request is in flight
 */
const ReservationForm = ({ onSubmit, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Minimum date is today (YYYY-MM-DD)
  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          min={today}
          {...register("date", { required: "Date is required" })}
        />
        {errors.date && <p className="form-error">{errors.date.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="timeSlot">Time Slot</label>
        <select
          id="timeSlot"
          {...register("timeSlot", { required: "Time slot is required" })}
        >
          <option value="">Select a time slot</option>
          {TIME_SLOTS.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
        {errors.timeSlot && (
          <p className="form-error">{errors.timeSlot.message}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="guests">Number of Guests</label>
        <input
          id="guests"
          type="number"
          min="1"
          {...register("guests", {
            required: "Number of guests is required",
            min: { value: 1, message: "At least 1 guest required" },
            valueAsNumber: true,
          })}
        />
        {errors.guests && (
          <p className="form-error">{errors.guests.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Booking…" : "Book Reservation"}
      </button>
    </form>
  );
};

export default ReservationForm;
