// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import { RowActions } from "./RowActions";

const columnHelper = createColumnHelper();

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const columns = [
  // ✅ Serial Number
  columnHelper.accessor((_row, index) => index + 1, {
    id: "s_no",
    header: "Sr No",
    cell: (info) => info.row.index + 1,
  }),

  // ✅ Month
  columnHelper.accessor("month", {
    id: "month",
    header: "Month",
    cell: (info) => {
      const vol = info.getValue();
      // If it's a number, convert to name
      if (!isNaN(vol) && vol >= 1 && vol <= 12) {
        return monthNames[parseInt(vol) - 1];
      }
      return vol;
    },
  }),

  // ✅ Year
  columnHelper.accessor("year", {
    id: "year",
    header: "Year",
    cell: (info) => info.getValue(),
  }),

  // ✅ Total Days
  columnHelper.accessor((row) => {
    // Calculate total days in month
    const year = parseInt(row.year);
    const month = parseInt(row.month);
    if (!isNaN(year) && !isNaN(month)) {
      return new Date(year, month, 0).getDate();
    }
    return "";
  }, {
    id: "total_days",
    header: "Total Days",
  }),

  // ✅ Actions
  columnHelper.display({
    id: "actions",
    header: () => <div className="text-center">Action</div>,
    cell: RowActions,
  }),
];
