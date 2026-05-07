// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import { RowActions } from "./RowActions";

const columnHelper = createColumnHelper();

const statusMap = {
  0: "Logged",
  1: "Investigator Assigned",
  2: "Investigation & RCA Submitted",
  3: "Show Case Notice Issued",
  4: "Process Completed",
  7: "Reply Received",
  99: "Rejected",
};

export const columns = [
  // ✅ Serial Number
  columnHelper.accessor((_row, index) => index + 1, {
    id: "s_no",
    header: "Sr.no",
    cell: (info) => info.row.index + 1,
  }),

  // ✅ Employee Name
  columnHelper.accessor("firstname", {
    id: "employee_name",
    header: "Name Of the Employee",
    cell: (info) => {
      const { firstname, lastname } = info.row.original;
      return `${firstname} ${lastname}`;
    },
  }),

  // ✅ Employee ID
  columnHelper.accessor("employeecode", {
    id: "employee_id",
    header: "Employee id",
    cell: (info) => info.getValue(),
  }),

  // ✅ Raised By (Type)
  columnHelper.accessor("raisedby", {
    id: "raised_by_type",
    header: "Raised by",
    cell: (info) => info.getValue(),
  }),

  // ✅ Raised By Name
  columnHelper.accessor("raised_by_name", {
    id: "raised_by_name",
    header: "Raised By name",
    cell: (info) => info.getValue() || "-",
  }),

  // ✅ Reason
  columnHelper.accessor("reason", {
    id: "reason",
    header: "Reason",
    cell: (info) => {
      const { reason, detail } = info.row.original;
      return (
        <div className="flex flex-col">
          <span className="font-semibold">{reason}</span>
          <span className="text-xs text-gray-500">{detail}</span>
        </div>
      );
    },
  }),

  // ✅ Status
  columnHelper.accessor("status", {
    id: "status",
    header: "Status",
    cell: (info) => statusMap[info.getValue()] || "Unknown",
  }),

  // ✅ Actions
  columnHelper.display({
    id: "actions",
    header: () => <div className="text-center">Action</div>,
    cell: RowActions,
  }),
];
