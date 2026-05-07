// Import Dependencies
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Button } from "components/ui";

// ----------------------------------------------------------------------

export function RowActions({ row }) {
  const { id } = row.original;

  return (
    <div className="flex gap-1.5">
      <Button
        component={Link}
        to={`/dashboards/inventory/dispatch-return/view?id=${id}`}
        size="xs"
        color="primary"
        className="px-2 font-bold"
      >
        View
      </Button>
    </div>
  );
}

RowActions.propTypes = {
  row: PropTypes.object.isRequired,
};
