// Import Dependencies
import { useState } from "react";
import PropTypes from "prop-types";

// Local Imports
import axios from "utils/axios";
import { toast } from "sonner";
import { getStoredPermissions } from "app/navigation/dashboards";

// ----------------------------------------------------------------------

export function RowActions({ row, table }) {
  const { id, status } = row.original;
  const permissions = getStoredPermissions();
  const [loading, setLoading] = useState(false);

  // Status index: 0 = Pending, 1 = Approved, 2 = Rejected
  if (status != 0) return null; // No actions if not pending

  const handleApprove = async () => {
    if (!window.confirm("Are you sure you want to approve this leave?")) return;
    
    setLoading(true);
    try {
      await axios.post("/hrm/approve-leave", { id });
      toast.success("Leave approved successfully ✅");
      table.options.meta?.fetchData?.(); // Refresh table data
    } catch (error) {
      console.error("Approval failed:", error);
      toast.error(error.response?.data?.message || "Failed to approve leave ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    const reason = window.prompt("Are you sure you want to reject this leave? Please provide a reason:");
    if (reason === null) return;
    
    setLoading(true);
    try {
      await axios.post("/hrm/reject-leave", { id, reason });
      toast.success("Leave rejected successfully ✅");
      table.options.meta?.fetchData?.(); // Refresh table data
    } catch (error) {
      console.error("Rejection failed:", error);
      toast.error(error.response?.data?.message || "Failed to reject leave ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {permissions.includes(232) && (
        <>
          <button
            onClick={handleApprove}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "..." : "Approve"}
          </button>
          <button
            onClick={handleReject}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "..." : "Reject"}
          </button>
        </>
      )}
    </div>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object,
};
