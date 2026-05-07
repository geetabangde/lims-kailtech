// Import Dependencies
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

// Local Imports
import { getStoredPermissions } from "app/navigation/dashboards";
import { useAuthContext } from "app/contexts/auth/context";

// ----------------------------------------------------------------------

export function RowActions({ row }) {
  const { id, status, rcadoneby, timeline } = row.original;
  const permissions = getStoredPermissions();
  const { user } = useAuthContext();

  const currentUserId = user?.id; // Assuming auth context provides this
  const today = dayjs().format("YYYY-MM-DD");
  const timelinePassed = timeline && dayjs(today).isSameOrAfter(dayjs(timeline));

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {/* Status 0: Logged */}
      {status == 0 && (
        <>
          {permissions.includes(252) && (
            <Link
              to={`/dashboards/hrm/employee-termination/assign-investigator/${id}`}
              className="inline-flex items-center justify-center rounded-md bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
            >
              Assign Investigator
            </Link>
          )}
          <Link
            to={`/dashboards/hrm/employee-termination/reject/${id}`}
            className="inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-100"
          >
            Reject
          </Link>
        </>
      )}

      {/* Status 1: Investigator Assigned */}
      {status == 1 && (
        <>
          {currentUserId == rcadoneby && (
            <Link
              to={`/dashboards/hrm/employee-termination/submit-rca/${id}`}
              className="inline-flex items-center justify-center rounded-md bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700 transition hover:bg-green-100 placeholder:text-center"
            >
              Submit Investigation & RCA
            </Link>
          )}
          <Link
            to={`/dashboards/hrm/employee-termination/reject/${id}`}
            className="inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-100"
          >
            Reject
          </Link>
        </>
      )}

      {/* Status 2: Investigation & RCA Submitted */}
      {status == 2 && (
        <>
          {permissions.includes(253) && (
            <Link
              to={`/dashboards/hrm/employee-termination/approve-notice/${id}`}
              className="inline-flex items-center justify-center rounded-md bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100"
            >
              Approve & Issue Showcase
            </Link>
          )}
          <Link
            to={`/dashboards/hrm/employee-termination/reject/${id}`}
            className="inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-100"
          >
            Reject
          </Link>
        </>
      )}

      {/* Status 3 or 7: Showing Case / Reply Received */}
      {((status == 3 && timelinePassed) || status == 7) && (
        <Link
          to={`/dashboards/hrm/employee-termination/complete-process/${id}`}
          className="inline-flex items-center justify-center rounded-md bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700 transition hover:bg-purple-100"
        >
          Issue Warning / Start Notice
        </Link>
      )}

      {/* Status >= 3: Showcase History */}
      {((status >= 3 && status <= 7) ||
        (status == 99 && row.original.warninglettergeneratedby)) && (
        <Link
          to={`/dashboards/hrm/employee-termination/view-notice/${id}`}
          className="inline-flex items-center justify-center rounded-md bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-700 transition hover:bg-gray-100"
        >
          View Showcase Notice
        </Link>
      )}
    </div>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object,
};
