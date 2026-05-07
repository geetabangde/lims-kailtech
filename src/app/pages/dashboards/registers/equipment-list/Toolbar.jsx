// Import Dependencies
import { useState } from "react";
import Select from "react-select";

export function Toolbar({ filters, onChange, onSearch, onExport, categories, departments }) {
  const [category, setCategory] = useState(filters.category || "");
  const [selectedDepartments, setSelectedDepartments] = useState(filters.department || []);

  const handleInput = (name, value) => {
    if (name === "category") setCategory(value);
    if (name === "department") setSelectedDepartments(value);
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
          Equipment List Register
        </h2>
        <a href="/dashboards" className="btn btn-warning">
          &lt;&lt; Back
        </a>
      </div>

      {/* Form matching PHP structure */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSearch();
        }}
        className="row"
      >
        <div className="col-sm-4">
          <label className="dark:text-dark-300 mb-1 block text-sm font-medium text-gray-600">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => handleInput("category", e.target.value)}
            className="h-10 w-full rounded border border-gray-300 px-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:border-dark-500 dark:bg-dark-800"
          >
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-sm-4">
          <label className="dark:text-dark-300 mb-1 block text-sm font-medium text-gray-600">
            Department
          </label>
          <Select
            options={[
              { value: "", label: "Select Department" },
              ...(departments || []).map((dept) => ({
                value: dept.id,
                label: dept.name,
              })),
            ]}
            value={selectedDepartments.map((id) => ({
              value: String(id),
              label: (() => {
                const found = departments.find((dept) => String(dept.id) === String(id));
                return found ? found.name : String(id);
              })(),
            }))}
            onChange={(options) => handleInput("department", options ? options.map((opt) => opt.value) : [])}
            isMulti
            isClearable
            placeholder="Select Department"
            classNamePrefix="react-select"
            className="w-full text-sm"
            styles={selectStyles}
          />
        </div>
        <div className="col-sm-2">
          <button type="submit" className="btn btn-outline-primary">
            Search
          </button>
          <button type="button" onClick={onExport} className="btn btn-outline-primary">
            Export
          </button>
        </div>
      </form>
    </div>
  );
}
