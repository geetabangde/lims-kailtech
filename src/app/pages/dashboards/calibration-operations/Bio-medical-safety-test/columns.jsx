// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import { RowActions } from "./RowActions";

const columnHelper = createColumnHelper();

export const columns = [
  // ✅ ID
  columnHelper.accessor("id", {
    header: "ID",
    cell: (info) => info.getValue(),
  }),

  // ✅ Description
  columnHelper.accessor("description", {
    header: "Description",
    cell: (info) => (
      <div className="whitespace-normal min-w-[200px] text-sm">
        {info.getValue()}
      </div>
    ),
  }),

  // ✅ Specification
  columnHelper.accessor("specification", {
    header: "Specification",
    cell: (info) => info.getValue(),
  }),

  // ✅ Basic Safety or Electrical Safety
  columnHelper.accessor("safetyType", {
    header: () => <div className="text-center w-full">Basic Safety Or <br /> Electrical Safety</div>,
    cell: (info) => info.getValue(),
  }),

  // ✅ Tolerance
  columnHelper.accessor("tolerance", {
    header: "Tolerance",

    cell: (info) => info.getValue(),

  }),

  // ✅ Actions
  columnHelper.display({
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: RowActions,
  }),
];
