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
import { useThemeContext } from "app/contexts/theme/context";
import { getUserAgentBrowser } from "utils/dom/getUserAgentBrowser";

// ----------------------------------------------------------------------

const isSafari = getUserAgentBrowser() === "Safari";

export default function ProductTypeStock() {
  const { cardSkin } = useThemeContext();

  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch from API
  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    try {
      setLoading(true);
      // Guessing endpoint based on pattern, but should be verified.
      // Common pattern: inventory/product-type-stock-list
      const response = await axios.get("inventory/product-type-stock");

      if (response.data.status && Array.isArray(response.data.data)) {
        setStockData(response.data.data);
      } else {
        console.warn("Unexpected response structure:", response.data);
        setStockData([]);
      }
    } catch (err) {
      console.error("Error fetching stock data:", err);
      setStockData([]);
    } finally {
      setLoading(false);
    }
  };

  const [tableSettings, setTableSettings] = useState({
    enableFullScreen: false,
    enableRowDense: false,
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([{ id: "critical", desc: false }]); // order by quantity asc in PHP, but here we can set default sort

  const [columnVisibility, setColumnVisibility] = useLocalStorage(
    "column-visibility-stock-report",
    {}
  );

  const [columnPinning, setColumnPinning] = useLocalStorage(
    "column-pinning-stock-report",
    {}
  );

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 25,
  });

  const [autoResetPageIndex] = useSkipper();


  const table = useReactTable({
    data: stockData,
    columns: columns,
    state: {
      globalFilter,
      sorting,
      columnVisibility,
      columnPinning,
      tableSettings,
      pagination,
    },
    onPaginationChange: setPagination,


    meta: {
      setTableSettings,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
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

  useDidUpdate(() => table.resetRowSelection(), [stockData]);

  useLockScrollbar(tableSettings.enableFullScreen);

  if (loading) {
    return (
      <Page title="Product Type Stock">
        <div className="flex h-[60vh] items-center justify-center text-gray-600">
          <svg className="animate-spin h-6 w-6 mr-2 text-blue-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 000 8v4a8 8 0 01-8-8z"></path>
          </svg>
          Loading Stock Report...
        </div>
      </Page>
    );
  }

  return (
    <Page title="Product Type Stock">
      <div className="transition-content w-full pb-5">
        <div
          className={clsx(
            "flex h-full w-full flex-col",
            tableSettings.enableFullScreen &&
            "fixed inset-0 z-61 bg-white pt-3 dark:bg-dark-900"
          )}
        >
          <Toolbar table={table} />
          <div
            className={clsx(
              "transition-content flex grow flex-col pt-3",
              tableSettings.enableFullScreen
                ? "overflow-hidden"
                : "px-(--margin-x)"
            )}
          >
            <div className="flex items-center justify-between pb-3">
              <div className="text-sm text-gray-600 dark:text-dark-300">
                Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )}{" "}
                of {table.getFilteredRowModel().rows.length} entries
              </div>
            </div>
            <Card

              className={clsx(
                "relative flex grow flex-col",
                tableSettings.enableFullScreen && "overflow-hidden"
              )}
            >
              <div className="table-wrapper min-w-full grow overflow-x-auto">
                <Table
                  hoverable
                  dense={tableSettings.enableRowDense}
                  sticky={tableSettings.enableFullScreen}
                  className="w-full text-left rtl:text-right border-collapse"
                >
                  <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <Tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <Th
                            key={header.id}
                            className={clsx(
                              "bg-gray-200 font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100 first:ltr:rounded-tl-lg last:ltr:rounded-tr-lg border-r border-gray-300 dark:border-dark-600",
                              header.column.getCanPin() && [
                                header.column.getIsPinned() === "left" &&
                                "sticky z-2 ltr:left-0 rtl:right-0",
                                header.column.getIsPinned() === "right" &&
                                "sticky z-2 ltr:right-0 rtl:left-0",
                              ]
                            )}
                          >
                            <div
                              className={clsx(
                                "flex items-center space-x-3",
                                header.column.getCanSort() && "cursor-pointer select-none"
                              )}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              <span className="flex-1">
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                              </span>
                              {header.column.getCanSort() && (
                                <TableSortIcon
                                  sorted={header.column.getIsSorted()}
                                />
                              )}
                            </div>
                          </Th>
                        ))}
                      </Tr>
                    ))}
                  </THead>
                  <TBody>
                    {table.getRowModel().rows.map((row) => (
                      <Tr
                        key={row.id}
                        className={clsx(
                          "relative border-b border-gray-300 dark:border-b-dark-500",
                          row.getIsSelected() && !isSafari &&
                          "row-selected after:pointer-events-none after:absolute after:inset-0 after:z-2 after:h-full after:w-full after:border-3 after:border-transparent after:bg-primary-500/10 ltr:after:border-l-primary-500 rtl:after:border-r-primary-500"
                        )}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <Td
                            key={cell.id}
                            className={clsx(
                              "relative bg-white border-r border-gray-300 dark:border-dark-600",
                              cardSkin === "shadow"
                                ? "dark:bg-dark-700"
                                : "dark:bg-dark-900",
                              cell.column.getCanPin() && [
                                cell.column.getIsPinned() === "left" &&
                                "sticky z-2 ltr:left-0 rtl:right-0",
                                cell.column.getIsPinned() === "right" &&
                                "sticky z-2 ltr:right-0 rtl:left-0",
                              ]
                            )}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </Td>
                        ))}
                      </Tr>
                    ))}
                  </TBody>
                </Table>
              </div>
              <div className="px-4 pb-4 sm:px-5 sm:pt-4 pt-4">
                <PaginationSection table={table} />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Page>
  );
}
