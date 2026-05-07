// Import Dependencies
import { useState } from "react";
import Select from "react-select";
import { DatePicker } from "components/shared/form/Datepicker";

export function Toolbar({ filters, onChange, onSearch, departments = [], products = [], specificPurposes = [] }) {
  const [startDate, setStartDate] = useState(filters.startdate || "");
  const [endDate, setEndDate] = useState(filters.enddate || "");
  const [department, setDepartment] = useState(filters.department || "");
  const [product, setProduct] = useState(filters.product || "");
  const [contactPerson, setContactPerson] = useState(filters.contactperson || "");
  const [specificPurpose, setSpecificPurpose] = useState(filters.specificpurpose || "");

  const handleInput = (name, value) => {
    if (name === "startdate") setStartDate(value);
    if (name === "enddate") setEndDate(value);
    if (name === "department") setDepartment(value);
    if (name === "product") setProduct(value);
    if (name === "contactperson") setContactPerson(value);
    if (name === "specificpurpose") setSpecificPurpose(value);
    onChange(name, value);
  };

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "40px",
      borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.3)" : "none",
      "&:hover": {
        borderColor: state.isFocused ? "#3b82f6" : "#9ca3af",
      },
    }),
  };

  
  return (
    <div className="px-(--margin-x) pt-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-wide text-gray-800 dark:text-dark-50">
          BIS Sample Inward Register
        </h2>
      </div>

      {/* Form matching PHP structure */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSearch();
        }}
        className="space-y-4"
      >
        {/* First row: Product, Contact Person, Start Date, End Date */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <label className="dark:text-dark-300 mb-1 block text-sm font-medium text-gray-600">
              Select Product
            </label>
            <Select
              options={products.map((p) => ({ value: p.id, label: p.name }))}
              value={product ? products.find((p) => p.id === product) : null}
              onChange={(opt) => handleInput("product", opt ? opt.value : "")}
              isClearable
              isSearchable
              placeholder="Select Product"
              styles={selectStyles}
            />
          </div>
          <div>
            <label className="dark:text-dark-300 mb-1 block text-sm font-medium text-gray-600">
              Contact person Name
            </label>
            <input
              type="text"
              value={contactPerson}
              onChange={(e) => handleInput("contactperson", e.target.value)}
              placeholder="Contact person Name"
              className="h-10 w-full rounded border border-gray-300 px-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:border-dark-500 dark:bg-dark-800"
            />
          </div>
          <div>
            <label className="dark:text-dark-300 mb-1 block text-sm font-medium text-gray-600">
              Start Date
            </label>
            <DatePicker
              options={{ dateFormat: "Y-m-d", allowInput: true }}
              value={startDate}
              onChange={(_dates, str) => handleInput("startdate", str)}
              placeholder="Start Date"
              className="h-10 w-full rounded border border-gray-300 px-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:border-dark-500 dark:bg-dark-800"
            />
          </div>
          <div>
            <label className="dark:text-dark-300 mb-1 block text-sm font-medium text-gray-600">
              End Date
            </label>
            <DatePicker
              options={{ dateFormat: "Y-m-d", allowInput: true }}
              value={endDate}
              onChange={(_dates, str) => handleInput("enddate", str)}
              placeholder="End Date"
              className="h-10 w-full rounded border border-gray-300 px-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:border-dark-500 dark:bg-dark-800"
            />
          </div>
        </div>

        {/* Second row: Department, Specific Purpose, Buttons */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <label className="dark:text-dark-300 mb-1 block text-sm font-medium text-gray-600">
              Select Department
            </label>
            <Select
              options={departments.map((d) => ({ value: d.id, label: d.name }))}
              value={department ? departments.find((d) => d.id === department) : null}
              onChange={(opt) => handleInput("department", opt ? opt.value : "")}
              isClearable
              isSearchable
              placeholder="Select Department"
              styles={selectStyles}
            />
          </div>
          <div>
            <label className="dark:text-dark-300 mb-1 block text-sm font-medium text-gray-600">
              Select Specific Purpose
            </label>
            <Select
              options={specificPurposes.map((s) => ({ value: s.id, label: s.name }))}
              value={specificPurpose ? specificPurposes.find((s) => s.id === specificPurpose) : null}
              onChange={(opt) => handleInput("specificpurpose", opt ? opt.value : "")}
              isClearable
              isSearchable
              placeholder="Select Specific Purpose"
              styles={selectStyles}
            />
          </div>
          <div className="flex gap-2 mt-6">
            <button
              type="submit"
              className="h-9 rounded bg-blue-600 px-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => window.open("/registers/exportbisregister", "_blank")}
              className="h-9 rounded bg-blue-600 px-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Export
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
