// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";
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

  // Employee Name
  columnHelper.accessor("employee_name", {
    id: "employee_name",
    header: "EMPLOYEE NAME",
    cell: (info) => (
      <span className="text-gray-600 dark:text-dark-300">
        {info.getValue() ?? "—"}
      </span>
    ),
  }),

  // Employee ID
  columnHelper.accessor("employee_id", {
    id: "employee_id",
    header: "EMPLOYEE ID",
    cell: (info) => (
      <span className="text-gray-600 dark:text-dark-300">
        {info.getValue() ?? "—"}
      </span>
    ),
  }),

  // Action
  columnHelper.accessor("action", {
    id: "action",
    header: "ACTION",
    cell: (info) => (
      <span className="text-gray-600 dark:text-dark-300">
        {info.getValue() ?? "—"}
      </span>
    ),
  }),

  // Request Form
  columnHelper.accessor("request_form", {
    id: "request_form",
    header: "REQUEST FORM",
    cell: (info) => (
      <span className="text-gray-600 dark:text-dark-300">
        {info.getValue() ?? "—"}
      </span>
    ),
  }),

  // Table Actions
  columnHelper.display({
    id: "actions",
    header: "OPTIONS",
    cell: (info) => <RowActions row={info.row} />,
  }),
];
