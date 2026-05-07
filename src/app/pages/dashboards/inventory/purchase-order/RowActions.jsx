// Import Dependencies
import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router";

// Local Imports
import { ConfirmModal } from "components/shared/ConfirmModal";
import axios from "utils/axios";
import { toast } from "sonner";

// ----------------------------------------------------------------------

const confirmMessages = {
  pending: {
    description:
      "Are you sure you want to reject this purchase order? Once rejected, it cannot be restored.",
  },
  success: {
    title: "Purchase Order Rejected",
  },
};

export function RowActions({ row }) {
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [confirmRejectLoading, setConfirmRejectLoading] = useState(false);
  const [rejectSuccess, setRejectSuccess] = useState(false);
  const [rejectError, setRejectError] = useState(false);
  const navigate = useNavigate();

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
    // PHP: window.location.href = "edit_Purchase Order_approve.php?hakuna=" + id;
    navigate(`/dashboards/inventory/purchase-order/edit-purchase-order-approve?hakuna=${id}`);
  }, [row, navigate]);

  const handleReject = useCallback(async () => {
    const id = row.original.id;
    setConfirmRejectLoading(true);

    try {
      // PHP: sendForm('id', [id, decision], 'reject_Purchase Order.php', 'resultid', 'Purchase Orderdec');
      await axios.post("/inventory/reject-purchase-order", { 
        id: id,
        decision: "reject"
      });
      setRejectSuccess(true);
      toast.success("Purchase Order rejected successfully", {
        duration: 1000,
        icon: "",
      });
    } catch (error) {
      console.error("Reject failed:", error);
      setRejectError(true);
      toast.error("Failed to reject purchase order", {
        duration: 2000,
      });
    } finally {
      setConfirmRejectLoading(false);
    }
  }, [row]);

  const state = rejectError ? "error" : rejectSuccess ? "success" : "pending";

  return (
    <>
      <div className="flex justify-center space-x-1.5 ">
        <div className="flex items-center justify-center gap-2">
          <button
            id="approve"
            data-decision="approve"
            data-id={row.original.id}
            onClick={handleApprove}
            className="inline-flex items-center justify-center rounded-md bg-green-50 px-4 py-1.5 text-xs font-bold text-green-700 transition hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 min-w-[60px]"
          >
            <span>Approve</span>
          </button>

          <button
            id="reject"
            data-decision="reject"
            data-id={row.original.id}
            onClick={openModal}
            className="inline-flex items-center justify-center rounded-md bg-red-50 px-4 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 min-w-[60px]"
          >
            <span>Reject</span>
          </button>
        </div>
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

RowActions.propTypes = {
  row: PropTypes.object,
};
