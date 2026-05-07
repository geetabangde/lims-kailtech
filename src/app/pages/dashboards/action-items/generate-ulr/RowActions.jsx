import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const btnCls = {
  primary: "inline-block rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow transition hover:bg-blue-700 active:scale-95 text-center",
  info:    "inline-block rounded bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-white shadow transition hover:bg-cyan-600 active:scale-95 text-center",
  muted:   "inline-flex items-center rounded bg-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400",
};

export function RowActions({ row }) {
  const tid = row.original.id;
  const hid = row.original.hid;

  // trfstatus fallback
  const trfstatus = Number(row.original.trfstatus ?? row.original.status ?? 0);
  // nabl fallback
  const nabl = Number(row.original.nabl ?? 0);

  if (trfstatus === 9) {
    return (
      <div className="flex flex-col gap-1.5">
        {/* PHP: Generate ULR / Complete Report link */}
        <Link 
          to={`/dashboards/action-items/generate-ulr/${tid}?hid=${hid}`}
          className={btnCls.primary}
        >
          {nabl === 1 ? "Generate ULR" : "Complete Report"}
        </Link>

        {/* PHP: View Report link */}
        <Link 
          to={`/dashboards/action-items/GenerateUlrDetail/${tid}?hid=${hid}`}
          className={btnCls.info}
        >
          View Report
        </Link>
      </div>
    );
  }

  return <span className={btnCls.muted}>Pending TRF Approval</span>;
}

RowActions.propTypes = {
  row: PropTypes.object,
};