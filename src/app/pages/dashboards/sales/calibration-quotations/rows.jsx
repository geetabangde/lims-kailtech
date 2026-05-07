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
  
  if (!timestamp || timestamp === "0000-00-00 00:00:00" || timestamp === "0000-00-00") {
    return <p className="font-medium text-gray-400">-</p>;
  }

  const date = dayjs(timestamp).locale(locale).format("DD-MM-YYYY");

  return (
    <>
      <p className="font-medium">{date}</p>
    </>
  );
}

export function HighlightingCell({ getValue, column, table }) {
  const globalQuery = ensureString(table.getState().globalFilter);
  const columnQuery = ensureString(column.getFilterValue());
  const val = getValue() ?? "";
  const displayVal = String(val);

  return (
    <span className="font-medium text-gray-800 dark:text-dark-100">
      <Highlight query={[globalQuery, columnQuery]}>{displayVal}</Highlight>
    </span>
  );
}



export function StatusCell({ getValue }) {
  const val = String(getValue());
  const statusMap = {
    "0": { label: "Item Not Added", color: "neutral" },
    "1": { label: "Pending", color: "info" },
    "2": { label: "CRF Punched", color: "success" },
    "3": { label: "Marked As Converted", color: "primary" },
    "91": { label: "Lost", color: "error" },
  };
  const status = statusMap[val] || { label: val || "Unknown", color: "neutral" };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-${status.color}-100 text-${status.color}-800 dark:bg-${status.color}-900/30 dark:text-${status.color}-100`}
    >
      {status.label}
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

StatusCell.propTypes = {
  getValue: PropTypes.func,
};


