// Import Dependencies
import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// Local Imports
import axios from "utils/axios";
import { toast } from "sonner";
import { getStoredPermissions } from "app/navigation/dashboards";

// ----------------------------------------------------------------------

export function RowActions({ row, table }) {
  const { month, year, canCalculate, canCancel, canGenerateSalary, hasAttendanceSheet } = row.original;
  const permissions = getStoredPermissions();
  
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    if (!window.confirm(`Are you sure you want to calculate attendance for ${month} - ${year}?`)) return;
    
    setLoading(true);
    try {
      await axios.post("/hrm/calculate-attendance", { month, year });
      toast.success("Attendance calculated successfully ✅");
      table.options.meta?.fetchData?.(); // Refresh table data
    } catch (error) {
      console.error("Calculation failed:", error);
      toast.error(error.response?.data?.message || "Failed to calculate attendance ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    const reason = window.prompt(`Are you sure you want to cancel attendance for ${month} - ${year}? Please provide a reason:`);
    if (reason === null) return; // User cancelled prompt
    
    if (!reason.trim()) {
      toast.error("Reason is required to cancel attendance");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/hrm/cancel-attendance", { month, year, reason });
      toast.success("Attendance cancelled successfully ✅");
      table.options.meta?.fetchData?.(); // Refresh table data
    } catch (error) {
      console.error("Cancellation failed:", error);
      toast.error(error.response?.data?.message || "Failed to cancel attendance ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {/* View By Date */}
      <Link
        to={`/dashboards/hrm/search-attendance?month=${month}&year=${year}`}
        className="inline-flex items-center justify-center rounded-md bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 transition hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
      >
        View By Date
      </Link>

      {/* Calculate Attendance */}
      {canCalculate && permissions.includes(45) && (
        <button
          onClick={handleCalculate}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-md bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700 transition hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 disabled:opacity-50"
        >
          {loading ? "..." : "Calculate Attendance"}
        </button>
      )}

      {/* Cancel Attendance */}
      {canCancel && permissions.includes(45) && (
        <button
          onClick={handleCancel}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 disabled:opacity-50"
        >
          {loading ? "..." : "Cancel Attendance"}
        </button>
      )}

      {/* Generate Salary */}
      {canGenerateSalary && permissions.includes(46) && (
        <Link
          to={`/dashboards/hrm/generate-salary?month=${month}&year=${year}`}
          className="inline-flex items-center justify-center rounded-md bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400"
        >
          Generate Salary
        </Link>
      )}

      {/* View Attendance */}
      {hasAttendanceSheet && (
        <Link
          to={`/dashboards/hrm/attendance-sheet?month=${month}&year=${year}`}
          className="inline-flex items-center justify-center rounded-md bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400"
        >
          View Attendance
        </Link>
      )}
    </div>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object,
};
