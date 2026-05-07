import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// Local Imports
import { ConfirmModal } from "components/shared/ConfirmModal";
import axios from "utils/axios";
import { toast } from "sonner";

// ----------------------------------------------------------------------

const confirmMessages = {
  pending: {
    description:
      "Are you sure you want to delete this product? Once deleted, it cannot be restored.",
  },
  success: {
    title: "Product Deleted",
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
    const id = row.original.id;
    setConfirmDeleteLoading(true);

    try {
      // ✅ Use query parameter instead of path parameter
      await axios.delete(`/testing/delete-methods?id=${id}`);

      // Remove row from UI
      table.options.meta?.deleteRow(row);

      setDeleteSuccess(true);
      toast.success("Test Method deleted successfully ✅", {
        duration: 1000,
        icon: "🗑️",
      });

      // Close modal after success
      setTimeout(() => {
        setDeleteModalOpen(false);
      }, 1000);

    } catch (error) {
      console.error("Delete failed:", error);
      setDeleteError(true);

      // Show specific error message if available
      const errorMessage = error.response?.data?.message
        || error.response?.data?.error
        || "Failed to delete product";

      toast.error(`${errorMessage} ❌`, {
        duration: 2000,
      });
    } finally {
      setConfirmDeleteLoading(false);
    }
  }, [row, table]);

  const state = deleteError ? "error" : deleteSuccess ? "success" : "pending";

  const id = row.original.id;

  return (
    <>
      <div className="flex justify-center items-center space-x-2">
        {/* Edit Button */}
        <Link
          to={`/dashboards/testing/test-methods/edit/${id}`}
          className="flex h-8 items-center rounded-lg bg-blue-50 px-3 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400"
        >
          Edit
        </Link>

        {/* Delete Button */}
        <button
          onClick={openModal}
          className="flex h-8 items-center rounded-lg bg-red-50 px-3 text-xs font-semibold text-red-700 transition hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400"
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