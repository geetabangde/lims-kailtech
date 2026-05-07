// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import { RowActions } from "./RowActions";


const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.display({
    id: "select"
  }),

  // ✅ Serial Number
  columnHelper.accessor((_row, index) => index + 1, {
    id: "s_no",
    header: "S No",
    cell: (info) => info.row.index + 1,
  }),

  // ✅ Mode Name (from API)
  columnHelper.accessor("name", {
    id: "name",
    header: "Name",
    cell: (info) => info.getValue(),
  }),

  // ✅ Description (from API)
  columnHelper.accessor("added_on", {
    id: "added_on",
    header: "Addedon",
    cell: (info) => {
      const dateValue = info.getValue();
      if (!dateValue) return "";
      
      // Parse the date and format as dd-mm-yyyy HH:MM:SS
      const date = new Date(dateValue);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      
      return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    },
  }),

  // ✅ Actions
  columnHelper.display({
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: RowActions,
  }),
];
