import React from "react";
import Select from "react-select";
import { TrashIcon } from "@heroicons/react/24/outline";

function UncertaintyTable({
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
    <React.Fragment>
      <div className="overflow-hidden rounded-lg bg-white shadow-md">
        {/* <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Edit Uncertainty Setting</h1>
        </div> */}
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1300px] table-fixed border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="w-12 border-b px-2 py-3 text-left text-sm font-semibold text-gray-700">
                      S.No
                    </th>
                    <th className="w-16 border-b px-2 py-3 text-left text-sm font-semibold text-gray-700">
                      Check
                    </th>
                    <th className="w-[250px] border-b px-3 py-3 text-left text-sm font-semibold text-gray-700">
                      Fieldname
                    </th>
                    <th className="w-[160px] border-b px-3 py-3 text-left text-sm font-semibold text-gray-700">
                      Set Variable
                    </th>
                    <th className="w-[180px] border-b px-3 py-3 text-left text-sm font-semibold text-gray-700">
                      Field Heading
                    </th>
                    <th className="w-[100px] border-b px-3 py-3 text-left text-sm font-semibold text-gray-700">
                      Position
                    </th>
                    {/* 👇 Make formula column wider */}
                    <th className="w-[400px] border-b px-3 py-3 text-left text-sm font-semibold text-gray-700">
                      Formula
                    </th>
                    <th className="w-[80px] border-b px-2 py-3 text-left text-sm font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={row.id} className="border-b hover:bg-gray-50">
                      <td className="w-12 px-2 py-3 text-center text-sm">
                        {index + 1}
                      </td>
                      <td className="w-16 px-2 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={row.checked}
                          onChange={() => handleCheckbox(row.id)}
                          className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                        />
                      </td>

                      {/* Fieldname column */}
                      <td className="w-[250px] px-3 py-3">
                        <div className="space-y-2">
                          <Select
                            value={row.selectedTable}
                            onChange={(selectedOption) =>
                              handleTableSelection(row.id, selectedOption)
                            }
                            options={tableList}
                            placeholder="Select table..."
                            isClearable
                            styles={customSelectStyles}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                          />
                          {row.selectedTable && (
                            <Select
                              value={row.fieldname}
                              onChange={(selectedOption) =>
                                handleFieldnameChange(row.id, selectedOption)
                              }
                              options={row.fieldnameOptions || []}
                              placeholder="Select fieldname..."
                              isClearable
                              styles={customSelectStyles}
                              menuPortalTarget={document.body}
                              menuPosition="fixed"
                            />
                          )}
                        </div>
                      </td>

                      <td className="w-[160px] px-3 py-3">
                        <input
                          type="text"
                          value={row.setVariable || ""}
                          onChange={(e) =>
                            handleInputChange(
                              row.id,
                              "setVariable",
                              e.target.value,
                            )
                          }
                          className="w-full rounded-md border px-2 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder="$variable"
                        />
                      </td>

                      <td className="w-[180px] px-3 py-3">
                        <input
                          type="text"
                          value={row.fieldHeading}
                          onChange={(e) =>
                            handleInputChange(
                              row.id,
                              "fieldHeading",
                              e.target.value,
                            )
                          }
                          className="w-full rounded-md border px-2 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder="Heading"
                        />
                      </td>

                      <td className="w-[100px] px-3 py-3">
                        <input
                          type="number"
                          value={row.fieldPosition}
                          onChange={(e) =>
                            handleInputChange(
                              row.id,
                              "fieldPosition",
                              e.target.value,
                            )
                          }
                          className="w-full rounded-md border px-2 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder="Position"
                        />
                      </td>

                      {/* ✅ Wider formula cell */}
                      <td className="w-[450px] px-3 py-3 align-top">
                        <textarea
                          value={row.formula}
                          onChange={(e) =>
                            handleInputChange(row.id, "formula", e.target.value)
                          }
                          rows="4" /* 👈 height increased from 2 to 4 */
                          className="h-[120px] w-full resize-none rounded-md border px-2 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder="Formula"
                        />
                      </td>

                      <td className="w-[80px] px-2 py-3 text-center">
                        <button
                          onClick={() => removeRow(row.id)}
                          disabled={rows.length === 1}
                          className="rounded-md bg-red-600 px-3 py-1 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <TrashIcon className="size-4.5 stroke-1" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end border-t p-4">
              <button
                style={{ cursor: "pointer" }}
                onClick={addRow}
                className="rounded-md bg-green-600 px-6 py-2 font-medium text-white transition hover:bg-green-700"
              >
                Add Row
              </button>
            </div>
          </>
        )}
      </div>
    </React.Fragment>
  );
}

export default UncertaintyTable;
