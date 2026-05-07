import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useState, useCallback } from "react";
import axios from "utils/axios";
import { toast } from "sonner";

// ----------------------------------------------------------------------

export function RowActions({ row, table }) {
  const { id, status } = row.original;
  const permissions = JSON.parse(localStorage.getItem("userPermissions") || "[]");
  const [loading, setLoading] = useState(false);

  const handleApprove = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.post(`/accounts/approve-consentletter/${id}`);
      
      if (response.status === 200 || response.data?.message === "Consent letter approved") {
        toast.success(response.data?.message || "Consent Letter Approved ✅");
        
        table.options.meta?.updateData(row.index, "status", 1);
        
        if (response.data?.consent_letter_no) {
          table.options.meta?.updateData(row.index, "consent_no", response.data.consent_letter_no);
        }
      } else {
        toast.error(response.data?.message || "Failed to approve.");
      }
    } catch (err) {
      console.error("Approve error:", err);
      toast.error(err?.response?.data?.message || "Failed to approve consent letter.");
    } finally {
      setLoading(false);
    }
  }, [id, row.index, table.options.meta]);

  const isPending = status === 0 || status === "0";

  return (
    <div className="flex items-center justify-center gap-2">
      <Link
        to={`/dashboards/accounts/consent-letter/view/${id}`}
        className="inline-flex items-center h-8 rounded-md bg-blue-600 px-3 text-xs font-medium text-white hover:bg-blue-700 shadow-sm transition"
      >
        View
      </Link>
      
      {isPending && permissions.includes(364) && (
        <button
          onClick={handleApprove}
          disabled={loading}
          className="inline-flex items-center h-8 rounded-md bg-green-600 px-3 text-xs font-medium text-white hover:bg-green-700 shadow-sm transition disabled:opacity-50"
        >
          {loading ? "Approve..." : "Approve"}
        </button>
      )}
    </div>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
};
