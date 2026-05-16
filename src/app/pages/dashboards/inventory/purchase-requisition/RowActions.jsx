import { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "utils/axios";
import { toast } from "sonner";

// Local Imports
import { ConfirmModal } from "components/shared/ConfirmModal";

// ----------------------------------------------------------------------

const deleteMessages = {
  pending: {
    title: "Delete Indent?",
    description: "Are you sure you want to remove this indent? This action cannot be undone.",
    actionText: "Yes, Delete",
  },
  success: {
    title: "Indent Deleted",
    description: "The indent has been successfully removed from the system.",
  },
};

export function RowActions({ row, table }) {
  const status = row.original.status;
  const id = row.original.id;
  const permissions = table.options.meta.permissions || [];
  
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteState, setDeleteState] = useState("pending"); // pending, success, error

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteState("pending");

    try {
      // Switched to axios.delete to resolve the 405 Method Not Allowed error
      const response = await axios.delete(`/inventory/delete-indent/${id}`);
      
      if (response.data.success || response.data.status) {
        setDeleteState("success");
        toast.success("Indent deleted successfully ✅");
        
        // Brief delay to show success state before closing and refreshing
        setTimeout(() => {
          table.options.meta.deleteRow(row);
          setShowModal(false);
        }, 1000);
      } else {
        throw new Error("Server failed to delete");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      setDeleteState("error");
      toast.error("Failed to delete indent ❌");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5">
      {/* ✅ View Details */}
      {(status == 1 || status == 2 || status == 3 || status == 4) && (
        <Link
          to={`/dashboards/inventory/purchase-requisition/view-full-indent?hakuna=${id}`}
          className="inline-flex items-center justify-center rounded-md bg-purple-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-purple-700 min-w-[80px]"
        >
          View Details
        </Link>
      )}

      {/* ✅ Delete Button - Status 1 only */}
      {status == 1 && (
        <button
          onClick={() => {
            setDeleteState("pending");
            setShowModal(true);
          }}
          className="inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-red-700 min-w-[60px]"
        >
          delete
        </button>
      )}

      {/* ✅ Transfer From Store - Status 2 + Perm 400 */}
      {status == 2 && permissions.includes(400) && (
        <Link
          to={`/dashboards/inventory/purchase-requisition/add-transfer-item?hakuna=${id}`}
          className="inline-flex items-center justify-center rounded-md bg-blue-500 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-blue-600 min-w-[100px]"
        >
          Transfer From Store
        </Link>
      )}

      {/* ✅ Closed Button - Status 3 */}
      {status == 3 && (
        <button
          disabled
          className="inline-flex items-center justify-center rounded-md bg-gray-500 px-3 py-1.5 text-xs font-bold text-white transition min-w-[60px]"
        >
          Closed
        </button>
      )}

      {/* Standard Confirm Modal for Deletion */}
      <ConfirmModal
        show={showModal}
        onClose={() => !isDeleting && setShowModal(false)}
        onOk={handleDelete}
        confirmLoading={isDeleting}
        state={deleteState}
        messages={deleteMessages}
      />
    </div>
  );
}

RowActions.propTypes = {
  row: PropTypes.object.isRequired,
  table: PropTypes.object.isRequired,
};
