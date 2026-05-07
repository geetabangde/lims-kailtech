// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";


const columnHelper = createColumnHelper();

export const columns = [
  // PHP: Category
  columnHelper.accessor("category", {
    id: "category",
    header: "Category",
    cell: (info) => info.getValue(),
  }),

  // PHP: Product Name
  columnHelper.accessor("product_name", {
    id: "product_name",
    header: "Product Name",
    cell: (info) => info.getValue(),
  }),

  // PHP: ID no
  columnHelper.accessor("id_no", {
    id: "id_no",
    header: "ID no",
    cell: (info) => info.getValue(),
  }),

  // PHP: Location
  columnHelper.accessor("location", {
    id: "location",
    header: "Location",
    cell: (info) => info.getValue(),
  }),

  // PHP: Critical
  columnHelper.accessor("critical", {
    id: "critical",
    header: "Critical",
    cell: (info) => info.getValue(),
  }),

  // PHP: Batch no.
  columnHelper.accessor("batch_no", {
    id: "batch_no",
    header: "Batch no.",
    cell: (info) => info.getValue(),
  }),

  // PHP: Quantity
  columnHelper.accessor("quantity", {
    id: "quantity",
    header: "Quantity",
    cell: (info) => info.getValue(),
  }),
];
