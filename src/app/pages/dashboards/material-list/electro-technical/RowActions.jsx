import clsx from "clsx";
import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ConfirmModal } from "components/shared/ConfirmModal";
import { Button } from "components/ui";

const confirmMessages = {
  pending: {
    description:
      "Are you sure you want to delete this order? Once deleted, it cannot be restored.",
  },
  success: {
    title: "Order Deleted",
  },
};

export function RowActions({ row, table }) {
  const { labSlug } = useParams();
  const [searchParams] = useSearchParams();
  const labId = searchParams.get('labId');

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError] = useState(false);

  const instrumentId = row.original.id;

  const permissions =
    localStorage.getItem("userPermissions")?.split(",").map(Number) || [];

  const hasPermission = (id) => !id || permissions.includes(id);

  const closeModal = () => {
    setDeleteModalOpen(false);
  };

  const handleDeleteRows = useCallback(() => {
    setConfirmDeleteLoading(true);
    setTimeout(() => {
      table.options.meta?.deleteRow(row);
      setDeleteSuccess(true);
      setConfirmDeleteLoading(false);
    }, 1000);
  }, [row, table]);

  const state = deleteError ? "error" : deleteSuccess ? "success" : "pending";

  const btnClass = "btn h-7 rounded px-2.5 py-1 text-[10px] font-bold outline-none transition-all hover:shadow-md whitespace-nowrap";

  // Check if instrument category is 1 or 12 (Electro-technical)
  const isElectroTechnicalCategory = row.original.categoryid == "1" || row.original.categoryid == "12";
  const hasQuantity = row.original.qty > 0;

  return (
    <>
      <div className="flex flex-col gap-1.5 w-fit">
        {/* Row 1: Edit - Permission 66 */}
        {hasPermission(66) && (
          <div className="flex">
            <Button
              component={Link}
              unstyled={true}
              to={`/dashboards/material-list/${labSlug}/Edit/${instrumentId}?labId=${labId}`}
              className={clsx(btnClass, "bg-amber-50 text-amber-700 hover:bg-amber-100")}
            >
              <span>Edit</span>
            </Button>
          </div>
        )}

        {/* Row 2: Maintenance Equipment History - Permission 68 + Category Check */}
        {hasPermission(68) && isElectroTechnicalCategory && (
          <div className="flex">
            <Button
              component={Link}
              unstyled={true}
              to={`/dashboards/material-list/${labSlug}/maintenance-equipment-history?fid=${instrumentId}&labId=${labId}`}
              className={clsx(btnClass, "bg-sky-50 text-sky-700 hover:bg-sky-100")}
            >
              <span>Maintenance equipment history</span>
            </Button>
          </div>
        )}

        {/* Row 3: View Equipment History - Permission 68 + Category Check */}
        {hasPermission(68) && isElectroTechnicalCategory && (
          <div className="flex">
            <Button
              component={Link}
              unstyled={true}
              to={`/dashboards/material-list/${labSlug}/view-equipment-history/${instrumentId}?labId=${labId}`}
              className={clsx(btnClass, "bg-blue-50 text-blue-700 hover:bg-blue-100")}
            >
              <span>View Equipment History</span>
            </Button>
          </div>
        )}

        {/* Row 4: View Checklist - Permission 68 + Category Check */}
        {hasPermission(68) && isElectroTechnicalCategory && (
          <div className="flex">
            <Button
              component={Link}
              unstyled={true}
              to={`/dashboards/material-list/${labSlug}/view-checklist/${instrumentId}?labId=${labId}`}
              className={clsx(btnClass, "bg-blue-50 text-blue-700 hover:bg-blue-100")}
            >
              <span>View Checklist</span>
            </Button>
          </div>
        )}

        {/* Row 5: View Verification list and Dump */}
        <div className="flex gap-1.5">
          {/* View Verification list - Permission 68 + Category Check */}
          {hasPermission(68) && isElectroTechnicalCategory && (
            <Button
              component={Link}
              unstyled={true}
              to={`/dashboards/material-list/${labSlug}/view-verification-list/${instrumentId}?labId=${labId}`}
              className={clsx(btnClass, "bg-amber-50 text-amber-700 hover:bg-amber-100")}
            >
              <span>View Verification list</span>
            </Button>
          )}
          {/* Dump - Permission 137 + Quantity Check */}
          {hasPermission(137) && hasQuantity && (
            <Button
              component={Link}
              unstyled={true}
              to={`/dashboards/material-list/${labSlug}/dump/${instrumentId}?labId=${labId}`}
              className={clsx(btnClass, "bg-red-50 text-red-700 hover:bg-red-100")}
            >
              <span>Dump</span>
            </Button>
          )}
        </div>

        {/* Row 6: Log Book - No permission required (available to everyone) */}
        <div className="flex">
          <Button
            component={Link}
            unstyled={true}
            to={`/dashboards/material-list/${labSlug}/log-book/${instrumentId}?labId=${labId}`}
            className={clsx(btnClass, "bg-transparent text-red-600 hover:bg-red-50 !shadow-none px-0")}
          >
            <span>Log Book</span>
          </Button>
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