// Import Dependencies
import Select from "react-select";

export function Toolbar({ filters, onChange, onSearch, customers }) {
  const handleInput = (name, value) => {
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
          Dispatch Register
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
        {/* First row matching PHP structure: Customer, Contact Person, LRN, BRN, Search and Export buttons */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <label className="dark:text-dark-300 mb-1 block text-sm font-medium text-gray-600">
              Select Customer
            </label>
            <Select
              options={[
                { value: "", label: "Select Customer" },
                ...(customers || []).map((customer) => ({
                  value: customer.id,
                  label: customer.name,
                })),
              ]}
              value={customers?.find((c) => c.id === filters.customer) || null}
              onChange={(opt) => handleInput("customer", opt ? opt.value : "")}
              isClearable
              placeholder="Select Customer"
              styles={selectStyles}
            />
          </div>
          <div>
            <label className="dark:text-dark-300 mb-1 block text-sm font-medium text-gray-600">
              Contact person Name
            </label>
            <input
              type="text"
              value={filters.contactperson || ""}
              onChange={(e) => handleInput("contactperson", e.target.value)}
              placeholder="Contact person Name"
              className="h-10 w-full rounded border border-gray-300 px-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:border-dark-500 dark:bg-dark-800"
            />
          </div>
          <div>
            <label className="dark:text-dark-300 mb-1 block text-sm font-medium text-gray-600">
              LRN
            </label>
            <input
              type="text"
              value={filters.lrn || ""}
              onChange={(e) => handleInput("lrn", e.target.value)}
              placeholder="LRN"
              className="h-10 w-full rounded border border-gray-300 px-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:border-dark-500 dark:bg-dark-800"
            />
          </div>
          <div>
            <label className="dark:text-dark-300 mb-1 block text-sm font-medium text-gray-600">
              BRN
            </label>
            <input
              type="text"
              value={filters.brn || ""}
              onChange={(e) => handleInput("brn", e.target.value)}
              placeholder="BRN"
              className="h-10 w-full rounded border border-gray-300 px-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:border-dark-500 dark:bg-dark-800"
            />
          </div>
          <div className="md:col-span-2 flex items-end gap-2">
            <button
              type="submit"
              className="h-10 rounded border border-primary-600 bg-white px-6 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => window.open('/registers/exportdicpatchregistertesting?' + new URLSearchParams(filters), '_blank')}
              className="h-10 rounded border border-primary-600 bg-white px-6 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50"
            >
              Export
            </button>
          </div>
        </div>

        {/* Second row matching PHP structure: Start Date, End Date */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <label className="dark:text-dark-300 mb-1 block text-sm font-medium text-gray-600">
              Start Date
            </label>
            <input
              type="text"
              readOnly
              className="form-control"
              placeholder="Start Date"
              data-bvalidator="required"
              onFocus="daterangemaxlimit('startdate', 'enddate', new Date())"
              id="startdate"
              name="startdate"
            />
          </div>
          <div>
            <label className="dark:text-dark-300 mb-1 block text-sm font-medium text-gray-600">
              End Date
            </label>
            <input
              type="text"
              readOnly
              className="form-control"
              placeholder="End Date"
              data-bvalidator="required"
              id="enddate"
              name="enddate"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
