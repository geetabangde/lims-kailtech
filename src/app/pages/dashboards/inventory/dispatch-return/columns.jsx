// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";
import { RowActions } from "./RowActions";

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor("id", {
    id: "id",
    header: "ID",
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor("gatepass_no", {
    id: "gatepass_no",
    header: "Gatepass Number",
    cell: (info) => info.getValue() || "N/A",
  }),

  columnHelper.accessor("purpose_name", {
    id: "purpose_name",
    header: "Purpose",
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor("name", {
    id: "name",
    header: "Name",
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor("challan_no", {
    id: "challan_no",
    header: "Challan No",
    cell: (info) => info.getValue() || "N/A",
  }),

  columnHelper.accessor("sample_return", {
    id: "sample_return",
    header: "Sample Return",
    cell: (info) => info.getValue() || "N/A",
  }),

  columnHelper.accessor("return_on", {
    id: "return_on",
    header: "Return On",
    cell: (info) => info.getValue() || "N/A",
  }),

  columnHelper.display({
    id: "action",
    header: "Actions",
    cell: ({ row }) => <RowActions row={row} />,
  }),
];
