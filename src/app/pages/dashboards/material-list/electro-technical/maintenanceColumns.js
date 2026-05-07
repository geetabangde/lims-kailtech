import { createColumnHelper } from "@tanstack/react-table";
import { RowActions } from "./RowActions";
import {
  SelectCell,
  SelectHeader,
} from "components/shared/table/SelectCheckbox";
import {

  OrderIdCell,
  
  DateCell,
 
  TotalCell,
} from "./rows";
// import { orderStatusOptions } from "./data";

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.display({
    id: "select",
    label: "Row Selection",  
    header: SelectHeader,
    cell: SelectCell,
  }),

  // ✅ S No (index based)
  columnHelper.accessor((_row, index) => index + 1, {
    id: "s_no",
    header: "S No",
    cell: (info) => info.row.index + 1,
  }),

  // ✅ Name
 
 columnHelper.accessor((row) => row.type_of_service, {
    id: "type_of_service",
    label: "type_of_service ID",
    header: "Type Of Service",
    cell: OrderIdCell,
  }),
  // ✅ Id No
  columnHelper.accessor((row) => row.order_id, {
    id: "order_id",
    label: "Order ID",
    header: "Id No",
    cell: OrderIdCell,
  }),

  // ✅ New Id No
  columnHelper.accessor((row) => row.new_id_no, {
    id: "new_id_no",
    header: "New Id No",
    cell: (info) => info.getValue() || "-",
  }),

  // ✅ Serial No
  columnHelper.accessor((row) => row.serial_no, {
    id: "serial_no",
    header: "Serial No",
    cell: (info) => info.getValue() || "-",
  }),

  // ✅ Available Quantity
  columnHelper.accessor((row) => row.total, {
    id: "total",
    label: "Total",
    header: "Available Quantity",
    filterFn: "inNumberRange",
    filter: "numberRange",
    cell: TotalCell,
  }),

  // ✅ Category
  columnHelper.accessor((row) => row.category, {
    id: "category",
    header: "Category",
    cell: (info) => info.getValue() || "-",
  }),

  // ✅ Location
  columnHelper.accessor((row) => row.location, {
    id: "location",
    header: "Location",
    cell: (info) => info.getValue() || "-",
  }),

  // ✅ Make
  columnHelper.accessor((row) => row.make, {
    id: "make",
    header: "Make",
    cell: (info) => info.getValue() || "-",
  }),

  // ✅ Model
  columnHelper.accessor((row) => row.model, {
    id: "model",
    header: "Model",
    cell: (info) => info.getValue() || "-",
  }),

  // ✅ Purchase Date
  columnHelper.accessor((row) => Number(row.created_at), {
    id: "created_at",
    label: "Order Date",
    header: "Purchase Date",
    cell: DateCell,
    filter: "dateRange",
    filterFn: "inNumberRange",
  }),

  // ✅ Action
  columnHelper.display({
    id: "actions",
    label: "Row Actions",
    header: "Action",
    cell: RowActions,
  }),
];
