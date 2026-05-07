import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row, index) => index + 1, {
    id: "sNo",
    header: "S.No",
    cell: (info) => info.row.index + 1,
  }),
  columnHelper.accessor("cname", {
    header: "Category Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("name", {
    header: "Item Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("quantity_with_unit", {
    header: "Quantity",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("min_with_unit", {
    header: "Minimum Buffer",
    cell: (info) => info.getValue(),
  }),
];
