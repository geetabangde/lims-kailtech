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

  // ✅ Process Name
  columnHelper.accessor("name", {
    id: "name",
    header: "Name",
    cell: (info) => (
      <div className="min-w-[250px] whitespace-normal break-words font-semibold text-slate-800">
        {info.getValue()}
      </div>
    ),
  }),

  // ✅ Description
  columnHelper.accessor("description", {
    id: "description",
    header: "Description/Symbol",
    cell: (info) => (
      <div className="min-w-[350px] whitespace-normal break-words">
        {info.getValue() || "-"}
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
