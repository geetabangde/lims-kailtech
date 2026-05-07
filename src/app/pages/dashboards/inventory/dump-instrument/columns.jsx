import { createColumnHelper } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { Button } from "components/ui";

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor("id", {
    header: "Id",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("instrument_name", {
    header: "Instrument Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("id_number", {
    header: "ID Number",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("serial_no", {
    header: "Serial No.",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("instrument_type", {
    header: "Instrument Type",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("location", {
    header: "Location",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("reason", {
    header: "Reason For Dumping",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("quantity", {
    header: "Quantity",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("added_on", {
    header: "Added On",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => {
      const status = info.getValue();
      return (
        <span className={`px-2 py-1 rounded text-xs font-bold ${
          status === "Approved" ? "bg-green-100 text-green-700" : 
          status === "Rejected" ? "bg-red-100 text-red-700" : 
          "bg-yellow-100 text-yellow-700"
        }`}>
          {status}
        </span>
      );
    },
  }),
  columnHelper.display({
    id: "actions",
    header: "Action",
    cell: (info) => {
      const id = info.row.original.id;
      return (
        <div className="flex gap-2">
          <Button
            component={Link}
            to={`/dashboards/inventory/dump-instrument/approve?hakuna=${id}&matata=1`}
            color="success"
            variant="soft"
            size="xs"
          >
            Approve
          </Button>
          <Button
            component={Link}
            to={`/dashboards/inventory/dump-instrument/approve?hakuna=${id}&matata=2`}
            color="error"
            variant="soft"
            size="xs"
          >
            Reject
          </Button>
        </div>
      );
    },
  }),
];
