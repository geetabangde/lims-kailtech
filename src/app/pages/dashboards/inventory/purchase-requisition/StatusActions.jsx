// Import Dependencies
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import clsx from "clsx";

// Local Imports
import { ConfirmModal } from "components/shared/ConfirmModal";
import axios from "utils/axios";
import { toast } from "sonner";

// ----------------------------------------------------------------------

const confirmMessages = {
  pending: {
    description:
      "Are you sure you want to reject this indent? Once rejected, it cannot be restored.",
  },
  success: {
    title: "Indent Rejected",
  },
};

export function StatusActions({ row, table }) {
  const navigate = useNavigate();
  const status = row.original.status;

  const permissions = table.options.meta.permissions || [];

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [confirmRejectLoading, setConfirmRejectLoading] = useState(false);
  const [rejectSuccess, setRejectSuccess] = useState(false);
  const [rejectError, setRejectError] = useState(false);

  const closeModal = () => {
    setRejectModalOpen(false);
  };

  const openModal = () => {
    setRejectModalOpen(true);
    setRejectError(false);
    setRejectSuccess(false);
  };

  const handleApprove = useCallback(() => {
    const id = row.original.id;
    navigate(`/dashboards/inventory/purchase-requisition/edit-indent-approve?hakuna=${id}`);
  }, [row, navigate]);


  const handleReject = useCallback(async () => {
    const id = row.original.id;
    setConfirmRejectLoading(true);

    try {
      await axios.post(`/inventory/reject-indent?id=${id}`);

      setRejectSuccess(true);
      toast.success("Indent rejected successfully", {
        duration: 1000,
      });
      // Optionally trigger table refresh
    } catch (error) {
      console.error("Reject failed:", error);
      setRejectError(true);
      toast.error("Failed to reject indent", {
        duration: 2000,
      });
    } finally {
      setConfirmRejectLoading(false);
    }
  }, [row]);

  const state = rejectError ? "error" : rejectSuccess ? "success" : "pending";

  // ✅ Permission 150 Logic
  if (permissions.includes(150)) {
    if (status == 1) {
      return (
        <>
          <div className="flex gap-2">
            <button
              onClick={handleApprove}
              className="inline-flex items-center justify-center rounded-md bg-green-500 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-green-600 min-w-[70px]"
            >
              <i className="fa fa-check mr-1" /> Approve
            </button>
            <button
              onClick={openModal}
              className="inline-flex items-center justify-center rounded-md bg-red-500 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-red-600 min-w-[70px]"
            >
              <i className="fa fa-times mr-1" /> Reject
            </button>
          </div>
          <ConfirmModal
            show={rejectModalOpen}
            onClose={closeModal}
            messages={confirmMessages}
            onOk={handleReject}
            confirmLoading={confirmRejectLoading}
            state={state}
          />
        </>
      );
    }
  }

  // ✅ Default Status Display (Buttons are disabled as per PHP)
  const statusConfig = {
    1: { label: "Pending", className: "bg-orange-400 text-white" },
    2: { label: "Approved/ Transfer Pending", className: "bg-green-500 text-white" },
    3: { label: "Completed", className: "bg-green-600 text-white" },
    91: { label: "Rejected", className: "bg-red-500 text-white" },
  };

  const config = statusConfig[status] || { label: status, className: "bg-gray-400 text-white" };

  return (
    <button
      disabled
      className={clsx(
        "inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-bold transition min-w-[120px]",
        config.className
      )}
    >
      {status == 2 || status == 3 ? <i className="fa fa-check mr-1" /> : null}
      {status == 91 ? <i className="fa fa-times mr-1" /> : null}
      {config.label}
    </button>
  );
}

StatusActions.propTypes = {
  row: PropTypes.object.isRequired,
  table: PropTypes.object.isRequired,
};
