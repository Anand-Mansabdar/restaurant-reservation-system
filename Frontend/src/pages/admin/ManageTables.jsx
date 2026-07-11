import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as adminService from "../../services/adminService";
import TableCard from "../../components/TableCard/TableCard";
import Loader from "../../components/Loader/Loader";

/**
 * Admin — Manage Tables page.
 *
 * Features:
 *  - List all tables as cards
 *  - Create a new table (form)
 *  - Edit an existing table (inline form)
 *  - Deactivate (soft-delete) a table
 */
const ManageTables = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTable, setEditingTable] = useState(null);

  // Form for creating / editing
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const fetchTables = async () => {
    try {
      const res = await adminService.getAllTables();
      setTables(res.data.data.tables);
    } catch {
      toast.error("Failed to load tables");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  // Submit handler for both create and edit
  const onSubmit = async (data) => {
    try {
      if (editingTable) {
        // Update existing table
        await adminService.updateTable(editingTable._id, {
          tableNumber: Number(data.tableNumber),
          capacity: Number(data.capacity),
        });
        toast.success("Table updated");
      } else {
        // Create new table
        await adminService.createTable({
          tableNumber: Number(data.tableNumber),
          capacity: Number(data.capacity),
        });
        toast.success("Table created");
      }
      setEditingTable(null);
      reset({ tableNumber: "", capacity: "" });
      fetchTables();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (table) => {
    setEditingTable(table);
    reset({
      tableNumber: table.tableNumber,
      capacity: table.capacity,
    });
  };

  const handleCancelEdit = () => {
    setEditingTable(null);
    reset({ tableNumber: "", capacity: "" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this table? It will be deactivated.")) return;
    try {
      await adminService.deleteTable(id);
      toast.success("Table removed");
      fetchTables();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove table");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1>Manage Tables</h1>

      {/* Create / Edit form */}
      <div className="card" style={{ maxWidth: "480px", marginBottom: "1.5rem" }}>
        <h2>{editingTable ? "Edit Table" : "Add New Table"}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="tableNumber">Table Number</label>
            <input
              id="tableNumber"
              type="number"
              min="1"
              {...register("tableNumber", {
                required: "Table number is required",
                min: { value: 1, message: "Must be at least 1" },
                valueAsNumber: true,
              })}
            />
            {errors.tableNumber && (
              <p className="form-error">{errors.tableNumber.message}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="capacity">Capacity</label>
            <input
              id="capacity"
              type="number"
              min="1"
              max="20"
              {...register("capacity", {
                required: "Capacity is required",
                min: { value: 1, message: "Must be at least 1" },
                max: { value: 20, message: "Cannot exceed 20" },
                valueAsNumber: true,
              })}
            />
            {errors.capacity && (
              <p className="form-error">{errors.capacity.message}</p>
            )}
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {editingTable ? "Update Table" : "Add Table"}
            </button>
            {editingTable && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table cards */}
      {tables.length === 0 ? (
        <div className="empty-state">
          <p>No tables found. Add one above.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {tables.map((table) => (
            <TableCard
              key={table._id}
              table={table}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageTables;
