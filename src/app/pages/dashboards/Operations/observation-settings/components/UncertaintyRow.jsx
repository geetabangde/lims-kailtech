import Select from "react-select";

export default function UncertaintyRow({
  row,
  fieldnameOptions,
  customSelectStyles,
  handleCheckbox,
  handleInputChange,
  handleSelectChange,
  removeRow,
  totalRows
}) {
  return (
    <tr>
      <td className="px-4 py-3 text-sm">{row.id}</td>

      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={row.checked}
          onChange={() => handleCheckbox(row.id)}
          className="w-4 h-4 text-blue-600 rounded"
        />
      </td>

      <td className="px-4 py-3">
        <Select
          value={row.fieldname}
          onChange={(value) => handleSelectChange(row.id, "fieldname", value)}
          options={fieldnameOptions}
          isClearable
          placeholder="Select…"
          styles={customSelectStyles}
        />
      </td>

      <td className="px-4 py-3">
        <input
          type="text"
          value={row.fieldfrom || ""}
          onChange={(e) => handleInputChange(row.id, "fieldfrom", e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm"
        />
      </td>

      <td className="px-4 py-3">
        <input
          type="text"
          value={row.setVariable || ""}
          onChange={(e) => handleInputChange(row.id, "setVariable", e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm"
        />
      </td>

      <td className="px-4 py-3">
        <input
          type="text"
          value={row.fieldHeading}
          onChange={(e) => handleInputChange(row.id, "fieldHeading", e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm"
        />
      </td>

      <td className="px-4 py-3 w-80">
        <input
          type="text"
          value={row.formula}
          onChange={(e) => handleInputChange(row.id, "formula", e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm"
        />
      </td>

      <td className="px-4 py-3">
        <input
          type="text"
          value={row.fieldPosition}
          onChange={(e) => handleInputChange(row.id, "fieldPosition", e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm"
        />
      </td>

      <td className="px-4 py-3">
        <button
          onClick={() => removeRow(row.id)}
          disabled={totalRows === 1}
          className="px-3 py-1 bg-red-600 text-white rounded-md disabled:opacity-50"
        >
          Remove
        </button>
      </td>
    </tr>
  );
}
