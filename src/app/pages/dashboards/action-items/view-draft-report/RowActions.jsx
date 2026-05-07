import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// RowActions — navigates to view-draft-report/:id page
// PHP: <a href="drafttestreport.php?hakuna=id">View Draft Report</a>
export function RowActions({ row }) {
  const id    = row.original.id;
  const hodId = row.original.hod_id;
  
  const viewUrl = hodId
    ? `/dashboards/action-items/view-draft-report/${id}?hod_id=${hodId}`
    : `/dashboards/action-items/view-draft-report/${id}`;

  return (
    <Link
      to={viewUrl}
      className="inline-block rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow transition hover:bg-blue-700 active:scale-95"
    >
      View Draft Report
    </Link>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
};