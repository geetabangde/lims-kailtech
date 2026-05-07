// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper();

const safeRender = (val) => {
  if (val === undefined || val === null || val === "" || val === "0000-00-00 00:00" || val === "0000-00-00") return "-";
  if (typeof val === "string" && (val.includes("<div") || val.includes("<br"))) {
    return <div dangerouslySetInnerHTML={{ __html: val }} />;
  }
  return val;
};

const formatDate = (val) => {
  if (!val || val === "0000-00-00") return "-";
  try {
    const date = new Date(val);
    if (isNaN(date.getTime())) return val;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear());
    return `${day}-${month}-${year}`;
  } catch {
    return val;
  }
};

export const columns = [
  columnHelper.accessor("sno", {
    id: "sno",
    header: "Sr. No",
    cell: (info) => safeRender(info.getValue()),
  }),
  columnHelper.accessor("name", {
    id: "name",
    header: "Name of Reference Material",
    cell: (info) => safeRender(info.getValue()),
  }),
  columnHelper.accessor("code_no", {
    id: "code_no",
    header: "Code No.",
    cell: (info) => safeRender(info.getValue()),
  }),
  columnHelper.accessor("batch_no", {
    id: "batch_no",
    header: "Batch no",
    cell: (info) => safeRender(info.getValue()),
  }),
  columnHelper.accessor("source", {
    id: "source",
    header: "Source",
    cell: (info) => safeRender(info.getValue()),
  }),
  columnHelper.accessor("valid_up_to", {
    id: "valid_up_to",
    header: "Valid UpTo",
    cell: (info) => formatDate(info.getValue()),
  }),
  columnHelper.display({
    id: "traceability",
    header: "Traceability",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <a
          href={`/dashboards/registers/consumablelogequipment/${row.original.id}`}
          className="btn btn-info btn-sm"
        >
          View Logbook
        </a>
        <a
          href={`/dashboards/registers/consumablelogcrmwise/${row.original.id}`}
          className="btn btn-info btn-sm"
        >
          View Logbook 1
        </a>
      </div>
    ),
  }),
];
