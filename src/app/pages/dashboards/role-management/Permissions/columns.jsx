// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import { RowActions } from "./RowActions";


const columnHelper = createColumnHelper();

export const columns = [
  // ✅ ID
  columnHelper.accessor("id", {
    id: "id",
    header: "ID",
    cell: (info) => info.getValue(),
  }),

  // ✅ Permission Name
  columnHelper.accessor("name", {
    id: "name",
    header: "Name",
    cell: (info) => (
      <div className="max-w-[200px] whitespace-normal break-words">
        {info.getValue()}
      </div>
    ),
  }),

  // ✅ Description
  columnHelper.accessor("description", {
    id: "description",
    header: "Description",
    cell: (info) => (
      <div className="max-w-[250px] whitespace-normal break-words">
        {info.getValue() || "-"}
      </div>
    ),
  }),

  // ✅ Module
  columnHelper.accessor("module_name", {
    id: "module_name",
    header: "Module",
    cell: (info) => (
      <div className="max-w-[150px] whitespace-normal break-words">
        {info.getValue() || info.row.original.module || "-"}
      </div>
    ),
  }),

  // ✅ Actions
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: RowActions,
  }),
];
