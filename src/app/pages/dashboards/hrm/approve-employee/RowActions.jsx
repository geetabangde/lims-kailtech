// Import Dependencies
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// Local Imports


// ----------------------------------------------------------------------

export function RowActions({ row }) {
  const { id, status } = row.original;


  return (
    <div className="flex items-center justify-center gap-2">
      <Link
        to={`/dashboards/hrm/manage-employee/view/${id}`}
        className="inline-flex items-center justify-center rounded-md bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
      >
        View
      </Link>

      {status === 0 && (
        <Link
          to={`/dashboards/hrm/approve-employee/verify/${id}`}
          className="inline-flex items-center justify-center rounded-md bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700 transition hover:bg-green-100"
        >
          Verify
        </Link>
      )}

      <Link
        to={`/dashboards/hrm/manage-employee/edit/${id}`}
        className="inline-flex items-center justify-center rounded-md bg-yellow-50 px-3 py-1.5 text-xs font-bold text-yellow-700 transition hover:bg-yellow-100"
      >
        Edit
      </Link>
    </div>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
};
