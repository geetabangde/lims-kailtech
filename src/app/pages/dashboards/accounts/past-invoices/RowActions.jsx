import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import { Button } from "components/ui";
import axios from "utils/axios";
import toast from "react-hot-toast";

// ── Approve Modal ─────────────────────────────────────────────────────────
function ApproveModal({ show, onClose, onOk, loading }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="dark:bg-dark-800 w-full max-w-sm rounded-lg bg-white shadow-xl">
        <div className="flex flex-col items-center px-6 pt-6 pb-4">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <svg
              className="h-7 w-7 text-green-600 dark:text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="dark:text-dark-50 text-base font-semibold text-gray-800">
            Approve Invoice?
          </h3>
          <p className="dark:text-dark-400 mt-1.5 text-center text-sm text-gray-500">
            Are you sure you want to approve this invoice?
          </p>
        </div>
        <div className="dark:border-dark-500 flex justify-end gap-2 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="dark:border-dark-500 dark:text-dark-300 rounded-md border border-gray-300 px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onOk}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 000 8v4a8 8 0 01-8-8z"
                  />
                </svg>
                Approving…
              </>
            ) : (
              "Approve"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function RowActions({ row }) {
  const { id, invoiceno, finaltotal, status } = row.original;
  const permissions = JSON.parse(localStorage.getItem("userPermissions") || "[]");

  const [approveOpen, setApproveOpen] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const finalTotal = parseFloat(finaltotal || 0);
  const invoiceStatus = Number(status);

  // PHP: perm(269) + finaltotal<=5000 | perm(270) + finaltotal>5000
  const canApprove =
    (permissions.includes(269) && finalTotal <= 5000) ||
    (permissions.includes(270) && finalTotal > 5000);

  // PHP: perm(352) + (status==0||1)
  const canEdit = permissions.includes(352) && (invoiceStatus === 0 || invoiceStatus === 1);

  // PHP: perm(271) + (status==0||1)
  const canRequestCancel = permissions.includes(271) && (invoiceStatus === 0 || invoiceStatus === 1);

  // ── Approve ──────────────────────────────────────────────────────────────
  const handleApprove = useCallback(async () => {
    setApproveLoading(true);
    try {
      const res = await axios.post("/accounts/approve-past-invoice", {
        invoiceid: id,
      });
      const ok =
        res.data.status === true ||
        res.data.status === "true" ||
        res.data.success === true;
      if (ok) {
        toast.success(res.data.message ?? "Invoice approved successfully");
        setApproveOpen(false);
        // Optionally refresh the page or update row state
        window.location.reload();
      } else {
        toast.error(res.data.message ?? "Approval failed");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Failed to approve invoice");
    } finally {
      setApproveLoading(false);
    }
  }, [id]);

  const handleCancelRequest = async () => {
    if (!reason.trim()) {
      toast.error("Please enter a reason");
      return;
    }

    try {
      setSubmitting(true);
      const res = await axios.post("/accounts/cancel-request", {
        invoiceid: id,
        reason: reason.trim(),
      });

      const ok =
        res.data?.success === true ||
        res.data?.status === true ||
        res.data?.status === "true";

      if (!ok) {
        toast.error(
          res.data?.message ??
            "A request already pending. Please complete that first",
        );
        return;
      }

      toast.success(res.data?.message ?? "Cancellation request submitted");
      setCancelOpen(false);
      setReason("");
    } catch (err) {
      console.error(err);
      toast.error(err?.message ?? "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-1 justify-center items-center">
        {/* PHP: status==0 + canApprove */}
        {invoiceStatus === 0 && canApprove && (
          <Button
            size="sm"
            color="success"
            className="h-7 rounded px-3 text-xs"
            onClick={() => setApproveOpen(true)}
          >
            Approve
          </Button>
        )}

        {/* PHP: perm(352) + (status==0||1) */}
        {canEdit && (
          <Button
            size="sm"
            color="warning"
            className="h-7 rounded px-3 text-xs"
            component={Link}
            to={`/dashboards/accounts/past-invoices/edit/${id}`}
          >
            Edit
          </Button>
        )}

        {/* PHP: perm(271) + (status==0||1) */}
        {canRequestCancel && (
          <Button
            size="sm"
            color="warning"
            className="h-7 rounded px-3 text-xs"
            onClick={() => setCancelOpen(true)}
          >
            Request Cancel
          </Button>
        )}
      </div>

      <ApproveModal
        show={approveOpen}
        onClose={() => setApproveOpen(false)}
        onOk={handleApprove}
        loading={approveLoading}
      />

      <Dialog open={cancelOpen} onClose={() => setCancelOpen(false)} className="relative z-50">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

        {/* Panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-lg rounded bg-white shadow-xl dark:bg-dark-800">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3 dark:border-dark-500">
              <Dialog.Title className="text-base font-medium text-gray-800 dark:text-dark-50">
                Request For Cancelation
              </Dialog.Title>
              <button
                onClick={() => setCancelOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-dark-200"
              >
                &times;
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-4">
              <p className="mb-4 text-lg font-semibold text-gray-800 dark:text-dark-50">
                Invoice Cancel Request Of {invoiceno}
              </p>
              <div className="flex items-start gap-4">
                <label className="mt-2 w-44 shrink-0 text-sm text-gray-700 dark:text-dark-200">
                  Reason For Cancelation
                </label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason..."
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-dark-500 dark:bg-dark-700 dark:text-dark-100"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-3 dark:border-dark-500">
              <Button
                color="primary"
                className="h-9 rounded-md px-4 text-sm font-medium"
                onClick={handleCancelRequest}
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Save changes"}
              </Button>
              <Button
                color="info"
                className="h-9 rounded-md px-4 text-sm font-medium"
                onClick={() => setCancelOpen(false)}
              >
                Close
              </Button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
};
