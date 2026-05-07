// Import Dependencies
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { Highlight } from "components/shared/Highlight";
import { useLocaleContext } from "app/contexts/locale/context";
import { ensureString } from "utils/ensureString";

// ----------------------------------------------------------------------

export function DateCell({ getValue }) {
  const { locale } = useLocaleContext();
  const timestamp = getValue();
  const date = dayjs(timestamp).locale(locale).format("DD/MM/YYYY");

  return (
    <p className="font-medium text-gray-800 dark:text-dark-100">{date}</p>
  );
}

export function HighlightingCell({ getValue, column, table }) {
  const globalQuery = ensureString(table.getState().globalFilter);
  const columnQuery = ensureString(column.getFilterValue());
  const val = getValue();
  const displayVal = val !== null && val !== undefined && val !== "" ? String(val) : "-";

  return (
    <span className="font-medium text-gray-800 dark:text-dark-100">
      <Highlight query={[globalQuery, columnQuery]}>{displayVal}</Highlight>
    </span>
  );
}



DateCell.propTypes = {
  getValue: PropTypes.func,
};

HighlightingCell.propTypes = {
  getValue: PropTypes.func,
  column: PropTypes.object,
  table: PropTypes.object,
};


