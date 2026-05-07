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
      "Are you sure you want to delete this calibration operations? Once deleted, it cannot be restored.",
  },
  success: {
    title: "calibration operations Deleted",
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
      await axios.delete(`/calibrationoperations/calibration-method-destroy/${id}`);
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

  const permissions = JSON.parse(localStorage.getItem("userPermissions") || "[]");
  const canEdit = permissions.includes(88);
  const canDelete = permissions.includes(90);

  const state = deleteError ? "error" : deleteSuccess ? "success" : "pending";

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        {/* Edit Button */}
        {canEdit && (
          <Link
            to={`/dashboards/calibration-operations/calibration-methods/edit/${row.original.id}`}
            className="inline-flex items-center justify-center rounded-md bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-700 transition hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 min-w-[60px]"
          >
            <span>Edit</span>
          </Link>
        )}

        {/* Delete Button */}
        {canDelete && (
          <button
            onClick={openModal}
            className="inline-flex items-center justify-center rounded-md bg-red-50 px-4 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 min-w-[60px]"
          >
            <span>Delete</span>
          </button>
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
