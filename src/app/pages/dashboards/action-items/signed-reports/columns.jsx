// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import { RowActions } from "./RowActions";


// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [


  // ID
  columnHelper.accessor("id", {
    id: "id",
    header: "ID",
    enableSorting: true,
    cell: (info) => (
      <span className="text-sm text-gray-700 dark:text-dark-200">
        {info.getValue() ?? "—"}
      </span>
    ),
  }),

  // Product
  columnHelper.accessor("pname", {
    id: "pname",
    header: "Product",
    enableSorting: true,
    size: 200,
    maxSize: 250,
    cell: (info) => (
      <span
        className="text-sm text-gray-700 dark:text-dark-200 block"
        style={{ maxWidth: "250px", whiteSpace: "normal", wordBreak: "break-word" }}
      >
        {info.getValue() ?? "—"}
      </span>
    ),
  }),

  // Main Customer — PHP: customername
  columnHelper.accessor("customername", {
    id: "customername",
    header: "Main Customer",
    enableSorting: true,
    cell: (info) => (
      <span
        className="text-sm text-gray-700 dark:text-dark-200 block"
        style={{ maxWidth: "200px", whiteSpace: "normal", wordBreak: "break-word" }}
      >
        {info.getValue() ?? "—"}
      </span>
    ),
  }),

  // Report Customer — API: reportNames
  columnHelper.accessor("reportNames", {
    id: "reportNames",
    header: "Report Customer",
    enableSorting: true,
    cell: (info) => {
      const val = info.getValue();
      const stringVal = Array.isArray(val) ? val.join(", ") : (val ?? "—");
      return (
        <span
          className="text-sm text-gray-700 dark:text-dark-200 block"
          style={{ maxWidth: "200px", whiteSpace: "normal", wordBreak: "break-word" }}
        >
          {stringVal}
        </span>
      );
    },
  }),

  // LRN
  columnHelper.accessor("lrn", {
    id: "lrn",
    header: "LRN",
    enableSorting: true,
    cell: (info) => (
      <span className="text-sm text-gray-700 dark:text-dark-200">
        {info.getValue() ?? "—"}
      </span>
    ),
  }),

  // BRN
  columnHelper.accessor("brn", {
    id: "brn",
    header: "BRN",
    enableSorting: true,
    cell: (info) => (
      <span className="text-sm text-gray-700 dark:text-dark-200">
        {info.getValue() ?? "—"}
      </span>
    ),
  }),

  // ULR
  columnHelper.accessor("ulr", {
    id: "ulr",
    header: "ULR",
    enableSorting: true,
    cell: (info) => (
      <span className="text-sm text-gray-700 dark:text-dark-200">
        {info.getValue() ?? "—"}
      </span>
    ),
  }),

  // Grade/Size — Combined API: grade + size
  columnHelper.accessor((row) => {
    const grade = row.grade || "";
    const size = row.size || "";
    if (grade && size) return `${grade} / ${size}`;
    return grade || size || "—";
  }, {
    id: "grade_size",
    header: "Grade/Size",
    enableSorting: true,
    cell: (info) => (
      <span className="text-sm text-gray-700 dark:text-dark-200">
        {info.getValue()}
      </span>
    ),
  }),

  // Action
  columnHelper.display({
    id: "actions",
    header: "Action",
    enableSorting: false,
    cell: RowActions,
  }),
];