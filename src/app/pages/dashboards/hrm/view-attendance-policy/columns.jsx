// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import { RowActions } from "./RowActions";

const columnHelper = createColumnHelper();

export const columns = [
  // ✅ Serial Number
  columnHelper.accessor((_row, index) => index + 1, {
    id: "s_no",
    header: "S No",
    cell: (info) => info.row.index + 1,
  }),

  // ✅ Name
  columnHelper.accessor("name", {
    id: "name",
    header: "Name",
    cell: (info) => info.getValue(),
  }),

  // ✅ InTime
  columnHelper.accessor("intime", {
    id: "intime",
    header: "InTime",
    cell: (info) => info.getValue(),
  }),

  // ✅ OutTime
  columnHelper.accessor("outtime", {
    id: "outtime",
    header: "OutTime",
    cell: (info) => info.getValue(),
  }),

  // ✅ Working Hours
  columnHelper.accessor("working_hours", {
    id: "working_hours",
    header: "Working Hours",
    cell: (info) => info.getValue(),
  }),

  // ✅ Actions
  columnHelper.display({
    id: "actions",
    header: () => <div className="text-center">Action</div>,
    cell: RowActions,
  }),
];
