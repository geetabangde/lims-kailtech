// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import { RowActions } from "./RowActions";

const columnHelper = createColumnHelper();
export const columns = [


  // Sr. No
  columnHelper.accessor((_row, index) => index + 1, {
    id: "s_no",
    header: "Sr. No",
    cell: (info) => info.row.index + 1,
  }),

  // LRN
  columnHelper.accessor("lrn", {
    id: "lrn",
    header: "LRN",
    cell: (info) => (
      <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
        {info.getValue() ?? "—"}
      </span>
    ),
  }),

  // Date
  columnHelper.accessor("added_on", {
    id: "added_on",
    header: "Date",
    cell: (info) => info.getValue() ?? "—",
  }),

  // Product
  columnHelper.accessor("product", {
    id: "product",
    header: "Product",
    cell: (info) => (
      <span className="block max-w-[260px] whitespace-normal text-sm leading-tight">
        {info.getValue() ?? "—"}
      </span>
    ),
  }),

  // Department — PHP: labs name
  columnHelper.accessor("department", {
    id: "department",
    header: "Department",
    cell: (info) => info.getValue() ?? "—",
  }),

  // Package
  columnHelper.accessor("package", {
    id: "package",
    header: "Package",
    cell: (info) => (
      <span className="block max-w-[260px] whitespace-normal text-sm leading-tight">
        {info.getValue() ?? "—"}
      </span>
    ),
  }),

  // Quantity
  columnHelper.accessor("quantity", {
    id: "quantity",
    header: "Quantity",
    cell: (info) => info.getValue() ?? "—",
  }),

  // Customer Type — shown when perm 389
  columnHelper.accessor("ctype_name", {
    id: "ctype_name",
    header: "Customer Type",
    cell: (info) => (
      <span className="block max-w-[200px] whitespace-normal text-sm leading-tight">
        {info.getValue() ?? "—"}
      </span>
    ),
  }),

  // Specific Purpose — shown when perm 390
  columnHelper.accessor("specificpurpose_name", {
    id: "specificpurpose_name",
    header: "Specific Purpose",
    cell: (info) => (
      <span className="block max-w-[180px] whitespace-normal text-sm leading-tight">
        {info.getValue() ?? "—"}
      </span>
    ),
  }),

  // Action — Accept button
  columnHelper.display({
    id: "actions",
    header: "Action",
    cell: RowActions,
  }),
];