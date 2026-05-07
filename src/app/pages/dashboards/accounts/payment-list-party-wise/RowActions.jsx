// Import Dependencies
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// ----------------------------------------------------------------------

export function RowActions({ row }) {
  const { id } = row.original;

  return (
    <div className="flex flex-wrap gap-1.5 justify-center">
      <Link
        to={`/dashboards/accounts/customer-payment/${id}`}
        className="rounded bg-blue-500 px-3 py-1 text-xs font-medium text-white hover:bg-blue-600"
      >
        Payment List
      </Link>
      <Link
        to={`/dashboards/accounts/customer-ledger/${id}`}
        className="rounded bg-green-500 px-3 py-1 text-xs font-medium text-white hover:bg-green-600"
      >
        Ledger
      </Link>
    </div>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
};
