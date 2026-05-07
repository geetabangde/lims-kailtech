import PropTypes from "prop-types";

// Local Imports

// ----------------------------------------------------------------------

export function RowActions({ row, table }) {
  const permissions = JSON.parse(localStorage.getItem("userPermissions") || "[]");
  const status = Number(row.original.status);
  
  // PHP: if ($row['status'] == 0) { if (in_array(413, $permissions)) { ... } }
  const canApprove = status === 0 && permissions.includes(413);

  const handleOpenModal = () => {
    table.options.meta?.openApproveModal(row);
  };

  if (!canApprove) {
    return <span className="text-xs text-gray-400">—</span>;
  }

  return (
    <div className="flex justify-center items-center">
      <button
        onClick={handleOpenModal}
        className="flex h-8 items-center rounded-lg bg-green-50 px-3 text-xs font-bold text-green-700 transition hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 shadow-sm"
      >
        Approve/Reject
      </button>
    </div>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object,
};