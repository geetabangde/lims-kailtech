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
      "Are you sure you want to delete this Permission? Once deleted, it cannot be restored.",
  },
  success: {
    title: "Permission Deleted",
  },
};

const permissions =
    localStorage.getItem("userPermissions")?.split(",").map(Number) || [];
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
      const response = await axios.delete(`rolemanagment/delete-permissions/${id}`);
      
      if (response.data.status === true || response.data.status === "true") {
        table.options.meta?.deleteRow(row); 
        setDeleteSuccess(true);
        toast.success(response.data.message || "Permission deleted successfully ✅", {
          duration: 1000,
          icon: "🗑️",
        });
      } else {
        setDeleteError(true);
        toast.error(response.data.message || "Failed to delete permission ❌");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      setDeleteError(true);
      toast.error(error?.response?.data?.message || "Failed to delete permission ❌", {
        duration: 2000,
      });
    } finally {
      setConfirmDeleteLoading(false);
    }
  }, [row, table]);

  const state = deleteError ? "error" : deleteSuccess ? "success" : "pending";

  return (
    <>
      <div className="flex justify-center space-x-1.5 ">
        
      <div className="flex items-center justify-center gap-2">
        {/* Edit Button */}
        {permissions.includes(167) && (
          <Link
            to={`/dashboards/role-management/permissions/edit/${row.original.id}`}
            className="inline-flex items-center justify-center rounded-md bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-700 transition hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 min-w-[60px]"
          >
            <span>Edit</span>
          </Link>
        )}

        {/* Delete Button */}
        {permissions.includes(167) && (
          <button
            onClick={openModal}
            className="inline-flex items-center justify-center rounded-md bg-red-50 px-4 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 min-w-[60px]"
          >
            <span>Delete</span>
          </button>
        )}
      </div>
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
