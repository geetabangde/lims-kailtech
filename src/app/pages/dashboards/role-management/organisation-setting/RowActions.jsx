import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// ----------------------------------------------------------------------

export function RowActions({ row }) {
  return (
    <div className="flex justify-center">
      <Link
        to={`/dashboards/role-management/process-guide/view/${row.original.id}`}
        className="inline-flex items-center justify-center rounded-md bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 min-w-[60px]"
      >
        <span>View</span>
      </Link>
    </div>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object,
};
