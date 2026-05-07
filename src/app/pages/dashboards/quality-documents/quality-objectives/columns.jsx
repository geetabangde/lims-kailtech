// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import { RowActions } from "./RowActions";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
  // ID
  columnHelper.accessor("id", {
    id: "id",
    header: "ID",
    cell: (info) => (
      <span className="font-medium text-gray-800 dark:text-dark-100">
        {info.getValue()}
      </span>
    ),
  }),

  // Date
  columnHelper.accessor("date", {
    id: "date",
    header: "DATE",
    cell: (info) => (
      <span className="text-gray-600 dark:text-dark-300">
        {info.getValue() ? dayjs(info.getValue()).format("DD/MM/YYYY") : "—"}
      </span>
    ),
  }),

  // Remark
  columnHelper.accessor("remark", {
    id: "remark",
    header: "REMARK",
    cell: (info) => (
      <span className="text-gray-600 dark:text-dark-300">
        {info.getValue() ?? "—"}
      </span>
    ),
  }),

  // Table Actions
  columnHelper.display({
    id: "actions",
    header: "ACTION",
    cell: (info) => <RowActions row={info.row} />,
  }),
];
