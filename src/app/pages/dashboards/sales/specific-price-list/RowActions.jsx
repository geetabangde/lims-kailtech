import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import axios from "utils/axios";
import { toast } from "sonner";
import { ConfirmModal } from "components/shared/ConfirmModal";

// ----------------------------------------------------------------------


export function RowActions({ row, table }) {
  const { id } = row.original;

  // ── Delete ──────────────────────────────────────────────────────────────
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

  const handleDelete = useCallback(async () => {
    setDeleteLoading(true);
    try {
      await axios.delete(`/sales/delete-customer-specific-price/${id}`);
      setDeleteSuccess(true);
      toast.success("Special price deleted ✅");
      setTimeout(() => {
        setDeleteOpen(false);
        table.options.meta?.deleteRow(row);
      }, 800);
    } catch {
      setDeleteError(true);
      toast.error("Failed to delete special price");
    } finally {
      setDeleteLoading(false);
    }
  }, [id, row, table]);

  const confirmDeleteMessages = {
    pending: {
      description:
        "Are you sure you want to delete this customer specific price? This cannot be undone.",
    },
    success: { title: "Deleted Successfully" },
  };

  const deleteState = deleteError
    ? "error"
    : deleteSuccess
      ? "success"
      : "pending";

  return (
    <>
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => {
            setDeleteOpen(true);
            setDeleteError(false);
            setDeleteSuccess(false);
          }}
          className="rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-900/50 dark:bg-dark-800 dark:text-red-400 dark:hover:bg-red-900/20"
        >
          Delete
        </button>
      </div>

      <ConfirmModal
        show={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        messages={confirmDeleteMessages}
        onOk={handleDelete}
        confirmLoading={deleteLoading}
        state={deleteState}
      />
    </>
  );
}


RowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object,
};
