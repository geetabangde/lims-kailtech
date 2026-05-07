import { createColumnHelper } from "@tanstack/react-table";
import { RowActions } from "./RowActions";
import { DateCell, HighlightingCell, StatusCell } from "./rows";

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor("id", {
    id: "id",
    header: "ID",
    cell: (info) => <HighlightingCell getValue={() => info.row.index + 1} column={info.column} table={info.table} />,
  }),
  columnHelper.accessor("quotationno", {
    id: "quotationno",
    header: "Quotation No.",
    cell: (info) => <HighlightingCell {...info} />,
  }),
  columnHelper.accessor("status", {
    id: "status",
    header: "Status",
    cell: (info) => <StatusCell {...info} />,
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: (info) => <RowActions {...info} />,
  }),
  columnHelper.accessor("added_on", {
    id: "added_on",
    header: "Date",
    cell: (info) => <DateCell {...info} />,
  }),
  columnHelper.accessor((row) => row.customername || row.cname || "-", {
    id: "customername",
    header: "Customer Name",
    cell: (info) => <HighlightingCell {...info} />,
  }),
  columnHelper.accessor("ctype", {
    id: "ctype",
    header: "Customer Type",
    cell: (info) => <HighlightingCell {...info} />,
  }),
  columnHelper.accessor("specificpurpose", {
    id: "specificpurpose",
    header: "Specific Purpose",
    cell: (info) => <HighlightingCell {...info} />,
  }),
  columnHelper.accessor("enquirydate", {
    id: "enquirydate",
    header: "Enquiry Date",
    cell: (info) => <DateCell {...info} />,
  }),
];
