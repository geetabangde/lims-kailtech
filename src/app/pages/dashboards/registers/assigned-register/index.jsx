// Import Dependencies
import {
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "utils/axios";

// Local Imports
import { Table, Card, THead, TBody, Th, Tr, Td } from "components/ui";
import { TableSortIcon } from "components/shared/table/TableSortIcon";
import { Page } from "components/shared/Page";
import { useLockScrollbar, useDidUpdate, useLocalStorage } from "hooks";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
import { useSkipper } from "utils/react-table/useSkipper";
import { Toolbar } from "./Toolbar";
import { columns } from "./columns";
import { PaginationSection } from "components/shared/table/PaginationSection";
import { SelectedRowsActions } from "./SelectedRowsActions";
import { useThemeContext } from "app/contexts/theme/context";
import { getUserAgentBrowser } from "utils/dom/getUserAgentBrowser";

// ----------------------------------------------------------------------

const isSafari = getUserAgentBrowser() === "Safari";

export default function AssignedRegister() {
  const { cardSkin } = useThemeContext();
  const navigate = useNavigate();
  const permissions = JSON.parse(localStorage.getItem("userPermissions") || "[]");

  useEffect(() => {
    if (!permissions.includes(156)) {
      navigate("/dashboards");
    }
  }, [navigate, permissions]);

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startdate: "",
    enddate: "",
    chemist: "",
  });
  const [searched, setSearched] = useState(false);
  const [chemists, setChemists] = useState([]);

  const fetchRegisterData = async () => {
    if (!filters.startdate || !filters.enddate) return;
    try {
      setLoading(true);
      setSearched(true);
      // Adjust the endpoint to match your actual backend API route
      const res = await axios.get("/registers/get-assigned-register", { params: filters });
      
      let rows = res.data?.data || [];
      
      // Handle legacy PHP DataTables response (array of arrays) or modern object response
      if (rows.length > 0 && Array.isArray(rows[0])) {
        rows = rows.map((r, i) => ({
          sr_no: r[0] || i + 1,
          lrn: r[1],
          assigned_person: r[2],
          assign_date: r[3],
          start_date: r[4],
          end_date: r[5],
          performance_timing: r[6],
          performance_timing_assigned: r[7],
          tat: r[8],
        }));
      } else {
        rows = rows.map((r, i) => ({
          ...r,
          sr_no: r.sr_no || i + 1,
          lrn: r.lrn || r.LRN,
          assigned_person: r.assigned_person || r.chemist,
          assign_date: r.assign_date || r.allotmentdate,
          start_date: r.start_date || r.startdate,
          end_date: r.end_date || r.enddate,
          tat: r.tat || r.tat_days,
        }));
      }
      
      setTableData(rows);
    } catch (err) {
      console.error("Error fetching assigned register data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    try {
      // Adjust the endpoint to match the chemist list API route
      // Defaulting to /people/get-all-users if the specific endpoint isn't ready
      const res = await axios.get("/people/get-all-users");
      setChemists(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching metadata:", err);
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e?.preventDefault?.();
    fetchRegisterData();
  };

  const [tableSettings, setTableSettings] = useState({
    enableFullScreen: false,
    enableRowDense: false,
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);

  const [columnVisibility, setColumnVisibility] = useLocalStorage(
    "column-visibility-assigned-register-1",
    {},
  );

  const [columnPinning, setColumnPinning] = useLocalStorage(
    "column-pinning-assigned-register-1",
    {},
  );

  const [autoResetPageIndex] = useSkipper();

  const table = useReactTable({
    data: tableData,
    columns: columns,
    state: {
      globalFilter,
      sorting,
      columnVisibility,
      columnPinning,
      tableSettings,
    },
    meta: {
      setTableSettings
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    enableSorting: tableSettings.enableSorting,
    enableColumnFilters: tableSettings.enableColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,

    autoResetPageIndex,
  });

  useDidUpdate(() => table.resetRowSelection(), [tableData]);
  useLockScrollbar(tableSettings.enableFullScreen);

  const visibleColumns = table.getVisibleLeafColumns();

  // ─── Shared UI components ──────────────────────────────────────────────────
  function PageSpinner() {
    return (
      <div className="flex h-[60vh] items-center justify-center gap-3 text-gray-500">
        <svg className="h-7 w-7 animate-spin text-blue-500" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 000 8v4a8 8 0 01-8-8z" />
        </svg>
        Loading...
      </div>
    );
  }

  // ✅ Loading UI
  if (loading) {
    return (
      <Page title="Assigned Register">
        <PageSpinner />
      </Page>
    );
  }

  return (
    <Page title="Assigned Register">
      <div className="transition-content w-full pb-5">
        <div
          className={clsx(
            "flex h-full w-full flex-col",
            tableSettings.enableFullScreen &&
            "fixed inset-0 z-61 bg-white pt-3 dark:bg-dark-900",
          )}
        >
          <Toolbar
            filters={filters}
            onChange={handleFilterChange}
            onSearch={handleSearch}
            chemists={chemists}
          />
          <div
            className={clsx(
              "transition-content flex grow flex-col pt-3",
              tableSettings.enableFullScreen
                ? "overflow-hidden"
                : "px-(--margin-x)",
            )}
          >
            <Card
              className={clsx(
                "relative flex grow flex-col",
                tableSettings.enableFullScreen && "overflow-hidden",
              )}
            >
              <div className="table-wrapper min-w-full grow overflow-x-auto">
                <Table
                  hoverable
                  dense={tableSettings.enableRowDense}
                  sticky={tableSettings.enableFullScreen}
                  className="w-full text-left rtl:text-right"
                >
                  <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <Tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <Th
                            key={header.id}
                            className={clsx(
                              "bg-gray-200 font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100 first:ltr:rounded-tl-lg last:ltr:rounded-tr-lg first:rtl:rounded-tr-lg last:rtl:rounded-tl-lg",
                              header.column.getCanPin() && [
                                header.column.getIsPinned() === "left" &&
                                "sticky z-2 ltr:left-0 rtl:right-0",
                                header.column.getIsPinned() === "right" &&
                                "sticky z-2 ltr:right-0 rtl:left-0",
                              ],
                            )}
                          >
                            {header.column.getCanSort() ? (
                              <div
                                className="flex cursor-pointer select-none items-center space-x-3 "
                                onClick={header.column.getToggleSortingHandler()}
                              >
                                <span className="flex-1">
                                  {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext(),
                                    )}
                                </span>
                                <TableSortIcon
                                  sorted={header.column.getIsSorted()}
                                />
                              </div>
                            ) : header.isPlaceholder ? null : (
                              flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )
                            )}
                          </Th>
                        ))}
                      </Tr>
                    ))}
                  </THead>
                  <TBody>
                    {table.getRowModel().rows.map((row) => {
                      return (
                        <Tr
                          key={row.id}
                          className={clsx(
                            "relative border-y border-transparent border-b-gray-200 dark:border-b-dark-500",
                            row.getIsSelected() && !isSafari &&
                            "row-selected after:pointer-events-none after:absolute after:inset-0 after:z-2 after:h-full after:w-full after:border-3 after:border-transparent after:bg-primary-500/10 ltr:after:border-l-primary-500 rtl:after:border-r-primary-500",
                          )}
                        >
                          {row.getVisibleCells().map((cell) => {
                            return (
                              <Td
                                key={cell.id}
                                className={clsx(
                                  "relative bg-white",
                                  cardSkin === "shadow"
                                    ? "dark:bg-dark-700"
                                    : "dark:bg-dark-900",
                                  cell.column.getCanPin() && [
                                    cell.column.getIsPinned() === "left" &&
                                    "sticky z-2 ltr:left-0 rtl:right-0",
                                    cell.column.getIsPinned() === "right" &&
                                    "sticky z-2 ltr:right-0 rtl:left-0",
                                  ],
                                )}
                              >
                                {cell.column.getIsPinned() && (
                                  <div
                                    className={clsx(
                                      "pointer-events-none absolute inset-0 border-gray-200 dark:border-dark-500",
                                      cell.column.getIsPinned() === "left"
                                        ? "ltr:border-r rtl:border-l"
                                        : "ltr:border-l rtl:border-r",
                                    )}
                                  ></div>
                                )}
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext(),
                                )}
                              </Td>
                            );
                          })}
                        </Tr>
                      );
                    })}
                    {searched && tableData.length === 0 && !loading && (
                      <Tr>
                        <Td colSpan={visibleColumns.length} className="py-10 text-center text-gray-500">
                          No data found for the selected criteria.
                        </Td>
                      </Tr>
                    )}
                    {!searched && (
                      <Tr>
                        <Td colSpan={visibleColumns.length} className="py-10 text-center text-gray-500">
                          Select a date range and click Search to view the Assigned Register.
                        </Td>
                      </Tr>
                    )}
                  </TBody>
                </Table>
              </div>
              <SelectedRowsActions table={table} />
              {table.getCoreRowModel().rows.length > 0 && (
                <div
                  className={clsx(
                    "px-4 pb-4 sm:px-5 sm:pt-4",
                    tableSettings.enableFullScreen &&
                    "bg-gray-50 dark:bg-dark-800",
                    !(
                      table.getIsSomeRowsSelected() ||
                      table.getIsAllRowsSelected()
                    ) && "pt-4",
                  )}
                >
                  <PaginationSection table={table} />
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Page>
  );
}
