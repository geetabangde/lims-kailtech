import Select from "react-select";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function CertificateTable({
  rows,
  tableList,
  customSelectStyles,
  handleCheckbox,
  handleInputChange,
  handleTableSelection,
  handleFieldnameChange,
  addRow,
  removeRow,
  loading,
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full border-collapse border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2 text-left">
              S.No
            </th>
            <th className="border px-3 py-2 text-left">
              Check
            </th>
            <th className="border px-3 py-2 text-left">
              Fieldname
            </th>
            <th className="border px-3 py-2 text-left">
              Set Variable
            </th>
            <th className="border px-3 py-2 text-left">
              Field Heading
            </th>
            <th className="border px-3 py-2 text-left">
              Position
            </th>
            <th className="border-b border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="7" className="py-8 text-center text-gray-500">
                Loading...
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan="7" className="py-8 text-center text-gray-500">
                No rows available. Click &quot;Add Row&quot; to start.
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr
                key={row.id}
                className="transition hover:bg-gray-50"
              >
                <td className="border-b px-4 py-3 text-center font-medium text-gray-700">
                  {index + 1}
                </td>
                <td className="border-b px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={row.checked}
                    onChange={() => handleCheckbox(row.id)}
                    className="h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                
                <td className="border-b px-4 py-3">
                  <div className="space-y-2">
                    <Select
                      options={tableList}
                      value={row.selectedTable}
                      onChange={(selected) =>
                        handleTableSelection(row.id, selected)
                      }
                      placeholder="Select Table"
                      isClearable
                      styles={customSelectStyles}
                      className="w-full"
                    />
                    <Select
                      options={row.fieldnameOptions}
                      value={row.fieldname}
                      onChange={(selected) =>
                        handleFieldnameChange(row.id, selected)
                      }
                      placeholder="Select Field"
                      isClearable
                      isDisabled={!row.selectedTable}
                      styles={customSelectStyles}
                      className="w-full"
                    />
                  </div>
                </td>
                <td className="border-b px-4 py-3">
                  <input
                    type="text"
                    value={row.setVariable}
                    onChange={(e) =>
                      handleInputChange(row.id, "setVariable", e.target.value)
                    }
                    placeholder="e.g., $mode"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="border-b px-4 py-3">
                  <input
                    type="text"
                    value={row.fieldHeading}
                    onChange={(e) =>
                      handleInputChange(row.id, "fieldHeading", e.target.value)
                    }
                    placeholder="Field Heading"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="border-b px-4 py-3">
                  <input
                    type="number"
                    value={row.fieldPosition}
                    onChange={(e) =>
                      handleInputChange(
                        row.id,
                        "fieldPosition",
                        e.target.value
                      )
                    }
                    placeholder="Position"
                    min="0"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="border-b px-4 py-3 text-center">
                  <button
                    style={{cursor: "pointer"}}
                    onClick={() => removeRow(row.id)}
                    disabled={rows.length === 1}
                    className="inline-flex items-center gap-1 rounded-md bg-red-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <TrashIcon className="h-4 w-4" />
                    
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="flex justify-end border-t p-4">
        <button
         style={{cursor: "pointer"}}
          onClick={addRow}
          className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
        >
          <PlusIcon className="h-5 w-5" />
          Add Row
        </button>
      </div>
    </div>
  );
}