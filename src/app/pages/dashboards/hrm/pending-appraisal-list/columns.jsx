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

  // ✅ User Name
  columnHelper.accessor("username", {
    id: "username",
    header: "User name",
    cell: (info) => {
      const { firstname, lastname, empid } = info.row.original;
      return `${firstname} ${lastname} (${empid})`;
    },
  }),

  // ✅ Type of Appraisal
  columnHelper.accessor("appraisalin", {
    id: "appraisalin",
    header: "Type Of Appraisal",
    cell: (info) => info.getValue(),
  }),

  // ✅ Initiated By
  columnHelper.accessor("initiated_by_name", {
    id: "initiated_by",
    header: "Initiated By",
    cell: (info) => info.getValue() || "-",
  }),

  // ✅ Actions
  columnHelper.display({
    id: "actions",
    header: () => <div className="text-center">Action</div>,
    cell: RowActions,
  }),
];
