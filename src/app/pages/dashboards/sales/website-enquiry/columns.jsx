// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";
import { RowActions } from "./RowActions";
import { DateCell, HighlightingCell } from "./rows";

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor("id", {
    id: "id",
    header: () => <div className="text-center">No.</div>,
    cell: (info) => <div className="text-center text-sm"><HighlightingCell {...info} /></div>,
  }),
  columnHelper.accessor("added_on", {
    id: "added_on",
    header: () => <div className="text-center text-sm">Date</div>,
    cell: (info) => <div className="text-center text-sm"><DateCell {...info} /></div>,
  }),
  columnHelper.accessor("name", {
    id: "name",
    header: "Name",
    cell: (info) => <div className="text-sm max-w-[120px] whitespace-normal break-words "><HighlightingCell {...info} /></div>,
  }),
  columnHelper.accessor("organization", {
    id: "organization",
    header: "Org.",
    cell: (info) => (
      <div className="text-sm max-w-[150px] whitespace-normal break-words font-medium text-gray-700">
        <HighlightingCell {...info} />
      </div>
    ),
  }),
  columnHelper.accessor("email", {
    id: "email",
    header: "Email",
    cell: (info) => (
      <div className="whitespace-nowrap italic text-gray-600">
        <HighlightingCell {...info} />
      </div>
    ),
  }),
  columnHelper.accessor("mobile", {
    id: "mobile",
    header: "Mobile",
    cell: (info) => <div className="text-center whitespace-nowrap"><HighlightingCell {...info} /></div>,
  }),
  columnHelper.accessor("message", {
    id: "message",
    header: () => <div className="text-center text-sm">Message</div>,
    cell: (info) => (
      <div className="flex justify-center">
        <p className="w-48 truncate text-sm font-medium text-gray-800 italic" title={info.getValue()}>
          {info.getValue() || "-"}
        </p>
      </div>
    ),
  }),
  columnHelper.accessor("status", {
    id: "status",
    header: () => <div className="text-center text-sm">Status</div>,
    cell: (info) => {
      const val = Number(info.getValue());
      let label = "New";
      let colorClass = "bg-blue-100 text-blue-800";

      if (val === 0) {
        label = "Pending";
        colorClass = "bg-yellow-100 text-yellow-800";
      } else if (val === 1) {
        label = "Converted";
        colorClass = "bg-green-100 text-green-800";
      } else if (val === 91) {
        label = "Closed";
        colorClass = "bg-red-100 text-red-800";
      }

      return (
        <div className="flex justify-center">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>
            {label}
          </span>
        </div>
      );
    },
  }),
  columnHelper.display({
    id: "actions",
    header: () => <div className="text-center text-sm">Action</div>,
    cell: (info) => <RowActions {...info} />,
  }),
];
