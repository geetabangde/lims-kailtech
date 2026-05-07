// Import Dependencies
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
      "Are you sure you want to delete this expense category? Once deleted, it cannot be restored.",
  },
  success: {
    title: "Expense Category Deleted",
  },
};

export function RowActions({ row, table }) {
  const { id } = row.original;

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
    setConfirmDeleteLoading(true);
    try {
      await axios.delete(`/expense-categories/${id}`);
      table.options.meta?.deleteRow(row);
      setDeleteSuccess(true);
      toast.success("Expense category deleted successfully ✅", { duration: 1000 });
      setTimeout(() => setDeleteModalOpen(false), 1000);
    } catch (error) {
      console.error("Delete failed:", error);
      setDeleteError(true);
      toast.error("Failed to delete expense category ❌", { duration: 2000 });
    } finally {
      setConfirmDeleteLoading(false);
    }
  }, [id, row, table]);

  const state = deleteError ? "error" : deleteSuccess ? "success" : "pending";

  return (
    <>
      <div className="flex justify-center items-center space-x-2">
        <Link
          to={`/dashboards/accounts/expense-category/edit/${id}`}
          className="inline-flex items-center justify-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400"
        >
          Edit
        </Link>
        <button
          onClick={openModal}
          className="inline-flex items-center justify-center rounded-lg bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400"
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
