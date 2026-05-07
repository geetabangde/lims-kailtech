// Import Dependencies
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import axios from "utils/axios";
import { toast } from "sonner";
import Select from "react-select";

// Local Imports
import { Page } from "components/shared/Page";
import { Card } from "components/ui";
import { Button } from "components/ui";
import { useThemeContext } from "app/contexts/theme/context";

// ----------------------------------------------------------------------

export default function Chemists() {
  const navigate = useNavigate();
  const { cardSkin } = useThemeContext();
  const permissions = JSON.parse(localStorage.getItem("userPermissions") || "[]");

  // State management
  const [chemists, setChemists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startdate: "",
    enddate: "",
    chemist: "",
  });

  // Fetch chemists from admin list (status=1)
  const fetchChemists = useCallback(async () => {
    try {
      const res = await axios.get("/people/get-admin-users", { 
        params: { status: 1 } 
      });
      setChemists(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching chemists:", err);
      toast.error("Failed to load chemists");
    }
  }, []);

  // Fetch chemists data with filters
  const fetchChemistsData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Build query parameters based on PHP logic
      const params = { status: 1 };
      if (filters.startdate) params.startdate = filters.startdate;
      if (filters.enddate) params.enddate = filters.enddate;
      if (filters.chemist) params.chemist = filters.chemist;

      const res = await axios.get("/people/get-admin-users", { params });
      setChemists(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching chemists:", err);
      toast.error("Failed to load chemists");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Initial load
  useEffect(() => {
    fetchChemists();
  }, []);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e?.preventDefault?.();
    fetchChemistsData();
  };

  if (loading) {
    return (
      <Page title="Chemists List">
        <div className="flex h-[60vh] items-center justify-center gap-3 text-gray-500">
          <svg className="h-7 w-7 animate-spin text-blue-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 000 8v4a8 8 0 01-8-8z" />
          </svg>
          Loading chemists...
        </div>
      </Page>
    );
  }

  return (
    <Page title="Chemists List">
      <div className="transition-content w-full pb-5">
        <div className="px-(--margin-x) pt-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold tracking-wide text-gray-800 dark:text-dark-50">
              Chemist List
            </h2>
          </div>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            {/* Start Date */}
            <div className="w-full">
              <label className="dark:text-dark-300 mb-1 block text-sm font-medium text-gray-600">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startdate}
                onChange={(e) => handleFilterChange("startdate", e.target.value)}
                className="h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-dark-500 dark:bg-dark-800 dark:text-dark-100"
              />
            </div>

            {/* End Date */}
            <div className="w-full">
              <label className="dark:text-dark-300 mb-1 block text-sm font-medium text-gray-600">
                End Date
              </label>
              <input
                type="date"
                value={filters.enddate}
                onChange={(e) => handleFilterChange("enddate", e.target.value)}
                className="h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-dark-500 dark:bg-dark-800 dark:text-dark-100"
              />
            </div>

            {/* Chemist Select */}
            <div className="w-full">
              <label className="dark:text-dark-300 mb-1 block text-sm font-medium text-gray-600">
                Select Chemist
              </label>
              <Select
                options={chemists.map((c) => ({
                  value: String(c.id),
                  label: `${c.firstname || ""} ${c.lastname || ""}`.trim() || c.name || String(c.id),
                }))}
                value={
                  filters.chemist
                    ? {
                        value: String(filters.chemist),
                        label: (() => {
                          const found = chemists.find((c) => String(c.id) === String(filters.chemist));
                          return found
                            ? `${found.firstname || ""} ${found.lastname || ""}`.trim() || found.name
                            : String(filters.chemist);
                        })(),
                      }
                    : null
                }
                onChange={(option) => handleFilterChange("chemist", option ? option.value : "")}
                isClearable
                isSearchable
                placeholder="Select Chemist"
                className="w-full text-sm"
              />
            </div>

            {/* Search Button */}
            <div className="w-full">
              <button
                type="submit"
                className="h-10 rounded bg-green-600 px-6 text-sm font-medium text-white hover:bg-green-700"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Data Table */}
        <div className="mt-6">
          <Card
            className={clsx(
              "relative flex grow flex-col",
              cardSkin === "shadow" && "shadow-lg"
            )}
          >
            <div className="table-wrapper min-w-full grow overflow-x-auto">
              <table className="w-full text-left">
                <thead className="dark:bg-dark-800 dark:text-dark-100">
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:bg-transparent dark:text-gray-400">
                      S. No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:bg-transparent dark:text-gray-400">
                      p. No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:bg-transparent dark:text-gray-400">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:bg-transparent dark:text-gray-400">
                      LRN
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:bg-transparent dark:text-gray-400">
                      Parameter
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:bg-transparent dark:text-gray-400">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:bg-transparent dark:text-gray-400">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:bg-transparent dark:text-gray-400">
                      Chemist
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:bg-transparent dark:text-gray-400">
                      Assigned Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:bg-transparent dark:text-gray-400">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:bg-transparent dark:text-gray-400">
                      Start Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:bg-transparent dark:text-gray-400">
                      End Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:bg-transparent dark:text-gray-400">
                      TAT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:bg-transparent dark:text-gray-400">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="dark:bg-dark-700 dark:text-dark-100 divide-y divide-gray-200 dark:divide-gray-600">
                  {loading ? (
                    <tr>
                      <td colSpan={13} className="py-10 text-center text-gray-500">
                        <div className="flex items-center justify-center gap-3">
                          <svg className="h-6 w-6 animate-spin text-blue-500" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 000 8v4a8 8 0 01-8-8z" />
                          </svg>
                          Loading chemists data...
                        </div>
                      </td>
                    </tr>
                  ) : chemists.length === 0 ? (
                    <tr>
                      <td colSpan={13} className="py-10 text-center text-gray-500">
                        No chemists found for the selected criteria.
                      </td>
                    </tr>
                  ) : (
                    chemists.map((chemist, index) => (
                      <tr key={chemist.id} className="border-b border-gray-200 dark:border-dark-600">
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-dark-100">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-dark-100">
                          {chemist.product || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-dark-100">
                          {chemist.lrn || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-dark-100">
                          {chemist.brand_source || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-dark-100">
                          {chemist.grade_size || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-dark-100">
                          {chemist.parameters || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-dark-100">
                          {chemist.chemist || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-dark-100">
                          {chemist.assigned_date || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-dark-100">
                          {chemist.due_date || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-dark-100">
                          {chemist.start_date || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-dark-100">
                          {chemist.end_date || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-dark-100">
                          {chemist.tat || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-dark-100">
                          {/* Action buttons would go here */}
                          <div className="flex gap-2">
                            <button
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                              onClick={() => console.log("View action for chemist:", chemist)}
                            >
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
}