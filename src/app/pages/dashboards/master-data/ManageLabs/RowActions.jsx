import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { ConfirmModal } from "components/shared/ConfirmModal";

import axios from "utils/axios";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const confirmMessages = {
  pending: {
    description:
      "Are you sure you want to delete this Manage Lab? Once deleted, it cannot be restored.",
  },
  success: {
    title: "Manage Lab Deleted",
  },
};

// PHP: if (in_array(88, $permissions)) for Edit button and Manage Environmental Range
function usePermissions() {
  const p = localStorage.getItem("userPermissions");
  try {
    return JSON.parse(p) || [];
  } catch {
    return p?.split(",").map(Number) || [];
  }
}

export function RowActions({ row, table }) {
  const permissions = usePermissions();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

  const closeModal = () => setDeleteModalOpen(false);
  const openModal = () => {
    setDeleteModalOpen(true);
    setDeleteError(false);
    setDeleteSuccess(false);
  };

  const handleDeleteRows = useCallback(async () => {
    const id = row.original.id;
    setConfirmDeleteLoading(true);
    try {
      await axios.delete(`/master/delete-lab/${id}`);
      table.options.meta?.deleteRow(row);
      setDeleteSuccess(true);
      toast.success("Manage Labs deleted successfully ✅", { duration: 1000, icon: "🗑️" });
    } catch (error) {
      console.error("Delete failed:", error);
      setDeleteError(true);
      toast.error("Failed to delete unit type ❌", { duration: 2000 });
    } finally {
      setConfirmDeleteLoading(false);
    }
  }, [row, table]);

  const state = deleteError ? "error" : deleteSuccess ? "success" : "pending";

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-2 w-full">
        {/* Edit Button */}
        {/* PHP: if (in_array(88, $permissions)) {
           $a .= '<a class="btn btn-warning" href="editlab.php?hakuna=' . $row['id'] . '" class="btn btn-blue">Edit</a>';
        } */}
        {permissions.includes(88) && (
          <Link
            to={`/dashboards/master-data/manage-labs/edit/${row.original.id}`}
            className="rounded-md border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-600 transition-colors hover:bg-amber-50 dark:border-amber-900/50 dark:bg-dark-800 dark:text-amber-400 dark:hover:bg-amber-900/20"
          >
            Edit
          </Link>
        )}

        {/* Schedule Button - Always visible */}
        {/* PHP: $a.='<a href="enviornmentalScheduler.php?hakuna='. $row['id'].'" class="btn btn-primary">+ Schedule</a></div>'; */}
        <Link
          to={`/dashboards/master-data/manage-labs/schedule/${row.original.id}`}
          className="rounded-md border border-blue-400 bg-white px-3 py-1.5 text-xs font-medium text-blue-800 transition-colors hover:bg-blue-50 dark:border-blue-900/50 dark:bg-dark-800 dark:text-blue-500 dark:hover:bg-blue-900/20"
        >
          Schedule
        </Link>

        {/* Environmental Record Button - Always visible */}
        {/* PHP: $a.='<a href="enviornmentalRecord.php?labid='. $row['id'].'" class="btn btn-info">Enviornmental Record</a>'; */}
        <Link
          to={`/dashboards/master-data/manage-labs/environmental-record/${row.original.id}`}
          className="rounded-md border border-sky-300 bg-white px-3 py-1.5 text-xs font-medium text-sky-600 transition-colors hover:bg-sky-50 dark:border-sky-900/50 dark:bg-dark-800 dark:text-sky-400 dark:hover:bg-sky-900/20"
        >
          Environmental Record
        </Link>

        {/* Manage Environmental Range Button */}
        {/* PHP: if (in_array(88, $permissions)) {
           $a.='<a href="enviornmentalRange.php?hakuna='. $row['id'].'" class="btn btn-default">Manage Enviornmental Range</a>';
        } */}
        {permissions.includes(88) && (
          <Link
            to={`/dashboards/master-data/manage-labs/manage-enviornmental-range/${row.original.id}`}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-blue-600 dark:border-gray-600 dark:bg-dark-800 dark:text-gray-300 dark:hover:bg-dark-700"
          >
            Manage Environmental Range
          </Link>
        )}

        {/* Delete Button - Not in PHP, but keeping for consistency */}
        <button
          onClick={openModal}
          className="rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-900/50 dark:bg-dark-800 dark:text-red-400 dark:hover:bg-red-900/20"
        >
          Delete
        </button>
      </div>

      <ConfirmModal
        show={deleteModalOpen}
        onClose={closeModal}
        messages={confirmMessages}
        onOk={handleDeleteRows}
        confirmLoading={confirmDeleteLoading}
        state={state}
      />
    </>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object,
};
