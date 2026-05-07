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

  // PHP: Id
  columnHelper.accessor("id", {
    id: "id",
    header: "Id",
    cell: (info) => info.getValue(),
  }),

  // PHP: Indent No.
  columnHelper.accessor("indent_no", {
    id: "indent_no",
    header: "Indent No.",
    cell: (info) => info.getValue(),
  }),

  // PHP: Raised By
  columnHelper.accessor("raised_by", {
    id: "raised_by",
    header: "Raised By",
    cell: (info) => info.getValue(),
  }),

  // PHP: Priority
  columnHelper.accessor("priority", {
    id: "priority",
    header: "Priority",
    cell: (info) => info.getValue(),
  }),

  // PHP: Indent Type
  columnHelper.accessor("indent_type", {
    id: "indent_type",
    header: "Indent Type",
    cell: (info) => info.getValue(),
  }),

  // PHP: Item Name
  columnHelper.accessor("item_name", {
    id: "item_name",
    header: "Item Name",
    cell: (info) => info.getValue(),
  }),

  // PHP: Added On
  columnHelper.accessor("added_on", {
    id: "added_on",
    header: "Added On",
    cell: (info) => info.getValue(),
  }),

  // PHP: Status
  columnHelper.accessor("status", {
    id: "status",
    header: "Status",
    cell: (info) => {
      const status = info.getValue();
      const statusMap = {
        1: "Pending",
        2: "Approved/ Transfer Pending",
        3: "Completed",
        91: "Rejected"
      };
      return statusMap[status] || status;
    },
  }),

  // PHP: Action
  columnHelper.display({
    id: "actions",
    header: () => (
      <div className="flex items-center justify-center">Action</div>
    ),
    cell: RowActions,
  }),
];
