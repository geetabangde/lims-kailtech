// Import Dependencies
import {
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { Button } from "components/ui";
import PropTypes from "prop-types";
import { toast } from "sonner";
import axios from "utils/axios";
import { useNavigate } from "react-router-dom";

// PHP: if (in_array(471, $permissions)) {
//    $a = '<a class="btn  btn-info" href="requestformLIMS_new.php?hakuna=' . $row['id'] . '" class="btn btn-blue">View Role Request</a>';
// }
function usePermissions() {
  const p = localStorage.getItem("userPermissions");
  try {
    return JSON.parse(p) || [];
  } catch {
    return p?.split(",").map(Number) || [];
  }
}

// ----------------------------------------------------------------------

export function RowActions({ row }) {
  const navigate = useNavigate();
  const roleRequestId = row.original.id;
  const permissions = usePermissions();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this role request?")) {
      try {
        await axios.post("/quality-documents/delete-role-request", { id: roleRequestId });
        toast.success("Role Request deleted successfully ✅");
        // Trigger table refresh via meta if needed
        row.table.options.meta?.refreshData();
      } catch (error) {
        console.log(error);
        toast.error("Failed to delete role request ❌");
      }
    }
  };

  const handleView = () => {
    navigate(`view/${roleRequestId}`);
  };

  return (
    <div className="flex items-center space-x-2">
      {/* View Role Request Button */}
      {/* PHP: if (in_array(471, $permissions)) {
         $a = '<a class="btn  btn-info" href="requestformLIMS_new.php?hakuna=' . $row['id'] . '" class="btn btn-blue">View Role Request</a>';
      } */}
      {permissions.includes(471) && (
        <Button
          variant="flat"
          className="size-8 p-0 text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-dark-600/50"
          onClick={handleView}
          title="View Role Request"
        >
          <EyeIcon className="size-4.5" />
        </Button>
      )}
      <Button
        variant="flat"
        className="size-8 p-0 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
        title="Edit"
      >
        <PencilSquareIcon className="size-4.5" />
      </Button>
      <Button
        variant="flat"
        className="size-8 p-0 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
        onClick={handleDelete}
        title="Delete"
      >
        <TrashIcon className="size-4.5" />
      </Button>
    </div>
  );
}

RowActions.propTypes = {
  row: PropTypes.object.isRequired,
};
