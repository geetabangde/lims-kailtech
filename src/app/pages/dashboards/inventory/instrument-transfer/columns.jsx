import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row, index) => index + 1, {
    id: "srNo",
    header: "Sr.No",
    cell: (info) => info.row.index + 1,
  }),
  columnHelper.accessor("insname", {
    header: "Item Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("from_location_name", {
    header: "From Location",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("to_location", {
    header: "To Location",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("batchno", {
    header: "Batch No.",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("qty_with_unit", {
    header: "Quantity",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("firstname", {
    header: "Transfer By",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("added_on", {
    header: "Transfer On",
    cell: (info) => info.getValue(),
  }),
];
