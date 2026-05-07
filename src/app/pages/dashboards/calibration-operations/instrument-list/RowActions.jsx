import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// Local Imports
import { ConfirmModal } from "components/shared/ConfirmModal";
import axios from "utils/axios";
import { toast } from "sonner";

// ----------------------------------------------------------------------

const confirmMessages = {
  pending: {
    description:
      "Are you sure you want to delete this calibration instrument? Once deleted, it cannot be restored.",
  },
  success: {
    title: "calibration standards Deleted",
  },
};

export function RowActions({ row, table }) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

  const closeModal = () => {
    setDeleteModalOpen(false);
  };

  const openModal = () => {
    setDeleteModalOpen(true);
    setDeleteError(false);
    setDeleteSuccess(false);
  };

  const handleDeleteRows = useCallback(async () => {
    const id = row.original.id; // Assuming your row contains `id`
    setConfirmDeleteLoading(true);

    try {
      await axios.delete(`/calibrationoperations/delete-instrument/${id}`);
      table.options.meta?.deleteRow(row); // remove row from UI
      setDeleteSuccess(true);
      toast.success("calibration operations deleted successfully ✅", {
        duration: 1000,
        icon: "🗑️",
      });
    } catch (error) {
      console.error("Delete failed:", error);
      setDeleteError(true);
      toast.error("Failed to delete calibration operations ❌", {
        duration: 2000,
      });
    } finally {
      setConfirmDeleteLoading(false);
    }
  }, [row, table]);

  const state = deleteError ? "error" : deleteSuccess ? "success" : "pending";
  const permissions = JSON.parse(localStorage.getItem("userPermissions") || "[]");

  return (
    <>
      <div className="flex flex-col gap-1.5 w-fit mx-auto">
        {/* Top Row: View Prices and Delete */}
        <div className="flex items-center gap-1.5">
          {permissions.includes(87) && (
            <Link
              to={`/dashboards/calibration-operations/instrument-list/view-prices/${row.original.id}`}
              className="inline-flex items-center justify-center rounded-md bg-blue-50 px-3 py-1.5 text-[10px] font-bold text-blue-700 transition hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 min-w-[80px]"
            >
              <span>View Prices</span>
            </Link>
          )}
          {permissions.includes(90) && (
            <button
              onClick={openModal}
              className="inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1.5 text-[10px] font-bold text-red-700 transition hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 min-w-[60px]"
            >
              <span>Delete</span>
            </button>
          )}
        </div>

        {/* Bottom Row: Edit and Clone */}
        {permissions.includes(88) && (
          <div className="flex items-center gap-1.5">
            <Link
              to={`/dashboards/calibration-operations/instrument-list/edit/${row.original.id}`}
              className="inline-flex items-center justify-center rounded-md bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-700 transition hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 min-w-[50px]"
            >
              <span>Edit</span>
            </Link>
            <Link
              to={`/dashboards/calibration-operations/instrument-list/clone/${row.original.id}`}
              className="inline-flex items-center justify-center rounded-md bg-amber-50 px-3 py-1.5 text-[10px] font-bold text-amber-700 transition hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 min-w-[50px]"
            >
              <span>Clone</span>
            </Link>
          </div>
        )}
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