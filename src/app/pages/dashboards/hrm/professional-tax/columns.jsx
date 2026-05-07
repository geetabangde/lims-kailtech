// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import { RowActions } from "./RowActions";

const columnHelper = createColumnHelper();

export const columns = [
  // ✅ Serial Number
  columnHelper.accessor((_row, index) => index + 1, {
    id: "s_no",
    header: "S. No.",
    cell: (info) => info.row.index + 1,
  }),

  // ✅ Min Salary
  columnHelper.accessor("min", {
    id: "min",
    header: "Min Salary",
    cell: (info) => info.getValue(),
  }),

  // ✅ Max Salary
  columnHelper.accessor("max", {
    id: "max",
    header: "Max Salary",
    cell: (info) => info.getValue(),
  }),

  // ✅ Tax Amount
  columnHelper.accessor("tax", {
    id: "tax",
    header: "Tax Amount",
    cell: (info) => info.getValue(),
  }),

  // ✅ Actions
  columnHelper.display({
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: RowActions,
  }),
];
