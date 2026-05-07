// Import Dependencies
import PropTypes from "prop-types";

// ----------------------------------------------------------------------

export function RowActions({ row, onApproveReject }) {
  const permissions = JSON.parse(localStorage.getItem("userPermissions") || "[]");
  const rowData = row.original;
  
  const status = Number(rowData.status);
  const invstatus = Number(rowData.invstatus);
  const approved_on = rowData.approved_on;
  const ack_dt = rowData.ack_dt;

  // PHP: if ($row['status'] == 0 && in_array(42, $permissions))
  if (status !== 0 || !permissions.includes(42)) {
    return null;
  }

  // PHP: Check complex conditions
  let canShowButton = false;

  // Condition 1: approved_on < 2023-08-01
  if (approved_on) {
    const approvedDate = new Date(approved_on);
    const august1st2023 = new Date('2023-08-01');
    if (approvedDate < august1st2023) {
      canShowButton = true;
    }
  }

  // Condition 2: invstatus == 2 AND current_datetime < ack_dt + 1 day
  if (!canShowButton && invstatus === 2 && ack_dt) {
    const ackDate = new Date(ack_dt);
    const oneDayLater = new Date(ackDate);
    oneDayLater.setDate(oneDayLater.getDate() + 1);
    const now = new Date();
    if (now < oneDayLater) {
      canShowButton = true;
    }
  }

  // Condition 3: invstatus == 1 (approved)
  if (!canShowButton && invstatus === 1) {
    canShowButton = true;
  }

  // Condition 4: invstatus == 0 (pending)
  if (!canShowButton && invstatus === 0) {
    canShowButton = true;
  }

  if (!canShowButton) {
    return null;
  }

  const handleAction = () => {
    onApproveReject(rowData);
  };

  return (
    <div className="flex justify-center">
      <button
        onClick={handleAction}
        className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
      >
        Approve / Reject
      </button>
    </div>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
  onApproveReject: PropTypes.func,
};
