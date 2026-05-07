// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import { RowActions } from "./RowActions";

const columnHelper = createColumnHelper();

export const columns = [
  // ✅ ID
  columnHelper.accessor("id", {
    id: "id",
    header: "ID",
    cell: (info) => info.getValue(),
  }),

  // ✅ Date
  columnHelper.accessor("entry_date", {
    id: "entry_date",
    header: "Date",
    cell: (info) => info.getValue() || "N/A",
  }),

  // ✅ Purpose
  columnHelper.accessor("purpose", {
    id: "purpose",
    header: "Purpose",
    cell: (info) => info.getValue() || "N/A",
  }),

  // ✅ Description
  columnHelper.accessor("description", {
    id: "description",
    header: "Description",
    cell: (info) => info.getValue() || "N/A",
  }),

  // ✅ Quantity
  columnHelper.accessor("quantity", {
    id: "quantity",
    header: "Quantity",
    cell: (info) => info.getValue() || "N/A",
  }),

  // ✅ Source
  columnHelper.accessor("source", {
    id: "source",
    header: "Source",
    cell: (info) => info.getValue() || "N/A",
  }),

  // ✅ Issued To
  columnHelper.accessor("employee_name", {
    id: "employee_name",
    header: "Issued To",
    cell: (info) => info.getValue() || "N/A",
  }),

  // ✅ Remark
  columnHelper.accessor("remark", {
    id: "remark",
    header: "Remark",
    cell: (info) => info.getValue() || "N/A",
  }),

  // ✅ Actions
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: RowActions,
  }),
];
