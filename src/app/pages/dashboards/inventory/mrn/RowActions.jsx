// Import Dependencies
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

// Local Imports
import { Button } from "components/ui";

// ----------------------------------------------------------------------

export function RowActions({ row }) {
  const navigate = useNavigate();
  const { id, status, rupload1, rupload2 } = row.original;

  const handleActionClick = () => {
    // PHP: if ($row['status'] == 0) { Add MRN Item } else { View Mrn Items }
    if (status === 0 || status === "0") {
      navigate(`add-item/${id}`);
    } else {
      navigate(`view-items/${id}`);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        color="success"
        className="h-8 text-xs font-medium"
        onClick={handleActionClick}
      >
        {status === 0 || status === "0" ? "Add MRN Item" : "View Mrn Items"}
      </Button>

      {rupload1 && (
        <Button
          component="a"
          href={rupload1}
          target="_blank"
          size="sm"
          color="warning"
          className="h-8 text-xs font-medium"
        >
          View Attachment1
        </Button>
      )}
      {rupload2 && (
        <Button
          component="a"
          href={rupload2}
          target="_blank"
          size="sm"
          color="warning"
          className="h-8 text-xs font-medium"
        >
          View Attachment2
        </Button>
      )}
    </div>
  );
}

RowActions.propTypes = {
  row: PropTypes.object.isRequired,
};
