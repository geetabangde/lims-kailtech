import { useState, useEffect } from "react";
import axios from "utils/axios";
// import { useParams } from "react-router-dom";
import Select from "react-select";
import { TrashIcon } from "@heroicons/react/24/outline";
import { EyeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import { Button } from "components/ui/button";

export default function AddCalibration({ instid, instrumentId, formatId, onNext, onBack }) {
  // const { id: formatId } = useParams();
  const [rows1, setRows1] = useState([]);
  const [rows2, setRows2] = useState([]);
  const [rows3, setRows3] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [labToCalibrateOptions, setLabToCalibrateOptions] = useState([]);
  const [fieldnameOptions, setFieldnameOptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const data = [
    { type: "Operator", symbol: "+", name: "Addition", example: "$a + $b" },
    { type: "Operator", symbol: "-", name: "Subtraction", example: "$a - $b" },
    {
      type: "Operator",
      symbol: "*",
      name: "Multiplication",
      example: "$a * $b",
    },
    { type: "Operator", symbol: "/", name: "Division", example: "$a / $b" },
    { type: "Operator", symbol: "%", name: "Modulus", example: "$a % $b" },
    {
      type: "Function",
      symbol: "abs($x)",
      name: "Absolute Value",
      example: "abs(-5) → 5",
    },
    {
      type: "Function",
      symbol: "pow($x, $y)",
      name: "Power",
      example: "pow(2, 3) → 8",
    },
    {
      type: "Function",
      symbol: "sqrt($x)",
      name: "Square Root",
      example: "sqrt(16) → 4",
    },
    {
      type: "Function",
      symbol: "min($a, $b, ...)",
      name: "Minimum Value",
      example: "min(2, 5, 3) → 2",
    },
    {
      type: "Function",
      symbol: "max($a, $b, ...)",
      name: "Maximum Value",
      example: "max(2, 5, 3) → 5",
    },
    {
      type: "Example",
      symbol: "($a + $b) / 2",
      name: "Average Formula",
      example: "Average of A and B",
    },
    {
      type: "Example",
      symbol: "sqrt($a * $b)",
      name: "Geometric Mean",
      example: "Square root of A×B",
    },
    {
      type: "Example",
      symbol: "abs($a - $b)",
      name: "Absolute Difference",
      example: "Difference without sign",
    },
  ];

  const removeRow1 = (id) => {
    if (rows1.length === 1) {
      alert("At least one row is required!");
      return;
    }
    setRows1((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  const removeRow2 = (id) => {
    if (rows2.length === 1) {
      alert("At least one row is required!");
      return;
    }
    setRows2((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  const setpointOptions = [
    { value: "uuc", label: "uuc" },
    { value: "master", label: "master" },
    { value: "separate", label: "separate" },
  ];

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "42px",
      borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.5)" : "none",
      "&:hover": {
        borderColor: "#3b82f6",
      },
    }),
    menu: (base) => ({
      ...base,
      zIndex: 50,
    }),
  };
  

  // useEffect(() => {
  //   console.log("Edit component received formatId:", formatId);
  //   if (formatId) {
  //     fetchObservationSettings(formatId);
  //   } else {
  //     console.error("No formatId provided to Edit component");
  //   }
  //   fetchLabOptions();
  //   fetchFieldnameOptions();
  // }, [formatId]);

  useEffect(() => {
  console.log("Edit component received formatId:", formatId);
  console.log("Edit component received instrumentId:", instrumentId);
  
  if (instrumentId) {  // ✅ Check instrumentId instead of formatId
    fetchObservationSettings(instrumentId);  // ✅ Pass instrumentId
  } else {
    console.error("No instrumentId provided to Edit component");
  }
  fetchLabOptions();
  fetchFieldnameOptions();
}, [instrumentId]);  // ✅ Add instrumentId to dependency array

  const fetchLabOptions = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get("/master/list-lab", {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.status === "true" && response.data.data) {
        const labOptions = response.data.data.map((lab) => ({
          value: lab.id,
          label: lab.name,
        }));
        setLabToCalibrateOptions(labOptions);
      }
    } catch (error) {
      console.error("Error fetching lab options:", error);
    }
  };

  const fetchFieldnameOptions = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(
        "/observationsetting/get-all-summary-type",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success && Array.isArray(response.data.new_summary)) {
        const options = response.data.new_summary.map((fieldname) => ({
          value: fieldname,
          label: fieldname,
        }));
        setFieldnameOptions(options);
      } else {
        console.warn("No new_summary found:", response.data);
        setFieldnameOptions([]);
      }
    } catch (error) {
      console.error("Error fetching fieldname options:", error);
      setFieldnameOptions([]);
    }
  };

  const fetchObservationSettings = async (fid) => {
    if (!fid) return;

    setLoading(true);
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(
        `/observationsetting/get-observation-setting/${instrumentId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        const data = response.data.data;

        const table1Data = data.resultsetting.calibration_settings.map(
          (item, index) => ({
            id: index + 1,
            checked: item.checkbox === "yes",
            fieldname: item.fieldname
              ? { value: item.fieldname, label: item.fieldname }
              : null,
            fieldHeading: item.field_heading,
            SetVariable: item.SetVariable,
            formula: item.formula,
            fieldPosition: item.field_position.toString(),
          }),
        );

        const table2Data = data.observationsetting.observation_settings.map(
          (item, index) => ({
            id: index + 1,
            checked: item.checkbox === "yes",
            fieldname: item.fieldname,
            setvariable: item.setvariable,
            formula: item.formula,
            fieldHeading: item.field_heading,
          }),
        );

        const setpointValue = data.setpoint
          ? setpointOptions.find(
              (opt) => opt.value.toLowerCase() === data.setpoint.toLowerCase(),
            )
          : null;
        const labValue = data.allottolab
          ? labToCalibrateOptions.find((opt) => opt.value === data.allottolab)
          : null;

        const table3Data = {
          id: 1,
          checked: true,
          setpoint: setpointValue,
          masterRepeatable: data.master?.toString() || "",
          uucRepeatable: data.uuc?.toString() || "",
          labToCalibrate: labValue,
        };

        setRows1(table1Data.length > 0 ? table1Data : [createEmptyRow1(1)]);
        setRows2(table2Data.length > 0 ? table2Data : [createEmptyRow2(1)]);
        setRows3([table3Data]);
      } else {
        setRows1([createEmptyRow1(1)]);
        setRows2([createEmptyRow2(1)]);
        setRows3([createEmptyRow3(1)]);
      }
    } catch (error) {
      console.error("Error fetching observation settings:", error);
      setRows1([createEmptyRow1(1)]);
      setRows2([createEmptyRow2(1)]);
      setRows3([createEmptyRow3(1)]);
    } finally {
      setLoading(false);
    }
  };

  const createEmptyRow1 = (id) => ({
    id,
    checked: true,
    fieldname: null,
    fieldHeading: "",
    fieldPosition: "",
  });

  const createEmptyRow2 = (id) => ({
    id,
    checked: true,
    fieldname: "",
    fieldHeading: "",
  });

  const createEmptyRow3 = (id) => ({
    id,
    checked: true,
    setpoint: null,
    masterRepeatable: "",
    uucRepeatable: "",
    labToCalibrate: null,
  });

  const handleCheckbox1 = (id) => {
    setRows1(
      rows1.map((row) =>
        row.id === id ? { ...row, checked: !row.checked } : row,
      ),
    );
  };

  const handleInputChange1 = (id, field, value) => {
    setRows1(
      rows1.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  };

  const handleSelectChange1 = (id, field, selectedOption) => {
    setRows1(
      rows1.map((row) =>
        row.id === id ? { ...row, [field]: selectedOption } : row,
      ),
    );
  };

  const addRow1 = () => {
    const newId =
      rows1.length > 0 ? Math.max(...rows1.map((r) => r.id)) + 1 : 1;
    setRows1([...rows1, createEmptyRow1(newId)]);
  };

  const handleCheckbox2 = (id) => {
    setRows2(
      rows2.map((row) =>
        row.id === id ? { ...row, checked: !row.checked } : row,
      ),
    );
  };

  const handleInputChange2 = (id, field, value) => {
    setRows2(
      rows2.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  };

  const addRow2 = () => {
    const newId =
      rows2.length > 0 ? Math.max(...rows2.map((r) => r.id)) + 1 : 1;
    setRows2([...rows2, createEmptyRow2(newId)]);
  };

  const handleInputChange3 = (id, field, value) => {
    setRows3(
      rows3.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  };

  const handleSelectChange3 = (id, field, selectedOption) => {
    setRows3(
      rows3.map((row) =>
        row.id === id ? { ...row, [field]: selectedOption } : row,
      ),
    );
  };

  const handleSave = async () => {
    toast.success("Calibration settings saved!");
    onNext(); // Move to step 3
    if (!formatId) {
      alert("Format ID is missing!");
      return;
    }

    setLoading(true);
    try {
      const authToken = localStorage.getItem("authToken");

      const calibration_settings = rows1
        .filter((row) => row.fieldname && row.fieldname.value)
        .map((row) => ({
          fieldname: row.fieldname.value,
          SetVariable: row.SetVariable,
          formula: row.formula,
          field_heading: row.fieldHeading,
          field_position: parseInt(row.fieldPosition) || 0,
          checkbox: row.checked ? "yes" : "no",
        }));

      const observation_settings = rows2
        .filter((row) => row.fieldname.trim() !== "")
        .map((row) => ({
          fieldname: row.fieldname,
          setvariable: row.setvariable,
          formula: row.formula,
          field_heading: row.fieldHeading,
          checkbox: row.checked ? "yes" : "no",
        }));

      const payload = {
        instrument_id: instrumentId,
        instid: instid,
        observation_id: parseInt(formatId),
        setpoint: rows3[0]?.setpoint?.value || "",
        uuc: rows3[0]?.uucRepeatable || "",
        master: rows3[0]?.masterRepeatable || "",
        allottolab: rows3[0]?.labToCalibrate?.value || "",
        resultsetting: {
          calibration_settings: calibration_settings,
          observation_settings: observation_settings,
        },
      };
      console.log("Payload:", payload);

      const response = await axios.post(
        "/observationsetting/update-observation-setting",
        payload,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        setSuccessMessage("Data saved successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
        fetchObservationSettings(formatId);
      } else {
        alert("Failed to save data. Please try again.");
      }
    } catch (error) {
      console.error("Error saving observation settings:", error);
      alert(
        `Error: ${error.response?.data?.message || error.message || "Failed to save data"}`,
      );
    } finally {
      setLoading(false);
    }
  };

  if (!formatId) {
    return <div className="p-6 text-red-600">Invalid format ID.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="overflow-hidden rounded-lg bg-white shadow-md">
          <div className="flex items-center justify-start gap-4 p-4">
            {/* <button
              style={{ cursor: "pointer" }}
              onClick={() => window.history.back()}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Back
            </button> */}
            {/* Title + View Icon */}
            <h1 className="flex items-center gap-3 text-2xl font-bold text-gray-800">
              Calibration Results Settings
              <EyeIcon
                className="h-6 w-6 cursor-pointer text-blue-600 transition hover:text-blue-800"
                onClick={() => setIsModalOpen(true)}
              />
            </h1>
          </div>
          {/* Modal Section */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="relative max-h-[85vh] w-[900px] overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
                {/* Close Button */}
                <button
                  style={{ cursor: "pointer" }}
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>

                <h2 className="mb-4 border-b pb-3 text-center text-xl font-bold text-gray-800">
                  🧮 Formula Reference Table
                </h2>

                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-3 py-2 text-left">Type</th>
                      <th className="border px-3 py-2 text-left">
                        Symbol / Function
                      </th>
                      <th className="border px-3 py-2 text-left">
                        Description
                      </th>
                      <th className="border px-3 py-2 text-left">Example</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border px-3 py-2">{item.type}</td>
                        <td className="border px-3 py-2 font-mono text-blue-700">
                          {item.symbol}
                        </td>
                        <td className="border px-3 py-2">{item.name}</td>
                        <td className="border px-3 py-2 text-gray-600">
                          {item.example}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : (
            <div className="p-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Setpoint Dropdown */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Setpoint
                  </label>
                  <Select
                    value={rows3[0]?.setpoint}
                    onChange={(selectedOption) =>
                      handleSelectChange3(
                        rows3[0]?.id,
                        "setpoint",
                        selectedOption,
                      )
                    }
                    options={setpointOptions}
                    placeholder="Select..."
                    isClearable
                    styles={customSelectStyles}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                  />
                </div>

                {/* Master Repeatable Field */}
                {(rows3[0]?.setpoint?.value === "master" ||
                  rows3[0]?.setpoint?.value === "separate") && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Master Repeatable
                    </label>
                    <input
                      type="text"
                      value={rows3[0]?.masterRepeatable || ""}
                      onChange={(e) =>
                        handleInputChange3(
                          rows3[0]?.id,
                          "masterRepeatable",
                          e.target.value,
                        )
                      }
                      className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="Master Repeatable"
                    />
                  </div>
                )}

                {/* UUC Repeatable Field */}
                {(rows3[0]?.setpoint?.value === "uuc" ||
                  rows3[0]?.setpoint?.value === "separate") && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      UUC Repeatable
                    </label>
                    <input
                      type="text"
                      value={rows3[0]?.uucRepeatable || ""}
                      onChange={(e) =>
                        handleInputChange3(
                          rows3[0]?.id,
                          "uucRepeatable",
                          e.target.value,
                        )
                      }
                      className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="UUC Repeatable"
                    />
                  </div>
                )}

                {/* Lab to Calibrate */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Lab to Calibrate
                  </label>
                  <Select
                    value={rows3[0]?.labToCalibrate}
                    onChange={(selectedOption) =>
                      handleSelectChange3(
                        rows3[0]?.id,
                        "labToCalibrate",
                        selectedOption,
                      )
                    }
                    options={labToCalibrateOptions}
                    placeholder="Select Lab..."
                    isClearable
                    styles={customSelectStyles}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow-md">
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-xl font-bold text-gray-800">
              Calibration Settings
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        S. No.
                      </th>
                      <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Checkbox
                      </th>
                      <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Fieldname
                      </th>
                      <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Set Variable
                      </th>
                      <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Field Heading
                      </th>
                      <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Field Position
                      </th>
                      <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Formula
                      </th>
                      <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows1.map((row) => (
                      <tr key={row.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{row.id}</td>
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={row.checked}
                            onChange={() => handleCheckbox1(row.id)}
                            className="h-4 w-4 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Select
                            value={row.fieldname}
                            onChange={(selectedOption) =>
                              handleSelectChange1(
                                row.id,
                                "fieldname",
                                selectedOption,
                              )
                            }
                            options={fieldnameOptions}
                            placeholder="Select..."
                            isClearable
                            styles={customSelectStyles}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                          />
                        </td>
                        {/* Set Variable */}
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={row.SetVariable}
                            onChange={(e) =>
                              handleInputChange1(
                                row.id,
                                "SetVariable",
                                e.target.value,
                              )
                            }
                            className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Set Variable"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={row.fieldHeading}
                            onChange={(e) =>
                              handleInputChange1(
                                row.id,
                                "fieldHeading",
                                e.target.value,
                              )
                            }
                            className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Field Heading"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={row.fieldPosition}
                            onChange={(e) =>
                              handleInputChange1(
                                row.id,
                                "fieldPosition",
                                e.target.value,
                              )
                            }
                            className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Position"
                          />
                        </td>
                        {/* Formula */}
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={row.formula}
                            onChange={(e) =>
                              handleInputChange1(
                                row.id,
                                "formula",
                                e.target.value,
                              )
                            }
                            className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Formula"
                          />
                        </td>
                        <td className="w-[80px] px-2 py-3 text-center">
                          <button
                            style={{ cursor: "pointer" }}
                            onClick={() => removeRow1(row.id)}
                            disabled={rows1.length === 1}
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
                  onClick={addRow1}
                  className="rounded-md bg-green-600 px-6 py-2 font-medium text-white transition hover:bg-green-700"
                >
                  Add Row
                </button>
              </div>
            </>
          )}
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow-md">
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-xl font-bold text-gray-800">
              Observation Setting
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        S. No.
                      </th>
                      <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Checkbox
                      </th>
                      <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Observation Setting
                      </th>
                      {/* Set Variable */}
                      <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Set Variable
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Field Heading</th>

                      <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows2.map((row) => (
                      <tr key={row.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{row.id}</td>
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={row.checked}
                            onChange={() => handleCheckbox2(row.id)}
                            className="h-4 w-4 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={row.fieldname}
                            onChange={(e) =>
                              handleInputChange2(
                                row.id,
                                "fieldname",
                                e.target.value,
                              )
                            }
                            className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Observation Setting Name"
                          />
                        </td>
                        {/* Set Variable */}
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={row.setvariable}
                            onChange={(e) =>
                              handleInputChange2(
                                row.id,
                                "setvariable",
                                e.target.value,
                              )
                            }
                            className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Set Variable"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={row.fieldHeading}
                            onChange={(e) => handleInputChange2(row.id, 'fieldHeading', e.target.value)}
                            className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="w-[80px] px-2 py-3 text-center">
                          <button
                            onClick={() => removeRow2(row.id)}
                            style={{ cursor: "pointer" }}
                            disabled={rows2.length === 1}
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
                  onClick={addRow2}
                  className="rounded-md bg-green-600 px-6 py-2 font-medium text-white transition hover:bg-green-700"
                >
                  Add Row
                </button>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
         <Button onClick={onBack} variant="outline" className="mt-2 mb-2 rounded-md bg-blue-600 px-8 py-3 text-lg font-medium text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">← Back</Button>
          <button
            style={{ cursor: "pointer" }}
            onClick={handleSave}
            disabled={loading}
            className="rounded-md bg-blue-600 px-8 py-3 text-lg font-medium text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save & Next →
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
          <div className="animate-bounce rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-2xl">
            {successMessage}
          </div>
        </div>
      )}
    </div>
  );
}
