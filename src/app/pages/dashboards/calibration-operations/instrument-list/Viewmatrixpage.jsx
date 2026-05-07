import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "utils/axios";
import { Button } from "components/ui";
import { ConfirmModal } from "components/shared/ConfirmModal";

const confirmMessages = {
  pending: {
    description:
      "Are you sure you want to delete this calibration point? Once deleted, it cannot be restored.",
  },
  success: {
    title: "Calibration Point Deleted",
  },
};

export default function ViewMatrixPage() {
  const { instrumentId, priceId } = useParams();
  const navigate = useNavigate();
  const permissions = JSON.parse(localStorage.getItem("userPermissions") || "[]");

  useEffect(() => {
    if (!permissions.includes(87)) {
      navigate("/dashboards");
    }
  }, [navigate, permissions]);
  
  const [matrixData, setMatrixData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(25);
  
  // Search states
  const [searchFilters, setSearchFilters] = useState({
    id: "",
    unittype: "",
    mode: "",
    unit: "",
    instrumentRange: "",
  });

  // Global search
  const [globalSearch, setGlobalSearch] = useState("");

  // Delete modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const [selectedMatrixId, setSelectedMatrixId] = useState(null);

  const fetchMatrixData = useCallback(async () => {
    if (!instrumentId || !priceId) return;
    
    setLoading(true);
    try {
      const response = await axios.get(
        `/calibrationoperations/get-matrix-byid/${instrumentId}/${priceId}`
      );
      
      if (response.data.status) {
        setMatrixData(response.data.data || []);
        setFilteredData(response.data.data || []);
      } else {
        toast.error("Failed to fetch matrix data");
        setMatrixData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Error fetching matrix data:", error);
      toast.error("Error loading matrix data");
      setMatrixData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  }, [instrumentId, priceId]);

  const filterData = useCallback(() => {
    let filtered = [...matrixData];

    // Apply column filters
    Object.keys(searchFilters).forEach((key) => {
      const searchValue = searchFilters[key].toLowerCase().trim();
      if (searchValue) {
        filtered = filtered.filter((item) => {
          let itemValue = "";
          
          switch (key) {
            case "id":
              itemValue = String(item.id || "");
              break;
            case "unittype":
              itemValue = String(item.unittype || "");
              break;
            case "mode":
              itemValue = String(item.mode || "");
              break;
            case "unit":
              itemValue = String(item.unit || "");
              break;
            case "instrumentRange":
              itemValue = String(item.instrangemin || "") + " to " + String(item.instrangemax || "");
              break;
            default:
              itemValue = "";
          }
          
          return itemValue.toLowerCase().includes(searchValue);
        });
      }
    });

    // Apply global search
    if (globalSearch.trim()) {
      const search = globalSearch.toLowerCase().trim();
      filtered = filtered.filter((item) => {
        return (
          String(item.id || "").toLowerCase().includes(search) ||
          String(item.unittype || "").toLowerCase().includes(search) ||
          String(item.mode || "").toLowerCase().includes(search) ||
          String(item.unit || "").toLowerCase().includes(search) ||
          String(item.instrangemin || "").toLowerCase().includes(search) ||
          String(item.instrangemax || "").toLowerCase().includes(search)
        );
      });
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [matrixData, searchFilters, globalSearch]);

  useEffect(() => {
    fetchMatrixData();
  }, [fetchMatrixData]);

  useEffect(() => {
    filterData();
  }, [filterData]);

  const handleSearchChange = (field, value) => {
    setSearchFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  

  const handleViewCalibPoints = (matrixId) => {
    // Navigate to calibration points page with priceId and matrixId
    navigate(`/dashboards/calibration-operations/instrument-list/view-calib-points/${priceId}/${matrixId}`);
  };

  const openDeleteModal = (matrixId) => {
    setSelectedMatrixId(matrixId);
    setDeleteModalOpen(true);
    setDeleteError(false);
    setDeleteSuccess(false);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedMatrixId(null);
  };

  const handleDelete = async () => {
    if (!selectedMatrixId) return;

    setConfirmDeleteLoading(true);
    try {
      // Using the correct endpoint format with priceId and matrixId
      await axios.delete(
        `/calibrationoperations/delete-matrix-calibpoint/${priceId}/${selectedMatrixId}`
      );
      
      setDeleteSuccess(true);
      toast.success("Calibration matrix deleted successfully ✅", {
        duration: 1000,
        icon: "🗑️",
      });
      
      setMatrixData((prev) => prev.filter((item) => item.id !== selectedMatrixId));
      
      setTimeout(() => {
        closeDeleteModal();
      }, 1000);
    } catch (error) {
      console.error("Delete failed:", error);
      setDeleteError(true);
      toast.error("Failed to delete calibration matrix ❌", {
        duration: 2000,
      });
    } finally {
      setConfirmDeleteLoading(false);
    }
  };

  const deleteState = deleteError ? "error" : deleteSuccess ? "success" : "pending";

  // Pagination calculations
  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, totalEntries);
  const currentEntries = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6">
      

      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
        <Button
          variant="outline"
          className="bg-blue-600 text-white hover:bg-blue-700"
          onClick={() =>
            navigate(`/dashboards/calibration-operations/instrument-list/view-prices/${instrumentId}`)
          }
        >
          Back to List
        </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-dark-100">
              Calibration Matrix
            </h1>
          </div>
        </div>
      </div>

      {/* Stats and Search Bar */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-dark-300">
          Showing {totalEntries > 0 ? startIndex + 1 : 0} to {endIndex} of {totalEntries} entries
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-dark-300">Search:</span>
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search..."
            className="w-64 rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none dark:border-dark-500 dark:bg-dark-700 dark:text-dark-100"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded border border-gray-300 bg-white shadow-sm dark:border-dark-500 dark:bg-dark-750">
        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="flex items-center gap-2">
              <svg
                className="h-6 w-6 animate-spin text-blue-600"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 000 8v4a8 8 0 01-8-8z"
                ></path>
              </svg>
              <span className="text-gray-600 dark:text-dark-300">
                Loading matrix data...
              </span>
            </div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-300 dark:divide-dark-500">
            <thead className="bg-gray-50 dark:bg-dark-700">
              <tr>
                <th className="border-r border-gray-300 px-4 py-3 text-left text-xs font-medium text-gray-700 dark:border-dark-500 dark:text-dark-200">
                  ID ▼
                </th>
                <th className="border-r border-gray-300 px-4 py-3 text-left text-xs font-medium text-gray-700 dark:border-dark-500 dark:text-dark-200">
                  Parameter ^
                </th>
                <th className="border-r border-gray-300 px-4 py-3 text-left text-xs font-medium text-gray-700 dark:border-dark-500 dark:text-dark-200">
                  Mode ^
                </th>
                <th className="border-r border-gray-300 px-4 py-3 text-left text-xs font-medium text-gray-700 dark:border-dark-500 dark:text-dark-200">
                  Unit ^
                </th>
                <th className="border-r border-gray-300 px-4 py-3 text-left text-xs font-medium text-gray-700 dark:border-dark-500 dark:text-dark-200">
                  Instrument range ^
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-dark-200">
                  Actions ^
                </th>
              </tr>
              {/* Search Row */}
              <tr className="bg-white dark:bg-dark-750">
                <td className="border-r border-gray-300 px-2 py-2 dark:border-dark-500">
                  <input
                    type="text"
                    placeholder="Search ID"
                    value={searchFilters.id}
                    onChange={(e) => handleSearchChange("id", e.target.value)}
                    className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none dark:border-dark-500 dark:bg-dark-700 dark:text-dark-100"
                  />
                </td>
                <td className="border-r border-gray-300 px-2 py-2 dark:border-dark-500">
                  <input
                    type="text"
                    placeholder="Search Param"
                    value={searchFilters.unittype}
                    onChange={(e) => handleSearchChange("unittype", e.target.value)}
                    className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none dark:border-dark-500 dark:bg-dark-700 dark:text-dark-100"
                  />
                </td>
                <td className="border-r border-gray-300 px-2 py-2 dark:border-dark-500">
                  <input
                    type="text"
                    placeholder="Search Mode"
                    value={searchFilters.mode}
                    onChange={(e) => handleSearchChange("mode", e.target.value)}
                    className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none dark:border-dark-500 dark:bg-dark-700 dark:text-dark-100"
                  />
                </td>
                <td className="border-r border-gray-300 px-2 py-2 dark:border-dark-500">
                  <input
                    type="text"
                    placeholder="Search Unit"
                    value={searchFilters.unit}
                    onChange={(e) => handleSearchChange("unit", e.target.value)}
                    className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none dark:border-dark-500 dark:bg-dark-700 dark:text-dark-100"
                  />
                </td>
                <td className="border-r border-gray-300 px-2 py-2 dark:border-dark-500">
                  <input
                    type="text"
                    placeholder="Search Instru"
                    value={searchFilters.instrumentRange}
                    onChange={(e) => handleSearchChange("instrumentRange", e.target.value)}
                    className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none dark:border-dark-500 dark:bg-dark-700 dark:text-dark-100"
                  />
                </td>
                <td className="px-2 py-2">
                  <input
                    type="text"
                    placeholder="Search Action"
                    disabled
                    className="w-full rounded border border-gray-300 px-2 py-1 text-sm opacity-50 dark:border-dark-500 dark:bg-dark-700 dark:text-dark-100"
                  />
                </td>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 bg-white dark:divide-dark-500 dark:bg-dark-750">
              {currentEntries.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-8 text-center text-sm text-gray-500 dark:text-dark-400"
                  >
                    No matrix data available
                  </td>
                </tr>
              ) : (
                currentEntries.map((matrix) => (
                  <tr
                    key={matrix.id}
                    className="hover:bg-gray-50 dark:hover:bg-dark-700"
                  >
                    <td className="border-r border-gray-300 px-4 py-3 text-sm text-gray-900 dark:border-dark-500 dark:text-dark-100">
                      {matrix.id}
                    </td>
                    <td className="border-r border-gray-300 px-4 py-3 text-sm text-gray-900 dark:border-dark-500 dark:text-dark-100">
                      {matrix.unittype || "N/A"}
                    </td>
                    <td className="border-r border-gray-300 px-4 py-3 text-sm text-gray-600 dark:border-dark-500 dark:text-dark-300">
                      {matrix.mode || ""}
                    </td>
                    <td className="border-r border-gray-300 px-4 py-3 text-sm text-gray-900 dark:border-dark-500 dark:text-dark-100">
                      {matrix.unit || "N/A"}
                    </td>
                    <td className="border-r border-gray-300 px-4 py-3 text-sm text-gray-900 dark:border-dark-500 dark:text-dark-100">
                      {matrix.instrangemin && matrix.instrangemax
                        ? `${matrix.instrangemin} to ${matrix.instrangemax}`
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewCalibPoints(matrix.id)}
                          className="rounded bg-orange-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                        >
                          View Calib Points
                        </button>
                        {permissions.includes(90) && (
                          <button
                            onClick={() => openDeleteModal(matrix.id)}
                            className="rounded bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          >
                            delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="mt-4 flex items-center justify-between">
        {/* Show entries selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-dark-300">Show</span>
          <select
            value={entriesPerPage}
            onChange={(e) => {
              setEntriesPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none dark:border-dark-500 dark:bg-dark-700 dark:text-dark-100"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-gray-600 dark:text-dark-300">entries</span>
        </div>

        {/* Pagination buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-500 dark:text-dark-300 dark:hover:bg-dark-700"
          >
            First
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-500 dark:text-dark-300 dark:hover:bg-dark-700"
          >
            Previous
          </button>
          
          {/* Page numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`rounded border px-3 py-1 text-sm ${
                  currentPage === pageNum
                    ? "border-blue-500 bg-blue-500 text-white"
                    : "border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-dark-500 dark:text-dark-300 dark:hover:bg-dark-700"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-500 dark:text-dark-300 dark:hover:bg-dark-700"
          >
            Next
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-500 dark:text-dark-300 dark:hover:bg-dark-700"
          >
            Last
          </button>
        </div>
      </div>

      <ConfirmModal
        show={deleteModalOpen}
        onClose={closeDeleteModal}
        messages={confirmMessages}
        onOk={handleDelete}
        confirmLoading={confirmDeleteLoading}
        state={deleteState}
      />
    </div>
  );
}