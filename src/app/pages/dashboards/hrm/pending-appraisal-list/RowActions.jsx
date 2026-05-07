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
  const { id, status } = row.original;
  const permissions = getStoredPermissions();
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    if (!window.confirm("Are you sure you want to approve this appraisal?")) return;
    
    setLoading(true);
    try {
      await axios.post("/hrm/approve-appraisal", { id });
      toast.success("Appraisal approved successfully ✅");
      table.options.meta?.fetchData?.(); // Refresh table data
    } catch (error) {
      console.error("Approval failed:", error);
      toast.error(error.response?.data?.message || "Failed to approve appraisal ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {/* Complete Appraisal Details (status -1) */}
      {status == -1 && permissions.includes(259) && (
        <Link
          to={`/dashboards/hrm/pending-appraisal-list/complete/${id}`}
          className="inline-flex items-center justify-center rounded-md bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 transition hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
        >
          Complete Appraisal Details
        </Link>
      )}

      {/* View Appraisal Details (standard) */}
      {status != -1 && permissions.includes(256) && (
        <Link
          to={`/dashboards/hrm/pending-appraisal-list/view/${id}`}
          className="inline-flex items-center justify-center rounded-md bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700 transition hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
        >
          View Appraisal Details
        </Link>
      )}

      {/* Edit Appraisal (status 0) */}
      {status == 0 && permissions.includes(259) && (
        <Link
          to={`/dashboards/hrm/pending-appraisal-list/edit/${id}`}
          className="inline-flex items-center justify-center rounded-md bg-yellow-50 px-3 py-1.5 text-xs font-bold text-yellow-700 transition hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400"
        >
          Edit Appraisal
        </Link>
      )}

      {/* Approve (status 0) */}
      {status == 0 && permissions.includes(258) && (
        <button
          onClick={handleApprove}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "..." : "Approve"}
        </button>
      )}
    </div>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object,
};
