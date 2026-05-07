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
      "Are you sure you want to delete this Statuary Detail? Once deleted, it cannot be restored.",
  },
  success: {
    title: "Statuary Detail Deleted",
  },
};

// PHP: if (in_array(81, $permissions)) for Edit button, if (in_array(82, $permissions)) for Delete button
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
    await axios.delete(`/master/delete-statuary-detail/${id}`);
    table.options.meta?.deleteRow(row); // remove row from UI
    setDeleteSuccess(true);
     toast.success("Statuary Detail List deleted successfully ✅", {
      duration: 1000,
      icon: "🗑️",
    });
  } catch (error) {
    console.error("Delete failed:", error);
    setDeleteError(true);
     toast.error("Failed to delete statuary detail ❌", {
      duration: 2000,
    });
  } finally {
    setConfirmDeleteLoading(false);
  }
}, [row, table]);

  const state = deleteError ? "error" : deleteSuccess ? "success" : "pending";

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        {/* Edit Button */}
        {/* PHP: if (in_array(81, $permissions)) {
           $a = '<a class="btn btn-success" href="editstatuarydetail.php?hakuna=' . $row['id'] . '" class="btn btn-blue">Edit</a>';
        } */}
        {permissions.includes(81) && (
          <Link
            to={`/dashboards/master-data/statuary-detail/edit/${row.original.id}`}
            className="inline-flex items-center justify-center rounded-md bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-700 transition hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 min-w-[60px]"
          >
            <span>Edit</span>
          </Link>
        )}

        {/* Delete Button */}
        {/* PHP: if (in_array(82, $permissions)) {
           $a.="<input type='button' class='btn btn-danger' value='delete' onclick='del(\"" . $row['id'] . "\", \"deletestatuarydetail.php\", \"Delete Unit \")'/>";
        } */}
        {permissions.includes(82) && (
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
