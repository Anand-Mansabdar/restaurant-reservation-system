import api from "./api";

/**
 * POST /reservations
 * Creates a new reservation. The backend auto-assigns the best table.
 */
export const createReservation = ({ date, timeSlot, guests }) => {
  return api.post("/reservations", { date, timeSlot, guests });
};

/**
 * GET /reservations/my
 * Returns all reservations belonging to the currently logged-in customer.
 */
export const getMyReservations = () => {
  return api.get("/reservations/my");
};

/**
 * DELETE /reservations/:id
 * Soft-cancels a customer's own reservation (sets status to 'Cancelled').
 */
export const cancelReservation = (id) => {
  return api.delete(`/reservations/${id}`);
};
