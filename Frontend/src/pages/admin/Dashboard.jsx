import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as adminService from "../../services/adminService";
import Loader from "../../components/Loader/Loader";

/**
 * Admin Dashboard — shows summary statistics:
 *  - Total reservations (all time)
 *  - Today's reservations
 *  - Total / available tables
 */
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all reservations and tables in parallel
        const [resAll, resToday, resTables] = await Promise.all([
          adminService.getAllReservations(),
          adminService.getAllReservations(new Date().toISOString().split("T")[0]),
          adminService.getAllTables(),
        ]);

        const allReservations = resAll.data.data.reservations;
        const todayReservations = resToday.data.data.reservations;
        const tables = resTables.data.data.tables;

        setStats({
          totalReservations: allReservations.length,
          todaysReservations: todayReservations.filter(
            (r) => r.status === "Booked"
          ).length,
          totalTables: tables.length,
          activeTables: tables.filter((t) => t.isActive).length,
        });
      } catch {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1>Admin Dashboard</h1>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <p className="stat-label">Total Reservations</p>
            <p className="stat-value">{stats.totalReservations}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Today&apos;s Booked</p>
            <p className="stat-value">{stats.todaysReservations}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Total Tables</p>
            <p className="stat-value">{stats.totalTables}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Active Tables</p>
            <p className="stat-value">{stats.activeTables}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
