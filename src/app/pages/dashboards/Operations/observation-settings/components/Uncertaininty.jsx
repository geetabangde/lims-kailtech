import React from 'react'
import Select from "react-select";

function Uncertaininty({
  rows,
  fieldnameOptions,
  customSelectStyles,
  handleCheckbox,
  handleInputChange,
  handleSelectChange,
  addRow,
  removeRow,
  loading
  
}) {
  return (
    <React.Fragment>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">Edit Uncertainity Setting</h1>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                        S. No.
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                        Checkbox
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                        Fieldname
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                        Field From
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                        Set Variable
                        </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                        Field Heading
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b w-80">
                        Formula
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                        Field Position
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{row.id}</td>
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={row.checked}
                            onChange={() => handleCheckbox(row.id)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Select
                            value={row.fieldname}
                            onChange={(selectedOption) =>
                              handleSelectChange(row.id, "fieldname", selectedOption)
                            }
                            options={fieldnameOptions}
                            placeholder="Select fieldname..."
                            isClearable
                            styles={customSelectStyles}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                          />
                        </td>
                        {/* fieldfrom */}
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={row.fieldfrom || ""}
                            onChange={(e) =>
                              handleInputChange(row.id, "fieldfrom", e.target.value)
                            }
                            className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="field from"
                          />
                        </td>
                        <td className="px-4 py-3">
                            <input
                                type="text"
                                value={row.setVariable || ""}
                                onChange={(e) =>
                                handleInputChange(row.id, "setVariable", e.target.value)
                                }
                                className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                                placeholder="set variable"
                            />
                            </td>

                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={row.fieldHeading}
                            onChange={(e) =>
                              handleInputChange(row.id, "fieldHeading", e.target.value)
                            }
                            className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="heading"
                          />
                        </td>

                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={row.fieldPosition}
                            onChange={(e) =>
                              handleInputChange(row.id, "fieldPosition", e.target.value)
                            }
                            className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="position"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={row.formula}
                            onChange={(e) =>
                              handleInputChange(row.id, "formula", e.target.value)
                            }
                            className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="formula"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => removeRow(row.id)}
                            disabled={rows.length === 1}
                            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border-t flex justify-end">
                <button
                  onClick={addRow}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium transition"
                >
                  Add Row
                </button>
              </div>
            </>
          )}
        </div>
    </React.Fragment>
  )
}

export default Uncertaininty
