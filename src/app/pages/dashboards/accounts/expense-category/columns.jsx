import { createColumnHelper } from "@tanstack/react-table";
import { RowActions } from "./RowActions";

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.display({
    id: "s_no",
    header: () => <div className="text-center">ID</div>,
    cell: (info) => <div className="text-center">{info.row.index + 1}</div>,
  }),
  columnHelper.accessor("name", {
    id: "name",
    header: "NAME",
    cell: (info) => info.getValue() ?? "-",
  }),
  columnHelper.accessor("description", {
    id: "description",
    header: "DESCRIPTION/SYMBOL",
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
