import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// ----------------------------------------------------------------------

export function RowActions({ row }) {
  return (
    <div className="flex justify-center">
      <Link
        to={`/dashboards/gate-entry/view/${row.original.id}`}
        className="inline-flex items-center justify-center rounded-md bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 transition hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
      >
        <span>View Info</span>
      </Link>
    </div>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
};
