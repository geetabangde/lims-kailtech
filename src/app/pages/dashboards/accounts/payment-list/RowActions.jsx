// Import Dependencies
import clsx from "clsx";
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
      "Are you sure you want to delete this payment? Once deleted, it cannot be restored.",
  },
  success: {
    title: "Payment Deleted",
  },
};

export function RowActions({ row, table }) {
  const rowData = row.original;

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

  const handleDeleteRow = useCallback(async () => {
    setConfirmDeleteLoading(true);
    try {
      await axios.delete(`/accounts/payment-delete/${rowData.id}`);
      table.options.meta?.deleteRow(row);
      setDeleteSuccess(true);
      toast.success("Payment deleted successfully", {
        duration: 1500,
        icon: "🗑️",
      });
      setTimeout(() => setDeleteModalOpen(false), 1000);
    } catch (error) {
      console.error("Delete failed:", error);
      setDeleteError(true);
      toast.error("Failed to delete payment", { duration: 2000 });
    } finally {
      setConfirmDeleteLoading(false);
    }
  }, [row, rowData.id, table]);

  const state = deleteError ? "error" : deleteSuccess ? "success" : "pending";

  const permissions = JSON.parse(localStorage.getItem("userPermissions") || "[]");
  const canManage = permissions.includes(275);
  const canDelete = permissions.includes(276);

  const isNoCustomer = !rowData.customerid || rowData.customerid === "0";
  const isNoInvoice = !rowData.invoiceids || rowData.invoiceids === "";
  const isNoBD = !rowData.bd || rowData.bd === "0" || rowData.bd === "";

  return (
    <>
      <div className="flex flex-wrap gap-1.5">
        {canManage && (
          <>
            {isNoCustomer && (
              <>
                <ActionBtn
                  color="success"
                  component={Link}
                  to={`/dashboards/accounts/payment-list/link-customer/${rowData.id}`}
                >
                  Link Customer
                </ActionBtn>
                <ActionBtn
                  color="success"
                  component={Link}
                  to={`/dashboards/accounts/payment-list/edit-without-customer/${rowData.id}`}
                >
                  Edit
                </ActionBtn>
              </>
            )}

            {isNoInvoice && !isNoBD && (
              <ActionBtn
                color="success"
                component={Link}
                to={`/dashboards/accounts/payment-list/link-invoice/${rowData.id}`}
              >
                Link Invoice
              </ActionBtn>
            )}

            {isNoInvoice && !isNoCustomer && (
              <ActionBtn
                color="success"
                component={Link}
                to={`/dashboards/accounts/payment-list/edit-without-customer/${rowData.id}`}
              >
                Edit
              </ActionBtn>
            )}

            <ActionBtn
              color="success"
              component={Link}
              to={`/dashboards/accounts/payment-list/link-bd/${rowData.id}`}
            >
              {isNoBD ? "Link BD" : "edit bd"}
            </ActionBtn>
          </>
        )}

        <ActionBtn
          color="primary"
          component={Link}
          to={`/dashboards/accounts/payment-list/print-receipt/${rowData.id}`}
        >
          Print
        </ActionBtn>

        {canDelete && (
          <ActionBtn color="danger" onClick={openModal}>
            Delete
          </ActionBtn>
        )}

        {!isNoCustomer && (
          <ActionBtn
            color="warning"
            component={Link}
            to={`/dashboards/accounts/payment-list/pending-invoices/${rowData.customerid}`}
          >
            Show Pending Invoices
          </ActionBtn>
        )}
      </div>

      <ConfirmModal
        show={deleteModalOpen}
        onClose={closeModal}
        messages={confirmMessages}
        onOk={handleDeleteRow}
        confirmLoading={confirmDeleteLoading}
        state={state}
      />
    </>
  );
}

function ActionBtn({
  color = "primary",
  onClick,
  children,
  component: Component = "button",
  ...props
}) {
  const colorMap = {
    success: "bg-green-500 hover:bg-green-600 text-white",
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    warning: "bg-amber-500 hover:bg-amber-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
  };

  return (
    <Component
      onClick={onClick}
      className={clsx(
        "inline-flex items-center rounded px-2.5 py-1 text-xs font-medium transition-colors",
        colorMap[color],
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

ActionBtn.propTypes = {
  color: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node,
  component: PropTypes.any,
  to: PropTypes.string,
};

RowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object,
};
