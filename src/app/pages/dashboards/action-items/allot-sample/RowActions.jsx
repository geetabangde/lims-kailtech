import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export function RowActions({ row }) {
  const id = row.original.id;
  const allotUrl = `/dashboards/action-items/allot-sample/${id}`;

  return (
    <Link
      to={allotUrl}
      className="inline-block rounded bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow transition hover:bg-red-700"
    >
      Allot Sample
    </Link>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
};