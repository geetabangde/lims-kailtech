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
import { PaginationSection } from "components/shared/table/PaginationSection";
import { useThemeContext } from "app/contexts/theme/context";
import { getUserAgentBrowser } from "utils/dom/getUserAgentBrowser";

const isSafari = getUserAgentBrowser() === "Safari";

export default function SampleInwardRegister() {
  const { cardSkin } = useThemeContext();
  const navigate = useNavigate();
  const permissions = JSON.parse(localStorage.getItem("userPermissions") || "[]");

  useEffect(() => {
    // Permission 161 as per PHP code: if(!in_array(161, $permissions)){ header("location:index.php"); }
    if (!permissions.includes(161)) {
      navigate("/dashboards");
    }
  }, [navigate, permissions]);

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  
  // Complex filters matching PHP code
  const [filters, setFilters] = useState({
    startdate: "",
    enddate: "",
    department: "",
    product: "",
    contactperson: "",
    specificpurpose: "",
  });

  const [departments, setDepartments] = useState([]);
  const [products, setProducts] = useState([]);
  const [specificPurposes, setSpecificPurposes] = useState([]);

  // Fetch dropdown data
  const fetchDropdownData = async () => {
    try {
      const [deptRes, prodRes, specificRes] = await Promise.allSettled([
        axios.get("/master/get-all-labs"), // Departments (labs)
        axios.get("/master/get-all-products"), // Products
        axios.get("/master/get-all-specific-purposes"), // Specific purposes
      ]);

      if (deptRes.status === "fulfilled") setDepartments(deptRes.value.data?.data || []);
      if (prodRes.status === "fulfilled") setProducts(prodRes.value.data?.data || []);
      if (specificRes.status === "fulfilled") setSpecificPurposes(specificRes.value.data?.data || []);
    } catch (err) {
      console.error("Error fetching dropdown data:", err);
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  // Fetch sample inward data using PHP endpoint
  const fetchSampleInwardData = async () => {
    try {
      setLoading(true);
      setSearched(true);
      
      // Use bisinwardregisterData.php endpoint matching PHP ajax URL
      const res = await axios.get("/registers/bisinwardregisterData", { params: filters });
      
      // Handle DataTables server-side response format
      let rows = res.data?.data || [];
      
      // Map to BIS PHP table structure: S no, Date of Receipt, LRN/BRN, Sample Code, Branch Office, Letter Ref No & date, Billed to, Nature Of Sample, Indian Stanard, Approx Recieved Quantity, Department, Tests, Reporting Date
      rows = rows.map((row) => ({
        sno: row[0] || "",
        date_of_receipt: row[1] || "",
        lrn_brn: row[2] || "",
        sample_code: row[3] || "",
        branch_office: row[4] || "",
        letter_ref: row[5] || "",
        billed_to: row[6] || "",
        nature_of_sample: row[7] || "",
        indian_standard: row[8] || "",
        approx_quantity: row[9] || "",
        department: row[10] || "",
        tests: row[11] || "",
        reporting_date: row[12] || "",
      }));
      
      setTableData(rows);
    } catch (err) {
      console.error("Error fetching sample inward data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e?.preventDefault?.();
    fetchSampleInwardData();
  };

  const [tableSettings, setTableSettings] = useState({
    enableFullScreen: false,
    enableRowDense: false,
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([{ id: "sno", desc: true }]); // PHP: order: [[0, "desc"]]

  const [columnVisibility, setColumnVisibility] = useLocalStorage(
    "column-visibility-sample-inward-register-1",
    {},
  );
  const [columnPinning, setColumnPinning] = useLocalStorage(
    "column-pinning-sample-inward-register-1",
    {},
  );

  const [autoResetPageIndex] = useSkipper();

  // Define columns matching BIS PHP table structure exactly
  const sampleInwardColumns = [
    {
      id: "sno",
      header: "S no",
      cell: (info) => info.getValue(),
    },
    {
      id: "date_of_receipt",
      header: "Date of Receipt",
      cell: (info) => info.getValue(),
    },
    {
      id: "lrn_brn",
      header: "LRN/BRN",
      cell: (info) => info.getValue(),
    },
    {
      id: "sample_code",
      header: "Sample Code",
      cell: (info) => info.getValue(),
    },
    {
      id: "branch_office",
      header: "Branch Office",
      cell: (info) => info.getValue(),
    },
    {
      id: "letter_ref",
      header: "Letter Ref No & date",
      cell: (info) => info.getValue(),
    },
    {
      id: "billed_to",
      header: "Billed to",
      cell: (info) => info.getValue(),
    },
    {
      id: "nature_of_sample",
      header: "Nature Of Sample",
      cell: (info) => info.getValue(),
    },
    {
      id: "indian_standard",
      header: "Indian Stanard",
      cell: (info) => info.getValue(),
    },
    {
      id: "approx_quantity",
      header: "Approx Recieved Quantity",
      cell: (info) => info.getValue(),
    },
    {
      id: "department",
      header: "Department",
      cell: (info) => info.getValue(),
    },
    {
      id: "tests",
      header: "Tests",
      cell: (info) => info.getValue(),
    },
    {
      id: "reporting_date",
      header: "Reporting Date",
      cell: (info) => info.getValue(),
    },
  ];

  const table = useReactTable({
    data: tableData,
    columns: sampleInwardColumns,
    state: {
      globalFilter,
      sorting,
      columnVisibility,
      columnPinning,
      tableSettings,
    },
    meta: { setTableSettings },
    filterFns: { fuzzy: fuzzyFilter },
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

  if (loading) {
    return (
      <Page title="Sample Inward Register">
        <PageSpinner />
      </Page>
    );
  }

  return (
    <Page title="Sample Inward Register">
      <div className="transition-content w-full pb-5">
        <div
          className={clsx(
            "flex h-full w-full flex-col",
            tableSettings.enableFullScreen && "fixed inset-0 z-61 bg-white pt-3 dark:bg-dark-900"
          )}
        >
          <Toolbar
            filters={filters}
            onChange={handleFilterChange}
            onSearch={handleSearch}
            departments={departments}
            products={products}
            specificPurposes={specificPurposes}
          />
          <div
            className={clsx(
              "transition-content flex grow flex-col pt-3",
              tableSettings.enableFullScreen ? "overflow-hidden" : "px-(--margin-x)"
            )}
          >
            <Card className={clsx("relative flex grow flex-col", tableSettings.enableFullScreen && "overflow-hidden")}>
              <div className="table-wrapper min-w-full grow overflow-x-auto">
                <Table hoverable dense={tableSettings.enableRowDense} sticky={tableSettings.enableFullScreen} className="w-full text-left rtl:text-right text-xs">
                  <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <Tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <Th
                            key={header.id}
                            className={clsx(
                              "bg-gray-200 font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100 first:ltr:rounded-tl-lg last:ltr:rounded-tr-lg first:rtl:rounded-tr-lg last:rtl:rounded-tl-lg whitespace-nowrap",
                              header.column.getCanPin() && [
                                header.column.getIsPinned() === "left" && "sticky z-2 ltr:left-0 rtl:right-0",
                                header.column.getIsPinned() === "right" && "sticky z-2 ltr:right-0 rtl:left-0",
                              ]
                            )}
                          >
                            {header.column.getCanSort() ? (
                              <div className="flex cursor-pointer select-none items-center space-x-3" onClick={header.column.getToggleSortingHandler()}>
                                <span className="flex-1">{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</span>
                                <TableSortIcon sorted={header.column.getIsSorted()} />
                              </div>
                            ) : header.isPlaceholder ? null : (
                              flexRender(header.column.columnDef.header, header.getContext())
                            )}
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
                          "relative border-y border-transparent border-b-gray-200 dark:border-b-dark-500",
                          row.getIsSelected() && !isSafari && "row-selected after:pointer-events-none after:absolute after:inset-0 after:z-2 after:h-full after:w-full after:border-3 after:border-transparent after:bg-primary-500/10 ltr:after:border-l-primary-500 rtl:after:border-r-primary-500"
                        )}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <Td
                            key={cell.id}
                            className={clsx(
                              "relative bg-white whitespace-nowrap",
                              cardSkin === "shadow" ? "dark:bg-dark-700" : "dark:bg-dark-900",
                              cell.column.getCanPin() && [
                                cell.column.getIsPinned() === "left" && "sticky z-2 ltr:left-0 rtl:right-0",
                                cell.column.getIsPinned() === "right" && "sticky z-2 ltr:right-0 rtl:left-0",
                              ]
                            )}
                          >
                            {cell.column.getIsPinned() && (
                              <div
                                className={clsx(
                                  "pointer-events-none absolute inset-0 border-gray-200 dark:border-dark-500",
                                  cell.column.getIsPinned() === "left" ? "ltr:border-r rtl:border-l" : "ltr:border-l rtl:border-r"
                                )}
                              ></div>
                            )}
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </Td>
                        ))}
                      </Tr>
                    ))}
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
                          Use the filters above and click Search to view the Testing Track Report.
                        </Td>
                      </Tr>
                    )}
                  </TBody>
                </Table>
              </div>
              {table.getCoreRowModel().rows.length > 0 && (
                <div
                  className={clsx(
                    "px-4 pb-4 sm:px-5 sm:pt-4",
                    tableSettings.enableFullScreen && "bg-gray-50 dark:bg-dark-800",
                    !(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()) && "pt-4"
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
