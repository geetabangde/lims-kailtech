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

  // Product — API: pname
  columnHelper.accessor("pname", {
    id: "product",
    header: "Product",
    enableSorting: true,
    cell: (info) => (
      <span className="block max-w-[280px] whitespace-normal text-sm leading-tight text-gray-700 dark:text-dark-200">
        {info.getValue() ?? "—"}
      </span>
    ),
  }),

  // Customer — API: customername
  columnHelper.accessor("customername", {
    id: "customer",
    header: "Customer",
    enableSorting: true,
    cell: (info) => (
      <span className="block max-w-[220px] whitespace-normal text-sm leading-tight text-gray-700 dark:text-dark-200">
        {info.getValue() ?? "—"}
      </span>
    ),
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

  // Grade/Size — API: gradeSize
  columnHelper.accessor("gradeSize", {
    id: "grade_size",
    header: "Grade/Size",
    enableSorting: true,
    cell: (info) => (
      <span className="block max-w-[200px] whitespace-normal text-sm text-gray-700 dark:text-dark-200">
        {info.getValue() ?? "—"}
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