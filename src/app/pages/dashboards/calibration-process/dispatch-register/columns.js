// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import { RowActions } from "./RowActions";
import {
  SelectCell,
  SelectHeader,
} from "components/shared/table/SelectCheckbox";

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.display({
    id: "select",
    header: SelectHeader,
    cell: SelectCell,
  }),

  // ✅ Serial Number
  columnHelper.accessor((_row, index) => index + 1, {
    id: "id",
    header: "ID",
    cell: (info) => info.row.index + 1,
  }),

  // ✅ Mode Name (from API)
  columnHelper.accessor("date", {
    id: "date",
    header: "Date",
    cell: (info) => info.getValue(),
  }),

  // ✅ Description (from API)
  columnHelper.accessor("inwardEntryNumber", {
    id: "inwardentrynumber",
    header: "Inward Entry Number",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("customer", {
    id: "customer",
    header: "Customer",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("contactPerson", {
    id: "contactPerson",
    header: "Contact Person",
    cell: (info) => info.getValue(),
  }),

  // ✅ Actions
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: RowActions,
  }),
];
