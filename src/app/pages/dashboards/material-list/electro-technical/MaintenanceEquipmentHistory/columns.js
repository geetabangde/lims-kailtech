import { createColumnHelper } from "@tanstack/react-table";
import { RowActions } from "./RowActions";
import {
  SelectCell,
  SelectHeader,
} from "components/shared/table/SelectCheckbox";
import { DateCell } from "./rows";

const columnHelper = createColumnHelper();

export const columns = [
  // Row selection
  columnHelper.display({
    id: "select",
    label: "Row Selection",
    header: SelectHeader,
    cell: SelectCell,
    size: 50,
  }),

  // S No
  columnHelper.accessor((_row, index) => index + 1, {
    id: "s_no",
    header: "S No",
    cell: (info) => info.row.index + 1,
    size: 80,
  }),

  // Type of Service
  columnHelper.accessor("typeofservice", {
    id: "typeofservice",
    header: "Type Of Service",
    cell: (info) => info.getValue() || "-",
    enableColumnFilter: true,
    size: 150,
  }),

  // Service Provider (NO JSX)
  columnHelper.accessor("serviceprovider", {
    id: "serviceprovider",
    header: "Name and address of service provider",
    cell: (info) => info.getValue() || "-",
    size: 300,
  }),

  // Certificate No
  columnHelper.accessor("certificateno", {
    id: "certificateno",
    header: "Certificate No",
    cell: (info) => info.getValue() || "-",
    size: 150,
  }),

  // Start Date
  columnHelper.accessor("startdate", {
    id: "startdate",
    header: "START DATE",
    cell: DateCell,
    size: 150,
  }),

  // End Date
  columnHelper.accessor("enddate", {
    id: "enddate",
    header: "END DATE",
    cell: DateCell,
    size: 150,
  }),

  // IMC Added (NO JSX)
  columnHelper.accessor("imcadded", {
    id: "imcadded",
    header: "IMC ADDED",
    cell: (info) => info.getValue() || "No",
    size: 120,
  }),

  // Action
  columnHelper.display({
    id: "actions",
    label: "Row Actions",
    header: "ACTION",
    cell: RowActions,
    size: 220,
  }),
];