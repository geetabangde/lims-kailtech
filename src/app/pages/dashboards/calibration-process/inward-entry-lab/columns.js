import { createColumnHelper } from "@tanstack/react-table";
import { RowActions } from "./RowActions";
import {
  SelectCell,
  SelectHeader,
} from "components/shared/table/SelectCheckbox";

const columnHelper = createColumnHelper();

export const columns = [
  // ✅ Select Checkbox
  columnHelper.display({
    id: "select",
    header: SelectHeader,
    cell: SelectCell,
  }),

  // ✅ Serial Number
  columnHelper.accessor((_row, index) => index + 1, {
    id: "s_no",
    header: "S No",
    cell: (info) => info.row.index + 1,
  }),

  // ✅ ID
  columnHelper.accessor("id", {
    id: "id",
    header: "Inward Entry No",
    cell: (info) => info.getValue(),
  }),

  // ✅ Date
  columnHelper.accessor("inwarddate", {
    id: "inwarddate",
    header: "Date",
    cell: (info) => info.getValue(), // Format if needed
  }),

  // ✅ Inward Entry No (PO Number)
  columnHelper.accessor("ponumber", {
    id: "ponumber",
    header: "Po Number",
    cell: (info) => info.getValue(),
  }),

  // ✅ Customer Name
  columnHelper.accessor("customername", {
    id: "customername",
    header: "Customer",
    cell: (info) => info.getValue(),
  }),

  // ✅ Contact Person
  columnHelper.accessor("concernpersonname", {
    id: "concernpersonname",
    header: "Contact Person",
    cell: (info) => info.getValue(),
  }),

  // ✅ Location
  columnHelper.accessor("instrumentlocation", {
    id: "instrumentlocation",
    header: "Location",
    cell: (info) => info.getValue(),
  }),

  // // ✅ Remarks
  // columnHelper.accessor("certcollectionremark", {
  //   id: "certcollectionremark",
  //   header: "Remarks",
  //   cell: (info) => info.getValue(),
  // }),
  columnHelper.accessor("reviewremark", {  // ✅ Change this
  id: "reviewremark",                     // ✅ Change this too
  header: "Remarks",
  cell: (info) => info.getValue(),
}),

  // ✅ Row Actions (Edit/Delete buttons)
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: RowActions,
  }),
];
