// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper();

export const columns = [
  // ✅ Serial Number
  columnHelper.accessor((_row, index) => index + 1, {
    id: "s_no",
    header: "S No",
    cell: (info) => info.row.index + 1,
  }),

  // ✅ Category
  columnHelper.accessor("cname", {
    id: "cname",
    header: "Category",
    cell: (info) => info.getValue() || "N/A",
  }),

  // ✅ Product Name
  columnHelper.accessor("name", {
    id: "name",
    header: "Product Name",
    cell: (info) => info.getValue() || "N/A",
  }),

  // ✅ Important (Critical)
  columnHelper.accessor("critical_label", {
    id: "critical",
    header: "Important",
    cell: (info) => info.getValue() || "N/A",
  }),

  // ✅ UOM
  columnHelper.accessor("unit_label", {
    id: "unit",
    header: "UOM",
    cell: (info) => info.getValue() || "N/A",
  }),

  // ✅ Quantity
  columnHelper.accessor("quanity", {
    id: "quanity",
    header: "Quantity",
    cell: (info) => info.getValue() ?? 0,
  }),

  // ✅ Minimum
  columnHelper.accessor("min", {
    id: "min",
    header: "Minimum",
    cell: (info) => info.getValue() ?? 0,
  }),
];
