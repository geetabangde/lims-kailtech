// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import { RowActions } from "./RowActions";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();


export const columns = [
  columnHelper.display({
    id: "sn",
    header: "S. No.",
    cell: (props) => (
      <span className="text-sm text-gray-500 dark:text-dark-400">
        {props.row.index + 1}
      </span>
    ),
  }),

  columnHelper.accessor("product_name", {
    header: "Product",
    cell: (info) => (
      <span className="text-sm font-medium text-gray-800 dark:text-dark-100">
        {info.getValue() || "—"}
      </span>
    ),
  }),

  columnHelper.accessor("package_name", {
    header: "Package",
    cell: (info) => (
      <span className="text-sm text-gray-600 dark:text-dark-300">
        {info.getValue() || "—"}
      </span>
    ),
  }),

  columnHelper.accessor("customer_name", {
    header: "Customer",
    cell: (info) => (
      <span className="text-sm text-gray-600 dark:text-dark-300">
        {info.getValue() || "—"}
      </span>
    ),
  }),

  columnHelper.accessor("price", {
    header: "Price",
    cell: (info) => (
      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
        ₹{parseFloat(info.getValue() || 0).toLocaleString("en-IN")}
      </span>
    ),
  }),

  columnHelper.display({
    id: "actions",
    header: "Delete",
    cell: (props) => <RowActions row={props.row} table={props.table} />,
  }),
];

