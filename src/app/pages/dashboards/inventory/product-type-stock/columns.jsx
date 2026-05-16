// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";
import clsx from "clsx";

const columnHelper = createColumnHelper();

export const columns = [
  // ✅ Category
  columnHelper.accessor("cname", {
    id: "cname",
    header: "Category",
    cell: (info) => info.getValue() || "N/A",
  }),

  // ✅ Product Name
  columnHelper.accessor("name", {
    id: "name",
    header: "Product Name",
    cell: (info) => info.getValue() || "N/A",
  }),

  // ✅ Important (Critical)
  columnHelper.accessor("critical_name", {
    id: "critical",
    header: "Important",
    cell: (info) => {
      const value = info.getValue();
      if (value === "Yes") {
        return (
          <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/20">
            Yes
          </span>
        );
      }
      return value || "No";
    },
  }),

  // ✅ UOM
  columnHelper.accessor("unit_name", {
    id: "unit",
    header: "UOM",
    cell: (info) => info.getValue() || "N/A",
  }),

  // ✅ Quantity
  columnHelper.accessor("quantity", {
    id: "quantity",
    header: "Quantity",
    cell: (info) => {
      const value = parseFloat(info.getValue() || 0);
      const min = parseFloat(info.row.original.min || 0);
      const isCritical = value < min;

      return (
        <span
          className={clsx(
            "font-semibold",
            isCritical ? "text-red-600 dark:text-red-400" : "text-gray-700 dark:text-gray-300"
          )}
        >
          {value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 3 })}
        </span>
      );
    },
  }),

  // ✅ Minimum
  columnHelper.accessor("min", {
    id: "min",
    header: "Minimum",
    cell: (info) => info.getValue() ?? 0,
  }),
];

