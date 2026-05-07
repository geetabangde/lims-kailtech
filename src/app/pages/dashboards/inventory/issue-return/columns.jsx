import { createColumnHelper } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { Button } from "components/ui";

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row, index) => index + 1, {
    id: "srNo",
    header: "Sr No",
    cell: (info) => info.row.index + 1,
  }),
  columnHelper.accessor("gatpassnumber", {
    header: "Gate pass Number",
    cell: (info) => (
      <Link 
        to={`/dashboards/inventory/issue-return/print-gatepass?hakuna=${info.getValue()}`}
        className="text-primary-500 font-bold hover:underline"
      >
        {info.getValue()}
      </Link>
    ),
  }),
  columnHelper.accessor("basis", {
    header: "Basis",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("name", {
    header: "Instrument Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("idno", {
    header: "Instrument Code",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("qty", {
    header: "Qty",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("uname", {
    header: "Party Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("empid", {
    header: "Employee Code",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("remark", {
    header: "Remark",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("customer_name", {
    header: "Customer",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("added_on", {
    header: "Issue date",
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: "return",
    header: "Return",
    cell: (info) => {
      const row = info.row.original;
      if (row.status === "0" && row.basis === "Returnable") {
        return <span className="text-red-500 font-medium">Not Returned</span>;
      } else if (row.status === "1") {
        return (
          <div className="flex flex-col gap-1">
            <span className="text-xs">{row.returnby_name}</span>
            <span className="text-xs text-gray-500">{row.returnon}</span>
            <Button
              component={Link}
              to={`/dashboards/inventory/issue-return/view-checklist?hakuna=${row.gatpassnumber}`}
              color="info"
              variant="outline"
              size="xs"
              className="mt-1"
            >
              {"<< View Checklist"}
            </Button>
          </div>
        );
      } else if (row.status === "-1") {
        return <span className="text-yellow-600 italic">checklist pending</span>;
      } else if (row.basis !== "Returnable") {
        return <span className="text-gray-400 italic">Non Returnable</span>;
      }
      return null;
    },
  }),
];
