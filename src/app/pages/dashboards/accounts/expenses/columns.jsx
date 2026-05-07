import { createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import { RowActions } from "./RowActions";

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.display({
    id: "s_no",
    header: () => <div className="text-center">ID</div>,
    cell: (info) => <div className="text-center">{info.row.index + 1}</div>,
  }),

  columnHelper.accessor("title", {
    id: "title",
    header: "TITLE",
    cell: (info) => info.getValue() ?? "-",
  }),

  columnHelper.accessor("description", {
    id: "description",
    header: "DESCRIPTION",
    cell: (info) => info.getValue() ?? "-",
  }),

  columnHelper.accessor("category_name", {
    id: "category_name",
    header: "CATEGORY",
    cell: (info) => info.getValue() ?? "-",
  }),

  columnHelper.accessor("expensedate", {
    id: "expensedate",
    header: "DATE",
    cell: (info) => {
      const val = info.getValue();
      return val ? dayjs(val).format("DD/MM/YYYY") : "-";
    },
  }),

  columnHelper.accessor("referenceto", {
    id: "referenceto",
    header: "REFERENCE TO",
    cell: (info) => info.getValue() ?? "-",
  }),

  columnHelper.accessor("amount", {
    id: "amount",
    header: "AMOUNT",
    cell: (info) => <span className="font-medium">₹{info.getValue() ?? "0"}</span>,
  }),

  columnHelper.accessor("status", {
    id: "status",
    header: "STATUS",
    cell: (info) => info.getValue() ?? "-",
  }),

  columnHelper.display({
    id: "actions",
    header: () => <div className="text-center">ACTIONS</div>,
    cell: (info) => (
       <div className="flex justify-center">
         <RowActions row={info.row} table={info.table} />
       </div>
    ),
  }),
];
