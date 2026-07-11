import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import * as reservationService from "../../services/reservationService";
import ReservationForm from "../../components/ReservationForm/ReservationForm";

/**
 * Book Reservation page — renders the ReservationForm component
 * and calls the backend to create a new reservation.
 */
const BookReservation = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await reservationService.createReservation(data);
      toast.success("Reservation booked successfully!");
      navigate("/customer/reservations");
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to book reservation";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Book a Table</h1>
      <div className="card" style={{ maxWidth: "480px" }}>
        <ReservationForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};

export default BookReservation;
