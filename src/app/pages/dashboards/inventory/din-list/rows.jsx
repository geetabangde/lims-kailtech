// Import Dependencies
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { Badge } from "components/ui";
import { dinStatusOptions } from "./data";

// ----------------------------------------------------------------------

export function StatusCell({ row }) {
  const statusValue = row.original.status;
  const option = dinStatusOptions.find((opt) => opt.value === parseInt(statusValue)) || {
    label: "Unknown",
    color: "secondary",
  };

  const isReturnable = row.original.basis === "Returnable";
  const isReturned = row.original.returned_count > 0; // Assuming the API returns returned_count

  return (
    <div className="flex flex-col gap-1">
      <Badge color={option.color} variant="soft">
        {option.label}
      </Badge>
      {isReturnable && isReturned && (
        <a
          href={`/dashboards/inventory/din-list/dispatch-return-record?hakuna=${row.original.id}`}
          className="text-[10px] font-semibold text-primary-600 hover:underline"
        >
          (Returned)
        </a>
      )}
    </div>
  );
}

export function DateCell({ getValue }) {
  const date = getValue();
  return <span>{date ? dayjs(date).format("DD/MM/YYYY") : "N/A"}</span>;
}

export function CustomerCell({ row }) {
  const customerName = row.original.customer_name || "N/A";
  const customerAddress = row.original.customer_address || "";

  return (
    <div className="flex flex-col">
      <span className="font-semibold text-gray-800 dark:text-dark-100">
        {customerName}
      </span>
      {customerAddress && (
        <span className="text-xs text-gray-500 dark:text-dark-400">
          {customerAddress}
        </span>
      )}
    </div>
  );
}

export function ConcernPersonCell({ row }) {
  const {
    concern_person,
    concern_person_designation,
    concern_person_email,
    concern_person_phone
  } = row.original;

  return (
    <div className="flex flex-col text-xs space-y-0.5">
      <span className="font-medium text-gray-800 dark:text-dark-100">{concern_person}</span>
      {concern_person_designation && <span className="text-gray-500">{concern_person_designation}</span>}
      {concern_person_email && <span className="text-gray-500 italic">{concern_person_email}</span>}
      {concern_person_phone && <span className="text-gray-500 font-mono">{concern_person_phone}</span>}
    </div>
  );
}

export function AddedByCell({ getValue }) {
  return <span className="text-sm font-medium">{getValue() || "N/A"}</span>;
}

StatusCell.propTypes = {
  row: PropTypes.object.isRequired,
};

DateCell.propTypes = {
  getValue: PropTypes.func.isRequired,
};

CustomerCell.propTypes = {
  row: PropTypes.object.isRequired,
};

ConcernPersonCell.propTypes = {
  row: PropTypes.object.isRequired,
};

AddedByCell.propTypes = {
  getValue: PropTypes.func.isRequired,
};
