// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
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

  // PHP: Sr.No
  columnHelper.display({
    id: "sr_no",
    header: "Sr.No",
    cell: ({ row }) => row.index + 1,
  }),

  // PHP: Name
  columnHelper.accessor("name", {
    id: "name",
    header: "Name",
    cell: (info) => info.getValue(),
  }),

  // PHP: Id no
  columnHelper.accessor("id_no", {
    id: "id_no",
    header: "Id no",
    cell: (info) => info.getValue(),
  }),

  // PHP: Category
  columnHelper.accessor("category", {
    id: "category",
    header: "Category",
    cell: (info) => info.getValue(),
  }),

  // PHP: Type
  columnHelper.accessor("type", {
    id: "type",
    header: "Type",
    cell: (info) => info.getValue(),
  }),

  // PHP: Quantity
  columnHelper.accessor("quantity", {
    id: "quantity",
    header: "Quantity",
    cell: (info) => info.getValue(),
  }),

  // PHP: Batch No
  columnHelper.accessor("batch_no", {
    id: "batch_no",
    header: "Batch No",
    cell: (info) => info.getValue(),
  }),
];
