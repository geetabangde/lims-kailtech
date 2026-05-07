// Import Dependencies
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
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
      "Are you sure you want to delete this expense? Once deleted, it cannot be restored.",
  },
  success: {
    title: "Expense Deleted",
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
      await axios.delete(`/master/mode-delete/${id}`);
      table.options.meta?.deleteRow(row);
      setDeleteSuccess(true);
      toast.success("Expense deleted successfully ✅", {
        duration: 1000,
        icon: "🗑️",
      });
      setTimeout(() => setDeleteModalOpen(false), 1000);
    } catch (error) {
      console.error("Delete failed:", error);
      setDeleteError(true);
      toast.error("Failed to delete expense ❌", {
        duration: 2000,
      });
    } finally {
      setConfirmDeleteLoading(false);
    }
  }, [id, row, table]);

  const state = deleteError ? "error" : deleteSuccess ? "success" : "pending";

  return (
    <>
      <div className="flex justify-center items-center space-x-2">
        <Link
          to={`/dashboards/accounts/expenses/edit/${id}`}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400"
          title="Edit"
        >
          <PencilIcon className="h-4 w-4" />
        </Link>
        <button
          onClick={openModal}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-700 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400"
          title="Delete"
        >
          <TrashIcon className="h-4 w-4" />
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
