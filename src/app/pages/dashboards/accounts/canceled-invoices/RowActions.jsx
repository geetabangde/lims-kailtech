import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Button } from "components/ui";

export function RowActions({ row }) {
  const { id, invoiceid } = row.original;

  return (
    <div className="flex justify-center">
      <Button
        size="sm"
        color="success"
        className="inline-flex items-center h-8 rounded px-3 text-xs"
        component={Link}
        to={`/dashboards/accounts/canceled-invoices/view/${invoiceid ?? id}`}
      >
        View Invoice
      </Button>
    </div>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
};
