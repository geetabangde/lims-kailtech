import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import axios from "utils/axios";
import { toast } from "sonner";
import { TrashIcon, EyeIcon } from "@heroicons/react/24/outline";

// ----------------------------------------------------------------------

export function RowActions({ row, table }) {
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this process? This action cannot be undone.")) {
      try {
        const response = await axios.get(`rolemanagment/delete-role/${row.original.id}`);

        if (response.data.status === true || response.data.success === true) {
          toast.success(response.data.message || "Process deleted successfully ✅");
          table.options.meta?.deleteRow(row);
        } else {
          toast.error(response.data.message || "Failed to delete process ❌");
        }
      } catch (err) {
        console.error("Error deleting process:", err);
        toast.error("An error occurred during deletion.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Link
        to={`/dashboards/role-management/process-guide/view/${row.original.id}`}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
        title="View Details"
      >
        <EyeIcon className="h-4 w-4" />
      </Link>

      <button
        onClick={handleDelete}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
        title="Delete Process"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object,
};
