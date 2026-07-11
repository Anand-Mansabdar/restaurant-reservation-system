import "./TableCard.css";

/**
 * Displays a single restaurant table in a card format.
 *
 * Props:
 *  - table: { _id, tableNumber, capacity, isActive }
 *  - onEdit: callback(table) — opens edit flow
 *  - onDelete: callback(id) — deactivates the table
 */
const TableCard = ({ table, onEdit, onDelete }) => {
  return (
    <div className="card table-card">
      <div className="table-card-info">
        <p>
          <strong>Table #{table.tableNumber}</strong>
        </p>
        <p>Capacity: {table.capacity}</p>
        <p>
          Status:{" "}
          <span
            className={`badge ${table.isActive ? "badge-booked" : "badge-cancelled"}`}
          >
            {table.isActive ? "Active" : "Inactive"}
          </span>
        </p>
      </div>

      <div className="table-card-actions">
        <button className="btn btn-outline btn-sm" onClick={() => onEdit(table)}>
          Edit
        </button>
        {table.isActive && (
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(table._id)}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

export default TableCard;
