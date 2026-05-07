// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";
import { RowActions } from "./RowActions";

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor("id", {
    id: "id",
    header: "ID",
    cell: (info) => info.getValue() ?? "-",
  }),
  columnHelper.accessor("product", {
    id: "product",
    header: "Product",
    cell: (info) => info.getValue() ?? "-",
  }),
  columnHelper.accessor("lrn", {
    id: "lrn",
    header: "LRN",
    cell: (info) => info.getValue() ?? "-",
  }),
  columnHelper.accessor("brand_source", {
    id: "brand_source",
    header: "Brand/Source",
    cell: (info) => info.getValue() ?? "-",
  }),
  columnHelper.accessor("grade_size", {
    id: "grade_size",
    header: "Grade/Size",
    cell: (info) => info.getValue() ?? "-",
  }),
  columnHelper.accessor("chemist", {
    id: "chemist",
    header: "Chemist",
    cell: (info) => info.getValue() ?? "-",
  }),
  columnHelper.accessor("parameters", {
    id: "parameters",
    header: "Parameters",
    cell: (info) => {
      const val = info.getValue();
      if (!val) return "-";
      // Handle HTML returned from legacy PHP
      if (typeof val === "string" && val.includes("<")) {
        return <div dangerouslySetInnerHTML={{ __html: val }} />;
      }
      return val;
    },
  }),
  columnHelper.display({
    id: "action",
    header: "Action",
    cell: ({ row, table }) => <RowActions row={row} table={table} />,
  }),
];
