import api from "./api";

// --- Reservation Management (Admin) ---

/**
 * GET /admin/reservations
 * Optionally pass a date string (YYYY-MM-DD) to filter.
 */
export const getAllReservations = (date) => {
  const params = date ? { date } : {};
  return api.get("/admin/reservations", { params });
};

/**
 * PUT /admin/reservations/:id
 * Partial or full update of a reservation (date, timeSlot, guests, table, status).
 */
export const updateReservation = (id, updates) => {
  return api.put(`/admin/reservations/${id}`, updates);
};

/**
 * DELETE /admin/reservations/:id
 * Soft-cancels any reservation (admin privilege, no ownership check).
 */
export const deleteReservation = (id) => {
  return api.delete(`/admin/reservations/${id}`);
};

// --- Table Management (Admin) ---

/**
 * GET /tables
 * Returns all tables sorted by tableNumber.
 */
export const getAllTables = () => {
  return api.get("/tables");
};

/**
 * POST /tables
 * Creates a new table.
 */
export const createTable = ({ tableNumber, capacity }) => {
  return api.post("/tables", { tableNumber, capacity });
};

/**
 * PUT /tables/:id
 * Updates a table's details (tableNumber, capacity, isActive).
 */
export const updateTable = (id, updates) => {
  return api.put(`/tables/${id}`, updates);
};

/**
 * DELETE /tables/:id
 * Soft-deletes (deactivates) a table.
 */
export const deleteTable = (id) => {
  return api.delete(`/tables/${id}`);
};
