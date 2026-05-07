// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import { RowActions } from "./RowActions";

const columnHelper = createColumnHelper();

export const columns = [

  // ✅ ID
  columnHelper.accessor((row) => String(row.id), {
    id: "id",
    header: "ID",
    cell: (info) => info.getValue(),
    filterFn: "includesString",
  }),

  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),

  // ✅ Description
  columnHelper.accessor("description", {
    header: "Description/Symbol",
    cell: (info) => info.getValue(),
  }),





  // ✅ Actions
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: RowActions,
  }),
];
